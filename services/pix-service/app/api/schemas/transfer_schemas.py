"""
PIX Transfer API Schemas
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from enum import Enum


class PixTransactionTypeEnum(str, Enum):
    TRANSFER = "TRANSFER"
    QR_CODE_STATIC = "QR_CODE_STATIC"
    QR_CODE_DYNAMIC = "QR_CODE_DYNAMIC"
    DEVOLUTION = "DEVOLUTION"


class PixTransactionStatusEnum(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"
    RETURNED = "RETURNED"


class CreatePixTransferRequest(BaseModel):
    """Request schema for creating a PIX transfer."""
    source_account_id: str = Field(
        ...,
        description="UUID of the source account",
        example="550e8400-e29b-41d4-a716-446655440000"
    )
    target_key: str = Field(
        ...,
        description="Target PIX key (CPF, CNPJ, email, phone, or random key)",
        example="12345678901"
    )
    amount: float = Field(
        ...,
        gt=0,
        le=1000000,
        description="Transfer amount in BRL",
        example=150.00
    )
    description: Optional[str] = Field(
        None,
        max_length=140,
        description="Transfer description (max 140 characters)",
        example="Pagamento de serviços"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "source_account_id": "550e8400-e29b-41d4-a716-446655440000",
                "target_key": "12345678901",
                "amount": 150.00,
                "description": "Pagamento de serviços"
            }
        }


class PixTransferResponse(BaseModel):
    """Response schema for PIX transfer operations."""
    id: str = Field(..., description="Unique transaction identifier")
    e2e_id: str = Field(..., description="End-to-end identifier (32 characters)")
    transaction_type: PixTransactionTypeEnum = Field(..., description="Type of transaction")
    status: PixTransactionStatusEnum = Field(..., description="Current status")
    source_account_id: str = Field(..., description="Source account ID")
    source_name: Optional[str] = Field(None, description="Source account holder name")
    target_key: str = Field(..., description="Target PIX key")
    target_name: Optional[str] = Field(None, description="Target account holder name")
    target_document: Optional[str] = Field(None, description="Target document (masked)")
    amount: float = Field(..., description="Transfer amount")
    currency: str = Field(default="BRL", description="Currency code")
    description: Optional[str] = Field(None, description="Transfer description")
    created_at: datetime = Field(..., description="Creation timestamp")
    processed_at: Optional[datetime] = Field(None, description="Processing completion timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "tx-12345",
                "e2e_id": "E12345678202401151000001234567890",
                "transaction_type": "TRANSFER",
                "status": "COMPLETED",
                "source_account_id": "550e8400-e29b-41d4-a716-446655440000",
                "source_name": "JOAO DA SILVA",
                "target_key": "98765432109",
                "target_name": "MARIA SANTOS",
                "target_document": "987.***.***-09",
                "amount": 150.00,
                "currency": "BRL",
                "description": "Pagamento de serviços",
                "created_at": "2024-01-15T10:00:00Z",
                "processed_at": "2024-01-15T10:00:01Z"
            }
        }


class ResolveKeyResponse(BaseModel):
    """Response schema for DICT key resolution."""
    key_type: str = Field(..., description="Type of PIX key")
    key_value: str = Field(..., description="PIX key value")
    account: dict = Field(..., description="Account information")
    owner: dict = Field(..., description="Owner information")

    class Config:
        json_schema_extra = {
            "example": {
                "key_type": "CPF",
                "key_value": "12345678901",
                "account": {
                    "ispb": "12345678",
                    "branch": "0001",
                    "account_number": "123456",
                    "account_type": "CHECKING"
                },
                "owner": {
                    "name": "JOAO DA SILVA",
                    "document_type": "CPF"
                }
            }
        }


class DevolutionRequest(BaseModel):
    """Request schema for PIX devolution."""
    original_e2e_id: str = Field(
        ...,
        description="E2E ID of the original transaction",
        example="E12345678202401151000001234567890"
    )
    amount: float = Field(
        ...,
        gt=0,
        description="Amount to return (can be partial)",
        example=150.00
    )
    reason: str = Field(
        ...,
        description="Reason for devolution",
        example="FRAUD"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "original_e2e_id": "E12345678202401151000001234567890",
                "amount": 150.00,
                "reason": "FRAUD"
            }
        }


class PixTransactionListResponse(BaseModel):
    """Response schema for listing PIX transactions."""
    items: List[PixTransferResponse] = Field(..., description="List of transactions")
    total: int = Field(..., description="Total number of transactions")
    page: int = Field(..., description="Current page")
    page_size: int = Field(..., description="Page size")
