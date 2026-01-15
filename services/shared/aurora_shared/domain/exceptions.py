"""
Domain Exceptions - Business-specific exceptions.
"""

from typing import Any, Dict, Optional


class DomainException(Exception):
    """Base exception for domain errors."""

    def __init__(
        self,
        message: str,
        code: str = "DOMAIN_ERROR",
        details: Dict[str, Any] = None
    ):
        super().__init__(message)
        self.message = message
        self.code = code
        self.details = details or {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "error": self.code,
            "message": self.message,
            "details": self.details
        }


class ValidationException(DomainException):
    """Exception for validation errors."""

    def __init__(
        self,
        message: str,
        field: str = None,
        details: Dict[str, Any] = None
    ):
        super().__init__(
            message=message,
            code="VALIDATION_ERROR",
            details={"field": field, **(details or {})}
        )
        self.field = field


class NotFoundException(DomainException):
    """Exception for entity not found."""

    def __init__(
        self,
        entity_type: str,
        entity_id: str,
        message: str = None
    ):
        super().__init__(
            message=message or f"{entity_type} with ID {entity_id} not found",
            code="NOT_FOUND",
            details={"entity_type": entity_type, "entity_id": entity_id}
        )
        self.entity_type = entity_type
        self.entity_id = entity_id


class ConflictException(DomainException):
    """Exception for conflict errors (duplicate, state conflict)."""

    def __init__(
        self,
        message: str,
        resource: str = None,
        details: Dict[str, Any] = None
    ):
        super().__init__(
            message=message,
            code="CONFLICT",
            details={"resource": resource, **(details or {})}
        )


class BusinessRuleException(DomainException):
    """Exception for business rule violations."""

    def __init__(
        self,
        rule: str,
        message: str,
        details: Dict[str, Any] = None
    ):
        super().__init__(
            message=message,
            code="BUSINESS_RULE_VIOLATION",
            details={"rule": rule, **(details or {})}
        )
        self.rule = rule


class InsufficientBalanceException(BusinessRuleException):
    """Exception for insufficient balance."""

    def __init__(
        self,
        available: float,
        required: float,
        account_id: str = None
    ):
        super().__init__(
            rule="SUFFICIENT_BALANCE",
            message=f"Insufficient balance. Available: {available}, Required: {required}",
            details={
                "available": available,
                "required": required,
                "account_id": account_id
            }
        )


class LimitExceededException(BusinessRuleException):
    """Exception for limit exceeded."""

    def __init__(
        self,
        limit_type: str,
        limit_value: float,
        current_value: float,
        requested_value: float
    ):
        super().__init__(
            rule="WITHIN_LIMITS",
            message=f"{limit_type} limit exceeded",
            details={
                "limit_type": limit_type,
                "limit_value": limit_value,
                "current_value": current_value,
                "requested_value": requested_value
            }
        )


class UnauthorizedException(DomainException):
    """Exception for unauthorized access."""

    def __init__(
        self,
        message: str = "Unauthorized access",
        required_permission: str = None
    ):
        super().__init__(
            message=message,
            code="UNAUTHORIZED",
            details={"required_permission": required_permission}
        )


class ForbiddenException(DomainException):
    """Exception for forbidden operations."""

    def __init__(
        self,
        message: str = "Operation forbidden",
        reason: str = None
    ):
        super().__init__(
            message=message,
            code="FORBIDDEN",
            details={"reason": reason}
        )


class ExternalServiceException(DomainException):
    """Exception for external service failures."""

    def __init__(
        self,
        service: str,
        message: str,
        status_code: int = None
    ):
        super().__init__(
            message=message,
            code="EXTERNAL_SERVICE_ERROR",
            details={"service": service, "status_code": status_code}
        )
        self.service = service
        self.status_code = status_code


class TransactionException(DomainException):
    """Exception for transaction processing errors."""

    def __init__(
        self,
        transaction_id: str,
        message: str,
        status: str = None
    ):
        super().__init__(
            message=message,
            code="TRANSACTION_ERROR",
            details={"transaction_id": transaction_id, "status": status}
        )
