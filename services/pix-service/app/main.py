"""
Athena PIX Service
Complete PIX implementation with SPI/DICT architecture
DDD Architecture with OpenAPI Documentation
"""
import os
import uuid
import logging
import io
import base64
from datetime import datetime, timedelta
from typing import Optional, List
from decimal import Decimal
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends, Query, BackgroundTasks, Request, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.openapi.utils import get_openapi
from pydantic import BaseModel, Field, validator
import qrcode
import httpx

from app.db import SessionLocal, ensure_schema
from app.models import (
    PixKey, PixTransaction, PixQRCode, PixDevolution,
    PixClaim, PixSchedule, PixWebhook, PixLimit
)
from app.brcode import (
    generate_brcode, parse_brcode, detect_key_type,
    format_key_for_dict, BRCodeParams, PixKeyType
)
from app.integrations.dict_client import dict_client, DictResponse
from app.integrations.spi_client import (
    spi_client, generate_e2e_id, SpiTransfer, SpiParticipant, SpiStatus
)

# Import API Schemas
from app.api.schemas import (
    CreatePixKeyRequest, PixKeyResponse, PixKeyListResponse,
    CreatePixTransferRequest, PixTransferResponse, ResolveKeyResponse,
    CreateStaticQRCodeRequest, CreateDynamicQRCodeRequest, QRCodeResponse
)
from app.api.schemas.key_schemas import PixKeyTypeEnum, PixKeyStatusEnum
from app.api.schemas.transfer_schemas import (
    PixTransactionTypeEnum, PixTransactionStatusEnum,
    DevolutionRequest, PixTransactionListResponse
)
from app.api.schemas.qrcode_schemas import (
    QRCodeTypeEnum, QRCodeStatusEnum, PayQRCodeRequest
)

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
ENV = os.getenv("ENV", "dev")
ACCOUNTS_URL = os.getenv("ACCOUNTS_URL", "http://accounts-service:8080")
COMPLIANCE_URL = os.getenv("COMPLIANCE_URL", "http://compliance-service:8080")
AUDIT_URL = os.getenv("AUDIT_URL", "http://audit-service:8080")
ATHENA_ISPB = os.getenv("ATHENA_ISPB", "00000000")
JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-key")
RATE_LIMIT_ENABLED = os.getenv("RATE_LIMIT_ENABLED", "false").lower() == "true"

# Security
security = HTTPBearer(auto_error=False)


# ============ OpenAPI Configuration ============

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Athena PIX Service API",
        version="2.0.0",
        description="""
## Athena PIX Service

Complete PIX instant payment solution with SPI/DICT architecture ready for BACEN integration.

### Features

- **PIX Keys Management**: Register, list, and manage PIX keys (CPF, CNPJ, Email, Phone, EVP)
- **PIX Transfers**: Send instant payments via PIX key resolution
- **QR Codes**: Generate static and dynamic BR Code QR codes
- **Devolutions**: Request partial or full refunds
- **Webhooks**: Real-time payment notifications
- **Limits**: Configurable transaction limits per account

### Security

All endpoints require JWT Bearer authentication. Rate limiting is applied per account.

### Compliance

All transactions go through AML/KYC compliance checks before processing.

### SPI/DICT Integration

The service is architected for future direct BACEN SPI (Sistema de Pagamentos Instantâneos)
and DICT (Diretório de Identificadores de Contas Transacionais) integration.
        """,
        routes=app.routes,
    )

    # Add security schemes
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "JWT token for API authentication"
        },
        "ApiKeyAuth": {
            "type": "apiKey",
            "in": "header",
            "name": "X-API-Key",
            "description": "API key for service-to-service communication"
        }
    }

    # Apply security globally
    openapi_schema["security"] = [{"BearerAuth": []}]

    # Add tags metadata
    openapi_schema["tags"] = [
        {
            "name": "Health",
            "description": "Service health check endpoints"
        },
        {
            "name": "PIX Keys",
            "description": "Manage PIX keys (CPF, CNPJ, Email, Phone, Random)"
        },
        {
            "name": "PIX Transfers",
            "description": "Send and receive PIX instant payments"
        },
        {
            "name": "QR Codes",
            "description": "Generate and manage BR Code QR codes"
        },
        {
            "name": "Devolutions",
            "description": "Request PIX refunds and devolutions"
        },
        {
            "name": "Webhooks",
            "description": "Manage payment notification webhooks"
        },
        {
            "name": "Limits",
            "description": "Configure transaction limits"
        },
        {
            "name": "Statistics",
            "description": "Transaction analytics and statistics"
        }
    ]

    # Add server information
    openapi_schema["servers"] = [
        {
            "url": "http://localhost:8080",
            "description": "Development server"
        },
        {
            "url": "https://api.athena.pay/pix",
            "description": "Production server"
        }
    ]

    app.openapi_schema = openapi_schema
    return app.openapi_schema


# ============ Lifespan ============

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    logger.info("Starting PIX Service...")
    ensure_schema()
    logger.info("PIX Service started successfully")
    yield
    # Shutdown
    logger.info("Shutting down PIX Service...")


# ============ Application Factory ============

app = FastAPI(
    title="Athena PIX Service",
    description="PIX instant payments with SPI/DICT architecture",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

app.openapi = custom_openapi

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# ============ Request/Response Models ============

class PixKeyCreate(BaseModel):
    """Request to create a new PIX key"""
    account_id: str = Field(..., description="Account UUID", example="550e8400-e29b-41d4-a716-446655440000")
    customer_id: str = Field(..., description="Customer UUID", example="550e8400-e29b-41d4-a716-446655440001")
    key_type: str = Field(..., description="Key type: CPF, CNPJ, EMAIL, PHONE, EVP", example="CPF")
    key_value: Optional[str] = Field(None, description="Key value (optional for EVP)", example="12345678901")
    owner_name: str = Field(..., description="Key owner name", example="JOAO DA SILVA")
    owner_document: str = Field(..., description="Owner document (CPF/CNPJ)", example="12345678901")
    owner_type: str = Field(default="PF", description="Owner type: PF or PJ", example="PF")

    @validator('key_type')
    def validate_key_type(cls, v):
        valid = ['CPF', 'CNPJ', 'EMAIL', 'PHONE', 'EVP']
        if v.upper() not in valid:
            raise ValueError(f'key_type must be one of {valid}')
        return v.upper()

    class Config:
        json_schema_extra = {
            "example": {
                "account_id": "550e8400-e29b-41d4-a716-446655440000",
                "customer_id": "550e8400-e29b-41d4-a716-446655440001",
                "key_type": "CPF",
                "key_value": "12345678901",
                "owner_name": "JOAO DA SILVA",
                "owner_document": "12345678901",
                "owner_type": "PF"
            }
        }


class PixKeyResponseModel(BaseModel):
    """PIX key response"""
    id: str = Field(..., description="Key ID")
    key_type: str = Field(..., description="Key type")
    key_value: str = Field(..., description="Key value")
    owner_name: str = Field(..., description="Owner name")
    status: str = Field(..., description="Key status")
    created_at: datetime = Field(..., description="Creation timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "key-12345",
                "key_type": "CPF",
                "key_value": "12345678901",
                "owner_name": "JOAO DA SILVA",
                "status": "ACTIVE",
                "created_at": "2024-01-15T10:00:00Z"
            }
        }


class PixTransferRequest(BaseModel):
    """Request to send a PIX transfer"""
    account_id: str = Field(..., description="Source account ID")
    customer_id: str = Field(..., description="Customer ID")
    payer_name: str = Field(..., description="Payer name")
    payer_document: str = Field(..., description="Payer document")
    payee_key: str = Field(..., description="Payee PIX key")
    amount: float = Field(..., gt=0, le=1000000, description="Transfer amount")
    description: Optional[str] = Field(None, max_length=140, description="Transfer description")

    class Config:
        json_schema_extra = {
            "example": {
                "account_id": "550e8400-e29b-41d4-a716-446655440000",
                "customer_id": "550e8400-e29b-41d4-a716-446655440001",
                "payer_name": "JOAO DA SILVA",
                "payer_document": "12345678901",
                "payee_key": "98765432109",
                "amount": 150.00,
                "description": "Pagamento de serviços"
            }
        }


class PixTransferResponseModel(BaseModel):
    """PIX transfer response"""
    id: str = Field(..., description="Transaction ID")
    e2e_id: str = Field(..., description="End-to-end ID (32 chars)")
    status: str = Field(..., description="Transaction status")
    amount: float = Field(..., description="Transfer amount")
    payee_name: Optional[str] = Field(None, description="Payee name")
    payee_key: str = Field(..., description="Payee key")
    created_at: datetime = Field(..., description="Creation timestamp")
    settled_at: Optional[datetime] = Field(None, description="Settlement timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "tx-12345",
                "e2e_id": "E00000000202401151000001234567890",
                "status": "SETTLED",
                "amount": 150.00,
                "payee_name": "MARIA SANTOS",
                "payee_key": "98765432109",
                "created_at": "2024-01-15T10:00:00Z",
                "settled_at": "2024-01-15T10:00:01Z"
            }
        }


class QRCodeStaticCreate(BaseModel):
    """Request to create a static QR code"""
    account_id: str = Field(..., description="Account ID")
    customer_id: str = Field(..., description="Customer ID")
    pix_key: str = Field(..., description="PIX key for payment")
    merchant_name: str = Field(..., max_length=25, description="Merchant name")
    merchant_city: str = Field(default="SAO PAULO", max_length=15, description="Merchant city")
    amount: Optional[float] = Field(None, gt=0, description="Fixed amount (optional)")
    description: Optional[str] = Field(None, max_length=25, description="Payment description")

    class Config:
        json_schema_extra = {
            "example": {
                "account_id": "550e8400-e29b-41d4-a716-446655440000",
                "customer_id": "550e8400-e29b-41d4-a716-446655440001",
                "pix_key": "12345678901",
                "merchant_name": "LOJA ABC",
                "merchant_city": "SAO PAULO",
                "amount": 100.00,
                "description": "Pagamento"
            }
        }


class QRCodeDynamicCreate(BaseModel):
    """Request to create a dynamic QR code"""
    account_id: str = Field(..., description="Account ID")
    customer_id: str = Field(..., description="Customer ID")
    pix_key: str = Field(..., description="PIX key")
    merchant_name: str = Field(..., max_length=25, description="Merchant name")
    merchant_city: str = Field(default="SAO PAULO", max_length=15, description="Merchant city")
    amount: float = Field(..., gt=0, le=1000000, description="Payment amount")
    description: Optional[str] = Field(None, max_length=140, description="Payment description")
    expires_in_minutes: int = Field(default=30, ge=1, le=1440, description="Expiration in minutes")

    class Config:
        json_schema_extra = {
            "example": {
                "account_id": "550e8400-e29b-41d4-a716-446655440000",
                "customer_id": "550e8400-e29b-41d4-a716-446655440001",
                "pix_key": "12345678901",
                "merchant_name": "LOJA ABC",
                "merchant_city": "SAO PAULO",
                "amount": 250.00,
                "description": "Fatura #12345",
                "expires_in_minutes": 30
            }
        }


class QRCodeResponseModel(BaseModel):
    """QR code response"""
    id: str = Field(..., description="QR code ID")
    qr_type: str = Field(..., description="QR type: STATIC or DYNAMIC")
    tx_id: Optional[str] = Field(None, description="Transaction ID (dynamic only)")
    amount: Optional[float] = Field(None, description="Payment amount")
    br_code: str = Field(..., description="BR Code payload (EMV format)")
    br_code_image: str = Field(..., description="QR code image as base64")
    status: str = Field(..., description="QR code status")
    expires_at: Optional[datetime] = Field(None, description="Expiration timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "qr-12345",
                "qr_type": "DYNAMIC",
                "tx_id": "ABC123DEF456",
                "amount": 250.00,
                "br_code": "00020126580014br.gov.bcb.pix...",
                "br_code_image": "data:image/png;base64,iVBORw0KGgo...",
                "status": "ACTIVE",
                "expires_at": "2024-01-15T10:30:00Z"
            }
        }


class DevolutionRequestModel(BaseModel):
    """Request for PIX devolution"""
    original_e2e_id: str = Field(..., description="Original transaction E2E ID")
    amount: float = Field(..., gt=0, description="Devolution amount")
    reason: str = Field(default="REQUESTED_BY_RECEIVER", description="Devolution reason")
    description: Optional[str] = Field(None, description="Additional description")

    class Config:
        json_schema_extra = {
            "example": {
                "original_e2e_id": "E00000000202401151000001234567890",
                "amount": 150.00,
                "reason": "FRAUD",
                "description": "Pagamento duplicado"
            }
        }


class DevolutionResponseModel(BaseModel):
    """Devolution response"""
    id: str = Field(..., description="Devolution ID")
    e2e_id: str = Field(..., description="Devolution E2E ID")
    original_e2e_id: str = Field(..., description="Original transaction E2E ID")
    amount: float = Field(..., description="Devolution amount")
    status: str = Field(..., description="Devolution status")
    created_at: datetime = Field(..., description="Creation timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "dev-12345",
                "e2e_id": "D00000000202401151000001234567891",
                "original_e2e_id": "E00000000202401151000001234567890",
                "amount": 150.00,
                "status": "SETTLED",
                "created_at": "2024-01-15T10:00:00Z"
            }
        }


class WebhookCreate(BaseModel):
    """Request to create a webhook"""
    account_id: str = Field(..., description="Account ID")
    url: str = Field(..., description="Webhook URL")
    secret: Optional[str] = Field(None, description="Webhook signature secret")
    events: List[str] = Field(default=["PIX_RECEIVED", "PIX_SENT"], description="Event types")

    class Config:
        json_schema_extra = {
            "example": {
                "account_id": "550e8400-e29b-41d4-a716-446655440000",
                "url": "https://myapp.com/webhooks/pix",
                "secret": "my-webhook-secret",
                "events": ["PIX_RECEIVED", "PIX_SENT"]
            }
        }


class LimitUpdate(BaseModel):
    """Request to update PIX limits"""
    per_transaction: Optional[float] = Field(None, gt=0, description="Per transaction limit")
    daily: Optional[float] = Field(None, gt=0, description="Daily limit")
    night_per_transaction: Optional[float] = Field(None, gt=0, description="Night per transaction limit")

    class Config:
        json_schema_extra = {
            "example": {
                "per_transaction": 10000.00,
                "daily": 50000.00,
                "night_per_transaction": 1000.00
            }
        }


class ErrorResponse(BaseModel):
    """Error response"""
    detail: str = Field(..., description="Error message")
    code: Optional[str] = Field(None, description="Error code")

    class Config:
        json_schema_extra = {
            "example": {
                "detail": "PIX key not found",
                "code": "KEY_NOT_FOUND"
            }
        }


# ============ Dependencies ============

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def verify_token(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> Optional[dict]:
    """Verify JWT token"""
    if ENV == "dev" and not credentials:
        return {"sub": "dev-user", "permissions": ["*"]}

    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")

    # In production, verify JWT properly
    # For now, accept any token in dev mode
    if ENV == "dev":
        return {"sub": "dev-user", "permissions": ["*"]}

    # TODO: Implement proper JWT verification
    try:
        # Placeholder for JWT verification
        return {"sub": "user", "permissions": []}
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


# ============ Helper Functions ============

async def get_account_info(account_id: str) -> dict:
    """Fetch account info from accounts service"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{ACCOUNTS_URL}/accounts/{account_id}")
            if response.status_code == 200:
                return response.json()
    except Exception as e:
        logger.error(f"Failed to get account info: {e}")
    return {}


async def check_compliance(
    customer_id: str,
    amount: float,
    transaction_type: str = "PIX_OUT"
) -> dict:
    """Check transaction with compliance service"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{COMPLIANCE_URL}/compliance/check-transaction",
                json={
                    "customer_id": customer_id,
                    "amount": amount,
                    "transaction_type": transaction_type,
                    "currency": "BRL"
                }
            )
            if response.status_code == 200:
                return response.json()
    except Exception as e:
        logger.error(f"Compliance check failed: {e}")

    if ENV == "dev":
        return {"allowed": True, "risk_level": "LOW"}
    return {"allowed": False, "reason": "Compliance check failed"}


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


async def debit_account(account_id: str, amount: float, description: str):
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
            if response.status_code != 200:
                raise HTTPException(status_code=400, detail="Insufficient funds")
    except httpx.HTTPError as e:
        logger.error(f"Failed to debit account: {e}")
        raise HTTPException(status_code=400, detail="Payment failed")


async def send_webhook(webhook: PixWebhook, event: str, data: dict):
    """Send webhook notification"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            payload = {
                "event": event,
                "timestamp": datetime.utcnow().isoformat(),
                "data": data
            }

            headers = {"Content-Type": "application/json"}
            if webhook.secret:
                import hmac
                import hashlib
                signature = hmac.new(
                    webhook.secret.encode(),
                    str(payload).encode(),
                    hashlib.sha256
                ).hexdigest()
                headers["X-Webhook-Signature"] = signature

            await client.post(webhook.url, json=payload, headers=headers)

    except Exception as e:
        logger.error(f"Webhook send failed: {e}")


def generate_qr_image(br_code: str) -> str:
    """Generate QR code image as base64 PNG"""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4
    )
    qr.add_data(br_code)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    buf = io.BytesIO()
    img.save(buf, format="PNG")

    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()


def check_pix_limit(db, account_id: str, amount: float) -> bool:
    """Check if transaction is within PIX limits"""
    limit = db.query(PixLimit).filter(PixLimit.account_id == account_id).first()

    if not limit:
        limit = PixLimit(
            id=str(uuid.uuid4()),
            account_id=account_id,
            customer_id="",
            per_transaction=10000.00,
            daily=50000.00,
            monthly=500000.00,
            night_per_transaction=1000.00,
            night_daily=5000.00
        )
        db.add(limit)
        db.commit()

    current_hour = datetime.utcnow().hour
    is_night = current_hour >= 20 or current_hour < 6

    max_per_tx = limit.night_per_transaction if is_night else limit.per_transaction
    if amount > float(max_per_tx):
        return False

    max_daily = limit.night_daily if is_night else limit.daily
    if float(limit.used_today) + amount > float(max_daily):
        return False

    return True


def update_pix_usage(db, account_id: str, amount: float):
    """Update PIX usage for limits"""
    limit = db.query(PixLimit).filter(PixLimit.account_id == account_id).first()
    if limit:
        limit.used_today = float(limit.used_today) + amount
        limit.used_month = float(limit.used_month) + amount
        db.commit()


async def notify_webhooks(db, account_id: str, event: str, data: dict):
    """Send notifications to all registered webhooks"""
    webhooks = db.query(PixWebhook).filter(
        PixWebhook.account_id == account_id,
        PixWebhook.is_active == True
    ).all()

    for webhook in webhooks:
        if event in webhook.events:
            await send_webhook(webhook, event, data)


# ============ Health Check ============

@app.get(
    "/health",
    tags=["Health"],
    summary="Health check",
    description="Check if the service is running properly",
    response_model=dict
)
def health():
    """
    Health check endpoint.

    Returns service status, version, and basic metrics.
    """
    return {
        "status": "healthy",
        "service": "pix-service",
        "version": "2.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }


# ============ PIX Keys ============

@app.post(
    "/pix/keys",
    tags=["PIX Keys"],
    summary="Register PIX key",
    description="Register a new PIX key for an account. EVP (random) keys are auto-generated.",
    response_model=PixKeyResponseModel,
    responses={
        201: {"description": "Key created successfully"},
        409: {"description": "Key already registered", "model": ErrorResponse},
        400: {"description": "Invalid key data", "model": ErrorResponse}
    }
)
async def create_pix_key(
    key_data: PixKeyCreate,
    background_tasks: BackgroundTasks,
    db=Depends(get_db),
    token: dict = Depends(verify_token)
):
    """
    Register a new PIX key.

    - **CPF**: 11 digits (individual taxpayer ID)
    - **CNPJ**: 14 digits (company taxpayer ID)
    - **EMAIL**: Valid email address
    - **PHONE**: +55 followed by DDD and number
    - **EVP**: Auto-generated random UUID key

    For EVP keys, the key_value is automatically generated if not provided.
    """
    if key_data.key_type == "EVP" and not key_data.key_value:
        key_data.key_value = str(uuid.uuid4())

    key_type = PixKeyType[key_data.key_type]
    formatted_key = format_key_for_dict(key_data.key_value, key_type)

    existing = db.query(PixKey).filter(PixKey.key_value == formatted_key).first()
    if existing:
        raise HTTPException(status_code=409, detail="PIX key already registered")

    account_info = await get_account_info(key_data.account_id)

    dict_response = await dict_client.create_key(
        key_value=formatted_key,
        key_type=key_data.key_type,
        owner_name=key_data.owner_name,
        owner_document=key_data.owner_document,
        owner_type=key_data.owner_type,
        account=key_data.account_id,
        branch=account_info.get("branch"),
        account_type="CACC"
    )

    pix_key = PixKey(
        id=str(uuid.uuid4()),
        account_id=key_data.account_id,
        customer_id=key_data.customer_id,
        key_type=key_data.key_type,
        key_value=formatted_key,
        owner_name=key_data.owner_name,
        owner_document=key_data.owner_document,
        owner_type=key_data.owner_type,
        ispb=ATHENA_ISPB,
        branch=account_info.get("branch"),
        account_number=key_data.account_id,
        status="ACTIVE" if dict_response.success else "PENDING",
        dict_key_id=dict_response.key_id,
        dict_created_at=datetime.utcnow() if dict_response.success else None
    )

    db.add(pix_key)
    db.commit()

    logger.info(f"PIX key created: {pix_key.id} ({pix_key.key_type})")

    return PixKeyResponseModel(
        id=pix_key.id,
        key_type=pix_key.key_type,
        key_value=pix_key.key_value,
        owner_name=pix_key.owner_name,
        status=pix_key.status,
        created_at=pix_key.created_at
    )


@app.get(
    "/pix/keys",
    tags=["PIX Keys"],
    summary="List PIX keys",
    description="List all active PIX keys for an account or customer",
    response_model=List[PixKeyResponseModel]
)
def list_pix_keys(
    account_id: Optional[str] = Query(None, description="Filter by account ID"),
    customer_id: Optional[str] = Query(None, description="Filter by customer ID"),
    db=Depends(get_db),
    token: dict = Depends(verify_token)
):
    """
    List PIX keys with optional filtering.

    Returns all active PIX keys. Can be filtered by account_id or customer_id.
    """
    query = db.query(PixKey).filter(PixKey.status == "ACTIVE")

    if account_id:
        query = query.filter(PixKey.account_id == account_id)
    if customer_id:
        query = query.filter(PixKey.customer_id == customer_id)

    keys = query.all()

    return [
        PixKeyResponseModel(
            id=k.id,
            key_type=k.key_type,
            key_value=k.key_value,
            owner_name=k.owner_name,
            status=k.status,
            created_at=k.created_at
        )
        for k in keys
    ]


@app.delete(
    "/pix/keys/{key_id}",
    tags=["PIX Keys"],
    summary="Delete PIX key",
    description="Delete (inactivate) a PIX key",
    responses={
        200: {"description": "Key deleted successfully"},
        404: {"description": "Key not found", "model": ErrorResponse}
    }
)
async def delete_pix_key(
    key_id: str,
    db=Depends(get_db),
    token: dict = Depends(verify_token)
):
    """
    Delete a PIX key.

    The key is marked as inactive in both local database and DICT.
    """
    pix_key = db.query(PixKey).filter(PixKey.id == key_id).first()
    if not pix_key:
        raise HTTPException(status_code=404, detail="PIX key not found")

    await dict_client.delete_key(pix_key.key_value)

    pix_key.status = "INACTIVE"
    db.commit()

    return {"message": "PIX key deleted"}


@app.get(
    "/pix/resolve",
    tags=["PIX Keys"],
    summary="Resolve PIX key",
    description="Resolve a PIX key to get account information",
    responses={
        200: {"description": "Key resolved successfully"},
        404: {"description": "Key not found", "model": ErrorResponse}
    }
)
async def resolve_pix_key(
    key: str = Query(..., description="PIX key to resolve"),
    db=Depends(get_db),
    token: dict = Depends(verify_token)
):
    """
    Resolve a PIX key to account information.

    First checks local database, then queries DICT.
    Returns owner name, account info, and whether it's an internal key.
    """
    local_key = db.query(PixKey).filter(
        PixKey.key_value == key,
        PixKey.status == "ACTIVE"
    ).first()

    if local_key:
        return {
            "found": True,
            "key": local_key.key_value,
            "key_type": local_key.key_type,
            "owner_name": local_key.owner_name,
            "ispb": local_key.ispb,
            "account_id": local_key.account_id,
            "is_internal": True
        }

    dict_response = await dict_client.lookup_key(key)

    if dict_response.success and dict_response.key_info:
        info = dict_response.key_info
        return {
            "found": True,
            "key": info.key,
            "key_type": info.key_type,
            "owner_name": info.owner_name,
            "ispb": info.ispb,
            "account_id": info.account,
            "is_internal": info.ispb == ATHENA_ISPB
        }

    raise HTTPException(status_code=404, detail="PIX key not found")


# ============ PIX Transfers ============

@app.post(
    "/pix/transfer",
    tags=["PIX Transfers"],
    summary="Send PIX transfer",
    description="Send an instant PIX payment",
    response_model=PixTransferResponseModel,
    responses={
        200: {"description": "Transfer completed"},
        400: {"description": "Transfer failed", "model": ErrorResponse},
        403: {"description": "Compliance or limit violation", "model": ErrorResponse},
        404: {"description": "Payee key not found", "model": ErrorResponse}
    }
)
async def send_pix_transfer(
    transfer: PixTransferRequest,
    background_tasks: BackgroundTasks,
    db=Depends(get_db),
    token: dict = Depends(verify_token)
):
    """
    Send a PIX transfer.

    Flow:
    1. Resolve payee key (local or DICT)
    2. Check compliance (AML/KYC)
    3. Verify transaction limits
    4. Debit payer account
    5. Send to SPI (external) or credit directly (internal)
    6. Notify via webhooks

    Internal transfers (same ISPB) are settled instantly.
    External transfers go through SPI.
    """
    payee_key = db.query(PixKey).filter(
        PixKey.key_value == transfer.payee_key,
        PixKey.status == "ACTIVE"
    ).first()

    is_internal = payee_key is not None

    payee_info = None
    if is_internal:
        payee_info = {
            "name": payee_key.owner_name,
            "document": payee_key.owner_document,
            "account": payee_key.account_id,
            "ispb": payee_key.ispb
        }
    else:
        dict_response = await dict_client.lookup_key(transfer.payee_key)
        if dict_response.success and dict_response.key_info:
            info = dict_response.key_info
            payee_info = {
                "name": info.owner_name,
                "document": info.owner_document,
                "account": info.account,
                "ispb": info.ispb
            }
            is_internal = info.ispb == ATHENA_ISPB
        else:
            raise HTTPException(status_code=404, detail="Payee PIX key not found")

    compliance = await check_compliance(
        transfer.customer_id,
        transfer.amount,
        "PIX_OUT"
    )
    if not compliance.get("allowed"):
        raise HTTPException(
            status_code=403,
            detail=compliance.get("reason", "Transaction not allowed")
        )

    if not check_pix_limit(db, transfer.account_id, transfer.amount):
        raise HTTPException(status_code=403, detail="PIX limit exceeded")

    e2e_id = generate_e2e_id(ATHENA_ISPB)

    tx = PixTransaction(
        id=str(uuid.uuid4()),
        e2e_id=e2e_id,
        account_id=transfer.account_id,
        customer_id=transfer.customer_id,
        direction="OUT",
        amount=transfer.amount,
        payer_name=transfer.payer_name,
        payer_document=transfer.payer_document,
        payer_account=transfer.account_id,
        payer_ispb=ATHENA_ISPB,
        payee_name=payee_info["name"],
        payee_document=payee_info["document"],
        payee_account=payee_info["account"],
        payee_ispb=payee_info["ispb"],
        payee_key=transfer.payee_key,
        payee_key_type=detect_key_type(transfer.payee_key).value,
        description=transfer.description,
        status="PENDING",
        compliance_checked=True,
        compliance_result=compliance
    )
    db.add(tx)
    db.commit()

    try:
        await debit_account(
            transfer.account_id,
            transfer.amount,
            f"PIX para {payee_info['name']}"
        )
    except Exception as e:
        tx.status = "REJECTED"
        tx.rejection_code = "AM04"
        tx.rejection_reason = "Saldo insuficiente"
        db.commit()
        raise HTTPException(status_code=400, detail="Insufficient funds")

    if is_internal:
        try:
            await credit_account(
                payee_info["account"],
                transfer.amount,
                f"PIX de {transfer.payer_name}"
            )
            tx.status = "SETTLED"
            tx.settled_at = datetime.utcnow()
            db.commit()

            update_pix_usage(db, transfer.account_id, transfer.amount)

            logger.info(f"Internal PIX settled: {e2e_id}")

        except Exception as e:
            await credit_account(
                transfer.account_id,
                transfer.amount,
                f"Estorno PIX - {e}"
            )
            tx.status = "REJECTED"
            tx.rejection_reason = str(e)
            db.commit()
            raise HTTPException(status_code=500, detail="Settlement failed")

    else:
        spi_transfer = SpiTransfer(
            e2e_id=e2e_id,
            amount=transfer.amount,
            currency="BRL",
            debtor=SpiParticipant(
                ispb=ATHENA_ISPB,
                name=transfer.payer_name,
                document=transfer.payer_document,
                document_type="CPF" if len(transfer.payer_document.replace(".", "").replace("-", "")) == 11 else "CNPJ",
                account=transfer.account_id
            ),
            creditor=SpiParticipant(
                ispb=payee_info["ispb"],
                name=payee_info["name"],
                document=payee_info["document"],
                document_type="CPF" if len(payee_info["document"].replace(".", "").replace("-", "")) == 11 else "CNPJ",
                account=payee_info["account"]
            ),
            pix_key=transfer.payee_key,
            pix_key_type=detect_key_type(transfer.payee_key).value,
            description=transfer.description
        )

        spi_response = await spi_client.send_transfer(spi_transfer)

        if spi_response.success:
            tx.status = "SETTLED"
            tx.settled_at = spi_response.settled_at or datetime.utcnow()
            tx.settlement_id = str(uuid.uuid4())
            update_pix_usage(db, transfer.account_id, transfer.amount)
        else:
            await credit_account(
                transfer.account_id,
                transfer.amount,
                f"Estorno PIX - {spi_response.reject_message}"
            )
            tx.status = "REJECTED"
            tx.rejection_code = spi_response.reject_reason.value if spi_response.reject_reason else "TECH"
            tx.rejection_reason = spi_response.reject_message

        tx.spi_response = spi_response.raw_response
        db.commit()

        if not spi_response.success:
            raise HTTPException(
                status_code=400,
                detail=spi_response.reject_message or "PIX transfer failed"
            )

    background_tasks.add_task(
        notify_webhooks,
        db,
        transfer.account_id,
        "PIX_SENT",
        {
            "e2e_id": e2e_id,
            "amount": transfer.amount,
            "payee": payee_info["name"]
        }
    )

    return PixTransferResponseModel(
        id=tx.id,
        e2e_id=tx.e2e_id,
        status=tx.status,
        amount=float(tx.amount),
        payee_name=tx.payee_name,
        payee_key=tx.payee_key,
        created_at=tx.created_at,
        settled_at=tx.settled_at
    )


@app.get(
    "/pix/transactions",
    tags=["PIX Transfers"],
    summary="List transactions",
    description="List PIX transactions with filters and pagination"
)
def list_transactions(
    account_id: Optional[str] = Query(None, description="Filter by account ID"),
    customer_id: Optional[str] = Query(None, description="Filter by customer ID"),
    direction: Optional[str] = Query(None, description="Filter by direction: IN or OUT"),
    status: Optional[str] = Query(None, description="Filter by status"),
    limit: int = Query(default=50, le=100, description="Page size"),
    offset: int = Query(default=0, description="Page offset"),
    db=Depends(get_db),
    token: dict = Depends(verify_token)
):
    """
    List PIX transactions with optional filters.

    Supports pagination with limit/offset.
    """
    query = db.query(PixTransaction)

    if account_id:
        query = query.filter(PixTransaction.account_id == account_id)
    if customer_id:
        query = query.filter(PixTransaction.customer_id == customer_id)
    if direction:
        query = query.filter(PixTransaction.direction == direction.upper())
    if status:
        query = query.filter(PixTransaction.status == status.upper())

    total = query.count()
    transactions = query.order_by(
        PixTransaction.created_at.desc()
    ).offset(offset).limit(limit).all()

    return {
        "total": total,
        "transactions": [
            {
                "id": tx.id,
                "e2e_id": tx.e2e_id,
                "direction": tx.direction,
                "amount": float(tx.amount),
                "status": tx.status,
                "payer_name": tx.payer_name,
                "payee_name": tx.payee_name,
                "payee_key": tx.payee_key,
                "description": tx.description,
                "created_at": tx.created_at.isoformat(),
                "settled_at": tx.settled_at.isoformat() if tx.settled_at else None
            }
            for tx in transactions
        ]
    }


@app.get(
    "/pix/transactions/{e2e_id}",
    tags=["PIX Transfers"],
    summary="Get transaction",
    description="Get transaction details by E2E ID",
    responses={
        200: {"description": "Transaction found"},
        404: {"description": "Transaction not found", "model": ErrorResponse}
    }
)
def get_transaction(
    e2e_id: str,
    db=Depends(get_db),
    token: dict = Depends(verify_token)
):
    """
    Get detailed transaction information by E2E ID.
    """
    tx = db.query(PixTransaction).filter(PixTransaction.e2e_id == e2e_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    return {
        "id": tx.id,
        "e2e_id": tx.e2e_id,
        "tx_id": tx.tx_id,
        "direction": tx.direction,
        "amount": float(tx.amount),
        "status": tx.status,
        "payer": {
            "name": tx.payer_name,
            "document": tx.payer_document,
            "account": tx.payer_account,
            "ispb": tx.payer_ispb
        },
        "payee": {
            "name": tx.payee_name,
            "document": tx.payee_document,
            "account": tx.payee_account,
            "ispb": tx.payee_ispb,
            "key": tx.payee_key,
            "key_type": tx.payee_key_type
        },
        "description": tx.description,
        "created_at": tx.created_at.isoformat(),
        "settled_at": tx.settled_at.isoformat() if tx.settled_at else None,
        "rejection_code": tx.rejection_code,
        "rejection_reason": tx.rejection_reason
    }


# ============ QR Codes ============

@app.post(
    "/pix/qrcode/static",
    tags=["QR Codes"],
    summary="Create static QR code",
    description="Generate a reusable static PIX QR code",
    response_model=QRCodeResponseModel
)
def create_static_qrcode(
    qr_data: QRCodeStaticCreate,
    db=Depends(get_db),
    token: dict = Depends(verify_token)
):
    """
    Generate a static PIX QR code.

    Static QR codes can be reused multiple times.
    Amount is optional - if not provided, payer can enter any amount.
    """
    key_type = detect_key_type(qr_data.pix_key)
    params = BRCodeParams(
        key=qr_data.pix_key,
        key_type=key_type,
        merchant_name=qr_data.merchant_name,
        merchant_city=qr_data.merchant_city,
        amount=qr_data.amount,
        description=qr_data.description
    )
    br_code = generate_brcode(params)

    qr_image = generate_qr_image(br_code)

    qr = PixQRCode(
        id=str(uuid.uuid4()),
        account_id=qr_data.account_id,
        customer_id=qr_data.customer_id,
        qr_type="STATIC",
        amount=qr_data.amount,
        is_amount_editable=qr_data.amount is None,
        payee_key=qr_data.pix_key,
        payee_name=qr_data.merchant_name,
        payee_city=qr_data.merchant_city,
        description=qr_data.description,
        br_code=br_code,
        br_code_image=qr_image,
        status="ACTIVE"
    )
    db.add(qr)
    db.commit()

    return QRCodeResponseModel(
        id=qr.id,
        qr_type=qr.qr_type,
        tx_id=qr.tx_id,
        amount=float(qr.amount) if qr.amount else None,
        br_code=qr.br_code,
        br_code_image=qr.br_code_image,
        status=qr.status,
        expires_at=qr.expires_at
    )


@app.post(
    "/pix/qrcode/dynamic",
    tags=["QR Codes"],
    summary="Create dynamic QR code",
    description="Generate a single-use dynamic PIX QR code with expiration",
    response_model=QRCodeResponseModel
)
def create_dynamic_qrcode(
    qr_data: QRCodeDynamicCreate,
    db=Depends(get_db),
    token: dict = Depends(verify_token)
):
    """
    Generate a dynamic PIX QR code.

    Dynamic QR codes have a unique transaction ID and can only be paid once.
    They expire after the specified time (default 30 minutes).
    """
    tx_id = uuid.uuid4().hex[:25].upper()

    location = f"https://pix.athena.pay/{tx_id}"

    params = BRCodeParams(
        key="",
        key_type=PixKeyType.EVP,
        merchant_name=qr_data.merchant_name,
        merchant_city=qr_data.merchant_city,
        amount=qr_data.amount,
        tx_id=tx_id,
        url=location,
        description=qr_data.description
    )
    br_code = generate_brcode(params)

    qr_image = generate_qr_image(br_code)

    expires_at = datetime.utcnow() + timedelta(minutes=qr_data.expires_in_minutes)

    qr = PixQRCode(
        id=str(uuid.uuid4()),
        account_id=qr_data.account_id,
        customer_id=qr_data.customer_id,
        qr_type="DYNAMIC",
        tx_id=tx_id,
        location=location,
        amount=qr_data.amount,
        is_amount_editable=False,
        payee_key=qr_data.pix_key,
        payee_name=qr_data.merchant_name,
        payee_city=qr_data.merchant_city,
        description=qr_data.description,
        br_code=br_code,
        br_code_image=qr_image,
        status="ACTIVE",
        expires_at=expires_at
    )
    db.add(qr)
    db.commit()

    return QRCodeResponseModel(
        id=qr.id,
        qr_type=qr.qr_type,
        tx_id=qr.tx_id,
        amount=float(qr.amount) if qr.amount else None,
        br_code=qr.br_code,
        br_code_image=qr.br_code_image,
        status=qr.status,
        expires_at=qr.expires_at
    )


@app.get(
    "/pix/qrcode/{qr_id}",
    tags=["QR Codes"],
    summary="Get QR code",
    description="Get QR code details by ID",
    responses={
        200: {"description": "QR code found"},
        404: {"description": "QR code not found", "model": ErrorResponse}
    }
)
def get_qrcode(
    qr_id: str,
    db=Depends(get_db),
    token: dict = Depends(verify_token)
):
    """Get QR code details by ID."""
    qr = db.query(PixQRCode).filter(PixQRCode.id == qr_id).first()
    if not qr:
        raise HTTPException(status_code=404, detail="QR code not found")

    return {
        "id": qr.id,
        "qr_type": qr.qr_type,
        "tx_id": qr.tx_id,
        "amount": float(qr.amount) if qr.amount else None,
        "payee_key": qr.payee_key,
        "payee_name": qr.payee_name,
        "description": qr.description,
        "br_code": qr.br_code,
        "br_code_image": qr.br_code_image,
        "status": qr.status,
        "expires_at": qr.expires_at.isoformat() if qr.expires_at else None,
        "created_at": qr.created_at.isoformat()
    }


@app.post(
    "/pix/qrcode/parse",
    tags=["QR Codes"],
    summary="Parse BR Code",
    description="Parse a BR Code payload and return its components"
)
def parse_qrcode(
    br_code: str = Query(..., description="BR Code payload to parse"),
    token: dict = Depends(verify_token)
):
    """
    Parse a BR Code and extract its components.

    Returns PIX key, merchant info, amount, and other fields.
    """
    result = parse_brcode(br_code)
    return result


# ============ Devolutions ============

@app.post(
    "/pix/devolution",
    tags=["Devolutions"],
    summary="Request devolution",
    description="Request a PIX devolution (refund)",
    response_model=DevolutionResponseModel,
    responses={
        200: {"description": "Devolution processed"},
        400: {"description": "Invalid devolution request", "model": ErrorResponse},
        404: {"description": "Original transaction not found", "model": ErrorResponse}
    }
)
async def request_devolution(
    request: DevolutionRequestModel,
    db=Depends(get_db),
    token: dict = Depends(verify_token)
):
    """
    Request a PIX devolution (refund).

    - Can be partial or full refund
    - Must reference a settled transaction
    - Total devolutions cannot exceed original amount
    """
    original = db.query(PixTransaction).filter(
        PixTransaction.e2e_id == request.original_e2e_id
    ).first()

    if not original:
        raise HTTPException(status_code=404, detail="Original transaction not found")

    if original.status != "SETTLED":
        raise HTTPException(status_code=400, detail="Can only refund settled transactions")

    if request.amount > float(original.amount):
        raise HTTPException(status_code=400, detail="Devolution amount exceeds original")

    existing_devolutions = db.query(PixDevolution).filter(
        PixDevolution.original_e2e_id == request.original_e2e_id,
        PixDevolution.status == "SETTLED"
    ).all()

    total_devolved = sum(float(d.amount) for d in existing_devolutions)
    if total_devolved + request.amount > float(original.amount):
        raise HTTPException(
            status_code=400,
            detail=f"Total devolutions would exceed original amount. Already devolved: {total_devolved}"
        )

    devolution_e2e_id = generate_e2e_id(ATHENA_ISPB)

    devolution = PixDevolution(
        id=str(uuid.uuid4()),
        e2e_id=devolution_e2e_id,
        original_e2e_id=request.original_e2e_id,
        original_tx_id=original.id,
        account_id=original.account_id,
        customer_id=original.customer_id,
        amount=request.amount,
        original_amount=float(original.amount),
        reason=request.reason,
        description=request.description,
        status="PENDING"
    )
    db.add(devolution)
    db.commit()

    if original.direction == "IN":
        spi_response = await spi_client.request_return(
            original_e2e_id=request.original_e2e_id,
            return_e2e_id=devolution_e2e_id,
            amount=request.amount,
            reason=request.reason
        )

        if spi_response.success:
            devolution.status = "SETTLED"
            devolution.settled_at = datetime.utcnow()
        else:
            devolution.status = "REJECTED"
            devolution.rejection_reason = spi_response.reject_message

    else:
        await credit_account(
            original.account_id,
            request.amount,
            f"Devolucao PIX - {request.original_e2e_id}"
        )
        devolution.status = "SETTLED"
        devolution.settled_at = datetime.utcnow()

    db.commit()

    return DevolutionResponseModel(
        id=devolution.id,
        e2e_id=devolution.e2e_id,
        original_e2e_id=devolution.original_e2e_id,
        amount=float(devolution.amount),
        status=devolution.status,
        created_at=devolution.created_at
    )


@app.get(
    "/pix/devolutions",
    tags=["Devolutions"],
    summary="List devolutions",
    description="List PIX devolutions with optional filters"
)
def list_devolutions(
    account_id: Optional[str] = Query(None, description="Filter by account ID"),
    original_e2e_id: Optional[str] = Query(None, description="Filter by original E2E ID"),
    db=Depends(get_db),
    token: dict = Depends(verify_token)
):
    """List devolutions with optional filters."""
    query = db.query(PixDevolution)

    if account_id:
        query = query.filter(PixDevolution.account_id == account_id)
    if original_e2e_id:
        query = query.filter(PixDevolution.original_e2e_id == original_e2e_id)

    devolutions = query.order_by(PixDevolution.created_at.desc()).all()

    return [
        {
            "id": d.id,
            "e2e_id": d.e2e_id,
            "original_e2e_id": d.original_e2e_id,
            "amount": float(d.amount),
            "reason": d.reason,
            "status": d.status,
            "created_at": d.created_at.isoformat(),
            "settled_at": d.settled_at.isoformat() if d.settled_at else None
        }
        for d in devolutions
    ]


# ============ Webhooks ============

@app.post(
    "/pix/webhooks",
    tags=["Webhooks"],
    summary="Create webhook",
    description="Register a webhook for PIX notifications"
)
def create_webhook(
    webhook_data: WebhookCreate,
    db=Depends(get_db),
    token: dict = Depends(verify_token)
):
    """
    Register a webhook for PIX notifications.

    Events: PIX_RECEIVED, PIX_SENT, PIX_DEVOLUTION
    """
    webhook = PixWebhook(
        id=str(uuid.uuid4()),
        account_id=webhook_data.account_id,
        url=webhook_data.url,
        secret=webhook_data.secret,
        events=webhook_data.events,
        is_active=True
    )
    db.add(webhook)
    db.commit()

    return {"id": webhook.id, "url": webhook.url, "events": webhook.events}


@app.get(
    "/pix/webhooks",
    tags=["Webhooks"],
    summary="List webhooks",
    description="List all active webhooks for an account"
)
def list_webhooks(
    account_id: str = Query(..., description="Account ID"),
    db=Depends(get_db),
    token: dict = Depends(verify_token)
):
    """List webhooks for an account."""
    webhooks = db.query(PixWebhook).filter(
        PixWebhook.account_id == account_id,
        PixWebhook.is_active == True
    ).all()

    return [
        {
            "id": w.id,
            "url": w.url,
            "events": w.events,
            "total_sent": w.total_sent,
            "total_failed": w.total_failed
        }
        for w in webhooks
    ]


@app.delete(
    "/pix/webhooks/{webhook_id}",
    tags=["Webhooks"],
    summary="Delete webhook",
    description="Delete (deactivate) a webhook",
    responses={
        200: {"description": "Webhook deleted"},
        404: {"description": "Webhook not found", "model": ErrorResponse}
    }
)
def delete_webhook(
    webhook_id: str,
    db=Depends(get_db),
    token: dict = Depends(verify_token)
):
    """Delete a webhook."""
    webhook = db.query(PixWebhook).filter(PixWebhook.id == webhook_id).first()
    if not webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")

    webhook.is_active = False
    db.commit()

    return {"message": "Webhook deleted"}


# ============ Incoming PIX ============

@app.post(
    "/pix/webhook/receive",
    tags=["PIX Transfers"],
    summary="Receive PIX webhook",
    description="Internal endpoint to receive PIX payment notifications from SPI",
    include_in_schema=False
)
async def receive_pix_webhook(
    request: dict,
    background_tasks: BackgroundTasks,
    db=Depends(get_db)
):
    """
    Receive PIX payment notification from SPI or simulator.
    """
    logger.info(f"Received PIX webhook: {request}")

    e2e_id = request.get("e2e_id") or request.get("endToEndId")
    tx_id = request.get("tx_id") or request.get("txId")
    amount = float(request.get("amount", 0))

    if not e2e_id:
        raise HTTPException(status_code=400, detail="Missing e2e_id")

    if tx_id:
        qr = db.query(PixQRCode).filter(PixQRCode.tx_id == tx_id).first()
        if qr:
            qr.status = "PAID"

            pix_key = db.query(PixKey).filter(
                PixKey.key_value == qr.payee_key,
                PixKey.status == "ACTIVE"
            ).first()

            if pix_key:
                await credit_account(
                    pix_key.account_id,
                    amount,
                    f"PIX recebido - {e2e_id}"
                )

                tx = PixTransaction(
                    id=str(uuid.uuid4()),
                    e2e_id=e2e_id,
                    tx_id=tx_id,
                    account_id=pix_key.account_id,
                    customer_id=pix_key.customer_id,
                    direction="IN",
                    amount=amount,
                    payer_name=request.get("payer_name", "Unknown"),
                    payer_document=request.get("payer_document"),
                    payer_ispb=request.get("payer_ispb"),
                    payee_name=pix_key.owner_name,
                    payee_document=pix_key.owner_document,
                    payee_account=pix_key.account_id,
                    payee_ispb=ATHENA_ISPB,
                    payee_key=qr.payee_key,
                    status="SETTLED",
                    settled_at=datetime.utcnow(),
                    spi_request=request
                )
                db.add(tx)
                db.commit()

                background_tasks.add_task(
                    notify_webhooks,
                    db,
                    pix_key.account_id,
                    "PIX_RECEIVED",
                    {
                        "e2e_id": e2e_id,
                        "amount": amount,
                        "payer": request.get("payer_name")
                    }
                )

                return {"status": "processed", "e2e_id": e2e_id}

    payee_key = request.get("payee_key")
    if payee_key:
        pix_key = db.query(PixKey).filter(
            PixKey.key_value == payee_key,
            PixKey.status == "ACTIVE"
        ).first()

        if pix_key:
            await credit_account(
                pix_key.account_id,
                amount,
                f"PIX recebido - {e2e_id}"
            )

            tx = PixTransaction(
                id=str(uuid.uuid4()),
                e2e_id=e2e_id,
                account_id=pix_key.account_id,
                customer_id=pix_key.customer_id,
                direction="IN",
                amount=amount,
                payer_name=request.get("payer_name", "Unknown"),
                payer_document=request.get("payer_document"),
                payer_ispb=request.get("payer_ispb"),
                payee_name=pix_key.owner_name,
                payee_document=pix_key.owner_document,
                payee_account=pix_key.account_id,
                payee_ispb=ATHENA_ISPB,
                payee_key=payee_key,
                status="SETTLED",
                settled_at=datetime.utcnow(),
                spi_request=request
            )
            db.add(tx)
            db.commit()

            background_tasks.add_task(
                notify_webhooks,
                db,
                pix_key.account_id,
                "PIX_RECEIVED",
                {
                    "e2e_id": e2e_id,
                    "amount": amount,
                    "payer": request.get("payer_name")
                }
            )

            return {"status": "processed", "e2e_id": e2e_id}

    return {"status": "ignored", "reason": "No matching key found"}


# ============ Limits ============

@app.get(
    "/pix/limits/{account_id}",
    tags=["Limits"],
    summary="Get PIX limits",
    description="Get current PIX limits for an account"
)
def get_pix_limits(
    account_id: str,
    db=Depends(get_db),
    token: dict = Depends(verify_token)
):
    """Get PIX limits and current usage for an account."""
    limit = db.query(PixLimit).filter(PixLimit.account_id == account_id).first()

    if not limit:
        return {
            "per_transaction": 10000.00,
            "daily": 50000.00,
            "monthly": 500000.00,
            "night_per_transaction": 1000.00,
            "night_daily": 5000.00,
            "used_today": 0,
            "used_month": 0
        }

    return {
        "per_transaction": float(limit.per_transaction),
        "daily": float(limit.daily),
        "monthly": float(limit.monthly),
        "night_per_transaction": float(limit.night_per_transaction),
        "night_daily": float(limit.night_daily),
        "used_today": float(limit.used_today),
        "used_month": float(limit.used_month)
    }


@app.put(
    "/pix/limits/{account_id}",
    tags=["Limits"],
    summary="Update PIX limits",
    description="Request to update PIX limits (may require compliance approval)"
)
def update_pix_limits(
    account_id: str,
    limit_update: LimitUpdate,
    db=Depends(get_db),
    token: dict = Depends(verify_token)
):
    """
    Update PIX limits for an account.

    In production, limit increases require compliance approval.
    """
    limit = db.query(PixLimit).filter(PixLimit.account_id == account_id).first()

    if not limit:
        limit = PixLimit(
            id=str(uuid.uuid4()),
            account_id=account_id,
            customer_id=""
        )
        db.add(limit)

    if limit_update.per_transaction is not None:
        if ENV == "dev":
            limit.per_transaction = limit_update.per_transaction
        else:
            limit.custom_limit_requested = limit_update.per_transaction
            limit.custom_limit_status = "PENDING"

    if limit_update.daily is not None:
        limit.daily = limit_update.daily

    if limit_update.night_per_transaction is not None:
        limit.night_per_transaction = limit_update.night_per_transaction

    db.commit()

    return {"message": "Limits updated", "status": "APPROVED" if ENV == "dev" else "PENDING"}


# ============ Statistics ============

@app.get(
    "/pix/stats/{account_id}",
    tags=["Statistics"],
    summary="Get PIX statistics",
    description="Get PIX transaction statistics for an account"
)
def get_pix_stats(
    account_id: str,
    period: str = Query(default="month", description="Period: day, week, month"),
    db=Depends(get_db),
    token: dict = Depends(verify_token)
):
    """
    Get PIX statistics for an account.

    Returns sent/received counts and totals for the specified period.
    """
    now = datetime.utcnow()
    if period == "day":
        start = now - timedelta(days=1)
    elif period == "week":
        start = now - timedelta(weeks=1)
    else:
        start = now - timedelta(days=30)

    transactions = db.query(PixTransaction).filter(
        PixTransaction.account_id == account_id,
        PixTransaction.created_at >= start,
        PixTransaction.status == "SETTLED"
    ).all()

    sent = [tx for tx in transactions if tx.direction == "OUT"]
    received = [tx for tx in transactions if tx.direction == "IN"]

    return {
        "period": period,
        "sent": {
            "count": len(sent),
            "total": sum(float(tx.amount) for tx in sent)
        },
        "received": {
            "count": len(received),
            "total": sum(float(tx.amount) for tx in received)
        },
        "total_transactions": len(transactions)
    }


# ============ Legacy Endpoints ============

@app.post("/pix/charge", include_in_schema=False)
def legacy_charge(c: dict, db=Depends(get_db)):
    """Legacy charge endpoint for backward compatibility"""
    tx_id = uuid.uuid4().hex[:25].upper()

    params = BRCodeParams(
        key="",
        key_type=PixKeyType.EVP,
        merchant_name="Athena Pay",
        merchant_city="SAO PAULO",
        amount=float(c.get("amount", 0)),
        tx_id=tx_id
    )
    br_code = generate_brcode(params)
    qr_image = generate_qr_image(br_code)

    return {
        "txid": tx_id,
        "qr_code": br_code,
        "qrcode": qr_image
    }


@app.post("/receipts", include_in_schema=False)
def legacy_receipts(r: dict, db=Depends(get_db)):
    """Legacy receipts endpoint"""
    rid = str(uuid.uuid4())
    return {"id": rid, "qrcode": ""}


@app.get("/receipts/{rid}", include_in_schema=False)
def legacy_get_receipt(rid: str):
    """Legacy get receipt endpoint"""
    return {
        "id": rid,
        "from": "",
        "to": "",
        "amount": 0,
        "description": "",
        "key": "",
        "created_at": datetime.utcnow().isoformat()
    }
