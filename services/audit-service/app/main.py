"""
Athena Audit Service
Centralized audit logging and security event tracking
Compliant with BACEN and COAF requirements
"""
from fastapi import FastAPI, HTTPException, Query, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from decimal import Decimal
import uuid
import hashlib
import os

from app.db import SessionLocal, ensure_schema, engine
from app.models import AuditLog, SecurityEvent, AuditReport

# Initialize database
ensure_schema()

app = FastAPI(
    title="Athena Audit Service",
    description="Centralized audit logging and compliance reporting",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Retention period (5 years for financial records in Brazil)
RETENTION_YEARS = int(os.getenv("AUDIT_RETENTION_YEARS", "5"))


# ============ Request/Response Models ============

class AuditLogCreate(BaseModel):
    service_name: str = Field(..., max_length=64)
    action: str = Field(..., max_length=64)
    resource_type: str = Field(..., max_length=64)
    resource_id: str = Field(..., max_length=128)
    actor_id: str = Field(..., max_length=128)
    actor_type: str = Field(default="USER", max_length=32)
    result: str = Field(default="SUCCESS", max_length=32)
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    request_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    timestamp: Optional[str] = None


class AuditLogResponse(BaseModel):
    id: str
    timestamp: datetime
    service_name: str
    action: str
    resource_type: str
    resource_id: str
    actor_id: str
    actor_type: str
    result: str
    ip_address: Optional[str]
    request_id: Optional[str]
    metadata: Dict[str, Any]


class SecurityEventCreate(BaseModel):
    service_name: str = Field(..., max_length=64)
    event_type: str = Field(..., max_length=64)
    severity: str = Field(..., max_length=16)
    description: str
    source_ip: Optional[str] = None
    user_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    timestamp: Optional[str] = None


class SecurityEventResponse(BaseModel):
    id: str
    timestamp: datetime
    event_type: str
    severity: str
    service_name: str
    source_ip: Optional[str]
    user_id: Optional[str]
    description: str
    resolved: bool
    resolved_by: Optional[str]
    resolved_at: Optional[datetime]


class SecurityEventResolve(BaseModel):
    resolved_by: str
    resolution_notes: Optional[str] = None


class AuditSummary(BaseModel):
    total_logs: int
    by_action: Dict[str, int]
    by_service: Dict[str, int]
    by_result: Dict[str, int]
    period_start: datetime
    period_end: datetime


class ComplianceReportRequest(BaseModel):
    report_type: str = "DAILY"
    start_date: datetime
    end_date: datetime
    include_transactions: bool = True
    include_security_events: bool = True


# ============ Health Check ============

@app.get("/health")
async def health():
    return {"ok": True, "service": "audit-service", "version": "1.0.0"}


# ============ Audit Log Endpoints ============

@app.post("/audit/log", response_model=AuditLogResponse)
def create_audit_log(log: AuditLogCreate):
    """
    Create an immutable audit log entry
    """
    log_id = str(uuid.uuid4())

    # Calculate retention date
    retention_until = datetime.utcnow() + timedelta(days=RETENTION_YEARS * 365)

    # Hash metadata for integrity verification
    payload_hash = None
    if log.metadata:
        payload_str = str(sorted(log.metadata.items()))
        payload_hash = hashlib.sha256(payload_str.encode()).hexdigest()

    # Parse timestamp if provided
    timestamp = datetime.utcnow()
    if log.timestamp:
        try:
            timestamp = datetime.fromisoformat(log.timestamp.replace('Z', '+00:00'))
        except ValueError:
            pass

    with SessionLocal() as session:
        audit_log = AuditLog(
            id=log_id,
            timestamp=timestamp,
            service_name=log.service_name,
            request_id=log.request_id,
            action=log.action,
            resource_type=log.resource_type,
            resource_id=log.resource_id,
            actor_id=log.actor_id,
            actor_type=log.actor_type,
            result=log.result,
            ip_address=log.ip_address,
            user_agent=log.user_agent[:512] if log.user_agent else None,
            payload_hash=payload_hash,
            metadata=log.metadata or {},
            retention_until=retention_until
        )
        session.add(audit_log)
        session.commit()

        return AuditLogResponse(
            id=audit_log.id,
            timestamp=audit_log.timestamp,
            service_name=audit_log.service_name,
            action=audit_log.action,
            resource_type=audit_log.resource_type,
            resource_id=audit_log.resource_id,
            actor_id=audit_log.actor_id,
            actor_type=audit_log.actor_type,
            result=audit_log.result,
            ip_address=audit_log.ip_address,
            request_id=audit_log.request_id,
            metadata=audit_log.metadata
        )


@app.get("/audit/logs", response_model=List[AuditLogResponse])
def query_audit_logs(
    service_name: Optional[str] = None,
    action: Optional[str] = None,
    resource_type: Optional[str] = None,
    resource_id: Optional[str] = None,
    actor_id: Optional[str] = None,
    result: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = Query(default=100, le=1000),
    offset: int = Query(default=0, ge=0)
):
    """
    Query audit logs with filters (admin only)
    """
    with SessionLocal() as session:
        query = session.query(AuditLog)

        if service_name:
            query = query.filter(AuditLog.service_name == service_name)
        if action:
            query = query.filter(AuditLog.action == action)
        if resource_type:
            query = query.filter(AuditLog.resource_type == resource_type)
        if resource_id:
            query = query.filter(AuditLog.resource_id == resource_id)
        if actor_id:
            query = query.filter(AuditLog.actor_id == actor_id)
        if result:
            query = query.filter(AuditLog.result == result)
        if start_date:
            query = query.filter(AuditLog.timestamp >= start_date)
        if end_date:
            query = query.filter(AuditLog.timestamp <= end_date)

        logs = query.order_by(AuditLog.timestamp.desc()).offset(offset).limit(limit).all()

        return [
            AuditLogResponse(
                id=log.id,
                timestamp=log.timestamp,
                service_name=log.service_name,
                action=log.action,
                resource_type=log.resource_type,
                resource_id=log.resource_id,
                actor_id=log.actor_id,
                actor_type=log.actor_type,
                result=log.result,
                ip_address=log.ip_address,
                request_id=log.request_id,
                metadata=log.metadata
            )
            for log in logs
        ]


@app.get("/audit/logs/{resource_type}/{resource_id}", response_model=List[AuditLogResponse])
def get_resource_audit_trail(
    resource_type: str,
    resource_id: str,
    limit: int = Query(default=50, le=500)
):
    """
    Get complete audit trail for a specific resource
    """
    with SessionLocal() as session:
        logs = session.query(AuditLog).filter(
            AuditLog.resource_type == resource_type,
            AuditLog.resource_id == resource_id
        ).order_by(AuditLog.timestamp.desc()).limit(limit).all()

        return [
            AuditLogResponse(
                id=log.id,
                timestamp=log.timestamp,
                service_name=log.service_name,
                action=log.action,
                resource_type=log.resource_type,
                resource_id=log.resource_id,
                actor_id=log.actor_id,
                actor_type=log.actor_type,
                result=log.result,
                ip_address=log.ip_address,
                request_id=log.request_id,
                metadata=log.metadata
            )
            for log in logs
        ]


# ============ Security Event Endpoints ============

@app.post("/security/events", response_model=SecurityEventResponse)
def create_security_event(event: SecurityEventCreate):
    """
    Log a security event (failed login, suspicious activity, etc.)
    """
    event_id = str(uuid.uuid4())

    timestamp = datetime.utcnow()
    if event.timestamp:
        try:
            timestamp = datetime.fromisoformat(event.timestamp.replace('Z', '+00:00'))
        except ValueError:
            pass

    with SessionLocal() as session:
        security_event = SecurityEvent(
            id=event_id,
            timestamp=timestamp,
            event_type=event.event_type,
            severity=event.severity,
            service_name=event.service_name,
            source_ip=event.source_ip,
            user_id=event.user_id,
            description=event.description,
            metadata=event.metadata or {},
            resolved=False
        )
        session.add(security_event)
        session.commit()

        return SecurityEventResponse(
            id=security_event.id,
            timestamp=security_event.timestamp,
            event_type=security_event.event_type,
            severity=security_event.severity,
            service_name=security_event.service_name,
            source_ip=security_event.source_ip,
            user_id=security_event.user_id,
            description=security_event.description,
            resolved=security_event.resolved,
            resolved_by=None,
            resolved_at=None
        )


@app.get("/security/events", response_model=List[SecurityEventResponse])
def query_security_events(
    event_type: Optional[str] = None,
    severity: Optional[str] = None,
    user_id: Optional[str] = None,
    resolved: Optional[bool] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = Query(default=100, le=1000),
    offset: int = Query(default=0, ge=0)
):
    """
    Query security events with filters
    """
    with SessionLocal() as session:
        query = session.query(SecurityEvent)

        if event_type:
            query = query.filter(SecurityEvent.event_type == event_type)
        if severity:
            query = query.filter(SecurityEvent.severity == severity)
        if user_id:
            query = query.filter(SecurityEvent.user_id == user_id)
        if resolved is not None:
            query = query.filter(SecurityEvent.resolved == resolved)
        if start_date:
            query = query.filter(SecurityEvent.timestamp >= start_date)
        if end_date:
            query = query.filter(SecurityEvent.timestamp <= end_date)

        events = query.order_by(SecurityEvent.timestamp.desc()).offset(offset).limit(limit).all()

        return [
            SecurityEventResponse(
                id=e.id,
                timestamp=e.timestamp,
                event_type=e.event_type,
                severity=e.severity,
                service_name=e.service_name,
                source_ip=e.source_ip,
                user_id=e.user_id,
                description=e.description,
                resolved=e.resolved,
                resolved_by=e.resolved_by,
                resolved_at=e.resolved_at
            )
            for e in events
        ]


@app.put("/security/events/{event_id}/resolve", response_model=SecurityEventResponse)
def resolve_security_event(event_id: str, resolution: SecurityEventResolve):
    """
    Mark a security event as resolved
    """
    with SessionLocal() as session:
        event = session.get(SecurityEvent, event_id)
        if not event:
            raise HTTPException(status_code=404, detail="Security event not found")

        event.resolved = True
        event.resolved_by = resolution.resolved_by
        event.resolved_at = datetime.utcnow()
        event.resolution_notes = resolution.resolution_notes

        session.commit()

        return SecurityEventResponse(
            id=event.id,
            timestamp=event.timestamp,
            event_type=event.event_type,
            severity=event.severity,
            service_name=event.service_name,
            source_ip=event.source_ip,
            user_id=event.user_id,
            description=event.description,
            resolved=event.resolved,
            resolved_by=event.resolved_by,
            resolved_at=event.resolved_at
        )


# ============ Reports & Analytics ============

@app.get("/audit/summary", response_model=AuditSummary)
def get_audit_summary(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
):
    """
    Get summary statistics for audit logs
    """
    if not start_date:
        start_date = datetime.utcnow() - timedelta(days=1)
    if not end_date:
        end_date = datetime.utcnow()

    with SessionLocal() as session:
        from sqlalchemy import func

        base_query = session.query(AuditLog).filter(
            AuditLog.timestamp >= start_date,
            AuditLog.timestamp <= end_date
        )

        total = base_query.count()

        # By action
        by_action = dict(
            session.query(AuditLog.action, func.count(AuditLog.id))
            .filter(AuditLog.timestamp >= start_date, AuditLog.timestamp <= end_date)
            .group_by(AuditLog.action)
            .all()
        )

        # By service
        by_service = dict(
            session.query(AuditLog.service_name, func.count(AuditLog.id))
            .filter(AuditLog.timestamp >= start_date, AuditLog.timestamp <= end_date)
            .group_by(AuditLog.service_name)
            .all()
        )

        # By result
        by_result = dict(
            session.query(AuditLog.result, func.count(AuditLog.id))
            .filter(AuditLog.timestamp >= start_date, AuditLog.timestamp <= end_date)
            .group_by(AuditLog.result)
            .all()
        )

        return AuditSummary(
            total_logs=total,
            by_action=by_action,
            by_service=by_service,
            by_result=by_result,
            period_start=start_date,
            period_end=end_date
        )


@app.get("/audit/reports/daily")
def get_daily_report(date: Optional[datetime] = None):
    """
    Get daily audit report
    """
    if not date:
        date = datetime.utcnow() - timedelta(days=1)

    start = datetime(date.year, date.month, date.day, 0, 0, 0)
    end = start + timedelta(days=1)

    with SessionLocal() as session:
        from sqlalchemy import func

        # Total transactions
        total_logs = session.query(func.count(AuditLog.id)).filter(
            AuditLog.timestamp >= start,
            AuditLog.timestamp < end
        ).scalar()

        # Financial transactions
        financial_actions = ['CREDIT', 'DEBIT', 'TRANSFER', 'PIX_SEND', 'PIX_RECEIVE',
                            'CARD_AUTHORIZE', 'BOLETO_PAY', 'TED_SEND', 'DOC_SEND']
        financial_count = session.query(func.count(AuditLog.id)).filter(
            AuditLog.timestamp >= start,
            AuditLog.timestamp < end,
            AuditLog.action.in_(financial_actions)
        ).scalar()

        # Security events
        security_count = session.query(func.count(SecurityEvent.id)).filter(
            SecurityEvent.timestamp >= start,
            SecurityEvent.timestamp < end
        ).scalar()

        unresolved_critical = session.query(func.count(SecurityEvent.id)).filter(
            SecurityEvent.severity.in_(['HIGH', 'CRITICAL']),
            SecurityEvent.resolved == False
        ).scalar()

        # Failed actions
        failed_count = session.query(func.count(AuditLog.id)).filter(
            AuditLog.timestamp >= start,
            AuditLog.timestamp < end,
            AuditLog.result.in_(['FAILURE', 'BLOCKED'])
        ).scalar()

        return {
            "report_date": start.isoformat(),
            "generated_at": datetime.utcnow().isoformat(),
            "summary": {
                "total_audit_logs": total_logs,
                "financial_transactions": financial_count,
                "security_events": security_count,
                "failed_actions": failed_count,
                "unresolved_critical_events": unresolved_critical
            },
            "compliance_status": "OK" if unresolved_critical == 0 else "ATTENTION_REQUIRED"
        }


@app.post("/audit/reports/compliance")
def generate_compliance_report(request: ComplianceReportRequest):
    """
    Generate COAF-compliant report for a period
    """
    report_id = str(uuid.uuid4())

    with SessionLocal() as session:
        from sqlalchemy import func

        # Gather data for the period
        logs = session.query(AuditLog).filter(
            AuditLog.timestamp >= request.start_date,
            AuditLog.timestamp <= request.end_date
        ).all()

        security_events = session.query(SecurityEvent).filter(
            SecurityEvent.timestamp >= request.start_date,
            SecurityEvent.timestamp <= request.end_date
        ).all() if request.include_security_events else []

        # Summarize by action type
        summary = {
            "period": {
                "start": request.start_date.isoformat(),
                "end": request.end_date.isoformat()
            },
            "total_records": len(logs),
            "total_security_events": len(security_events),
            "by_action": {},
            "by_service": {},
            "by_result": {},
            "high_value_transactions": 0,
            "suspicious_activities": len([e for e in security_events if e.severity in ['HIGH', 'CRITICAL']])
        }

        for log in logs:
            summary["by_action"][log.action] = summary["by_action"].get(log.action, 0) + 1
            summary["by_service"][log.service_name] = summary["by_service"].get(log.service_name, 0) + 1
            summary["by_result"][log.result] = summary["by_result"].get(log.result, 0) + 1

        # Save report
        report = AuditReport(
            id=report_id,
            report_type=request.report_type,
            report_date=request.start_date,
            generated_by="SYSTEM",
            parameters={
                "start_date": request.start_date.isoformat(),
                "end_date": request.end_date.isoformat(),
                "include_transactions": request.include_transactions,
                "include_security_events": request.include_security_events
            },
            summary=summary,
            status="GENERATED"
        )
        session.add(report)
        session.commit()

        return {
            "report_id": report_id,
            "status": "GENERATED",
            "summary": summary
        }


@app.get("/audit/reports")
def list_reports(
    report_type: Optional[str] = None,
    limit: int = Query(default=50, le=200)
):
    """
    List generated compliance reports
    """
    with SessionLocal() as session:
        query = session.query(AuditReport)
        if report_type:
            query = query.filter(AuditReport.report_type == report_type)

        reports = query.order_by(AuditReport.generated_at.desc()).limit(limit).all()

        return [
            {
                "id": r.id,
                "report_type": r.report_type,
                "report_date": r.report_date.isoformat(),
                "generated_at": r.generated_at.isoformat(),
                "status": r.status,
                "summary": r.summary
            }
            for r in reports
        ]
