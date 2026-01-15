"""
Boleto Service Database Models
Boleto generation, payment processing, and CNAB integration
"""
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, Boolean, Text, Integer, Float, Index, Numeric
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from app.db import Base, SCHEMA


class Boleto(Base):
    """
    Boleto (Brazilian bank slip) entity
    """
    __tablename__ = "boletos"
    __table_args__ = (
        Index('ix_boleto_customer', 'customer_id'),
        Index('ix_boleto_barcode', 'barcode'),
        Index('ix_boleto_due', 'due_date'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    account_id: Mapped[str] = mapped_column(String(128), index=True)
    customer_id: Mapped[str] = mapped_column(String(128), index=True)

    # Boleto identification
    our_number: Mapped[str] = mapped_column(String(20), unique=True)  # Nosso numero
    document_number: Mapped[str] = mapped_column(String(25), nullable=True)  # Numero do documento
    barcode: Mapped[str] = mapped_column(String(44), unique=True)  # Codigo de barras
    digitable_line: Mapped[str] = mapped_column(String(54))  # Linha digitavel

    # Bank info
    bank_code: Mapped[str] = mapped_column(String(3))
    branch: Mapped[str] = mapped_column(String(8))
    bank_account: Mapped[str] = mapped_column(String(12))
    wallet: Mapped[str] = mapped_column(String(3), default="109")  # Carteira

    # Beneficiary (who receives the payment)
    beneficiary_name: Mapped[str] = mapped_column(String(256))
    beneficiary_document: Mapped[str] = mapped_column(String(18))
    beneficiary_address: Mapped[dict] = mapped_column(JSONB, nullable=True)

    # Payer (who pays the boleto)
    payer_name: Mapped[str] = mapped_column(String(256))
    payer_document: Mapped[str] = mapped_column(String(18))
    payer_address: Mapped[dict] = mapped_column(JSONB, nullable=True)

    # Amount
    amount: Mapped[float] = mapped_column(Numeric(18, 2))
    discount_amount: Mapped[float] = mapped_column(Numeric(18, 2), default=0)
    fine_amount: Mapped[float] = mapped_column(Numeric(18, 2), default=0)
    interest_amount: Mapped[float] = mapped_column(Numeric(18, 2), default=0)
    paid_amount: Mapped[float] = mapped_column(Numeric(18, 2), nullable=True)

    # Dates
    issue_date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    due_date: Mapped[datetime] = mapped_column(DateTime)
    discount_deadline: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    paid_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    # Instructions
    instructions: Mapped[str] = mapped_column(Text, nullable=True)
    late_fee_percentage: Mapped[float] = mapped_column(Float, default=2.0)  # Multa 2%
    daily_interest_percentage: Mapped[float] = mapped_column(Float, default=0.033)  # Juros 1% ao mes

    # Status
    status: Mapped[str] = mapped_column(String(16), default="PENDING")
    # Status: PENDING, REGISTERED, PAID, CANCELLED, EXPIRED, PROTESTED

    # Registration (for registered boletos)
    registered_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    registration_return: Mapped[dict] = mapped_column(JSONB, nullable=True)

    # Payment info
    payment_channel: Mapped[str] = mapped_column(String(32), nullable=True)
    payment_bank: Mapped[str] = mapped_column(String(3), nullable=True)

    # PDF
    pdf_url: Mapped[str] = mapped_column(Text, nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class BoletoRemittance(Base):
    """
    CNAB remittance file (arquivo de remessa)
    """
    __tablename__ = "boleto_remittances"
    __table_args__ = {"schema": SCHEMA}

    id: Mapped[str] = mapped_column(String(36), primary_key=True)

    # File info
    file_type: Mapped[str] = mapped_column(String(8))  # CNAB240, CNAB400
    file_name: Mapped[str] = mapped_column(String(256))
    sequence_number: Mapped[int] = mapped_column(Integer)

    # Bank info
    bank_code: Mapped[str] = mapped_column(String(3))
    branch: Mapped[str] = mapped_column(String(8))
    account: Mapped[str] = mapped_column(String(12))

    # Content
    total_records: Mapped[int] = mapped_column(Integer)
    total_amount: Mapped[float] = mapped_column(Numeric(18, 2))

    # Processing
    processed: Mapped[bool] = mapped_column(Boolean, default=False)
    processed_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    errors: Mapped[dict] = mapped_column(JSONB, nullable=True)

    # File storage
    file_path: Mapped[str] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class BoletoReturn(Base):
    """
    CNAB return file (arquivo de retorno)
    """
    __tablename__ = "boleto_returns"
    __table_args__ = {"schema": SCHEMA}

    id: Mapped[str] = mapped_column(String(36), primary_key=True)

    # File info
    file_type: Mapped[str] = mapped_column(String(8))
    file_name: Mapped[str] = mapped_column(String(256))

    # Bank info
    bank_code: Mapped[str] = mapped_column(String(3))
    branch: Mapped[str] = mapped_column(String(8))
    account: Mapped[str] = mapped_column(String(12))

    # Content
    total_records: Mapped[int] = mapped_column(Integer)

    # Processing
    processed: Mapped[bool] = mapped_column(Boolean, default=False)
    processed_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    processed_boletos: Mapped[int] = mapped_column(Integer, default=0)
    errors: Mapped[dict] = mapped_column(JSONB, nullable=True)

    # File storage
    file_path: Mapped[str] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class BoletoHistory(Base):
    """
    Boleto status change history
    """
    __tablename__ = "boleto_history"
    __table_args__ = (
        Index('ix_history_boleto', 'boleto_id'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    boleto_id: Mapped[str] = mapped_column(String(36), index=True)

    # Change info
    previous_status: Mapped[str] = mapped_column(String(16), nullable=True)
    new_status: Mapped[str] = mapped_column(String(16))
    change_reason: Mapped[str] = mapped_column(Text, nullable=True)

    # Source
    source: Mapped[str] = mapped_column(String(32))  # API, CNAB_RETURN, MANUAL
    reference: Mapped[str] = mapped_column(String(64), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class BoletoConfig(Base):
    """
    Boleto generation configuration per account
    """
    __tablename__ = "boleto_configs"
    __table_args__ = {"schema": SCHEMA}

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    account_id: Mapped[str] = mapped_column(String(128), unique=True, index=True)

    # Bank configuration
    bank_code: Mapped[str] = mapped_column(String(3))
    branch: Mapped[str] = mapped_column(String(8))
    bank_account: Mapped[str] = mapped_column(String(12))
    wallet: Mapped[str] = mapped_column(String(3))

    # Beneficiary info
    beneficiary_name: Mapped[str] = mapped_column(String(256))
    beneficiary_document: Mapped[str] = mapped_column(String(18))

    # Default settings
    default_late_fee: Mapped[float] = mapped_column(Float, default=2.0)
    default_daily_interest: Mapped[float] = mapped_column(Float, default=0.033)
    default_instructions: Mapped[str] = mapped_column(Text, nullable=True)

    # Sequence control
    next_our_number: Mapped[int] = mapped_column(Integer, default=1)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
