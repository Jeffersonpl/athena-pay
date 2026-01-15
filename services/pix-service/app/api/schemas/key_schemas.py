"""
PIX Key API Schemas
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from enum import Enum


class PixKeyTypeEnum(str, Enum):
    CPF = "CPF"
    CNPJ = "CNPJ"
    EMAIL = "EMAIL"
    PHONE = "PHONE"
    RANDOM = "RANDOM"


class PixKeyStatusEnum(str, Enum):
    PENDING = "PENDING"
    ACTIVE = "ACTIVE"
    PORTABILITY_REQUESTED = "PORTABILITY_REQUESTED"
    BLOCKED = "BLOCKED"
    DELETED = "DELETED"


class CreatePixKeyRequest(BaseModel):
    """Request schema for creating a PIX key."""
    account_id: str = Field(
        ...,
        description="UUID of the account to register the key",
        example="550e8400-e29b-41d4-a716-446655440000"
    )
    key_type: PixKeyTypeEnum = Field(
        ...,
        description="Type of PIX key",
        example="CPF"
    )
    key_value: str = Field(
        ...,
        description="Value of the PIX key",
        example="12345678901"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "account_id": "550e8400-e29b-41d4-a716-446655440000",
                "key_type": "CPF",
                "key_value": "12345678901"
            }
        }


class PixKeyResponse(BaseModel):
    """Response schema for PIX key operations."""
    id: str = Field(..., description="Unique identifier of the PIX key")
    account_id: str = Field(..., description="Account ID")
    key_type: PixKeyTypeEnum = Field(..., description="Type of key")
    key_value: str = Field(..., description="Key value")
    status: PixKeyStatusEnum = Field(..., description="Current status")
    holder_name: Optional[str] = Field(None, description="Name of the key holder")
    holder_document: Optional[str] = Field(None, description="Document of the key holder (masked)")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "key-12345",
                "account_id": "550e8400-e29b-41d4-a716-446655440000",
                "key_type": "CPF",
                "key_value": "12345678901",
                "status": "ACTIVE",
                "holder_name": "JOAO DA SILVA",
                "holder_document": "123.***.***-01",
                "created_at": "2024-01-15T10:00:00Z",
                "updated_at": "2024-01-15T10:00:00Z"
            }
        }


class PixKeyListResponse(BaseModel):
    """Response schema for listing PIX keys."""
    items: List[PixKeyResponse] = Field(..., description="List of PIX keys")
    total: int = Field(..., description="Total number of keys")

    class Config:
        json_schema_extra = {
            "example": {
                "items": [
                    {
                        "id": "key-12345",
                        "account_id": "550e8400-e29b-41d4-a716-446655440000",
                        "key_type": "CPF",
                        "key_value": "12345678901",
                        "status": "ACTIVE",
                        "created_at": "2024-01-15T10:00:00Z",
                        "updated_at": "2024-01-15T10:00:00Z"
                    }
                ],
                "total": 1
            }
        }


class DeletePixKeyRequest(BaseModel):
    """Request schema for deleting a PIX key."""
    reason: Optional[str] = Field(None, description="Reason for deletion")


class PortabilityRequest(BaseModel):
    """Request schema for PIX key portability."""
    target_ispb: str = Field(..., description="Target institution ISPB")
    target_branch: str = Field(..., description="Target branch")
    target_account: str = Field(..., description="Target account number")
