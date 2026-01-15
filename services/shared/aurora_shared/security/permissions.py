"""
Permission System - RBAC and ABAC authorization.
"""

from enum import Enum
from typing import List, Optional, Callable, Any
from functools import wraps

from fastapi import HTTPException, Request, Depends


class Permission(str, Enum):
    """System permissions."""
    # Account permissions
    ACCOUNT_READ = "account:read"
    ACCOUNT_WRITE = "account:write"
    ACCOUNT_TRANSFER = "account:transfer"
    ACCOUNT_ADMIN = "account:admin"

    # PIX permissions
    PIX_KEY_READ = "pix:key:read"
    PIX_KEY_WRITE = "pix:key:write"
    PIX_TRANSFER = "pix:transfer"
    PIX_RECEIVE = "pix:receive"

    # Card permissions
    CARD_READ = "card:read"
    CARD_WRITE = "card:write"
    CARD_AUTHORIZE = "card:authorize"
    CARD_BLOCK = "card:block"

    # Boleto permissions
    BOLETO_READ = "boleto:read"
    BOLETO_GENERATE = "boleto:generate"
    BOLETO_PAY = "boleto:pay"

    # Wire permissions
    WIRE_READ = "wire:read"
    WIRE_TRANSFER = "wire:transfer"

    # Loan permissions
    LOAN_READ = "loan:read"
    LOAN_APPLY = "loan:apply"
    LOAN_APPROVE = "loan:approve"

    # Admin permissions
    ADMIN_READ = "admin:read"
    ADMIN_WRITE = "admin:write"
    ADMIN_USERS = "admin:users"
    ADMIN_COMPLIANCE = "admin:compliance"

    # Compliance permissions
    COMPLIANCE_READ = "compliance:read"
    COMPLIANCE_WRITE = "compliance:write"
    COMPLIANCE_REVIEW = "compliance:review"

    # KYC permissions
    KYC_READ = "kyc:read"
    KYC_WRITE = "kyc:write"
    KYC_REVIEW = "kyc:review"

    # Service permissions (for service-to-service communication)
    SERVICE_ALL = "service:all"


class Role(str, Enum):
    """System roles."""
    # Customer roles
    CUSTOMER = "customer"
    CUSTOMER_PREMIUM = "customer_premium"
    CUSTOMER_BUSINESS = "customer_business"

    # Staff roles
    SUPPORT = "support"
    ANALYST = "analyst"
    COMPLIANCE_OFFICER = "compliance_officer"
    KYC_REVIEWER = "kyc_reviewer"

    # Admin roles
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"

    # Service roles
    SERVICE = "service"


# Role to permissions mapping
ROLE_PERMISSIONS = {
    Role.CUSTOMER: [
        Permission.ACCOUNT_READ,
        Permission.ACCOUNT_TRANSFER,
        Permission.PIX_KEY_READ,
        Permission.PIX_KEY_WRITE,
        Permission.PIX_TRANSFER,
        Permission.PIX_RECEIVE,
        Permission.CARD_READ,
        Permission.BOLETO_READ,
        Permission.BOLETO_GENERATE,
        Permission.BOLETO_PAY,
        Permission.WIRE_READ,
        Permission.WIRE_TRANSFER,
        Permission.LOAN_READ,
        Permission.LOAN_APPLY,
    ],
    Role.CUSTOMER_PREMIUM: [
        # Inherits from CUSTOMER plus:
        Permission.CARD_WRITE,
        Permission.CARD_AUTHORIZE,
    ],
    Role.CUSTOMER_BUSINESS: [
        # Inherits from CUSTOMER_PREMIUM plus:
        Permission.ACCOUNT_ADMIN,
    ],
    Role.SUPPORT: [
        Permission.ACCOUNT_READ,
        Permission.PIX_KEY_READ,
        Permission.CARD_READ,
        Permission.BOLETO_READ,
        Permission.WIRE_READ,
        Permission.LOAN_READ,
        Permission.KYC_READ,
    ],
    Role.ANALYST: [
        Permission.ADMIN_READ,
        Permission.COMPLIANCE_READ,
        Permission.KYC_READ,
    ],
    Role.COMPLIANCE_OFFICER: [
        Permission.COMPLIANCE_READ,
        Permission.COMPLIANCE_WRITE,
        Permission.COMPLIANCE_REVIEW,
        Permission.KYC_READ,
        Permission.KYC_REVIEW,
        Permission.ACCOUNT_READ,
    ],
    Role.KYC_REVIEWER: [
        Permission.KYC_READ,
        Permission.KYC_WRITE,
        Permission.KYC_REVIEW,
    ],
    Role.ADMIN: [
        Permission.ADMIN_READ,
        Permission.ADMIN_WRITE,
        Permission.ADMIN_USERS,
        Permission.COMPLIANCE_READ,
        Permission.KYC_READ,
        Permission.ACCOUNT_READ,
    ],
    Role.SUPER_ADMIN: [
        # All permissions
        p for p in Permission
    ],
    Role.SERVICE: [
        Permission.SERVICE_ALL,
    ]
}


def get_role_permissions(role: Role) -> List[Permission]:
    """Get all permissions for a role, including inherited permissions."""
    permissions = set(ROLE_PERMISSIONS.get(role, []))

    # Inheritance
    if role == Role.CUSTOMER_PREMIUM:
        permissions.update(ROLE_PERMISSIONS[Role.CUSTOMER])
    elif role == Role.CUSTOMER_BUSINESS:
        permissions.update(ROLE_PERMISSIONS[Role.CUSTOMER_PREMIUM])
        permissions.update(ROLE_PERMISSIONS[Role.CUSTOMER])

    return list(permissions)


def has_permission(user_permissions: List[str], required: Permission) -> bool:
    """Check if user has a specific permission."""
    return required.value in user_permissions or Permission.SERVICE_ALL.value in user_permissions


def has_any_permission(user_permissions: List[str], required: List[Permission]) -> bool:
    """Check if user has any of the required permissions."""
    return any(has_permission(user_permissions, p) for p in required)


def has_all_permissions(user_permissions: List[str], required: List[Permission]) -> bool:
    """Check if user has all required permissions."""
    return all(has_permission(user_permissions, p) for p in required)


def has_role(user_roles: List[str], required: Role) -> bool:
    """Check if user has a specific role."""
    return required.value in user_roles


def has_any_role(user_roles: List[str], required: List[Role]) -> bool:
    """Check if user has any of the required roles."""
    return any(has_role(user_roles, r) for r in required)


class PermissionChecker:
    """Dependency for permission checking in FastAPI."""

    def __init__(
        self,
        required_permissions: List[Permission] = None,
        required_roles: List[Role] = None,
        require_all: bool = True
    ):
        self.required_permissions = required_permissions or []
        self.required_roles = required_roles or []
        self.require_all = require_all

    async def __call__(self, request: Request):
        # Get user info from request state (set by SecurityMiddleware)
        user_permissions = getattr(request.state, "permissions", [])
        user_roles = getattr(request.state, "roles", [])

        # Check permissions
        if self.required_permissions:
            if self.require_all:
                has_perms = has_all_permissions(user_permissions, self.required_permissions)
            else:
                has_perms = has_any_permission(user_permissions, self.required_permissions)

            if not has_perms:
                raise HTTPException(
                    status_code=403,
                    detail={
                        "error": "forbidden",
                        "message": "Insufficient permissions",
                        "required": [p.value for p in self.required_permissions]
                    }
                )

        # Check roles
        if self.required_roles:
            if not has_any_role(user_roles, self.required_roles):
                raise HTTPException(
                    status_code=403,
                    detail={
                        "error": "forbidden",
                        "message": "Insufficient role",
                        "required_roles": [r.value for r in self.required_roles]
                    }
                )

        return True


def require_permission(*permissions: Permission, require_all: bool = True):
    """
    FastAPI dependency decorator for permission checking.

    Usage:
        @app.get("/resource")
        async def get_resource(
            _: bool = Depends(require_permission(Permission.RESOURCE_READ))
        ):
            ...
    """
    return PermissionChecker(
        required_permissions=list(permissions),
        require_all=require_all
    )


def require_role(*roles: Role):
    """
    FastAPI dependency decorator for role checking.

    Usage:
        @app.get("/admin")
        async def admin_endpoint(
            _: bool = Depends(require_role(Role.ADMIN))
        ):
            ...
    """
    return PermissionChecker(required_roles=list(roles))


class ResourceOwnerChecker:
    """
    Check if the current user owns the requested resource.
    Used for ABAC (Attribute-Based Access Control).
    """

    def __init__(
        self,
        resource_id_param: str = "id",
        owner_field: str = "customer_id"
    ):
        self.resource_id_param = resource_id_param
        self.owner_field = owner_field

    async def __call__(
        self,
        request: Request,
        resource_id: str = None
    ):
        # Get resource ID from path params
        if resource_id is None:
            resource_id = request.path_params.get(self.resource_id_param)

        # Get current user's customer ID
        customer_id = getattr(request.state, "customer_id", None)

        if not customer_id:
            raise HTTPException(
                status_code=401,
                detail={"error": "unauthorized", "message": "Authentication required"}
            )

        # Resource ownership check should be done in the service layer
        # This just passes through the customer_id
        request.state.owner_check_customer_id = customer_id

        return customer_id


def require_resource_owner(resource_id_param: str = "id"):
    """
    FastAPI dependency for resource ownership check.

    Usage:
        @app.get("/accounts/{id}")
        async def get_account(
            id: str,
            customer_id: str = Depends(require_resource_owner())
        ):
            # Verify account belongs to customer_id
            ...
    """
    return ResourceOwnerChecker(resource_id_param=resource_id_param)
