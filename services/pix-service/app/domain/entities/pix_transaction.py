"""
PIX Transaction Entity - Aggregate Root
"""

from enum import Enum
from datetime import datetime
from typing import Optional
from decimal import Decimal

import sys
sys.path.insert(0, '/Users/jeffersonleite/Projetos/Synoryx/athena-visual-patched-tested-v4-merged-PATCHED17 (1) 2/services/shared')

from athena_shared.domain.entities import AggregateRoot, Money
from athena_shared.domain.exceptions import ValidationException, BusinessRuleException


class PixTransactionType(str, Enum):
    """Types of PIX transactions."""
    TRANSFER = "TRANSFER"
    QR_CODE_STATIC = "QR_CODE_STATIC"
    QR_CODE_DYNAMIC = "QR_CODE_DYNAMIC"
    DEVOLUTION = "DEVOLUTION"
    WITHDRAWAL = "WITHDRAWAL"
    CHANGE = "CHANGE"


class PixTransactionStatus(str, Enum):
    """PIX transaction statuses."""
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"
    RETURNED = "RETURNED"


class PixTransaction(AggregateRoot):
    """
    PIX Transaction Aggregate Root.
    Represents a PIX payment transaction.
    """

    def __init__(
        self,
        id: Optional[str] = None,
        e2e_id: str = None,
        transaction_type: PixTransactionType = PixTransactionType.TRANSFER,
        status: PixTransactionStatus = PixTransactionStatus.PENDING,
        # Source
        source_account_id: str = None,
        source_name: str = None,
        source_document: str = None,
        source_ispb: str = None,
        source_branch: str = None,
        source_account_number: str = None,
        # Target
        target_key: str = None,
        target_key_type: str = None,
        target_name: str = None,
        target_document: str = None,
        target_ispb: str = None,
        target_branch: str = None,
        target_account_number: str = None,
        # Amount
        amount: float = 0,
        currency: str = "BRL",
        # Description
        description: str = None,
        # Timestamps
        created_at: datetime = None,
        processed_at: datetime = None,
        # Reference
        original_e2e_id: str = None,  # For devolutions
    ):
        super().__init__(id)
        self._e2e_id = e2e_id
        self._transaction_type = transaction_type
        self._status = status

        # Source info
        self._source_account_id = source_account_id
        self._source_name = source_name
        self._source_document = source_document
        self._source_ispb = source_ispb
        self._source_branch = source_branch
        self._source_account_number = source_account_number

        # Target info
        self._target_key = target_key
        self._target_key_type = target_key_type
        self._target_name = target_name
        self._target_document = target_document
        self._target_ispb = target_ispb
        self._target_branch = target_branch
        self._target_account_number = target_account_number

        # Amount
        self._amount = Money(amount, currency)

        # Other
        self._description = description
        self._processed_at = processed_at
        self._original_e2e_id = original_e2e_id

        if created_at:
            self._created_at = created_at

        self._validate()

    def _validate(self):
        """Validate the transaction."""
        if not self._source_account_id:
            raise ValidationException("Source account is required", "source_account_id")

        if not self._target_key and not self._target_account_number:
            raise ValidationException("Target key or account is required", "target")

        if self._amount.amount <= 0:
            raise ValidationException("Amount must be positive", "amount")

        if self._amount.amount > 1000000:  # 1 million limit
            raise ValidationException("Amount exceeds maximum allowed", "amount")

    # Properties
    @property
    def e2e_id(self) -> str:
        return self._e2e_id

    @property
    def transaction_type(self) -> PixTransactionType:
        return self._transaction_type

    @property
    def status(self) -> PixTransactionStatus:
        return self._status

    @property
    def source_account_id(self) -> str:
        return self._source_account_id

    @property
    def target_key(self) -> str:
        return self._target_key

    @property
    def target_name(self) -> str:
        return self._target_name

    @property
    def amount(self) -> Money:
        return self._amount

    @property
    def description(self) -> str:
        return self._description

    @property
    def is_completed(self) -> bool:
        return self._status == PixTransactionStatus.COMPLETED

    @property
    def is_pending(self) -> bool:
        return self._status in [PixTransactionStatus.PENDING, PixTransactionStatus.PROCESSING]

    @property
    def can_be_returned(self) -> bool:
        return (
            self._status == PixTransactionStatus.COMPLETED and
            self._transaction_type != PixTransactionType.DEVOLUTION
        )

    # Domain methods
    def set_e2e_id(self, e2e_id: str):
        """Set the E2E ID after generation."""
        if self._e2e_id:
            raise BusinessRuleException(
                rule="E2E_ID_IMMUTABLE",
                message="E2E ID cannot be changed once set"
            )
        self._e2e_id = e2e_id

    def set_target_info(
        self,
        name: str,
        document: str,
        ispb: str = None,
        branch: str = None,
        account_number: str = None
    ):
        """Set target information after DICT lookup."""
        self._target_name = name
        self._target_document = document
        self._target_ispb = ispb
        self._target_branch = branch
        self._target_account_number = account_number
        self._touch()

    def start_processing(self):
        """Mark transaction as processing."""
        if self._status != PixTransactionStatus.PENDING:
            raise BusinessRuleException(
                rule="TRANSACTION_PROCESSING",
                message=f"Cannot process transaction in status {self._status}"
            )

        self._status = PixTransactionStatus.PROCESSING
        self._touch()

    def complete(self):
        """Mark transaction as completed."""
        if self._status not in [PixTransactionStatus.PENDING, PixTransactionStatus.PROCESSING]:
            raise BusinessRuleException(
                rule="TRANSACTION_COMPLETION",
                message=f"Cannot complete transaction in status {self._status}"
            )

        self._status = PixTransactionStatus.COMPLETED
        self._processed_at = datetime.utcnow()
        self._touch()

        from ..events.pix_events import PixTransactionCompletedEvent
        self.add_domain_event(PixTransactionCompletedEvent(
            aggregate_id=self.id,
            e2e_id=self._e2e_id,
            amount=self._amount.amount,
            source_account_id=self._source_account_id,
            target_key=self._target_key
        ))

    def fail(self, reason: str):
        """Mark transaction as failed."""
        if self._status == PixTransactionStatus.COMPLETED:
            raise BusinessRuleException(
                rule="TRANSACTION_FAILURE",
                message="Cannot fail a completed transaction"
            )

        self._status = PixTransactionStatus.FAILED
        self._touch()

        from ..events.pix_events import PixTransactionFailedEvent
        self.add_domain_event(PixTransactionFailedEvent(
            aggregate_id=self.id,
            e2e_id=self._e2e_id,
            reason=reason,
            source_account_id=self._source_account_id
        ))

    def cancel(self):
        """Cancel the transaction."""
        if self._status != PixTransactionStatus.PENDING:
            raise BusinessRuleException(
                rule="TRANSACTION_CANCELLATION",
                message="Only pending transactions can be cancelled"
            )

        self._status = PixTransactionStatus.CANCELLED
        self._touch()

    def to_dict(self) -> dict:
        """Convert to dictionary representation."""
        return {
            "id": self.id,
            "e2e_id": self._e2e_id,
            "transaction_type": self._transaction_type.value,
            "status": self._status.value,
            "source_account_id": self._source_account_id,
            "source_name": self._source_name,
            "target_key": self._target_key,
            "target_name": self._target_name,
            "target_document": self._target_document,
            "amount": self._amount.amount,
            "currency": self._amount.currency,
            "description": self._description,
            "created_at": self._created_at.isoformat(),
            "processed_at": self._processed_at.isoformat() if self._processed_at else None
        }
