"""
PIX Domain Events
"""

from dataclasses import dataclass, field
from typing import Optional
from datetime import datetime

import sys
sys.path.insert(0, '/Users/jeffersonleite/Projetos/Synoryx/athena-visual-patched-tested-v4-merged-PATCHED17 (1) 2/services/shared')

from athena_shared.domain.events import DomainEvent


@dataclass
class PixKeyRegisteredEvent(DomainEvent):
    """Event raised when a PIX key is registered."""
    key_type: str = ""
    key_value: str = ""
    account_id: str = ""
    aggregate_type: str = field(default="PixKey", init=False)


@dataclass
class PixKeyDeletedEvent(DomainEvent):
    """Event raised when a PIX key is deleted."""
    key_value: str = ""
    account_id: str = ""
    aggregate_type: str = field(default="PixKey", init=False)


@dataclass
class PixKeyPortabilityRequestedEvent(DomainEvent):
    """Event raised when portability is requested for a PIX key."""
    key_value: str = ""
    source_account_id: str = ""
    target_account_id: str = ""
    aggregate_type: str = field(default="PixKey", init=False)


@dataclass
class PixTransactionCreatedEvent(DomainEvent):
    """Event raised when a PIX transaction is created."""
    e2e_id: str = ""
    amount: float = 0
    source_account_id: str = ""
    target_key: str = ""
    transaction_type: str = ""
    aggregate_type: str = field(default="PixTransaction", init=False)


@dataclass
class PixTransactionCompletedEvent(DomainEvent):
    """Event raised when a PIX transaction is completed."""
    e2e_id: str = ""
    amount: float = 0
    source_account_id: str = ""
    target_key: str = ""
    aggregate_type: str = field(default="PixTransaction", init=False)


@dataclass
class PixTransactionFailedEvent(DomainEvent):
    """Event raised when a PIX transaction fails."""
    e2e_id: str = ""
    reason: str = ""
    source_account_id: str = ""
    aggregate_type: str = field(default="PixTransaction", init=False)


@dataclass
class PixDevolutionRequestedEvent(DomainEvent):
    """Event raised when a PIX devolution is requested."""
    original_e2e_id: str = ""
    devolution_e2e_id: str = ""
    amount: float = 0
    reason: str = ""
    aggregate_type: str = field(default="PixTransaction", init=False)


@dataclass
class PixReceivedEvent(DomainEvent):
    """Event raised when a PIX is received."""
    e2e_id: str = ""
    amount: float = 0
    source_ispb: str = ""
    source_name: str = ""
    source_document: str = ""
    target_account_id: str = ""
    target_key: str = ""
    aggregate_type: str = field(default="PixTransaction", init=False)


@dataclass
class QRCodeCreatedEvent(DomainEvent):
    """Event raised when a QR code is created."""
    qr_type: str = ""
    account_id: str = ""
    amount: Optional[float] = None
    aggregate_type: str = field(default="PixQRCode", init=False)


@dataclass
class QRCodePaidEvent(DomainEvent):
    """Event raised when a QR code is paid."""
    qrcode_id: str = ""
    e2e_id: str = ""
    amount: float = 0
    aggregate_type: str = field(default="PixQRCode", init=False)
