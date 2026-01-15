"""
Production Health Checks
Comprehensive health checking with dependency verification
"""
import asyncio
import time
from datetime import datetime, timezone
from enum import Enum
from typing import Optional, List, Dict, Any, Callable, Awaitable
from dataclasses import dataclass, field
import logging

logger = logging.getLogger(__name__)


class HealthStatus(str, Enum):
    """Health check status"""
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"


@dataclass
class DependencyHealth:
    """Health status of a dependency"""
    name: str
    status: HealthStatus
    latency_ms: float
    message: Optional[str] = None
    details: Dict[str, Any] = field(default_factory=dict)


@dataclass
class HealthCheckResult:
    """Complete health check result"""
    status: HealthStatus
    service: str
    version: str
    timestamp: str
    uptime_seconds: float
    dependencies: List[DependencyHealth] = field(default_factory=list)
    details: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON response"""
        return {
            "status": self.status.value,
            "service": self.service,
            "version": self.version,
            "timestamp": self.timestamp,
            "uptime_seconds": round(self.uptime_seconds, 2),
            "dependencies": [
                {
                    "name": dep.name,
                    "status": dep.status.value,
                    "latency_ms": round(dep.latency_ms, 2),
                    "message": dep.message,
                    **dep.details
                }
                for dep in self.dependencies
            ],
            **self.details
        }


class HealthChecker:
    """
    Comprehensive health checker for microservices.

    Features:
    - Database connectivity check
    - Redis connectivity check
    - External service dependency checks
    - Custom health check registration
    - Graceful degradation detection

    Usage:
        checker = HealthChecker("pix-service", "2.0.0")
        checker.add_database_check(db_session_factory)
        checker.add_redis_check(redis_client)
        checker.add_http_check("accounts-service", "http://accounts:8080/health")

        result = await checker.check()
    """

    def __init__(
        self,
        service_name: str,
        version: str,
        timeout: float = 5.0
    ):
        self.service_name = service_name
        self.version = version
        self.timeout = timeout
        self.start_time = time.time()
        self._checks: List[tuple] = []  # (name, check_func, critical)

    def add_check(
        self,
        name: str,
        check_func: Callable[[], Awaitable[DependencyHealth]],
        critical: bool = True
    ):
        """
        Add a custom health check.

        Args:
            name: Name of the dependency
            check_func: Async function that returns DependencyHealth
            critical: If True, failure makes service unhealthy. If False, only degraded.
        """
        self._checks.append((name, check_func, critical))

    def add_database_check(
        self,
        session_factory: Callable,
        critical: bool = True
    ):
        """Add a database connectivity check"""

        async def check() -> DependencyHealth:
            start = time.perf_counter()
            try:
                # Try to execute a simple query
                session = session_factory()
                try:
                    session.execute("SELECT 1")
                    latency = (time.perf_counter() - start) * 1000
                    return DependencyHealth(
                        name="database",
                        status=HealthStatus.HEALTHY,
                        latency_ms=latency,
                        message="Connected"
                    )
                finally:
                    session.close()
            except Exception as e:
                latency = (time.perf_counter() - start) * 1000
                logger.error(f"Database health check failed: {e}")
                return DependencyHealth(
                    name="database",
                    status=HealthStatus.UNHEALTHY,
                    latency_ms=latency,
                    message=str(e)
                )

        self._checks.append(("database", check, critical))

    def add_redis_check(
        self,
        redis_client: Any,
        critical: bool = False
    ):
        """Add a Redis connectivity check"""

        async def check() -> DependencyHealth:
            start = time.perf_counter()
            try:
                # Try to ping Redis
                if asyncio.iscoroutinefunction(redis_client.ping):
                    await redis_client.ping()
                else:
                    redis_client.ping()

                latency = (time.perf_counter() - start) * 1000
                return DependencyHealth(
                    name="redis",
                    status=HealthStatus.HEALTHY,
                    latency_ms=latency,
                    message="Connected"
                )
            except Exception as e:
                latency = (time.perf_counter() - start) * 1000
                logger.warning(f"Redis health check failed: {e}")
                return DependencyHealth(
                    name="redis",
                    status=HealthStatus.UNHEALTHY,
                    latency_ms=latency,
                    message=str(e)
                )

        self._checks.append(("redis", check, critical))

    def add_http_check(
        self,
        name: str,
        url: str,
        critical: bool = False,
        expected_status: int = 200
    ):
        """Add an HTTP endpoint health check"""

        async def check() -> DependencyHealth:
            import httpx

            start = time.perf_counter()
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    response = await client.get(url)
                    latency = (time.perf_counter() - start) * 1000

                    if response.status_code == expected_status:
                        return DependencyHealth(
                            name=name,
                            status=HealthStatus.HEALTHY,
                            latency_ms=latency,
                            message=f"HTTP {response.status_code}",
                            details={"url": url}
                        )
                    else:
                        return DependencyHealth(
                            name=name,
                            status=HealthStatus.DEGRADED,
                            latency_ms=latency,
                            message=f"Unexpected status: {response.status_code}",
                            details={"url": url, "status_code": response.status_code}
                        )
            except Exception as e:
                latency = (time.perf_counter() - start) * 1000
                logger.warning(f"HTTP health check for {name} failed: {e}")
                return DependencyHealth(
                    name=name,
                    status=HealthStatus.UNHEALTHY,
                    latency_ms=latency,
                    message=str(e),
                    details={"url": url}
                )

        self._checks.append((name, check, critical))

    async def check(self) -> HealthCheckResult:
        """
        Run all health checks and return aggregated result.

        Returns overall status based on:
        - UNHEALTHY: Any critical dependency is unhealthy
        - DEGRADED: Any dependency (critical or not) is unhealthy/degraded
        - HEALTHY: All dependencies are healthy
        """
        dependencies: List[DependencyHealth] = []
        overall_status = HealthStatus.HEALTHY

        # Run all checks concurrently with timeout
        tasks = []
        for name, check_func, critical in self._checks:
            tasks.append(self._run_check_with_timeout(name, check_func, critical))

        results = await asyncio.gather(*tasks, return_exceptions=True)

        for i, result in enumerate(results):
            name, _, critical = self._checks[i]

            if isinstance(result, Exception):
                dep_health = DependencyHealth(
                    name=name,
                    status=HealthStatus.UNHEALTHY,
                    latency_ms=self.timeout * 1000,
                    message=f"Check failed: {result}"
                )
            else:
                dep_health = result

            dependencies.append(dep_health)

            # Update overall status
            if dep_health.status == HealthStatus.UNHEALTHY:
                if critical:
                    overall_status = HealthStatus.UNHEALTHY
                elif overall_status == HealthStatus.HEALTHY:
                    overall_status = HealthStatus.DEGRADED
            elif dep_health.status == HealthStatus.DEGRADED:
                if overall_status == HealthStatus.HEALTHY:
                    overall_status = HealthStatus.DEGRADED

        return HealthCheckResult(
            status=overall_status,
            service=self.service_name,
            version=self.version,
            timestamp=datetime.now(timezone.utc).isoformat(),
            uptime_seconds=time.time() - self.start_time,
            dependencies=dependencies
        )

    async def _run_check_with_timeout(
        self,
        name: str,
        check_func: Callable,
        critical: bool
    ) -> DependencyHealth:
        """Run a health check with timeout"""
        try:
            return await asyncio.wait_for(
                check_func(),
                timeout=self.timeout
            )
        except asyncio.TimeoutError:
            return DependencyHealth(
                name=name,
                status=HealthStatus.UNHEALTHY,
                latency_ms=self.timeout * 1000,
                message=f"Timeout after {self.timeout}s"
            )

    async def liveness(self) -> Dict[str, Any]:
        """
        Simple liveness check (is the service running?).

        Used by Kubernetes liveness probe.
        Should NOT check external dependencies.
        """
        return {
            "status": "alive",
            "service": self.service_name,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    async def readiness(self) -> HealthCheckResult:
        """
        Readiness check (is the service ready to receive traffic?).

        Used by Kubernetes readiness probe.
        Checks all dependencies.
        """
        return await self.check()


# Helper function to create FastAPI health endpoints
def create_health_endpoints(app, checker: HealthChecker):
    """
    Add health check endpoints to a FastAPI application.

    Creates:
    - GET /health - Full health check with dependencies
    - GET /health/live - Simple liveness check
    - GET /health/ready - Readiness check for Kubernetes
    """
    from fastapi import Response

    @app.get("/health", tags=["Health"])
    async def health_check():
        """Full health check with all dependencies"""
        result = await checker.check()

        # Return 503 if unhealthy
        status_code = 200
        if result.status == HealthStatus.UNHEALTHY:
            status_code = 503
        elif result.status == HealthStatus.DEGRADED:
            status_code = 200  # Still serve traffic but warn

        return Response(
            content=str(result.to_dict()).replace("'", '"'),
            media_type="application/json",
            status_code=status_code
        )

    @app.get("/health/live", tags=["Health"])
    async def liveness_check():
        """Liveness probe - is the service running?"""
        return await checker.liveness()

    @app.get("/health/ready", tags=["Health"])
    async def readiness_check():
        """Readiness probe - is the service ready for traffic?"""
        result = await checker.readiness()

        status_code = 200 if result.status != HealthStatus.UNHEALTHY else 503

        return Response(
            content=str(result.to_dict()).replace("'", '"'),
            media_type="application/json",
            status_code=status_code
        )

    return app
