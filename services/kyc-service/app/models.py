"""
KYC Service Database Models
Document verification, face validation, and KYC levels
"""
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, Boolean, Text, Integer, Float, Index
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from app.db import Base, SCHEMA


class KYCSubmission(Base):
    """
    KYC submission workflow tracking
    """
    __tablename__ = "kyc_submissions"
    __table_args__ = (
        Index('ix_kyc_customer_status', 'customer_id', 'status'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    customer_id: Mapped[str] = mapped_column(String(128), index=True)

    # Submission type
    submission_type: Mapped[str] = mapped_column(String(32))
    # Types: INITIAL, UPGRADE, REFRESH, RESUBMISSION

    # Current level and target
    current_level: Mapped[int] = mapped_column(Integer, default=0)
    target_level: Mapped[int] = mapped_column(Integer, default=1)

    # Status workflow
    status: Mapped[str] = mapped_column(String(32), default="PENDING", index=True)
    # Status: PENDING, PROCESSING, DOCUMENTS_REQUIRED, FACE_VALIDATION,
    #         MANUAL_REVIEW, APPROVED, REJECTED, EXPIRED

    # Document references
    documents: Mapped[dict] = mapped_column(JSONB, default=dict)
    # Example: {"doc_front": "doc-123", "doc_back": "doc-124", "selfie": "doc-125"}

    # Validation results
    document_validation: Mapped[dict] = mapped_column(JSONB, nullable=True)
    face_validation: Mapped[dict] = mapped_column(JSONB, nullable=True)

    # Rejection details
    rejection_reason: Mapped[str] = mapped_column(Text, nullable=True)
    rejection_code: Mapped[str] = mapped_column(String(32), nullable=True)

    # Reviewer
    reviewer_id: Mapped[str] = mapped_column(String(128), nullable=True)
    reviewed_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    review_notes: Mapped[str] = mapped_column(Text, nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)


class Document(Base):
    """
    Uploaded document storage and OCR data
    """
    __tablename__ = "documents"
    __table_args__ = (
        Index('ix_doc_customer_type', 'customer_id', 'doc_type'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    customer_id: Mapped[str] = mapped_column(String(128), index=True)
    submission_id: Mapped[str] = mapped_column(String(36), nullable=True, index=True)

    # Document type
    doc_type: Mapped[str] = mapped_column(String(32), index=True)
    # Types: RG_FRONT, RG_BACK, CNH_FRONT, CNH_BACK, PASSPORT, SELFIE,
    #        CNPJ_CARD, SOCIAL_CONTRACT, PROOF_ADDRESS, PROOF_INCOME

    # Storage (encrypted reference - actual file in S3/Minio)
    storage_ref: Mapped[str] = mapped_column(String(512))
    storage_provider: Mapped[str] = mapped_column(String(32), default="local")
    file_hash: Mapped[str] = mapped_column(String(64))  # SHA-256 for integrity

    # File metadata
    file_name: Mapped[str] = mapped_column(String(256), nullable=True)
    file_size: Mapped[int] = mapped_column(Integer, nullable=True)
    mime_type: Mapped[str] = mapped_column(String(64), nullable=True)

    # OCR extracted data
    ocr_extracted: Mapped[dict] = mapped_column(JSONB, nullable=True)
    # Example: {"name": "João Silva", "cpf": "123.456.789-00", "birth_date": "1990-01-01"}

    # Quality assessment
    quality_score: Mapped[float] = mapped_column(Float, nullable=True)  # 0-1
    quality_issues: Mapped[dict] = mapped_column(JSONB, nullable=True)
    # Example: {"blurry": false, "glare": true, "partial": false}

    # Verification
    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    verification_method: Mapped[str] = mapped_column(String(32), nullable=True)
    # Methods: MANUAL, OCR_AUTO, SERPRO, RECEITA_FEDERAL

    # Status
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class FaceValidation(Base):
    """
    Face liveness and match validation results
    """
    __tablename__ = "face_validations"
    __table_args__ = (
        Index('ix_face_customer', 'customer_id'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    customer_id: Mapped[str] = mapped_column(String(128), index=True)
    submission_id: Mapped[str] = mapped_column(String(36), index=True)

    # References
    selfie_document_id: Mapped[str] = mapped_column(String(36))
    id_photo_document_id: Mapped[str] = mapped_column(String(36), nullable=True)

    # Provider info
    provider: Mapped[str] = mapped_column(String(32))
    # Providers: INTERNAL (Athena's project), FACETEC, ONFIDO, IPROOV
    provider_reference: Mapped[str] = mapped_column(String(128), nullable=True)

    # Liveness detection
    liveness_score: Mapped[float] = mapped_column(Float, nullable=True)  # 0-1
    liveness_result: Mapped[str] = mapped_column(String(32), nullable=True)
    # Results: LIVE, SPOOF, INCONCLUSIVE

    # Face match (selfie vs document photo)
    match_score: Mapped[float] = mapped_column(Float, nullable=True)  # 0-1
    match_result: Mapped[str] = mapped_column(String(32), nullable=True)
    # Results: MATCH, NO_MATCH, INCONCLUSIVE

    # Overall result
    result: Mapped[str] = mapped_column(String(32))
    # Results: PASS, FAIL, INCONCLUSIVE, ERROR

    # Raw response from provider
    provider_response: Mapped[dict] = mapped_column(JSONB, nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class KYCLevel(Base):
    """
    KYC level requirements and limits configuration
    """
    __tablename__ = "kyc_levels"
    __table_args__ = {"schema": SCHEMA}

    level: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(64))
    description: Mapped[str] = mapped_column(Text)

    # Requirements
    requirements: Mapped[dict] = mapped_column(JSONB)
    # Example: {"documents": ["RG_FRONT", "RG_BACK", "SELFIE"], "face_validation": true}

    # Limits (can be overridden by compliance service)
    default_limits: Mapped[dict] = mapped_column(JSONB)
    # Example: {"daily": 5000, "monthly": 20000, "per_transaction": 2000}

    # Validity
    validity_days: Mapped[int] = mapped_column(Integer, default=365)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class KYCHistory(Base):
    """
    Customer KYC history audit trail
    """
    __tablename__ = "kyc_history"
    __table_args__ = (
        Index('ix_history_customer', 'customer_id', 'created_at'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    customer_id: Mapped[str] = mapped_column(String(128), index=True)
    submission_id: Mapped[str] = mapped_column(String(36), nullable=True)

    # Event
    event_type: Mapped[str] = mapped_column(String(32))
    # Types: LEVEL_CHANGE, SUBMISSION, APPROVAL, REJECTION, DOCUMENT_UPLOAD, FACE_CHECK

    # Details
    previous_level: Mapped[int] = mapped_column(Integer, nullable=True)
    new_level: Mapped[int] = mapped_column(Integer, nullable=True)
    details: Mapped[dict] = mapped_column(JSONB, nullable=True)

    # Actor
    actor_id: Mapped[str] = mapped_column(String(128), nullable=True)
    actor_type: Mapped[str] = mapped_column(String(32), default="SYSTEM")

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
