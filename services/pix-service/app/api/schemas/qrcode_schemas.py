"""
PIX QR Code API Schemas
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from enum import Enum


class QRCodeTypeEnum(str, Enum):
    STATIC = "STATIC"
    DYNAMIC = "DYNAMIC"
    DYNAMIC_DUE_DATE = "DYNAMIC_DUE_DATE"


class QRCodeStatusEnum(str, Enum):
    ACTIVE = "ACTIVE"
    PAID = "PAID"
    EXPIRED = "EXPIRED"
    CANCELLED = "CANCELLED"


class CreateStaticQRCodeRequest(BaseModel):
    """Request schema for creating a static QR code."""
    key_value: str = Field(
        ...,
        description="PIX key for receiving the payment",
        example="12345678901"
    )
    merchant_name: str = Field(
        ...,
        max_length=25,
        description="Merchant/receiver name",
        example="LOJA ABC"
    )
    merchant_city: Optional[str] = Field(
        "SAO PAULO",
        max_length=15,
        description="Merchant city",
        example="SAO PAULO"
    )
    amount: Optional[float] = Field(
        None,
        gt=0,
        description="Fixed amount (optional for static QR)",
        example=100.00
    )
    description: Optional[str] = Field(
        None,
        max_length=25,
        description="Payment description",
        example="Pagamento"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "key_value": "12345678901",
                "merchant_name": "LOJA ABC",
                "merchant_city": "SAO PAULO",
                "amount": 100.00,
                "description": "Pagamento"
            }
        }


class CreateDynamicQRCodeRequest(BaseModel):
    """Request schema for creating a dynamic QR code."""
    account_id: str = Field(
        ...,
        description="Account ID for receiving the payment",
        example="550e8400-e29b-41d4-a716-446655440000"
    )
    amount: float = Field(
        ...,
        gt=0,
        le=1000000,
        description="Payment amount",
        example=250.00
    )
    expiration_seconds: Optional[int] = Field(
        3600,
        ge=60,
        le=86400,
        description="QR code validity in seconds (default 1 hour)",
        example=3600
    )
    description: Optional[str] = Field(
        None,
        max_length=140,
        description="Payment description",
        example="Fatura #12345"
    )
    reference_id: Optional[str] = Field(
        None,
        max_length=25,
        description="External reference ID",
        example="INV-12345"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "account_id": "550e8400-e29b-41d4-a716-446655440000",
                "amount": 250.00,
                "expiration_seconds": 3600,
                "description": "Fatura #12345",
                "reference_id": "INV-12345"
            }
        }


class QRCodeResponse(BaseModel):
    """Response schema for QR code operations."""
    id: str = Field(..., description="Unique QR code identifier")
    qr_type: QRCodeTypeEnum = Field(..., description="Type of QR code")
    status: QRCodeStatusEnum = Field(..., description="Current status")
    payload: str = Field(..., description="BR Code payload (EMV format)")
    qr_code_base64: Optional[str] = Field(None, description="QR code image as base64")
    amount: Optional[float] = Field(None, description="Payment amount")
    merchant_name: str = Field(..., description="Merchant name")
    description: Optional[str] = Field(None, description="Payment description")
    location: Optional[str] = Field(None, description="Dynamic QR code URL")
    expiration: Optional[datetime] = Field(None, description="Expiration timestamp")
    created_at: datetime = Field(..., description="Creation timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "qr-12345",
                "qr_type": "DYNAMIC",
                "status": "ACTIVE",
                "payload": "00020126580014br.gov.bcb.pix0136...",
                "qr_code_base64": "iVBORw0KGgoAAAANSUhEUgAA...",
                "amount": 250.00,
                "merchant_name": "ATHENA PAY",
                "description": "Fatura #12345",
                "location": "pix.athena.com/qr/abc123",
                "expiration": "2024-01-15T11:00:00Z",
                "created_at": "2024-01-15T10:00:00Z"
            }
        }


class PayQRCodeRequest(BaseModel):
    """Request schema for paying via QR code."""
    source_account_id: str = Field(
        ...,
        description="Account ID for the payment",
        example="550e8400-e29b-41d4-a716-446655440000"
    )
    payload: str = Field(
        ...,
        description="BR Code payload scanned from QR",
        example="00020126580014br.gov.bcb.pix..."
    )
    amount: Optional[float] = Field(
        None,
        description="Amount to pay (required for open amount QR codes)",
        example=100.00
    )
