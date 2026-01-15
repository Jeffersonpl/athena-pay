"""
Use Case Pattern - Application service layer.
"""

from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Optional
from dataclasses import dataclass

Input = TypeVar("Input")
Output = TypeVar("Output")


class UseCase(ABC, Generic[Input, Output]):
    """
    Base class for Use Cases.
    Use Cases orchestrate the flow of data and coordinate domain objects.
    """

    @abstractmethod
    async def execute(self, input_data: Input) -> Output:
        """Execute the use case."""
        pass


class UseCaseHandler(ABC, Generic[Input, Output]):
    """
    Alternative handler pattern for use cases.
    Allows for dependency injection and decorator patterns.
    """

    @abstractmethod
    async def handle(self, request: Input) -> Output:
        """Handle the use case request."""
        pass


@dataclass
class UseCaseResult(Generic[Output]):
    """Result wrapper for use case execution."""
    success: bool
    data: Optional[Output] = None
    error: Optional[str] = None
    error_code: Optional[str] = None

    @classmethod
    def ok(cls, data: Output) -> "UseCaseResult[Output]":
        return cls(success=True, data=data)

    @classmethod
    def fail(cls, error: str, error_code: str = None) -> "UseCaseResult[Output]":
        return cls(success=False, error=error, error_code=error_code)
