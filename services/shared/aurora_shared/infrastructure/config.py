"""
Production Configuration Management
Centralized settings with validation and environment support
"""
import os
from typing import Optional, List, Any
from functools import lru_cache
from enum import Enum

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings


class Environment(str, Enum):
    """Application environments"""
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"
    TEST = "test"


class LogLevel(str, Enum):
    """Log levels"""
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.

    All settings can be overridden via environment variables.
    Sensitive values should NEVER be committed to code.
    """

    # ============ Application ============
    app_name: str = Field(default="athena-service", description="Service name")
    app_version: str = Field(default="1.0.0", description="Service version")
    environment: Environment = Field(
        default=Environment.DEVELOPMENT,
        description="Application environment"
    )
    debug: bool = Field(default=False, description="Debug mode")

    # ============ Server ============
    host: str = Field(default="0.0.0.0", description="Server host")
    port: int = Field(default=8080, ge=1, le=65535, description="Server port")
    workers: int = Field(default=4, ge=1, le=32, description="Number of workers")

    # ============ Database ============
    database_url: str = Field(
        default="postgresql://postgres:postgres@localhost:5432/athena",
        description="Database connection URL"
    )
    database_pool_size: int = Field(default=10, ge=1, le=100)
    database_pool_max_overflow: int = Field(default=20, ge=0, le=100)
    database_pool_timeout: int = Field(default=30, ge=1, le=300)
    database_echo: bool = Field(default=False, description="Echo SQL queries")

    # ============ Redis ============
    redis_url: str = Field(
        default="redis://localhost:6379/0",
        description="Redis connection URL"
    )
    redis_pool_size: int = Field(default=10, ge=1, le=100)
    redis_timeout: int = Field(default=5, ge=1, le=60)

    # ============ Security ============
    secret_key: str = Field(
        default="CHANGE-ME-IN-PRODUCTION",
        min_length=32,
        description="Secret key for encryption"
    )
    jwt_secret_key: str = Field(
        default="CHANGE-ME-IN-PRODUCTION",
        min_length=32,
        description="JWT signing key"
    )
    jwt_algorithm: str = Field(default="RS256", description="JWT algorithm")
    jwt_access_token_expire_minutes: int = Field(default=30, ge=1, le=1440)
    jwt_refresh_token_expire_days: int = Field(default=7, ge=1, le=30)

    encryption_key: str = Field(
        default="CHANGE-ME-IN-PRODUCTION-32BYTES!",
        min_length=32,
        max_length=32,
        description="AES encryption key (32 bytes)"
    )

    # ============ CORS ============
    cors_origins: List[str] = Field(
        default=["http://localhost:3000"],
        description="Allowed CORS origins"
    )
    cors_allow_credentials: bool = Field(default=True)
    cors_allow_methods: List[str] = Field(default=["*"])
    cors_allow_headers: List[str] = Field(default=["*"])

    # ============ Rate Limiting ============
    rate_limit_enabled: bool = Field(default=True, description="Enable rate limiting")
    rate_limit_requests_per_minute: int = Field(default=60, ge=1, le=10000)
    rate_limit_requests_per_hour: int = Field(default=1000, ge=1, le=100000)
    rate_limit_burst_size: int = Field(default=10, ge=1, le=100)

    # ============ Logging ============
    log_level: LogLevel = Field(default=LogLevel.INFO, description="Log level")
    log_format: str = Field(default="json", description="Log format: json or text")
    log_include_timestamp: bool = Field(default=True)
    log_include_trace_id: bool = Field(default=True)

    # ============ Metrics ============
    metrics_enabled: bool = Field(default=True, description="Enable metrics collection")
    metrics_port: int = Field(default=9090, ge=1, le=65535)
    metrics_path: str = Field(default="/metrics")

    # ============ Tracing ============
    tracing_enabled: bool = Field(default=True, description="Enable distributed tracing")
    tracing_service_name: Optional[str] = Field(default=None)
    tracing_jaeger_host: str = Field(default="localhost")
    tracing_jaeger_port: int = Field(default=6831)
    tracing_sample_rate: float = Field(default=1.0, ge=0.0, le=1.0)

    # ============ Health Checks ============
    health_check_timeout: int = Field(default=5, ge=1, le=30)
    health_check_interval: int = Field(default=30, ge=10, le=300)

    # ============ Circuit Breaker ============
    circuit_breaker_failure_threshold: int = Field(default=5, ge=1, le=100)
    circuit_breaker_recovery_timeout: int = Field(default=30, ge=5, le=300)
    circuit_breaker_half_open_requests: int = Field(default=3, ge=1, le=10)

    # ============ External Services ============
    accounts_service_url: str = Field(
        default="http://accounts-service:8080",
        description="Accounts service URL"
    )
    pix_service_url: str = Field(
        default="http://pix-service:8080",
        description="PIX service URL"
    )
    compliance_service_url: str = Field(
        default="http://compliance-service:8080",
        description="Compliance service URL"
    )
    audit_service_url: str = Field(
        default="http://audit-service:8080",
        description="Audit service URL"
    )
    kyc_service_url: str = Field(
        default="http://kyc-service:8080",
        description="KYC service URL"
    )

    # ============ PIX Specific ============
    pix_ispb: str = Field(
        default="00000000",
        min_length=8,
        max_length=8,
        description="Institution ISPB code"
    )
    pix_dict_url: str = Field(
        default="https://dict-h.pi.rsfn.net.br",
        description="DICT API URL"
    )
    pix_spi_url: str = Field(
        default="https://spi-h.pi.rsfn.net.br",
        description="SPI API URL"
    )
    pix_mtls_cert_path: Optional[str] = Field(default=None)
    pix_mtls_key_path: Optional[str] = Field(default=None)
    pix_mtls_ca_path: Optional[str] = Field(default=None)

    # ============ Validators ============

    @field_validator('secret_key', 'jwt_secret_key')
    @classmethod
    def validate_secrets_in_production(cls, v: str, info) -> str:
        """Ensure secrets are changed in production"""
        # Note: This runs before environment is set, so we check env var directly
        env = os.getenv('ENVIRONMENT', 'development')
        if env == 'production' and v == 'CHANGE-ME-IN-PRODUCTION':
            raise ValueError(
                f'{info.field_name} must be changed in production environment'
            )
        return v

    @model_validator(mode='after')
    def set_tracing_service_name(self) -> 'Settings':
        """Set default tracing service name if not provided"""
        if self.tracing_service_name is None:
            self.tracing_service_name = self.app_name
        return self

    @property
    def is_production(self) -> bool:
        """Check if running in production"""
        return self.environment == Environment.PRODUCTION

    @property
    def is_development(self) -> bool:
        """Check if running in development"""
        return self.environment == Environment.DEVELOPMENT

    @property
    def database_url_safe(self) -> str:
        """Database URL with password masked"""
        from urllib.parse import urlparse, urlunparse
        parsed = urlparse(self.database_url)
        if parsed.password:
            masked = parsed._replace(
                netloc=f"{parsed.username}:****@{parsed.hostname}:{parsed.port}"
            )
            return urlunparse(masked)
        return self.database_url

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
        "extra": "ignore"
    }


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance.

    Settings are loaded once and cached for performance.
    To reload settings, clear the cache: get_settings.cache_clear()
    """
    return Settings()


# Environment-specific configuration overrides
ENVIRONMENT_CONFIGS = {
    Environment.DEVELOPMENT: {
        "debug": True,
        "log_level": LogLevel.DEBUG,
        "database_echo": True,
        "tracing_sample_rate": 1.0,
        "rate_limit_enabled": False,
    },
    Environment.STAGING: {
        "debug": False,
        "log_level": LogLevel.INFO,
        "database_echo": False,
        "tracing_sample_rate": 0.5,
        "rate_limit_enabled": True,
    },
    Environment.PRODUCTION: {
        "debug": False,
        "log_level": LogLevel.WARNING,
        "database_echo": False,
        "tracing_sample_rate": 0.1,
        "rate_limit_enabled": True,
    },
    Environment.TEST: {
        "debug": True,
        "log_level": LogLevel.DEBUG,
        "database_echo": False,
        "tracing_sample_rate": 0.0,
        "rate_limit_enabled": False,
    },
}
