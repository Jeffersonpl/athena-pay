"""
Audit Service Database Models
"""
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, Boolean, Text, Index
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from app.db import Base, SCHEMA


class AuditLog(Base):
    """
    Immutable audit log for all system actions
    Follows COAF (Brazilian Financial Activities Control Council) requirements
    """
    __tablename__ = "audit_logs"
    __table_args__ = (
        Index('ix_audit_service_timestamp', 'service_name', 'timestamp'),
        Index('ix_audit_actor_timestamp', 'actor_id', 'timestamp'),
        Index('ix_audit_resource', 'resource_type', 'resource_id'),
        Index('ix_audit_action', 'action'),
        Index('ix_audit_request_id', 'request_id'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

    # Source identification
    service_name: Mapped[str] = mapped_column(String(64), index=True)
    request_id: Mapped[str] = mapped_column(String(64), nullable=True)

    # Action details
    action: Mapped[str] = mapped_column(String(64), index=True)
    resource_type: Mapped[str] = mapped_column(String(64), index=True)
    resource_id: Mapped[str] = mapped_column(String(128), index=True)

    # Actor (who performed the action)
    actor_id: Mapped[str] = mapped_column(String(128), index=True)
    actor_type: Mapped[str] = mapped_column(String(32))  # USER, SYSTEM, ADMIN, API

    # Result
    result: Mapped[str] = mapped_column(String(32))  # SUCCESS, FAILURE, PENDING, BLOCKED

    # Request context
    ip_address: Mapped[str] = mapped_column(String(45), nullable=True)  # IPv6 max length
    user_agent: Mapped[str] = mapped_column(String(512), nullable=True)

    # Additional data (hashed/redacted for sensitive info)
    payload_hash: Mapped[str] = mapped_column(String(64), nullable=True)  # SHA-256 of payload
    metadata: Mapped[dict] = mapped_column(JSONB, default=dict)

    # Compliance fields
    coaf_reference: Mapped[str] = mapped_column(String(64), nullable=True)
    retention_until: Mapped[datetime] = mapped_column(DateTime, nullable=True)


class SecurityEvent(Base):
    """
    Security-specific events (failed logins, suspicious activity, etc.)
    """
    __tablename__ = "security_events"
    __table_args__ = (
        Index('ix_security_type_timestamp', 'event_type', 'timestamp'),
        Index('ix_security_severity', 'severity'),
        Index('ix_security_resolved', 'resolved'),
        {"schema": SCHEMA}
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

    # Event classification
    event_type: Mapped[str] = mapped_column(String(64), index=True)
    severity: Mapped[str] = mapped_column(String(16), index=True)  # LOW, MEDIUM, HIGH, CRITICAL

    # Source
    service_name: Mapped[str] = mapped_column(String(64))
    source_ip: Mapped[str] = mapped_column(String(45), nullable=True)
    user_id: Mapped[str] = mapped_column(String(128), nullable=True, index=True)

    # Description
    description: Mapped[str] = mapped_column(Text)
    metadata: Mapped[dict] = mapped_column(JSONB, default=dict)

    # Resolution
    resolved: Mapped[bool] = mapped_column(Boolean, default=False)
    resolved_by: Mapped[str] = mapped_column(String(128), nullable=True)
    resolved_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    resolution_notes: Mapped[str] = mapped_column(Text, nullable=True)


class AuditReport(Base):
    """
    Generated compliance reports
    """
    __tablename__ = "audit_reports"
    __table_args__ = {"schema": SCHEMA}

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    report_type: Mapped[str] = mapped_column(String(64), index=True)  # DAILY, WEEKLY, MONTHLY, COAF
    report_date: Mapped[datetime] = mapped_column(DateTime, index=True)
    generated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    generated_by: Mapped[str] = mapped_column(String(128))

    # Report content
    parameters: Mapped[dict] = mapped_column(JSONB, default=dict)
    summary: Mapped[dict] = mapped_column(JSONB, default=dict)
    file_path: Mapped[str] = mapped_column(String(512), nullable=True)

    # Status
    status: Mapped[str] = mapped_column(String(32), default="GENERATED")  # GENERATED, SUBMITTED, ACKNOWLEDGED
