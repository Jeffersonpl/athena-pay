"""
Repository Pattern - Data access abstraction.
"""

from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Optional, List, Dict, Any
from contextlib import asynccontextmanager

from .entities import Entity, AggregateRoot
from .specifications import Specification


T = TypeVar("T", bound=Entity)
ID = TypeVar("ID")


class Repository(ABC, Generic[T, ID]):
    """
    Abstract Repository interface.
    Repositories provide collection-like access to aggregates.
    """

    @abstractmethod
    async def get_by_id(self, id: ID) -> Optional[T]:
        """Get an entity by its ID."""
        pass

    @abstractmethod
    async def add(self, entity: T) -> T:
        """Add a new entity to the repository."""
        pass

    @abstractmethod
    async def update(self, entity: T) -> T:
        """Update an existing entity."""
        pass

    @abstractmethod
    async def delete(self, id: ID) -> bool:
        """Delete an entity by its ID."""
        pass

    @abstractmethod
    async def exists(self, id: ID) -> bool:
        """Check if an entity exists."""
        pass

    async def get_all(
        self,
        skip: int = 0,
        limit: int = 100
    ) -> List[T]:
        """Get all entities with pagination."""
        raise NotImplementedError

    async def find(
        self,
        specification: Specification[T],
        skip: int = 0,
        limit: int = 100
    ) -> List[T]:
        """Find entities matching a specification."""
        raise NotImplementedError

    async def count(
        self,
        specification: Optional[Specification[T]] = None
    ) -> int:
        """Count entities, optionally filtered by specification."""
        raise NotImplementedError


class UnitOfWork(ABC):
    """
    Unit of Work pattern for managing transactions.
    Ensures all operations in a business transaction are committed together.
    """

    @abstractmethod
    async def __aenter__(self) -> "UnitOfWork":
        """Enter the unit of work context."""
        pass

    @abstractmethod
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Exit the unit of work context."""
        pass

    @abstractmethod
    async def commit(self):
        """Commit all changes."""
        pass

    @abstractmethod
    async def rollback(self):
        """Rollback all changes."""
        pass

    @property
    @abstractmethod
    def is_active(self) -> bool:
        """Check if unit of work is active."""
        pass


class SQLAlchemyUnitOfWork(UnitOfWork):
    """
    SQLAlchemy implementation of Unit of Work.
    """

    def __init__(self, session_factory):
        self._session_factory = session_factory
        self._session = None

    async def __aenter__(self) -> "SQLAlchemyUnitOfWork":
        self._session = self._session_factory()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            await self.rollback()
        await self._session.close()
        self._session = None

    async def commit(self):
        if self._session:
            await self._session.commit()

    async def rollback(self):
        if self._session:
            await self._session.rollback()

    @property
    def is_active(self) -> bool:
        return self._session is not None

    @property
    def session(self):
        return self._session


class InMemoryRepository(Repository[T, str]):
    """
    In-memory repository implementation for testing.
    """

    def __init__(self):
        self._storage: Dict[str, T] = {}

    async def get_by_id(self, id: str) -> Optional[T]:
        return self._storage.get(id)

    async def add(self, entity: T) -> T:
        self._storage[entity.id] = entity
        return entity

    async def update(self, entity: T) -> T:
        if entity.id not in self._storage:
            raise ValueError(f"Entity {entity.id} not found")
        self._storage[entity.id] = entity
        return entity

    async def delete(self, id: str) -> bool:
        if id in self._storage:
            del self._storage[id]
            return True
        return False

    async def exists(self, id: str) -> bool:
        return id in self._storage

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[T]:
        items = list(self._storage.values())
        return items[skip:skip + limit]

    async def find(
        self,
        specification: Specification[T],
        skip: int = 0,
        limit: int = 100
    ) -> List[T]:
        result = [
            entity for entity in self._storage.values()
            if specification.is_satisfied_by(entity)
        ]
        return result[skip:skip + limit]

    async def count(self, specification: Optional[Specification[T]] = None) -> int:
        if specification is None:
            return len(self._storage)
        return len([
            entity for entity in self._storage.values()
            if specification.is_satisfied_by(entity)
        ])


class EventPublishingRepository(Repository[T, ID]):
    """
    Repository decorator that publishes domain events after successful operations.
    """

    def __init__(
        self,
        repository: Repository[T, ID],
        event_bus: "EventBus"
    ):
        self._repository = repository
        self._event_bus = event_bus

    async def get_by_id(self, id: ID) -> Optional[T]:
        return await self._repository.get_by_id(id)

    async def add(self, entity: T) -> T:
        result = await self._repository.add(entity)

        # Publish domain events if entity is an aggregate root
        if isinstance(entity, AggregateRoot):
            events = entity.clear_domain_events()
            for event in events:
                await self._event_bus.publish(event)

        return result

    async def update(self, entity: T) -> T:
        result = await self._repository.update(entity)

        if isinstance(entity, AggregateRoot):
            events = entity.clear_domain_events()
            for event in events:
                await self._event_bus.publish(event)

        return result

    async def delete(self, id: ID) -> bool:
        return await self._repository.delete(id)

    async def exists(self, id: ID) -> bool:
        return await self._repository.exists(id)
