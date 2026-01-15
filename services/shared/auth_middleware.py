"""
Athena Auth Middleware
JWT validation, rate limiting, and request context
"""
import os
import time
import logging
from typing import Optional, Set, Callable, Dict, Any
from functools import wraps
from datetime import datetime
from collections import defaultdict

from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import httpx

logger = logging.getLogger(__name__)

# Configuration
KEYCLOAK_URL = os.getenv("KEYCLOAK_URL", "http://keycloak:8080")
KEYCLOAK_REALM = os.getenv("KEYCLOAK_REALM", "athena")
JWT_ISSUER = os.getenv("JWT_ISSUER", f"{KEYCLOAK_URL}/realms/{KEYCLOAK_REALM}")
JWT_AUDIENCE = os.getenv("JWT_AUDIENCE", "account")
ENV = os.getenv("ENV", "dev")

# Public key cache
_public_key_cache: Dict[str, Any] = {}
_public_key_cache_time: float = 0
PUBLIC_KEY_CACHE_TTL = 300  # 5 minutes

# Rate limiting storage (in production use Redis)
_rate_limit_storage: Dict[str, list] = defaultdict(list)

# Security scheme
security = HTTPBearer(auto_error=False)


class AuthContext:
    """Authentication context for the current request"""

    def __init__(
        self,
        user_id: str,
        roles: Set[str],
        token_data: dict,
        is_authenticated: bool = True
    ):
        self.user_id = user_id
        self.roles = roles
        self.token_data = token_data
        self.is_authenticated = is_authenticated

    def has_role(self, role: str) -> bool:
        return role in self.roles

    def has_any_role(self, roles: Set[str]) -> bool:
        return bool(self.roles & roles)

    def has_all_roles(self, roles: Set[str]) -> bool:
        return roles.issubset(self.roles)

    @property
    def is_admin(self) -> bool:
        admin_roles = {"admin", "cto", "ceo", "manager", "finance"}
        return bool(self.roles & admin_roles)


class AnonymousContext(AuthContext):
    """Context for unauthenticated requests"""

    def __init__(self):
        super().__init__(
            user_id="anonymous",
            roles=set(),
            token_data={},
            is_authenticated=False
        )


async def get_public_key() -> dict:
    """
    Fetch and cache Keycloak public key for JWT verification
    """
    global _public_key_cache, _public_key_cache_time

    now = time.time()
    if _public_key_cache and (now - _public_key_cache_time) < PUBLIC_KEY_CACHE_TTL:
        return _public_key_cache

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Fetch JWKS from Keycloak
            jwks_url = f"{KEYCLOAK_URL}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/certs"
            response = await client.get(jwks_url)

            if response.status_code == 200:
                _public_key_cache = response.json()
                _public_key_cache_time = now
                return _public_key_cache
    except Exception as e:
        logger.error(f"Failed to fetch public key: {e}")

    return _public_key_cache or {}


def verify_token(token: str, verify_signature: bool = True) -> dict:
    """
    Verify JWT token and return claims
    In DEV mode, signature verification can be skipped
    """
    try:
        # In dev mode or when we can't get public key, use unverified claims
        if ENV == "dev" or not verify_signature:
            claims = jwt.get_unverified_claims(token)
        else:
            # Production: verify signature
            # Note: Full implementation would use JWKS to verify
            claims = jwt.get_unverified_claims(token)
            # TODO: Implement full signature verification with JWKS

        # Validate issuer
        if claims.get("iss") != JWT_ISSUER:
            # Allow flexible issuer matching
            expected_issuers = [
                JWT_ISSUER,
                f"http://keycloak:8080/realms/{KEYCLOAK_REALM}",
                f"http://localhost:8081/realms/{KEYCLOAK_REALM}",
            ]
            if claims.get("iss") not in expected_issuers:
                logger.warning(f"Invalid issuer: {claims.get('iss')}")
                # Don't fail in dev mode
                if ENV != "dev":
                    raise JWTError("Invalid issuer")

        # Validate expiration
        exp = claims.get("exp")
        if exp and datetime.utcnow().timestamp() > exp:
            if ENV != "dev":
                raise JWTError("Token expired")

        return claims

    except JWTError as e:
        logger.warning(f"JWT verification failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")


def extract_roles(claims: dict) -> Set[str]:
    """Extract roles from JWT claims"""
    roles = set()

    # Keycloak realm roles
    realm_access = claims.get("realm_access", {})
    roles.update(realm_access.get("roles", []))

    # Keycloak resource roles
    resource_access = claims.get("resource_access", {})
    for resource, access in resource_access.items():
        roles.update(access.get("roles", []))

    return roles


async def get_auth_context(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> AuthContext:
    """
    Dependency to get authentication context from request
    """
    if not credentials:
        return AnonymousContext()

    try:
        token = credentials.credentials
        claims = verify_token(token)
        roles = extract_roles(claims)

        return AuthContext(
            user_id=claims.get("sub", "unknown"),
            roles=roles,
            token_data=claims
        )
    except HTTPException:
        return AnonymousContext()
    except Exception as e:
        logger.error(f"Auth error: {e}")
        return AnonymousContext()


def require_auth(func: Callable) -> Callable:
    """
    Decorator to require authentication
    """
    @wraps(func)
    async def wrapper(*args, **kwargs):
        # Find auth context in kwargs
        auth: AuthContext = kwargs.get("auth")
        if not auth or not auth.is_authenticated:
            raise HTTPException(status_code=401, detail="Authentication required")
        return await func(*args, **kwargs)
    return wrapper


def require_roles(*required_roles: str):
    """
    Decorator to require specific roles
    Usage: @require_roles("admin", "manager")
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs):
            auth: AuthContext = kwargs.get("auth")
            if not auth or not auth.is_authenticated:
                raise HTTPException(status_code=401, detail="Authentication required")

            required = set(required_roles)
            if not auth.has_any_role(required):
                raise HTTPException(
                    status_code=403,
                    detail=f"Required roles: {', '.join(required_roles)}"
                )
            return await func(*args, **kwargs)
        return wrapper
    return decorator


def require_admin(func: Callable) -> Callable:
    """
    Decorator to require admin role
    """
    @wraps(func)
    async def wrapper(*args, **kwargs):
        auth: AuthContext = kwargs.get("auth")
        if not auth or not auth.is_authenticated:
            raise HTTPException(status_code=401, detail="Authentication required")

        if not auth.is_admin:
            raise HTTPException(status_code=403, detail="Admin access required")
        return await func(*args, **kwargs)
    return wrapper


# ============ Rate Limiting ============

class RateLimiter:
    """
    Simple rate limiter (in production use Redis)
    """

    def __init__(
        self,
        requests_per_minute: int = 60,
        requests_per_hour: int = 1000
    ):
        self.requests_per_minute = requests_per_minute
        self.requests_per_hour = requests_per_hour

    def _get_key(self, request: Request, auth: AuthContext) -> str:
        """Get rate limit key from request"""
        if auth.is_authenticated:
            return f"user:{auth.user_id}"
        # Use IP for anonymous users
        client_ip = request.client.host if request.client else "unknown"
        return f"ip:{client_ip}"

    def _cleanup_old_requests(self, key: str, window_seconds: int):
        """Remove requests older than the window"""
        cutoff = time.time() - window_seconds
        _rate_limit_storage[key] = [
            ts for ts in _rate_limit_storage[key]
            if ts > cutoff
        ]

    def check_rate_limit(self, request: Request, auth: AuthContext) -> bool:
        """
        Check if request is within rate limits
        Returns True if allowed, raises HTTPException if not
        """
        key = self._get_key(request, auth)
        now = time.time()

        # Cleanup old entries
        self._cleanup_old_requests(key, 3600)  # Keep last hour

        # Count requests in last minute
        minute_ago = now - 60
        minute_requests = sum(1 for ts in _rate_limit_storage[key] if ts > minute_ago)

        if minute_requests >= self.requests_per_minute:
            raise HTTPException(
                status_code=429,
                detail=f"Rate limit exceeded: {self.requests_per_minute} requests per minute"
            )

        # Count requests in last hour
        hour_requests = len(_rate_limit_storage[key])

        if hour_requests >= self.requests_per_hour:
            raise HTTPException(
                status_code=429,
                detail=f"Rate limit exceeded: {self.requests_per_hour} requests per hour"
            )

        # Record this request
        _rate_limit_storage[key].append(now)

        return True


# Default rate limiter
default_rate_limiter = RateLimiter()


async def check_rate_limit(
    request: Request,
    auth: AuthContext = Depends(get_auth_context)
) -> bool:
    """
    Dependency to check rate limits
    """
    return default_rate_limiter.check_rate_limit(request, auth)


def rate_limit(requests_per_minute: int = 60, requests_per_hour: int = 1000):
    """
    Decorator to apply custom rate limits
    """
    limiter = RateLimiter(requests_per_minute, requests_per_hour)

    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            auth = kwargs.get("auth", AnonymousContext())
            limiter.check_rate_limit(request, auth)
            return await func(request, *args, **kwargs)
        return wrapper
    return decorator


# ============ Request Context ============

class RequestContext:
    """
    Context for the current request with auth and tracing info
    """

    def __init__(self, request: Request, auth: AuthContext):
        self.request = request
        self.auth = auth
        self.request_id = request.headers.get("X-Request-ID", str(time.time()))
        self.start_time = time.time()

    @property
    def client_ip(self) -> str:
        if self.request.client:
            return self.request.client.host
        # Check for proxy headers
        forwarded = self.request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return "unknown"

    @property
    def user_agent(self) -> str:
        return self.request.headers.get("User-Agent", "unknown")

    @property
    def elapsed_ms(self) -> int:
        return int((time.time() - self.start_time) * 1000)


async def get_request_context(
    request: Request,
    auth: AuthContext = Depends(get_auth_context)
) -> RequestContext:
    """
    Dependency to get full request context
    """
    return RequestContext(request, auth)


# ============ CORS and Security Headers ============

SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy": "default-src 'self'",
    "Referrer-Policy": "strict-origin-when-cross-origin",
}


def add_security_headers(response):
    """Add security headers to response"""
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    return response
