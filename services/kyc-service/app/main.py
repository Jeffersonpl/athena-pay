"""
Athena KYC Service
Document verification, face validation, and KYC level management
Integrates with external face validation project
"""
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from decimal import Decimal
import uuid
import hashlib
import base64
import os
import httpx

from app.db import SessionLocal, ensure_schema
from app.models import (
    KYCSubmission, Document, FaceValidation, KYCLevel, KYCHistory
)

# Initialize database
ensure_schema()

# Seed KYC levels
def seed_kyc_levels():
    """Create default KYC levels"""
    with SessionLocal() as session:
        existing = session.query(KYCLevel).first()
        if existing:
            return

        levels = [
            {
                "level": 0,
                "name": "Básico",
                "description": "Cadastro inicial - apenas dados básicos",
                "requirements": {
                    "documents": [],
                    "face_validation": False,
                    "data_fields": ["full_name", "cpf_cnpj", "email", "phone"]
                },
                "default_limits": {"daily": 500, "monthly": 2000, "per_transaction": 200},
                "validity_days": 30
            },
            {
                "level": 1,
                "name": "Verificado",
                "description": "Documento verificado",
                "requirements": {
                    "documents": ["RG_FRONT", "RG_BACK"],
                    "face_validation": False,
                    "data_fields": ["full_name", "cpf_cnpj", "email", "phone", "birth_date", "address"]
                },
                "default_limits": {"daily": 5000, "monthly": 20000, "per_transaction": 2000},
                "validity_days": 365
            },
            {
                "level": 2,
                "name": "Completo",
                "description": "Documento + Face validation",
                "requirements": {
                    "documents": ["RG_FRONT", "RG_BACK", "SELFIE"],
                    "face_validation": True,
                    "data_fields": ["full_name", "cpf_cnpj", "email", "phone", "birth_date", "address"]
                },
                "default_limits": {"daily": 20000, "monthly": 100000, "per_transaction": 10000},
                "validity_days": 730
            },
            {
                "level": 3,
                "name": "Premium",
                "description": "Verificação completa + comprovantes",
                "requirements": {
                    "documents": ["RG_FRONT", "RG_BACK", "SELFIE", "PROOF_ADDRESS", "PROOF_INCOME"],
                    "face_validation": True,
                    "data_fields": ["full_name", "cpf_cnpj", "email", "phone", "birth_date", "address", "income"]
                },
                "default_limits": {"daily": 100000, "monthly": 500000, "per_transaction": 50000},
                "validity_days": 1095
            }
        ]

        for lvl in levels:
            kyc_level = KYCLevel(
                level=lvl["level"],
                name=lvl["name"],
                description=lvl["description"],
                requirements=lvl["requirements"],
                default_limits=lvl["default_limits"],
                validity_days=lvl["validity_days"]
            )
            session.add(kyc_level)

        session.commit()

seed_kyc_levels()

app = FastAPI(
    title="Athena KYC Service",
    description="Know Your Customer verification and document management",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Configuration
ENV = os.getenv("ENV", "dev")
FACE_VALIDATION_URL = os.getenv("FACE_VALIDATION_URL", "http://face-validation:8080")
CUSTOMER_SERVICE_URL = os.getenv("CUSTOMER_SERVICE_URL", "http://customer-service:8080")
COMPLIANCE_SERVICE_URL = os.getenv("COMPLIANCE_SERVICE_URL", "http://compliance-service:8080")

# Storage configuration (in production, use S3/Minio)
STORAGE_PATH = os.getenv("KYC_STORAGE_PATH", "/tmp/kyc-documents")
os.makedirs(STORAGE_PATH, exist_ok=True)


# ============ Request/Response Models ============

class KYCSubmitRequest(BaseModel):
    customer_id: str
    target_level: int = 1
    documents: Optional[Dict[str, str]] = None  # {"doc_type": "base64_data"}


class DocumentUploadResponse(BaseModel):
    document_id: str
    doc_type: str
    quality_score: Optional[float]
    ocr_data: Optional[Dict[str, Any]]


class KYCStatusResponse(BaseModel):
    customer_id: str
    current_level: int
    status: str
    submission_id: Optional[str]
    pending_requirements: List[str]
    message: str


class FaceValidationRequest(BaseModel):
    customer_id: str
    submission_id: str
    selfie_document_id: str
    id_photo_document_id: Optional[str] = None


class FaceValidationResponse(BaseModel):
    validation_id: str
    result: str
    liveness_score: Optional[float]
    match_score: Optional[float]
    message: str


class KYCReviewRequest(BaseModel):
    reviewer_id: str
    decision: str  # APPROVED, REJECTED
    rejection_reason: Optional[str] = None
    rejection_code: Optional[str] = None
    notes: Optional[str] = None


class KYCLevelResponse(BaseModel):
    level: int
    name: str
    description: str
    requirements: Dict[str, Any]
    default_limits: Dict[str, Any]


# ============ Health Check ============

@app.get("/health")
async def health():
    return {"ok": True, "service": "kyc-service", "version": "1.0.0", "env": ENV}


# ============ KYC Submission ============

@app.post("/kyc/submit")
def submit_kyc(request: KYCSubmitRequest):
    """
    Submit KYC for verification
    In DEV mode, auto-approves for faster development
    """
    submission_id = str(uuid.uuid4())

    with SessionLocal() as session:
        # Get target level requirements
        target_level = session.get(KYCLevel, request.target_level)
        if not target_level:
            raise HTTPException(status_code=400, detail=f"Invalid KYC level: {request.target_level}")

        # Check existing submissions
        existing = session.query(KYCSubmission).filter(
            KYCSubmission.customer_id == request.customer_id,
            KYCSubmission.status.in_(["PENDING", "PROCESSING", "DOCUMENTS_REQUIRED", "FACE_VALIDATION"])
        ).first()

        if existing:
            return {
                "status": "already_in_progress",
                "submission_id": existing.id,
                "current_status": existing.status,
                "message": "KYC submission already in progress"
            }

        # Get current level
        current_level = _get_customer_kyc_level(request.customer_id)

        # Create submission
        submission = KYCSubmission(
            id=submission_id,
            customer_id=request.customer_id,
            submission_type="UPGRADE" if current_level > 0 else "INITIAL",
            current_level=current_level,
            target_level=request.target_level,
            status="PENDING",
            documents=request.documents or {},
            expires_at=datetime.utcnow() + timedelta(days=30)
        )
        session.add(submission)

        # Log history
        history = KYCHistory(
            id=str(uuid.uuid4()),
            customer_id=request.customer_id,
            submission_id=submission_id,
            event_type="SUBMISSION",
            previous_level=current_level,
            new_level=None,
            details={
                "target_level": request.target_level,
                "submission_type": submission.submission_type
            }
        )
        session.add(history)

        session.commit()

        # DEV mode: auto-approve
        if ENV == "dev":
            return _auto_approve_dev(session, submission_id, request.target_level)

        # Check what's needed
        missing = _check_requirements(session, request.customer_id, target_level.requirements)

        if missing:
            submission.status = "DOCUMENTS_REQUIRED"
            session.commit()
            return {
                "status": "documents_required",
                "submission_id": submission_id,
                "missing_documents": missing,
                "message": "Please upload required documents"
            }

        # If documents are complete, check if face validation is needed
        if target_level.requirements.get("face_validation"):
            submission.status = "FACE_VALIDATION"
            session.commit()
            return {
                "status": "face_validation_required",
                "submission_id": submission_id,
                "message": "Please complete face validation"
            }

        # Otherwise, send to manual review
        submission.status = "MANUAL_REVIEW"
        session.commit()

        return {
            "status": "pending_review",
            "submission_id": submission_id,
            "message": "KYC submitted for review"
        }


def _auto_approve_dev(session, submission_id: str, target_level: int):
    """Auto-approve in DEV mode"""
    submission = session.get(KYCSubmission, submission_id)
    submission.status = "APPROVED"
    submission.reviewed_at = datetime.utcnow()
    submission.review_notes = "DEV auto-approval"

    # Update customer level
    _update_customer_level(submission.customer_id, target_level)

    # Log history
    history = KYCHistory(
        id=str(uuid.uuid4()),
        customer_id=submission.customer_id,
        submission_id=submission_id,
        event_type="APPROVAL",
        previous_level=submission.current_level,
        new_level=target_level,
        details={"auto_approved": True, "reason": "DEV environment"}
    )
    session.add(history)
    session.commit()

    return {
        "status": "approved",
        "submission_id": submission_id,
        "level": target_level,
        "message": "DEV auto-approval - KYC level updated",
        "note": "This is DEV mode. In production, manual review is required."
    }


def _get_customer_kyc_level(customer_id: str) -> int:
    """Get current KYC level from customer service"""
    try:
        client = httpx.Client(timeout=5.0)
        resp = client.get(f"{CUSTOMER_SERVICE_URL}/customers/{customer_id}")
        client.close()
        if resp.status_code == 200:
            return resp.json().get("kyc_level", 0)
    except Exception:
        pass
    return 0


def _update_customer_level(customer_id: str, level: int):
    """Update customer KYC level"""
    try:
        client = httpx.Client(timeout=5.0)
        client.put(
            f"{CUSTOMER_SERVICE_URL}/customers/{customer_id}/kyc-level",
            json={"kyc_level": level}
        )
        client.close()
    except Exception:
        pass  # Log error but don't fail


def _check_requirements(session, customer_id: str, requirements: dict) -> list:
    """Check what documents are missing"""
    missing = []
    required_docs = requirements.get("documents", [])

    for doc_type in required_docs:
        existing = session.query(Document).filter(
            Document.customer_id == customer_id,
            Document.doc_type == doc_type,
            Document.is_active == True,
            Document.verified == True
        ).first()

        if not existing:
            missing.append(doc_type)

    return missing


# ============ Document Upload ============

@app.post("/kyc/document/upload", response_model=DocumentUploadResponse)
async def upload_document(
    customer_id: str = Form(...),
    doc_type: str = Form(...),
    submission_id: Optional[str] = Form(None),
    file: UploadFile = File(...)
):
    """
    Upload a document for KYC verification
    """
    document_id = str(uuid.uuid4())

    # Read file content
    content = await file.read()

    # Calculate hash for integrity
    file_hash = hashlib.sha256(content).hexdigest()

    # Store file (in production, use S3/Minio with encryption)
    storage_ref = f"{customer_id}/{document_id}_{doc_type}"
    storage_path = os.path.join(STORAGE_PATH, f"{document_id}.bin")

    with open(storage_path, "wb") as f:
        f.write(content)

    with SessionLocal() as session:
        # Create document record
        document = Document(
            id=document_id,
            customer_id=customer_id,
            submission_id=submission_id,
            doc_type=doc_type,
            storage_ref=storage_ref,
            storage_provider="local",
            file_hash=file_hash,
            file_name=file.filename,
            file_size=len(content),
            mime_type=file.content_type
        )

        # Assess quality (simplified - in production use ML model)
        quality_score = _assess_document_quality(content, doc_type)
        document.quality_score = quality_score

        if quality_score < 0.5:
            document.quality_issues = {"low_quality": True}

        # Extract OCR data (simplified - in production use OCR service)
        ocr_data = _extract_ocr_data(content, doc_type)
        document.ocr_extracted = ocr_data

        # Auto-verify in DEV mode
        if ENV == "dev":
            document.verified = True
            document.verification_method = "DEV_AUTO"

        session.add(document)

        # Log history
        history = KYCHistory(
            id=str(uuid.uuid4()),
            customer_id=customer_id,
            submission_id=submission_id,
            event_type="DOCUMENT_UPLOAD",
            details={
                "document_id": document_id,
                "doc_type": doc_type,
                "quality_score": quality_score
            }
        )
        session.add(history)

        session.commit()

        return DocumentUploadResponse(
            document_id=document_id,
            doc_type=doc_type,
            quality_score=quality_score,
            ocr_data=ocr_data
        )


def _assess_document_quality(content: bytes, doc_type: str) -> float:
    """
    Assess document quality
    In production, use ML model for blur detection, glare, etc.
    """
    # Simplified: just check file size as proxy for quality
    size_kb = len(content) / 1024

    if size_kb < 50:  # Too small
        return 0.3
    elif size_kb < 100:
        return 0.6
    elif size_kb < 500:
        return 0.8
    else:
        return 0.9


def _extract_ocr_data(content: bytes, doc_type: str) -> dict:
    """
    Extract data from document using OCR
    In production, use Tesseract, AWS Textract, or Google Vision
    """
    # Simplified: return empty dict (would be OCR results)
    if doc_type in ["RG_FRONT", "CNH_FRONT"]:
        return {
            "extracted": True,
            "fields_found": ["name", "document_number"],
            "note": "OCR extraction placeholder - integrate real OCR service"
        }
    return {}


@app.get("/kyc/document/{document_id}")
def get_document(document_id: str):
    """
    Get document metadata (not the actual file for security)
    """
    with SessionLocal() as session:
        document = session.get(Document, document_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")

        return {
            "id": document.id,
            "customer_id": document.customer_id,
            "doc_type": document.doc_type,
            "quality_score": document.quality_score,
            "verified": document.verified,
            "verification_method": document.verification_method,
            "ocr_extracted": document.ocr_extracted,
            "created_at": document.created_at.isoformat()
        }


# ============ Face Validation ============

@app.post("/kyc/face-validate", response_model=FaceValidationResponse)
async def validate_face(request: FaceValidationRequest):
    """
    Perform face liveness and match validation
    Integrates with external face validation project
    """
    validation_id = str(uuid.uuid4())

    with SessionLocal() as session:
        # Get selfie document
        selfie_doc = session.get(Document, request.selfie_document_id)
        if not selfie_doc:
            raise HTTPException(status_code=404, detail="Selfie document not found")

        # Get ID photo if provided
        id_photo_doc = None
        if request.id_photo_document_id:
            id_photo_doc = session.get(Document, request.id_photo_document_id)

        # DEV mode: auto-pass
        if ENV == "dev":
            validation = FaceValidation(
                id=validation_id,
                customer_id=request.customer_id,
                submission_id=request.submission_id,
                selfie_document_id=request.selfie_document_id,
                id_photo_document_id=request.id_photo_document_id,
                provider="DEV_AUTO",
                liveness_score=0.95,
                liveness_result="LIVE",
                match_score=0.92,
                match_result="MATCH",
                result="PASS"
            )
            session.add(validation)

            # Update submission status
            submission = session.get(KYCSubmission, request.submission_id)
            if submission:
                submission.face_validation = {
                    "validation_id": validation_id,
                    "result": "PASS",
                    "auto_passed": True
                }
                submission.status = "MANUAL_REVIEW"

            # Log history
            history = KYCHistory(
                id=str(uuid.uuid4()),
                customer_id=request.customer_id,
                submission_id=request.submission_id,
                event_type="FACE_CHECK",
                details={
                    "validation_id": validation_id,
                    "result": "PASS",
                    "dev_mode": True
                }
            )
            session.add(history)
            session.commit()

            return FaceValidationResponse(
                validation_id=validation_id,
                result="PASS",
                liveness_score=0.95,
                match_score=0.92,
                message="DEV auto-pass - Face validation successful"
            )

        # Production: call external face validation service
        try:
            # Load selfie file
            selfie_path = os.path.join(STORAGE_PATH, f"{request.selfie_document_id}.bin")
            with open(selfie_path, "rb") as f:
                selfie_data = base64.b64encode(f.read()).decode()

            # Load ID photo if available
            id_photo_data = None
            if id_photo_doc:
                id_path = os.path.join(STORAGE_PATH, f"{request.id_photo_document_id}.bin")
                if os.path.exists(id_path):
                    with open(id_path, "rb") as f:
                        id_photo_data = base64.b64encode(f.read()).decode()

            # Call external face validation service
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{FACE_VALIDATION_URL}/validate",
                    json={
                        "selfie": selfie_data,
                        "id_photo": id_photo_data,
                        "customer_id": request.customer_id,
                        "check_liveness": True,
                        "check_match": id_photo_data is not None
                    }
                )

                if response.status_code == 200:
                    result_data = response.json()

                    validation = FaceValidation(
                        id=validation_id,
                        customer_id=request.customer_id,
                        submission_id=request.submission_id,
                        selfie_document_id=request.selfie_document_id,
                        id_photo_document_id=request.id_photo_document_id,
                        provider="INTERNAL",
                        provider_reference=result_data.get("reference_id"),
                        liveness_score=result_data.get("liveness_score"),
                        liveness_result=result_data.get("liveness_result"),
                        match_score=result_data.get("match_score"),
                        match_result=result_data.get("match_result"),
                        result=result_data.get("result", "INCONCLUSIVE"),
                        provider_response=result_data
                    )
                    session.add(validation)

                    # Update submission
                    submission = session.get(KYCSubmission, request.submission_id)
                    if submission:
                        submission.face_validation = {
                            "validation_id": validation_id,
                            "result": validation.result
                        }
                        if validation.result == "PASS":
                            submission.status = "MANUAL_REVIEW"
                        elif validation.result == "FAIL":
                            submission.status = "REJECTED"
                            submission.rejection_reason = "Face validation failed"
                            submission.rejection_code = "FACE_VALIDATION_FAILED"

                    session.commit()

                    return FaceValidationResponse(
                        validation_id=validation_id,
                        result=validation.result,
                        liveness_score=validation.liveness_score,
                        match_score=validation.match_score,
                        message="Face validation completed"
                    )
                else:
                    raise Exception(f"Face validation service returned {response.status_code}")

        except Exception as e:
            # Log error and return inconclusive
            validation = FaceValidation(
                id=validation_id,
                customer_id=request.customer_id,
                submission_id=request.submission_id,
                selfie_document_id=request.selfie_document_id,
                id_photo_document_id=request.id_photo_document_id,
                provider="INTERNAL",
                result="ERROR",
                provider_response={"error": str(e)}
            )
            session.add(validation)
            session.commit()

            return FaceValidationResponse(
                validation_id=validation_id,
                result="ERROR",
                liveness_score=None,
                match_score=None,
                message=f"Face validation error: {str(e)}"
            )


# ============ KYC Status & Review ============

@app.get("/kyc/status/{customer_id}", response_model=KYCStatusResponse)
def get_kyc_status(customer_id: str):
    """
    Get current KYC status for a customer
    """
    with SessionLocal() as session:
        # Get current level
        current_level = _get_customer_kyc_level(customer_id)

        # Get active submission if any
        submission = session.query(KYCSubmission).filter(
            KYCSubmission.customer_id == customer_id,
            KYCSubmission.status.notin_(["APPROVED", "REJECTED", "EXPIRED"])
        ).order_by(KYCSubmission.created_at.desc()).first()

        if submission:
            # Get pending requirements
            target_level = session.get(KYCLevel, submission.target_level)
            missing = _check_requirements(session, customer_id, target_level.requirements if target_level else {})

            return KYCStatusResponse(
                customer_id=customer_id,
                current_level=current_level,
                status=submission.status,
                submission_id=submission.id,
                pending_requirements=missing,
                message=_get_status_message(submission.status)
            )

        return KYCStatusResponse(
            customer_id=customer_id,
            current_level=current_level,
            status="NO_ACTIVE_SUBMISSION",
            submission_id=None,
            pending_requirements=[],
            message="No active KYC submission"
        )


def _get_status_message(status: str) -> str:
    """Get human-readable status message"""
    messages = {
        "PENDING": "KYC submission received, processing...",
        "PROCESSING": "Documents being verified",
        "DOCUMENTS_REQUIRED": "Additional documents required",
        "FACE_VALIDATION": "Face validation required",
        "MANUAL_REVIEW": "Under manual review",
        "APPROVED": "KYC approved",
        "REJECTED": "KYC rejected",
        "EXPIRED": "Submission expired"
    }
    return messages.get(status, "Unknown status")


@app.put("/kyc/{submission_id}/review")
def review_submission(submission_id: str, review: KYCReviewRequest):
    """
    Admin review of KYC submission
    """
    with SessionLocal() as session:
        submission = session.get(KYCSubmission, submission_id)
        if not submission:
            raise HTTPException(status_code=404, detail="Submission not found")

        if submission.status not in ["MANUAL_REVIEW", "FACE_VALIDATION", "DOCUMENTS_REQUIRED"]:
            raise HTTPException(status_code=400, detail=f"Cannot review submission in status: {submission.status}")

        submission.reviewer_id = review.reviewer_id
        submission.reviewed_at = datetime.utcnow()
        submission.review_notes = review.notes

        if review.decision == "APPROVED":
            submission.status = "APPROVED"

            # Update customer level
            _update_customer_level(submission.customer_id, submission.target_level)

            # Screen customer with compliance
            _screen_customer_compliance(submission.customer_id)

            # Log history
            history = KYCHistory(
                id=str(uuid.uuid4()),
                customer_id=submission.customer_id,
                submission_id=submission_id,
                event_type="APPROVAL",
                previous_level=submission.current_level,
                new_level=submission.target_level,
                details={"reviewer_id": review.reviewer_id},
                actor_id=review.reviewer_id,
                actor_type="ADMIN"
            )
            session.add(history)

        elif review.decision == "REJECTED":
            submission.status = "REJECTED"
            submission.rejection_reason = review.rejection_reason
            submission.rejection_code = review.rejection_code

            # Log history
            history = KYCHistory(
                id=str(uuid.uuid4()),
                customer_id=submission.customer_id,
                submission_id=submission_id,
                event_type="REJECTION",
                previous_level=submission.current_level,
                new_level=None,
                details={
                    "reviewer_id": review.reviewer_id,
                    "reason": review.rejection_reason,
                    "code": review.rejection_code
                },
                actor_id=review.reviewer_id,
                actor_type="ADMIN"
            )
            session.add(history)

        session.commit()

        return {
            "status": "ok",
            "submission_id": submission_id,
            "decision": review.decision,
            "new_level": submission.target_level if review.decision == "APPROVED" else None
        }


def _screen_customer_compliance(customer_id: str):
    """Screen customer with compliance service after KYC approval"""
    try:
        client = httpx.Client(timeout=10.0)
        # Get customer data
        customer_resp = client.get(f"{CUSTOMER_SERVICE_URL}/customers/{customer_id}")
        if customer_resp.status_code == 200:
            customer = customer_resp.json()

            # Screen with compliance
            client.post(
                f"{COMPLIANCE_SERVICE_URL}/compliance/check/customer",
                json={
                    "customer_id": customer_id,
                    "document": customer.get("cpf_cnpj", ""),
                    "name": customer.get("full_name", ""),
                    "check_pep": True,
                    "check_sanctions": True,
                    "source_service": "kyc-service"
                }
            )
        client.close()
    except Exception:
        pass  # Log error but don't fail


# ============ KYC Levels ============

@app.get("/kyc/levels", response_model=List[KYCLevelResponse])
def list_kyc_levels():
    """
    List all KYC levels and their requirements
    """
    with SessionLocal() as session:
        levels = session.query(KYCLevel).filter(KYCLevel.is_active == True).order_by(KYCLevel.level).all()

        return [
            KYCLevelResponse(
                level=lvl.level,
                name=lvl.name,
                description=lvl.description,
                requirements=lvl.requirements,
                default_limits=lvl.default_limits
            )
            for lvl in levels
        ]


@app.get("/kyc/levels/{level}", response_model=KYCLevelResponse)
def get_kyc_level(level: int):
    """
    Get specific KYC level requirements
    """
    with SessionLocal() as session:
        kyc_level = session.get(KYCLevel, level)
        if not kyc_level:
            raise HTTPException(status_code=404, detail="KYC level not found")

        return KYCLevelResponse(
            level=kyc_level.level,
            name=kyc_level.name,
            description=kyc_level.description,
            requirements=kyc_level.requirements,
            default_limits=kyc_level.default_limits
        )


# ============ KYC History ============

@app.get("/kyc/history/{customer_id}")
def get_kyc_history(customer_id: str, limit: int = Query(default=50, le=200)):
    """
    Get KYC history for a customer
    """
    with SessionLocal() as session:
        history = session.query(KYCHistory).filter(
            KYCHistory.customer_id == customer_id
        ).order_by(KYCHistory.created_at.desc()).limit(limit).all()

        return [
            {
                "id": h.id,
                "event_type": h.event_type,
                "previous_level": h.previous_level,
                "new_level": h.new_level,
                "details": h.details,
                "actor_id": h.actor_id,
                "actor_type": h.actor_type,
                "created_at": h.created_at.isoformat()
            }
            for h in history
        ]


# ============ Upgrade Request ============

@app.post("/kyc/upgrade")
def request_upgrade(customer_id: str, target_level: int):
    """
    Request KYC level upgrade
    """
    with SessionLocal() as session:
        current_level = _get_customer_kyc_level(customer_id)

        if target_level <= current_level:
            raise HTTPException(
                status_code=400,
                detail=f"Target level {target_level} must be higher than current level {current_level}"
            )

        # Check if level exists
        kyc_level = session.get(KYCLevel, target_level)
        if not kyc_level:
            raise HTTPException(status_code=400, detail=f"Invalid KYC level: {target_level}")

        # Check requirements
        missing = _check_requirements(session, customer_id, kyc_level.requirements)

        return {
            "current_level": current_level,
            "target_level": target_level,
            "requirements": kyc_level.requirements,
            "missing_documents": missing,
            "face_validation_required": kyc_level.requirements.get("face_validation", False),
            "message": "Submit KYC with required documents to upgrade"
        }
