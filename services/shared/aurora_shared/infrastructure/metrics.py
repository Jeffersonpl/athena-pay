"""
Prometheus Metrics Collection
Production-ready metrics with automatic instrumentation
"""
import time
from typing import Optional, Callable, Dict, Any, List
from functools import wraps
from contextlib import contextmanager
from dataclasses import dataclass, field

try:
    from prometheus_client import (
        Counter, Histogram, Gauge, Summary,
        CollectorRegistry, generate_latest, CONTENT_TYPE_LATEST,
        multiprocess, REGISTRY
    )
    PROMETHEUS_AVAILABLE = True
except ImportError:
    PROMETHEUS_AVAILABLE = False


@dataclass
class MetricDefinition:
    """Definition of a metric"""
    name: str
    description: str
    labels: List[str] = field(default_factory=list)


class MetricsCollector:
    """
    Centralized metrics collection with Prometheus.

    Provides counters, histograms, gauges for:
    - HTTP request metrics
    - Database query metrics
    - External service call metrics
    - Business metrics
    """

    # Default bucket sizes for latency histograms (in seconds)
    DEFAULT_LATENCY_BUCKETS = (
        0.005, 0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 0.75,
        1.0, 2.5, 5.0, 7.5, 10.0
    )

    def __init__(self, service_name: str, registry: Optional[Any] = None):
        self.service_name = service_name
        self._enabled = PROMETHEUS_AVAILABLE

        if not self._enabled:
            return

        self.registry = registry or REGISTRY

        # ============ HTTP Metrics ============

        self.http_requests_total = Counter(
            'http_requests_total',
            'Total HTTP requests',
            ['service', 'method', 'endpoint', 'status_code'],
            registry=self.registry
        )

        self.http_request_duration_seconds = Histogram(
            'http_request_duration_seconds',
            'HTTP request duration in seconds',
            ['service', 'method', 'endpoint'],
            buckets=self.DEFAULT_LATENCY_BUCKETS,
            registry=self.registry
        )

        self.http_requests_in_progress = Gauge(
            'http_requests_in_progress',
            'Number of HTTP requests in progress',
            ['service', 'method', 'endpoint'],
            registry=self.registry
        )

        # ============ Database Metrics ============

        self.db_queries_total = Counter(
            'db_queries_total',
            'Total database queries',
            ['service', 'operation', 'table', 'status'],
            registry=self.registry
        )

        self.db_query_duration_seconds = Histogram(
            'db_query_duration_seconds',
            'Database query duration in seconds',
            ['service', 'operation', 'table'],
            buckets=self.DEFAULT_LATENCY_BUCKETS,
            registry=self.registry
        )

        self.db_connections_active = Gauge(
            'db_connections_active',
            'Number of active database connections',
            ['service'],
            registry=self.registry
        )

        # ============ External Service Metrics ============

        self.external_requests_total = Counter(
            'external_requests_total',
            'Total external service requests',
            ['service', 'target_service', 'method', 'status'],
            registry=self.registry
        )

        self.external_request_duration_seconds = Histogram(
            'external_request_duration_seconds',
            'External service request duration in seconds',
            ['service', 'target_service', 'method'],
            buckets=self.DEFAULT_LATENCY_BUCKETS,
            registry=self.registry
        )

        self.circuit_breaker_state = Gauge(
            'circuit_breaker_state',
            'Circuit breaker state (0=closed, 1=open, 2=half-open)',
            ['service', 'target_service'],
            registry=self.registry
        )

        # ============ Business Metrics ============

        self.transactions_total = Counter(
            'transactions_total',
            'Total transactions processed',
            ['service', 'type', 'status'],
            registry=self.registry
        )

        self.transaction_amount_total = Counter(
            'transaction_amount_total',
            'Total transaction amount in cents',
            ['service', 'type', 'currency'],
            registry=self.registry
        )

        self.active_users = Gauge(
            'active_users',
            'Number of active users',
            ['service'],
            registry=self.registry
        )

        # ============ Cache Metrics ============

        self.cache_hits_total = Counter(
            'cache_hits_total',
            'Total cache hits',
            ['service', 'cache_name'],
            registry=self.registry
        )

        self.cache_misses_total = Counter(
            'cache_misses_total',
            'Total cache misses',
            ['service', 'cache_name'],
            registry=self.registry
        )

        # ============ Queue Metrics ============

        self.queue_messages_total = Counter(
            'queue_messages_total',
            'Total messages processed from queue',
            ['service', 'queue_name', 'status'],
            registry=self.registry
        )

        self.queue_depth = Gauge(
            'queue_depth',
            'Current queue depth',
            ['service', 'queue_name'],
            registry=self.registry
        )

    # ============ HTTP Instrumentation ============

    def track_request(
        self,
        method: str,
        endpoint: str,
        status_code: int,
        duration: float
    ):
        """Track an HTTP request"""
        if not self._enabled:
            return

        self.http_requests_total.labels(
            service=self.service_name,
            method=method,
            endpoint=endpoint,
            status_code=str(status_code)
        ).inc()

        self.http_request_duration_seconds.labels(
            service=self.service_name,
            method=method,
            endpoint=endpoint
        ).observe(duration)

    @contextmanager
    def track_request_duration(self, method: str, endpoint: str):
        """Context manager to track request duration"""
        if not self._enabled:
            yield
            return

        self.http_requests_in_progress.labels(
            service=self.service_name,
            method=method,
            endpoint=endpoint
        ).inc()

        start = time.perf_counter()
        try:
            yield
        finally:
            duration = time.perf_counter() - start
            self.http_request_duration_seconds.labels(
                service=self.service_name,
                method=method,
                endpoint=endpoint
            ).observe(duration)

            self.http_requests_in_progress.labels(
                service=self.service_name,
                method=method,
                endpoint=endpoint
            ).dec()

    # ============ Database Instrumentation ============

    def track_db_query(
        self,
        operation: str,
        table: str,
        duration: float,
        success: bool = True
    ):
        """Track a database query"""
        if not self._enabled:
            return

        status = "success" if success else "error"

        self.db_queries_total.labels(
            service=self.service_name,
            operation=operation,
            table=table,
            status=status
        ).inc()

        self.db_query_duration_seconds.labels(
            service=self.service_name,
            operation=operation,
            table=table
        ).observe(duration)

    @contextmanager
    def track_db_query_duration(self, operation: str, table: str):
        """Context manager to track database query duration"""
        if not self._enabled:
            yield
            return

        start = time.perf_counter()
        success = True
        try:
            yield
        except Exception:
            success = False
            raise
        finally:
            duration = time.perf_counter() - start
            self.track_db_query(operation, table, duration, success)

    # ============ External Service Instrumentation ============

    def track_external_request(
        self,
        target_service: str,
        method: str,
        duration: float,
        success: bool = True
    ):
        """Track an external service request"""
        if not self._enabled:
            return

        status = "success" if success else "error"

        self.external_requests_total.labels(
            service=self.service_name,
            target_service=target_service,
            method=method,
            status=status
        ).inc()

        self.external_request_duration_seconds.labels(
            service=self.service_name,
            target_service=target_service,
            method=method
        ).observe(duration)

    @contextmanager
    def track_external_request_duration(self, target_service: str, method: str):
        """Context manager to track external service request duration"""
        if not self._enabled:
            yield
            return

        start = time.perf_counter()
        success = True
        try:
            yield
        except Exception:
            success = False
            raise
        finally:
            duration = time.perf_counter() - start
            self.track_external_request(target_service, method, duration, success)

    # ============ Business Metrics ============

    def track_transaction(
        self,
        transaction_type: str,
        status: str,
        amount: Optional[float] = None,
        currency: str = "BRL"
    ):
        """Track a business transaction"""
        if not self._enabled:
            return

        self.transactions_total.labels(
            service=self.service_name,
            type=transaction_type,
            status=status
        ).inc()

        if amount is not None:
            # Convert to cents to avoid floating point issues
            amount_cents = int(amount * 100)
            self.transaction_amount_total.labels(
                service=self.service_name,
                type=transaction_type,
                currency=currency
            ).inc(amount_cents)

    # ============ Cache Metrics ============

    def track_cache_hit(self, cache_name: str):
        """Track a cache hit"""
        if not self._enabled:
            return
        self.cache_hits_total.labels(
            service=self.service_name,
            cache_name=cache_name
        ).inc()

    def track_cache_miss(self, cache_name: str):
        """Track a cache miss"""
        if not self._enabled:
            return
        self.cache_misses_total.labels(
            service=self.service_name,
            cache_name=cache_name
        ).inc()

    # ============ Prometheus Export ============

    def get_metrics(self) -> bytes:
        """Get metrics in Prometheus format"""
        if not self._enabled:
            return b""
        return generate_latest(self.registry)

    def get_content_type(self) -> str:
        """Get Prometheus content type"""
        if not self._enabled:
            return "text/plain"
        return CONTENT_TYPE_LATEST


# Global metrics instance (set by setup_metrics)
metrics: Optional[MetricsCollector] = None


def setup_metrics(service_name: str) -> MetricsCollector:
    """
    Setup metrics collection for a service.

    Args:
        service_name: Name of the service

    Returns:
        MetricsCollector instance
    """
    global metrics
    metrics = MetricsCollector(service_name)
    return metrics


def get_metrics() -> Optional[MetricsCollector]:
    """Get the global metrics collector"""
    return metrics


# Decorator for tracking function duration
def track_duration(metric_type: str = "http", **labels):
    """
    Decorator to track function duration.

    Usage:
        @track_duration(metric_type="external", target_service="accounts")
        async def call_accounts_service():
            pass
    """
    def decorator(func: Callable):
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            if metrics is None:
                return await func(*args, **kwargs)

            start = time.perf_counter()
            try:
                result = await func(*args, **kwargs)
                duration = time.perf_counter() - start

                if metric_type == "external":
                    metrics.track_external_request(
                        labels.get("target_service", "unknown"),
                        labels.get("method", "unknown"),
                        duration,
                        success=True
                    )
                elif metric_type == "db":
                    metrics.track_db_query(
                        labels.get("operation", "unknown"),
                        labels.get("table", "unknown"),
                        duration,
                        success=True
                    )

                return result
            except Exception as e:
                duration = time.perf_counter() - start

                if metric_type == "external":
                    metrics.track_external_request(
                        labels.get("target_service", "unknown"),
                        labels.get("method", "unknown"),
                        duration,
                        success=False
                    )
                elif metric_type == "db":
                    metrics.track_db_query(
                        labels.get("operation", "unknown"),
                        labels.get("table", "unknown"),
                        duration,
                        success=False
                    )

                raise

        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            if metrics is None:
                return func(*args, **kwargs)

            start = time.perf_counter()
            try:
                result = func(*args, **kwargs)
                duration = time.perf_counter() - start

                if metric_type == "db":
                    metrics.track_db_query(
                        labels.get("operation", "unknown"),
                        labels.get("table", "unknown"),
                        duration,
                        success=True
                    )

                return result
            except Exception:
                duration = time.perf_counter() - start

                if metric_type == "db":
                    metrics.track_db_query(
                        labels.get("operation", "unknown"),
                        labels.get("table", "unknown"),
                        duration,
                        success=False
                    )

                raise

        import asyncio
        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        return sync_wrapper

    return decorator
