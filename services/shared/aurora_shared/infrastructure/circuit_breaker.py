"""
Circuit Breaker Pattern Implementation
Prevents cascading failures in distributed systems
"""
import asyncio
import time
import logging
from enum import Enum
from typing import Optional, Callable, Any, TypeVar, Generic
from dataclasses import dataclass, field
from functools import wraps
from collections import deque
from threading import Lock

logger = logging.getLogger(__name__)

T = TypeVar('T')


class CircuitState(Enum):
    """Circuit breaker states"""
    CLOSED = "closed"      # Normal operation
    OPEN = "open"          # Failing fast
    HALF_OPEN = "half_open"  # Testing recovery


class CircuitBreakerOpen(Exception):
    """Exception raised when circuit is open"""

    def __init__(self, service_name: str, recovery_time: float):
        self.service_name = service_name
        self.recovery_time = recovery_time
        super().__init__(
            f"Circuit breaker for {service_name} is open. "
            f"Retry after {recovery_time:.1f} seconds"
        )


@dataclass
class CircuitBreakerConfig:
    """Circuit breaker configuration"""
    failure_threshold: int = 5        # Failures before opening
    recovery_timeout: float = 30.0    # Seconds before trying again
    half_open_requests: int = 3       # Requests to test in half-open
    success_threshold: int = 2        # Successes to close from half-open
    timeout: float = 10.0             # Request timeout in seconds


@dataclass
class CircuitBreakerStats:
    """Circuit breaker statistics"""
    state: CircuitState = CircuitState.CLOSED
    failure_count: int = 0
    success_count: int = 0
    last_failure_time: Optional[float] = None
    last_success_time: Optional[float] = None
    total_requests: int = 0
    total_failures: int = 0
    total_successes: int = 0
    consecutive_failures: int = 0
    consecutive_successes: int = 0


class CircuitBreaker:
    """
    Circuit breaker for protecting external service calls.

    States:
    - CLOSED: Normal operation, requests go through
    - OPEN: Service is failing, fail fast without making requests
    - HALF_OPEN: Testing if service has recovered

    Usage:
        breaker = CircuitBreaker("accounts-service")

        try:
            result = await breaker.call(external_service_call, arg1, arg2)
        except CircuitBreakerOpen as e:
            # Handle circuit open - maybe use fallback
            pass
    """

    def __init__(
        self,
        service_name: str,
        config: Optional[CircuitBreakerConfig] = None
    ):
        self.service_name = service_name
        self.config = config or CircuitBreakerConfig()
        self._stats = CircuitBreakerStats()
        self._lock = Lock()
        self._half_open_count = 0

        # Sliding window for failures (for smarter detection)
        self._failure_window: deque = deque(maxlen=100)
        self._success_window: deque = deque(maxlen=100)

    @property
    def state(self) -> CircuitState:
        """Get current circuit state"""
        return self._stats.state

    @property
    def stats(self) -> CircuitBreakerStats:
        """Get circuit breaker statistics"""
        return self._stats

    def _should_open(self) -> bool:
        """Check if circuit should open based on failures"""
        return self._stats.consecutive_failures >= self.config.failure_threshold

    def _should_close(self) -> bool:
        """Check if circuit should close based on successes in half-open"""
        return self._stats.consecutive_successes >= self.config.success_threshold

    def _can_try_request(self) -> bool:
        """Check if we can make a request (for half-open state)"""
        if self._stats.state == CircuitState.HALF_OPEN:
            return self._half_open_count < self.config.half_open_requests
        return True

    def _transition_to(self, new_state: CircuitState):
        """Transition to a new state"""
        old_state = self._stats.state
        self._stats.state = new_state

        if new_state == CircuitState.HALF_OPEN:
            self._half_open_count = 0
            self._stats.consecutive_successes = 0

        logger.info(
            f"Circuit breaker {self.service_name}: {old_state.value} -> {new_state.value}"
        )

    def _record_success(self):
        """Record a successful request"""
        with self._lock:
            now = time.time()
            self._stats.last_success_time = now
            self._stats.total_successes += 1
            self._stats.success_count += 1
            self._stats.consecutive_successes += 1
            self._stats.consecutive_failures = 0
            self._success_window.append(now)

            if self._stats.state == CircuitState.HALF_OPEN:
                if self._should_close():
                    self._transition_to(CircuitState.CLOSED)

    def _record_failure(self, error: Exception):
        """Record a failed request"""
        with self._lock:
            now = time.time()
            self._stats.last_failure_time = now
            self._stats.total_failures += 1
            self._stats.failure_count += 1
            self._stats.consecutive_failures += 1
            self._stats.consecutive_successes = 0
            self._failure_window.append(now)

            logger.warning(
                f"Circuit breaker {self.service_name}: failure recorded - {error}"
            )

            if self._stats.state == CircuitState.CLOSED:
                if self._should_open():
                    self._transition_to(CircuitState.OPEN)

            elif self._stats.state == CircuitState.HALF_OPEN:
                # Any failure in half-open goes back to open
                self._transition_to(CircuitState.OPEN)

    def _check_recovery(self) -> bool:
        """Check if enough time has passed to try recovery"""
        if self._stats.last_failure_time is None:
            return True

        elapsed = time.time() - self._stats.last_failure_time
        return elapsed >= self.config.recovery_timeout

    async def call(
        self,
        func: Callable[..., Any],
        *args,
        fallback: Optional[Callable[..., Any]] = None,
        **kwargs
    ) -> Any:
        """
        Execute a function with circuit breaker protection.

        Args:
            func: Async function to execute
            *args: Arguments to pass to function
            fallback: Optional fallback function if circuit is open
            **kwargs: Keyword arguments to pass to function

        Returns:
            Result from func or fallback

        Raises:
            CircuitBreakerOpen: If circuit is open and no fallback provided
        """
        self._stats.total_requests += 1

        # Check current state
        if self._stats.state == CircuitState.OPEN:
            if self._check_recovery():
                self._transition_to(CircuitState.HALF_OPEN)
            else:
                recovery_time = self.config.recovery_timeout - (
                    time.time() - self._stats.last_failure_time
                )
                if fallback:
                    logger.info(
                        f"Circuit {self.service_name} open, using fallback"
                    )
                    return await fallback(*args, **kwargs) if asyncio.iscoroutinefunction(fallback) else fallback(*args, **kwargs)
                raise CircuitBreakerOpen(self.service_name, recovery_time)

        # Check if we can make request in half-open
        if self._stats.state == CircuitState.HALF_OPEN:
            if not self._can_try_request():
                if fallback:
                    return await fallback(*args, **kwargs) if asyncio.iscoroutinefunction(fallback) else fallback(*args, **kwargs)
                raise CircuitBreakerOpen(self.service_name, 0)
            self._half_open_count += 1

        # Execute the function
        try:
            if asyncio.iscoroutinefunction(func):
                result = await asyncio.wait_for(
                    func(*args, **kwargs),
                    timeout=self.config.timeout
                )
            else:
                result = func(*args, **kwargs)

            self._record_success()
            return result

        except asyncio.TimeoutError as e:
            self._record_failure(e)
            if fallback:
                return await fallback(*args, **kwargs) if asyncio.iscoroutinefunction(fallback) else fallback(*args, **kwargs)
            raise

        except Exception as e:
            self._record_failure(e)
            if fallback:
                return await fallback(*args, **kwargs) if asyncio.iscoroutinefunction(fallback) else fallback(*args, **kwargs)
            raise

    def reset(self):
        """Manually reset the circuit breaker"""
        with self._lock:
            self._stats = CircuitBreakerStats()
            self._half_open_count = 0
            self._failure_window.clear()
            self._success_window.clear()
            logger.info(f"Circuit breaker {self.service_name}: manually reset")


class CircuitBreakerRegistry:
    """
    Registry for managing multiple circuit breakers.

    Usage:
        registry = CircuitBreakerRegistry()
        registry.register("accounts-service")
        registry.register("pix-service")

        breaker = registry.get("accounts-service")
        result = await breaker.call(some_function)
    """

    def __init__(self, default_config: Optional[CircuitBreakerConfig] = None):
        self._breakers: dict[str, CircuitBreaker] = {}
        self._default_config = default_config or CircuitBreakerConfig()
        self._lock = Lock()

    def register(
        self,
        service_name: str,
        config: Optional[CircuitBreakerConfig] = None
    ) -> CircuitBreaker:
        """Register a new circuit breaker"""
        with self._lock:
            if service_name not in self._breakers:
                self._breakers[service_name] = CircuitBreaker(
                    service_name,
                    config or self._default_config
                )
            return self._breakers[service_name]

    def get(self, service_name: str) -> CircuitBreaker:
        """Get a circuit breaker, creating if necessary"""
        if service_name not in self._breakers:
            return self.register(service_name)
        return self._breakers[service_name]

    def get_all_stats(self) -> dict[str, dict]:
        """Get statistics for all circuit breakers"""
        return {
            name: {
                "state": breaker.state.value,
                "total_requests": breaker.stats.total_requests,
                "total_failures": breaker.stats.total_failures,
                "total_successes": breaker.stats.total_successes,
                "consecutive_failures": breaker.stats.consecutive_failures,
                "last_failure": breaker.stats.last_failure_time
            }
            for name, breaker in self._breakers.items()
        }


# Global registry
_registry: Optional[CircuitBreakerRegistry] = None


def get_circuit_breaker_registry() -> CircuitBreakerRegistry:
    """Get or create the global circuit breaker registry"""
    global _registry
    if _registry is None:
        _registry = CircuitBreakerRegistry()
    return _registry


def circuit_breaker(
    service_name: str,
    fallback: Optional[Callable] = None,
    config: Optional[CircuitBreakerConfig] = None
):
    """
    Decorator to apply circuit breaker to a function.

    Usage:
        @circuit_breaker("accounts-service")
        async def call_accounts_api():
            # ... API call
            pass

        @circuit_breaker("payments", fallback=default_payment_response)
        async def process_payment():
            # ... payment processing
            pass
    """
    def decorator(func: Callable):
        registry = get_circuit_breaker_registry()
        breaker = registry.register(service_name, config)

        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            return await breaker.call(func, *args, fallback=fallback, **kwargs)

        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            # For sync functions, we need to run in async context
            loop = asyncio.get_event_loop()
            return loop.run_until_complete(
                breaker.call(func, *args, fallback=fallback, **kwargs)
            )

        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        return sync_wrapper

    return decorator
