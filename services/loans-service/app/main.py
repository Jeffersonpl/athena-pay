"""
Athena Loans Service - Credit Engine
Complete credit scoring, loan management, and AI integration
"""
from fastapi import FastAPI, HTTPException, BackgroundTasks, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict
from datetime import datetime, timedelta, date
from decimal import Decimal
import uuid
import os
import httpx

from app.db import SessionLocal, ensure_schema
from app.models import (
    CreditScore, CreditLimit, LoanApplication, Loan,
    LoanInstallment, LoanPayment, LoanProduct, ScoreHistory
)
from app.scoring.engine import (
    CreditScoringEngine, AccountData, ScoreResult,
    get_rate_for_band, calculate_loan_terms
)
from app.ai.athena_client import AthenaClient

# Initialize database
ensure_schema()

# Environment
ENV = os.getenv("ENV", "dev")
ACCOUNTS_URL = os.getenv("ACCOUNTS_URL", "http://accounts-service:8080")
AUDIT_URL = os.getenv("AUDIT_URL", "http://audit-service:8080")
COMPLIANCE_URL = os.getenv("COMPLIANCE_URL", "http://compliance-service:8080")

# Services
scoring_engine = CreditScoringEngine()
athena_client = AthenaClient()

app = FastAPI(
    title="Athena Loans Service",
    description="Credit Engine - Scoring, Loans, and AI-powered decisions",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# ==================== Pydantic Models ====================

class ScoreRequest(BaseModel):
    """Request score calculation"""
    customer_id: str
    account_id: Optional[str] = None
    include_ai_analysis: bool = False


class SimulationRequest(BaseModel):
    """Loan simulation request"""
    customer_id: str
    product_type: str = Field(..., pattern="^(PERSONAL_LOAN|CONSIGNADO|OVERDRAFT)$")
    amount: float = Field(..., gt=0)
    term_months: int = Field(..., ge=1, le=84)


class LoanApplicationRequest(BaseModel):
    """Loan application request"""
    customer_id: str
    account_id: str
    product_type: str = Field(..., pattern="^(PERSONAL_LOAN|CONSIGNADO|OVERDRAFT)$")
    amount: float = Field(..., gt=0)
    term_months: int = Field(..., ge=1, le=84)
    purpose: Optional[str] = None


class PaymentRequest(BaseModel):
    """Loan payment request"""
    amount: float = Field(..., gt=0)
    payment_source: str = Field(default="DEBIT")
    payment_reference: Optional[str] = None


class PrepaymentRequest(BaseModel):
    """Prepayment/early settlement request"""
    amount: Optional[float] = None  # None = full settlement
    apply_discount: bool = True


class LimitUpdateRequest(BaseModel):
    """Update credit limit"""
    approved_limit: float
    final_rate: float
    max_term_months: int


# ==================== Helper Functions ====================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_account_data(customer_id: str, account_id: str = None) -> AccountData:
    """Get account data for scoring from accounts service"""
    if ENV == "dev":
        # Return mock data for development
        return AccountData(
            customer_id=customer_id,
            account_id=account_id or f"ACC_{customer_id[:8]}",
            account_age_days=365,
            avg_monthly_balance=5000.0,
            min_monthly_balance=1000.0,
            max_monthly_balance=8000.0,
            total_income_30d=8000.0,
            total_expenses_30d=5000.0,
            income_sources=2,
            income_regularity=0.85,
            pix_received_30d=3000.0,
            pix_sent_30d=2000.0,
            wire_received_30d=5000.0,
            wire_sent_30d=1000.0,
            card_spending_30d=2000.0,
            loan_payments_ontime=12,
            loan_payments_late=1,
            overdraft_usage_days=0,
            has_negative_records=False,
            negative_records_amount=0,
            kyc_level=2,
            bureau_score=None
        )

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{ACCOUNTS_URL}/accounts/{account_id}/analytics",
                params={"customer_id": customer_id},
                timeout=10.0
            )
            if resp.status_code == 200:
                data = resp.json()
                return AccountData(
                    customer_id=customer_id,
                    account_id=account_id,
                    account_age_days=data.get("account_age_days", 0),
                    avg_monthly_balance=data.get("avg_monthly_balance", 0),
                    min_monthly_balance=data.get("min_monthly_balance", 0),
                    max_monthly_balance=data.get("max_monthly_balance", 0),
                    total_income_30d=data.get("total_income_30d", 0),
                    total_expenses_30d=data.get("total_expenses_30d", 0),
                    income_sources=data.get("income_sources", 0),
                    income_regularity=data.get("income_regularity", 0),
                    pix_received_30d=data.get("pix_received_30d", 0),
                    pix_sent_30d=data.get("pix_sent_30d", 0),
                    wire_received_30d=data.get("wire_received_30d", 0),
                    wire_sent_30d=data.get("wire_sent_30d", 0),
                    card_spending_30d=data.get("card_spending_30d", 0),
                    loan_payments_ontime=data.get("loan_payments_ontime", 0),
                    loan_payments_late=data.get("loan_payments_late", 0),
                    overdraft_usage_days=data.get("overdraft_usage_days", 0),
                    has_negative_records=data.get("has_negative_records", False),
                    negative_records_amount=data.get("negative_records_amount", 0),
                    kyc_level=data.get("kyc_level", 0),
                    bureau_score=data.get("bureau_score")
                )
    except Exception:
        pass

    # Return default data if service unavailable
    return await get_account_data(customer_id, account_id)  # Will use dev mode


async def disburse_loan(account_id: str, amount: float, loan_id: str) -> bool:
    """Credit loan amount to customer account"""
    if ENV == "dev":
        return True

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{ACCOUNTS_URL}/postings/credit",
                json={
                    "account_id": account_id,
                    "amount": amount,
                    "currency": "BRL",
                    "description": f"Loan disbursement - {loan_id}"
                },
                timeout=10.0
            )
            return resp.status_code == 200
    except Exception:
        return False


async def debit_loan_payment(account_id: str, amount: float, loan_id: str) -> bool:
    """Debit loan payment from customer account"""
    if ENV == "dev":
        return True

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{ACCOUNTS_URL}/postings/debit",
                json={
                    "account_id": account_id,
                    "amount": amount,
                    "currency": "BRL",
                    "description": f"Loan payment - {loan_id}"
                },
                timeout=10.0
            )
            return resp.status_code == 200
    except Exception:
        return False


async def audit_log(action: str, entity_type: str, entity_id: str, data: dict):
    """Send audit log"""
    if ENV == "dev":
        return

    try:
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{AUDIT_URL}/logs",
                json={
                    "action": action,
                    "entity_type": entity_type,
                    "entity_id": entity_id,
                    "data": data
                },
                timeout=5.0
            )
    except:
        pass


def get_or_create_product(product_type: str, db) -> LoanProduct:
    """Get or create loan product configuration"""
    product = db.query(LoanProduct).filter(LoanProduct.code == product_type).first()

    if not product:
        # Create default product configuration
        defaults = {
            "PERSONAL_LOAN": {
                "name": "Empréstimo Pessoal",
                "min_amount": 500,
                "max_amount": 100000,
                "min_term": 3,
                "max_term": 60,
                "rate_band_a": 0.015,
                "rate_band_b": 0.020,
                "rate_band_c": 0.028,
                "rate_band_d": 0.038,
                "rate_band_e": 0.050,
                "min_score": 350
            },
            "CONSIGNADO": {
                "name": "Empréstimo Consignado",
                "min_amount": 1000,
                "max_amount": 500000,
                "min_term": 6,
                "max_term": 84,
                "rate_band_a": 0.010,
                "rate_band_b": 0.012,
                "rate_band_c": 0.015,
                "rate_band_d": 0.020,
                "rate_band_e": 0.025,
                "min_score": 300
            },
            "OVERDRAFT": {
                "name": "Cheque Especial",
                "min_amount": 100,
                "max_amount": 50000,
                "min_term": 1,
                "max_term": 12,
                "rate_band_a": 0.030,
                "rate_band_b": 0.040,
                "rate_band_c": 0.050,
                "rate_band_d": 0.070,
                "rate_band_e": 0.100,
                "min_score": 400
            }
        }

        config = defaults.get(product_type, defaults["PERSONAL_LOAN"])

        product = LoanProduct(
            id=str(uuid.uuid4()),
            code=product_type,
            name=config["name"],
            min_amount=config["min_amount"],
            max_amount=config["max_amount"],
            min_term=config["min_term"],
            max_term=config["max_term"],
            rate_band_a=config["rate_band_a"],
            rate_band_b=config["rate_band_b"],
            rate_band_c=config["rate_band_c"],
            rate_band_d=config["rate_band_d"],
            rate_band_e=config["rate_band_e"],
            min_score=config["min_score"]
        )
        db.add(product)
        db.commit()
        db.refresh(product)

    return product


def generate_contract_number() -> str:
    """Generate unique contract number"""
    timestamp = datetime.utcnow().strftime("%Y%m%d")
    random_part = uuid.uuid4().hex[:8].upper()
    return f"LOAN{timestamp}{random_part}"


# ==================== Credit Score Endpoints ====================

@app.post("/credit/score")
async def calculate_score(
    request: ScoreRequest,
    background_tasks: BackgroundTasks,
    db=Depends(get_db)
):
    """
    Calculate credit score for customer.

    Returns score 0-1000 with band classification (A-E).
    """
    # Get account data
    account_data = await get_account_data(request.customer_id, request.account_id)

    # Calculate score
    score_result = scoring_engine.calculate_score(account_data)

    # Store score
    score_record = CreditScore(
        id=str(uuid.uuid4()),
        customer_id=request.customer_id,
        account_id=request.account_id,
        score=score_result.score,
        score_band=score_result.band,
        risk_level=score_result.risk_level,
        factors=score_result.factors,
        calculation_source="INTERNAL",
        valid_until=score_result.valid_until
    )
    db.add(score_record)
    db.commit()
    db.refresh(score_record)

    # Store detailed history for audit
    history = ScoreHistory(
        id=str(uuid.uuid4()),
        score_id=score_record.id,
        customer_id=request.customer_id,
        input_data={
            "account_age_days": account_data.account_age_days,
            "avg_monthly_balance": account_data.avg_monthly_balance,
            "total_income_30d": account_data.total_income_30d,
            "kyc_level": account_data.kyc_level
        },
        factor_scores={k: v["score"] for k, v in score_result.factors.items()},
        weights_used=scoring_engine.WEIGHTS,
        final_calculation={
            "score": score_result.score,
            "band": score_result.band,
            "risk_level": score_result.risk_level
        }
    )
    db.add(history)
    db.commit()

    # Get AI analysis if requested
    ai_analysis = None
    if request.include_ai_analysis:
        ai_analysis = await athena_client.analyze_credit_profile(
            request.customer_id,
            {"score": score_result.score},
            [],
            score_result.score
        )

    # Audit log
    background_tasks.add_task(
        audit_log,
        "SCORE_CALCULATED",
        "credit_score",
        score_record.id,
        {"score": score_result.score, "band": score_result.band}
    )

    response = {
        "score_id": score_record.id,
        "score": score_result.score,
        "band": score_result.band,
        "risk_level": score_result.risk_level,
        "factors": {
            k: {
                "score": v["score"],
                "weight": v["weight"],
                "description": v["description"]
            }
            for k, v in score_result.factors.items()
        },
        "recommendations": score_result.recommendations,
        "valid_until": score_result.valid_until.isoformat(),
        "calculated_at": datetime.utcnow().isoformat()
    }

    if ai_analysis:
        response["ai_analysis"] = {
            "confidence": ai_analysis.confidence,
            "risk_assessment": ai_analysis.risk_assessment,
            "recommended_limit": ai_analysis.recommended_limit,
            "insights": ai_analysis.insights,
            "fraud_risk": ai_analysis.fraud_risk
        }

    return response


@app.get("/credit/score/{customer_id}")
async def get_customer_score(customer_id: str, db=Depends(get_db)):
    """Get latest credit score for customer"""
    score = db.query(CreditScore).filter(
        CreditScore.customer_id == customer_id,
        CreditScore.valid_until >= datetime.utcnow()
    ).order_by(CreditScore.calculated_at.desc()).first()

    if not score:
        raise HTTPException(status_code=404, detail="No valid score found. Request a new score calculation.")

    return {
        "score_id": score.id,
        "score": score.score,
        "band": score.score_band,
        "risk_level": score.risk_level,
        "factors": score.factors,
        "calculated_at": score.calculated_at.isoformat(),
        "valid_until": score.valid_until.isoformat()
    }


@app.get("/credit/score/{customer_id}/history")
async def get_score_history(
    customer_id: str,
    limit: int = Query(default=10, le=50),
    db=Depends(get_db)
):
    """Get score history for customer"""
    scores = db.query(CreditScore).filter(
        CreditScore.customer_id == customer_id
    ).order_by(CreditScore.calculated_at.desc()).limit(limit).all()

    return {
        "scores": [
            {
                "score_id": s.id,
                "score": s.score,
                "band": s.score_band,
                "risk_level": s.risk_level,
                "calculated_at": s.calculated_at.isoformat()
            }
            for s in scores
        ]
    }


# ==================== Credit Limit Endpoints ====================

@app.get("/credit/limits/{customer_id}")
async def get_credit_limits(customer_id: str, db=Depends(get_db)):
    """Get all credit limits for customer"""
    limits = db.query(CreditLimit).filter(
        CreditLimit.customer_id == customer_id,
        CreditLimit.status == "ACTIVE"
    ).all()

    return {
        "limits": [
            {
                "id": l.id,
                "product_type": l.product_type,
                "approved_limit": float(l.approved_limit),
                "available_limit": float(l.available_limit),
                "used_limit": float(l.used_limit),
                "base_rate": l.base_rate,
                "final_rate": l.final_rate,
                "max_term_months": l.max_term_months,
                "approved_at": l.approved_at.isoformat(),
                "expires_at": l.expires_at.isoformat() if l.expires_at else None
            }
            for l in limits
        ]
    }


@app.post("/credit/limits/{customer_id}/{product_type}")
async def create_or_update_limit(
    customer_id: str,
    product_type: str,
    db=Depends(get_db)
):
    """Create or update credit limit based on current score"""
    # Get latest score
    score = db.query(CreditScore).filter(
        CreditScore.customer_id == customer_id,
        CreditScore.valid_until >= datetime.utcnow()
    ).order_by(CreditScore.calculated_at.desc()).first()

    if not score:
        raise HTTPException(status_code=400, detail="No valid score. Request score calculation first.")

    # Get product configuration
    product = get_or_create_product(product_type, db)

    # Check minimum score
    if score.score < product.min_score:
        raise HTTPException(
            status_code=400,
            detail=f"Score {score.score} below minimum {product.min_score} for {product_type}"
        )

    # Calculate limit based on score and band
    band_multipliers = {"A": 1.0, "B": 0.7, "C": 0.5, "D": 0.3, "E": 0.1}
    multiplier = band_multipliers.get(score.score_band, 0.1)

    approved_limit = product.max_amount * multiplier
    approved_limit = max(approved_limit, product.min_amount)

    # Get rate for band
    rate_map = {
        "A": product.rate_band_a,
        "B": product.rate_band_b,
        "C": product.rate_band_c,
        "D": product.rate_band_d,
        "E": product.rate_band_e,
    }
    final_rate = rate_map.get(score.score_band, product.rate_band_e)

    # Check for existing limit
    existing = db.query(CreditLimit).filter(
        CreditLimit.customer_id == customer_id,
        CreditLimit.product_type == product_type,
        CreditLimit.status == "ACTIVE"
    ).first()

    if existing:
        existing.approved_limit = approved_limit
        existing.available_limit = approved_limit - float(existing.used_limit)
        existing.base_rate = product.rate_band_c  # Base rate
        existing.final_rate = final_rate
        existing.score_at_approval = score.score
        existing.expires_at = datetime.utcnow() + timedelta(days=365)
        db.commit()
        limit_id = existing.id
    else:
        limit = CreditLimit(
            id=str(uuid.uuid4()),
            customer_id=customer_id,
            product_type=product_type,
            approved_limit=approved_limit,
            available_limit=approved_limit,
            used_limit=0,
            base_rate=product.rate_band_c,
            final_rate=final_rate,
            max_term_months=product.max_term,
            min_amount=product.min_amount,
            max_amount=product.max_amount,
            score_id=score.id,
            score_at_approval=score.score,
            expires_at=datetime.utcnow() + timedelta(days=365)
        )
        db.add(limit)
        db.commit()
        limit_id = limit.id

    return {
        "limit_id": limit_id,
        "product_type": product_type,
        "approved_limit": approved_limit,
        "final_rate": final_rate,
        "max_term_months": product.max_term,
        "based_on_score": score.score,
        "score_band": score.score_band
    }


# ==================== Loan Simulation Endpoints ====================

@app.post("/loans/simulate")
async def simulate_loan(request: SimulationRequest, db=Depends(get_db)):
    """
    Simulate loan terms without applying.

    Returns payment schedule and total costs.
    """
    # Get latest score
    score = db.query(CreditScore).filter(
        CreditScore.customer_id == request.customer_id,
        CreditScore.valid_until >= datetime.utcnow()
    ).order_by(CreditScore.calculated_at.desc()).first()

    if not score:
        # Calculate new score
        account_data = await get_account_data(request.customer_id)
        score_result = scoring_engine.calculate_score(account_data)
        score_value = score_result.score
        score_band = score_result.band
    else:
        score_value = score.score
        score_band = score.score_band

    # Get product configuration
    product = get_or_create_product(request.product_type, db)

    # Validate amount and term
    if request.amount < float(product.min_amount):
        raise HTTPException(
            status_code=400,
            detail=f"Minimum amount is R$ {product.min_amount}"
        )
    if request.amount > float(product.max_amount):
        raise HTTPException(
            status_code=400,
            detail=f"Maximum amount is R$ {product.max_amount}"
        )
    if request.term_months < product.min_term:
        raise HTTPException(
            status_code=400,
            detail=f"Minimum term is {product.min_term} months"
        )
    if request.term_months > product.max_term:
        raise HTTPException(
            status_code=400,
            detail=f"Maximum term is {product.max_term} months"
        )

    # Get rate for band
    rate_map = {
        "A": product.rate_band_a,
        "B": product.rate_band_b,
        "C": product.rate_band_c,
        "D": product.rate_band_d,
        "E": product.rate_band_e,
    }
    monthly_rate = rate_map.get(score_band, product.rate_band_e)

    # Check minimum score
    eligible = score_value >= product.min_score
    if not eligible:
        return {
            "eligible": False,
            "reason": f"Score {score_value} below minimum {product.min_score}",
            "score": score_value,
            "score_band": score_band
        }

    # Calculate loan terms
    terms = calculate_loan_terms(
        principal=request.amount,
        monthly_rate=monthly_rate,
        term_months=request.term_months,
        iof_daily=product.iof_daily,
        iof_additional=product.iof_additional
    )

    return {
        "eligible": True,
        "score": score_value,
        "score_band": score_band,
        "product": product.name,
        "simulation": {
            "requested_amount": request.amount,
            "term_months": request.term_months,
            "monthly_rate": monthly_rate,
            "annual_rate": terms["annual_rate"],
            "monthly_payment": terms["monthly_payment"],
            "total_amount": terms["total_amount"],
            "total_interest": terms["total_interest"],
            "iof_amount": terms["iof_amount"],
            "cet": terms["cet"],
            "first_payment_date": (datetime.utcnow() + timedelta(days=30)).date().isoformat()
        },
        "schedule_preview": terms["schedule"][:3]  # First 3 installments
    }


# ==================== Loan Application Endpoints ====================

@app.post("/loans/apply")
async def apply_for_loan(
    request: LoanApplicationRequest,
    background_tasks: BackgroundTasks,
    db=Depends(get_db)
):
    """
    Apply for a loan.

    Application will be analyzed and approved/rejected.
    """
    # Get or calculate score
    score = db.query(CreditScore).filter(
        CreditScore.customer_id == request.customer_id,
        CreditScore.valid_until >= datetime.utcnow()
    ).order_by(CreditScore.calculated_at.desc()).first()

    if not score:
        # Calculate new score
        account_data = await get_account_data(request.customer_id, request.account_id)
        score_result = scoring_engine.calculate_score(account_data)

        score = CreditScore(
            id=str(uuid.uuid4()),
            customer_id=request.customer_id,
            account_id=request.account_id,
            score=score_result.score,
            score_band=score_result.band,
            risk_level=score_result.risk_level,
            factors=score_result.factors,
            calculation_source="INTERNAL",
            valid_until=score_result.valid_until
        )
        db.add(score)
        db.commit()

    # Get product configuration
    product = get_or_create_product(request.product_type, db)

    # Validate request
    if request.amount < float(product.min_amount):
        raise HTTPException(status_code=400, detail=f"Minimum amount is R$ {product.min_amount}")
    if request.amount > float(product.max_amount):
        raise HTTPException(status_code=400, detail=f"Maximum amount is R$ {product.max_amount}")
    if request.term_months < product.min_term or request.term_months > product.max_term:
        raise HTTPException(status_code=400, detail=f"Term must be {product.min_term}-{product.max_term} months")

    # Check minimum score
    if score.score < product.min_score:
        application = LoanApplication(
            id=str(uuid.uuid4()),
            customer_id=request.customer_id,
            account_id=request.account_id,
            product_type=request.product_type,
            requested_amount=request.amount,
            requested_term=request.term_months,
            purpose=request.purpose,
            score_id=score.id,
            score_value=score.score,
            status="REJECTED",
            rejection_reasons={
                "reasons": [f"Score {score.score} below minimum {product.min_score}"]
            },
            analyzed_at=datetime.utcnow()
        )
        db.add(application)
        db.commit()

        return {
            "application_id": application.id,
            "status": "REJECTED",
            "reasons": application.rejection_reasons["reasons"]
        }

    # Get AI decision
    ai_decision = await athena_client.evaluate_loan_application(
        request.customer_id,
        {"requested_amount": request.amount, "term_months": request.term_months},
        score.score,
        {}
    )

    # Determine approval
    if not ai_decision.approved:
        application = LoanApplication(
            id=str(uuid.uuid4()),
            customer_id=request.customer_id,
            account_id=request.account_id,
            product_type=request.product_type,
            requested_amount=request.amount,
            requested_term=request.term_months,
            purpose=request.purpose,
            score_id=score.id,
            score_value=score.score,
            status="REJECTED",
            rejection_reasons={"reasons": ai_decision.reasons},
            analysis_result={"ai_confidence": ai_decision.confidence},
            analyzed_at=datetime.utcnow()
        )
        db.add(application)
        db.commit()

        return {
            "application_id": application.id,
            "status": "REJECTED",
            "reasons": ai_decision.reasons
        }

    # Calculate approved terms
    approved_amount = min(request.amount, ai_decision.approved_amount or request.amount)
    monthly_rate = ai_decision.approved_rate or get_rate_for_band(
        score.score_band,
        {
            "rate_band_a": product.rate_band_a,
            "rate_band_b": product.rate_band_b,
            "rate_band_c": product.rate_band_c,
            "rate_band_d": product.rate_band_d,
            "rate_band_e": product.rate_band_e,
        }
    )

    # Calculate loan terms
    terms = calculate_loan_terms(
        principal=approved_amount,
        monthly_rate=monthly_rate,
        term_months=request.term_months,
        iof_daily=product.iof_daily,
        iof_additional=product.iof_additional
    )

    # Create approved application
    application = LoanApplication(
        id=str(uuid.uuid4()),
        customer_id=request.customer_id,
        account_id=request.account_id,
        product_type=request.product_type,
        requested_amount=request.amount,
        requested_term=request.term_months,
        purpose=request.purpose,
        approved_amount=approved_amount,
        approved_term=request.term_months,
        approved_rate=monthly_rate,
        monthly_payment=terms["monthly_payment"],
        total_amount=terms["total_amount"],
        iof_amount=terms["iof_amount"],
        cet=terms["cet"],
        score_id=score.id,
        score_value=score.score,
        analysis_result={
            "ai_confidence": ai_decision.confidence,
            "fraud_score": ai_decision.fraud_score
        },
        status="APPROVED",
        analyzed_at=datetime.utcnow(),
        expires_at=datetime.utcnow() + timedelta(days=7)  # Approval valid for 7 days
    )
    db.add(application)
    db.commit()
    db.refresh(application)

    # Audit log
    background_tasks.add_task(
        audit_log,
        "LOAN_APPROVED",
        "loan_application",
        application.id,
        {"amount": approved_amount, "term": request.term_months}
    )

    return {
        "application_id": application.id,
        "status": "APPROVED",
        "approved_amount": approved_amount,
        "approved_term": request.term_months,
        "monthly_rate": monthly_rate,
        "monthly_payment": terms["monthly_payment"],
        "total_amount": terms["total_amount"],
        "iof_amount": terms["iof_amount"],
        "cet": terms["cet"],
        "expires_at": application.expires_at.isoformat(),
        "message": "Proposta aprovada! Confirme para liberar o crédito."
    }


@app.post("/loans/applications/{application_id}/confirm")
async def confirm_loan(
    application_id: str,
    background_tasks: BackgroundTasks,
    db=Depends(get_db)
):
    """
    Confirm approved loan application and disburse funds.
    """
    application = db.query(LoanApplication).filter(
        LoanApplication.id == application_id
    ).first()

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    if application.status != "APPROVED":
        raise HTTPException(
            status_code=400,
            detail=f"Cannot confirm application with status {application.status}"
        )

    if application.expires_at and application.expires_at < datetime.utcnow():
        application.status = "EXPIRED"
        db.commit()
        raise HTTPException(status_code=400, detail="Application has expired")

    # Create loan contract
    contract_number = generate_contract_number()
    first_due = datetime.utcnow() + timedelta(days=30)

    loan = Loan(
        id=str(uuid.uuid4()),
        contract_number=contract_number,
        application_id=application.id,
        customer_id=application.customer_id,
        account_id=application.account_id,
        product_type=application.product_type,
        principal_amount=application.approved_amount,
        disbursed_amount=float(application.approved_amount) - float(application.iof_amount),
        term_months=application.approved_term,
        monthly_rate=application.approved_rate,
        annual_rate=((1 + application.approved_rate) ** 12 - 1) * 100,
        cet=application.cet,
        total_amount=application.total_amount,
        monthly_payment=application.monthly_payment,
        iof_amount=application.iof_amount,
        outstanding_balance=application.total_amount,
        first_due_date=first_due,
        last_due_date=first_due + timedelta(days=30 * (application.approved_term - 1)),
        next_due_date=first_due
    )
    db.add(loan)

    # Create installments
    terms = calculate_loan_terms(
        principal=float(application.approved_amount),
        monthly_rate=application.approved_rate,
        term_months=application.approved_term
    )

    for i, sched in enumerate(terms["schedule"], 1):
        due_date = first_due + timedelta(days=30 * (i - 1))
        installment = LoanInstallment(
            id=str(uuid.uuid4()),
            loan_id=loan.id,
            number=i,
            due_date=due_date,
            principal=sched["principal"],
            interest=sched["interest"],
            total_amount=sched["payment"]
        )
        db.add(installment)

    # Update application
    application.status = "DISBURSED"
    application.loan_id = loan.id

    db.commit()

    # Disburse funds
    disbursed = await disburse_loan(
        application.account_id,
        float(loan.disbursed_amount),
        loan.id
    )

    if not disbursed:
        # Rollback if disbursement fails
        loan.status = "CANCELLED"
        application.status = "APPROVED"
        application.loan_id = None
        db.commit()
        raise HTTPException(status_code=500, detail="Failed to disburse funds")

    # Audit log
    background_tasks.add_task(
        audit_log,
        "LOAN_DISBURSED",
        "loan",
        loan.id,
        {"amount": float(loan.disbursed_amount), "contract": contract_number}
    )

    return {
        "loan_id": loan.id,
        "contract_number": contract_number,
        "disbursed_amount": float(loan.disbursed_amount),
        "monthly_payment": float(loan.monthly_payment),
        "first_due_date": loan.first_due_date.date().isoformat(),
        "total_installments": loan.term_months,
        "message": "Empréstimo liberado! O valor foi creditado em sua conta."
    }


# ==================== Loan Management Endpoints ====================

@app.get("/loans/{loan_id}")
async def get_loan(loan_id: str, db=Depends(get_db)):
    """Get loan details"""
    loan = db.query(Loan).filter(Loan.id == loan_id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")

    installments = db.query(LoanInstallment).filter(
        LoanInstallment.loan_id == loan_id
    ).order_by(LoanInstallment.number).all()

    return {
        "id": loan.id,
        "contract_number": loan.contract_number,
        "product_type": loan.product_type,
        "status": loan.status,
        "principal_amount": float(loan.principal_amount),
        "disbursed_amount": float(loan.disbursed_amount),
        "total_amount": float(loan.total_amount),
        "outstanding_balance": float(loan.outstanding_balance),
        "paid_amount": float(loan.paid_amount),
        "term_months": loan.term_months,
        "monthly_rate": loan.monthly_rate,
        "monthly_payment": float(loan.monthly_payment),
        "cet": loan.cet,
        "paid_installments": loan.paid_installments,
        "first_due_date": loan.first_due_date.date().isoformat(),
        "next_due_date": loan.next_due_date.date().isoformat() if loan.next_due_date else None,
        "overdue_amount": float(loan.overdue_amount),
        "overdue_days": loan.overdue_days,
        "disbursed_at": loan.disbursed_at.isoformat(),
        "installments": [
            {
                "number": i.number,
                "due_date": i.due_date.date().isoformat(),
                "total_amount": float(i.total_amount),
                "principal": float(i.principal),
                "interest": float(i.interest),
                "status": i.status,
                "paid_amount": float(i.paid_amount) if i.paid_amount else None,
                "paid_at": i.paid_at.isoformat() if i.paid_at else None
            }
            for i in installments
        ]
    }


@app.get("/loans")
async def list_loans(
    customer_id: str,
    status: Optional[str] = None,
    limit: int = Query(default=20, le=50),
    offset: int = 0,
    db=Depends(get_db)
):
    """List loans for customer"""
    query = db.query(Loan).filter(Loan.customer_id == customer_id)

    if status:
        query = query.filter(Loan.status == status)

    total = query.count()
    loans = query.order_by(Loan.disbursed_at.desc()).offset(offset).limit(limit).all()

    return {
        "loans": [
            {
                "id": l.id,
                "contract_number": l.contract_number,
                "product_type": l.product_type,
                "status": l.status,
                "principal_amount": float(l.principal_amount),
                "outstanding_balance": float(l.outstanding_balance),
                "monthly_payment": float(l.monthly_payment),
                "next_due_date": l.next_due_date.date().isoformat() if l.next_due_date else None,
                "overdue_amount": float(l.overdue_amount)
            }
            for l in loans
        ],
        "total": total,
        "limit": limit,
        "offset": offset
    }


@app.get("/loans/{loan_id}/installments")
async def get_installments(loan_id: str, db=Depends(get_db)):
    """Get loan installments"""
    loan = db.query(Loan).filter(Loan.id == loan_id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")

    installments = db.query(LoanInstallment).filter(
        LoanInstallment.loan_id == loan_id
    ).order_by(LoanInstallment.number).all()

    return {
        "loan_id": loan_id,
        "contract_number": loan.contract_number,
        "installments": [
            {
                "id": i.id,
                "number": i.number,
                "due_date": i.due_date.date().isoformat(),
                "principal": float(i.principal),
                "interest": float(i.interest),
                "fees": float(i.fees),
                "total_amount": float(i.total_amount),
                "late_fee": float(i.late_fee),
                "total_with_late": float(i.total_with_late) if i.total_with_late else float(i.total_amount),
                "status": i.status,
                "overdue_days": i.overdue_days,
                "paid_amount": float(i.paid_amount) if i.paid_amount else None,
                "paid_at": i.paid_at.isoformat() if i.paid_at else None
            }
            for i in installments
        ]
    }


# ==================== Payment Endpoints ====================

@app.post("/loans/{loan_id}/pay")
async def pay_installment(
    loan_id: str,
    request: PaymentRequest,
    background_tasks: BackgroundTasks,
    db=Depends(get_db)
):
    """
    Pay loan installment(s).

    Automatically applies to oldest unpaid installment.
    """
    loan = db.query(Loan).filter(Loan.id == loan_id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")

    if loan.status not in ["ACTIVE"]:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot pay loan with status {loan.status}"
        )

    # Get next unpaid installment
    installment = db.query(LoanInstallment).filter(
        LoanInstallment.loan_id == loan_id,
        LoanInstallment.status.in_(["PENDING", "OVERDUE"])
    ).order_by(LoanInstallment.number).first()

    if not installment:
        raise HTTPException(status_code=400, detail="No pending installments")

    # Calculate amount with late fees
    amount_due = float(installment.total_amount)
    if installment.status == "OVERDUE":
        # Add late fee (2%) and daily interest
        late_fee = amount_due * 0.02
        daily_interest = amount_due * 0.001 * installment.overdue_days
        amount_due += late_fee + daily_interest
        installment.late_fee = late_fee
        installment.daily_interest = daily_interest
        installment.total_with_late = amount_due

    if request.amount < amount_due:
        raise HTTPException(
            status_code=400,
            detail=f"Payment amount R$ {request.amount} less than due R$ {amount_due:.2f}"
        )

    # Debit from account
    debit_success = await debit_loan_payment(
        loan.account_id,
        request.amount,
        loan.id
    )

    if not debit_success:
        raise HTTPException(status_code=400, detail="Payment failed - insufficient funds")

    # Record payment
    payment = LoanPayment(
        id=str(uuid.uuid4()),
        loan_id=loan.id,
        installment_id=installment.id,
        payment_type="REGULAR",
        amount=request.amount,
        principal_paid=installment.principal,
        interest_paid=installment.interest,
        fees_paid=installment.fees,
        late_fees_paid=float(installment.late_fee),
        payment_source=request.payment_source,
        payment_reference=request.payment_reference
    )
    db.add(payment)

    # Update installment
    installment.status = "PAID"
    installment.paid_amount = request.amount
    installment.paid_at = datetime.utcnow()

    # Update loan
    loan.paid_amount = float(loan.paid_amount) + request.amount
    loan.outstanding_balance = float(loan.outstanding_balance) - float(installment.total_amount)
    loan.paid_installments += 1

    # Find next installment
    next_installment = db.query(LoanInstallment).filter(
        LoanInstallment.loan_id == loan_id,
        LoanInstallment.status == "PENDING"
    ).order_by(LoanInstallment.number).first()

    if next_installment:
        loan.next_due_date = next_installment.due_date
    else:
        loan.next_due_date = None
        loan.status = "PAID_OFF"
        loan.paid_off_at = datetime.utcnow()

    db.commit()

    # Audit log
    background_tasks.add_task(
        audit_log,
        "LOAN_PAYMENT",
        "loan_payment",
        payment.id,
        {"loan_id": loan.id, "amount": request.amount, "installment": installment.number}
    )

    return {
        "payment_id": payment.id,
        "amount_paid": request.amount,
        "installment_number": installment.number,
        "remaining_installments": loan.term_months - loan.paid_installments,
        "outstanding_balance": float(loan.outstanding_balance),
        "loan_status": loan.status,
        "next_due_date": loan.next_due_date.date().isoformat() if loan.next_due_date else None
    }


@app.post("/loans/{loan_id}/prepay")
async def prepay_loan(
    loan_id: str,
    request: PrepaymentRequest,
    background_tasks: BackgroundTasks,
    db=Depends(get_db)
):
    """
    Prepay/settle loan early.

    If amount is None, calculates full settlement amount with discount.
    """
    loan = db.query(Loan).filter(Loan.id == loan_id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")

    if loan.status != "ACTIVE":
        raise HTTPException(status_code=400, detail=f"Cannot prepay loan with status {loan.status}")

    # Get pending installments
    pending = db.query(LoanInstallment).filter(
        LoanInstallment.loan_id == loan_id,
        LoanInstallment.status.in_(["PENDING", "OVERDUE"])
    ).order_by(LoanInstallment.number).all()

    if not pending:
        raise HTTPException(status_code=400, detail="No pending installments")

    # Calculate settlement amount
    total_principal = sum(float(i.principal) for i in pending)
    total_interest = sum(float(i.interest) for i in pending)

    # Discount on future interest if apply_discount
    if request.apply_discount:
        discount = total_interest * 0.5  # 50% discount on remaining interest
        settlement_amount = total_principal + (total_interest - discount)
    else:
        discount = 0
        settlement_amount = total_principal + total_interest

    # If specific amount provided
    if request.amount is not None:
        if request.amount < settlement_amount:
            # Partial prepayment
            return {
                "message": f"Partial prepayment not supported. Minimum: R$ {settlement_amount:.2f}",
                "settlement_amount": settlement_amount,
                "discount_applied": discount if request.apply_discount else 0
            }
        settlement_amount = request.amount

    # Debit from account
    debit_success = await debit_loan_payment(
        loan.account_id,
        settlement_amount,
        loan.id
    )

    if not debit_success:
        raise HTTPException(status_code=400, detail="Payment failed - insufficient funds")

    # Record payment
    payment = LoanPayment(
        id=str(uuid.uuid4()),
        loan_id=loan.id,
        payment_type="SETTLEMENT",
        amount=settlement_amount,
        principal_paid=total_principal,
        interest_paid=total_interest - discount,
        payment_source="DEBIT"
    )
    db.add(payment)

    # Update all pending installments
    for inst in pending:
        inst.status = "PAID"
        inst.paid_amount = float(inst.total_amount)
        inst.paid_at = datetime.utcnow()

    # Update loan
    loan.status = "PAID_OFF"
    loan.paid_off_at = datetime.utcnow()
    loan.outstanding_balance = 0
    loan.paid_amount = float(loan.paid_amount) + settlement_amount
    loan.paid_installments = loan.term_months
    loan.next_due_date = None

    db.commit()

    # Audit log
    background_tasks.add_task(
        audit_log,
        "LOAN_SETTLED",
        "loan",
        loan.id,
        {"settlement_amount": settlement_amount, "discount": discount}
    )

    return {
        "payment_id": payment.id,
        "settlement_amount": settlement_amount,
        "discount_applied": discount,
        "principal_paid": total_principal,
        "interest_paid": total_interest - discount,
        "loan_status": "PAID_OFF",
        "message": "Empréstimo quitado com sucesso!"
    }


# ==================== Products Endpoints ====================

@app.get("/loans/products")
async def list_products(db=Depends(get_db)):
    """List available loan products"""
    products = db.query(LoanProduct).filter(LoanProduct.is_active == True).all()

    return {
        "products": [
            {
                "code": p.code,
                "name": p.name,
                "description": p.description,
                "min_amount": float(p.min_amount),
                "max_amount": float(p.max_amount),
                "min_term": p.min_term,
                "max_term": p.max_term,
                "min_score": p.min_score,
                "rates": {
                    "A": p.rate_band_a,
                    "B": p.rate_band_b,
                    "C": p.rate_band_c,
                    "D": p.rate_band_d,
                    "E": p.rate_band_e
                }
            }
            for p in products
        ]
    }


# ==================== AI Insights Endpoints ====================

@app.get("/credit/insights/{customer_id}")
async def get_credit_insights(customer_id: str):
    """Get AI-powered credit insights for customer"""
    insights = await athena_client.get_personalized_insights(
        customer_id,
        {}
    )

    return {
        "customer_id": customer_id,
        "insights": insights,
        "generated_at": datetime.utcnow().isoformat()
    }


# ==================== Statistics Endpoints ====================

@app.get("/loans/statistics/{customer_id}")
async def get_loan_statistics(customer_id: str, db=Depends(get_db)):
    """Get loan statistics for customer"""
    loans = db.query(Loan).filter(Loan.customer_id == customer_id).all()

    active_loans = [l for l in loans if l.status == "ACTIVE"]
    paid_loans = [l for l in loans if l.status == "PAID_OFF"]

    total_borrowed = sum(float(l.principal_amount) for l in loans)
    total_paid = sum(float(l.paid_amount) for l in loans)
    outstanding = sum(float(l.outstanding_balance) for l in active_loans)

    return {
        "customer_id": customer_id,
        "total_loans": len(loans),
        "active_loans": len(active_loans),
        "paid_loans": len(paid_loans),
        "total_borrowed": total_borrowed,
        "total_paid": total_paid,
        "outstanding_balance": outstanding,
        "on_time_payments": sum(l.paid_installments for l in loans),
        "late_payments": sum(l.overdue_days > 0 for l in loans)
    }


# ==================== Health Check ====================

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "loans-service",
        "version": "2.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Athena Loans Service",
        "version": "2.0.0",
        "description": "Credit Engine - Scoring, Loans, and AI-powered decisions"
    }
