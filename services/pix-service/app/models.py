"""
PIX Service Database Models
Complete PIX ecosystem: Keys, Transactions, QR Codes, Claims, Devolutions
Architecture prepared for SPI/DICT integration
"""
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, Boolean, Text, Integer, Float, Index, Numeric
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from app.db import Base, SCHEMA


class PixKey(Base):
    """
    PIX Keys (DICT integration)
    Types: CPF, CNPJ, EMAIL, PHONE, EVP (random)
    """
    __tablename__ = "pix_keys"
    __table_args__ = (
        Index('ix_pixkey_account', 'account_id'),
        Index('ix_pixkey_value', 'key_value'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    account_id: Mapped[str] = mapped_column(String(128), index=True)
    customer_id: Mapped[str] = mapped_column(String(128), index=True)

    # Key info
    key_type: Mapped[str] = mapped_column(String(16))
    # Types: CPF, CNPJ, EMAIL, PHONE, EVP
    key_value: Mapped[str] = mapped_column(String(128), unique=True)

    # Owner info (for DICT)
    owner_name: Mapped[str] = mapped_column(String(256))
    owner_document: Mapped[str] = mapped_column(String(18))  # CPF/CNPJ
    owner_type: Mapped[str] = mapped_column(String(2))  # PF/PJ

    # Bank info
    ispb: Mapped[str] = mapped_column(String(8), default="00000000")  # Athena ISPB (placeholder)
    branch: Mapped[str] = mapped_column(String(8), nullable=True)
    account_number: Mapped[str] = mapped_column(String(32))
    account_type: Mapped[str] = mapped_column(String(16), default="CACC")  # CACC, SVGS, TRAN

    # Status
    status: Mapped[str] = mapped_column(String(16), default="ACTIVE")
    # Status: PENDING, ACTIVE, INACTIVE, PORTABILITY, CLAIM_PENDING

    # DICT registration
    dict_key_id: Mapped[str] = mapped_column(String(64), nullable=True)
    dict_created_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class PixTransaction(Base):
    """
    PIX Transactions (SPI integration)
    Instant payment with E2E tracking
    """
    __tablename__ = "pix_transactions"
    __table_args__ = (
        Index('ix_pixtx_e2e', 'e2e_id'),
        Index('ix_pixtx_account', 'account_id'),
        Index('ix_pixtx_status', 'status'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)

    # End-to-End ID (32 chars, unique per transaction)
    e2e_id: Mapped[str] = mapped_column(String(32), unique=True, index=True)

    # Transaction reference
    tx_id: Mapped[str] = mapped_column(String(35), nullable=True)  # For QR codes

    # Accounts
    account_id: Mapped[str] = mapped_column(String(128), index=True)  # Our account
    customer_id: Mapped[str] = mapped_column(String(128), index=True)

    # Direction
    direction: Mapped[str] = mapped_column(String(8))  # IN, OUT

    # Amount
    amount: Mapped[float] = mapped_column(Numeric(18, 2))
    currency: Mapped[str] = mapped_column(String(3), default="BRL")

    # Payer info
    payer_name: Mapped[str] = mapped_column(String(256), nullable=True)
    payer_document: Mapped[str] = mapped_column(String(18), nullable=True)
    payer_account: Mapped[str] = mapped_column(String(64), nullable=True)
    payer_ispb: Mapped[str] = mapped_column(String(8), nullable=True)
    payer_branch: Mapped[str] = mapped_column(String(8), nullable=True)

    # Payee info
    payee_name: Mapped[str] = mapped_column(String(256), nullable=True)
    payee_document: Mapped[str] = mapped_column(String(18), nullable=True)
    payee_account: Mapped[str] = mapped_column(String(64), nullable=True)
    payee_ispb: Mapped[str] = mapped_column(String(8), nullable=True)
    payee_branch: Mapped[str] = mapped_column(String(8), nullable=True)
    payee_key: Mapped[str] = mapped_column(String(128), nullable=True)
    payee_key_type: Mapped[str] = mapped_column(String(16), nullable=True)

    # Description
    description: Mapped[str] = mapped_column(Text, nullable=True)

    # Status workflow
    status: Mapped[str] = mapped_column(String(16), default="PENDING")
    # Status: PENDING, PROCESSING, SETTLED, REJECTED, RETURNED, CANCELLED

    # Settlement info
    settled_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    settlement_id: Mapped[str] = mapped_column(String(64), nullable=True)  # SPI reference

    # Rejection/Error
    rejection_code: Mapped[str] = mapped_column(String(8), nullable=True)
    rejection_reason: Mapped[str] = mapped_column(Text, nullable=True)

    # Original transaction (for devolutions)
    original_e2e_id: Mapped[str] = mapped_column(String(32), nullable=True)
    is_devolution: Mapped[bool] = mapped_column(Boolean, default=False)

    # Compliance
    compliance_checked: Mapped[bool] = mapped_column(Boolean, default=False)
    compliance_result: Mapped[dict] = mapped_column(JSONB, nullable=True)

    # SPI raw data
    spi_request: Mapped[dict] = mapped_column(JSONB, nullable=True)
    spi_response: Mapped[dict] = mapped_column(JSONB, nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class PixQRCode(Base):
    """
    PIX QR Codes (Static, Dynamic, CobrV)
    BR Code EMV format
    """
    __tablename__ = "pix_qrcodes"
    __table_args__ = (
        Index('ix_qr_account', 'account_id'),
        Index('ix_qr_txid', 'tx_id'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    account_id: Mapped[str] = mapped_column(String(128), index=True)
    customer_id: Mapped[str] = mapped_column(String(128), index=True)

    # QR Type
    qr_type: Mapped[str] = mapped_column(String(16))
    # Types: STATIC, DYNAMIC, COBV (cobranca com vencimento)

    # Transaction ID (only for dynamic)
    tx_id: Mapped[str] = mapped_column(String(35), nullable=True, index=True)
    location: Mapped[str] = mapped_column(String(256), nullable=True)  # URL for payload

    # Amount (optional for static)
    amount: Mapped[float] = mapped_column(Numeric(18, 2), nullable=True)
    is_amount_editable: Mapped[bool] = mapped_column(Boolean, default=True)

    # Payee info
    payee_key: Mapped[str] = mapped_column(String(128))
    payee_name: Mapped[str] = mapped_column(String(256))
    payee_city: Mapped[str] = mapped_column(String(64), default="SAO PAULO")

    # Description
    description: Mapped[str] = mapped_column(Text, nullable=True)

    # Validity (for dynamic/cobv)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    # For CobrV (cobranca com vencimento)
    due_date: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    fine_percentage: Mapped[float] = mapped_column(Float, nullable=True)
    interest_percentage: Mapped[float] = mapped_column(Float, nullable=True)
    discount_percentage: Mapped[float] = mapped_column(Float, nullable=True)

    # Additional info (campo livre)
    additional_info: Mapped[dict] = mapped_column(JSONB, nullable=True)

    # BR Code payload (EMV format)
    br_code: Mapped[str] = mapped_column(Text)
    br_code_image: Mapped[str] = mapped_column(Text, nullable=True)  # Base64 PNG

    # Status
    status: Mapped[str] = mapped_column(String(16), default="ACTIVE")
    # Status: ACTIVE, PAID, EXPIRED, CANCELLED

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class PixDevolution(Base):
    """
    PIX Devolutions (refunds/chargebacks)
    """
    __tablename__ = "pix_devolutions"
    __table_args__ = (
        Index('ix_dev_original', 'original_e2e_id'),
        Index('ix_dev_account', 'account_id'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)

    # Generated E2E for devolution
    e2e_id: Mapped[str] = mapped_column(String(32), unique=True)

    # Original transaction
    original_e2e_id: Mapped[str] = mapped_column(String(32), index=True)
    original_tx_id: Mapped[str] = mapped_column(String(36))

    # Account
    account_id: Mapped[str] = mapped_column(String(128), index=True)
    customer_id: Mapped[str] = mapped_column(String(128))

    # Amount
    amount: Mapped[float] = mapped_column(Numeric(18, 2))
    original_amount: Mapped[float] = mapped_column(Numeric(18, 2))

    # Reason
    reason: Mapped[str] = mapped_column(String(16))
    # Reasons: FRAUD, OPERATIONAL_FAILURE, REQUESTED_BY_RECEIVER, DUPLICATE, OTHER
    description: Mapped[str] = mapped_column(Text, nullable=True)

    # Status
    status: Mapped[str] = mapped_column(String(16), default="PENDING")
    # Status: PENDING, PROCESSING, SETTLED, REJECTED

    # Rejection
    rejection_code: Mapped[str] = mapped_column(String(8), nullable=True)
    rejection_reason: Mapped[str] = mapped_column(Text, nullable=True)

    # Settlement
    settled_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    # Requester
    requester_id: Mapped[str] = mapped_column(String(128), nullable=True)
    requester_type: Mapped[str] = mapped_column(String(16), default="CUSTOMER")

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class PixClaim(Base):
    """
    PIX Key Claims (portability and ownership disputes)
    """
    __tablename__ = "pix_claims"
    __table_args__ = (
        Index('ix_claim_key', 'key_value'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)

    # Claim type
    claim_type: Mapped[str] = mapped_column(String(16))
    # Types: PORTABILITY, OWNERSHIP

    # Key info
    key_type: Mapped[str] = mapped_column(String(16))
    key_value: Mapped[str] = mapped_column(String(128), index=True)

    # Claimer (who is claiming)
    claimer_ispb: Mapped[str] = mapped_column(String(8))
    claimer_account_id: Mapped[str] = mapped_column(String(128))
    claimer_customer_id: Mapped[str] = mapped_column(String(128))
    claimer_document: Mapped[str] = mapped_column(String(18))

    # Donor (current owner)
    donor_ispb: Mapped[str] = mapped_column(String(8), nullable=True)
    donor_account_id: Mapped[str] = mapped_column(String(128), nullable=True)
    donor_customer_id: Mapped[str] = mapped_column(String(128), nullable=True)

    # Status
    status: Mapped[str] = mapped_column(String(16), default="OPEN")
    # Status: OPEN, WAITING_RESOLUTION, CONFIRMED, CANCELLED, COMPLETED

    # Resolution
    resolution: Mapped[str] = mapped_column(String(16), nullable=True)
    # Resolution: ACCEPTED, REJECTED_BY_DONOR, TIMEOUT

    resolution_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    resolution_deadline: Mapped[datetime] = mapped_column(DateTime)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class PixSchedule(Base):
    """
    Scheduled PIX transactions
    """
    __tablename__ = "pix_schedules"
    __table_args__ = (
        Index('ix_sched_account', 'account_id'),
        Index('ix_sched_execute', 'scheduled_for'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    account_id: Mapped[str] = mapped_column(String(128), index=True)
    customer_id: Mapped[str] = mapped_column(String(128), index=True)

    # Schedule info
    scheduled_for: Mapped[datetime] = mapped_column(DateTime, index=True)
    recurrence: Mapped[str] = mapped_column(String(16), nullable=True)
    # Recurrence: ONCE, DAILY, WEEKLY, MONTHLY

    # Payment details
    payee_key: Mapped[str] = mapped_column(String(128))
    payee_key_type: Mapped[str] = mapped_column(String(16))
    payee_name: Mapped[str] = mapped_column(String(256))
    payee_document: Mapped[str] = mapped_column(String(18), nullable=True)
    amount: Mapped[float] = mapped_column(Numeric(18, 2))
    description: Mapped[str] = mapped_column(Text, nullable=True)

    # Status
    status: Mapped[str] = mapped_column(String(16), default="SCHEDULED")
    # Status: SCHEDULED, EXECUTED, FAILED, CANCELLED

    # Execution result
    executed_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    transaction_id: Mapped[str] = mapped_column(String(36), nullable=True)
    error_message: Mapped[str] = mapped_column(Text, nullable=True)

    # Next occurrence (for recurring)
    next_occurrence: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class PixWebhook(Base):
    """
    Webhook notifications for PIX events
    """
    __tablename__ = "pix_webhooks"
    __table_args__ = {"schema": SCHEMA}

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    account_id: Mapped[str] = mapped_column(String(128), index=True)

    # Webhook config
    url: Mapped[str] = mapped_column(String(512))
    secret: Mapped[str] = mapped_column(String(128), nullable=True)  # For HMAC signing

    # Events to notify
    events: Mapped[list] = mapped_column(JSONB, default=list)
    # Events: PIX_RECEIVED, PIX_SENT, PIX_DEVOLUTION, QR_PAID

    # Status
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Stats
    total_sent: Mapped[int] = mapped_column(Integer, default=0)
    total_failed: Mapped[int] = mapped_column(Integer, default=0)
    last_sent_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class PixLimit(Base):
    """
    PIX transaction limits per account
    """
    __tablename__ = "pix_limits"
    __table_args__ = {"schema": SCHEMA}

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    account_id: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    customer_id: Mapped[str] = mapped_column(String(128), index=True)

    # Limits
    per_transaction: Mapped[float] = mapped_column(Numeric(18, 2), default=10000.00)
    daily: Mapped[float] = mapped_column(Numeric(18, 2), default=50000.00)
    monthly: Mapped[float] = mapped_column(Numeric(18, 2), default=500000.00)

    # Night period limits (20:00 - 06:00)
    night_per_transaction: Mapped[float] = mapped_column(Numeric(18, 2), default=1000.00)
    night_daily: Mapped[float] = mapped_column(Numeric(18, 2), default=5000.00)

    # Usage tracking (reset daily/monthly)
    used_today: Mapped[float] = mapped_column(Numeric(18, 2), default=0)
    used_month: Mapped[float] = mapped_column(Numeric(18, 2), default=0)
    last_reset_day: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    last_reset_month: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    # Custom limits requested by user
    custom_limit_requested: Mapped[float] = mapped_column(Numeric(18, 2), nullable=True)
    custom_limit_status: Mapped[str] = mapped_column(String(16), nullable=True)
    # Status: PENDING, APPROVED, REJECTED

    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
