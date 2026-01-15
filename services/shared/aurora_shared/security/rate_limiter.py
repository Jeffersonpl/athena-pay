"""
Distributed Rate Limiter - Redis-based sliding window rate limiting.
"""

import os
import time
import hashlib
from typing import Optional, Tuple
from dataclasses import dataclass, field
from functools import wraps
from enum import Enum

import redis.asyncio as redis
from fastapi import HTTPException, Request


class RateLimitStrategy(Enum):
    """Rate limiting strategies."""
    SLIDING_WINDOW = "sliding_window"
    TOKEN_BUCKET = "token_bucket"
    FIXED_WINDOW = "fixed_window"


@dataclass
class RateLimitConfig:
    """Rate limit configuration."""
    # Redis connection
    redis_url: str = field(default_factory=lambda: os.getenv("REDIS_URL", "redis://localhost:6379"))

    # Default limits
    requests_per_second: int = 100
    requests_per_minute: int = 1000
    requests_per_hour: int = 10000

    # Burst settings
    burst_size: int = 50

    # Key settings
    key_prefix: str = "ratelimit"

    # Strategy
    strategy: RateLimitStrategy = RateLimitStrategy.SLIDING_WINDOW


@dataclass
class RateLimitRule:
    """Individual rate limit rule."""
    key: str  # Unique identifier for this limit
    max_requests: int  # Maximum requests allowed
    window_seconds: int  # Time window in seconds
    burst_size: int = 0  # Additional burst capacity

    # Penalty settings
    penalty_seconds: int = 0  # Block duration after exceeding limit
    penalty_multiplier: float = 1.0  # Multiply penalty on repeated violations


class RateLimiter:
    """
    Distributed rate limiter using Redis.

    Features:
    - Sliding window algorithm
    - Multiple limit tiers (per-second, per-minute, per-hour)
    - Burst capacity
    - Automatic penalty for abuse
    - Customer-specific limits
    """

    def __init__(self, config: Optional[RateLimitConfig] = None):
        self.config = config or RateLimitConfig()
        self._redis: Optional[redis.Redis] = None

    async def _get_redis(self) -> redis.Redis:
        """Get or create Redis connection."""
        if self._redis is None:
            self._redis = redis.from_url(
                self.config.redis_url,
                encoding="utf-8",
                decode_responses=True
            )
        return self._redis

    def _make_key(self, identifier: str, window: str) -> str:
        """Create a rate limit key."""
        return f"{self.config.key_prefix}:{window}:{identifier}"

    async def is_allowed(
        self,
        identifier: str,
        rules: list[RateLimitRule] = None
    ) -> Tuple[bool, dict]:
        """
        Check if a request is allowed under rate limits.

        Args:
            identifier: Unique identifier (IP, customer_id, API key)
            rules: Custom rules (uses defaults if not provided)

        Returns:
            Tuple of (is_allowed, metadata)
        """
        r = await self._get_redis()
        now = time.time()

        # Default rules if not provided
        if rules is None:
            rules = [
                RateLimitRule(
                    key="second",
                    max_requests=self.config.requests_per_second,
                    window_seconds=1,
                    burst_size=self.config.burst_size
                ),
                RateLimitRule(
                    key="minute",
                    max_requests=self.config.requests_per_minute,
                    window_seconds=60
                ),
                RateLimitRule(
                    key="hour",
                    max_requests=self.config.requests_per_hour,
                    window_seconds=3600
                )
            ]

        metadata = {
            "identifier": identifier,
            "limits": {},
            "allowed": True
        }

        # Check penalty/block status
        block_key = f"{self.config.key_prefix}:blocked:{identifier}"
        blocked_until = await r.get(block_key)

        if blocked_until and float(blocked_until) > now:
            metadata["allowed"] = False
            metadata["blocked_until"] = float(blocked_until)
            metadata["retry_after"] = int(float(blocked_until) - now)
            return False, metadata

        # Check each rule
        for rule in rules:
            key = self._make_key(identifier, rule.key)
            window_start = now - rule.window_seconds

            # Sliding window using sorted set
            pipe = r.pipeline()

            # Remove old entries
            pipe.zremrangebyscore(key, 0, window_start)

            # Count current entries
            pipe.zcard(key)

            # Add new entry
            pipe.zadd(key, {str(now): now})

            # Set expiry
            pipe.expire(key, rule.window_seconds + 1)

            results = await pipe.execute()
            current_count = results[1]

            effective_limit = rule.max_requests + rule.burst_size
            remaining = max(0, effective_limit - current_count)

            metadata["limits"][rule.key] = {
                "limit": rule.max_requests,
                "remaining": remaining,
                "reset": int(now + rule.window_seconds),
                "current": current_count
            }

            if current_count >= effective_limit:
                metadata["allowed"] = False
                metadata["exceeded_rule"] = rule.key

                # Apply penalty if configured
                if rule.penalty_seconds > 0:
                    # Check violation count for multiplier
                    violation_key = f"{self.config.key_prefix}:violations:{identifier}"
                    violations = await r.incr(violation_key)
                    await r.expire(violation_key, 3600)  # Reset violations after 1 hour

                    penalty = rule.penalty_seconds * (rule.penalty_multiplier ** (violations - 1))
                    penalty = min(penalty, 3600)  # Cap at 1 hour

                    await r.setex(block_key, int(penalty), str(now + penalty))
                    metadata["penalty_seconds"] = int(penalty)

                return False, metadata

        return True, metadata

    async def get_limits(self, identifier: str) -> dict:
        """
        Get current rate limit status for an identifier.

        Args:
            identifier: Unique identifier

        Returns:
            Dictionary with limit status
        """
        _, metadata = await self.is_allowed(identifier)
        return metadata["limits"]

    async def reset_limits(self, identifier: str):
        """
        Reset rate limits for an identifier.

        Args:
            identifier: Unique identifier
        """
        r = await self._get_redis()

        # Find and delete all keys for this identifier
        pattern = f"{self.config.key_prefix}:*:{identifier}"
        keys = []
        async for key in r.scan_iter(match=pattern):
            keys.append(key)

        if keys:
            await r.delete(*keys)

        # Also clear blocks
        await r.delete(f"{self.config.key_prefix}:blocked:{identifier}")
        await r.delete(f"{self.config.key_prefix}:violations:{identifier}")

    async def close(self):
        """Close Redis connection."""
        if self._redis:
            await self._redis.close()
            self._redis = None


# FastAPI dependency
def rate_limit(
    requests_per_minute: int = 60,
    requests_per_hour: int = 1000,
    by: str = "ip",  # "ip", "customer", "api_key"
    burst_size: int = 10
):
    """
    FastAPI dependency for rate limiting.

    Usage:
        @app.get("/endpoint")
        async def endpoint(
            request: Request,
            _: None = Depends(rate_limit(requests_per_minute=30))
        ):
            ...
    """
    limiter = RateLimiter()
    rules = [
        RateLimitRule(
            key="minute",
            max_requests=requests_per_minute,
            window_seconds=60,
            burst_size=burst_size
        ),
        RateLimitRule(
            key="hour",
            max_requests=requests_per_hour,
            window_seconds=3600
        )
    ]

    async def dependency(request: Request):
        # Determine identifier
        if by == "ip":
            identifier = request.client.host if request.client else "unknown"
        elif by == "customer":
            # Extract from JWT token
            identifier = getattr(request.state, "customer_id", request.client.host)
        elif by == "api_key":
            identifier = request.headers.get("X-API-Key", request.client.host)
        else:
            identifier = request.client.host if request.client else "unknown"

        # Hash identifier for privacy
        identifier_hash = hashlib.sha256(identifier.encode()).hexdigest()[:16]

        allowed, metadata = await limiter.is_allowed(identifier_hash, rules)

        if not allowed:
            retry_after = metadata.get("retry_after", 60)
            raise HTTPException(
                status_code=429,
                detail={
                    "error": "rate_limit_exceeded",
                    "message": "Too many requests",
                    "retry_after": retry_after,
                    "limits": metadata.get("limits", {})
                },
                headers={
                    "Retry-After": str(retry_after),
                    "X-RateLimit-Limit": str(requests_per_minute),
                    "X-RateLimit-Remaining": str(
                        metadata.get("limits", {}).get("minute", {}).get("remaining", 0)
                    )
                }
            )

        # Add rate limit headers to response
        request.state.rate_limit_headers = {
            "X-RateLimit-Limit": str(requests_per_minute),
            "X-RateLimit-Remaining": str(
                metadata.get("limits", {}).get("minute", {}).get("remaining", 0)
            ),
            "X-RateLimit-Reset": str(
                metadata.get("limits", {}).get("minute", {}).get("reset", 0)
            )
        }

    return dependency
