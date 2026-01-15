"""
PIX Key Entity - Aggregate Root
"""

from enum import Enum
from datetime import datetime
from typing import Optional
from dataclasses import dataclass, field

import sys
sys.path.insert(0, '/Users/jeffersonleite/Projetos/Synoryx/athena-visual-patched-tested-v4-merged-PATCHED17 (1) 2/services/shared')

from athena_shared.domain.entities import AggregateRoot
from athena_shared.domain.exceptions import ValidationException, BusinessRuleException


class PixKeyType(str, Enum):
    """Types of PIX keys."""
    CPF = "CPF"
    CNPJ = "CNPJ"
    EMAIL = "EMAIL"
    PHONE = "PHONE"
    RANDOM = "RANDOM"


class PixKeyStatus(str, Enum):
    """PIX key statuses."""
    PENDING = "PENDING"
    ACTIVE = "ACTIVE"
    PORTABILITY_REQUESTED = "PORTABILITY_REQUESTED"
    PORTABILITY_CLAIMED = "PORTABILITY_CLAIMED"
    BLOCKED = "BLOCKED"
    DELETED = "DELETED"


class PixKey(AggregateRoot):
    """
    PIX Key Aggregate Root.
    Represents a PIX key registered in the DICT.
    """

    def __init__(
        self,
        id: Optional[str] = None,
        account_id: str = None,
        key_type: PixKeyType = None,
        key_value: str = None,
        status: PixKeyStatus = PixKeyStatus.PENDING,
        holder_name: str = None,
        holder_document: str = None,
        holder_document_type: str = None,
        created_at: datetime = None,
        activated_at: datetime = None
    ):
        super().__init__(id)
        self._account_id = account_id
        self._key_type = key_type
        self._key_value = key_value
        self._status = status
        self._holder_name = holder_name
        self._holder_document = holder_document
        self._holder_document_type = holder_document_type
        self._activated_at = activated_at

        if created_at:
            self._created_at = created_at

        self._validate()

    def _validate(self):
        """Validate the PIX key."""
        if not self._account_id:
            raise ValidationException("Account ID is required", "account_id")

        if not self._key_type:
            raise ValidationException("Key type is required", "key_type")

        if not self._key_value:
            raise ValidationException("Key value is required", "key_value")

        # Validate key value format based on type
        self._validate_key_format()

    def _validate_key_format(self):
        """Validate key value format based on key type."""
        if self._key_type == PixKeyType.CPF:
            clean = "".join(c for c in self._key_value if c.isdigit())
            if len(clean) != 11:
                raise ValidationException("CPF must have 11 digits", "key_value")
            self._key_value = clean

        elif self._key_type == PixKeyType.CNPJ:
            clean = "".join(c for c in self._key_value if c.isdigit())
            if len(clean) != 14:
                raise ValidationException("CNPJ must have 14 digits", "key_value")
            self._key_value = clean

        elif self._key_type == PixKeyType.EMAIL:
            if "@" not in self._key_value or "." not in self._key_value:
                raise ValidationException("Invalid email format", "key_value")
            self._key_value = self._key_value.lower()

        elif self._key_type == PixKeyType.PHONE:
            clean = "".join(c for c in self._key_value if c.isdigit())
            if not clean.startswith("55"):
                clean = "55" + clean
            if len(clean) < 13 or len(clean) > 14:
                raise ValidationException("Invalid phone format", "key_value")
            self._key_value = f"+{clean}"

    # Properties
    @property
    def account_id(self) -> str:
        return self._account_id

    @property
    def key_type(self) -> PixKeyType:
        return self._key_type

    @property
    def key_value(self) -> str:
        return self._key_value

    @property
    def status(self) -> PixKeyStatus:
        return self._status

    @property
    def holder_name(self) -> str:
        return self._holder_name

    @property
    def holder_document(self) -> str:
        return self._holder_document

    @property
    def is_active(self) -> bool:
        return self._status == PixKeyStatus.ACTIVE

    @property
    def can_receive_pix(self) -> bool:
        return self._status in [PixKeyStatus.ACTIVE, PixKeyStatus.PORTABILITY_REQUESTED]

    # Domain methods
    def activate(self):
        """Activate the PIX key after DICT registration."""
        if self._status != PixKeyStatus.PENDING:
            raise BusinessRuleException(
                rule="KEY_ACTIVATION",
                message=f"Cannot activate key in status {self._status}"
            )

        self._status = PixKeyStatus.ACTIVE
        self._activated_at = datetime.utcnow()
        self._touch()

        from ..events.pix_events import PixKeyRegisteredEvent
        self.add_domain_event(PixKeyRegisteredEvent(
            aggregate_id=self.id,
            key_type=self._key_type.value,
            key_value=self._key_value,
            account_id=self._account_id
        ))

    def block(self, reason: str):
        """Block the PIX key."""
        if self._status == PixKeyStatus.DELETED:
            raise BusinessRuleException(
                rule="KEY_BLOCKING",
                message="Cannot block a deleted key"
            )

        self._status = PixKeyStatus.BLOCKED
        self._touch()

    def unblock(self):
        """Unblock the PIX key."""
        if self._status != PixKeyStatus.BLOCKED:
            raise BusinessRuleException(
                rule="KEY_UNBLOCKING",
                message="Key is not blocked"
            )

        self._status = PixKeyStatus.ACTIVE
        self._touch()

    def delete(self):
        """Delete the PIX key."""
        if self._status == PixKeyStatus.DELETED:
            raise BusinessRuleException(
                rule="KEY_DELETION",
                message="Key is already deleted"
            )

        self._status = PixKeyStatus.DELETED
        self._touch()

        from ..events.pix_events import PixKeyDeletedEvent
        self.add_domain_event(PixKeyDeletedEvent(
            aggregate_id=self.id,
            key_value=self._key_value,
            account_id=self._account_id
        ))

    def request_portability(self, target_account_id: str):
        """Request portability of the key to another account."""
        if self._status != PixKeyStatus.ACTIVE:
            raise BusinessRuleException(
                rule="PORTABILITY_REQUEST",
                message="Only active keys can be ported"
            )

        self._status = PixKeyStatus.PORTABILITY_REQUESTED
        self._touch()

    def to_dict(self) -> dict:
        """Convert to dictionary representation."""
        return {
            "id": self.id,
            "account_id": self._account_id,
            "key_type": self._key_type.value,
            "key_value": self._key_value,
            "status": self._status.value,
            "holder_name": self._holder_name,
            "holder_document": self._holder_document,
            "created_at": self._created_at.isoformat(),
            "updated_at": self._updated_at.isoformat()
        }
