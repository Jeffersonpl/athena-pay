"""
Production Logging Configuration
Structured JSON logging with correlation IDs and context
"""
import sys
import logging
import json
import traceback
from datetime import datetime, timezone
from typing import Optional, Any, Dict
from contextvars import ContextVar
from functools import wraps

# Context variables for request tracing
correlation_id_var: ContextVar[Optional[str]] = ContextVar('correlation_id', default=None)
request_id_var: ContextVar[Optional[str]] = ContextVar('request_id', default=None)
user_id_var: ContextVar[Optional[str]] = ContextVar('user_id', default=None)
service_name_var: ContextVar[str] = ContextVar('service_name', default='athena')


class StructuredFormatter(logging.Formatter):
    """
    JSON structured log formatter for production.

    Output format:
    {
        "timestamp": "2024-01-15T10:00:00.000Z",
        "level": "INFO",
        "logger": "app.main",
        "message": "Request processed",
        "service": "pix-service",
        "correlation_id": "abc-123",
        "request_id": "req-456",
        "user_id": "user-789",
        "extra": {...}
    }
    """

    def format(self, record: logging.LogRecord) -> str:
        # Base log structure
        log_data = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "service": service_name_var.get(),
        }

        # Add context from context vars
        correlation_id = correlation_id_var.get()
        if correlation_id:
            log_data["correlation_id"] = correlation_id

        request_id = request_id_var.get()
        if request_id:
            log_data["request_id"] = request_id

        user_id = user_id_var.get()
        if user_id:
            log_data["user_id"] = user_id

        # Add source location for errors
        if record.levelno >= logging.ERROR:
            log_data["location"] = {
                "file": record.pathname,
                "line": record.lineno,
                "function": record.funcName
            }

        # Add exception info
        if record.exc_info:
            log_data["exception"] = {
                "type": record.exc_info[0].__name__ if record.exc_info[0] else None,
                "message": str(record.exc_info[1]) if record.exc_info[1] else None,
                "traceback": traceback.format_exception(*record.exc_info)
            }

        # Add extra fields
        extra_fields = {}
        for key, value in record.__dict__.items():
            if key not in (
                'name', 'msg', 'args', 'created', 'filename', 'funcName',
                'levelname', 'levelno', 'lineno', 'module', 'msecs',
                'pathname', 'process', 'processName', 'relativeCreated',
                'stack_info', 'exc_info', 'exc_text', 'thread', 'threadName',
                'message', 'taskName'
            ):
                extra_fields[key] = value

        if extra_fields:
            log_data["extra"] = extra_fields

        return json.dumps(log_data, default=str, ensure_ascii=False)


class TextFormatter(logging.Formatter):
    """Human-readable formatter for development"""

    COLORS = {
        'DEBUG': '\033[36m',     # Cyan
        'INFO': '\033[32m',      # Green
        'WARNING': '\033[33m',   # Yellow
        'ERROR': '\033[31m',     # Red
        'CRITICAL': '\033[35m',  # Magenta
        'RESET': '\033[0m'
    }

    def format(self, record: logging.LogRecord) -> str:
        color = self.COLORS.get(record.levelname, '')
        reset = self.COLORS['RESET']

        # Build prefix
        correlation_id = correlation_id_var.get()
        prefix = f"[{correlation_id[:8]}] " if correlation_id else ""

        # Format message
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        message = record.getMessage()

        formatted = f"{timestamp} {color}{record.levelname:8}{reset} {prefix}{record.name} - {message}"

        # Add exception if present
        if record.exc_info:
            formatted += '\n' + ''.join(traceback.format_exception(*record.exc_info))

        return formatted


class StructuredLogger:
    """
    Enhanced logger with structured context support.

    Usage:
        logger = StructuredLogger("my_module")
        logger.info("User logged in", user_id="123", ip="1.2.3.4")
        logger.error("Payment failed", amount=100, error_code="INSUFFICIENT_FUNDS")
    """

    def __init__(self, name: str):
        self._logger = logging.getLogger(name)

    def _log(self, level: int, message: str, **kwargs):
        """Internal log method with extra context"""
        self._logger.log(level, message, extra=kwargs)

    def debug(self, message: str, **kwargs):
        """Log debug message"""
        self._log(logging.DEBUG, message, **kwargs)

    def info(self, message: str, **kwargs):
        """Log info message"""
        self._log(logging.INFO, message, **kwargs)

    def warning(self, message: str, **kwargs):
        """Log warning message"""
        self._log(logging.WARNING, message, **kwargs)

    def error(self, message: str, exc_info: bool = False, **kwargs):
        """Log error message"""
        self._logger.error(message, exc_info=exc_info, extra=kwargs)

    def critical(self, message: str, exc_info: bool = True, **kwargs):
        """Log critical message"""
        self._logger.critical(message, exc_info=exc_info, extra=kwargs)

    def exception(self, message: str, **kwargs):
        """Log exception with traceback"""
        self._logger.exception(message, extra=kwargs)

    # Context managers for scoped logging
    def with_context(self, **context):
        """Create a child logger with additional context"""
        return _ContextualLogger(self._logger, context)


class _ContextualLogger:
    """Logger with fixed context fields"""

    def __init__(self, logger: logging.Logger, context: Dict[str, Any]):
        self._logger = logger
        self._context = context

    def _log(self, level: int, message: str, **kwargs):
        merged = {**self._context, **kwargs}
        self._logger.log(level, message, extra=merged)

    def debug(self, message: str, **kwargs):
        self._log(logging.DEBUG, message, **kwargs)

    def info(self, message: str, **kwargs):
        self._log(logging.INFO, message, **kwargs)

    def warning(self, message: str, **kwargs):
        self._log(logging.WARNING, message, **kwargs)

    def error(self, message: str, exc_info: bool = False, **kwargs):
        self._logger.error(message, exc_info=exc_info, extra={**self._context, **kwargs})

    def exception(self, message: str, **kwargs):
        self._logger.exception(message, extra={**self._context, **kwargs})


def setup_logging(
    service_name: str,
    level: str = "INFO",
    format_type: str = "json",
    include_timestamp: bool = True
) -> None:
    """
    Setup structured logging for the application.

    Args:
        service_name: Name of the service for log identification
        level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        format_type: Output format - 'json' for production, 'text' for development
        include_timestamp: Include timestamp in logs
    """
    # Set service name in context
    service_name_var.set(service_name)

    # Get root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, level.upper()))

    # Remove existing handlers
    root_logger.handlers.clear()

    # Create handler
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(getattr(logging, level.upper()))

    # Set formatter based on format type
    if format_type.lower() == "json":
        formatter = StructuredFormatter()
    else:
        formatter = TextFormatter()

    handler.setFormatter(formatter)
    root_logger.addHandler(handler)

    # Suppress noisy loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)


def get_logger(name: str) -> StructuredLogger:
    """
    Get a structured logger instance.

    Args:
        name: Logger name (usually __name__)

    Returns:
        StructuredLogger instance
    """
    return StructuredLogger(name)


def log_function_call(logger: Optional[StructuredLogger] = None):
    """
    Decorator to log function entry and exit.

    Usage:
        @log_function_call()
        def my_function(arg1, arg2):
            pass
    """
    def decorator(func):
        _logger = logger or get_logger(func.__module__)

        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            _logger.debug(
                f"Entering {func.__name__}",
                function=func.__name__,
                args_count=len(args),
                kwargs_keys=list(kwargs.keys())
            )
            try:
                result = await func(*args, **kwargs)
                _logger.debug(f"Exiting {func.__name__}", function=func.__name__)
                return result
            except Exception as e:
                _logger.error(
                    f"Exception in {func.__name__}: {e}",
                    function=func.__name__,
                    exc_info=True
                )
                raise

        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            _logger.debug(
                f"Entering {func.__name__}",
                function=func.__name__,
                args_count=len(args),
                kwargs_keys=list(kwargs.keys())
            )
            try:
                result = func(*args, **kwargs)
                _logger.debug(f"Exiting {func.__name__}", function=func.__name__)
                return result
            except Exception as e:
                _logger.error(
                    f"Exception in {func.__name__}: {e}",
                    function=func.__name__,
                    exc_info=True
                )
                raise

        import asyncio
        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        return sync_wrapper

    return decorator


# Audit logging for sensitive operations
class AuditLogger:
    """
    Specialized logger for audit trail.

    All audit logs are INFO level and include:
    - timestamp
    - user_id
    - action
    - resource_type
    - resource_id
    - status
    - additional details
    """

    def __init__(self):
        self._logger = logging.getLogger("audit")

    def log(
        self,
        action: str,
        resource_type: str,
        resource_id: str,
        status: str = "success",
        user_id: Optional[str] = None,
        **details
    ):
        """Log an audit event"""
        self._logger.info(
            f"AUDIT: {action} on {resource_type}/{resource_id}",
            extra={
                "audit": True,
                "action": action,
                "resource_type": resource_type,
                "resource_id": resource_id,
                "status": status,
                "user_id": user_id or user_id_var.get(),
                "details": details
            }
        )


# Global audit logger instance
audit_logger = AuditLogger()
