"""
Domain Events - Event-driven architecture support.
"""

import uuid
import asyncio
from abc import ABC
from datetime import datetime
from typing import Any, Callable, Dict, List, Type, TypeVar, Optional
from dataclasses import dataclass, field
from functools import wraps
import logging

logger = logging.getLogger(__name__)


@dataclass
class DomainEvent(ABC):
    """
    Base class for Domain Events.
    Domain Events represent something that happened in the domain.
    """
    event_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    occurred_at: datetime = field(default_factory=datetime.utcnow)
    aggregate_id: Optional[str] = None
    aggregate_type: Optional[str] = None
    correlation_id: Optional[str] = None
    causation_id: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

    @property
    def event_type(self) -> str:
        return self.__class__.__name__

    def to_dict(self) -> Dict[str, Any]:
        return {
            "event_id": self.event_id,
            "event_type": self.event_type,
            "occurred_at": self.occurred_at.isoformat(),
            "aggregate_id": self.aggregate_id,
            "aggregate_type": self.aggregate_type,
            "correlation_id": self.correlation_id,
            "causation_id": self.causation_id,
            "metadata": self.metadata,
            "data": self._get_event_data()
        }

    def _get_event_data(self) -> Dict[str, Any]:
        """Override to provide event-specific data."""
        return {
            k: v for k, v in self.__dict__.items()
            if k not in ("event_id", "occurred_at", "aggregate_id", "aggregate_type",
                        "correlation_id", "causation_id", "metadata")
        }


# Type variable for event handlers
E = TypeVar("E", bound=DomainEvent)


class EventHandler(ABC):
    """Base class for event handlers."""

    async def handle(self, event: DomainEvent) -> None:
        """Handle the event."""
        raise NotImplementedError


class EventBus:
    """
    Event Bus for publishing and subscribing to domain events.
    Supports both sync and async handlers.
    """
    _instance: Optional["EventBus"] = None
    _handlers: Dict[Type[DomainEvent], List[Callable]] = {}
    _async_handlers: Dict[Type[DomainEvent], List[Callable]] = {}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._handlers = {}
            cls._instance._async_handlers = {}
        return cls._instance

    @classmethod
    def get_instance(cls) -> "EventBus":
        """Get the singleton instance."""
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    @classmethod
    def reset(cls):
        """Reset the singleton (useful for testing)."""
        cls._instance = None
        cls._handlers = {}
        cls._async_handlers = {}

    def subscribe(
        self,
        event_type: Type[E],
        handler: Callable[[E], None],
        is_async: bool = False
    ):
        """
        Subscribe a handler to an event type.

        Args:
            event_type: The type of event to handle
            handler: The handler function
            is_async: Whether the handler is async
        """
        handlers_dict = self._async_handlers if is_async else self._handlers

        if event_type not in handlers_dict:
            handlers_dict[event_type] = []

        handlers_dict[event_type].append(handler)
        logger.debug(f"Subscribed handler to {event_type.__name__}")

    def unsubscribe(
        self,
        event_type: Type[E],
        handler: Callable[[E], None]
    ):
        """Unsubscribe a handler from an event type."""
        for handlers_dict in [self._handlers, self._async_handlers]:
            if event_type in handlers_dict:
                if handler in handlers_dict[event_type]:
                    handlers_dict[event_type].remove(handler)

    async def publish(self, event: DomainEvent):
        """
        Publish an event to all registered handlers.

        Args:
            event: The domain event to publish
        """
        event_type = type(event)
        logger.info(f"Publishing event: {event_type.__name__} ({event.event_id})")

        # Call sync handlers
        for handler in self._handlers.get(event_type, []):
            try:
                handler(event)
            except Exception as e:
                logger.error(f"Error in sync handler for {event_type.__name__}: {e}")

        # Call async handlers
        tasks = []
        for handler in self._async_handlers.get(event_type, []):
            tasks.append(self._call_async_handler(handler, event))

        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

    async def _call_async_handler(
        self,
        handler: Callable,
        event: DomainEvent
    ):
        """Call an async handler with error handling."""
        try:
            await handler(event)
        except Exception as e:
            logger.error(f"Error in async handler for {type(event).__name__}: {e}")

    def publish_sync(self, event: DomainEvent):
        """Publish event synchronously (only calls sync handlers)."""
        event_type = type(event)
        logger.info(f"Publishing event (sync): {event_type.__name__}")

        for handler in self._handlers.get(event_type, []):
            try:
                handler(event)
            except Exception as e:
                logger.error(f"Error in handler for {event_type.__name__}: {e}")


def event_handler(event_type: Type[DomainEvent], is_async: bool = True):
    """
    Decorator to register a function as an event handler.

    Usage:
        @event_handler(UserCreatedEvent)
        async def handle_user_created(event: UserCreatedEvent):
            ...
    """
    def decorator(func: Callable):
        EventBus.get_instance().subscribe(event_type, func, is_async=is_async)

        @wraps(func)
        async def wrapper(*args, **kwargs):
            return await func(*args, **kwargs) if is_async else func(*args, **kwargs)

        return wrapper
    return decorator


# Common Domain Events

@dataclass
class EntityCreatedEvent(DomainEvent):
    """Event raised when an entity is created."""
    entity_type: str = ""
    entity_data: Dict[str, Any] = field(default_factory=dict)


@dataclass
class EntityUpdatedEvent(DomainEvent):
    """Event raised when an entity is updated."""
    entity_type: str = ""
    changes: Dict[str, Any] = field(default_factory=dict)


@dataclass
class EntityDeletedEvent(DomainEvent):
    """Event raised when an entity is deleted."""
    entity_type: str = ""


# Integration Events (for cross-service communication)

@dataclass
class IntegrationEvent(DomainEvent):
    """Base class for integration events that cross service boundaries."""
    source_service: str = ""
    target_service: Optional[str] = None
