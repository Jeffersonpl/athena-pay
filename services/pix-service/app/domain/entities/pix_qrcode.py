"""
PIX QR Code Entity
"""

from enum import Enum
from datetime import datetime, timedelta
from typing import Optional

import sys
sys.path.insert(0, '/Users/jeffersonleite/Projetos/Synoryx/athena-visual-patched-tested-v4-merged-PATCHED17 (1) 2/services/shared')

from athena_shared.domain.entities import AggregateRoot, Money
from athena_shared.domain.exceptions import ValidationException, BusinessRuleException


class QRCodeType(str, Enum):
    """Types of PIX QR codes."""
    STATIC = "STATIC"
    DYNAMIC = "DYNAMIC"
    DYNAMIC_DUE_DATE = "DYNAMIC_DUE_DATE"


class QRCodeStatus(str, Enum):
    """QR code statuses."""
    ACTIVE = "ACTIVE"
    PAID = "PAID"
    EXPIRED = "EXPIRED"
    CANCELLED = "CANCELLED"


class PixQRCode(AggregateRoot):
    """
    PIX QR Code Aggregate Root.
    Represents a PIX QR code (static or dynamic).
    """

    def __init__(
        self,
        id: Optional[str] = None,
        qr_type: QRCodeType = QRCodeType.STATIC,
        status: QRCodeStatus = QRCodeStatus.ACTIVE,
        # Owner
        account_id: str = None,
        key_value: str = None,
        merchant_name: str = None,
        merchant_city: str = None,
        # Amount
        amount: float = None,  # None for open amount
        currency: str = "BRL",
        # Content
        payload: str = None,
        location: str = None,  # For dynamic QR codes
        # Metadata
        description: str = None,
        reference_id: str = None,  # External reference
        # Validity
        expiration: datetime = None,
        # Payment tracking
        paid_at: datetime = None,
        paid_amount: float = None,
        paid_e2e_id: str = None,
    ):
        super().__init__(id)
        self._qr_type = qr_type
        self._status = status
        self._account_id = account_id
        self._key_value = key_value
        self._merchant_name = merchant_name
        self._merchant_city = merchant_city
        self._amount = Money(amount, currency) if amount else None
        self._payload = payload
        self._location = location
        self._description = description
        self._reference_id = reference_id
        self._expiration = expiration
        self._paid_at = paid_at
        self._paid_amount = paid_amount
        self._paid_e2e_id = paid_e2e_id

        self._validate()

    def _validate(self):
        """Validate the QR code."""
        if not self._account_id:
            raise ValidationException("Account ID is required", "account_id")

        if not self._key_value:
            raise ValidationException("PIX key is required", "key_value")

        if self._qr_type == QRCodeType.DYNAMIC and not self._amount:
            raise ValidationException("Dynamic QR codes require an amount", "amount")

    # Properties
    @property
    def qr_type(self) -> QRCodeType:
        return self._qr_type

    @property
    def status(self) -> QRCodeStatus:
        return self._status

    @property
    def account_id(self) -> str:
        return self._account_id

    @property
    def key_value(self) -> str:
        return self._key_value

    @property
    def amount(self) -> Optional[Money]:
        return self._amount

    @property
    def payload(self) -> str:
        return self._payload

    @property
    def location(self) -> str:
        return self._location

    @property
    def is_expired(self) -> bool:
        if not self._expiration:
            return False
        return datetime.utcnow() > self._expiration

    @property
    def is_valid(self) -> bool:
        return self._status == QRCodeStatus.ACTIVE and not self.is_expired

    # Domain methods
    def set_payload(self, payload: str, location: str = None):
        """Set the BR Code payload."""
        self._payload = payload
        if location:
            self._location = location
        self._touch()

    def mark_as_paid(self, amount: float, e2e_id: str):
        """Mark the QR code as paid."""
        if not self.is_valid:
            raise BusinessRuleException(
                rule="QRCODE_PAYMENT",
                message="QR code is not valid for payment"
            )

        self._status = QRCodeStatus.PAID
        self._paid_at = datetime.utcnow()
        self._paid_amount = amount
        self._paid_e2e_id = e2e_id
        self._touch()

    def cancel(self):
        """Cancel the QR code."""
        if self._status == QRCodeStatus.PAID:
            raise BusinessRuleException(
                rule="QRCODE_CANCELLATION",
                message="Cannot cancel a paid QR code"
            )

        self._status = QRCodeStatus.CANCELLED
        self._touch()

    def expire(self):
        """Mark the QR code as expired."""
        if self._status != QRCodeStatus.ACTIVE:
            return

        self._status = QRCodeStatus.EXPIRED
        self._touch()

    @classmethod
    def create_static(
        cls,
        account_id: str,
        key_value: str,
        merchant_name: str,
        merchant_city: str = "SAO PAULO",
        amount: float = None,
        description: str = None
    ) -> "PixQRCode":
        """Factory method for static QR codes."""
        return cls(
            qr_type=QRCodeType.STATIC,
            account_id=account_id,
            key_value=key_value,
            merchant_name=merchant_name,
            merchant_city=merchant_city,
            amount=amount,
            description=description
        )

    @classmethod
    def create_dynamic(
        cls,
        account_id: str,
        key_value: str,
        merchant_name: str,
        amount: float,
        expiration_seconds: int = 3600,
        description: str = None,
        reference_id: str = None
    ) -> "PixQRCode":
        """Factory method for dynamic QR codes."""
        expiration = datetime.utcnow() + timedelta(seconds=expiration_seconds)

        return cls(
            qr_type=QRCodeType.DYNAMIC,
            account_id=account_id,
            key_value=key_value,
            merchant_name=merchant_name,
            merchant_city="SAO PAULO",
            amount=amount,
            expiration=expiration,
            description=description,
            reference_id=reference_id
        )

    def to_dict(self) -> dict:
        """Convert to dictionary representation."""
        return {
            "id": self.id,
            "qr_type": self._qr_type.value,
            "status": self._status.value,
            "account_id": self._account_id,
            "key_value": self._key_value,
            "merchant_name": self._merchant_name,
            "amount": self._amount.amount if self._amount else None,
            "payload": self._payload,
            "location": self._location,
            "description": self._description,
            "expiration": self._expiration.isoformat() if self._expiration else None,
            "created_at": self._created_at.isoformat()
        }
