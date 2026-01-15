"""
DDD Entity and Value Object base classes.
"""

import uuid
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any, List, Optional, TypeVar, Generic
from dataclasses import dataclass, field
from pydantic import BaseModel


class ValueObject(BaseModel):
    """
    Base class for Value Objects.
    Value Objects are immutable and identified by their attributes.
    """

    class Config:
        frozen = True  # Makes it immutable

    def __eq__(self, other: Any) -> bool:
        if not isinstance(other, self.__class__):
            return False
        return self.model_dump() == other.model_dump()

    def __hash__(self) -> int:
        return hash(tuple(sorted(self.model_dump().items())))


class Entity(ABC):
    """
    Base class for Entities.
    Entities have unique identity and lifecycle.
    """

    def __init__(self, id: Optional[str] = None):
        self._id = id or str(uuid.uuid4())
        self._created_at = datetime.utcnow()
        self._updated_at = datetime.utcnow()
        self._version = 1

    @property
    def id(self) -> str:
        return self._id

    @property
    def created_at(self) -> datetime:
        return self._created_at

    @property
    def updated_at(self) -> datetime:
        return self._updated_at

    @property
    def version(self) -> int:
        return self._version

    def _touch(self):
        """Update the entity's timestamp and version."""
        self._updated_at = datetime.utcnow()
        self._version += 1

    def __eq__(self, other: Any) -> bool:
        if not isinstance(other, self.__class__):
            return False
        return self._id == other._id

    def __hash__(self) -> int:
        return hash(self._id)


class AggregateRoot(Entity):
    """
    Base class for Aggregate Roots.
    Aggregate Roots are entities that serve as entry points to aggregates.
    They maintain consistency boundaries and emit domain events.
    """

    def __init__(self, id: Optional[str] = None):
        super().__init__(id)
        self._domain_events: List["DomainEvent"] = []

    @property
    def domain_events(self) -> List["DomainEvent"]:
        return self._domain_events.copy()

    def add_domain_event(self, event: "DomainEvent"):
        """Add a domain event to be published."""
        self._domain_events.append(event)

    def clear_domain_events(self) -> List["DomainEvent"]:
        """Clear and return all domain events."""
        events = self._domain_events.copy()
        self._domain_events.clear()
        return events


# Common Value Objects

@dataclass(frozen=True)
class Money:
    """Value Object representing monetary amounts."""
    amount: float
    currency: str = "BRL"

    def __post_init__(self):
        if self.amount < 0:
            raise ValueError("Amount cannot be negative")

    def __add__(self, other: "Money") -> "Money":
        if self.currency != other.currency:
            raise ValueError("Cannot add different currencies")
        return Money(self.amount + other.amount, self.currency)

    def __sub__(self, other: "Money") -> "Money":
        if self.currency != other.currency:
            raise ValueError("Cannot subtract different currencies")
        return Money(self.amount - other.amount, self.currency)

    def __mul__(self, factor: float) -> "Money":
        return Money(self.amount * factor, self.currency)

    def __lt__(self, other: "Money") -> bool:
        if self.currency != other.currency:
            raise ValueError("Cannot compare different currencies")
        return self.amount < other.amount

    def __le__(self, other: "Money") -> bool:
        return self < other or self.amount == other.amount

    def is_zero(self) -> bool:
        return self.amount == 0

    def is_positive(self) -> bool:
        return self.amount > 0


class Document(ValueObject):
    """Value Object for CPF/CNPJ documents."""
    number: str
    type: str  # CPF or CNPJ

    @classmethod
    def cpf(cls, number: str) -> "Document":
        clean = "".join(c for c in number if c.isdigit())
        if len(clean) != 11:
            raise ValueError("CPF must have 11 digits")
        return cls(number=clean, type="CPF")

    @classmethod
    def cnpj(cls, number: str) -> "Document":
        clean = "".join(c for c in number if c.isdigit())
        if len(clean) != 14:
            raise ValueError("CNPJ must have 14 digits")
        return cls(number=clean, type="CNPJ")

    @property
    def formatted(self) -> str:
        if self.type == "CPF":
            return f"{self.number[:3]}.{self.number[3:6]}.{self.number[6:9]}-{self.number[9:]}"
        else:
            return f"{self.number[:2]}.{self.number[2:5]}.{self.number[5:8]}/{self.number[8:12]}-{self.number[12:]}"

    @property
    def masked(self) -> str:
        if self.type == "CPF":
            return f"{self.number[:3]}.***.***-{self.number[-2:]}"
        else:
            return f"{self.number[:2]}.***.***/****-{self.number[-2:]}"


class Email(ValueObject):
    """Value Object for email addresses."""
    address: str

    def __init__(self, **data):
        super().__init__(**data)
        if "@" not in self.address or "." not in self.address:
            raise ValueError("Invalid email address")

    @property
    def domain(self) -> str:
        return self.address.split("@")[1]

    @property
    def masked(self) -> str:
        local, domain = self.address.split("@")
        return f"{local[0]}***@{domain}"


class Phone(ValueObject):
    """Value Object for phone numbers."""
    country_code: str = "55"
    area_code: str
    number: str

    @property
    def full_number(self) -> str:
        return f"+{self.country_code}{self.area_code}{self.number}"

    @property
    def formatted(self) -> str:
        return f"({self.area_code}) {self.number[:5]}-{self.number[5:]}"

    @property
    def masked(self) -> str:
        return f"({self.area_code}) *****-{self.number[-4:]}"


class Address(ValueObject):
    """Value Object for addresses."""
    street: str
    number: str
    complement: Optional[str] = None
    neighborhood: str
    city: str
    state: str
    postal_code: str
    country: str = "BR"

    @property
    def formatted(self) -> str:
        parts = [f"{self.street}, {self.number}"]
        if self.complement:
            parts.append(self.complement)
        parts.append(f"{self.neighborhood} - {self.city}/{self.state}")
        parts.append(f"CEP: {self.postal_code}")
        return ", ".join(parts)


class BankAccount(ValueObject):
    """Value Object for bank account information."""
    bank_code: str
    branch: str
    account_number: str
    account_type: str  # CHECKING, SAVINGS, PAYMENT
    holder_document: str
    holder_name: str

    @property
    def formatted(self) -> str:
        return f"Banco {self.bank_code} | Ag {self.branch} | CC {self.account_number}"
