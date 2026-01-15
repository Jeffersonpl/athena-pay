"""
Wire Service Database Models
TED/DOC transfers, scheduling, and bank management
"""
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, Boolean, Text, Integer, Float, Index, Numeric
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from app.db import Base, SCHEMA


class WireTransfer(Base):
    """
    Wire transfer (TED/DOC) entity
    """
    __tablename__ = "wire_transfers"
    __table_args__ = (
        Index('ix_wire_account', 'account_id'),
        Index('ix_wire_status', 'status'),
        Index('ix_wire_scheduled', 'scheduled_date'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    account_id: Mapped[str] = mapped_column(String(128), index=True)
    customer_id: Mapped[str] = mapped_column(String(128), index=True)

    # Transfer type
    transfer_type: Mapped[str] = mapped_column(String(3))  # TED, DOC

    # Amount
    amount: Mapped[float] = mapped_column(Numeric(18, 2))
    fee: Mapped[float] = mapped_column(Numeric(18, 2), default=0)
    total_amount: Mapped[float] = mapped_column(Numeric(18, 2))

    # Source account (debited)
    source_bank: Mapped[str] = mapped_column(String(3))
    source_branch: Mapped[str] = mapped_column(String(8))
    source_account: Mapped[str] = mapped_column(String(20))
    source_document: Mapped[str] = mapped_column(String(18))
    source_name: Mapped[str] = mapped_column(String(256))

    # Destination account (credited)
    dest_bank: Mapped[str] = mapped_column(String(3))
    dest_branch: Mapped[str] = mapped_column(String(8))
    dest_account: Mapped[str] = mapped_column(String(20))
    dest_account_type: Mapped[str] = mapped_column(String(2))  # CC (corrente), CP (poupanca)
    dest_document: Mapped[str] = mapped_column(String(18))
    dest_name: Mapped[str] = mapped_column(String(256))

    # Transfer purpose
    purpose: Mapped[str] = mapped_column(String(5), nullable=True)  # BACEN purpose code
    description: Mapped[str] = mapped_column(Text, nullable=True)

    # Protocol
    protocol: Mapped[str] = mapped_column(String(32), unique=True)  # Unique transfer protocol
    str_reference: Mapped[str] = mapped_column(String(64), nullable=True)  # STR reference (future)

    # Status
    status: Mapped[str] = mapped_column(String(20), default="PENDING")
    # Status: PENDING, SCHEDULED, PROCESSING, SENT, SETTLED, RETURNED, CANCELLED, FAILED

    # Scheduling
    scheduled_date: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    is_scheduled: Mapped[bool] = mapped_column(Boolean, default=False)

    # Processing info
    sent_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    settled_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    return_reason: Mapped[str] = mapped_column(Text, nullable=True)

    # STR response (future integration)
    str_response: Mapped[dict] = mapped_column(JSONB, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class FavoredRecipient(Base):
    """
    Saved recipients for wire transfers (favorecidos)
    """
    __tablename__ = "favored_recipients"
    __table_args__ = (
        Index('ix_favored_account', 'account_id'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    account_id: Mapped[str] = mapped_column(String(128), index=True)

    # Recipient info
    name: Mapped[str] = mapped_column(String(256))
    document: Mapped[str] = mapped_column(String(18))  # CPF or CNPJ
    document_type: Mapped[str] = mapped_column(String(4))  # CPF, CNPJ

    # Bank info
    bank_code: Mapped[str] = mapped_column(String(3))
    bank_name: Mapped[str] = mapped_column(String(128))
    branch: Mapped[str] = mapped_column(String(8))
    account: Mapped[str] = mapped_column(String(20))
    account_type: Mapped[str] = mapped_column(String(2))  # CC, CP

    # Usage
    nickname: Mapped[str] = mapped_column(String(64), nullable=True)
    transfer_count: Mapped[int] = mapped_column(Integer, default=0)
    last_transfer_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class WireSchedule(Base):
    """
    Scheduled/recurring wire transfers
    """
    __tablename__ = "wire_schedules"
    __table_args__ = {"schema": SCHEMA}

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    account_id: Mapped[str] = mapped_column(String(128), index=True)
    favored_id: Mapped[str] = mapped_column(String(36), nullable=True)

    # Transfer details
    transfer_type: Mapped[str] = mapped_column(String(3))  # TED, DOC
    amount: Mapped[float] = mapped_column(Numeric(18, 2))

    # Destination
    dest_bank: Mapped[str] = mapped_column(String(3))
    dest_branch: Mapped[str] = mapped_column(String(8))
    dest_account: Mapped[str] = mapped_column(String(20))
    dest_account_type: Mapped[str] = mapped_column(String(2))
    dest_document: Mapped[str] = mapped_column(String(18))
    dest_name: Mapped[str] = mapped_column(String(256))

    # Schedule type
    schedule_type: Mapped[str] = mapped_column(String(16))  # ONCE, WEEKLY, MONTHLY
    scheduled_date: Mapped[datetime] = mapped_column(DateTime)
    day_of_month: Mapped[int] = mapped_column(Integer, nullable=True)  # For monthly
    day_of_week: Mapped[int] = mapped_column(Integer, nullable=True)  # For weekly (0=Monday)

    # Recurrence control
    end_date: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    max_occurrences: Mapped[int] = mapped_column(Integer, nullable=True)
    executed_count: Mapped[int] = mapped_column(Integer, default=0)

    # Status
    status: Mapped[str] = mapped_column(String(16), default="ACTIVE")
    # Status: ACTIVE, PAUSED, COMPLETED, CANCELLED

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class WireHistory(Base):
    """
    Wire transfer status history
    """
    __tablename__ = "wire_history"
    __table_args__ = (
        Index('ix_wire_history_transfer', 'transfer_id'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    transfer_id: Mapped[str] = mapped_column(String(36), index=True)

    previous_status: Mapped[str] = mapped_column(String(20), nullable=True)
    new_status: Mapped[str] = mapped_column(String(20))
    reason: Mapped[str] = mapped_column(Text, nullable=True)

    # Source of change
    source: Mapped[str] = mapped_column(String(32))  # API, STR, SCHEDULER, MANUAL

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Bank(Base):
    """
    Brazilian banks directory (COMPE participants)
    """
    __tablename__ = "banks"
    __table_args__ = {"schema": SCHEMA}

    code: Mapped[str] = mapped_column(String(3), primary_key=True)
    ispb: Mapped[str] = mapped_column(String(8), unique=True)  # ISPB code

    name: Mapped[str] = mapped_column(String(256))
    short_name: Mapped[str] = mapped_column(String(64))

    # Capabilities
    supports_ted: Mapped[bool] = mapped_column(Boolean, default=True)
    supports_doc: Mapped[bool] = mapped_column(Boolean, default=True)
    supports_pix: Mapped[bool] = mapped_column(Boolean, default=True)

    # Operating hours
    ted_cutoff_time: Mapped[str] = mapped_column(String(5), default="17:00")  # HH:MM

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class WireFee(Base):
    """
    Wire transfer fees configuration
    """
    __tablename__ = "wire_fees"
    __table_args__ = {"schema": SCHEMA}

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    account_id: Mapped[str] = mapped_column(String(128), nullable=True)  # Null = default

    transfer_type: Mapped[str] = mapped_column(String(3))  # TED, DOC

    # Fee structure
    fixed_fee: Mapped[float] = mapped_column(Numeric(18, 2), default=0)
    percentage_fee: Mapped[float] = mapped_column(Float, default=0)
    min_fee: Mapped[float] = mapped_column(Numeric(18, 2), default=0)
    max_fee: Mapped[float] = mapped_column(Numeric(18, 2), nullable=True)

    # Validity
    valid_from: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    valid_until: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class WireLimit(Base):
    """
    Wire transfer limits per account
    """
    __tablename__ = "wire_limits"
    __table_args__ = {"schema": SCHEMA}

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    account_id: Mapped[str] = mapped_column(String(128), unique=True, index=True)

    # TED limits
    ted_per_transaction: Mapped[float] = mapped_column(Numeric(18, 2), default=100000)
    ted_daily: Mapped[float] = mapped_column(Numeric(18, 2), default=500000)
    ted_monthly: Mapped[float] = mapped_column(Numeric(18, 2), default=5000000)

    # DOC limits
    doc_per_transaction: Mapped[float] = mapped_column(Numeric(18, 2), default=4999.99)
    doc_daily: Mapped[float] = mapped_column(Numeric(18, 2), default=20000)
    doc_monthly: Mapped[float] = mapped_column(Numeric(18, 2), default=200000)

    # Night limits (reduced)
    night_ted_per_transaction: Mapped[float] = mapped_column(Numeric(18, 2), default=10000)
    night_doc_per_transaction: Mapped[float] = mapped_column(Numeric(18, 2), default=1000)

    # Usage tracking
    ted_used_today: Mapped[float] = mapped_column(Numeric(18, 2), default=0)
    ted_used_month: Mapped[float] = mapped_column(Numeric(18, 2), default=0)
    doc_used_today: Mapped[float] = mapped_column(Numeric(18, 2), default=0)
    doc_used_month: Mapped[float] = mapped_column(Numeric(18, 2), default=0)

    last_reset_daily: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    last_reset_monthly: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
