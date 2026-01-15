"""
Query Pattern - CQRS query handling.
"""

from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Dict, Type, Optional, Any, List
from dataclasses import dataclass, field
from datetime import datetime
import uuid

Result = TypeVar("Result")


@dataclass
class Query(ABC):
    """
    Base class for Queries.
    Queries represent requests for data without side effects.
    """
    query_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = field(default_factory=datetime.utcnow)
    correlation_id: Optional[str] = None
    user_id: Optional[str] = None

    @property
    def query_name(self) -> str:
        return self.__class__.__name__


@dataclass
class PaginatedQuery(Query):
    """Base class for paginated queries."""
    page: int = 1
    page_size: int = 20
    sort_by: Optional[str] = None
    sort_order: str = "asc"  # asc or desc

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.page_size

    @property
    def limit(self) -> int:
        return self.page_size


class QueryHandler(ABC, Generic[Result]):
    """
    Base class for Query Handlers.
    Each query has exactly one handler.
    """

    @abstractmethod
    async def handle(self, query: Query) -> Result:
        """Handle the query and return result."""
        pass


class QueryBus:
    """
    Query Bus for routing queries to handlers.
    """

    def __init__(self):
        self._handlers: Dict[Type[Query], QueryHandler] = {}

    def register(
        self,
        query_type: Type[Query],
        handler: QueryHandler
    ):
        """Register a handler for a query type."""
        self._handlers[query_type] = handler

    async def dispatch(self, query: Query) -> Any:
        """
        Dispatch a query to its handler.

        Args:
            query: The query to dispatch

        Returns:
            The result from the handler

        Raises:
            ValueError: If no handler is registered for the query
        """
        query_type = type(query)
        handler = self._handlers.get(query_type)

        if handler is None:
            raise ValueError(f"No handler registered for {query_type.__name__}")

        return await handler.handle(query)


# Decorator for registering handlers
def query_handler(query_type: Type[Query]):
    """
    Decorator to register a query handler.

    Usage:
        @query_handler(GetUserQuery)
        class GetUserHandler(QueryHandler):
            async def handle(self, query: GetUserQuery) -> User:
                ...
    """
    def decorator(handler_class):
        handler_class._handles_query = query_type
        return handler_class
    return decorator
