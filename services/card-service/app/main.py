"""
Athena Card Service
Complete card processing with 3DS, acquirer integration, and fraud detection
"""
import os
import uuid
import logging
import hashlib
import random
from datetime import datetime, timedelta
from typing import Optional, List
from decimal import Decimal

from fastapi import FastAPI, HTTPException, Depends, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
import httpx

from app.db import SessionLocal, ensure_schema
from app.models import (
    Card, CardTransaction, ThreeDS, CardInvoice, CardInvoiceItem,
    CardDispute, CardNotification, MerchantBlock
)
from app.integrations.acquirer import (
    default_acquirer, AuthorizationRequest, CaptureRequest,
    RefundRequest, TransactionStatus
)
from app.integrations.threeds import (
    threeds_client, ThreeDSAuthRequest, DeviceChannel
)
from app.fraud import fraud_engine, FraudCheckRequest, FraudRiskLevel

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
ENV = os.getenv("ENV", "dev")
ACCOUNTS_URL = os.getenv("ACCOUNTS_URL", "http://accounts-service:8080")
COMPLIANCE_URL = os.getenv("COMPLIANCE_URL", "http://compliance-service:8080")

# Initialize
ensure_schema()

app = FastAPI(
    title="Athena Card Service",
    description="Card processing with 3DS, fraud detection, and invoice management",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# ============ Pydantic Models ============

class CardCreate(BaseModel):
    customer_id: str
    account_id: str
    cardholder_name: str
    product: str = Field(default="STANDARD", description="STANDARD, GOLD, PLATINUM, BLACK")
    brand: str = Field(default="VISA", description="VISA, MASTERCARD, ELO")
    card_type: str = Field(default="CREDIT", description="CREDIT, DEBIT")
    credit_limit: float = Field(default=1000, ge=0)
    billing_address: Optional[dict] = None


class CardResponse(BaseModel):
    id: str
    last4: str
    brand: str
    product: str
    card_type: str
    status: str
    credit_limit: float
    available_limit: float
    exp_month: int
    exp_year: int
    is_virtual: bool


class VirtualCardCreate(BaseModel):
    parent_card_id: str
    limit: Optional[float] = None


class CardActivate(BaseModel):
    last4: str
    cvv: str


class AuthorizeRequest(BaseModel):
    card_id: str
    amount: float = Field(..., gt=0)
    currency: str = Field(default="BRL")
    merchant_name: str
    merchant_id: str
    merchant_category_code: str = Field(default="5411")
    merchant_city: str = Field(default="SAO PAULO")
    merchant_country: str = Field(default="BR")
    installments: int = Field(default=1, ge=1, le=12)
    capture: bool = Field(default=True)
    entry_mode: str = Field(default="ECOMMERCE")
    use_3ds: bool = Field(default=False)
    device_channel: str = Field(default="BROWSER")
    browser_info: Optional[dict] = None


class AuthorizeResponse(BaseModel):
    id: str
    authorization_code: Optional[str]
    status: str
    amount: float
    merchant_name: str
    fraud_score: Optional[float]
    requires_3ds: bool = False
    threeds_url: Optional[str] = None
    created_at: datetime


class CaptureRequestModel(BaseModel):
    amount: Optional[float] = None


class RefundRequestModel(BaseModel):
    amount: float = Field(..., gt=0)
    reason: Optional[str] = None


class ThreeDSInitRequest(BaseModel):
    transaction_id: str
    browser_info: Optional[dict] = None


class ThreeDSCompleteRequest(BaseModel):
    session_id: str
    cres: str


class InvoicePayRequest(BaseModel):
    amount: Optional[float] = None
    payment_method: str = Field(default="BALANCE")


class DisputeCreate(BaseModel):
    transaction_id: str
    dispute_type: str = Field(description="FRAUD, NOT_RECEIVED, NOT_AS_DESCRIBED, DUPLICATE")
    description: str


class CardControlUpdate(BaseModel):
    contactless_enabled: Optional[bool] = None
    international_enabled: Optional[bool] = None
    online_enabled: Optional[bool] = None
    withdrawal_enabled: Optional[bool] = None


class LimitUpdate(BaseModel):
    daily_limit: Optional[float] = None
    monthly_limit: Optional[float] = None
    per_transaction_limit: Optional[float] = None


# ============ Helper Functions ============

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def generate_token() -> str:
    """Generate PCI-compliant card token"""
    return "tok_" + hashlib.sha256(uuid.uuid4().bytes).hexdigest()[:28]


def generate_last4() -> str:
    """Generate random last 4 digits"""
    return str(random.randint(1000, 9999))


def generate_auth_code() -> str:
    """Generate authorization code"""
    return str(random.randint(100000, 999999))


def hash_cvv(cvv: str) -> str:
    """Hash CVV for storage"""
    return hashlib.sha256(cvv.encode()).hexdigest()


async def debit_account(account_id: str, amount: float, description: str):
    """Debit account via accounts service"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{ACCOUNTS_URL}/postings/debit",
                json={
                    "account_id": account_id,
                    "amount": amount,
                    "currency": "BRL",
                    "description": description
                }
            )
            return response.status_code == 200
    except Exception as e:
        logger.error(f"Failed to debit account: {e}")
        return False


async def credit_account(account_id: str, amount: float, description: str):
    """Credit account via accounts service"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            await client.post(
                f"{ACCOUNTS_URL}/postings/credit",
                json={
                    "account_id": account_id,
                    "amount": amount,
                    "currency": "BRL",
                    "description": description
                }
            )
    except Exception as e:
        logger.error(f"Failed to credit account: {e}")


def check_card_limits(card: Card, amount: float) -> tuple:
    """Check if transaction is within card limits"""
    errors = []

    if card.status != "ACTIVE":
        errors.append(f"Card is {card.status}")

    if amount > float(card.available_limit):
        errors.append("Insufficient credit limit")

    if amount > float(card.per_transaction_limit):
        errors.append("Exceeds per-transaction limit")

    if float(card.used_today) + amount > float(card.daily_limit):
        errors.append("Exceeds daily limit")

    if float(card.used_month) + amount > float(card.monthly_limit):
        errors.append("Exceeds monthly limit")

    return len(errors) == 0, errors


def update_card_usage(db, card: Card, amount: float):
    """Update card usage after transaction"""
    card.available_limit = float(card.available_limit) - amount
    card.used_today = float(card.used_today) + amount
    card.used_month = float(card.used_month) + amount
    db.commit()


# ============ Health Check ============

@app.get("/health")
def health():
    return {"status": "healthy", "service": "card-service", "version": "2.0.0"}


# ============ Card Management ============

@app.post("/cards", response_model=CardResponse)
def issue_card(card_data: CardCreate, db=Depends(get_db)):
    """
    Issue a new card

    Card number is tokenized (never stored)
    """
    # Generate card details
    token = generate_token()
    last4 = generate_last4()
    cvv = str(random.randint(100, 999))

    # Set expiration (3 years from now)
    exp_date = datetime.utcnow() + timedelta(days=365 * 3)

    card = Card(
        id=str(uuid.uuid4()),
        customer_id=card_data.customer_id,
        account_id=card_data.account_id,
        token=token,
        last4=last4,
        brand=card_data.brand.upper(),
        product=card_data.product.upper(),
        card_type=card_data.card_type.upper(),
        cardholder_name=card_data.cardholder_name.upper(),
        billing_address=card_data.billing_address,
        exp_month=exp_date.month,
        exp_year=exp_date.year,
        cvv_hash=hash_cvv(cvv),
        credit_limit=card_data.credit_limit,
        available_limit=card_data.credit_limit,
        status="INACTIVE"  # Needs activation
    )

    db.add(card)
    db.commit()

    logger.info(f"Card issued: {card.id} ({card.product} {card.brand})")

    return CardResponse(
        id=card.id,
        last4=card.last4,
        brand=card.brand,
        product=card.product,
        card_type=card.card_type,
        status=card.status,
        credit_limit=float(card.credit_limit),
        available_limit=float(card.available_limit),
        exp_month=card.exp_month,
        exp_year=card.exp_year,
        is_virtual=card.is_virtual
    )


@app.post("/cards/virtual", response_model=CardResponse)
def issue_virtual_card(virtual_data: VirtualCardCreate, db=Depends(get_db)):
    """
    Issue a virtual card linked to a physical card
    """
    # Find parent card
    parent = db.query(Card).filter(Card.id == virtual_data.parent_card_id).first()
    if not parent:
        raise HTTPException(status_code=404, detail="Parent card not found")

    if parent.status != "ACTIVE":
        raise HTTPException(status_code=400, detail="Parent card must be active")

    # Generate virtual card
    token = generate_token()
    last4 = generate_last4()

    # Set shorter expiration for virtual cards (1 year)
    exp_date = datetime.utcnow() + timedelta(days=365)

    limit = virtual_data.limit or float(parent.credit_limit) * 0.5

    card = Card(
        id=str(uuid.uuid4()),
        customer_id=parent.customer_id,
        account_id=parent.account_id,
        token=token,
        last4=last4,
        brand=parent.brand,
        product="VIRTUAL",
        card_type=parent.card_type,
        cardholder_name=parent.cardholder_name,
        exp_month=exp_date.month,
        exp_year=exp_date.year,
        credit_limit=limit,
        available_limit=limit,
        parent_card_id=parent.id,
        is_virtual=True,
        status="ACTIVE",  # Virtual cards auto-activate
        activated_at=datetime.utcnow()
    )

    db.add(card)
    db.commit()

    logger.info(f"Virtual card issued: {card.id}")

    return CardResponse(
        id=card.id,
        last4=card.last4,
        brand=card.brand,
        product=card.product,
        card_type=card.card_type,
        status=card.status,
        credit_limit=float(card.credit_limit),
        available_limit=float(card.available_limit),
        exp_month=card.exp_month,
        exp_year=card.exp_year,
        is_virtual=card.is_virtual
    )


@app.get("/cards")
def list_cards(
    customer_id: Optional[str] = None,
    status: Optional[str] = None,
    db=Depends(get_db)
):
    """List cards for a customer"""
    query = db.query(Card)

    if customer_id:
        query = query.filter(Card.customer_id == customer_id)
    if status:
        query = query.filter(Card.status == status.upper())

    cards = query.all()

    return [
        CardResponse(
            id=c.id,
            last4=c.last4,
            brand=c.brand,
            product=c.product,
            card_type=c.card_type,
            status=c.status,
            credit_limit=float(c.credit_limit),
            available_limit=float(c.available_limit),
            exp_month=c.exp_month,
            exp_year=c.exp_year,
            is_virtual=c.is_virtual
        )
        for c in cards
    ]


@app.get("/cards/{card_id}", response_model=CardResponse)
def get_card(card_id: str, db=Depends(get_db)):
    """Get card details"""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    return CardResponse(
        id=card.id,
        last4=card.last4,
        brand=card.brand,
        product=card.product,
        card_type=card.card_type,
        status=card.status,
        credit_limit=float(card.credit_limit),
        available_limit=float(card.available_limit),
        exp_month=card.exp_month,
        exp_year=card.exp_year,
        is_virtual=card.is_virtual
    )


@app.post("/cards/{card_id}/activate")
def activate_card(card_id: str, activation: CardActivate, db=Depends(get_db)):
    """
    Activate a card

    Requires last 4 digits and CVV for verification
    """
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    if card.status == "ACTIVE":
        raise HTTPException(status_code=400, detail="Card already active")

    if card.status == "CANCELLED":
        raise HTTPException(status_code=400, detail="Card is cancelled")

    # Verify last4
    if card.last4 != activation.last4:
        raise HTTPException(status_code=400, detail="Invalid card details")

    # Verify CVV
    if card.cvv_hash and card.cvv_hash != hash_cvv(activation.cvv):
        raise HTTPException(status_code=400, detail="Invalid CVV")

    card.status = "ACTIVE"
    card.activated_at = datetime.utcnow()
    db.commit()

    return {"message": "Card activated successfully"}


@app.post("/cards/{card_id}/block")
def block_card(card_id: str, db=Depends(get_db)):
    """Block a card"""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    card.status = "BLOCKED"
    db.commit()

    return {"message": "Card blocked"}


@app.post("/cards/{card_id}/unblock")
def unblock_card(card_id: str, db=Depends(get_db)):
    """Unblock a card"""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    if card.status != "BLOCKED":
        raise HTTPException(status_code=400, detail="Card is not blocked")

    card.status = "ACTIVE"
    db.commit()

    return {"message": "Card unblocked"}


@app.delete("/cards/{card_id}")
def cancel_card(card_id: str, db=Depends(get_db)):
    """Cancel a card permanently"""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    card.status = "CANCELLED"
    db.commit()

    return {"message": "Card cancelled"}


# ============ Card Controls ============

@app.put("/cards/{card_id}/controls")
def update_card_controls(
    card_id: str,
    controls: CardControlUpdate,
    db=Depends(get_db)
):
    """Update card feature controls"""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    if controls.contactless_enabled is not None:
        card.contactless_enabled = controls.contactless_enabled
    if controls.international_enabled is not None:
        card.international_enabled = controls.international_enabled
    if controls.online_enabled is not None:
        card.online_enabled = controls.online_enabled
    if controls.withdrawal_enabled is not None:
        card.withdrawal_enabled = controls.withdrawal_enabled

    db.commit()

    return {
        "contactless_enabled": card.contactless_enabled,
        "international_enabled": card.international_enabled,
        "online_enabled": card.online_enabled,
        "withdrawal_enabled": card.withdrawal_enabled
    }


@app.put("/cards/{card_id}/limits")
def update_card_limits(
    card_id: str,
    limits: LimitUpdate,
    db=Depends(get_db)
):
    """Update card transaction limits"""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    if limits.daily_limit is not None:
        card.daily_limit = limits.daily_limit
    if limits.monthly_limit is not None:
        card.monthly_limit = limits.monthly_limit
    if limits.per_transaction_limit is not None:
        card.per_transaction_limit = limits.per_transaction_limit

    db.commit()

    return {
        "daily_limit": float(card.daily_limit),
        "monthly_limit": float(card.monthly_limit),
        "per_transaction_limit": float(card.per_transaction_limit)
    }


# ============ Authorization & Transactions ============

@app.post("/cards/authorize", response_model=AuthorizeResponse)
async def authorize_transaction(
    auth_request: AuthorizeRequest,
    background_tasks: BackgroundTasks,
    db=Depends(get_db)
):
    """
    Authorize a card transaction

    Flow:
    1. Validate card and limits
    2. Run fraud check
    3. Optionally initiate 3DS
    4. Send to acquirer
    5. Update card limits
    """
    # Get card
    card = db.query(Card).filter(Card.id == auth_request.card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    # Check card controls
    if auth_request.entry_mode == "ECOMMERCE" and not card.online_enabled:
        raise HTTPException(status_code=403, detail="Online transactions disabled")

    if auth_request.merchant_country != "BR" and not card.international_enabled:
        raise HTTPException(status_code=403, detail="International transactions disabled")

    # Check limits
    limit_ok, limit_errors = check_card_limits(card, auth_request.amount)
    if not limit_ok:
        raise HTTPException(status_code=403, detail=", ".join(limit_errors))

    # Run fraud check
    fraud_request = FraudCheckRequest(
        card_id=card.id,
        customer_id=card.customer_id,
        amount=auth_request.amount,
        currency=auth_request.currency,
        merchant_name=auth_request.merchant_name,
        merchant_id=auth_request.merchant_id,
        merchant_category_code=auth_request.merchant_category_code,
        merchant_city=auth_request.merchant_city,
        merchant_country=auth_request.merchant_country,
        entry_mode=auth_request.entry_mode
    )

    # Get recent transactions for velocity check
    recent = db.query(CardTransaction).filter(
        CardTransaction.card_id == card.id,
        CardTransaction.created_at > datetime.utcnow() - timedelta(hours=24)
    ).all()

    fraud_result = await fraud_engine.check(
        fraud_request,
        [{"created_at": t.created_at} for t in recent]
    )

    # Block if critical risk
    if fraud_result.should_block:
        raise HTTPException(
            status_code=403,
            detail=f"Transaction blocked: fraud score {fraud_result.score}"
        )

    # Create transaction record
    tx = CardTransaction(
        id=str(uuid.uuid4()),
        card_id=card.id,
        customer_id=card.customer_id,
        account_id=card.account_id,
        authorization_code=generate_auth_code(),
        transaction_type="PURCHASE",
        amount=auth_request.amount,
        currency=auth_request.currency,
        merchant_name=auth_request.merchant_name,
        merchant_id=auth_request.merchant_id,
        merchant_category_code=auth_request.merchant_category_code,
        merchant_city=auth_request.merchant_city,
        merchant_country=auth_request.merchant_country,
        entry_mode=auth_request.entry_mode,
        installments=auth_request.installments,
        installment_amount=auth_request.amount / auth_request.installments,
        fraud_score=fraud_result.score,
        fraud_flags={"flags": [f.value for f in fraud_result.flags]},
        status="PENDING"
    )

    # Check if 3DS required
    if auth_request.use_3ds or fraud_result.should_challenge:
        # Initiate 3DS
        threeds_request = ThreeDSAuthRequest(
            card_token=card.token,
            amount=auth_request.amount,
            currency=auth_request.currency,
            merchant_id=auth_request.merchant_id,
            merchant_name=auth_request.merchant_name,
            device_channel=DeviceChannel.BROWSER if auth_request.device_channel == "BROWSER" else DeviceChannel.APP,
            browser_info=auth_request.browser_info
        )

        threeds_response = await threeds_client.authenticate(threeds_request, card.brand)

        if threeds_response.trans_status.value == "C":
            # Challenge required
            threeds_session = ThreeDS(
                id=str(uuid.uuid4()),
                transaction_id=tx.id,
                card_id=card.id,
                version="2.2",
                device_channel=auth_request.device_channel,
                acs_url=threeds_response.acs_url,
                ds_trans_id=threeds_response.ds_trans_id,
                server_trans_id=threeds_response.session_id,
                status="CHALLENGE_REQUIRED",
                expires_at=datetime.utcnow() + timedelta(minutes=5)
            )
            db.add(threeds_session)

            tx.is_3ds = True
            tx.three_ds_status = "CHALLENGE_REQUIRED"
            tx.status = "PENDING_3DS"
            db.add(tx)
            db.commit()

            return AuthorizeResponse(
                id=tx.id,
                authorization_code=None,
                status="PENDING_3DS",
                amount=auth_request.amount,
                merchant_name=auth_request.merchant_name,
                fraud_score=fraud_result.score,
                requires_3ds=True,
                threeds_url=threeds_response.acs_url,
                created_at=tx.created_at
            )

        elif threeds_response.success:
            tx.is_3ds = True
            tx.three_ds_status = "AUTHENTICATED"
            tx.eci = threeds_response.eci

    # Send to acquirer
    acquirer_request = AuthorizationRequest(
        card_token=card.token,
        amount=auth_request.amount,
        currency=auth_request.currency,
        merchant_id=auth_request.merchant_id,
        merchant_name=auth_request.merchant_name,
        merchant_category_code=auth_request.merchant_category_code,
        installments=auth_request.installments,
        capture=auth_request.capture
    )

    acquirer_response = await default_acquirer.authorize(acquirer_request)

    if acquirer_response.success:
        tx.authorization_code = acquirer_response.authorization_code
        tx.nsu = acquirer_response.nsu
        tx.acquirer_reference = acquirer_response.acquirer_reference
        tx.status = "CAPTURED" if auth_request.capture else "AUTHORIZED"
        tx.authorized_at = datetime.utcnow()
        if auth_request.capture:
            tx.captured_at = datetime.utcnow()
            tx.authorized_amount = auth_request.amount
            tx.captured_amount = auth_request.amount

        # Update card limits
        update_card_usage(db, card, auth_request.amount)
    else:
        tx.status = "DECLINED"
        tx.decline_code = acquirer_response.decline_code
        tx.decline_reason = acquirer_response.decline_message

    tx.response_data = acquirer_response.raw_response
    db.add(tx)
    db.commit()

    if not acquirer_response.success:
        raise HTTPException(
            status_code=400,
            detail=acquirer_response.decline_message or "Transaction declined"
        )

    logger.info(f"Transaction authorized: {tx.id} - {tx.authorization_code}")

    return AuthorizeResponse(
        id=tx.id,
        authorization_code=tx.authorization_code,
        status=tx.status,
        amount=float(tx.amount),
        merchant_name=tx.merchant_name,
        fraud_score=fraud_result.score,
        requires_3ds=False,
        created_at=tx.created_at
    )


@app.post("/cards/transactions/{tx_id}/capture")
async def capture_transaction(
    tx_id: str,
    capture: CaptureRequestModel,
    db=Depends(get_db)
):
    """Capture an authorized transaction"""
    tx = db.query(CardTransaction).filter(CardTransaction.id == tx_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    if tx.status != "AUTHORIZED":
        raise HTTPException(status_code=400, detail=f"Cannot capture {tx.status} transaction")

    amount = capture.amount or float(tx.amount)

    capture_request = CaptureRequest(
        authorization_code=tx.authorization_code,
        amount=amount,
        nsu=tx.nsu
    )

    response = await default_acquirer.capture(capture_request)

    if response.success:
        tx.status = "CAPTURED"
        tx.captured_at = datetime.utcnow()
        tx.captured_amount = amount
        db.commit()

        return {"message": "Transaction captured", "amount": amount}
    else:
        raise HTTPException(status_code=400, detail="Capture failed")


@app.post("/cards/transactions/{tx_id}/void")
async def void_transaction(tx_id: str, db=Depends(get_db)):
    """Void an authorized (not captured) transaction"""
    tx = db.query(CardTransaction).filter(CardTransaction.id == tx_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    if tx.status != "AUTHORIZED":
        raise HTTPException(status_code=400, detail=f"Cannot void {tx.status} transaction")

    response = await default_acquirer.void(tx.authorization_code, tx.nsu)

    if response.success:
        tx.status = "VOIDED"
        db.commit()

        # Restore card limit
        card = db.query(Card).filter(Card.id == tx.card_id).first()
        if card:
            card.available_limit = float(card.available_limit) + float(tx.amount)
            card.used_today = max(0, float(card.used_today) - float(tx.amount))
            card.used_month = max(0, float(card.used_month) - float(tx.amount))
            db.commit()

        return {"message": "Transaction voided"}
    else:
        raise HTTPException(status_code=400, detail="Void failed")


@app.post("/cards/transactions/{tx_id}/refund")
async def refund_transaction(
    tx_id: str,
    refund: RefundRequestModel,
    db=Depends(get_db)
):
    """Refund a captured transaction"""
    tx = db.query(CardTransaction).filter(CardTransaction.id == tx_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    if tx.status != "CAPTURED":
        raise HTTPException(status_code=400, detail=f"Cannot refund {tx.status} transaction")

    if refund.amount > float(tx.captured_amount):
        raise HTTPException(status_code=400, detail="Refund exceeds captured amount")

    refund_request = RefundRequest(
        authorization_code=tx.authorization_code,
        amount=refund.amount,
        nsu=tx.nsu,
        reason=refund.reason
    )

    response = await default_acquirer.refund(refund_request)

    if response.success:
        tx.status = "REFUNDED" if refund.amount == float(tx.captured_amount) else "CAPTURED"
        db.commit()

        # Restore card limit
        card = db.query(Card).filter(Card.id == tx.card_id).first()
        if card:
            card.available_limit = float(card.available_limit) + refund.amount
            db.commit()

        return {"message": "Transaction refunded", "amount": refund.amount}
    else:
        raise HTTPException(status_code=400, detail="Refund failed")


@app.get("/cards/transactions")
def list_transactions(
    card_id: Optional[str] = None,
    customer_id: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = Query(default=50, le=100),
    offset: int = 0,
    db=Depends(get_db)
):
    """List card transactions"""
    query = db.query(CardTransaction)

    if card_id:
        query = query.filter(CardTransaction.card_id == card_id)
    if customer_id:
        query = query.filter(CardTransaction.customer_id == customer_id)
    if status:
        query = query.filter(CardTransaction.status == status.upper())

    total = query.count()
    transactions = query.order_by(
        CardTransaction.created_at.desc()
    ).offset(offset).limit(limit).all()

    return {
        "total": total,
        "transactions": [
            {
                "id": tx.id,
                "authorization_code": tx.authorization_code,
                "amount": float(tx.amount),
                "currency": tx.currency,
                "merchant_name": tx.merchant_name,
                "status": tx.status,
                "installments": tx.installments,
                "created_at": tx.created_at.isoformat(),
                "captured_at": tx.captured_at.isoformat() if tx.captured_at else None
            }
            for tx in transactions
        ]
    }


# ============ 3DS ============

@app.post("/cards/3ds/complete")
async def complete_3ds(request: ThreeDSCompleteRequest, db=Depends(get_db)):
    """Complete 3DS challenge"""
    session = db.query(ThreeDS).filter(
        ThreeDS.server_trans_id == request.session_id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="3DS session not found")

    if session.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="3DS session expired")

    # Complete challenge
    result = await threeds_client.complete_challenge(request.session_id, request.cres)

    session.status = "AUTHENTICATED" if result.success else "FAILED"
    session.trans_status = result.trans_status.value
    session.eci = result.eci
    session.authentication_value = result.cavv
    session.completed_at = datetime.utcnow()

    # Update transaction
    tx = db.query(CardTransaction).filter(
        CardTransaction.id == session.transaction_id
    ).first()

    if tx and result.success:
        tx.three_ds_status = "AUTHENTICATED"
        tx.eci = result.eci

        # Now authorize with acquirer
        card = db.query(Card).filter(Card.id == tx.card_id).first()

        acquirer_request = AuthorizationRequest(
            card_token=card.token,
            amount=float(tx.amount),
            currency=tx.currency,
            merchant_id=tx.merchant_id,
            merchant_name=tx.merchant_name,
            merchant_category_code=tx.merchant_category_code,
            installments=tx.installments,
            capture=True,
            three_ds={"cavv": result.cavv, "eci": result.eci}
        )

        acquirer_response = await default_acquirer.authorize(acquirer_request)

        if acquirer_response.success:
            tx.authorization_code = acquirer_response.authorization_code
            tx.nsu = acquirer_response.nsu
            tx.status = "CAPTURED"
            tx.authorized_at = datetime.utcnow()
            tx.captured_at = datetime.utcnow()

            update_card_usage(db, card, float(tx.amount))
        else:
            tx.status = "DECLINED"
            tx.decline_code = acquirer_response.decline_code
            tx.decline_reason = acquirer_response.decline_message

    db.commit()

    return {
        "success": result.success,
        "transaction_id": tx.id if tx else None,
        "status": tx.status if tx else None,
        "authorization_code": tx.authorization_code if tx else None
    }


# ============ Invoices ============

@app.get("/cards/{card_id}/invoice")
def get_current_invoice(card_id: str, db=Depends(get_db)):
    """Get current open invoice for card"""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    # Get or create current month's invoice
    current_month = datetime.utcnow().strftime("%Y-%m")

    invoice = db.query(CardInvoice).filter(
        CardInvoice.card_id == card_id,
        CardInvoice.reference_month == current_month
    ).first()

    if not invoice:
        # Create new invoice
        now = datetime.utcnow()
        close_date = datetime(now.year, now.month, 25)  # Closes on 25th
        due_date = close_date + timedelta(days=10)  # Due 10 days after close

        if now.day > 25:
            close_date = datetime(now.year, now.month + 1, 25) if now.month < 12 else datetime(now.year + 1, 1, 25)
            due_date = close_date + timedelta(days=10)

        invoice = CardInvoice(
            id=str(uuid.uuid4()),
            card_id=card_id,
            customer_id=card.customer_id,
            account_id=card.account_id,
            reference_month=current_month,
            period_start=datetime(now.year, now.month, 1),
            period_end=close_date,
            close_date=close_date,
            due_date=due_date,
            status="OPEN"
        )
        db.add(invoice)
        db.commit()

    # Get transactions for this invoice period
    transactions = db.query(CardTransaction).filter(
        CardTransaction.card_id == card_id,
        CardTransaction.status == "CAPTURED",
        CardTransaction.created_at >= invoice.period_start,
        CardTransaction.created_at < invoice.close_date
    ).all()

    total = sum(float(tx.amount) for tx in transactions)

    return {
        "id": invoice.id,
        "reference_month": invoice.reference_month,
        "close_date": invoice.close_date.isoformat(),
        "due_date": invoice.due_date.isoformat(),
        "total_amount": total,
        "minimum_payment": total * 0.15,  # 15% minimum
        "status": invoice.status,
        "transactions": [
            {
                "id": tx.id,
                "merchant_name": tx.merchant_name,
                "amount": float(tx.amount),
                "installments": tx.installments,
                "date": tx.created_at.isoformat()
            }
            for tx in transactions
        ]
    }


@app.get("/cards/{card_id}/invoices")
def list_invoices(card_id: str, db=Depends(get_db)):
    """List all invoices for a card"""
    invoices = db.query(CardInvoice).filter(
        CardInvoice.card_id == card_id
    ).order_by(CardInvoice.reference_month.desc()).all()

    return [
        {
            "id": inv.id,
            "reference_month": inv.reference_month,
            "total_amount": float(inv.total_amount),
            "paid_amount": float(inv.paid_amount),
            "due_date": inv.due_date.isoformat(),
            "status": inv.status
        }
        for inv in invoices
    ]


@app.post("/cards/{card_id}/invoice/pay")
async def pay_invoice(
    card_id: str,
    payment: InvoicePayRequest,
    db=Depends(get_db)
):
    """Pay card invoice"""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    # Get current invoice
    current_month = datetime.utcnow().strftime("%Y-%m")
    invoice = db.query(CardInvoice).filter(
        CardInvoice.card_id == card_id,
        CardInvoice.reference_month == current_month,
        CardInvoice.status.in_(["OPEN", "CLOSED", "PARTIAL"])
    ).first()

    if not invoice:
        raise HTTPException(status_code=404, detail="No payable invoice found")

    # Calculate remaining
    remaining = float(invoice.total_amount) - float(invoice.paid_amount)
    pay_amount = payment.amount or remaining

    if pay_amount > remaining:
        raise HTTPException(status_code=400, detail="Payment exceeds invoice balance")

    # Debit from account
    if payment.payment_method == "BALANCE":
        success = await debit_account(
            card.account_id,
            pay_amount,
            f"Pagamento fatura {invoice.reference_month}"
        )
        if not success:
            raise HTTPException(status_code=400, detail="Insufficient balance")

    # Update invoice
    invoice.paid_amount = float(invoice.paid_amount) + pay_amount
    invoice.paid_at = datetime.utcnow()
    invoice.payment_method = payment.payment_method

    if invoice.paid_amount >= float(invoice.total_amount):
        invoice.status = "PAID"
    else:
        invoice.status = "PARTIAL"

    # Restore card limit
    card.available_limit = float(card.available_limit) + pay_amount

    db.commit()

    return {
        "message": "Payment processed",
        "amount_paid": pay_amount,
        "remaining": float(invoice.total_amount) - float(invoice.paid_amount),
        "status": invoice.status
    }


# ============ Disputes ============

@app.post("/cards/disputes")
def create_dispute(dispute_data: DisputeCreate, db=Depends(get_db)):
    """Create a transaction dispute"""
    tx = db.query(CardTransaction).filter(
        CardTransaction.id == dispute_data.transaction_id
    ).first()

    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    if tx.status not in ["CAPTURED", "REFUNDED"]:
        raise HTTPException(status_code=400, detail="Cannot dispute this transaction")

    # Check for existing dispute
    existing = db.query(CardDispute).filter(
        CardDispute.transaction_id == dispute_data.transaction_id,
        CardDispute.status.in_(["OPEN", "UNDER_REVIEW"])
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Dispute already exists")

    dispute = CardDispute(
        id=str(uuid.uuid4()),
        card_id=tx.card_id,
        transaction_id=tx.id,
        customer_id=tx.customer_id,
        dispute_type=dispute_data.dispute_type.upper(),
        description=dispute_data.description,
        amount=float(tx.amount),
        status="OPEN",
        deadline_at=datetime.utcnow() + timedelta(days=45)
    )

    db.add(dispute)
    db.commit()

    return {
        "id": dispute.id,
        "status": dispute.status,
        "deadline": dispute.deadline_at.isoformat()
    }


@app.get("/cards/disputes")
def list_disputes(
    card_id: Optional[str] = None,
    status: Optional[str] = None,
    db=Depends(get_db)
):
    """List disputes"""
    query = db.query(CardDispute)

    if card_id:
        query = query.filter(CardDispute.card_id == card_id)
    if status:
        query = query.filter(CardDispute.status == status.upper())

    disputes = query.order_by(CardDispute.created_at.desc()).all()

    return [
        {
            "id": d.id,
            "transaction_id": d.transaction_id,
            "dispute_type": d.dispute_type,
            "amount": float(d.amount),
            "status": d.status,
            "created_at": d.created_at.isoformat(),
            "deadline_at": d.deadline_at.isoformat()
        }
        for d in disputes
    ]


# ============ Merchant Blocks ============

@app.post("/cards/{card_id}/blocked-merchants")
def block_merchant(
    card_id: str,
    merchant_id: Optional[str] = None,
    merchant_name: Optional[str] = None,
    mcc: Optional[str] = None,
    reason: Optional[str] = None,
    db=Depends(get_db)
):
    """Block a merchant for this card"""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    block = MerchantBlock(
        id=str(uuid.uuid4()),
        card_id=card_id,
        merchant_id=merchant_id,
        merchant_name_pattern=merchant_name,
        mcc=mcc,
        reason=reason
    )

    db.add(block)
    db.commit()

    return {"id": block.id, "message": "Merchant blocked"}


@app.get("/cards/{card_id}/blocked-merchants")
def list_blocked_merchants(card_id: str, db=Depends(get_db)):
    """List blocked merchants for a card"""
    blocks = db.query(MerchantBlock).filter(
        MerchantBlock.card_id == card_id
    ).all()

    return [
        {
            "id": b.id,
            "merchant_id": b.merchant_id,
            "merchant_name_pattern": b.merchant_name_pattern,
            "mcc": b.mcc,
            "reason": b.reason
        }
        for b in blocks
    ]


@app.delete("/cards/blocked-merchants/{block_id}")
def unblock_merchant(block_id: str, db=Depends(get_db)):
    """Remove a merchant block"""
    block = db.query(MerchantBlock).filter(MerchantBlock.id == block_id).first()
    if not block:
        raise HTTPException(status_code=404, detail="Block not found")

    db.delete(block)
    db.commit()

    return {"message": "Merchant unblocked"}


# ============ Legacy Compatibility ============

@app.get("/cards/{customer_id}")
def legacy_list_cards(customer_id: str, db=Depends(get_db)):
    """Legacy endpoint - list cards by customer"""
    return list_cards(customer_id=customer_id, db=db)
