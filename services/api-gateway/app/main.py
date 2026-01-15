"""
Athena Pay - API Gateway
Secure API Gateway with CORS, Rate Limiting, and Security Headers

Security Features:
- SEC-002: Restricted CORS (only allowed origins)
- SEC-004: Rate Limiting per IP/User
- SEC-006: DDoS Detection and Auto-Blacklist
- Security Headers (OWASP recommendations)
"""

from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime, timedelta
import httpx
import os
import hashlib
import time
import logging
import redis.asyncio as redis
from dataclasses import dataclass
from enum import Enum

# =============================================================================
# CONFIGURATION
# =============================================================================

# Service URLs
ACCOUNTS_URL = os.getenv("ACCOUNTS_URL", "http://accounts-service:8080")
CARDS_URL = os.getenv("CARDS_URL", "http://card-service:8080")
PIX_URL = os.getenv("PIX_URL", "http://pix-service:8080")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# Security Configuration
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5174,https://app.athenapay.com.br,https://admin.athenapay.com.br").split(",")
RATE_LIMIT_REQUESTS_PER_MINUTE = int(os.getenv("RATE_LIMIT_RPM", "60"))
RATE_LIMIT_REQUESTS_PER_SECOND = int(os.getenv("RATE_LIMIT_RPS", "10"))
DDOS_THRESHOLD = int(os.getenv("DDOS_THRESHOLD", "100"))  # requests per 10 seconds
BLACKLIST_DURATION_MINUTES = int(os.getenv("BLACKLIST_DURATION", "30"))

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("api-gateway")

# =============================================================================
# SECURITY HEADERS MIDDLEWARE
# =============================================================================

SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "Content-Security-Policy": "default-src 'self'; frame-ancestors 'none'",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
}


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        for header, value in SECURITY_HEADERS.items():
            response.headers[header] = value
        return response


# =============================================================================
# RATE LIMITING & DDOS DETECTION
# =============================================================================

@dataclass
class RateLimitResult:
    allowed: bool
    remaining: int
    reset_at: float
    is_blacklisted: bool = False
    reason: str = ""


class RateLimiter:
    """
    Advanced Rate Limiter with DDoS Detection
    - Sliding window algorithm
    - Per-IP rate limiting
    - Automatic blacklisting for suspicious activity
    - Anomaly detection for DDoS patterns
    """

    def __init__(self):
        self._redis: Optional[redis.Redis] = None

    async def _get_redis(self) -> redis.Redis:
        if self._redis is None:
            self._redis = redis.from_url(REDIS_URL, decode_responses=True)
        return self._redis

    def _get_client_identifier(self, request: Request) -> str:
        """Get unique identifier for the client (IP + User-Agent hash)"""
        forwarded = request.headers.get("X-Forwarded-For", "")
        if forwarded:
            ip = forwarded.split(",")[0].strip()
        else:
            ip = request.client.host if request.client else "unknown"

        user_agent = request.headers.get("User-Agent", "")
        identifier = f"{ip}:{hashlib.sha256(user_agent.encode()).hexdigest()[:16]}"
        return identifier

    async def is_blacklisted(self, identifier: str) -> bool:
        """Check if the client is blacklisted"""
        try:
            r = await self._get_redis()
            return await r.exists(f"blacklist:{identifier}") > 0
        except Exception as e:
            logger.error(f"Redis error checking blacklist: {e}")
            return False

    async def blacklist_client(self, identifier: str, reason: str):
        """Blacklist a client for suspicious activity"""
        try:
            r = await self._get_redis()
            await r.setex(
                f"blacklist:{identifier}",
                BLACKLIST_DURATION_MINUTES * 60,
                reason
            )
            logger.warning(f"Blacklisted client {identifier[:20]}... for: {reason}")
        except Exception as e:
            logger.error(f"Redis error blacklisting: {e}")

    async def detect_ddos(self, identifier: str) -> bool:
        """
        Detect DDoS patterns:
        - Too many requests in short window (10 seconds)
        - Unusual request patterns
        """
        try:
            r = await self._get_redis()
            key = f"ddos:{identifier}"
            now = time.time()
            window_start = now - 10  # 10 second window

            pipe = r.pipeline()
            pipe.zremrangebyscore(key, 0, window_start)
            pipe.zcard(key)
            pipe.zadd(key, {str(now): now})
            pipe.expire(key, 15)
            results = await pipe.execute()

            request_count = results[1]
            if request_count > DDOS_THRESHOLD:
                await self.blacklist_client(identifier, f"DDoS pattern detected: {request_count} requests in 10s")
                return True
            return False
        except Exception as e:
            logger.error(f"Redis error in DDoS detection: {e}")
            return False

    async def check_rate_limit(self, request: Request) -> RateLimitResult:
        """
        Check rate limit using sliding window algorithm
        """
        identifier = self._get_client_identifier(request)

        # Check blacklist first
        if await self.is_blacklisted(identifier):
            return RateLimitResult(
                allowed=False,
                remaining=0,
                reset_at=time.time() + BLACKLIST_DURATION_MINUTES * 60,
                is_blacklisted=True,
                reason="IP temporarily blocked due to suspicious activity"
            )

        # Check for DDoS pattern
        if await self.detect_ddos(identifier):
            return RateLimitResult(
                allowed=False,
                remaining=0,
                reset_at=time.time() + BLACKLIST_DURATION_MINUTES * 60,
                is_blacklisted=True,
                reason="Too many requests - temporarily blocked"
            )

        # Rate limiting
        try:
            r = await self._get_redis()
            key = f"ratelimit:{identifier}"
            now = time.time()
            window_start = now - 60  # 1 minute window

            pipe = r.pipeline()
            pipe.zremrangebyscore(key, 0, window_start)
            pipe.zcard(key)
            pipe.zadd(key, {str(now): now})
            pipe.expire(key, 65)
            results = await pipe.execute()

            current_requests = results[1]
            remaining = max(0, RATE_LIMIT_REQUESTS_PER_MINUTE - current_requests - 1)

            if current_requests >= RATE_LIMIT_REQUESTS_PER_MINUTE:
                return RateLimitResult(
                    allowed=False,
                    remaining=0,
                    reset_at=now + 60,
                    reason="Rate limit exceeded"
                )

            return RateLimitResult(
                allowed=True,
                remaining=remaining,
                reset_at=now + 60
            )
        except Exception as e:
            logger.error(f"Redis error in rate limiting: {e}")
            # Allow request if Redis is down (fail open for availability)
            return RateLimitResult(allowed=True, remaining=999, reset_at=time.time() + 60)


rate_limiter = RateLimiter()


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting for health checks
        if request.url.path in ["/health", "/healthz", "/ready"]:
            return await call_next(request)

        result = await rate_limiter.check_rate_limit(request)

        if not result.allowed:
            logger.warning(f"Rate limit exceeded for {request.client.host}: {result.reason}")
            return JSONResponse(
                status_code=429,
                content={
                    "error": "Too Many Requests",
                    "message": result.reason,
                    "retry_after": int(result.reset_at - time.time())
                },
                headers={
                    "Retry-After": str(int(result.reset_at - time.time())),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(int(result.reset_at))
                }
            )

        response = await call_next(request)
        response.headers["X-RateLimit-Remaining"] = str(result.remaining)
        response.headers["X-RateLimit-Reset"] = str(int(result.reset_at))
        return response


# =============================================================================
# INPUT VALIDATION SCHEMAS
# =============================================================================

class TransferRequest(BaseModel):
    from_account: str = Field(..., min_length=3, max_length=50)
    to_account: str = Field(..., min_length=3, max_length=50)
    amount: float = Field(..., gt=0, le=1000000)
    currency: str = Field(default="BRL", regex="^[A-Z]{3}$")
    description: Optional[str] = Field(default="", max_length=200)

    @validator('from_account', 'to_account')
    def validate_account(cls, v):
        # Prevent SQL injection patterns
        forbidden = ["'", '"', ";", "--", "/*", "*/", "\\"]
        for char in forbidden:
            if char in v:
                raise ValueError(f"Invalid character in account: {char}")
        return v


class PixKeyRequest(BaseModel):
    account_id: str = Field(..., min_length=3, max_length=50)
    key_type: str = Field(..., regex="^(CPF|CNPJ|EMAIL|PHONE|EVP)$")
    key_value: str = Field(..., min_length=1, max_length=100)


class PixSendRequest(BaseModel):
    from_account: Optional[str] = Field(default=None, max_length=50)
    to_account: Optional[str] = Field(default=None, max_length=50)
    to: Optional[str] = Field(default=None, max_length=100)  # PIX key
    amount: float = Field(..., gt=0, le=1000000)
    description: Optional[str] = Field(default="PIX", max_length=200)

    @validator('amount')
    def validate_amount(cls, v):
        # Ensure only 2 decimal places
        if round(v, 2) != v:
            raise ValueError("Amount must have at most 2 decimal places")
        return v


class PixChargeRequest(BaseModel):
    account_id: str = Field(..., min_length=3, max_length=50)
    amount: float = Field(..., gt=0, le=1000000)
    description: Optional[str] = Field(default="", max_length=200)
    expiration_minutes: Optional[int] = Field(default=60, ge=1, le=1440)


# =============================================================================
# FASTAPI APPLICATION
# =============================================================================

app = FastAPI(
    title="Athena Pay - API Gateway",
    version="2.0.0",
    description="Secure API Gateway with Rate Limiting and DDoS Protection",
    docs_url="/docs" if os.getenv("ENV", "dev") == "dev" else None,
    redoc_url="/redoc" if os.getenv("ENV", "dev") == "dev" else None,
)

# Add Security Headers Middleware (first, so it applies to all responses)
app.add_middleware(SecurityHeadersMiddleware)

# Add Rate Limiting Middleware
app.add_middleware(RateLimitMiddleware)

# Add CORS Middleware - RESTRICTED to allowed origins only
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID", "X-Correlation-ID"],
    expose_headers=["X-RateLimit-Remaining", "X-RateLimit-Reset", "X-Request-ID"],
    max_age=600,  # Cache preflight for 10 minutes
)


# =============================================================================
# HEALTH ENDPOINTS
# =============================================================================

@app.get("/health", tags=["Health"])
async def health():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


@app.get("/healthz", tags=["Health"])
async def healthz():
    """Kubernetes liveness probe"""
    return {"ok": True}


@app.get("/ready", tags=["Health"])
async def ready():
    """Kubernetes readiness probe"""
    try:
        r = await rate_limiter._get_redis()
        await r.ping()
        return {"ok": True, "redis": "connected"}
    except Exception:
        return JSONResponse(status_code=503, content={"ok": False, "redis": "disconnected"})


# =============================================================================
# USER ENDPOINTS
# =============================================================================

@app.get("/me", tags=["User"])
async def me(request: Request):
    """Get current user info"""
    # TODO: Integrate with Keycloak token validation
    return {"user": {"preferred_username": "athena.dev"}}


# =============================================================================
# ACCOUNTS ENDPOINTS
# =============================================================================

@app.get("/balances/{account_id}", tags=["Accounts"])
async def get_balance(account_id: str):
    """Get account balance"""
    if not account_id or len(account_id) > 50:
        raise HTTPException(status_code=400, detail="Invalid account_id")

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            r = await client.get(f"{ACCOUNTS_URL}/balances/{account_id}")
            r.raise_for_status()
            return r.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail="Account service error")
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Account service unavailable")


@app.get("/statement/{account_id}", tags=["Accounts"])
async def get_statement(account_id: str):
    """Get account statement"""
    if not account_id or len(account_id) > 50:
        raise HTTPException(status_code=400, detail="Invalid account_id")

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            r = await client.get(f"{ACCOUNTS_URL}/statement/{account_id}")
            r.raise_for_status()
            return r.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail="Account service error")
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Account service unavailable")


@app.post("/transfer", tags=["Accounts"])
async def transfer(payload: TransferRequest):
    """Transfer funds between accounts"""
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            r = await client.post(
                f"{ACCOUNTS_URL}/postings/transfer",
                json=payload.dict()
            )
            r.raise_for_status()
            return r.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail="Transfer failed")
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Account service unavailable")


@app.post("/postings/credit", tags=["Accounts"])
async def postings_credit(request: Request):
    """Credit an account"""
    payload = await request.json()
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            r = await client.post(f"{ACCOUNTS_URL}/postings/credit", json=payload)
            r.raise_for_status()
            return r.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail="Credit failed")
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Account service unavailable")


# =============================================================================
# PIX ENDPOINTS
# =============================================================================

@app.get("/pix/keys", tags=["PIX"])
async def pix_keys(account_id: Optional[str] = None):
    """List PIX keys"""
    params = {}
    if account_id:
        if len(account_id) > 50:
            raise HTTPException(status_code=400, detail="Invalid account_id")
        params["account_id"] = account_id

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            r = await client.get(f"{PIX_URL}/pix/keys", params=params)
            r.raise_for_status()
            return r.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail="PIX service error")
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="PIX service unavailable")


@app.post("/pix/keys", tags=["PIX"])
async def pix_keys_create(payload: PixKeyRequest):
    """Create a new PIX key"""
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            r = await client.post(f"{PIX_URL}/pix/keys", json=payload.dict())
            r.raise_for_status()
            return r.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail="PIX key creation failed")
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="PIX service unavailable")


@app.post("/pix/charge", tags=["PIX"])
async def pix_charge(payload: PixChargeRequest):
    """Create a PIX charge (QR Code)"""
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            r = await client.post(f"{PIX_URL}/pix/charge", json=payload.dict())
            r.raise_for_status()
            return r.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail="PIX charge creation failed")
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="PIX service unavailable")


@app.post("/pix/send", tags=["PIX"])
async def pix_send(payload: PixSendRequest):
    """
    Send a PIX payment

    Security: This endpoint validates input and handles failures gracefully.
    Note: Full transactional consistency requires Outbox Pattern (SEC-001)
    """
    from_acc = payload.from_account or "acc-001"
    amount = payload.amount
    description = payload.description or "PIX"
    to_acc = payload.to_account
    to_key = payload.to

    # Resolve PIX key to account if needed
    if not to_acc and to_key:
        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                r = await client.get(f"{PIX_URL}/pix/resolve", params={"key": to_key})
                if r.status_code != 200:
                    raise HTTPException(status_code=404, detail="PIX key not found")
                to_acc = r.json().get("account_id")
            except httpx.RequestError:
                raise HTTPException(status_code=503, detail="PIX service unavailable")

    if not to_acc:
        raise HTTPException(status_code=400, detail="Destination account not provided")

    # Execute transfer
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            r = await client.post(
                f"{ACCOUNTS_URL}/postings/transfer",
                json={
                    "from_account": from_acc,
                    "to_account": to_acc,
                    "currency": "BRL",
                    "amount": amount,
                    "description": description
                }
            )
            r.raise_for_status()
            transfer_data = r.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=e.response.status_code,
                detail="Transfer failed - funds not moved"
            )
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Account service unavailable")

    # Create receipt (non-critical, log failure but don't fail the request)
    receipt = None
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            rr = await client.post(
                f"{PIX_URL}/receipts",
                json={
                    "from_account": from_acc,
                    "to_account": to_acc,
                    "amount": amount,
                    "description": description,
                    "key": to_key or ""
                }
            )
            if rr.status_code == 200:
                receipt = rr.json()
    except Exception as e:
        logger.error(f"Failed to create PIX receipt: {e}")
        # Receipt creation failed, but transfer succeeded
        # TODO: Implement retry via Outbox Pattern (SEC-001)

    return {
        "ok": True,
        "transfer": transfer_data,
        "from": from_acc,
        "to": to_acc,
        "amount": amount,
        "receipt": receipt
    }


# =============================================================================
# ERROR HANDLERS
# =============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "status_code": exc.status_code,
            "message": exc.detail,
            "path": str(request.url.path)
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "status_code": 500,
            "message": "Internal server error"
        }
    )
