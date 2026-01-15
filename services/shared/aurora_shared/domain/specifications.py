"""
Specification Pattern - Business rule encapsulation.
"""

from abc import ABC, abstractmethod
from typing import Generic, TypeVar, List, Any, Callable


T = TypeVar("T")


class Specification(ABC, Generic[T]):
    """
    Base class for Specifications.
    Specifications encapsulate business rules that can be combined.
    """

    @abstractmethod
    def is_satisfied_by(self, candidate: T) -> bool:
        """Check if the candidate satisfies this specification."""
        pass

    def and_(self, other: "Specification[T]") -> "AndSpecification[T]":
        """Combine with another specification using AND."""
        return AndSpecification(self, other)

    def or_(self, other: "Specification[T]") -> "OrSpecification[T]":
        """Combine with another specification using OR."""
        return OrSpecification(self, other)

    def not_(self) -> "NotSpecification[T]":
        """Negate this specification."""
        return NotSpecification(self)

    def __and__(self, other: "Specification[T]") -> "AndSpecification[T]":
        return self.and_(other)

    def __or__(self, other: "Specification[T]") -> "OrSpecification[T]":
        return self.or_(other)

    def __invert__(self) -> "NotSpecification[T]":
        return self.not_()


class AndSpecification(Specification[T]):
    """Combines two specifications with AND logic."""

    def __init__(self, left: Specification[T], right: Specification[T]):
        self._left = left
        self._right = right

    def is_satisfied_by(self, candidate: T) -> bool:
        return (
            self._left.is_satisfied_by(candidate) and
            self._right.is_satisfied_by(candidate)
        )


class OrSpecification(Specification[T]):
    """Combines two specifications with OR logic."""

    def __init__(self, left: Specification[T], right: Specification[T]):
        self._left = left
        self._right = right

    def is_satisfied_by(self, candidate: T) -> bool:
        return (
            self._left.is_satisfied_by(candidate) or
            self._right.is_satisfied_by(candidate)
        )


class NotSpecification(Specification[T]):
    """Negates a specification."""

    def __init__(self, spec: Specification[T]):
        self._spec = spec

    def is_satisfied_by(self, candidate: T) -> bool:
        return not self._spec.is_satisfied_by(candidate)


class LambdaSpecification(Specification[T]):
    """
    Specification that uses a lambda function.
    Useful for simple, one-off specifications.
    """

    def __init__(self, predicate: Callable[[T], bool]):
        self._predicate = predicate

    def is_satisfied_by(self, candidate: T) -> bool:
        return self._predicate(candidate)


class AlwaysTrueSpecification(Specification[T]):
    """Specification that always returns True."""

    def is_satisfied_by(self, candidate: T) -> bool:
        return True


class AlwaysFalseSpecification(Specification[T]):
    """Specification that always returns False."""

    def is_satisfied_by(self, candidate: T) -> bool:
        return False


# Common business specifications

class AmountRangeSpecification(Specification):
    """Specification for amount range validation."""

    def __init__(self, min_amount: float = 0, max_amount: float = float("inf")):
        self.min_amount = min_amount
        self.max_amount = max_amount

    def is_satisfied_by(self, candidate: Any) -> bool:
        amount = getattr(candidate, "amount", 0)
        if hasattr(amount, "amount"):  # Money object
            amount = amount.amount
        return self.min_amount <= amount <= self.max_amount


class StatusSpecification(Specification):
    """Specification for status validation."""

    def __init__(self, allowed_statuses: List[str]):
        self.allowed_statuses = allowed_statuses

    def is_satisfied_by(self, candidate: Any) -> bool:
        status = getattr(candidate, "status", None)
        return status in self.allowed_statuses


class ActiveSpecification(Specification):
    """Specification for active entities."""

    def is_satisfied_by(self, candidate: Any) -> bool:
        status = getattr(candidate, "status", None)
        return status in ("ACTIVE", "ENABLED", "APPROVED")


class KYCLevelSpecification(Specification):
    """Specification for minimum KYC level."""

    def __init__(self, min_level: int):
        self.min_level = min_level

    def is_satisfied_by(self, candidate: Any) -> bool:
        kyc_level = getattr(candidate, "kyc_level", 0)
        return kyc_level >= self.min_level


class DailyLimitSpecification(Specification):
    """Specification for daily transaction limit."""

    def __init__(self, daily_limit: float, daily_total: float):
        self.daily_limit = daily_limit
        self.daily_total = daily_total

    def is_satisfied_by(self, candidate: Any) -> bool:
        amount = getattr(candidate, "amount", 0)
        if hasattr(amount, "amount"):
            amount = amount.amount
        return (self.daily_total + amount) <= self.daily_limit
