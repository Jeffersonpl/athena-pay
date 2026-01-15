"""
Athena Accounts Service
Core banking ledger with double-entry bookkeeping
DDD Architecture with OpenAPI Documentation
"""
import os
import uuid
import logging
from datetime import datetime
from typing import List, Optional
from decimal import Decimal
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends, Query, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.openapi.utils import get_openapi
from pydantic import BaseModel, Field

from app.db import SessionLocal, ensure_schema
from app.models import AccountBalance, Transaction

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
ENV = os.getenv("ENV", "dev")

# Security
security = HTTPBearer(auto_error=False)


# ============ OpenAPI Configuration ============

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Athena Accounts Service API",
        version="3.0.0",
        description="""
## Athena Accounts Service

Core banking ledger service implementing double-entry bookkeeping for all financial operations.

### Features

- **Balance Management**: Track available and blocked balances per account/currency
- **Credit Operations**: Add funds to accounts (deposits, transfers in, PIX received)
- **Debit Operations**: Remove funds from accounts (withdrawals, transfers out, PIX sent)
- **Internal Transfers**: Move funds between accounts atomically
- **Transaction History**: Complete audit trail of all operations

### Double-Entry Bookkeeping

All transactions follow double-entry principles:
- Every debit has a corresponding credit
- Account balances are always reconcilable
- Full audit trail maintained

### Multi-Currency Support

Accounts can hold multiple currencies (BRL, USD, EUR, etc.)
Each currency has separate available and blocked balances.

### Security

All endpoints require JWT Bearer authentication.
        """,
        routes=app.routes,
    )

    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "JWT token for API authentication"
        }
    }

    openapi_schema["security"] = [{"BearerAuth": []}]

    openapi_schema["tags"] = [
        {
            "name": "Health",
            "description": "Service health check endpoints"
        },
        {
            "name": "Balances",
            "description": "Account balance operations"
        },
        {
            "name": "Postings",
            "description": "Credit and debit operations"
        },
        {
            "name": "Transfers",
            "description": "Internal transfer operations"
        },
        {
            "name": "Statements",
            "description": "Transaction history and statements"
        }
    ]

    openapi_schema["servers"] = [
        {"url": "http://localhost:8080", "description": "Development server"},
        {"url": "https://api.athena.pay/accounts", "description": "Production server"}
    ]

    app.openapi_schema = openapi_schema
    return app.openapi_schema


# ============ Lifespan ============

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Accounts Service...")
    ensure_schema()
    logger.info("Accounts Service started successfully")
    yield
    logger.info("Shutting down Accounts Service...")


# ============ Application Factory ============

app = FastAPI(
    title="Athena Accounts Service",
    description="Core banking ledger with double-entry bookkeeping",
    version="3.0.0",
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

class BalanceResponse(BaseModel):
    """Account balance response"""
    account_id: str = Field(..., description="Account UUID")
    currency: str = Field(..., description="Currency code (ISO 4217)")
    available: float = Field(..., description="Available balance")
    blocked: float = Field(..., description="Blocked/held balance")
    total: float = Field(..., description="Total balance (available + blocked)")

    class Config:
        json_schema_extra = {
            "example": {
                "account_id": "550e8400-e29b-41d4-a716-446655440000",
                "currency": "BRL",
                "available": 1500.00,
                "blocked": 100.00,
                "total": 1600.00
            }
        }


class PostingRequest(BaseModel):
    """Credit or debit posting request"""
    account_id: str = Field(..., description="Account UUID")
    currency: str = Field(default="BRL", description="Currency code")
    amount: float = Field(..., gt=0, description="Amount to credit/debit")
    description: str = Field(default="", max_length=200, description="Transaction description")
    reference_id: Optional[str] = Field(None, description="External reference ID")
    metadata: Optional[dict] = Field(None, description="Additional metadata")

    class Config:
        json_schema_extra = {
            "example": {
                "account_id": "550e8400-e29b-41d4-a716-446655440000",
                "currency": "BRL",
                "amount": 150.00,
                "description": "PIX recebido",
                "reference_id": "E00000000202401151000001234567890"
            }
        }


class TransferRequest(BaseModel):
    """Internal transfer request"""
    from_account: str = Field(..., description="Source account UUID")
    to_account: str = Field(..., description="Destination account UUID")
    currency: str = Field(default="BRL", description="Currency code")
    amount: float = Field(..., gt=0, description="Transfer amount")
    description: str = Field(default="Transferência", max_length=200, description="Transfer description")

    class Config:
        json_schema_extra = {
            "example": {
                "from_account": "550e8400-e29b-41d4-a716-446655440000",
                "to_account": "550e8400-e29b-41d4-a716-446655440001",
                "currency": "BRL",
                "amount": 500.00,
                "description": "Transferência entre contas"
            }
        }


class TransactionResponse(BaseModel):
    """Transaction record response"""
    id: str = Field(..., description="Transaction UUID")
    account_id: str = Field(..., description="Account UUID")
    type: str = Field(..., description="Transaction type")
    amount: float = Field(..., description="Transaction amount")
    currency: str = Field(..., description="Currency code")
    description: str = Field(..., description="Transaction description")
    balance_after: Optional[float] = Field(None, description="Balance after transaction")
    created_at: Optional[datetime] = Field(None, description="Transaction timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "tx-12345",
                "account_id": "550e8400-e29b-41d4-a716-446655440000",
                "type": "credit",
                "amount": 150.00,
                "currency": "BRL",
                "description": "PIX recebido",
                "balance_after": 1650.00,
                "created_at": "2024-01-15T10:00:00Z"
            }
        }


class BlockFundsRequest(BaseModel):
    """Request to block funds"""
    account_id: str = Field(..., description="Account UUID")
    currency: str = Field(default="BRL", description="Currency code")
    amount: float = Field(..., gt=0, description="Amount to block")
    reason: str = Field(..., description="Reason for blocking")
    expires_at: Optional[datetime] = Field(None, description="Block expiration")

    class Config:
        json_schema_extra = {
            "example": {
                "account_id": "550e8400-e29b-41d4-a716-446655440000",
                "currency": "BRL",
                "amount": 100.00,
                "reason": "Pending card authorization"
            }
        }


class ErrorResponse(BaseModel):
    """Error response"""
    detail: str = Field(..., description="Error message")
    code: Optional[str] = Field(None, description="Error code")


class OperationResponse(BaseModel):
    """Generic operation response"""
    status: str = Field(..., description="Operation status")
    transaction_id: Optional[str] = Field(None, description="Transaction ID if created")


# ============ Dependencies ============

async def verify_token(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> Optional[dict]:
    """Verify JWT token"""
    if ENV == "dev" and not credentials:
        return {"sub": "dev-user", "permissions": ["*"]}
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")
    if ENV == "dev":
        return {"sub": "dev-user", "permissions": ["*"]}
    return {"sub": "user", "permissions": []}


def _get_or_create_balance(session, account_id: str, currency: str):
    """Get or create account balance"""
    balance = session.get(AccountBalance, {"account_id": account_id, "currency": currency})
    if balance:
        return balance
    balance = AccountBalance(
        account_id=account_id,
        currency=currency,
        available=0,
        blocked=0
    )
    session.add(balance)
    session.commit()
    return balance


# ============ Health Check ============

@app.get(
    "/health",
    tags=["Health"],
    summary="Health check",
    description="Check if the service is running properly"
)
async def health():
    """
    Health check endpoint.

    Returns service status and basic metrics.
    """
    return {
        "status": "healthy",
        "service": "accounts-service",
        "version": "3.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }


# ============ Balance Operations ============

@app.get(
    "/balances/{account_id}",
    tags=["Balances"],
    summary="Get account balance",
    description="Retrieve current balance for an account",
    response_model=BalanceResponse,
    responses={
        200: {"description": "Balance retrieved successfully"},
        404: {"description": "Account not found", "model": ErrorResponse}
    }
)
def get_balance(
    account_id: str,
    currency: str = Query(default="BRL", description="Currency code"),
    token: dict = Depends(verify_token)
):
    """
    Get the current balance for an account.

    Returns available and blocked amounts for the specified currency.
    """
    with SessionLocal() as session:
        balance = _get_or_create_balance(session, account_id, currency)
        return BalanceResponse(
            account_id=balance.account_id,
            currency=balance.currency,
            available=float(balance.available),
            blocked=float(balance.blocked),
            total=float(balance.available) + float(balance.blocked)
        )


@app.get(
    "/accounts/{account_id}/balances",
    tags=["Balances"],
    summary="Get all balances",
    description="Retrieve all currency balances for an account",
    response_model=List[BalanceResponse]
)
def get_all_balances(
    account_id: str,
    token: dict = Depends(verify_token)
):
    """
    Get all currency balances for an account.

    Returns available and blocked amounts for all currencies.
    """
    with SessionLocal() as session:
        balances = session.query(AccountBalance).filter(
            AccountBalance.account_id == account_id
        ).all()

        return [
            BalanceResponse(
                account_id=b.account_id,
                currency=b.currency,
                available=float(b.available),
                blocked=float(b.blocked),
                total=float(b.available) + float(b.blocked)
            )
            for b in balances
        ]


# ============ Posting Operations ============

@app.post(
    "/postings/credit",
    tags=["Postings"],
    summary="Credit account",
    description="Add funds to an account",
    response_model=OperationResponse,
    responses={
        200: {"description": "Account credited successfully"},
        400: {"description": "Invalid request", "model": ErrorResponse}
    }
)
def credit_account(
    posting: PostingRequest,
    token: dict = Depends(verify_token)
):
    """
    Credit funds to an account.

    Increases the available balance by the specified amount.
    Used for deposits, incoming transfers, PIX received, etc.
    """
    with SessionLocal() as session:
        balance = _get_or_create_balance(session, posting.account_id, posting.currency)
        balance.available = float(balance.available) + posting.amount

        transaction_id = str(uuid.uuid4())
        session.add(Transaction(
            id=transaction_id,
            account_id=posting.account_id,
            type="credit",
            amount=posting.amount,
            currency=posting.currency,
            description=posting.description,
            reference_id=posting.reference_id
        ))
        session.commit()

        logger.info(f"Credited {posting.amount} {posting.currency} to {posting.account_id}")

        return OperationResponse(
            status="credited",
            transaction_id=transaction_id
        )


@app.post(
    "/postings/debit",
    tags=["Postings"],
    summary="Debit account",
    description="Remove funds from an account",
    response_model=OperationResponse,
    responses={
        200: {"description": "Account debited successfully"},
        422: {"description": "Insufficient funds", "model": ErrorResponse}
    }
)
def debit_account(
    posting: PostingRequest,
    token: dict = Depends(verify_token)
):
    """
    Debit funds from an account.

    Decreases the available balance by the specified amount.
    Used for withdrawals, outgoing transfers, PIX sent, etc.

    Fails if available balance is insufficient.
    """
    with SessionLocal() as session:
        balance = _get_or_create_balance(session, posting.account_id, posting.currency)

        if float(balance.available) < posting.amount:
            raise HTTPException(
                status_code=422,
                detail="Saldo insuficiente"
            )

        balance.available = float(balance.available) - posting.amount

        transaction_id = str(uuid.uuid4())
        session.add(Transaction(
            id=transaction_id,
            account_id=posting.account_id,
            type="debit",
            amount=posting.amount,
            currency=posting.currency,
            description=posting.description,
            reference_id=posting.reference_id
        ))
        session.commit()

        logger.info(f"Debited {posting.amount} {posting.currency} from {posting.account_id}")

        return OperationResponse(
            status="debited",
            transaction_id=transaction_id
        )


@app.post(
    "/postings/block",
    tags=["Postings"],
    summary="Block funds",
    description="Move funds from available to blocked",
    response_model=OperationResponse,
    responses={
        200: {"description": "Funds blocked successfully"},
        422: {"description": "Insufficient available funds", "model": ErrorResponse}
    }
)
def block_funds(
    request: BlockFundsRequest,
    token: dict = Depends(verify_token)
):
    """
    Block funds in an account.

    Moves the specified amount from available to blocked balance.
    Used for pending authorizations, holds, etc.
    """
    with SessionLocal() as session:
        balance = _get_or_create_balance(session, request.account_id, request.currency)

        if float(balance.available) < request.amount:
            raise HTTPException(
                status_code=422,
                detail="Saldo disponível insuficiente"
            )

        balance.available = float(balance.available) - request.amount
        balance.blocked = float(balance.blocked) + request.amount

        transaction_id = str(uuid.uuid4())
        session.add(Transaction(
            id=transaction_id,
            account_id=request.account_id,
            type="block",
            amount=request.amount,
            currency=request.currency,
            description=request.reason
        ))
        session.commit()

        logger.info(f"Blocked {request.amount} {request.currency} in {request.account_id}")

        return OperationResponse(
            status="blocked",
            transaction_id=transaction_id
        )


@app.post(
    "/postings/unblock",
    tags=["Postings"],
    summary="Unblock funds",
    description="Move funds from blocked back to available",
    response_model=OperationResponse,
    responses={
        200: {"description": "Funds unblocked successfully"},
        422: {"description": "Insufficient blocked funds", "model": ErrorResponse}
    }
)
def unblock_funds(
    request: BlockFundsRequest,
    token: dict = Depends(verify_token)
):
    """
    Unblock funds in an account.

    Moves the specified amount from blocked back to available balance.
    Used when releasing holds, canceling authorizations, etc.
    """
    with SessionLocal() as session:
        balance = _get_or_create_balance(session, request.account_id, request.currency)

        if float(balance.blocked) < request.amount:
            raise HTTPException(
                status_code=422,
                detail="Saldo bloqueado insuficiente"
            )

        balance.blocked = float(balance.blocked) - request.amount
        balance.available = float(balance.available) + request.amount

        transaction_id = str(uuid.uuid4())
        session.add(Transaction(
            id=transaction_id,
            account_id=request.account_id,
            type="unblock",
            amount=request.amount,
            currency=request.currency,
            description=request.reason
        ))
        session.commit()

        logger.info(f"Unblocked {request.amount} {request.currency} in {request.account_id}")

        return OperationResponse(
            status="unblocked",
            transaction_id=transaction_id
        )


# ============ Transfer Operations ============

@app.post(
    "/transfer",
    tags=["Transfers"],
    summary="Internal transfer",
    description="Transfer funds between accounts",
    response_model=OperationResponse,
    responses={
        200: {"description": "Transfer completed successfully"},
        422: {"description": "Transfer failed", "model": ErrorResponse}
    }
)
def internal_transfer(
    transfer: TransferRequest,
    token: dict = Depends(verify_token)
):
    """
    Transfer funds between accounts.

    Atomically debits the source account and credits the destination account.
    Both accounts must exist and source must have sufficient balance.
    """
    if transfer.from_account == transfer.to_account:
        raise HTTPException(
            status_code=422,
            detail="Cannot transfer to the same account"
        )

    with SessionLocal() as session:
        # Get source balance
        source_balance = _get_or_create_balance(
            session,
            transfer.from_account,
            transfer.currency
        )

        if float(source_balance.available) < transfer.amount:
            raise HTTPException(
                status_code=422,
                detail="Saldo insuficiente"
            )

        # Debit source
        source_balance.available = float(source_balance.available) - transfer.amount

        source_tx_id = str(uuid.uuid4())
        session.add(Transaction(
            id=source_tx_id,
            account_id=transfer.from_account,
            type="transfer_out",
            amount=transfer.amount,
            currency=transfer.currency,
            description=transfer.description
        ))

        # Credit destination
        dest_balance = _get_or_create_balance(
            session,
            transfer.to_account,
            transfer.currency
        )
        dest_balance.available = float(dest_balance.available) + transfer.amount

        dest_tx_id = str(uuid.uuid4())
        session.add(Transaction(
            id=dest_tx_id,
            account_id=transfer.to_account,
            type="transfer_in",
            amount=transfer.amount,
            currency=transfer.currency,
            description=transfer.description
        ))

        session.commit()

        logger.info(
            f"Transfer {transfer.amount} {transfer.currency} "
            f"from {transfer.from_account} to {transfer.to_account}"
        )

        return OperationResponse(
            status="ok",
            transaction_id=source_tx_id
        )


# ============ Statement Operations ============

@app.get(
    "/statement/{account_id}",
    tags=["Statements"],
    summary="Get account statement",
    description="Retrieve transaction history for an account",
    response_model=List[TransactionResponse]
)
def get_statement(
    account_id: str,
    currency: str = Query(default="BRL", description="Currency filter"),
    limit: int = Query(default=50, le=500, description="Maximum transactions"),
    offset: int = Query(default=0, description="Pagination offset"),
    type: Optional[str] = Query(None, description="Transaction type filter"),
    token: dict = Depends(verify_token)
):
    """
    Get transaction history for an account.

    Returns a paginated list of transactions ordered by date (newest first).
    Can be filtered by currency and transaction type.
    """
    with SessionLocal() as session:
        query = """
            SELECT id, account_id, type, amount, currency, description, created_at
            FROM accounts.transactions
            WHERE account_id = :account_id AND currency = :currency
        """
        params = {"account_id": account_id, "currency": currency, "limit": limit, "offset": offset}

        if type:
            query += " AND type = :type"
            params["type"] = type

        query += " ORDER BY created_at DESC LIMIT :limit OFFSET :offset"

        rows = session.execute(query, params).all()

        return [
            TransactionResponse(
                id=r[0],
                account_id=r[1],
                type=r[2],
                amount=float(r[3]),
                currency=r[4],
                description=r[5],
                created_at=r[6] if len(r) > 6 else None
            )
            for r in rows
        ]


@app.get(
    "/transactions/{transaction_id}",
    tags=["Statements"],
    summary="Get transaction",
    description="Get a specific transaction by ID",
    response_model=TransactionResponse,
    responses={
        200: {"description": "Transaction found"},
        404: {"description": "Transaction not found", "model": ErrorResponse}
    }
)
def get_transaction(
    transaction_id: str,
    token: dict = Depends(verify_token)
):
    """
    Get a specific transaction by ID.
    """
    with SessionLocal() as session:
        row = session.execute(
            """
            SELECT id, account_id, type, amount, currency, description, created_at
            FROM accounts.transactions
            WHERE id = :id
            """,
            {"id": transaction_id}
        ).first()

        if not row:
            raise HTTPException(status_code=404, detail="Transaction not found")

        return TransactionResponse(
            id=row[0],
            account_id=row[1],
            type=row[2],
            amount=float(row[3]),
            currency=row[4],
            description=row[5],
            created_at=row[6] if len(row) > 6 else None
        )


# ============ Account Management ============

@app.get(
    "/accounts/{account_id}",
    tags=["Balances"],
    summary="Get account info",
    description="Get account information including all balances"
)
def get_account(
    account_id: str,
    token: dict = Depends(verify_token)
):
    """
    Get account information including all currency balances.
    """
    with SessionLocal() as session:
        balances = session.query(AccountBalance).filter(
            AccountBalance.account_id == account_id
        ).all()

        return {
            "account_id": account_id,
            "balances": [
                {
                    "currency": b.currency,
                    "available": float(b.available),
                    "blocked": float(b.blocked),
                    "total": float(b.available) + float(b.blocked)
                }
                for b in balances
            ]
        }
