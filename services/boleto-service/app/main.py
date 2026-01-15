"""
Athena Boleto Service
Brazilian bank slip generation, payment, and CNAB processing
"""
import os
import uuid
import logging
from datetime import datetime, date, timedelta
from typing import Optional, List
from decimal import Decimal

from fastapi import FastAPI, HTTPException, Depends, Query, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, Field, validator
import httpx

from app.db import SessionLocal, ensure_schema
from app.models import Boleto, BoletoRemittance, BoletoReturn, BoletoHistory, BoletoConfig
from app.barcode import (
    generate_barcode, generate_digitable_line, parse_digitable_line,
    validate_barcode, validate_digitable_line, BoletoParams
)

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
    title="Athena Boleto Service",
    description="Boleto generation, payment processing, and CNAB integration",
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

class BoletoCreate(BaseModel):
    account_id: str
    customer_id: str
    amount: float = Field(..., gt=0)
    due_date: str = Field(..., description="YYYY-MM-DD")
    payer_name: str
    payer_document: str
    payer_address: Optional[dict] = None
    document_number: Optional[str] = None
    instructions: Optional[str] = None
    late_fee_percentage: float = Field(default=2.0, ge=0, le=10)
    daily_interest_percentage: float = Field(default=0.033, ge=0, le=1)
    discount_amount: Optional[float] = None
    discount_deadline: Optional[str] = None

    @validator('due_date')
    def validate_due_date(cls, v):
        try:
            due = datetime.strptime(v, "%Y-%m-%d").date()
            if due < date.today():
                raise ValueError("Due date cannot be in the past")
            return v
        except ValueError as e:
            raise ValueError(f"Invalid date format: {e}")


class BoletoResponse(BaseModel):
    id: str
    barcode: str
    digitable_line: str
    our_number: str
    amount: float
    due_date: str
    payer_name: str
    status: str
    pdf_url: Optional[str]
    created_at: datetime


class BoletoPayRequest(BaseModel):
    digitable_line: Optional[str] = None
    barcode: Optional[str] = None
    payer_account_id: str
    payer_document: str


class BoletoPayResponse(BaseModel):
    success: bool
    boleto_id: str
    amount_paid: float
    original_amount: float
    discount: float
    fine: float
    interest: float
    paid_at: datetime


class ConfigCreate(BaseModel):
    account_id: str
    bank_code: str
    branch: str
    bank_account: str
    wallet: str = "109"
    beneficiary_name: str
    beneficiary_document: str
    default_late_fee: float = 2.0
    default_daily_interest: float = 0.033
    default_instructions: Optional[str] = None


# ============ Helper Functions ============

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_config(db, account_id: str) -> BoletoConfig:
    """Get boleto configuration for an account"""
    config = db.query(BoletoConfig).filter(
        BoletoConfig.account_id == account_id,
        BoletoConfig.is_active == True
    ).first()

    if not config:
        # Return default config for development
        if ENV == "dev":
            return BoletoConfig(
                id=str(uuid.uuid4()),
                account_id=account_id,
                bank_code="341",
                branch="0001",
                bank_account="12345678",
                wallet="109",
                beneficiary_name="ATHENA PAY LTDA",
                beneficiary_document="12.345.678/0001-90",
                next_our_number=1
            )
        raise HTTPException(
            status_code=400,
            detail="Boleto configuration not found for this account"
        )

    return config


def get_next_our_number(db, config: BoletoConfig) -> str:
    """Get and increment our_number sequence"""
    our_number = str(config.next_our_number).zfill(10)
    config.next_our_number += 1
    db.commit()
    return our_number


async def credit_account(account_id: str, amount: float, description: str):
    """Credit an account via accounts service"""
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
        raise


async def debit_account(account_id: str, amount: float, description: str) -> bool:
    """Debit an account via accounts service"""
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


def calculate_payment_amount(boleto: Boleto, payment_date: date = None) -> dict:
    """
    Calculate total payment amount including fine and interest
    """
    if payment_date is None:
        payment_date = date.today()

    original_amount = float(boleto.amount)
    discount = 0.0
    fine = 0.0
    interest = 0.0

    due_date = boleto.due_date.date() if isinstance(boleto.due_date, datetime) else boleto.due_date

    # Apply discount if within deadline
    if boleto.discount_deadline and boleto.discount_amount:
        discount_deadline = boleto.discount_deadline.date() if isinstance(boleto.discount_deadline, datetime) else boleto.discount_deadline
        if payment_date <= discount_deadline:
            discount = float(boleto.discount_amount)

    # Calculate fine and interest if overdue
    if payment_date > due_date:
        days_overdue = (payment_date - due_date).days

        # Fine (multa) - fixed percentage
        fine = original_amount * (boleto.late_fee_percentage / 100)

        # Interest (juros) - daily percentage
        interest = original_amount * (boleto.daily_interest_percentage / 100) * days_overdue

    total = original_amount - discount + fine + interest

    return {
        "original_amount": original_amount,
        "discount": discount,
        "fine": fine,
        "interest": interest,
        "total": round(total, 2)
    }


def add_history(db, boleto_id: str, previous: str, new: str, source: str, reference: str = None, reason: str = None):
    """Add boleto history entry"""
    history = BoletoHistory(
        id=str(uuid.uuid4()),
        boleto_id=boleto_id,
        previous_status=previous,
        new_status=new,
        change_reason=reason,
        source=source,
        reference=reference
    )
    db.add(history)
    db.commit()


# ============ Health Check ============

@app.get("/health")
def health():
    return {"status": "healthy", "service": "boleto-service", "version": "2.0.0"}


# ============ Configuration ============

@app.post("/boleto/config")
def create_config(config_data: ConfigCreate, db=Depends(get_db)):
    """Create or update boleto configuration for an account"""
    existing = db.query(BoletoConfig).filter(
        BoletoConfig.account_id == config_data.account_id
    ).first()

    if existing:
        # Update existing
        for key, value in config_data.dict().items():
            if hasattr(existing, key) and value is not None:
                setattr(existing, key, value)
        db.commit()
        return {"message": "Configuration updated", "id": existing.id}

    config = BoletoConfig(
        id=str(uuid.uuid4()),
        **config_data.dict()
    )
    db.add(config)
    db.commit()

    return {"message": "Configuration created", "id": config.id}


@app.get("/boleto/config/{account_id}")
def get_config_endpoint(account_id: str, db=Depends(get_db)):
    """Get boleto configuration for an account"""
    config = db.query(BoletoConfig).filter(
        BoletoConfig.account_id == account_id
    ).first()

    if not config:
        raise HTTPException(status_code=404, detail="Configuration not found")

    return {
        "id": config.id,
        "bank_code": config.bank_code,
        "branch": config.branch,
        "bank_account": config.bank_account,
        "wallet": config.wallet,
        "beneficiary_name": config.beneficiary_name,
        "next_our_number": config.next_our_number
    }


# ============ Boleto Generation ============

@app.post("/boleto/generate", response_model=BoletoResponse)
def generate_boleto(boleto_data: BoletoCreate, db=Depends(get_db)):
    """
    Generate a new boleto

    Creates barcode, digitable line, and stores boleto data
    """
    # Get configuration
    config = get_config(db, boleto_data.account_id)

    # Get next our_number
    our_number = get_next_our_number(db, config)

    # Parse due date
    due_date = datetime.strptime(boleto_data.due_date, "%Y-%m-%d").date()

    # Generate barcode
    params = BoletoParams(
        bank_code=config.bank_code,
        currency_code="9",
        amount=boleto_data.amount,
        due_date=due_date,
        beneficiary_branch=config.branch,
        beneficiary_account=config.bank_account,
        our_number=our_number,
        wallet=config.wallet
    )

    barcode = generate_barcode(params)
    digitable_line = generate_digitable_line(barcode)

    # Parse discount deadline if provided
    discount_deadline = None
    if boleto_data.discount_deadline:
        discount_deadline = datetime.strptime(boleto_data.discount_deadline, "%Y-%m-%d")

    # Create boleto record
    boleto = Boleto(
        id=str(uuid.uuid4()),
        account_id=boleto_data.account_id,
        customer_id=boleto_data.customer_id,
        our_number=our_number,
        document_number=boleto_data.document_number or our_number,
        barcode=barcode,
        digitable_line=digitable_line,
        bank_code=config.bank_code,
        branch=config.branch,
        bank_account=config.bank_account,
        wallet=config.wallet,
        beneficiary_name=config.beneficiary_name,
        beneficiary_document=config.beneficiary_document,
        payer_name=boleto_data.payer_name,
        payer_document=boleto_data.payer_document,
        payer_address=boleto_data.payer_address,
        amount=boleto_data.amount,
        discount_amount=boleto_data.discount_amount or 0,
        discount_deadline=discount_deadline,
        due_date=datetime.combine(due_date, datetime.min.time()),
        instructions=boleto_data.instructions or config.default_instructions,
        late_fee_percentage=boleto_data.late_fee_percentage,
        daily_interest_percentage=boleto_data.daily_interest_percentage,
        status="PENDING"
    )

    db.add(boleto)
    db.commit()

    logger.info(f"Boleto generated: {boleto.id} - {our_number}")

    return BoletoResponse(
        id=boleto.id,
        barcode=boleto.barcode,
        digitable_line=boleto.digitable_line,
        our_number=boleto.our_number,
        amount=float(boleto.amount),
        due_date=boleto.due_date.strftime("%Y-%m-%d"),
        payer_name=boleto.payer_name,
        status=boleto.status,
        pdf_url=boleto.pdf_url,
        created_at=boleto.created_at
    )


@app.get("/boleto/{boleto_id}", response_model=BoletoResponse)
def get_boleto(boleto_id: str, db=Depends(get_db)):
    """Get boleto by ID"""
    boleto = db.query(Boleto).filter(Boleto.id == boleto_id).first()
    if not boleto:
        raise HTTPException(status_code=404, detail="Boleto not found")

    return BoletoResponse(
        id=boleto.id,
        barcode=boleto.barcode,
        digitable_line=boleto.digitable_line,
        our_number=boleto.our_number,
        amount=float(boleto.amount),
        due_date=boleto.due_date.strftime("%Y-%m-%d"),
        payer_name=boleto.payer_name,
        status=boleto.status,
        pdf_url=boleto.pdf_url,
        created_at=boleto.created_at
    )


@app.get("/boleto")
def list_boletos(
    account_id: Optional[str] = None,
    customer_id: Optional[str] = None,
    status: Optional[str] = None,
    due_date_from: Optional[str] = None,
    due_date_to: Optional[str] = None,
    limit: int = Query(default=50, le=100),
    offset: int = 0,
    db=Depends(get_db)
):
    """List boletos with filters"""
    query = db.query(Boleto)

    if account_id:
        query = query.filter(Boleto.account_id == account_id)
    if customer_id:
        query = query.filter(Boleto.customer_id == customer_id)
    if status:
        query = query.filter(Boleto.status == status.upper())
    if due_date_from:
        query = query.filter(Boleto.due_date >= datetime.strptime(due_date_from, "%Y-%m-%d"))
    if due_date_to:
        query = query.filter(Boleto.due_date <= datetime.strptime(due_date_to, "%Y-%m-%d"))

    total = query.count()
    boletos = query.order_by(Boleto.due_date.desc()).offset(offset).limit(limit).all()

    return {
        "total": total,
        "boletos": [
            {
                "id": b.id,
                "our_number": b.our_number,
                "barcode": b.barcode,
                "digitable_line": b.digitable_line,
                "amount": float(b.amount),
                "due_date": b.due_date.strftime("%Y-%m-%d"),
                "payer_name": b.payer_name,
                "status": b.status,
                "created_at": b.created_at.isoformat()
            }
            for b in boletos
        ]
    }


@app.delete("/boleto/{boleto_id}")
def cancel_boleto(boleto_id: str, db=Depends(get_db)):
    """Cancel a boleto"""
    boleto = db.query(Boleto).filter(Boleto.id == boleto_id).first()
    if not boleto:
        raise HTTPException(status_code=404, detail="Boleto not found")

    if boleto.status not in ["PENDING", "REGISTERED"]:
        raise HTTPException(status_code=400, detail=f"Cannot cancel boleto with status {boleto.status}")

    previous_status = boleto.status
    boleto.status = "CANCELLED"
    db.commit()

    add_history(db, boleto.id, previous_status, "CANCELLED", "API", reason="Manual cancellation")

    return {"message": "Boleto cancelled"}


# ============ Boleto Payment ============

@app.post("/boleto/pay", response_model=BoletoPayResponse)
async def pay_boleto(payment: BoletoPayRequest, db=Depends(get_db)):
    """
    Pay a boleto

    Can pay by digitable line or barcode
    Calculates fine and interest if overdue
    """
    # Find boleto
    boleto = None

    if payment.barcode:
        boleto = db.query(Boleto).filter(Boleto.barcode == payment.barcode).first()
    elif payment.digitable_line:
        # Clean digitable line
        clean_line = payment.digitable_line.replace(" ", "").replace(".", "")
        boleto = db.query(Boleto).filter(
            Boleto.digitable_line.like(f"%{clean_line[:20]}%")
        ).first()

        # If not found internally, this might be an external boleto
        if not boleto:
            # Parse the digitable line to get info
            try:
                parsed = parse_digitable_line(payment.digitable_line)
                # For external boletos, we would integrate with the bank
                # For now, return an error
                raise HTTPException(
                    status_code=400,
                    detail="External boleto payment not yet supported"
                )
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Invalid digitable line: {e}")

    if not boleto:
        raise HTTPException(status_code=404, detail="Boleto not found")

    if boleto.status not in ["PENDING", "REGISTERED"]:
        raise HTTPException(status_code=400, detail=f"Boleto status is {boleto.status}")

    # Calculate payment amount
    payment_calc = calculate_payment_amount(boleto)
    total_amount = payment_calc["total"]

    # Debit payer account
    success = await debit_account(
        payment.payer_account_id,
        total_amount,
        f"Pagamento boleto {boleto.our_number}"
    )

    if not success:
        raise HTTPException(status_code=400, detail="Insufficient funds")

    # Credit beneficiary account
    await credit_account(
        boleto.account_id,
        float(boleto.amount),  # Original amount goes to beneficiary
        f"Recebimento boleto {boleto.our_number}"
    )

    # Update boleto
    previous_status = boleto.status
    boleto.status = "PAID"
    boleto.paid_at = datetime.utcnow()
    boleto.paid_amount = total_amount
    boleto.fine_amount = payment_calc["fine"]
    boleto.interest_amount = payment_calc["interest"]
    boleto.payment_channel = "ATHENA"

    db.commit()

    add_history(db, boleto.id, previous_status, "PAID", "API",
                reference=payment.payer_account_id,
                reason=f"Payment via Athena Pay")

    logger.info(f"Boleto paid: {boleto.id} - R$ {total_amount}")

    return BoletoPayResponse(
        success=True,
        boleto_id=boleto.id,
        amount_paid=total_amount,
        original_amount=payment_calc["original_amount"],
        discount=payment_calc["discount"],
        fine=payment_calc["fine"],
        interest=payment_calc["interest"],
        paid_at=boleto.paid_at
    )


@app.get("/boleto/calculate/{boleto_id}")
def calculate_payment(boleto_id: str, payment_date: Optional[str] = None, db=Depends(get_db)):
    """
    Calculate payment amount for a boleto

    Shows fine and interest if overdue
    """
    boleto = db.query(Boleto).filter(Boleto.id == boleto_id).first()
    if not boleto:
        raise HTTPException(status_code=404, detail="Boleto not found")

    pay_date = date.today()
    if payment_date:
        pay_date = datetime.strptime(payment_date, "%Y-%m-%d").date()

    return calculate_payment_amount(boleto, pay_date)


# ============ Validation ============

@app.post("/boleto/validate")
def validate_boleto(
    digitable_line: Optional[str] = None,
    barcode: Optional[str] = None
):
    """
    Validate a boleto digitable line or barcode

    Returns parsed information if valid
    """
    if digitable_line:
        validation = validate_digitable_line(digitable_line)

        if validation["valid"]:
            parsed = parse_digitable_line(digitable_line)
            return {
                "valid": True,
                "parsed": parsed
            }
        else:
            return {
                "valid": False,
                "errors": validation["errors"]
            }

    if barcode:
        is_valid = validate_barcode(barcode)
        return {"valid": is_valid}

    raise HTTPException(status_code=400, detail="Provide digitable_line or barcode")


# ============ CNAB Processing ============

@app.post("/boleto/cnab/upload")
async def upload_return_file(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None,
    db=Depends(get_db)
):
    """
    Upload and process CNAB return file

    Supports CNAB240 and CNAB400 formats
    """
    content = await file.read()
    content_str = content.decode('latin-1')  # CNAB uses Latin-1 encoding

    lines = content_str.split('\n')

    # Detect format by line length
    first_line = lines[0] if lines else ""
    file_type = "CNAB240" if len(first_line) >= 240 else "CNAB400"

    # Create return record
    return_record = BoletoReturn(
        id=str(uuid.uuid4()),
        file_type=file_type,
        file_name=file.filename,
        bank_code="",
        branch="",
        account="",
        total_records=len(lines),
        processed=False
    )
    db.add(return_record)
    db.commit()

    # Process in background
    if background_tasks:
        background_tasks.add_task(process_cnab_return, return_record.id, content_str, db)

    return {
        "id": return_record.id,
        "file_type": file_type,
        "total_records": len(lines),
        "status": "PROCESSING"
    }


async def process_cnab_return(return_id: str, content: str, db):
    """Process CNAB return file"""
    lines = content.split('\n')
    processed = 0
    errors = []

    return_record = db.query(BoletoReturn).filter(BoletoReturn.id == return_id).first()
    if not return_record:
        return

    for i, line in enumerate(lines):
        try:
            # Skip header and trailer
            if len(line) < 100:
                continue

            # Extract our_number (position varies by format)
            # This is a simplified implementation
            if return_record.file_type == "CNAB400":
                our_number = line[62:73].strip()
                occurrence_code = line[108:110]
                amount = float(line[152:165]) / 100

                # Find boleto
                boleto = db.query(Boleto).filter(
                    Boleto.our_number == our_number
                ).first()

                if boleto:
                    # Update based on occurrence code
                    if occurrence_code in ["06", "17"]:  # Liquidation
                        boleto.status = "PAID"
                        boleto.paid_at = datetime.utcnow()
                        boleto.paid_amount = amount
                        processed += 1
                    elif occurrence_code == "09":  # Rejected
                        boleto.status = "CANCELLED"
                        processed += 1

        except Exception as e:
            errors.append({"line": i, "error": str(e)})

    return_record.processed = True
    return_record.processed_at = datetime.utcnow()
    return_record.processed_boletos = processed
    return_record.errors = errors if errors else None
    db.commit()

    logger.info(f"CNAB return processed: {return_id} - {processed} boletos updated")


@app.get("/boleto/cnab/returns")
def list_return_files(
    processed: Optional[bool] = None,
    limit: int = Query(default=20, le=50),
    db=Depends(get_db)
):
    """List CNAB return files"""
    query = db.query(BoletoReturn)

    if processed is not None:
        query = query.filter(BoletoReturn.processed == processed)

    returns = query.order_by(BoletoReturn.created_at.desc()).limit(limit).all()

    return [
        {
            "id": r.id,
            "file_name": r.file_name,
            "file_type": r.file_type,
            "total_records": r.total_records,
            "processed_boletos": r.processed_boletos,
            "processed": r.processed,
            "created_at": r.created_at.isoformat()
        }
        for r in returns
    ]


# ============ PDF Generation ============

@app.get("/boleto/{boleto_id}/pdf")
def get_boleto_pdf(boleto_id: str, db=Depends(get_db)):
    """
    Get boleto PDF

    In production, this would generate a proper bank-formatted PDF
    For now, returns basic HTML that can be converted to PDF
    """
    boleto = db.query(Boleto).filter(Boleto.id == boleto_id).first()
    if not boleto:
        raise HTTPException(status_code=404, detail="Boleto not found")

    # Generate HTML representation
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Boleto - {boleto.our_number}</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 40px; }}
            .header {{ border-bottom: 2px solid #000; padding-bottom: 10px; }}
            .info {{ margin: 20px 0; }}
            .barcode {{ font-family: monospace; font-size: 14px; letter-spacing: 2px; }}
            .digitable {{ font-size: 18px; font-weight: bold; }}
            table {{ width: 100%; border-collapse: collapse; }}
            td {{ padding: 8px; border: 1px solid #ccc; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Banco {boleto.bank_code}</h1>
            <p class="digitable">{boleto.digitable_line}</p>
        </div>

        <div class="info">
            <table>
                <tr>
                    <td><strong>Beneficiário:</strong></td>
                    <td>{boleto.beneficiary_name}</td>
                    <td><strong>CNPJ:</strong></td>
                    <td>{boleto.beneficiary_document}</td>
                </tr>
                <tr>
                    <td><strong>Agência/Código:</strong></td>
                    <td>{boleto.branch} / {boleto.bank_account}</td>
                    <td><strong>Nosso Número:</strong></td>
                    <td>{boleto.our_number}</td>
                </tr>
                <tr>
                    <td><strong>Pagador:</strong></td>
                    <td>{boleto.payer_name}</td>
                    <td><strong>CPF/CNPJ:</strong></td>
                    <td>{boleto.payer_document}</td>
                </tr>
                <tr>
                    <td><strong>Vencimento:</strong></td>
                    <td>{boleto.due_date.strftime("%d/%m/%Y")}</td>
                    <td><strong>Valor:</strong></td>
                    <td>R$ {float(boleto.amount):,.2f}</td>
                </tr>
            </table>
        </div>

        <div class="instructions">
            <h3>Instruções</h3>
            <p>{boleto.instructions or "Não receber após o vencimento"}</p>
            <p>Multa de {boleto.late_fee_percentage}% após vencimento</p>
            <p>Juros de {boleto.daily_interest_percentage * 30:.2f}% ao mês</p>
        </div>

        <div class="barcode">
            <p><strong>Código de Barras:</strong></p>
            <p>{boleto.barcode}</p>
        </div>
    </body>
    </html>
    """

    return Response(content=html, media_type="text/html")


# ============ Statistics ============

@app.get("/boleto/stats/{account_id}")
def get_boleto_stats(
    account_id: str,
    period: str = Query(default="month", description="day, week, month"),
    db=Depends(get_db)
):
    """Get boleto statistics for an account"""
    now = datetime.utcnow()

    if period == "day":
        start = now - timedelta(days=1)
    elif period == "week":
        start = now - timedelta(weeks=1)
    else:
        start = now - timedelta(days=30)

    boletos = db.query(Boleto).filter(
        Boleto.account_id == account_id,
        Boleto.created_at >= start
    ).all()

    stats = {
        "total_generated": len(boletos),
        "total_amount": sum(float(b.amount) for b in boletos),
        "paid": len([b for b in boletos if b.status == "PAID"]),
        "paid_amount": sum(float(b.paid_amount or 0) for b in boletos if b.status == "PAID"),
        "pending": len([b for b in boletos if b.status == "PENDING"]),
        "expired": len([b for b in boletos if b.status == "EXPIRED"]),
        "cancelled": len([b for b in boletos if b.status == "CANCELLED"])
    }

    return stats


# ============ History ============

@app.get("/boleto/{boleto_id}/history")
def get_boleto_history(boleto_id: str, db=Depends(get_db)):
    """Get boleto status history"""
    history = db.query(BoletoHistory).filter(
        BoletoHistory.boleto_id == boleto_id
    ).order_by(BoletoHistory.created_at.desc()).all()

    return [
        {
            "previous_status": h.previous_status,
            "new_status": h.new_status,
            "reason": h.change_reason,
            "source": h.source,
            "reference": h.reference,
            "created_at": h.created_at.isoformat()
        }
        for h in history
    ]
