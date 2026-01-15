"""
JWT Handler - Secure token management with RS256/ES256 signatures.
"""

import os
import time
import uuid
import httpx
from typing import Optional, List, Dict, Any
from dataclasses import dataclass, field
from functools import lru_cache
from datetime import datetime, timedelta

import jwt
from jwt import PyJWKClient
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa, ec
from pydantic import BaseModel


class TokenPayload(BaseModel):
    """JWT Token payload structure."""
    sub: str  # Subject (user/service ID)
    iss: str  # Issuer
    aud: List[str]  # Audience
    exp: int  # Expiration
    iat: int  # Issued at
    jti: str  # JWT ID (unique identifier)

    # Custom claims
    customer_id: Optional[str] = None
    account_ids: List[str] = []
    roles: List[str] = []
    permissions: List[str] = []
    kyc_level: int = 0
    service_name: Optional[str] = None

    # Security metadata
    ip_address: Optional[str] = None
    device_fingerprint: Optional[str] = None


@dataclass
class JWTConfig:
    """JWT configuration."""
    # Keycloak/OIDC settings
    issuer: str = field(default_factory=lambda: os.getenv("JWT_ISSUER", "https://auth.athena.com"))
    audience: str = field(default_factory=lambda: os.getenv("JWT_AUDIENCE", "athena-api"))
    jwks_url: Optional[str] = field(default_factory=lambda: os.getenv("JWKS_URL"))

    # Algorithm settings
    algorithm: str = "RS256"  # RS256, ES256, or HS256

    # Service-to-service settings
    private_key_path: Optional[str] = field(default_factory=lambda: os.getenv("JWT_PRIVATE_KEY_PATH"))
    public_key_path: Optional[str] = field(default_factory=lambda: os.getenv("JWT_PUBLIC_KEY_PATH"))
    secret_key: Optional[str] = field(default_factory=lambda: os.getenv("JWT_SECRET_KEY"))

    # Token settings
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7
    service_token_expire_minutes: int = 5

    # Validation settings
    verify_exp: bool = True
    verify_aud: bool = True
    verify_iss: bool = True
    leeway: int = 30  # Seconds of tolerance for exp validation

    # Security settings
    require_jti: bool = True
    check_revoked: bool = True
    redis_url: Optional[str] = field(default_factory=lambda: os.getenv("REDIS_URL"))


class JWTHandler:
    """
    Secure JWT handler with support for:
    - RS256/ES256 asymmetric signatures
    - JWKS key rotation
    - Token revocation
    - Service-to-service tokens
    """

    def __init__(self, config: Optional[JWTConfig] = None):
        self.config = config or JWTConfig()
        self._jwks_client: Optional[PyJWKClient] = None
        self._private_key = None
        self._public_key = None
        self._redis = None

        self._init_keys()

    def _init_keys(self):
        """Initialize cryptographic keys."""
        # Load private key for signing
        if self.config.private_key_path and os.path.exists(self.config.private_key_path):
            with open(self.config.private_key_path, "rb") as f:
                self._private_key = serialization.load_pem_private_key(
                    f.read(),
                    password=None
                )

        # Load public key for verification
        if self.config.public_key_path and os.path.exists(self.config.public_key_path):
            with open(self.config.public_key_path, "rb") as f:
                self._public_key = serialization.load_pem_public_key(f.read())

        # Initialize JWKS client for Keycloak/external IdP
        if self.config.jwks_url:
            self._jwks_client = PyJWKClient(
                self.config.jwks_url,
                cache_jwk_set=True,
                lifespan=3600  # Cache for 1 hour
            )

    async def _init_redis(self):
        """Initialize Redis for token revocation."""
        if self.config.redis_url and self._redis is None:
            import redis.asyncio as redis
            self._redis = redis.from_url(self.config.redis_url)

    def verify_token(self, token: str, required_permissions: List[str] = None) -> TokenPayload:
        """
        Verify and decode a JWT token.

        Args:
            token: The JWT token string
            required_permissions: Optional list of required permissions

        Returns:
            TokenPayload with decoded claims

        Raises:
            jwt.InvalidTokenError: If token is invalid
            PermissionError: If required permissions are missing
        """
        try:
            # Get signing key
            if self._jwks_client:
                signing_key = self._jwks_client.get_signing_key_from_jwt(token)
                key = signing_key.key
            elif self._public_key:
                key = self._public_key
            elif self.config.secret_key:
                key = self.config.secret_key
            else:
                raise ValueError("No verification key configured")

            # Decode and verify
            payload = jwt.decode(
                token,
                key=key,
                algorithms=[self.config.algorithm],
                audience=self.config.audience if self.config.verify_aud else None,
                issuer=self.config.issuer if self.config.verify_iss else None,
                leeway=timedelta(seconds=self.config.leeway),
                options={
                    "verify_exp": self.config.verify_exp,
                    "verify_aud": self.config.verify_aud,
                    "verify_iss": self.config.verify_iss,
                    "require": ["exp", "iat", "sub"]
                }
            )

            # Parse payload
            token_payload = TokenPayload(
                sub=payload.get("sub"),
                iss=payload.get("iss", ""),
                aud=payload.get("aud", []) if isinstance(payload.get("aud"), list) else [payload.get("aud", "")],
                exp=payload.get("exp"),
                iat=payload.get("iat"),
                jti=payload.get("jti", str(uuid.uuid4())),
                customer_id=payload.get("customer_id"),
                account_ids=payload.get("account_ids", []),
                roles=payload.get("roles", payload.get("realm_access", {}).get("roles", [])),
                permissions=payload.get("permissions", []),
                kyc_level=payload.get("kyc_level", 0),
                service_name=payload.get("service_name"),
                ip_address=payload.get("ip_address"),
                device_fingerprint=payload.get("device_fingerprint")
            )

            # Check required permissions
            if required_permissions:
                missing = set(required_permissions) - set(token_payload.permissions)
                if missing:
                    raise PermissionError(f"Missing permissions: {missing}")

            return token_payload

        except jwt.ExpiredSignatureError:
            raise jwt.InvalidTokenError("Token has expired")
        except jwt.InvalidAudienceError:
            raise jwt.InvalidTokenError("Invalid audience")
        except jwt.InvalidIssuerError:
            raise jwt.InvalidTokenError("Invalid issuer")
        except jwt.DecodeError as e:
            raise jwt.InvalidTokenError(f"Token decode error: {e}")

    def create_service_token(
        self,
        service_name: str,
        target_service: str,
        permissions: List[str] = None,
        additional_claims: Dict[str, Any] = None
    ) -> str:
        """
        Create a service-to-service JWT token.

        Args:
            service_name: Name of the calling service
            target_service: Name of the target service
            permissions: List of permissions for this token
            additional_claims: Additional custom claims

        Returns:
            Signed JWT token string
        """
        if not self._private_key and not self.config.secret_key:
            raise ValueError("No signing key configured")

        now = datetime.utcnow()
        payload = {
            "sub": f"service:{service_name}",
            "iss": self.config.issuer,
            "aud": [target_service, self.config.audience],
            "exp": now + timedelta(minutes=self.config.service_token_expire_minutes),
            "iat": now,
            "jti": str(uuid.uuid4()),
            "service_name": service_name,
            "permissions": permissions or [],
            "type": "service"
        }

        if additional_claims:
            payload.update(additional_claims)

        key = self._private_key if self._private_key else self.config.secret_key
        algorithm = self.config.algorithm if self._private_key else "HS256"

        return jwt.encode(payload, key, algorithm=algorithm)

    def create_access_token(
        self,
        customer_id: str,
        account_ids: List[str],
        roles: List[str],
        permissions: List[str],
        kyc_level: int = 0,
        additional_claims: Dict[str, Any] = None
    ) -> str:
        """
        Create an access token for a customer.

        Args:
            customer_id: Customer UUID
            account_ids: List of account UUIDs
            roles: List of user roles
            permissions: List of permissions
            kyc_level: KYC verification level
            additional_claims: Additional custom claims

        Returns:
            Signed JWT token string
        """
        if not self._private_key and not self.config.secret_key:
            raise ValueError("No signing key configured")

        now = datetime.utcnow()
        payload = {
            "sub": customer_id,
            "iss": self.config.issuer,
            "aud": [self.config.audience],
            "exp": now + timedelta(minutes=self.config.access_token_expire_minutes),
            "iat": now,
            "jti": str(uuid.uuid4()),
            "customer_id": customer_id,
            "account_ids": account_ids,
            "roles": roles,
            "permissions": permissions,
            "kyc_level": kyc_level,
            "type": "access"
        }

        if additional_claims:
            payload.update(additional_claims)

        key = self._private_key if self._private_key else self.config.secret_key
        algorithm = self.config.algorithm if self._private_key else "HS256"

        return jwt.encode(payload, key, algorithm=algorithm)

    async def revoke_token(self, jti: str, exp: int):
        """
        Revoke a token by adding its JTI to the blacklist.

        Args:
            jti: Token's unique identifier
            exp: Token expiration timestamp
        """
        await self._init_redis()
        if self._redis:
            ttl = exp - int(time.time())
            if ttl > 0:
                await self._redis.setex(f"revoked:{jti}", ttl, "1")

    async def is_revoked(self, jti: str) -> bool:
        """
        Check if a token has been revoked.

        Args:
            jti: Token's unique identifier

        Returns:
            True if token is revoked
        """
        await self._init_redis()
        if self._redis:
            return await self._redis.exists(f"revoked:{jti}") > 0
        return False


# Global instance
_jwt_handler: Optional[JWTHandler] = None


def get_jwt_handler() -> JWTHandler:
    """Get or create the global JWT handler instance."""
    global _jwt_handler
    if _jwt_handler is None:
        _jwt_handler = JWTHandler()
    return _jwt_handler
