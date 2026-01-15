"""
Athena Compliance Service
AML/KYC rules engine, transaction monitoring, and regulatory reporting
Compliant with BACEN, COAF, and international AML standards
"""
from fastapi import FastAPI, HTTPException, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from decimal import Decimal
import uuid
import time
import re
import os
import httpx

from app.db import SessionLocal, ensure_schema
from app.models import (
    AMLRule, AMLAlert, SanctionsList, TransactionLimit,
    CustomerRiskProfile, TransactionCheck
)

# Initialize database
ensure_schema()

# Seed default limits if not exists
def seed_default_limits():
    """Create default transaction limits"""
    with SessionLocal() as session:
        existing = session.query(TransactionLimit).first()
        if existing:
            return

        defaults = [
            # PF (Individual) limits by KYC level
            {"customer_type": "PF", "kyc_level": 0, "transaction_type": "ALL",
             "daily": 500, "monthly": 2000, "per_tx": 200, "approval": None},
            {"customer_type": "PF", "kyc_level": 1, "transaction_type": "ALL",
             "daily": 5000, "monthly": 20000, "per_tx": 2000, "approval": 1500},
            {"customer_type": "PF", "kyc_level": 2, "transaction_type": "ALL",
             "daily": 20000, "monthly": 100000, "per_tx": 10000, "approval": 5000},
            {"customer_type": "PF", "kyc_level": 3, "transaction_type": "ALL",
             "daily": 100000, "monthly": 500000, "per_tx": 50000, "approval": 20000},

            # PJ (Company) limits by KYC level
            {"customer_type": "PJ", "kyc_level": 0, "transaction_type": "ALL",
             "daily": 2000, "monthly": 10000, "per_tx": 1000, "approval": None},
            {"customer_type": "PJ", "kyc_level": 1, "transaction_type": "ALL",
             "daily": 20000, "monthly": 100000, "per_tx": 10000, "approval": 5000},
            {"customer_type": "PJ", "kyc_level": 2, "transaction_type": "ALL",
             "daily": 100000, "monthly": 500000, "per_tx": 50000, "approval": 20000},
            {"customer_type": "PJ", "kyc_level": 3, "transaction_type": "ALL",
             "daily": 500000, "monthly": 2000000, "per_tx": 200000, "approval": 100000},
        ]

        for d in defaults:
            limit = TransactionLimit(
                id=str(uuid.uuid4()),
                customer_type=d["customer_type"],
                kyc_level=d["kyc_level"],
                transaction_type=d["transaction_type"],
                daily_limit=Decimal(str(d["daily"])),
                monthly_limit=Decimal(str(d["monthly"])),
                per_transaction_limit=Decimal(str(d["per_tx"])),
                requires_approval_above=Decimal(str(d["approval"])) if d["approval"] else None
            )
            session.add(limit)

        session.commit()

def seed_default_rules():
    """Create default AML rules"""
    with SessionLocal() as session:
        existing = session.query(AMLRule).first()
        if existing:
            return

        rules = [
            {
                "name": "High Value Transaction",
                "description": "Transactions above R$ 10,000 require review",
                "rule_type": "AMOUNT",
                "conditions": {"min_amount": 10000},
                "action": "ALERT",
                "severity": "MEDIUM"
            },
            {
                "name": "Very High Value Transaction",
                "description": "Transactions above R$ 50,000 are blocked for review",
                "rule_type": "AMOUNT",
                "conditions": {"min_amount": 50000},
                "action": "MANUAL_REVIEW",
                "severity": "HIGH"
            },
            {
                "name": "Velocity Check - Hourly",
                "description": "More than 10 transactions per hour triggers alert",
                "rule_type": "VELOCITY",
                "conditions": {"max_transactions": 10, "period_minutes": 60},
                "action": "ALERT",
                "severity": "MEDIUM"
            },
            {
                "name": "Velocity Check - Daily",
                "description": "More than 50 transactions per day triggers review",
                "rule_type": "VELOCITY",
                "conditions": {"max_transactions": 50, "period_minutes": 1440},
                "action": "MANUAL_REVIEW",
                "severity": "HIGH"
            },
            {
                "name": "Structuring Detection",
                "description": "Multiple transactions just below R$ 10,000",
                "rule_type": "PATTERN",
                "conditions": {"amount_range": [8000, 9999], "min_count": 3, "period_hours": 24},
                "action": "ALERT",
                "severity": "HIGH"
            },
            {
                "name": "PEP Transaction",
                "description": "Any transaction involving PEP requires logging",
                "rule_type": "PEP",
                "conditions": {},
                "action": "LOG",
                "severity": "MEDIUM"
            },
            {
                "name": "Sanctions Match",
                "description": "Block transactions with sanctioned entities",
                "rule_type": "SANCTIONS",
                "conditions": {},
                "action": "BLOCK",
                "severity": "CRITICAL"
            },
        ]

        for r in rules:
            rule = AMLRule(
                id=str(uuid.uuid4()),
                name=r["name"],
                description=r["description"],
                rule_type=r["rule_type"],
                conditions=r["conditions"],
                action=r["action"],
                severity=r["severity"],
                is_active=True
            )
            session.add(rule)

        session.commit()

# Initialize defaults
seed_default_limits()
seed_default_rules()

app = FastAPI(
    title="Athena Compliance Service",
    description="AML/KYC rules engine and transaction monitoring",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Service URLs
CUSTOMER_SERVICE_URL = os.getenv("CUSTOMER_SERVICE_URL", "http://customer-service:8080")
AUDIT_SERVICE_URL = os.getenv("AUDIT_SERVICE_URL", "http://audit-service:8080")


# ============ Request/Response Models ============

class TransactionCheckRequest(BaseModel):
    customer_id: str
    transaction_type: str  # PIX, TED, DOC, CARD, BOLETO, etc.
    amount: str  # String to handle Decimal
    currency: str = "BRL"
    recipient_id: Optional[str] = None
    recipient_document: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    source_service: str = "unknown"


class TransactionCheckResponse(BaseModel):
    decision: str  # APPROVED, MANUAL_REVIEW, BLOCKED, ALERT
    risk_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    alerts: List[str]
    limits: Dict[str, Any]
    message: str
    reference_id: str


class CustomerScreenRequest(BaseModel):
    customer_id: str
    document: str
    name: str
    check_pep: bool = True
    check_sanctions: bool = True
    source_service: str = "unknown"


class AlertResponse(BaseModel):
    id: str
    rule_id: str
    customer_id: str
    alert_type: str
    severity: str
    status: str
    details: Dict[str, Any]
    created_at: datetime
    sar_filed: bool


class LimitResponse(BaseModel):
    customer_type: str
    kyc_level: int
    transaction_type: str
    daily_limit: float
    monthly_limit: float
    per_transaction_limit: float
    requires_approval_above: Optional[float]


class RuleCreate(BaseModel):
    name: str
    description: str
    rule_type: str
    conditions: Dict[str, Any]
    action: str
    severity: str


class AlertReview(BaseModel):
    status: str  # RESOLVED, FALSE_POSITIVE, REPORTED
    resolution_notes: str
    resolved_by: str


class SARFiling(BaseModel):
    sar_reference: str
    filed_by: str
    notes: Optional[str] = None


# ============ Health Check ============

@app.get("/health")
async def health():
    return {"ok": True, "service": "compliance-service", "version": "1.0.0"}


# ============ Transaction Compliance Check ============

@app.post("/compliance/check/transaction", response_model=TransactionCheckResponse)
def check_transaction(request: TransactionCheckRequest):
    """
    Pre-transaction compliance check
    Returns decision (APPROVED, MANUAL_REVIEW, BLOCKED, ALERT)
    """
    start_time = time.time()
    check_id = str(uuid.uuid4())
    amount = Decimal(request.amount)
    alerts_triggered = []
    risk_level = "LOW"
    decision = "APPROVED"

    with SessionLocal() as session:
        # Get customer risk profile
        risk_profile = session.get(CustomerRiskProfile, request.customer_id)

        # Check if customer is blocked
        if risk_profile and risk_profile.is_blocked:
            return TransactionCheckResponse(
                decision="BLOCKED",
                risk_level="CRITICAL",
                alerts=["Customer account is blocked"],
                limits={},
                message=risk_profile.block_reason or "Account blocked by compliance",
                reference_id=check_id
            )

        # Check sanctions match
        if risk_profile and risk_profile.sanctions_match:
            return TransactionCheckResponse(
                decision="BLOCKED",
                risk_level="CRITICAL",
                alerts=["Sanctions list match"],
                limits={},
                message="Transaction blocked due to sanctions screening",
                reference_id=check_id
            )

        # Get transaction limits
        # First try to get customer info for type and KYC level
        customer_type = "PF"
        kyc_level = 0
        try:
            async_client = httpx.Client(timeout=5.0)
            resp = async_client.get(f"{CUSTOMER_SERVICE_URL}/customers/{request.customer_id}")
            if resp.status_code == 200:
                customer_data = resp.json()
                customer_type = customer_data.get("person_type", "PF")
                kyc_level = customer_data.get("kyc_level", 0)
            async_client.close()
        except Exception:
            pass  # Use defaults

        # Get limits
        limits = session.query(TransactionLimit).filter(
            TransactionLimit.customer_type == customer_type,
            TransactionLimit.kyc_level == kyc_level,
            TransactionLimit.transaction_type.in_([request.transaction_type, "ALL"]),
            TransactionLimit.is_active == True
        ).first()

        if not limits:
            # Use most restrictive defaults
            limits_dict = {
                "daily_limit": 500,
                "monthly_limit": 2000,
                "per_transaction_limit": 200,
                "requires_approval_above": None
            }
        else:
            limits_dict = {
                "daily_limit": float(limits.daily_limit),
                "monthly_limit": float(limits.monthly_limit),
                "per_transaction_limit": float(limits.per_transaction_limit),
                "requires_approval_above": float(limits.requires_approval_above) if limits.requires_approval_above else None
            }

        # Check per-transaction limit
        if amount > Decimal(str(limits_dict["per_transaction_limit"])):
            alerts_triggered.append(f"Amount exceeds per-transaction limit of R$ {limits_dict['per_transaction_limit']}")
            risk_level = "MEDIUM"
            decision = "BLOCKED"

        # Check approval threshold
        if limits_dict["requires_approval_above"] and amount > Decimal(str(limits_dict["requires_approval_above"])):
            alerts_triggered.append(f"Amount exceeds approval threshold of R$ {limits_dict['requires_approval_above']}")
            if decision != "BLOCKED":
                decision = "MANUAL_REVIEW"
            risk_level = "MEDIUM"

        # Run AML rules
        rules = session.query(AMLRule).filter(AMLRule.is_active == True).all()

        for rule in rules:
            triggered, alert_msg = _evaluate_rule(rule, amount, request, session)
            if triggered:
                alerts_triggered.append(alert_msg)

                # Update decision based on rule action
                if rule.action == "BLOCK" and decision not in ["BLOCKED"]:
                    decision = "BLOCKED"
                elif rule.action == "MANUAL_REVIEW" and decision not in ["BLOCKED", "MANUAL_REVIEW"]:
                    decision = "MANUAL_REVIEW"
                elif rule.action == "ALERT" and decision not in ["BLOCKED", "MANUAL_REVIEW"]:
                    decision = "ALERT"

                # Update risk level
                if rule.severity == "CRITICAL":
                    risk_level = "CRITICAL"
                elif rule.severity == "HIGH" and risk_level not in ["CRITICAL"]:
                    risk_level = "HIGH"
                elif rule.severity == "MEDIUM" and risk_level not in ["CRITICAL", "HIGH"]:
                    risk_level = "MEDIUM"

                # Create alert record
                if rule.action in ["ALERT", "MANUAL_REVIEW", "BLOCK"]:
                    alert = AMLAlert(
                        id=str(uuid.uuid4()),
                        rule_id=rule.id,
                        customer_id=request.customer_id,
                        transaction_id=check_id,
                        alert_type=rule.rule_type,
                        severity=rule.severity,
                        status="OPEN",
                        details={
                            "rule_name": rule.name,
                            "amount": str(amount),
                            "transaction_type": request.transaction_type,
                            "alert_message": alert_msg
                        },
                        risk_score=_calculate_risk_score(rule.severity)
                    )
                    session.add(alert)

        # Check PEP status
        if risk_profile and risk_profile.is_pep:
            alerts_triggered.append("Customer is a PEP (Politically Exposed Person)")
            if risk_level == "LOW":
                risk_level = "MEDIUM"

        # Check enhanced monitoring
        if risk_profile and risk_profile.enhanced_monitoring:
            alerts_triggered.append("Customer under enhanced monitoring")

        # Record the check
        response_time = int((time.time() - start_time) * 1000)
        check_record = TransactionCheck(
            id=check_id,
            customer_id=request.customer_id,
            transaction_type=request.transaction_type,
            amount=amount,
            currency=request.currency,
            decision=decision,
            risk_level=risk_level,
            alerts_triggered=alerts_triggered,
            source_service=request.source_service,
            response_time_ms=response_time
        )
        session.add(check_record)
        session.commit()

        # Build message
        if decision == "APPROVED":
            message = "Transaction approved"
        elif decision == "ALERT":
            message = "Transaction approved with alerts"
        elif decision == "MANUAL_REVIEW":
            message = "Transaction requires manual review"
        else:
            message = "Transaction blocked by compliance"

        return TransactionCheckResponse(
            decision=decision,
            risk_level=risk_level,
            alerts=alerts_triggered,
            limits=limits_dict,
            message=message,
            reference_id=check_id
        )


def _evaluate_rule(rule: AMLRule, amount: Decimal, request: TransactionCheckRequest, session) -> tuple:
    """
    Evaluate a single AML rule
    Returns (triggered: bool, message: str)
    """
    conditions = rule.conditions

    if rule.rule_type == "AMOUNT":
        min_amount = Decimal(str(conditions.get("min_amount", 0)))
        if amount >= min_amount:
            return True, f"{rule.name}: Amount R$ {amount} exceeds threshold R$ {min_amount}"

    elif rule.rule_type == "VELOCITY":
        # Check transaction velocity
        max_transactions = conditions.get("max_transactions", 10)
        period_minutes = conditions.get("period_minutes", 60)
        cutoff = datetime.utcnow() - timedelta(minutes=period_minutes)

        count = session.query(TransactionCheck).filter(
            TransactionCheck.customer_id == request.customer_id,
            TransactionCheck.checked_at >= cutoff
        ).count()

        if count >= max_transactions:
            return True, f"{rule.name}: {count} transactions in {period_minutes} minutes"

    elif rule.rule_type == "PATTERN":
        # Check for structuring patterns
        amount_range = conditions.get("amount_range", [0, float('inf')])
        min_count = conditions.get("min_count", 3)
        period_hours = conditions.get("period_hours", 24)
        cutoff = datetime.utcnow() - timedelta(hours=period_hours)

        pattern_count = session.query(TransactionCheck).filter(
            TransactionCheck.customer_id == request.customer_id,
            TransactionCheck.checked_at >= cutoff,
            TransactionCheck.amount >= Decimal(str(amount_range[0])),
            TransactionCheck.amount <= Decimal(str(amount_range[1]))
        ).count()

        if pattern_count >= min_count - 1:  # -1 because current tx not yet saved
            return True, f"{rule.name}: Potential structuring detected ({pattern_count + 1} transactions)"

    elif rule.rule_type == "PEP":
        # Check PEP status
        risk_profile = session.get(CustomerRiskProfile, request.customer_id)
        if risk_profile and risk_profile.is_pep:
            return True, f"{rule.name}: PEP transaction logged"

    elif rule.rule_type == "SANCTIONS":
        # Check sanctions
        risk_profile = session.get(CustomerRiskProfile, request.customer_id)
        if risk_profile and risk_profile.sanctions_match:
            return True, f"{rule.name}: Sanctions match"

    return False, ""


def _calculate_risk_score(severity: str) -> int:
    """Calculate risk score from severity"""
    scores = {
        "LOW": 25,
        "MEDIUM": 50,
        "HIGH": 75,
        "CRITICAL": 100
    }
    return scores.get(severity, 50)


# ============ Customer Screening ============

@app.post("/compliance/check/customer")
def screen_customer(request: CustomerScreenRequest):
    """
    Screen customer against PEP and sanctions lists
    """
    check_id = str(uuid.uuid4())
    alerts = []
    risk_level = "LOW"
    decision = "APPROVED"

    # Normalize name for matching
    name_normalized = _normalize_name(request.name)

    with SessionLocal() as session:
        # Get or create risk profile
        risk_profile = session.get(CustomerRiskProfile, request.customer_id)
        if not risk_profile:
            risk_profile = CustomerRiskProfile(
                customer_id=request.customer_id,
                risk_level="LOW",
                risk_score=0
            )
            session.add(risk_profile)

        # Check sanctions list
        if request.check_sanctions:
            sanctions_matches = session.query(SanctionsList).filter(
                SanctionsList.is_active == True,
                SanctionsList.list_type.in_(["OFAC", "UN", "EU", "COAF", "INTERNAL"])
            ).all()

            for sanction in sanctions_matches:
                if _fuzzy_name_match(name_normalized, sanction.name_normalized):
                    alerts.append(f"Potential sanctions match: {sanction.list_type} - {sanction.name}")
                    risk_level = "CRITICAL"
                    decision = "BLOCKED"
                    risk_profile.sanctions_match = True
                    risk_profile.sanctions_details = {
                        "list_type": sanction.list_type,
                        "matched_name": sanction.name,
                        "reason": sanction.reason
                    }
                    break

                if request.document and sanction.document:
                    doc_clean = re.sub(r'[^0-9]', '', request.document)
                    sanction_doc_clean = re.sub(r'[^0-9]', '', sanction.document)
                    if doc_clean == sanction_doc_clean:
                        alerts.append(f"Document match on sanctions list: {sanction.list_type}")
                        risk_level = "CRITICAL"
                        decision = "BLOCKED"
                        risk_profile.sanctions_match = True
                        break

        # Check PEP list
        if request.check_pep:
            pep_matches = session.query(SanctionsList).filter(
                SanctionsList.is_active == True,
                SanctionsList.list_type == "COAF_PEP"
            ).all()

            for pep in pep_matches:
                if _fuzzy_name_match(name_normalized, pep.name_normalized):
                    alerts.append(f"PEP match: {pep.name}")
                    if risk_level not in ["CRITICAL"]:
                        risk_level = "MEDIUM"
                    if decision not in ["BLOCKED"]:
                        decision = "ALERT"
                    risk_profile.is_pep = True
                    risk_profile.pep_details = {
                        "matched_name": pep.name,
                        "reason": pep.reason
                    }
                    break

        # Update risk profile
        risk_profile.risk_level = risk_level
        risk_profile.risk_score = _calculate_risk_score(risk_level)
        risk_profile.last_assessment = datetime.utcnow()

        if risk_level in ["HIGH", "CRITICAL"]:
            risk_profile.enhanced_monitoring = True

        session.commit()

        return {
            "decision": decision,
            "risk_level": risk_level,
            "alerts": alerts,
            "limits": {},
            "message": "Customer screening complete",
            "reference_id": check_id
        }


def _normalize_name(name: str) -> str:
    """Normalize name for matching"""
    import unicodedata
    # Remove accents
    normalized = unicodedata.normalize('NFKD', name)
    normalized = ''.join(c for c in normalized if not unicodedata.combining(c))
    # Lowercase and remove extra spaces
    normalized = ' '.join(normalized.lower().split())
    return normalized


def _fuzzy_name_match(name1: str, name2: str, threshold: float = 0.85) -> bool:
    """Simple fuzzy name matching"""
    if not name1 or not name2:
        return False

    # Exact match
    if name1 == name2:
        return True

    # Check if one contains the other
    if name1 in name2 or name2 in name1:
        return True

    # Simple Jaccard similarity on words
    words1 = set(name1.split())
    words2 = set(name2.split())

    if not words1 or not words2:
        return False

    intersection = len(words1 & words2)
    union = len(words1 | words2)

    similarity = intersection / union if union > 0 else 0
    return similarity >= threshold


# ============ Limits Management ============

@app.get("/compliance/limits/{customer_type}/{kyc_level}", response_model=LimitResponse)
def get_limits(customer_type: str, kyc_level: int, transaction_type: str = "ALL"):
    """
    Get transaction limits for customer type and KYC level
    """
    with SessionLocal() as session:
        limits = session.query(TransactionLimit).filter(
            TransactionLimit.customer_type == customer_type.upper(),
            TransactionLimit.kyc_level == kyc_level,
            TransactionLimit.transaction_type.in_([transaction_type, "ALL"]),
            TransactionLimit.is_active == True
        ).first()

        if not limits:
            raise HTTPException(status_code=404, detail="Limits not found")

        return LimitResponse(
            customer_type=limits.customer_type,
            kyc_level=limits.kyc_level,
            transaction_type=limits.transaction_type,
            daily_limit=float(limits.daily_limit),
            monthly_limit=float(limits.monthly_limit),
            per_transaction_limit=float(limits.per_transaction_limit),
            requires_approval_above=float(limits.requires_approval_above) if limits.requires_approval_above else None
        )


@app.post("/compliance/limits")
def create_limit(
    customer_type: str,
    kyc_level: int,
    transaction_type: str,
    daily_limit: float,
    monthly_limit: float,
    per_transaction_limit: float,
    requires_approval_above: Optional[float] = None
):
    """
    Create or update transaction limits
    """
    with SessionLocal() as session:
        # Check if exists
        existing = session.query(TransactionLimit).filter(
            TransactionLimit.customer_type == customer_type.upper(),
            TransactionLimit.kyc_level == kyc_level,
            TransactionLimit.transaction_type == transaction_type
        ).first()

        if existing:
            existing.daily_limit = Decimal(str(daily_limit))
            existing.monthly_limit = Decimal(str(monthly_limit))
            existing.per_transaction_limit = Decimal(str(per_transaction_limit))
            existing.requires_approval_above = Decimal(str(requires_approval_above)) if requires_approval_above else None
            existing.updated_at = datetime.utcnow()
        else:
            limit = TransactionLimit(
                id=str(uuid.uuid4()),
                customer_type=customer_type.upper(),
                kyc_level=kyc_level,
                transaction_type=transaction_type,
                daily_limit=Decimal(str(daily_limit)),
                monthly_limit=Decimal(str(monthly_limit)),
                per_transaction_limit=Decimal(str(per_transaction_limit)),
                requires_approval_above=Decimal(str(requires_approval_above)) if requires_approval_above else None
            )
            session.add(limit)

        session.commit()
        return {"status": "ok", "message": "Limits saved"}


# ============ Alerts Management ============

@app.get("/compliance/alerts", response_model=List[AlertResponse])
def list_alerts(
    status: Optional[str] = None,
    severity: Optional[str] = None,
    customer_id: Optional[str] = None,
    limit: int = Query(default=100, le=500),
    offset: int = Query(default=0, ge=0)
):
    """
    List AML alerts
    """
    with SessionLocal() as session:
        query = session.query(AMLAlert)

        if status:
            query = query.filter(AMLAlert.status == status)
        if severity:
            query = query.filter(AMLAlert.severity == severity)
        if customer_id:
            query = query.filter(AMLAlert.customer_id == customer_id)

        alerts = query.order_by(AMLAlert.created_at.desc()).offset(offset).limit(limit).all()

        return [
            AlertResponse(
                id=a.id,
                rule_id=a.rule_id,
                customer_id=a.customer_id,
                alert_type=a.alert_type,
                severity=a.severity,
                status=a.status,
                details=a.details,
                created_at=a.created_at,
                sar_filed=a.sar_filed
            )
            for a in alerts
        ]


@app.put("/compliance/alerts/{alert_id}/review")
def review_alert(alert_id: str, review: AlertReview):
    """
    Review and resolve an AML alert
    """
    with SessionLocal() as session:
        alert = session.get(AMLAlert, alert_id)
        if not alert:
            raise HTTPException(status_code=404, detail="Alert not found")

        alert.status = review.status
        alert.resolution_notes = review.resolution_notes
        alert.resolved_by = review.resolved_by
        alert.resolved_at = datetime.utcnow()

        session.commit()

        return {"status": "ok", "alert_id": alert_id, "new_status": review.status}


@app.post("/compliance/alerts/{alert_id}/sar")
def file_sar(alert_id: str, sar: SARFiling):
    """
    File a SAR (Suspicious Activity Report) for an alert
    """
    with SessionLocal() as session:
        alert = session.get(AMLAlert, alert_id)
        if not alert:
            raise HTTPException(status_code=404, detail="Alert not found")

        alert.sar_filed = True
        alert.sar_reference = sar.sar_reference
        alert.sar_filed_at = datetime.utcnow()
        alert.status = "REPORTED"
        alert.resolution_notes = f"SAR filed: {sar.sar_reference}. {sar.notes or ''}"
        alert.resolved_by = sar.filed_by

        session.commit()

        return {
            "status": "ok",
            "alert_id": alert_id,
            "sar_reference": sar.sar_reference,
            "filed_at": alert.sar_filed_at.isoformat()
        }


# ============ Rules Management ============

@app.get("/compliance/rules")
def list_rules(active_only: bool = True):
    """
    List AML rules
    """
    with SessionLocal() as session:
        query = session.query(AMLRule)
        if active_only:
            query = query.filter(AMLRule.is_active == True)

        rules = query.all()

        return [
            {
                "id": r.id,
                "name": r.name,
                "description": r.description,
                "rule_type": r.rule_type,
                "conditions": r.conditions,
                "action": r.action,
                "severity": r.severity,
                "is_active": r.is_active
            }
            for r in rules
        ]


@app.post("/compliance/rules")
def create_rule(rule: RuleCreate):
    """
    Create a new AML rule
    """
    with SessionLocal() as session:
        new_rule = AMLRule(
            id=str(uuid.uuid4()),
            name=rule.name,
            description=rule.description,
            rule_type=rule.rule_type,
            conditions=rule.conditions,
            action=rule.action,
            severity=rule.severity,
            is_active=True
        )
        session.add(new_rule)
        session.commit()

        return {"status": "ok", "rule_id": new_rule.id}


@app.put("/compliance/rules/{rule_id}")
def update_rule(rule_id: str, rule: RuleCreate):
    """
    Update an existing AML rule
    """
    with SessionLocal() as session:
        existing = session.get(AMLRule, rule_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Rule not found")

        existing.name = rule.name
        existing.description = rule.description
        existing.rule_type = rule.rule_type
        existing.conditions = rule.conditions
        existing.action = rule.action
        existing.severity = rule.severity
        existing.updated_at = datetime.utcnow()

        session.commit()

        return {"status": "ok", "rule_id": rule_id}


@app.delete("/compliance/rules/{rule_id}")
def deactivate_rule(rule_id: str):
    """
    Deactivate an AML rule (soft delete)
    """
    with SessionLocal() as session:
        rule = session.get(AMLRule, rule_id)
        if not rule:
            raise HTTPException(status_code=404, detail="Rule not found")

        rule.is_active = False
        rule.updated_at = datetime.utcnow()
        session.commit()

        return {"status": "ok", "rule_id": rule_id, "is_active": False}


# ============ Sanctions Management ============

@app.post("/compliance/sanctions/add")
def add_to_sanctions(
    list_type: str,
    name: str,
    document: Optional[str] = None,
    country: Optional[str] = None,
    reason: Optional[str] = None
):
    """
    Add entry to internal sanctions/watchlist
    """
    with SessionLocal() as session:
        entry = SanctionsList(
            id=str(uuid.uuid4()),
            list_type=list_type,
            name=name,
            name_normalized=_normalize_name(name),
            document=document,
            country=country,
            reason=reason,
            is_active=True
        )
        session.add(entry)
        session.commit()

        return {"status": "ok", "entry_id": entry.id}


@app.get("/compliance/sanctions")
def list_sanctions(list_type: Optional[str] = None, limit: int = 100):
    """
    List sanctions entries
    """
    with SessionLocal() as session:
        query = session.query(SanctionsList).filter(SanctionsList.is_active == True)
        if list_type:
            query = query.filter(SanctionsList.list_type == list_type)

        entries = query.limit(limit).all()

        return [
            {
                "id": e.id,
                "list_type": e.list_type,
                "name": e.name,
                "document": e.document,
                "country": e.country,
                "reason": e.reason,
                "added_at": e.added_at.isoformat()
            }
            for e in entries
        ]


# ============ Reports ============

@app.get("/compliance/reports/coaf")
def generate_coaf_report(
    start_date: datetime,
    end_date: datetime
):
    """
    Generate COAF-compliant report
    """
    with SessionLocal() as session:
        from sqlalchemy import func

        # Get alerts in period
        alerts = session.query(AMLAlert).filter(
            AMLAlert.created_at >= start_date,
            AMLAlert.created_at <= end_date
        ).all()

        # Get transaction checks
        checks = session.query(TransactionCheck).filter(
            TransactionCheck.checked_at >= start_date,
            TransactionCheck.checked_at <= end_date
        ).all()

        # Get SARs filed
        sars = session.query(AMLAlert).filter(
            AMLAlert.sar_filed == True,
            AMLAlert.sar_filed_at >= start_date,
            AMLAlert.sar_filed_at <= end_date
        ).all()

        # Summary by severity
        by_severity = {}
        for alert in alerts:
            by_severity[alert.severity] = by_severity.get(alert.severity, 0) + 1

        # Summary by decision
        by_decision = {}
        for check in checks:
            by_decision[check.decision] = by_decision.get(check.decision, 0) + 1

        return {
            "report_type": "COAF",
            "period": {
                "start": start_date.isoformat(),
                "end": end_date.isoformat()
            },
            "generated_at": datetime.utcnow().isoformat(),
            "summary": {
                "total_alerts": len(alerts),
                "alerts_by_severity": by_severity,
                "total_transaction_checks": len(checks),
                "checks_by_decision": by_decision,
                "sars_filed": len(sars)
            },
            "alerts": [
                {
                    "id": a.id,
                    "type": a.alert_type,
                    "severity": a.severity,
                    "status": a.status,
                    "customer_id": a.customer_id,
                    "created_at": a.created_at.isoformat()
                }
                for a in alerts[:100]  # Limit to 100 in response
            ]
        }
