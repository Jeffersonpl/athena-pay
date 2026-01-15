"""
Data Transfer Objects - API request/response models.
"""

from datetime import datetime
from typing import Generic, TypeVar, Optional, List, Any, Dict
from pydantic import BaseModel, Field


T = TypeVar("T")


class DTO(BaseModel):
    """Base class for DTOs."""

    class Config:
        from_attributes = True  # Enable ORM mode
        populate_by_name = True


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated response wrapper."""
    items: List[T]
    total: int
    page: int
    page_size: int
    total_pages: int

    @classmethod
    def create(
        cls,
        items: List[T],
        total: int,
        page: int,
        page_size: int
    ) -> "PaginatedResponse[T]":
        total_pages = (total + page_size - 1) // page_size if page_size > 0 else 0
        return cls(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages
        )


class ApiResponse(BaseModel, Generic[T]):
    """Standard API response wrapper."""
    success: bool = True
    data: Optional[T] = None
    error: Optional[str] = None
    error_code: Optional[str] = None
    message: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    correlation_id: Optional[str] = None

    @classmethod
    def ok(
        cls,
        data: T = None,
        message: str = None,
        correlation_id: str = None
    ) -> "ApiResponse[T]":
        return cls(
            success=True,
            data=data,
            message=message,
            correlation_id=correlation_id
        )

    @classmethod
    def fail(
        cls,
        error: str,
        error_code: str = None,
        correlation_id: str = None
    ) -> "ApiResponse[T]":
        return cls(
            success=False,
            error=error,
            error_code=error_code,
            correlation_id=correlation_id
        )


class ErrorResponse(BaseModel):
    """Standard error response."""
    error: str
    message: str
    details: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    correlation_id: Optional[str] = None


class HealthResponse(BaseModel):
    """Health check response."""
    status: str = "healthy"
    version: str = "1.0.0"
    service: str = ""
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    dependencies: Dict[str, str] = Field(default_factory=dict)


# Common DTOs

class IdResponse(BaseModel):
    """Response with just an ID."""
    id: str


class AuditInfo(BaseModel):
    """Audit information for entities."""
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str] = None
    updated_by: Optional[str] = None
    version: int = 1
