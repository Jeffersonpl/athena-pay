"""
Production HTTP Client
Resilient HTTP client with retry, circuit breaker, and observability
"""
import asyncio
import time
import logging
from typing import Optional, Dict, Any, List, Union
from dataclasses import dataclass, field
from enum import Enum

import httpx

from .circuit_breaker import CircuitBreaker, CircuitBreakerConfig, CircuitBreakerOpen
from .logging import correlation_id_var
from .metrics import metrics

logger = logging.getLogger(__name__)


class RetryStrategy(Enum):
    """Retry strategies"""
    NONE = "none"
    FIXED = "fixed"
    EXPONENTIAL = "exponential"


@dataclass
class RetryConfig:
    """Retry configuration"""
    max_retries: int = 3
    strategy: RetryStrategy = RetryStrategy.EXPONENTIAL
    initial_delay: float = 0.5  # seconds
    max_delay: float = 30.0     # seconds
    exponential_base: float = 2.0
    retry_status_codes: List[int] = field(
        default_factory=lambda: [408, 429, 500, 502, 503, 504]
    )
    retry_exceptions: List[type] = field(
        default_factory=lambda: [
            httpx.ConnectError,
            httpx.ConnectTimeout,
            httpx.ReadTimeout,
            asyncio.TimeoutError
        ]
    )


@dataclass
class ServiceClientConfig:
    """Service client configuration"""
    base_url: str
    timeout: float = 10.0
    connect_timeout: float = 5.0
    retry_config: Optional[RetryConfig] = None
    circuit_breaker_config: Optional[CircuitBreakerConfig] = None
    headers: Dict[str, str] = field(default_factory=dict)


class ServiceClient:
    """
    Production-ready HTTP client for service-to-service communication.

    Features:
    - Automatic retry with configurable strategies
    - Circuit breaker for fault tolerance
    - Request/response logging
    - Metrics collection
    - Correlation ID propagation
    - Timeout handling

    Usage:
        client = ServiceClient(
            ServiceClientConfig(
                base_url="http://accounts-service:8080",
                timeout=10.0
            ),
            service_name="accounts"
        )

        response = await client.get("/accounts/123")
        data = await client.post("/accounts", json={"name": "Test"})
    """

    def __init__(
        self,
        config: ServiceClientConfig,
        service_name: str
    ):
        self.config = config
        self.service_name = service_name
        self.retry_config = config.retry_config or RetryConfig()

        # Setup circuit breaker
        self.circuit_breaker: Optional[CircuitBreaker] = None
        if config.circuit_breaker_config:
            self.circuit_breaker = CircuitBreaker(
                service_name,
                config.circuit_breaker_config
            )

        # HTTP client with connection pooling
        self._client: Optional[httpx.AsyncClient] = None

    async def _get_client(self) -> httpx.AsyncClient:
        """Get or create HTTP client with connection pooling"""
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                base_url=self.config.base_url,
                timeout=httpx.Timeout(
                    timeout=self.config.timeout,
                    connect=self.config.connect_timeout
                ),
                headers={
                    "User-Agent": f"athena-service-client/{self.service_name}",
                    "Accept": "application/json",
                    **self.config.headers
                },
                http2=True,  # Enable HTTP/2 for better performance
                limits=httpx.Limits(
                    max_connections=100,
                    max_keepalive_connections=20
                )
            )
        return self._client

    async def close(self):
        """Close the HTTP client"""
        if self._client and not self._client.is_closed:
            await self._client.aclose()
            self._client = None

    def _get_retry_delay(self, attempt: int) -> float:
        """Calculate retry delay based on strategy"""
        if self.retry_config.strategy == RetryStrategy.NONE:
            return 0

        if self.retry_config.strategy == RetryStrategy.FIXED:
            return self.retry_config.initial_delay

        # Exponential backoff
        delay = self.retry_config.initial_delay * (
            self.retry_config.exponential_base ** attempt
        )
        return min(delay, self.retry_config.max_delay)

    def _should_retry(
        self,
        attempt: int,
        response: Optional[httpx.Response] = None,
        exception: Optional[Exception] = None
    ) -> bool:
        """Determine if request should be retried"""
        if attempt >= self.retry_config.max_retries:
            return False

        if exception:
            return any(
                isinstance(exception, exc_type)
                for exc_type in self.retry_config.retry_exceptions
            )

        if response:
            return response.status_code in self.retry_config.retry_status_codes

        return False

    def _build_headers(self) -> Dict[str, str]:
        """Build request headers with correlation ID"""
        headers = {}

        # Propagate correlation ID
        correlation_id = correlation_id_var.get()
        if correlation_id:
            headers["X-Correlation-ID"] = correlation_id
            headers["X-Request-ID"] = correlation_id

        return headers

    async def _execute_request(
        self,
        method: str,
        path: str,
        **kwargs
    ) -> httpx.Response:
        """Execute HTTP request with retry logic"""
        client = await self._get_client()

        # Add correlation headers
        request_headers = self._build_headers()
        if "headers" in kwargs:
            request_headers.update(kwargs.pop("headers"))
        kwargs["headers"] = request_headers

        last_exception: Optional[Exception] = None
        last_response: Optional[httpx.Response] = None

        for attempt in range(self.retry_config.max_retries + 1):
            start_time = time.perf_counter()

            try:
                response = await client.request(method, path, **kwargs)
                duration = time.perf_counter() - start_time

                # Track metrics
                if metrics:
                    metrics.track_external_request(
                        self.service_name,
                        method,
                        duration,
                        success=response.is_success
                    )

                # Log request
                logger.debug(
                    f"HTTP {method} {self.config.base_url}{path} -> {response.status_code}",
                    extra={
                        "service": self.service_name,
                        "method": method,
                        "path": path,
                        "status_code": response.status_code,
                        "duration_ms": duration * 1000,
                        "attempt": attempt + 1
                    }
                )

                if response.is_success:
                    return response

                last_response = response

                if not self._should_retry(attempt, response=response):
                    return response

            except tuple(self.retry_config.retry_exceptions) as e:
                duration = time.perf_counter() - start_time
                last_exception = e

                # Track metrics
                if metrics:
                    metrics.track_external_request(
                        self.service_name,
                        method,
                        duration,
                        success=False
                    )

                logger.warning(
                    f"HTTP {method} {self.config.base_url}{path} failed: {e}",
                    extra={
                        "service": self.service_name,
                        "method": method,
                        "path": path,
                        "error": str(e),
                        "attempt": attempt + 1
                    }
                )

                if not self._should_retry(attempt, exception=e):
                    raise

            # Wait before retry
            delay = self._get_retry_delay(attempt)
            logger.info(
                f"Retrying request to {self.service_name} in {delay:.2f}s "
                f"(attempt {attempt + 2}/{self.retry_config.max_retries + 1})"
            )
            await asyncio.sleep(delay)

        # All retries exhausted
        if last_exception:
            raise last_exception
        return last_response

    async def _request_with_circuit_breaker(
        self,
        method: str,
        path: str,
        **kwargs
    ) -> httpx.Response:
        """Execute request through circuit breaker"""
        if self.circuit_breaker:
            return await self.circuit_breaker.call(
                self._execute_request,
                method,
                path,
                **kwargs
            )
        return await self._execute_request(method, path, **kwargs)

    # ============ HTTP Methods ============

    async def get(
        self,
        path: str,
        params: Optional[Dict[str, Any]] = None,
        **kwargs
    ) -> httpx.Response:
        """Execute GET request"""
        return await self._request_with_circuit_breaker(
            "GET", path, params=params, **kwargs
        )

    async def post(
        self,
        path: str,
        json: Optional[Dict[str, Any]] = None,
        data: Optional[Dict[str, Any]] = None,
        **kwargs
    ) -> httpx.Response:
        """Execute POST request"""
        return await self._request_with_circuit_breaker(
            "POST", path, json=json, data=data, **kwargs
        )

    async def put(
        self,
        path: str,
        json: Optional[Dict[str, Any]] = None,
        **kwargs
    ) -> httpx.Response:
        """Execute PUT request"""
        return await self._request_with_circuit_breaker(
            "PUT", path, json=json, **kwargs
        )

    async def patch(
        self,
        path: str,
        json: Optional[Dict[str, Any]] = None,
        **kwargs
    ) -> httpx.Response:
        """Execute PATCH request"""
        return await self._request_with_circuit_breaker(
            "PATCH", path, json=json, **kwargs
        )

    async def delete(
        self,
        path: str,
        **kwargs
    ) -> httpx.Response:
        """Execute DELETE request"""
        return await self._request_with_circuit_breaker(
            "DELETE", path, **kwargs
        )

    # ============ Convenience Methods ============

    async def get_json(
        self,
        path: str,
        params: Optional[Dict[str, Any]] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """GET request and return JSON response"""
        response = await self.get(path, params=params, **kwargs)
        response.raise_for_status()
        return response.json()

    async def post_json(
        self,
        path: str,
        json: Optional[Dict[str, Any]] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """POST request and return JSON response"""
        response = await self.post(path, json=json, **kwargs)
        response.raise_for_status()
        return response.json()


class ServiceClientFactory:
    """
    Factory for creating service clients with shared configuration.

    Usage:
        factory = ServiceClientFactory()
        accounts_client = factory.create("accounts", "http://accounts:8080")
        pix_client = factory.create("pix", "http://pix:8080")
    """

    def __init__(
        self,
        default_retry_config: Optional[RetryConfig] = None,
        default_circuit_breaker_config: Optional[CircuitBreakerConfig] = None,
        default_timeout: float = 10.0
    ):
        self.default_retry_config = default_retry_config or RetryConfig()
        self.default_circuit_breaker_config = (
            default_circuit_breaker_config or CircuitBreakerConfig()
        )
        self.default_timeout = default_timeout
        self._clients: Dict[str, ServiceClient] = {}

    def create(
        self,
        service_name: str,
        base_url: str,
        timeout: Optional[float] = None,
        retry_config: Optional[RetryConfig] = None,
        circuit_breaker_config: Optional[CircuitBreakerConfig] = None
    ) -> ServiceClient:
        """Create a service client"""
        if service_name in self._clients:
            return self._clients[service_name]

        config = ServiceClientConfig(
            base_url=base_url,
            timeout=timeout or self.default_timeout,
            retry_config=retry_config or self.default_retry_config,
            circuit_breaker_config=(
                circuit_breaker_config or self.default_circuit_breaker_config
            )
        )

        client = ServiceClient(config, service_name)
        self._clients[service_name] = client
        return client

    async def close_all(self):
        """Close all clients"""
        for client in self._clients.values():
            await client.close()
        self._clients.clear()
