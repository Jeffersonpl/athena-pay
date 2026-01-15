"""
Loans Service Database Models
Credit scoring, loan applications, and installment management
"""
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, Boolean, Text, Integer, Float, Index, Numeric
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from app.db import Base, SCHEMA


class CreditScore(Base):
    """
    Customer credit score history
    """
    __tablename__ = "credit_scores"
    __table_args__ = (
        Index('ix_score_customer', 'customer_id'),
        Index('ix_score_date', 'calculated_at'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    customer_id: Mapped[str] = mapped_column(String(128), index=True)
    account_id: Mapped[str] = mapped_column(String(128), nullable=True)

    # Score (0-1000)
    score: Mapped[int] = mapped_column(Integer)
    score_band: Mapped[str] = mapped_column(String(1))  # A, B, C, D, E
    risk_level: Mapped[str] = mapped_column(String(16))  # LOW, MEDIUM, HIGH, VERY_HIGH

    # Score factors (weights and values)
    factors: Mapped[dict] = mapped_column(JSONB)
    """
    Factors include:
    - account_age_months: Time as customer
    - avg_monthly_balance: Average balance
    - income_stability: Regularity of income
    - payment_history: On-time payments %
    - debt_ratio: Current debt / income
    - transaction_behavior: Spending patterns
    - negative_records: Protests, restrictions
    - bureau_score: External bureau score (if available)
    """

    # Source
    calculation_source: Mapped[str] = mapped_column(String(32))  # INTERNAL, BUREAU, AI
    ai_confidence: Mapped[float] = mapped_column(Float, nullable=True)  # If AI-generated

    calculated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    valid_until: Mapped[datetime] = mapped_column(DateTime)  # Score validity


class CreditLimit(Base):
    """
    Customer credit limits per product
    """
    __tablename__ = "credit_limits"
    __table_args__ = (
        Index('ix_limit_customer', 'customer_id'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    customer_id: Mapped[str] = mapped_column(String(128), index=True)
    account_id: Mapped[str] = mapped_column(String(128), nullable=True)

    # Product
    product_type: Mapped[str] = mapped_column(String(32))
    # Products: PERSONAL_LOAN, CONSIGNADO, OVERDRAFT, CREDIT_CARD

    # Limits
    approved_limit: Mapped[float] = mapped_column(Numeric(18, 2))
    available_limit: Mapped[float] = mapped_column(Numeric(18, 2))
    used_limit: Mapped[float] = mapped_column(Numeric(18, 2), default=0)

    # Interest rates (monthly)
    base_rate: Mapped[float] = mapped_column(Float)  # Base monthly rate
    final_rate: Mapped[float] = mapped_column(Float)  # Rate after risk adjustment

    # Terms
    max_term_months: Mapped[int] = mapped_column(Integer)
    min_amount: Mapped[float] = mapped_column(Numeric(18, 2))
    max_amount: Mapped[float] = mapped_column(Numeric(18, 2))

    # Based on score
    score_id: Mapped[str] = mapped_column(String(36), nullable=True)
    score_at_approval: Mapped[int] = mapped_column(Integer, nullable=True)

    # Status
    status: Mapped[str] = mapped_column(String(16), default="ACTIVE")
    # Status: ACTIVE, SUSPENDED, EXPIRED, CANCELLED

    approved_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    expires_at: Mapped[datetime] = mapped_column(DateTime)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class LoanApplication(Base):
    """
    Loan application/request
    """
    __tablename__ = "loan_applications"
    __table_args__ = (
        Index('ix_app_customer', 'customer_id'),
        Index('ix_app_status', 'status'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    customer_id: Mapped[str] = mapped_column(String(128), index=True)
    account_id: Mapped[str] = mapped_column(String(128))

    # Application details
    product_type: Mapped[str] = mapped_column(String(32))
    requested_amount: Mapped[float] = mapped_column(Numeric(18, 2))
    requested_term: Mapped[int] = mapped_column(Integer)  # Months
    purpose: Mapped[str] = mapped_column(String(64), nullable=True)

    # Approved terms (if approved)
    approved_amount: Mapped[float] = mapped_column(Numeric(18, 2), nullable=True)
    approved_term: Mapped[int] = mapped_column(Integer, nullable=True)
    approved_rate: Mapped[float] = mapped_column(Float, nullable=True)  # Monthly
    monthly_payment: Mapped[float] = mapped_column(Numeric(18, 2), nullable=True)
    total_amount: Mapped[float] = mapped_column(Numeric(18, 2), nullable=True)
    iof_amount: Mapped[float] = mapped_column(Numeric(18, 2), nullable=True)  # IOF tax
    cet: Mapped[float] = mapped_column(Float, nullable=True)  # Custo Efetivo Total (annual)

    # Score at application
    score_id: Mapped[str] = mapped_column(String(36), nullable=True)
    score_value: Mapped[int] = mapped_column(Integer, nullable=True)

    # Analysis
    analysis_result: Mapped[dict] = mapped_column(JSONB, nullable=True)
    rejection_reasons: Mapped[dict] = mapped_column(JSONB, nullable=True)

    # Status
    status: Mapped[str] = mapped_column(String(20), default="PENDING")
    # Status: PENDING, ANALYZING, APPROVED, REJECTED, CANCELLED, EXPIRED, DISBURSED

    # Timestamps
    submitted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    analyzed_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)  # Approval expiration

    # If converted to loan
    loan_id: Mapped[str] = mapped_column(String(36), nullable=True)


class Loan(Base):
    """
    Active loan contract
    """
    __tablename__ = "loans"
    __table_args__ = (
        Index('ix_loan_customer', 'customer_id'),
        Index('ix_loan_status', 'status'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    contract_number: Mapped[str] = mapped_column(String(32), unique=True)
    application_id: Mapped[str] = mapped_column(String(36))
    customer_id: Mapped[str] = mapped_column(String(128), index=True)
    account_id: Mapped[str] = mapped_column(String(128))

    # Loan details
    product_type: Mapped[str] = mapped_column(String(32))
    principal_amount: Mapped[float] = mapped_column(Numeric(18, 2))  # Amount borrowed
    disbursed_amount: Mapped[float] = mapped_column(Numeric(18, 2))  # After IOF

    # Terms
    term_months: Mapped[int] = mapped_column(Integer)
    monthly_rate: Mapped[float] = mapped_column(Float)
    annual_rate: Mapped[float] = mapped_column(Float)
    cet: Mapped[float] = mapped_column(Float)  # Annual CET

    # Amounts
    total_amount: Mapped[float] = mapped_column(Numeric(18, 2))  # Total to pay
    monthly_payment: Mapped[float] = mapped_column(Numeric(18, 2))
    iof_amount: Mapped[float] = mapped_column(Numeric(18, 2))

    # Current status
    outstanding_balance: Mapped[float] = mapped_column(Numeric(18, 2))
    paid_amount: Mapped[float] = mapped_column(Numeric(18, 2), default=0)
    paid_installments: Mapped[int] = mapped_column(Integer, default=0)
    overdue_amount: Mapped[float] = mapped_column(Numeric(18, 2), default=0)
    overdue_days: Mapped[int] = mapped_column(Integer, default=0)

    # Dates
    first_due_date: Mapped[datetime] = mapped_column(DateTime)
    last_due_date: Mapped[datetime] = mapped_column(DateTime)
    next_due_date: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    # Status
    status: Mapped[str] = mapped_column(String(16), default="ACTIVE")
    # Status: ACTIVE, PAID_OFF, DEFAULTED, RENEGOTIATED, CANCELLED

    disbursed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    paid_off_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class LoanInstallment(Base):
    """
    Loan installment (parcela)
    """
    __tablename__ = "loan_installments"
    __table_args__ = (
        Index('ix_installment_loan', 'loan_id'),
        Index('ix_installment_due', 'due_date'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    loan_id: Mapped[str] = mapped_column(String(36), index=True)

    # Installment info
    number: Mapped[int] = mapped_column(Integer)  # Parcela 1, 2, 3...
    due_date: Mapped[datetime] = mapped_column(DateTime)

    # Amounts
    principal: Mapped[float] = mapped_column(Numeric(18, 2))
    interest: Mapped[float] = mapped_column(Numeric(18, 2))
    fees: Mapped[float] = mapped_column(Numeric(18, 2), default=0)
    insurance: Mapped[float] = mapped_column(Numeric(18, 2), default=0)
    total_amount: Mapped[float] = mapped_column(Numeric(18, 2))

    # Late fees (if applicable)
    late_fee: Mapped[float] = mapped_column(Numeric(18, 2), default=0)
    daily_interest: Mapped[float] = mapped_column(Numeric(18, 2), default=0)
    total_with_late: Mapped[float] = mapped_column(Numeric(18, 2), nullable=True)

    # Payment
    paid_amount: Mapped[float] = mapped_column(Numeric(18, 2), nullable=True)
    paid_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    payment_reference: Mapped[str] = mapped_column(String(64), nullable=True)

    # Status
    status: Mapped[str] = mapped_column(String(16), default="PENDING")
    # Status: PENDING, PAID, OVERDUE, PARTIALLY_PAID

    overdue_days: Mapped[int] = mapped_column(Integer, default=0)


class LoanPayment(Base):
    """
    Loan payment history
    """
    __tablename__ = "loan_payments"
    __table_args__ = (
        Index('ix_payment_loan', 'loan_id'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    loan_id: Mapped[str] = mapped_column(String(36), index=True)
    installment_id: Mapped[str] = mapped_column(String(36), nullable=True)

    # Payment details
    payment_type: Mapped[str] = mapped_column(String(20))
    # Types: REGULAR, PREPAYMENT, PARTIAL, SETTLEMENT

    amount: Mapped[float] = mapped_column(Numeric(18, 2))
    principal_paid: Mapped[float] = mapped_column(Numeric(18, 2))
    interest_paid: Mapped[float] = mapped_column(Numeric(18, 2))
    fees_paid: Mapped[float] = mapped_column(Numeric(18, 2), default=0)
    late_fees_paid: Mapped[float] = mapped_column(Numeric(18, 2), default=0)

    # Source
    payment_source: Mapped[str] = mapped_column(String(32))  # DEBIT, PIX, BOLETO, TRANSFER
    payment_reference: Mapped[str] = mapped_column(String(64), nullable=True)

    paid_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class LoanProduct(Base):
    """
    Loan product configuration
    """
    __tablename__ = "loan_products"
    __table_args__ = {"schema": SCHEMA}

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    code: Mapped[str] = mapped_column(String(32), unique=True)
    name: Mapped[str] = mapped_column(String(128))
    description: Mapped[str] = mapped_column(Text, nullable=True)

    # Amount limits
    min_amount: Mapped[float] = mapped_column(Numeric(18, 2))
    max_amount: Mapped[float] = mapped_column(Numeric(18, 2))

    # Term limits
    min_term: Mapped[int] = mapped_column(Integer)  # Months
    max_term: Mapped[int] = mapped_column(Integer)

    # Rate by score band
    rate_band_a: Mapped[float] = mapped_column(Float)  # Monthly rate for score A
    rate_band_b: Mapped[float] = mapped_column(Float)
    rate_band_c: Mapped[float] = mapped_column(Float)
    rate_band_d: Mapped[float] = mapped_column(Float)
    rate_band_e: Mapped[float] = mapped_column(Float)

    # Minimum score required
    min_score: Mapped[int] = mapped_column(Integer, default=300)

    # IOF rates
    iof_daily: Mapped[float] = mapped_column(Float, default=0.0082)  # 0.0082% per day
    iof_additional: Mapped[float] = mapped_column(Float, default=0.38)  # 0.38% flat

    # Insurance
    insurance_rate: Mapped[float] = mapped_column(Float, default=0)

    # Grace period
    first_payment_days: Mapped[int] = mapped_column(Integer, default=30)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class ScoreHistory(Base):
    """
    Detailed score calculation history (for audit)
    """
    __tablename__ = "score_history"
    __table_args__ = {"schema": SCHEMA}

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    score_id: Mapped[str] = mapped_column(String(36), index=True)
    customer_id: Mapped[str] = mapped_column(String(128))

    # Input data used
    input_data: Mapped[dict] = mapped_column(JSONB)

    # Calculation details
    factor_scores: Mapped[dict] = mapped_column(JSONB)
    weights_used: Mapped[dict] = mapped_column(JSONB)
    final_calculation: Mapped[dict] = mapped_column(JSONB)

    calculated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
