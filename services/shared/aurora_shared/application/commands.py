"""
Command Pattern - CQRS command handling.
"""

from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Dict, Type, Optional, Any
from dataclasses import dataclass, field
from datetime import datetime
import uuid

Result = TypeVar("Result")


@dataclass
class Command(ABC):
    """
    Base class for Commands.
    Commands represent intentions to change system state.
    """
    command_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = field(default_factory=datetime.utcnow)
    correlation_id: Optional[str] = None
    user_id: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

    @property
    def command_name(self) -> str:
        return self.__class__.__name__


class CommandHandler(ABC, Generic[Result]):
    """
    Base class for Command Handlers.
    Each command has exactly one handler.
    """

    @abstractmethod
    async def handle(self, command: Command) -> Result:
        """Handle the command and return result."""
        pass


class CommandBus:
    """
    Command Bus for routing commands to handlers.
    Implements the mediator pattern.
    """

    def __init__(self):
        self._handlers: Dict[Type[Command], CommandHandler] = {}

    def register(
        self,
        command_type: Type[Command],
        handler: CommandHandler
    ):
        """Register a handler for a command type."""
        self._handlers[command_type] = handler

    async def dispatch(self, command: Command) -> Any:
        """
        Dispatch a command to its handler.

        Args:
            command: The command to dispatch

        Returns:
            The result from the handler

        Raises:
            ValueError: If no handler is registered for the command
        """
        command_type = type(command)
        handler = self._handlers.get(command_type)

        if handler is None:
            raise ValueError(f"No handler registered for {command_type.__name__}")

        return await handler.handle(command)

    def has_handler(self, command_type: Type[Command]) -> bool:
        """Check if a handler is registered for a command type."""
        return command_type in self._handlers


# Decorator for registering handlers
def command_handler(command_type: Type[Command]):
    """
    Decorator to register a command handler.

    Usage:
        @command_handler(CreateUserCommand)
        class CreateUserHandler(CommandHandler):
            async def handle(self, command: CreateUserCommand) -> User:
                ...
    """
    def decorator(handler_class):
        # This needs to be called with an actual bus instance
        # Usually done during dependency injection setup
        handler_class._handles_command = command_type
        return handler_class
    return decorator
