"""
Athena Wire Service - TED/DOC Transfer Processing
Complete implementation with STR/COMPE integration architecture
"""
from fastapi import FastAPI, HTTPException, BackgroundTasks, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime, date, timedelta
from decimal import Decimal
import uuid
import os
import httpx
import re

from app.db import SessionLocal, ensure_schema
from app.models import (
    WireTransfer, FavoredRecipient, WireSchedule,
    WireHistory, Bank, WireFee, WireLimit
)
from app.banks_data import (
    BRAZILIAN_BANKS, TRANSFER_PURPOSE_CODES,
    DOC_MAX_AMOUNT, TED_START_TIME, TED_END_TIME
)
from app.integrations.str_client import STRClient, STRTransferRequest
from app.integrations.compe_client import COMPEClient, DOCRequest

# Initialize database
ensure_schema()

# Environment
ENV = os.getenv("ENV", "dev")
ACCOUNTS_URL = os.getenv("ACCOUNTS_URL", "http://accounts-service:8080")
AUDIT_URL = os.getenv("AUDIT_URL", "http://audit-service:8080")
COMPLIANCE_URL = os.getenv("COMPLIANCE_URL", "http://compliance-service:8080")

# Clients
str_client = STRClient()
compe_client = COMPEClient()

app = FastAPI(
    title="Athena Wire Service",
    description="TED/DOC Transfer Processing",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# ==================== Pydantic Models ====================

class DestinationAccount(BaseModel):
    """Destination account for wire transfer"""
    bank_code: str = Field(..., min_length=3, max_length=3)
    branch: str = Field(..., min_length=1, max_length=8)
    account: str = Field(..., min_length=1, max_length=20)
    account_type: str = Field(default="CC", pattern="^(CC|CP)$")
    document: str = Field(..., min_length=11, max_length=18)
    name: str = Field(..., min_length=2, max_length=256)

    @validator('document')
    def validate_document(cls, v):
        clean = re.sub(r'\D', '', v)
        if len(clean) not in [11, 14]:
            raise ValueError('Document must be CPF (11) or CNPJ (14)')
        return clean

    @validator('branch', 'account')
    def clean_numbers(cls, v):
        return re.sub(r'\D', '', v)


class TEDRequest(BaseModel):
    """TED transfer request"""
    account_id: str
    destination: DestinationAccount
    amount: float = Field(..., gt=0)
    purpose_code: Optional[str] = Field(default="00010", max_length=5)
    description: Optional[str] = Field(default=None, max_length=256)
    scheduled_date: Optional[datetime] = None
    save_recipient: bool = False
    recipient_nickname: Optional[str] = None


class DOCRequest(BaseModel):
    """DOC transfer request"""
    account_id: str
    destination: DestinationAccount
    amount: float = Field(..., gt=0, le=DOC_MAX_AMOUNT)
    purpose_code: Optional[str] = Field(default="00010", max_length=5)
    description: Optional[str] = Field(default=None, max_length=256)
    scheduled_date: Optional[datetime] = None
    save_recipient: bool = False
    recipient_nickname: Optional[str] = None


class TransferResponse(BaseModel):
    """Transfer response"""
    transfer_id: str
    protocol: str
    transfer_type: str
    amount: float
    fee: float
    total_amount: float
    status: str
    scheduled_date: Optional[str] = None
    expected_settlement: Optional[str] = None


class FavoredRequest(BaseModel):
    """Create favored recipient"""
    account_id: str
    name: str
    document: str
    bank_code: str
    branch: str
    account: str
    account_type: str = "CC"
    nickname: Optional[str] = None


class ScheduleRequest(BaseModel):
    """Create scheduled/recurring transfer"""
    account_id: str
    transfer_type: str = Field(..., pattern="^(TED|DOC)$")
    destination: DestinationAccount
    amount: float = Field(..., gt=0)
    schedule_type: str = Field(..., pattern="^(ONCE|WEEKLY|MONTHLY)$")
    scheduled_date: datetime
    day_of_month: Optional[int] = Field(default=None, ge=1, le=31)
    day_of_week: Optional[int] = Field(default=None, ge=0, le=6)
    end_date: Optional[datetime] = None
    max_occurrences: Optional[int] = None


class LimitUpdateRequest(BaseModel):
    """Update wire transfer limits"""
    ted_per_transaction: Optional[float] = None
    ted_daily: Optional[float] = None
    ted_monthly: Optional[float] = None
    doc_per_transaction: Optional[float] = None
    doc_daily: Optional[float] = None
    doc_monthly: Optional[float] = None


# ==================== Helper Functions ====================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_account_info(account_id: str) -> dict:
    """Get account information from accounts service"""
    if ENV == "dev":
        return {
            "account_id": account_id,
            "customer_id": f"CUST_{account_id[:8]}",
            "bank_code": "001",
            "branch": "0001",
            "account_number": "12345678",
            "document": "12345678901",
            "name": "Test Account Owner",
            "balance": 1000000.00
        }

    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{ACCOUNTS_URL}/accounts/{account_id}")
        if resp.status_code != 200:
            raise HTTPException(status_code=404, detail="Account not found")
        return resp.json()


async def debit_account(account_id: str, amount: float, description: str) -> bool:
    """Debit amount from account"""
    if ENV == "dev":
        return True

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{ACCOUNTS_URL}/postings/debit",
            json={
                "account_id": account_id,
                "amount": amount,
                "currency": "BRL",
                "description": description
            }
        )
        return resp.status_code == 200


async def check_compliance(
    account_id: str,
    amount: float,
    transfer_type: str,
    dest_document: str
) -> dict:
    """Check compliance rules"""
    if ENV == "dev":
        return {"approved": True, "risk_score": 0.1}

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{COMPLIANCE_URL}/check",
            json={
                "account_id": account_id,
                "amount": amount,
                "transaction_type": f"WIRE_{transfer_type}",
                "counterparty_document": dest_document
            }
        )
        if resp.status_code == 200:
            return resp.json()
        return {"approved": True, "risk_score": 0.5}


async def audit_log(
    action: str,
    entity_type: str,
    entity_id: str,
    data: dict
):
    """Send audit log"""
    if ENV == "dev":
        return

    try:
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{AUDIT_URL}/logs",
                json={
                    "action": action,
                    "entity_type": entity_type,
                    "entity_id": entity_id,
                    "data": data
                },
                timeout=5.0
            )
    except:
        pass


def calculate_fee(
    account_id: str,
    transfer_type: str,
    amount: float,
    db
) -> float:
    """Calculate transfer fee"""
    # Check for account-specific fee
    fee_config = db.query(WireFee).filter(
        WireFee.account_id == account_id,
        WireFee.transfer_type == transfer_type,
        WireFee.is_active == True
    ).first()

    if not fee_config:
        # Use default fee
        fee_config = db.query(WireFee).filter(
            WireFee.account_id == None,
            WireFee.transfer_type == transfer_type,
            WireFee.is_active == True
        ).first()

    if not fee_config:
        # Default fees if no configuration
        if transfer_type == "TED":
            return 10.00  # R$ 10.00 for TED
        else:
            return 5.00   # R$ 5.00 for DOC

    fee = fee_config.fixed_fee + (amount * fee_config.percentage_fee / 100)
    fee = max(fee, float(fee_config.min_fee))
    if fee_config.max_fee:
        fee = min(fee, float(fee_config.max_fee))

    return round(fee, 2)


def check_limits(
    account_id: str,
    transfer_type: str,
    amount: float,
    db
) -> tuple:
    """Check transfer limits. Returns (allowed, message)"""
    limits = db.query(WireLimit).filter(
        WireLimit.account_id == account_id
    ).first()

    if not limits:
        # Create default limits
        limits = WireLimit(
            id=str(uuid.uuid4()),
            account_id=account_id
        )
        db.add(limits)
        db.commit()
        db.refresh(limits)

    # Reset daily limits if needed
    now = datetime.utcnow()
    if limits.last_reset_daily is None or limits.last_reset_daily.date() < now.date():
        limits.ted_used_today = 0
        limits.doc_used_today = 0
        limits.last_reset_daily = now
        db.commit()

    # Reset monthly limits if needed
    if limits.last_reset_monthly is None or limits.last_reset_monthly.month != now.month:
        limits.ted_used_month = 0
        limits.doc_used_month = 0
        limits.last_reset_monthly = now
        db.commit()

    if transfer_type == "TED":
        if amount > float(limits.ted_per_transaction):
            return False, f"Amount exceeds per-transaction limit of R$ {limits.ted_per_transaction}"
        if float(limits.ted_used_today) + amount > float(limits.ted_daily):
            return False, f"Daily TED limit exceeded"
        if float(limits.ted_used_month) + amount > float(limits.ted_monthly):
            return False, f"Monthly TED limit exceeded"
    else:
        if amount > float(limits.doc_per_transaction):
            return False, f"Amount exceeds DOC limit of R$ {limits.doc_per_transaction}"
        if float(limits.doc_used_today) + amount > float(limits.doc_daily):
            return False, f"Daily DOC limit exceeded"
        if float(limits.doc_used_month) + amount > float(limits.doc_monthly):
            return False, f"Monthly DOC limit exceeded"

    return True, "OK"


def update_limits_usage(
    account_id: str,
    transfer_type: str,
    amount: float,
    db
):
    """Update limits after transfer"""
    limits = db.query(WireLimit).filter(
        WireLimit.account_id == account_id
    ).first()

    if limits:
        if transfer_type == "TED":
            limits.ted_used_today = float(limits.ted_used_today) + amount
            limits.ted_used_month = float(limits.ted_used_month) + amount
        else:
            limits.doc_used_today = float(limits.doc_used_today) + amount
            limits.doc_used_month = float(limits.doc_used_month) + amount
        db.commit()


def generate_protocol() -> str:
    """Generate unique transfer protocol"""
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    random_part = uuid.uuid4().hex[:8].upper()
    return f"WIRE{timestamp}{random_part}"


def is_ted_available() -> bool:
    """Check if TED is available (business hours)"""
    now = datetime.utcnow()
    # Convert to BRT (UTC-3)
    brt_hour = now.hour - 3
    if brt_hour < 0:
        brt_hour += 24

    # TED available Monday-Friday 6:30 to 17:00
    if now.weekday() >= 5:  # Weekend
        return False

    start_hour, start_min = map(int, TED_START_TIME.split(":"))
    end_hour, end_min = map(int, TED_END_TIME.split(":"))

    current_minutes = brt_hour * 60 + now.minute
    start_minutes = start_hour * 60 + start_min
    end_minutes = end_hour * 60 + end_min

    return start_minutes <= current_minutes <= end_minutes


def add_history(db, transfer_id: str, old_status: str, new_status: str, source: str, reason: str = None):
    """Add transfer history entry"""
    history = WireHistory(
        id=str(uuid.uuid4()),
        transfer_id=transfer_id,
        previous_status=old_status,
        new_status=new_status,
        source=source,
        reason=reason
    )
    db.add(history)
    db.commit()


# ==================== TED Endpoints ====================

@app.post("/ted/transfer", response_model=TransferResponse)
async def create_ted_transfer(
    request: TEDRequest,
    background_tasks: BackgroundTasks,
    db=Depends(get_db)
):
    """
    Create TED transfer

    TED (Transferência Eletrônica Disponível):
    - Same day settlement
    - No maximum amount
    - Available Monday-Friday 6:30-17:00 BRT
    """
    # Check if scheduled or immediate
    is_scheduled = request.scheduled_date is not None
    if is_scheduled and request.scheduled_date <= datetime.utcnow():
        raise HTTPException(status_code=400, detail="Scheduled date must be in the future")

    # If immediate, check TED availability
    if not is_scheduled and not is_ted_available():
        # Auto-schedule for next business day
        next_day = datetime.utcnow() + timedelta(days=1)
        while next_day.weekday() >= 5:
            next_day += timedelta(days=1)
        request.scheduled_date = next_day.replace(hour=9, minute=0, second=0)
        is_scheduled = True

    # Get source account info
    account_info = await get_account_info(request.account_id)

    # Calculate fee
    fee = calculate_fee(request.account_id, "TED", request.amount, db)
    total_amount = request.amount + fee

    # Check limits
    allowed, message = check_limits(request.account_id, "TED", request.amount, db)
    if not allowed:
        raise HTTPException(status_code=400, detail=message)

    # Check compliance
    compliance = await check_compliance(
        request.account_id,
        request.amount,
        "TED",
        request.destination.document
    )
    if not compliance.get("approved", False):
        raise HTTPException(status_code=403, detail="Transfer blocked by compliance")

    # Generate protocol
    protocol = generate_protocol()

    # Create transfer record
    transfer = WireTransfer(
        id=str(uuid.uuid4()),
        account_id=request.account_id,
        customer_id=account_info.get("customer_id", ""),
        transfer_type="TED",
        amount=request.amount,
        fee=fee,
        total_amount=total_amount,
        source_bank=account_info.get("bank_code", "001"),
        source_branch=account_info.get("branch", "0001"),
        source_account=account_info.get("account_number", ""),
        source_document=account_info.get("document", ""),
        source_name=account_info.get("name", ""),
        dest_bank=request.destination.bank_code,
        dest_branch=request.destination.branch,
        dest_account=request.destination.account,
        dest_account_type=request.destination.account_type,
        dest_document=request.destination.document,
        dest_name=request.destination.name,
        purpose=request.purpose_code,
        description=request.description,
        protocol=protocol,
        status="SCHEDULED" if is_scheduled else "PENDING",
        scheduled_date=request.scheduled_date,
        is_scheduled=is_scheduled
    )

    db.add(transfer)
    db.commit()
    db.refresh(transfer)

    # Add history
    add_history(db, transfer.id, None, transfer.status, "API", "TED transfer created")

    # If not scheduled, process immediately
    if not is_scheduled:
        background_tasks.add_task(process_ted_transfer, transfer.id)

    # Save recipient if requested
    if request.save_recipient:
        background_tasks.add_task(
            save_favored_recipient,
            request.account_id,
            request.destination,
            request.recipient_nickname
        )

    # Audit log
    background_tasks.add_task(
        audit_log,
        "TED_CREATED",
        "wire_transfer",
        transfer.id,
        {"amount": request.amount, "destination_bank": request.destination.bank_code}
    )

    return TransferResponse(
        transfer_id=transfer.id,
        protocol=protocol,
        transfer_type="TED",
        amount=request.amount,
        fee=fee,
        total_amount=total_amount,
        status=transfer.status,
        scheduled_date=request.scheduled_date.isoformat() if is_scheduled else None,
        expected_settlement=datetime.utcnow().isoformat() if not is_scheduled else None
    )


async def process_ted_transfer(transfer_id: str):
    """Process TED transfer through STR"""
    db = SessionLocal()
    try:
        transfer = db.query(WireTransfer).filter(WireTransfer.id == transfer_id).first()
        if not transfer or transfer.status not in ["PENDING", "SCHEDULED"]:
            return

        # Update status to processing
        old_status = transfer.status
        transfer.status = "PROCESSING"
        db.commit()
        add_history(db, transfer.id, old_status, "PROCESSING", "SYSTEM", "Processing TED")

        # Debit account
        debit_success = await debit_account(
            transfer.account_id,
            float(transfer.total_amount),
            f"TED - {transfer.protocol}"
        )

        if not debit_success:
            transfer.status = "FAILED"
            transfer.return_reason = "Insufficient funds or account error"
            db.commit()
            add_history(db, transfer.id, "PROCESSING", "FAILED", "SYSTEM", "Debit failed")
            return

        # Update limits
        update_limits_usage(transfer.account_id, "TED", float(transfer.amount), db)

        # Send to STR
        str_request = STRTransferRequest(
            transfer_id=transfer.id,
            ispb_source="00000000",  # Would come from bank config
            ispb_dest=get_ispb_for_bank(transfer.dest_bank),
            branch_source=transfer.source_branch,
            branch_dest=transfer.dest_branch,
            account_source=transfer.source_account,
            account_dest=transfer.dest_account,
            account_type_dest=transfer.dest_account_type,
            document_source=transfer.source_document,
            document_dest=transfer.dest_document,
            name_source=transfer.source_name,
            name_dest=transfer.dest_name,
            amount=float(transfer.amount),
            purpose_code=transfer.purpose or "00010",
            description=transfer.description
        )

        str_response = await str_client.send_ted(str_request)

        if str_response.success:
            transfer.status = "SENT"
            transfer.str_reference = str_response.str_reference
            transfer.sent_at = datetime.utcnow()
            transfer.str_response = {
                "reference": str_response.str_reference,
                "settlement_date": str_response.settlement_date.isoformat() if str_response.settlement_date else None
            }
            db.commit()
            add_history(db, transfer.id, "PROCESSING", "SENT", "STR", f"STR Reference: {str_response.str_reference}")

            # In dev mode, auto-settle
            if ENV == "dev":
                transfer.status = "SETTLED"
                transfer.settled_at = datetime.utcnow()
                db.commit()
                add_history(db, transfer.id, "SENT", "SETTLED", "STR", "Settlement confirmed")
        else:
            transfer.status = "FAILED"
            transfer.return_reason = str_response.error_message
            transfer.str_response = {
                "error_code": str_response.error_code,
                "error_message": str_response.error_message
            }
            db.commit()
            add_history(db, transfer.id, "PROCESSING", "FAILED", "STR", str_response.error_message)

            # Reverse debit
            # In production, would credit back the account

    finally:
        db.close()


def get_ispb_for_bank(bank_code: str) -> str:
    """Get ISPB code for bank"""
    for bank in BRAZILIAN_BANKS:
        if bank["code"] == bank_code:
            return bank["ispb"]
    return "00000000"


async def save_favored_recipient(account_id: str, dest: DestinationAccount, nickname: str):
    """Save recipient to favorites"""
    db = SessionLocal()
    try:
        # Check if already exists
        existing = db.query(FavoredRecipient).filter(
            FavoredRecipient.account_id == account_id,
            FavoredRecipient.document == dest.document,
            FavoredRecipient.bank_code == dest.bank_code,
            FavoredRecipient.account == dest.account
        ).first()

        if existing:
            return

        # Get bank name
        bank_name = "Banco"
        for bank in BRAZILIAN_BANKS:
            if bank["code"] == dest.bank_code:
                bank_name = bank["short_name"]
                break

        recipient = FavoredRecipient(
            id=str(uuid.uuid4()),
            account_id=account_id,
            name=dest.name,
            document=dest.document,
            document_type="CPF" if len(dest.document) == 11 else "CNPJ",
            bank_code=dest.bank_code,
            bank_name=bank_name,
            branch=dest.branch,
            account=dest.account,
            account_type=dest.account_type,
            nickname=nickname
        )
        db.add(recipient)
        db.commit()
    finally:
        db.close()


# ==================== DOC Endpoints ====================

@app.post("/doc/transfer", response_model=TransferResponse)
async def create_doc_transfer(
    request: DOCRequest,
    background_tasks: BackgroundTasks,
    db=Depends(get_db)
):
    """
    Create DOC transfer

    DOC (Documento de Ordem de Crédito):
    - D+1 settlement
    - Maximum amount: R$ 4,999.99
    - Lower cost than TED
    """
    # Validate amount
    if request.amount > DOC_MAX_AMOUNT:
        raise HTTPException(
            status_code=400,
            detail=f"DOC maximum amount is R$ {DOC_MAX_AMOUNT}. Use TED for higher values."
        )

    # Check if scheduled
    is_scheduled = request.scheduled_date is not None
    if is_scheduled and request.scheduled_date <= datetime.utcnow():
        raise HTTPException(status_code=400, detail="Scheduled date must be in the future")

    # Get source account info
    account_info = await get_account_info(request.account_id)

    # Calculate fee
    fee = calculate_fee(request.account_id, "DOC", request.amount, db)
    total_amount = request.amount + fee

    # Check limits
    allowed, message = check_limits(request.account_id, "DOC", request.amount, db)
    if not allowed:
        raise HTTPException(status_code=400, detail=message)

    # Check compliance
    compliance = await check_compliance(
        request.account_id,
        request.amount,
        "DOC",
        request.destination.document
    )
    if not compliance.get("approved", False):
        raise HTTPException(status_code=403, detail="Transfer blocked by compliance")

    # Generate protocol
    protocol = generate_protocol()

    # Calculate expected settlement (D+1)
    expected_settlement = datetime.utcnow() + timedelta(days=1)
    while expected_settlement.weekday() >= 5:
        expected_settlement += timedelta(days=1)

    # Create transfer record
    transfer = WireTransfer(
        id=str(uuid.uuid4()),
        account_id=request.account_id,
        customer_id=account_info.get("customer_id", ""),
        transfer_type="DOC",
        amount=request.amount,
        fee=fee,
        total_amount=total_amount,
        source_bank=account_info.get("bank_code", "001"),
        source_branch=account_info.get("branch", "0001"),
        source_account=account_info.get("account_number", ""),
        source_document=account_info.get("document", ""),
        source_name=account_info.get("name", ""),
        dest_bank=request.destination.bank_code,
        dest_branch=request.destination.branch,
        dest_account=request.destination.account,
        dest_account_type=request.destination.account_type,
        dest_document=request.destination.document,
        dest_name=request.destination.name,
        purpose=request.purpose_code,
        description=request.description,
        protocol=protocol,
        status="SCHEDULED" if is_scheduled else "PENDING",
        scheduled_date=request.scheduled_date,
        is_scheduled=is_scheduled
    )

    db.add(transfer)
    db.commit()
    db.refresh(transfer)

    # Add history
    add_history(db, transfer.id, None, transfer.status, "API", "DOC transfer created")

    # If not scheduled, process immediately
    if not is_scheduled:
        background_tasks.add_task(process_doc_transfer, transfer.id)

    # Save recipient if requested
    if request.save_recipient:
        background_tasks.add_task(
            save_favored_recipient,
            request.account_id,
            request.destination,
            request.recipient_nickname
        )

    # Audit log
    background_tasks.add_task(
        audit_log,
        "DOC_CREATED",
        "wire_transfer",
        transfer.id,
        {"amount": request.amount, "destination_bank": request.destination.bank_code}
    )

    return TransferResponse(
        transfer_id=transfer.id,
        protocol=protocol,
        transfer_type="DOC",
        amount=request.amount,
        fee=fee,
        total_amount=total_amount,
        status=transfer.status,
        scheduled_date=request.scheduled_date.isoformat() if is_scheduled else None,
        expected_settlement=expected_settlement.isoformat()
    )


async def process_doc_transfer(transfer_id: str):
    """Process DOC transfer through COMPE"""
    db = SessionLocal()
    try:
        transfer = db.query(WireTransfer).filter(WireTransfer.id == transfer_id).first()
        if not transfer or transfer.status not in ["PENDING", "SCHEDULED"]:
            return

        # Update status to processing
        old_status = transfer.status
        transfer.status = "PROCESSING"
        db.commit()
        add_history(db, transfer.id, old_status, "PROCESSING", "SYSTEM", "Processing DOC")

        # Debit account
        debit_success = await debit_account(
            transfer.account_id,
            float(transfer.total_amount),
            f"DOC - {transfer.protocol}"
        )

        if not debit_success:
            transfer.status = "FAILED"
            transfer.return_reason = "Insufficient funds or account error"
            db.commit()
            add_history(db, transfer.id, "PROCESSING", "FAILED", "SYSTEM", "Debit failed")
            return

        # Update limits
        update_limits_usage(transfer.account_id, "DOC", float(transfer.amount), db)

        # Send to COMPE
        from app.integrations.compe_client import DOCRequest as COMPEDOCRequest
        doc_request = COMPEDOCRequest(
            transfer_id=transfer.id,
            bank_source=transfer.source_bank,
            bank_dest=transfer.dest_bank,
            branch_source=transfer.source_branch,
            branch_dest=transfer.dest_branch,
            account_source=transfer.source_account,
            account_dest=transfer.dest_account,
            account_type_dest=transfer.dest_account_type,
            document_source=transfer.source_document,
            document_dest=transfer.dest_document,
            name_source=transfer.source_name,
            name_dest=transfer.dest_name,
            amount=float(transfer.amount),
            purpose_code=transfer.purpose or "00010",
            description=transfer.description
        )

        doc_response = await compe_client.send_doc(doc_request)

        if doc_response.success:
            transfer.status = "SENT"
            transfer.str_reference = doc_response.compe_reference  # Using same field
            transfer.sent_at = datetime.utcnow()
            transfer.str_response = {
                "reference": doc_response.compe_reference,
                "expected_settlement": doc_response.expected_settlement.isoformat() if doc_response.expected_settlement else None
            }
            db.commit()
            add_history(db, transfer.id, "PROCESSING", "SENT", "COMPE", f"COMPE Reference: {doc_response.compe_reference}")

            # DOC settles on D+1, so we don't auto-settle in dev mode
        else:
            transfer.status = "FAILED"
            transfer.return_reason = doc_response.error_message
            db.commit()
            add_history(db, transfer.id, "PROCESSING", "FAILED", "COMPE", doc_response.error_message)

    finally:
        db.close()


# ==================== Transfer Management ====================

@app.get("/wire/transfers/{transfer_id}")
async def get_transfer(transfer_id: str, db=Depends(get_db)):
    """Get transfer details"""
    transfer = db.query(WireTransfer).filter(WireTransfer.id == transfer_id).first()
    if not transfer:
        raise HTTPException(status_code=404, detail="Transfer not found")

    return {
        "id": transfer.id,
        "protocol": transfer.protocol,
        "transfer_type": transfer.transfer_type,
        "status": transfer.status,
        "amount": float(transfer.amount),
        "fee": float(transfer.fee),
        "total_amount": float(transfer.total_amount),
        "source": {
            "bank": transfer.source_bank,
            "branch": transfer.source_branch,
            "account": transfer.source_account,
            "name": transfer.source_name,
            "document": transfer.source_document
        },
        "destination": {
            "bank": transfer.dest_bank,
            "branch": transfer.dest_branch,
            "account": transfer.dest_account,
            "account_type": transfer.dest_account_type,
            "name": transfer.dest_name,
            "document": transfer.dest_document
        },
        "purpose": transfer.purpose,
        "description": transfer.description,
        "str_reference": transfer.str_reference,
        "scheduled_date": transfer.scheduled_date.isoformat() if transfer.scheduled_date else None,
        "sent_at": transfer.sent_at.isoformat() if transfer.sent_at else None,
        "settled_at": transfer.settled_at.isoformat() if transfer.settled_at else None,
        "return_reason": transfer.return_reason,
        "created_at": transfer.created_at.isoformat()
    }


@app.get("/wire/transfers/protocol/{protocol}")
async def get_transfer_by_protocol(protocol: str, db=Depends(get_db)):
    """Get transfer by protocol"""
    transfer = db.query(WireTransfer).filter(WireTransfer.protocol == protocol).first()
    if not transfer:
        raise HTTPException(status_code=404, detail="Transfer not found")

    return await get_transfer(transfer.id, db)


@app.get("/wire/transfers")
async def list_transfers(
    account_id: str,
    transfer_type: Optional[str] = None,
    status: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = Query(default=50, le=100),
    offset: int = 0,
    db=Depends(get_db)
):
    """List transfers for account"""
    query = db.query(WireTransfer).filter(WireTransfer.account_id == account_id)

    if transfer_type:
        query = query.filter(WireTransfer.transfer_type == transfer_type)
    if status:
        query = query.filter(WireTransfer.status == status)
    if start_date:
        query = query.filter(WireTransfer.created_at >= start_date)
    if end_date:
        query = query.filter(WireTransfer.created_at <= end_date)

    total = query.count()
    transfers = query.order_by(WireTransfer.created_at.desc()).offset(offset).limit(limit).all()

    return {
        "transfers": [
            {
                "id": t.id,
                "protocol": t.protocol,
                "transfer_type": t.transfer_type,
                "status": t.status,
                "amount": float(t.amount),
                "fee": float(t.fee),
                "total_amount": float(t.total_amount),
                "dest_name": t.dest_name,
                "dest_bank": t.dest_bank,
                "created_at": t.created_at.isoformat()
            }
            for t in transfers
        ],
        "total": total,
        "limit": limit,
        "offset": offset
    }


@app.get("/wire/transfers/{transfer_id}/history")
async def get_transfer_history(transfer_id: str, db=Depends(get_db)):
    """Get transfer status history"""
    transfer = db.query(WireTransfer).filter(WireTransfer.id == transfer_id).first()
    if not transfer:
        raise HTTPException(status_code=404, detail="Transfer not found")

    history = db.query(WireHistory).filter(
        WireHistory.transfer_id == transfer_id
    ).order_by(WireHistory.created_at.desc()).all()

    return {
        "transfer_id": transfer_id,
        "history": [
            {
                "previous_status": h.previous_status,
                "new_status": h.new_status,
                "reason": h.reason,
                "source": h.source,
                "timestamp": h.created_at.isoformat()
            }
            for h in history
        ]
    }


@app.post("/wire/transfers/{transfer_id}/cancel")
async def cancel_transfer(transfer_id: str, db=Depends(get_db)):
    """Cancel scheduled transfer"""
    transfer = db.query(WireTransfer).filter(WireTransfer.id == transfer_id).first()
    if not transfer:
        raise HTTPException(status_code=404, detail="Transfer not found")

    if transfer.status not in ["PENDING", "SCHEDULED"]:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot cancel transfer with status {transfer.status}"
        )

    old_status = transfer.status
    transfer.status = "CANCELLED"
    db.commit()

    add_history(db, transfer.id, old_status, "CANCELLED", "API", "Cancelled by user")

    return {"message": "Transfer cancelled", "transfer_id": transfer_id}


# ==================== Favored Recipients ====================

@app.post("/wire/favored")
async def create_favored(request: FavoredRequest, db=Depends(get_db)):
    """Create favored recipient"""
    # Check if already exists
    existing = db.query(FavoredRecipient).filter(
        FavoredRecipient.account_id == request.account_id,
        FavoredRecipient.document == request.document,
        FavoredRecipient.bank_code == request.bank_code,
        FavoredRecipient.account == request.account
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Recipient already exists")

    # Get bank name
    bank_name = "Banco"
    for bank in BRAZILIAN_BANKS:
        if bank["code"] == request.bank_code:
            bank_name = bank["short_name"]
            break

    document_clean = re.sub(r'\D', '', request.document)

    recipient = FavoredRecipient(
        id=str(uuid.uuid4()),
        account_id=request.account_id,
        name=request.name,
        document=document_clean,
        document_type="CPF" if len(document_clean) == 11 else "CNPJ",
        bank_code=request.bank_code,
        bank_name=bank_name,
        branch=re.sub(r'\D', '', request.branch),
        account=re.sub(r'\D', '', request.account),
        account_type=request.account_type,
        nickname=request.nickname
    )

    db.add(recipient)
    db.commit()
    db.refresh(recipient)

    return {
        "id": recipient.id,
        "name": recipient.name,
        "bank": bank_name,
        "message": "Recipient created"
    }


@app.get("/wire/favored")
async def list_favored(
    account_id: str,
    search: Optional[str] = None,
    db=Depends(get_db)
):
    """List favored recipients"""
    query = db.query(FavoredRecipient).filter(
        FavoredRecipient.account_id == account_id,
        FavoredRecipient.is_active == True
    )

    if search:
        query = query.filter(
            (FavoredRecipient.name.ilike(f"%{search}%")) |
            (FavoredRecipient.nickname.ilike(f"%{search}%")) |
            (FavoredRecipient.document.ilike(f"%{search}%"))
        )

    recipients = query.order_by(FavoredRecipient.transfer_count.desc()).all()

    return {
        "recipients": [
            {
                "id": r.id,
                "name": r.name,
                "nickname": r.nickname,
                "document": r.document,
                "document_type": r.document_type,
                "bank_code": r.bank_code,
                "bank_name": r.bank_name,
                "branch": r.branch,
                "account": r.account,
                "account_type": r.account_type,
                "transfer_count": r.transfer_count,
                "last_transfer_at": r.last_transfer_at.isoformat() if r.last_transfer_at else None
            }
            for r in recipients
        ]
    }


@app.delete("/wire/favored/{favored_id}")
async def delete_favored(favored_id: str, account_id: str, db=Depends(get_db)):
    """Delete favored recipient"""
    recipient = db.query(FavoredRecipient).filter(
        FavoredRecipient.id == favored_id,
        FavoredRecipient.account_id == account_id
    ).first()

    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")

    recipient.is_active = False
    db.commit()

    return {"message": "Recipient deleted"}


# ==================== Scheduled Transfers ====================

@app.post("/wire/schedules")
async def create_schedule(request: ScheduleRequest, db=Depends(get_db)):
    """Create scheduled/recurring transfer"""
    # Validate DOC amount
    if request.transfer_type == "DOC" and request.amount > DOC_MAX_AMOUNT:
        raise HTTPException(
            status_code=400,
            detail=f"DOC maximum amount is R$ {DOC_MAX_AMOUNT}"
        )

    schedule = WireSchedule(
        id=str(uuid.uuid4()),
        account_id=request.account_id,
        transfer_type=request.transfer_type,
        amount=request.amount,
        dest_bank=request.destination.bank_code,
        dest_branch=request.destination.branch,
        dest_account=request.destination.account,
        dest_account_type=request.destination.account_type,
        dest_document=request.destination.document,
        dest_name=request.destination.name,
        schedule_type=request.schedule_type,
        scheduled_date=request.scheduled_date,
        day_of_month=request.day_of_month,
        day_of_week=request.day_of_week,
        end_date=request.end_date,
        max_occurrences=request.max_occurrences
    )

    db.add(schedule)
    db.commit()
    db.refresh(schedule)

    return {
        "schedule_id": schedule.id,
        "transfer_type": schedule.transfer_type,
        "schedule_type": schedule.schedule_type,
        "next_execution": schedule.scheduled_date.isoformat(),
        "message": "Schedule created"
    }


@app.get("/wire/schedules")
async def list_schedules(account_id: str, db=Depends(get_db)):
    """List scheduled transfers"""
    schedules = db.query(WireSchedule).filter(
        WireSchedule.account_id == account_id,
        WireSchedule.is_active == True
    ).order_by(WireSchedule.scheduled_date.asc()).all()

    return {
        "schedules": [
            {
                "id": s.id,
                "transfer_type": s.transfer_type,
                "amount": float(s.amount),
                "dest_name": s.dest_name,
                "dest_bank": s.dest_bank,
                "schedule_type": s.schedule_type,
                "status": s.status,
                "next_execution": s.scheduled_date.isoformat(),
                "executed_count": s.executed_count
            }
            for s in schedules
        ]
    }


@app.delete("/wire/schedules/{schedule_id}")
async def cancel_schedule(schedule_id: str, account_id: str, db=Depends(get_db)):
    """Cancel scheduled transfer"""
    schedule = db.query(WireSchedule).filter(
        WireSchedule.id == schedule_id,
        WireSchedule.account_id == account_id
    ).first()

    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    schedule.status = "CANCELLED"
    schedule.is_active = False
    db.commit()

    return {"message": "Schedule cancelled"}


# ==================== Banks Directory ====================

@app.get("/wire/banks")
async def list_banks(
    search: Optional[str] = None,
    supports_ted: Optional[bool] = None,
    supports_doc: Optional[bool] = None,
    db=Depends(get_db)
):
    """
    List Brazilian banks

    Returns list of banks participating in COMPE/STR
    """
    # First check if banks are seeded in database
    bank_count = db.query(Bank).count()

    if bank_count == 0:
        # Seed banks from static data
        for bank_data in BRAZILIAN_BANKS:
            bank = Bank(
                code=bank_data["code"],
                ispb=bank_data["ispb"],
                name=bank_data["name"],
                short_name=bank_data["short_name"]
            )
            db.merge(bank)  # Use merge to handle duplicates
        db.commit()

    # Query banks
    query = db.query(Bank).filter(Bank.is_active == True)

    if search:
        query = query.filter(
            (Bank.name.ilike(f"%{search}%")) |
            (Bank.short_name.ilike(f"%{search}%")) |
            (Bank.code.ilike(f"%{search}%"))
        )

    if supports_ted is not None:
        query = query.filter(Bank.supports_ted == supports_ted)

    if supports_doc is not None:
        query = query.filter(Bank.supports_doc == supports_doc)

    banks = query.order_by(Bank.code).all()

    return {
        "banks": [
            {
                "code": b.code,
                "ispb": b.ispb,
                "name": b.name,
                "short_name": b.short_name,
                "supports_ted": b.supports_ted,
                "supports_doc": b.supports_doc,
                "ted_cutoff": b.ted_cutoff_time
            }
            for b in banks
        ],
        "total": len(banks)
    }


@app.get("/wire/banks/{bank_code}")
async def get_bank(bank_code: str, db=Depends(get_db)):
    """Get bank details"""
    bank = db.query(Bank).filter(Bank.code == bank_code).first()
    if not bank:
        # Try to find in static data
        for bank_data in BRAZILIAN_BANKS:
            if bank_data["code"] == bank_code:
                return bank_data
        raise HTTPException(status_code=404, detail="Bank not found")

    return {
        "code": bank.code,
        "ispb": bank.ispb,
        "name": bank.name,
        "short_name": bank.short_name,
        "supports_ted": bank.supports_ted,
        "supports_doc": bank.supports_doc,
        "ted_cutoff": bank.ted_cutoff_time
    }


# ==================== Limits ====================

@app.get("/wire/limits/{account_id}")
async def get_limits(account_id: str, db=Depends(get_db)):
    """Get wire transfer limits for account"""
    limits = db.query(WireLimit).filter(WireLimit.account_id == account_id).first()

    if not limits:
        # Create default limits
        limits = WireLimit(
            id=str(uuid.uuid4()),
            account_id=account_id
        )
        db.add(limits)
        db.commit()
        db.refresh(limits)

    return {
        "account_id": account_id,
        "ted": {
            "per_transaction": float(limits.ted_per_transaction),
            "daily": float(limits.ted_daily),
            "monthly": float(limits.ted_monthly),
            "used_today": float(limits.ted_used_today),
            "used_month": float(limits.ted_used_month),
            "available_today": float(limits.ted_daily) - float(limits.ted_used_today)
        },
        "doc": {
            "per_transaction": float(limits.doc_per_transaction),
            "daily": float(limits.doc_daily),
            "monthly": float(limits.doc_monthly),
            "used_today": float(limits.doc_used_today),
            "used_month": float(limits.doc_used_month),
            "available_today": float(limits.doc_daily) - float(limits.doc_used_today)
        },
        "night": {
            "ted_per_transaction": float(limits.night_ted_per_transaction),
            "doc_per_transaction": float(limits.night_doc_per_transaction)
        }
    }


@app.put("/wire/limits/{account_id}")
async def update_limits(
    account_id: str,
    request: LimitUpdateRequest,
    db=Depends(get_db)
):
    """Update wire transfer limits"""
    limits = db.query(WireLimit).filter(WireLimit.account_id == account_id).first()

    if not limits:
        limits = WireLimit(
            id=str(uuid.uuid4()),
            account_id=account_id
        )
        db.add(limits)

    if request.ted_per_transaction is not None:
        limits.ted_per_transaction = request.ted_per_transaction
    if request.ted_daily is not None:
        limits.ted_daily = request.ted_daily
    if request.ted_monthly is not None:
        limits.ted_monthly = request.ted_monthly
    if request.doc_per_transaction is not None:
        limits.doc_per_transaction = min(request.doc_per_transaction, DOC_MAX_AMOUNT)
    if request.doc_daily is not None:
        limits.doc_daily = request.doc_daily
    if request.doc_monthly is not None:
        limits.doc_monthly = request.doc_monthly

    db.commit()

    return {"message": "Limits updated", "account_id": account_id}


# ==================== Fees ====================

@app.get("/wire/fees")
async def get_fees(account_id: Optional[str] = None, db=Depends(get_db)):
    """Get wire transfer fees"""
    if account_id:
        # Account-specific fees
        fees = db.query(WireFee).filter(
            WireFee.account_id == account_id,
            WireFee.is_active == True
        ).all()

        if not fees:
            # Return defaults
            fees = db.query(WireFee).filter(
                WireFee.account_id == None,
                WireFee.is_active == True
            ).all()
    else:
        # Default fees
        fees = db.query(WireFee).filter(
            WireFee.account_id == None,
            WireFee.is_active == True
        ).all()

    if not fees:
        # Return hardcoded defaults
        return {
            "fees": [
                {"transfer_type": "TED", "fixed_fee": 10.00, "percentage_fee": 0},
                {"transfer_type": "DOC", "fixed_fee": 5.00, "percentage_fee": 0}
            ]
        }

    return {
        "fees": [
            {
                "transfer_type": f.transfer_type,
                "fixed_fee": float(f.fixed_fee),
                "percentage_fee": f.percentage_fee,
                "min_fee": float(f.min_fee),
                "max_fee": float(f.max_fee) if f.max_fee else None
            }
            for f in fees
        ]
    }


# ==================== Purpose Codes ====================

@app.get("/wire/purpose-codes")
async def get_purpose_codes():
    """Get transfer purpose codes"""
    return {
        "purpose_codes": [
            {"code": code, "description": desc}
            for code, desc in TRANSFER_PURPOSE_CODES.items()
        ]
    }


# ==================== Statistics ====================

@app.get("/wire/statistics/{account_id}")
async def get_statistics(
    account_id: str,
    period: str = Query(default="month", pattern="^(day|week|month|year)$"),
    db=Depends(get_db)
):
    """Get wire transfer statistics"""
    now = datetime.utcnow()

    if period == "day":
        start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
    elif period == "week":
        start_date = now - timedelta(days=now.weekday())
        start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
    elif period == "month":
        start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    else:  # year
        start_date = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)

    transfers = db.query(WireTransfer).filter(
        WireTransfer.account_id == account_id,
        WireTransfer.created_at >= start_date
    ).all()

    ted_count = sum(1 for t in transfers if t.transfer_type == "TED")
    doc_count = sum(1 for t in transfers if t.transfer_type == "DOC")
    ted_total = sum(float(t.amount) for t in transfers if t.transfer_type == "TED")
    doc_total = sum(float(t.amount) for t in transfers if t.transfer_type == "DOC")
    ted_fees = sum(float(t.fee) for t in transfers if t.transfer_type == "TED")
    doc_fees = sum(float(t.fee) for t in transfers if t.transfer_type == "DOC")

    status_counts = {}
    for t in transfers:
        status_counts[t.status] = status_counts.get(t.status, 0) + 1

    return {
        "period": period,
        "start_date": start_date.isoformat(),
        "ted": {
            "count": ted_count,
            "total_amount": ted_total,
            "total_fees": ted_fees
        },
        "doc": {
            "count": doc_count,
            "total_amount": doc_total,
            "total_fees": doc_fees
        },
        "total": {
            "count": len(transfers),
            "total_amount": ted_total + doc_total,
            "total_fees": ted_fees + doc_fees
        },
        "by_status": status_counts
    }


# ==================== Settlement Webhook (for STR/COMPE) ====================

@app.post("/wire/webhook/settlement")
async def settlement_webhook(
    reference: str,
    status: str,
    settlement_date: Optional[str] = None,
    return_code: Optional[str] = None,
    db=Depends(get_db)
):
    """
    Webhook for STR/COMPE settlement notifications

    In production, this would be called by the settlement system
    when a transfer is settled or returned.
    """
    transfer = db.query(WireTransfer).filter(
        WireTransfer.str_reference == reference
    ).first()

    if not transfer:
        raise HTTPException(status_code=404, detail="Transfer not found")

    old_status = transfer.status

    if status == "SETTLED":
        transfer.status = "SETTLED"
        transfer.settled_at = datetime.fromisoformat(settlement_date) if settlement_date else datetime.utcnow()
        add_history(db, transfer.id, old_status, "SETTLED", "WEBHOOK", "Settlement confirmed")
    elif status == "RETURNED":
        transfer.status = "RETURNED"
        transfer.return_reason = return_code
        add_history(db, transfer.id, old_status, "RETURNED", "WEBHOOK", f"Return code: {return_code}")

        # In production, would credit back the account
    elif status == "FAILED":
        transfer.status = "FAILED"
        transfer.return_reason = return_code
        add_history(db, transfer.id, old_status, "FAILED", "WEBHOOK", f"Error: {return_code}")

    db.commit()

    return {"message": "Webhook processed", "transfer_id": transfer.id, "new_status": transfer.status}


# ==================== Health Check ====================

@app.get("/health")
async def health():
    """Health check endpoint"""
    ted_available = is_ted_available()
    return {
        "status": "healthy",
        "service": "wire-service",
        "version": "2.0.0",
        "ted_available": ted_available,
        "doc_available": True,  # DOC is always available
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Athena Wire Service",
        "version": "2.0.0",
        "description": "TED/DOC Transfer Processing"
    }
