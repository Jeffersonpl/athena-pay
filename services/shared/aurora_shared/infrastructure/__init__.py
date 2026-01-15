"""
Athena Shared Infrastructure
Production-ready components for microservices

This module provides all the infrastructure components needed for
running Athena Pay services in production:

- Configuration management with environment-specific settings
- Structured JSON logging with correlation IDs
- Prometheus metrics collection
- Distributed tracing with OpenTelemetry/Jaeger
- Health checks with dependency verification
- Circuit breaker for fault tolerance
- Resilient HTTP client for service-to-service communication

Usage:
    from athena_shared.infrastructure import (
        Settings, get_settings,
        setup_logging, get_logger,
        setup_metrics, metrics,
        setup_tracing, get_tracing_manager,
        HealthChecker, HealthStatus,
        CircuitBreaker, circuit_breaker,
        ServiceClient, ServiceClientConfig
    )

    # Setup all infrastructure
    settings = get_settings()
    setup_logging(settings.service_name, level=settings.log_level)
    setup_metrics(settings.service_name)
    setup_tracing(
        settings.service_name,
        environment=settings.environment,
        jaeger_host=settings.jaeger_host
    )
"""

# Configuration
from .config import (
    Settings,
    get_settings,
    Environment
)

# Logging
from .logging import (
    setup_logging,
    get_logger,
    StructuredLogger,
    correlation_id_var,
    request_id_var,
    user_id_var,
    AuditLogger,
    audit_logger,
    log_function_call
)

# Metrics
from .metrics import (
    MetricsCollector,
    setup_metrics,
    get_metrics,
    metrics,
    track_duration
)

# Tracing
from .tracing import (
    TracingManager,
    TracingConfig,
    setup_tracing,
    get_tracing_manager,
    TracingMiddleware
)

# Health Checks
from .health import (
    HealthChecker,
    HealthCheckResult,
    HealthStatus,
    DependencyHealth,
    create_health_endpoints
)

# Circuit Breaker
from .circuit_breaker import (
    CircuitBreaker,
    CircuitBreakerConfig,
    CircuitBreakerOpen,
    CircuitState,
    CircuitBreakerRegistry,
    get_circuit_breaker_registry,
    circuit_breaker
)

# HTTP Client
from .http_client import (
    ServiceClient,
    ServiceClientConfig,
    ServiceClientFactory,
    RetryConfig,
    RetryStrategy
)

__all__ = [
    # Config
    "Settings",
    "get_settings",
    "Environment",
    # Logging
    "setup_logging",
    "get_logger",
    "StructuredLogger",
    "correlation_id_var",
    "request_id_var",
    "user_id_var",
    "AuditLogger",
    "audit_logger",
    "log_function_call",
    # Metrics
    "MetricsCollector",
    "setup_metrics",
    "get_metrics",
    "metrics",
    "track_duration",
    # Tracing
    "TracingManager",
    "TracingConfig",
    "setup_tracing",
    "get_tracing_manager",
    "TracingMiddleware",
    # Health
    "HealthChecker",
    "HealthCheckResult",
    "HealthStatus",
    "DependencyHealth",
    "create_health_endpoints",
    # Circuit Breaker
    "CircuitBreaker",
    "CircuitBreakerConfig",
    "CircuitBreakerOpen",
    "CircuitState",
    "CircuitBreakerRegistry",
    "get_circuit_breaker_registry",
    "circuit_breaker",
    # HTTP Client
    "ServiceClient",
    "ServiceClientConfig",
    "ServiceClientFactory",
    "RetryConfig",
    "RetryStrategy",
]
