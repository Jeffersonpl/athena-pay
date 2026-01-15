"""
Security Middleware - Request/Response security processing.
"""

import os
import time
import uuid
import logging
from typing import Optional, Callable
from contextvars import ContextVar

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

from .jwt_handler import JWTHandler, TokenPayload, get_jwt_handler


# Context variables for request tracking
correlation_id_var: ContextVar[str] = ContextVar("correlation_id", default="")
request_start_var: ContextVar[float] = ContextVar("request_start", default=0.0)
token_payload_var: ContextVar[Optional[TokenPayload]] = ContextVar("token_payload", default=None)

logger = logging.getLogger(__name__)


class CorrelationMiddleware(BaseHTTPMiddleware):
    """
    Middleware to handle correlation IDs for distributed tracing.
    """

    CORRELATION_HEADER = "X-Correlation-ID"
    REQUEST_ID_HEADER = "X-Request-ID"

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Get or generate correlation ID
        correlation_id = request.headers.get(self.CORRELATION_HEADER)
        if not correlation_id:
            correlation_id = str(uuid.uuid4())

        # Generate request ID
        request_id = str(uuid.uuid4())

        # Store in context
        correlation_id_var.set(correlation_id)
        request_start_var.set(time.time())

        # Add to request state
        request.state.correlation_id = correlation_id
        request.state.request_id = request_id

        # Process request
        response = await call_next(request)

        # Add headers to response
        response.headers[self.CORRELATION_HEADER] = correlation_id
        response.headers[self.REQUEST_ID_HEADER] = request_id

        return response


class SecurityMiddleware(BaseHTTPMiddleware):
    """
    Comprehensive security middleware with:
    - JWT validation
    - Security headers
    - Request logging
    - Input sanitization
    """

    # Paths that don't require authentication
    PUBLIC_PATHS = {
        "/health",
        "/metrics",
        "/docs",
        "/openapi.json",
        "/redoc"
    }

    # Security headers
    SECURITY_HEADERS = {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
        "Content-Security-Policy": "default-src 'self'",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache"
    }

    def __init__(
        self,
        app: ASGIApp,
        jwt_handler: Optional[JWTHandler] = None,
        public_paths: set = None,
        enable_jwt_validation: bool = True
    ):
        super().__init__(app)
        self.jwt_handler = jwt_handler or get_jwt_handler()
        self.public_paths = public_paths or self.PUBLIC_PATHS
        self.enable_jwt_validation = enable_jwt_validation

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Skip JWT validation for public paths
        path = request.url.path
        is_public = any(path.startswith(p) for p in self.public_paths)

        # Validate JWT if required
        if self.enable_jwt_validation and not is_public:
            auth_header = request.headers.get("Authorization")

            if not auth_header:
                return Response(
                    content='{"error": "missing_authorization", "message": "Authorization header required"}',
                    status_code=401,
                    media_type="application/json",
                    headers=self.SECURITY_HEADERS
                )

            if not auth_header.startswith("Bearer "):
                return Response(
                    content='{"error": "invalid_authorization", "message": "Bearer token required"}',
                    status_code=401,
                    media_type="application/json",
                    headers=self.SECURITY_HEADERS
                )

            token = auth_header[7:]  # Remove "Bearer " prefix

            try:
                payload = self.jwt_handler.verify_token(token)

                # Store in request state
                request.state.token_payload = payload
                request.state.customer_id = payload.customer_id
                request.state.account_ids = payload.account_ids
                request.state.roles = payload.roles
                request.state.permissions = payload.permissions
                request.state.kyc_level = payload.kyc_level

                # Store in context var
                token_payload_var.set(payload)

            except Exception as e:
                logger.warning(f"JWT validation failed: {e}")
                return Response(
                    content=f'{{"error": "invalid_token", "message": "{str(e)}"}}',
                    status_code=401,
                    media_type="application/json",
                    headers=self.SECURITY_HEADERS
                )

        # Process request
        response = await call_next(request)

        # Add security headers
        for header, value in self.SECURITY_HEADERS.items():
            if header not in response.headers:
                response.headers[header] = value

        return response


class AuditMiddleware(BaseHTTPMiddleware):
    """
    Middleware for audit logging of all requests.
    """

    # Paths to exclude from audit logging
    EXCLUDED_PATHS = {"/health", "/metrics"}

    # Sensitive headers to redact
    SENSITIVE_HEADERS = {"authorization", "x-api-key", "cookie"}

    def __init__(
        self,
        app: ASGIApp,
        audit_service_url: str = None,
        service_name: str = None
    ):
        super().__init__(app)
        self.audit_service_url = audit_service_url or os.getenv("AUDIT_SERVICE_URL")
        self.service_name = service_name or os.getenv("SERVICE_NAME", "unknown")

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Skip excluded paths
        if request.url.path in self.EXCLUDED_PATHS:
            return await call_next(request)

        start_time = time.time()

        # Capture request info
        correlation_id = getattr(request.state, "correlation_id", str(uuid.uuid4()))
        client_ip = request.client.host if request.client else "unknown"
        user_agent = request.headers.get("user-agent", "unknown")

        # Get token payload if available
        token_payload = getattr(request.state, "token_payload", None)
        actor_id = token_payload.customer_id if token_payload else None
        actor_type = "CUSTOMER" if actor_id else "ANONYMOUS"

        # Process request
        response = await call_next(request)

        # Calculate duration
        duration_ms = (time.time() - start_time) * 1000

        # Build audit event
        audit_event = {
            "event_type": "API_CALL",
            "service": self.service_name,
            "action": f"{request.method} {request.url.path}",
            "actor_id": actor_id,
            "actor_type": actor_type,
            "resource_type": "API",
            "resource_id": request.url.path,
            "correlation_id": correlation_id,
            "ip_address": client_ip,
            "user_agent": user_agent,
            "metadata": {
                "method": request.method,
                "path": request.url.path,
                "query": str(request.query_params),
                "status_code": response.status_code,
                "duration_ms": round(duration_ms, 2)
            }
        }

        # Log locally
        log_level = logging.WARNING if response.status_code >= 400 else logging.INFO
        logger.log(log_level, f"API Call: {audit_event}")

        # Send to audit service (async, fire-and-forget)
        if self.audit_service_url:
            try:
                import httpx
                async with httpx.AsyncClient() as client:
                    await client.post(
                        f"{self.audit_service_url}/events",
                        json=audit_event,
                        timeout=1.0
                    )
            except Exception as e:
                logger.error(f"Failed to send audit event: {e}")

        return response


class InputSanitizationMiddleware(BaseHTTPMiddleware):
    """
    Middleware for input sanitization and validation.
    """

    # Maximum request body size (10MB)
    MAX_BODY_SIZE = 10 * 1024 * 1024

    # Dangerous patterns to block
    BLOCKED_PATTERNS = [
        "<script",
        "javascript:",
        "data:text/html",
        "vbscript:",
        "onclick=",
        "onerror="
    ]

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Check content length
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > self.MAX_BODY_SIZE:
            return Response(
                content='{"error": "payload_too_large", "message": "Request body too large"}',
                status_code=413,
                media_type="application/json"
            )

        # For POST/PUT/PATCH, check body content
        if request.method in ("POST", "PUT", "PATCH"):
            body = await request.body()
            body_str = body.decode("utf-8", errors="ignore").lower()

            for pattern in self.BLOCKED_PATTERNS:
                if pattern in body_str:
                    logger.warning(f"Blocked request with suspicious pattern: {pattern}")
                    return Response(
                        content='{"error": "invalid_input", "message": "Request contains invalid characters"}',
                        status_code=400,
                        media_type="application/json"
                    )

        return await call_next(request)


def get_current_token() -> Optional[TokenPayload]:
    """Get the current request's token payload from context."""
    return token_payload_var.get()


def get_correlation_id() -> str:
    """Get the current request's correlation ID from context."""
    return correlation_id_var.get() or str(uuid.uuid4())
