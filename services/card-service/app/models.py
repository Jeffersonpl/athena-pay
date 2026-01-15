"""
Card Service Database Models
Complete card processing: Cards, Transactions, 3DS, Invoices, Disputes
"""
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, Boolean, Text, Integer, Float, Index, Numeric
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from app.db import Base, SCHEMA


class Card(Base):
    """
    Card entity (tokenized - no PAN stored)
    """
    __tablename__ = "cards"
    __table_args__ = (
        Index('ix_card_customer', 'customer_id'),
        Index('ix_card_account', 'account_id'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    customer_id: Mapped[str] = mapped_column(String(128), index=True)
    account_id: Mapped[str] = mapped_column(String(128), index=True)

    # Card info (tokenized)
    token: Mapped[str] = mapped_column(String(64), unique=True)  # PCI-compliant token
    last4: Mapped[str] = mapped_column(String(4))
    brand: Mapped[str] = mapped_column(String(16))  # VISA, MASTERCARD, ELO, AMEX
    product: Mapped[str] = mapped_column(String(32))  # STANDARD, GOLD, PLATINUM, BLACK, VIRTUAL
    card_type: Mapped[str] = mapped_column(String(16), default="CREDIT")  # CREDIT, DEBIT, PREPAID

    # Cardholder info
    cardholder_name: Mapped[str] = mapped_column(String(128))
    billing_address: Mapped[dict] = mapped_column(JSONB, nullable=True)

    # Expiration
    exp_month: Mapped[int] = mapped_column(Integer)
    exp_year: Mapped[int] = mapped_column(Integer)

    # CVV hash (for validation only, not stored in plain)
    cvv_hash: Mapped[str] = mapped_column(String(64), nullable=True)

    # Limits
    credit_limit: Mapped[float] = mapped_column(Numeric(18, 2), default=0)
    available_limit: Mapped[float] = mapped_column(Numeric(18, 2), default=0)

    # Virtual card link
    parent_card_id: Mapped[str] = mapped_column(String(36), nullable=True)  # For virtual cards
    is_virtual: Mapped[bool] = mapped_column(Boolean, default=False)

    # Controls
    status: Mapped[str] = mapped_column(String(16), default="ACTIVE")
    # Status: ACTIVE, BLOCKED, CANCELLED, EXPIRED

    # Feature flags
    contactless_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    international_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    online_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    withdrawal_enabled: Mapped[bool] = mapped_column(Boolean, default=True)

    # Transaction limits
    daily_limit: Mapped[float] = mapped_column(Numeric(18, 2), default=5000.00)
    monthly_limit: Mapped[float] = mapped_column(Numeric(18, 2), default=50000.00)
    per_transaction_limit: Mapped[float] = mapped_column(Numeric(18, 2), default=5000.00)

    # Usage tracking
    used_today: Mapped[float] = mapped_column(Numeric(18, 2), default=0)
    used_month: Mapped[float] = mapped_column(Numeric(18, 2), default=0)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    activated_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)


class CardTransaction(Base):
    """
    Card transaction with authorization lifecycle
    """
    __tablename__ = "card_transactions"
    __table_args__ = (
        Index('ix_cardtx_card', 'card_id'),
        Index('ix_cardtx_auth', 'authorization_code'),
        Index('ix_cardtx_status', 'status'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    card_id: Mapped[str] = mapped_column(String(36), index=True)
    customer_id: Mapped[str] = mapped_column(String(128), index=True)
    account_id: Mapped[str] = mapped_column(String(128))

    # Transaction identification
    authorization_code: Mapped[str] = mapped_column(String(12), index=True)
    acquirer_reference: Mapped[str] = mapped_column(String(64), nullable=True)
    nsu: Mapped[str] = mapped_column(String(12), nullable=True)  # Unique sequential number

    # Transaction type
    transaction_type: Mapped[str] = mapped_column(String(16))
    # Types: PURCHASE, WITHDRAWAL, REFUND, REVERSAL

    # Amount
    amount: Mapped[float] = mapped_column(Numeric(18, 2))
    currency: Mapped[str] = mapped_column(String(3), default="BRL")
    original_amount: Mapped[float] = mapped_column(Numeric(18, 2), nullable=True)  # For FX
    original_currency: Mapped[str] = mapped_column(String(3), nullable=True)
    exchange_rate: Mapped[float] = mapped_column(Float, nullable=True)

    # Authorization vs Capture
    authorized_amount: Mapped[float] = mapped_column(Numeric(18, 2), nullable=True)
    captured_amount: Mapped[float] = mapped_column(Numeric(18, 2), nullable=True)

    # Merchant info
    merchant_name: Mapped[str] = mapped_column(String(256))
    merchant_id: Mapped[str] = mapped_column(String(32), nullable=True)
    merchant_category_code: Mapped[str] = mapped_column(String(4), nullable=True)
    merchant_city: Mapped[str] = mapped_column(String(64), nullable=True)
    merchant_country: Mapped[str] = mapped_column(String(2), nullable=True)

    # Entry mode
    entry_mode: Mapped[str] = mapped_column(String(16), nullable=True)
    # Modes: CHIP, MAGSTRIPE, CONTACTLESS, ECOMMERCE, MANUAL

    # Status workflow
    status: Mapped[str] = mapped_column(String(16), default="PENDING")
    # Status: PENDING, AUTHORIZED, CAPTURED, DECLINED, VOIDED, REFUNDED, REVERSED

    # 3DS info
    is_3ds: Mapped[bool] = mapped_column(Boolean, default=False)
    three_ds_version: Mapped[str] = mapped_column(String(8), nullable=True)
    three_ds_status: Mapped[str] = mapped_column(String(16), nullable=True)
    eci: Mapped[str] = mapped_column(String(2), nullable=True)  # Electronic Commerce Indicator

    # Decline info
    decline_code: Mapped[str] = mapped_column(String(8), nullable=True)
    decline_reason: Mapped[str] = mapped_column(Text, nullable=True)

    # Fraud score
    fraud_score: Mapped[float] = mapped_column(Float, nullable=True)
    fraud_flags: Mapped[dict] = mapped_column(JSONB, nullable=True)

    # Installments (for credit)
    installments: Mapped[int] = mapped_column(Integer, default=1)
    installment_amount: Mapped[float] = mapped_column(Numeric(18, 2), nullable=True)

    # Raw data
    request_data: Mapped[dict] = mapped_column(JSONB, nullable=True)
    response_data: Mapped[dict] = mapped_column(JSONB, nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    authorized_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    captured_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    settled_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)


class ThreeDS(Base):
    """
    3D Secure authentication sessions
    """
    __tablename__ = "threeds_sessions"
    __table_args__ = (
        Index('ix_3ds_transaction', 'transaction_id'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    transaction_id: Mapped[str] = mapped_column(String(36), index=True)
    card_id: Mapped[str] = mapped_column(String(36))

    # 3DS Version
    version: Mapped[str] = mapped_column(String(8), default="2.2")  # 2.1, 2.2

    # Device info
    device_channel: Mapped[str] = mapped_column(String(16))  # APP, BROWSER
    device_fingerprint: Mapped[str] = mapped_column(Text, nullable=True)

    # Challenge
    acs_url: Mapped[str] = mapped_column(Text, nullable=True)
    acs_trans_id: Mapped[str] = mapped_column(String(64), nullable=True)
    ds_trans_id: Mapped[str] = mapped_column(String(64), nullable=True)
    server_trans_id: Mapped[str] = mapped_column(String(64), nullable=True)

    # Authentication
    authentication_value: Mapped[str] = mapped_column(String(64), nullable=True)  # CAVV/AAV
    eci: Mapped[str] = mapped_column(String(2), nullable=True)

    # Status
    status: Mapped[str] = mapped_column(String(16), default="PENDING")
    # Status: PENDING, CHALLENGE_REQUIRED, AUTHENTICATED, FAILED, TIMEOUT

    # Result
    trans_status: Mapped[str] = mapped_column(String(2), nullable=True)
    # Y=Authenticated, N=Not Authenticated, U=Unable, A=Attempted, C=Challenge

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    completed_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime)


class CardInvoice(Base):
    """
    Credit card invoice/statement
    """
    __tablename__ = "card_invoices"
    __table_args__ = (
        Index('ix_invoice_card', 'card_id'),
        Index('ix_invoice_due', 'due_date'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    card_id: Mapped[str] = mapped_column(String(36), index=True)
    customer_id: Mapped[str] = mapped_column(String(128), index=True)
    account_id: Mapped[str] = mapped_column(String(128))

    # Period
    reference_month: Mapped[str] = mapped_column(String(7))  # YYYY-MM
    period_start: Mapped[datetime] = mapped_column(DateTime)
    period_end: Mapped[datetime] = mapped_column(DateTime)
    close_date: Mapped[datetime] = mapped_column(DateTime)
    due_date: Mapped[datetime] = mapped_column(DateTime, index=True)

    # Amounts
    total_amount: Mapped[float] = mapped_column(Numeric(18, 2), default=0)
    minimum_payment: Mapped[float] = mapped_column(Numeric(18, 2), default=0)
    previous_balance: Mapped[float] = mapped_column(Numeric(18, 2), default=0)
    payments: Mapped[float] = mapped_column(Numeric(18, 2), default=0)
    purchases: Mapped[float] = mapped_column(Numeric(18, 2), default=0)
    fees: Mapped[float] = mapped_column(Numeric(18, 2), default=0)
    interest: Mapped[float] = mapped_column(Numeric(18, 2), default=0)

    # Status
    status: Mapped[str] = mapped_column(String(16), default="OPEN")
    # Status: OPEN, CLOSED, PAID, PARTIAL, OVERDUE

    # Payment info
    paid_amount: Mapped[float] = mapped_column(Numeric(18, 2), default=0)
    paid_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    payment_method: Mapped[str] = mapped_column(String(16), nullable=True)

    # PDF
    pdf_url: Mapped[str] = mapped_column(Text, nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class CardInvoiceItem(Base):
    """
    Individual items on an invoice
    """
    __tablename__ = "card_invoice_items"
    __table_args__ = (
        Index('ix_invoice_item', 'invoice_id'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    invoice_id: Mapped[str] = mapped_column(String(36), index=True)
    transaction_id: Mapped[str] = mapped_column(String(36), nullable=True)

    # Item info
    item_type: Mapped[str] = mapped_column(String(16))
    # Types: PURCHASE, PAYMENT, FEE, INTEREST, REFUND, ADJUSTMENT

    description: Mapped[str] = mapped_column(String(256))
    amount: Mapped[float] = mapped_column(Numeric(18, 2))
    transaction_date: Mapped[datetime] = mapped_column(DateTime)

    # Installment info
    installment_number: Mapped[int] = mapped_column(Integer, nullable=True)
    total_installments: Mapped[int] = mapped_column(Integer, nullable=True)


class CardDispute(Base):
    """
    Card transaction disputes/chargebacks
    """
    __tablename__ = "card_disputes"
    __table_args__ = (
        Index('ix_dispute_card', 'card_id'),
        Index('ix_dispute_tx', 'transaction_id'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    card_id: Mapped[str] = mapped_column(String(36), index=True)
    transaction_id: Mapped[str] = mapped_column(String(36), index=True)
    customer_id: Mapped[str] = mapped_column(String(128))

    # Dispute info
    dispute_type: Mapped[str] = mapped_column(String(16))
    # Types: FRAUD, NOT_RECEIVED, NOT_AS_DESCRIBED, DUPLICATE, OTHER

    reason_code: Mapped[str] = mapped_column(String(8), nullable=True)
    description: Mapped[str] = mapped_column(Text)

    # Amount
    amount: Mapped[float] = mapped_column(Numeric(18, 2))
    currency: Mapped[str] = mapped_column(String(3), default="BRL")

    # Status
    status: Mapped[str] = mapped_column(String(16), default="OPEN")
    # Status: OPEN, UNDER_REVIEW, PROVISIONALLY_CREDITED, WON, LOST, CANCELLED

    # Resolution
    resolution: Mapped[str] = mapped_column(String(16), nullable=True)
    resolution_date: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    resolution_notes: Mapped[str] = mapped_column(Text, nullable=True)

    # Evidence
    evidence: Mapped[dict] = mapped_column(JSONB, nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deadline_at: Mapped[datetime] = mapped_column(DateTime)


class CardNotification(Base):
    """
    Card transaction notifications
    """
    __tablename__ = "card_notifications"
    __table_args__ = {"schema": SCHEMA}

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    card_id: Mapped[str] = mapped_column(String(36), index=True)
    customer_id: Mapped[str] = mapped_column(String(128), index=True)

    # Notification type
    notification_type: Mapped[str] = mapped_column(String(32))
    # Types: PURCHASE, DECLINE, LIMIT_CHANGE, INVOICE_READY, PAYMENT_DUE

    # Content
    title: Mapped[str] = mapped_column(String(128))
    message: Mapped[str] = mapped_column(Text)
    data: Mapped[dict] = mapped_column(JSONB, nullable=True)

    # Delivery
    channel: Mapped[str] = mapped_column(String(16))  # PUSH, SMS, EMAIL
    sent: Mapped[bool] = mapped_column(Boolean, default=False)
    sent_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class MerchantBlock(Base):
    """
    Blocked merchants per card
    """
    __tablename__ = "merchant_blocks"
    __table_args__ = {"schema": SCHEMA}

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    card_id: Mapped[str] = mapped_column(String(36), index=True)

    # Block criteria
    merchant_id: Mapped[str] = mapped_column(String(32), nullable=True)
    merchant_name_pattern: Mapped[str] = mapped_column(String(128), nullable=True)
    mcc: Mapped[str] = mapped_column(String(4), nullable=True)  # Category code

    reason: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
