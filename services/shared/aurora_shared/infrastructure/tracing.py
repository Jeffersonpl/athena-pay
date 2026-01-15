"""
Distributed Tracing with OpenTelemetry
Production-ready tracing for microservices observability
"""
import logging
from typing import Optional, Dict, Any, Callable
from functools import wraps
from contextvars import ContextVar

logger = logging.getLogger(__name__)

# Try to import OpenTelemetry
try:
    from opentelemetry import trace
    from opentelemetry.sdk.trace import TracerProvider
    from opentelemetry.sdk.trace.export import BatchSpanProcessor
    from opentelemetry.sdk.resources import Resource, SERVICE_NAME
    from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
    from opentelemetry.exporter.jaeger.thrift import JaegerExporter
    from opentelemetry.trace.propagation.tracecontext import TraceContextTextMapPropagator
    from opentelemetry.propagate import set_global_textmap, inject, extract
    from opentelemetry.trace import Status, StatusCode, SpanKind
    from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
    from opentelemetry.instrumentation.httpx import HTTPXClientInstrumentor
    from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
    from opentelemetry.instrumentation.redis import RedisInstrumentor
    OTEL_AVAILABLE = True
except ImportError:
    OTEL_AVAILABLE = False
    trace = None


# Context variable for current span
current_span_var: ContextVar[Optional[Any]] = ContextVar('current_span', default=None)


class TracingConfig:
    """Tracing configuration"""

    def __init__(
        self,
        service_name: str,
        environment: str = "development",
        jaeger_host: str = "localhost",
        jaeger_port: int = 6831,
        otlp_endpoint: Optional[str] = None,
        sample_rate: float = 1.0,
        enabled: bool = True
    ):
        self.service_name = service_name
        self.environment = environment
        self.jaeger_host = jaeger_host
        self.jaeger_port = jaeger_port
        self.otlp_endpoint = otlp_endpoint
        self.sample_rate = sample_rate
        self.enabled = enabled and OTEL_AVAILABLE


class TracingManager:
    """
    Distributed tracing manager using OpenTelemetry.

    Features:
    - Automatic span creation and propagation
    - Integration with Jaeger and OTLP exporters
    - Context propagation across services
    - Automatic instrumentation for FastAPI, HTTPX, SQLAlchemy, Redis

    Usage:
        tracing = TracingManager(config)
        tracing.setup()

        # Manual spans
        with tracing.start_span("operation_name") as span:
            span.set_attribute("key", "value")
            # ... do work

        # Decorator
        @tracing.trace("my_function")
        async def my_function():
            pass
    """

    def __init__(self, config: TracingConfig):
        self.config = config
        self._tracer: Optional[Any] = None
        self._provider: Optional[Any] = None

    def setup(self) -> None:
        """Initialize tracing with configured exporters"""
        if not self.config.enabled:
            logger.info("Tracing disabled - OpenTelemetry not available or disabled")
            return

        # Create resource with service info
        resource = Resource.create({
            SERVICE_NAME: self.config.service_name,
            "deployment.environment": self.config.environment,
            "service.version": "1.0.0"
        })

        # Create tracer provider
        self._provider = TracerProvider(resource=resource)

        # Add Jaeger exporter if configured
        if self.config.jaeger_host:
            jaeger_exporter = JaegerExporter(
                agent_host_name=self.config.jaeger_host,
                agent_port=self.config.jaeger_port
            )
            self._provider.add_span_processor(
                BatchSpanProcessor(jaeger_exporter)
            )
            logger.info(
                f"Jaeger exporter configured: {self.config.jaeger_host}:{self.config.jaeger_port}"
            )

        # Add OTLP exporter if configured
        if self.config.otlp_endpoint:
            otlp_exporter = OTLPSpanExporter(endpoint=self.config.otlp_endpoint)
            self._provider.add_span_processor(
                BatchSpanProcessor(otlp_exporter)
            )
            logger.info(f"OTLP exporter configured: {self.config.otlp_endpoint}")

        # Set global tracer provider
        trace.set_tracer_provider(self._provider)

        # Set global propagator for context propagation
        set_global_textmap(TraceContextTextMapPropagator())

        # Get tracer
        self._tracer = trace.get_tracer(
            self.config.service_name,
            "1.0.0"
        )

        logger.info(f"Tracing initialized for service: {self.config.service_name}")

    def instrument_fastapi(self, app) -> None:
        """Instrument FastAPI application"""
        if not self.config.enabled:
            return

        FastAPIInstrumentor.instrument_app(app)
        logger.info("FastAPI instrumentation enabled")

    def instrument_httpx(self) -> None:
        """Instrument HTTPX client"""
        if not self.config.enabled:
            return

        HTTPXClientInstrumentor().instrument()
        logger.info("HTTPX instrumentation enabled")

    def instrument_sqlalchemy(self, engine) -> None:
        """Instrument SQLAlchemy engine"""
        if not self.config.enabled:
            return

        SQLAlchemyInstrumentor().instrument(engine=engine)
        logger.info("SQLAlchemy instrumentation enabled")

    def instrument_redis(self) -> None:
        """Instrument Redis client"""
        if not self.config.enabled:
            return

        RedisInstrumentor().instrument()
        logger.info("Redis instrumentation enabled")

    @property
    def tracer(self):
        """Get the tracer instance"""
        if self._tracer is None and self.config.enabled:
            self._tracer = trace.get_tracer(self.config.service_name)
        return self._tracer

    def start_span(
        self,
        name: str,
        kind: Optional[Any] = None,
        attributes: Optional[Dict[str, Any]] = None,
        parent: Optional[Any] = None
    ):
        """
        Start a new span.

        Args:
            name: Span name
            kind: Span kind (CLIENT, SERVER, PRODUCER, CONSUMER, INTERNAL)
            attributes: Initial attributes
            parent: Parent span context

        Returns:
            Context manager for the span
        """
        if not self.config.enabled or self.tracer is None:
            return _NoOpSpan()

        span_kind = kind or SpanKind.INTERNAL
        return self.tracer.start_as_current_span(
            name,
            kind=span_kind,
            attributes=attributes
        )

    def trace(
        self,
        name: Optional[str] = None,
        kind: Optional[Any] = None,
        attributes: Optional[Dict[str, Any]] = None
    ):
        """
        Decorator to trace a function.

        Usage:
            @tracing.trace("my_operation")
            async def my_function():
                pass
        """
        def decorator(func: Callable):
            span_name = name or func.__name__

            @wraps(func)
            async def async_wrapper(*args, **kwargs):
                if not self.config.enabled or self.tracer is None:
                    return await func(*args, **kwargs)

                with self.start_span(span_name, kind=kind, attributes=attributes) as span:
                    try:
                        result = await func(*args, **kwargs)
                        span.set_status(Status(StatusCode.OK))
                        return result
                    except Exception as e:
                        span.set_status(Status(StatusCode.ERROR, str(e)))
                        span.record_exception(e)
                        raise

            @wraps(func)
            def sync_wrapper(*args, **kwargs):
                if not self.config.enabled or self.tracer is None:
                    return func(*args, **kwargs)

                with self.start_span(span_name, kind=kind, attributes=attributes) as span:
                    try:
                        result = func(*args, **kwargs)
                        span.set_status(Status(StatusCode.OK))
                        return result
                    except Exception as e:
                        span.set_status(Status(StatusCode.ERROR, str(e)))
                        span.record_exception(e)
                        raise

            import asyncio
            if asyncio.iscoroutinefunction(func):
                return async_wrapper
            return sync_wrapper

        return decorator

    def inject_headers(self, headers: Dict[str, str]) -> Dict[str, str]:
        """
        Inject trace context into HTTP headers for propagation.

        Args:
            headers: Existing headers dict

        Returns:
            Headers with trace context added
        """
        if not self.config.enabled:
            return headers

        inject(headers)
        return headers

    def extract_context(self, headers: Dict[str, str]):
        """
        Extract trace context from incoming HTTP headers.

        Args:
            headers: Incoming request headers

        Returns:
            Extracted context
        """
        if not self.config.enabled:
            return None

        return extract(headers)

    def add_event(self, name: str, attributes: Optional[Dict[str, Any]] = None):
        """Add an event to the current span"""
        if not self.config.enabled:
            return

        span = trace.get_current_span()
        if span:
            span.add_event(name, attributes=attributes or {})

    def set_attribute(self, key: str, value: Any):
        """Set an attribute on the current span"""
        if not self.config.enabled:
            return

        span = trace.get_current_span()
        if span:
            span.set_attribute(key, value)

    def set_error(self, exception: Exception):
        """Mark the current span as error"""
        if not self.config.enabled:
            return

        span = trace.get_current_span()
        if span:
            span.set_status(Status(StatusCode.ERROR, str(exception)))
            span.record_exception(exception)

    def shutdown(self):
        """Shutdown the tracer provider"""
        if self._provider:
            self._provider.shutdown()
            logger.info("Tracing shutdown complete")


class _NoOpSpan:
    """No-op span for when tracing is disabled"""

    def __enter__(self):
        return self

    def __exit__(self, *args):
        pass

    def set_attribute(self, key: str, value: Any):
        pass

    def add_event(self, name: str, attributes: Optional[Dict[str, Any]] = None):
        pass

    def set_status(self, status: Any):
        pass

    def record_exception(self, exception: Exception):
        pass


# Global tracing manager
_tracing_manager: Optional[TracingManager] = None


def setup_tracing(
    service_name: str,
    environment: str = "development",
    jaeger_host: Optional[str] = None,
    jaeger_port: int = 6831,
    otlp_endpoint: Optional[str] = None,
    enabled: bool = True
) -> TracingManager:
    """
    Setup distributed tracing for the service.

    Args:
        service_name: Name of the service
        environment: Deployment environment
        jaeger_host: Jaeger agent host
        jaeger_port: Jaeger agent port
        otlp_endpoint: OTLP collector endpoint
        enabled: Enable/disable tracing

    Returns:
        TracingManager instance
    """
    global _tracing_manager

    config = TracingConfig(
        service_name=service_name,
        environment=environment,
        jaeger_host=jaeger_host or "localhost",
        jaeger_port=jaeger_port,
        otlp_endpoint=otlp_endpoint,
        enabled=enabled
    )

    _tracing_manager = TracingManager(config)
    _tracing_manager.setup()

    return _tracing_manager


def get_tracing_manager() -> Optional[TracingManager]:
    """Get the global tracing manager"""
    return _tracing_manager


# FastAPI middleware for automatic tracing
class TracingMiddleware:
    """
    FastAPI middleware for automatic request tracing.

    Usage:
        app.add_middleware(TracingMiddleware, service_name="my-service")
    """

    def __init__(self, app, service_name: str = "athena"):
        self.app = app
        self.service_name = service_name

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        tracing = get_tracing_manager()
        if tracing is None or not tracing.config.enabled:
            await self.app(scope, receive, send)
            return

        # Extract context from incoming headers
        headers = dict(scope.get("headers", []))
        headers = {k.decode(): v.decode() for k, v in headers.items()}
        context = tracing.extract_context(headers)

        # Start span for this request
        method = scope.get("method", "UNKNOWN")
        path = scope.get("path", "/")
        span_name = f"{method} {path}"

        with tracing.start_span(
            span_name,
            kind=SpanKind.SERVER if OTEL_AVAILABLE else None,
            attributes={
                "http.method": method,
                "http.url": path,
                "http.scheme": scope.get("scheme", "http"),
                "http.host": headers.get("host", ""),
            }
        ) as span:
            # Capture response status
            status_code = 500

            async def send_wrapper(message):
                nonlocal status_code
                if message["type"] == "http.response.start":
                    status_code = message.get("status", 500)
                await send(message)

            try:
                await self.app(scope, receive, send_wrapper)
                if OTEL_AVAILABLE:
                    span.set_attribute("http.status_code", status_code)
                    if status_code >= 400:
                        span.set_status(Status(StatusCode.ERROR, f"HTTP {status_code}"))
                    else:
                        span.set_status(Status(StatusCode.OK))
            except Exception as e:
                if OTEL_AVAILABLE:
                    span.set_status(Status(StatusCode.ERROR, str(e)))
                    span.record_exception(e)
                raise
