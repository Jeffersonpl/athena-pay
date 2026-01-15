"""
Athena Pay - LGPD Service
Lei Geral de Proteção de Dados (Lei 13.709/2018) Compliance Service

SEC-003: Implements all mandatory endpoints for data subject rights.

Endpoints:
- GET  /v1/users/{id}/data           - Access to personal data (Art. 18, II)
- GET  /v1/users/{id}/data-export    - Data portability (Art. 18, V)
- POST /v1/users/{id}/anonymize      - Anonymization request (Art. 18, IV)
- DELETE /v1/users/{id}/data         - Data deletion/Right to be forgotten (Art. 18, VI)
- GET  /v1/users/{id}/consent        - List consents
- POST /v1/users/{id}/consent        - Grant consent
- DELETE /v1/users/{id}/consent/{purpose} - Revoke consent (Art. 18, IX)
- GET  /v1/users/{id}/processing     - List data processing activities
- POST /v1/requests                  - Create LGPD request
- GET  /v1/requests/{id}             - Get request status
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from enum import Enum
import uuid
import json
import hashlib
import asyncio
import logging
import os
from dataclasses import dataclass
from io import BytesIO
import zipfile

# Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://athena:athena_secret_2024@postgres:5432/athena")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
CUSTOMER_SERVICE_URL = os.getenv("CUSTOMER_SERVICE_URL", "http://customer-service:8080")
ACCOUNTS_SERVICE_URL = os.getenv("ACCOUNTS_SERVICE_URL", "http://accounts-service:8080")
PIX_SERVICE_URL = os.getenv("PIX_SERVICE_URL", "http://pix-service:8080")
AUDIT_SERVICE_URL = os.getenv("AUDIT_SERVICE_URL", "http://audit-service:8080")

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("lgpd-service")

# =============================================================================
# ENUMS AND MODELS
# =============================================================================

class RequestType(str, Enum):
    ACCESS = "ACCESS"                    # Art. 18, II - Acesso aos dados
    PORTABILITY = "PORTABILITY"          # Art. 18, V - Portabilidade
    RECTIFICATION = "RECTIFICATION"      # Art. 18, III - Correção
    ANONYMIZATION = "ANONYMIZATION"      # Art. 18, IV - Anonimização
    DELETION = "DELETION"                # Art. 18, VI - Eliminação
    CONSENT_REVOKE = "CONSENT_REVOKE"    # Art. 18, IX - Revogação
    PROCESSING_INFO = "PROCESSING_INFO"  # Art. 18, VII - Informação sobre compartilhamento


class RequestStatus(str, Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    AWAITING_VERIFICATION = "AWAITING_VERIFICATION"
    COMPLETED = "COMPLETED"
    REJECTED = "REJECTED"
    EXPIRED = "EXPIRED"


class ConsentPurpose(str, Enum):
    ACCOUNT_MANAGEMENT = "ACCOUNT_MANAGEMENT"
    TRANSACTION_PROCESSING = "TRANSACTION_PROCESSING"
    MARKETING = "MARKETING"
    ANALYTICS = "ANALYTICS"
    THIRD_PARTY_SHARING = "THIRD_PARTY_SHARING"
    CREDIT_ANALYSIS = "CREDIT_ANALYSIS"
    FRAUD_PREVENTION = "FRAUD_PREVENTION"
    LEGAL_COMPLIANCE = "LEGAL_COMPLIANCE"


class DataCategory(str, Enum):
    IDENTIFICATION = "IDENTIFICATION"      # Nome, CPF, RG
    CONTACT = "CONTACT"                    # Email, telefone, endereço
    FINANCIAL = "FINANCIAL"                # Contas, transações, saldos
    BEHAVIORAL = "BEHAVIORAL"              # Padrões de uso, preferências
    BIOMETRIC = "BIOMETRIC"               # Face ID, impressão digital
    LOCATION = "LOCATION"                  # Dados de localização


# =============================================================================
# PYDANTIC SCHEMAS
# =============================================================================

class LGPDRequest(BaseModel):
    """Request for LGPD data subject rights"""
    user_id: str = Field(..., min_length=1, max_length=100)
    request_type: RequestType
    reason: Optional[str] = Field(default=None, max_length=500)
    email_notification: Optional[EmailStr] = None
    additional_data: Optional[Dict[str, Any]] = None


class LGPDRequestResponse(BaseModel):
    """Response for LGPD request"""
    request_id: str
    user_id: str
    request_type: RequestType
    status: RequestStatus
    created_at: datetime
    estimated_completion: datetime
    message: str


class Consent(BaseModel):
    """User consent record"""
    purpose: ConsentPurpose
    granted: bool
    granted_at: Optional[datetime] = None
    revoked_at: Optional[datetime] = None
    version: str = "1.0"
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None


class ConsentRequest(BaseModel):
    """Request to grant/revoke consent"""
    purpose: ConsentPurpose
    granted: bool
    ip_address: Optional[str] = None


class UserDataResponse(BaseModel):
    """Response containing user's personal data"""
    user_id: str
    data_categories: List[str]
    personal_data: Dict[str, Any]
    processing_activities: List[Dict[str, Any]]
    consents: List[Dict[str, Any]]
    data_sources: List[str]
    retention_period: str
    exported_at: datetime


class RectificationRequest(BaseModel):
    """Request to correct personal data"""
    field: str = Field(..., min_length=1, max_length=100)
    current_value: Optional[str] = None
    new_value: str = Field(..., min_length=1, max_length=500)
    justification: Optional[str] = None


class ProcessingActivity(BaseModel):
    """Data processing activity record"""
    activity_id: str
    name: str
    purpose: str
    legal_basis: str
    data_categories: List[DataCategory]
    recipients: List[str]
    retention_period: str
    automated_decision: bool = False
    cross_border_transfer: bool = False


# =============================================================================
# IN-MEMORY STORAGE (Replace with actual database in production)
# =============================================================================

# Simulated storage for demo purposes
_requests: Dict[str, Dict[str, Any]] = {}
_consents: Dict[str, List[Dict[str, Any]]] = {}
_user_data: Dict[str, Dict[str, Any]] = {}

# Sample processing activities
PROCESSING_ACTIVITIES = [
    ProcessingActivity(
        activity_id="proc-001",
        name="Gestão de Conta Corrente",
        purpose="Manutenção e operação da conta bancária",
        legal_basis="Execução de contrato (Art. 7, V)",
        data_categories=[DataCategory.IDENTIFICATION, DataCategory.CONTACT, DataCategory.FINANCIAL],
        recipients=["Athena Pay", "Banco Central do Brasil"],
        retention_period="5 anos após encerramento",
        automated_decision=False,
        cross_border_transfer=False
    ),
    ProcessingActivity(
        activity_id="proc-002",
        name="Prevenção à Fraude",
        purpose="Detecção e prevenção de atividades fraudulentas",
        legal_basis="Interesse legítimo (Art. 7, IX)",
        data_categories=[DataCategory.BEHAVIORAL, DataCategory.LOCATION],
        recipients=["Athena Pay", "Serasa Experian"],
        retention_period="10 anos",
        automated_decision=True,
        cross_border_transfer=False
    ),
    ProcessingActivity(
        activity_id="proc-003",
        name="Marketing Personalizado",
        purpose="Envio de ofertas e promoções personalizadas",
        legal_basis="Consentimento (Art. 7, I)",
        data_categories=[DataCategory.BEHAVIORAL, DataCategory.CONTACT],
        recipients=["Athena Pay"],
        retention_period="Até revogação do consentimento",
        automated_decision=True,
        cross_border_transfer=False
    ),
    ProcessingActivity(
        activity_id="proc-004",
        name="Análise de Crédito",
        purpose="Avaliação de risco para concessão de crédito",
        legal_basis="Execução de contrato (Art. 7, V)",
        data_categories=[DataCategory.IDENTIFICATION, DataCategory.FINANCIAL],
        recipients=["Athena Pay", "Serasa", "SPC Brasil"],
        retention_period="5 anos após quitação",
        automated_decision=True,
        cross_border_transfer=False
    ),
]


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def generate_request_id() -> str:
    """Generate unique request ID"""
    return f"LGPD-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}"


def hash_pii(value: str) -> str:
    """Hash PII for anonymization"""
    return hashlib.sha256(value.encode()).hexdigest()[:16] + "****"


def mask_cpf(cpf: str) -> str:
    """Mask CPF for display"""
    if len(cpf) == 11:
        return f"{cpf[:3]}.***.***-{cpf[-2:]}"
    return "***.***.***-**"


def mask_email(email: str) -> str:
    """Mask email for display"""
    if "@" in email:
        local, domain = email.split("@")
        return f"{local[0]}{'*' * (len(local)-2)}{local[-1]}@{domain}"
    return "****@****.***"


def mask_phone(phone: str) -> str:
    """Mask phone for display"""
    if len(phone) >= 8:
        return f"({phone[:2]}) *****-{phone[-4:]}"
    return "(***) *****-****"


async def get_user_data_from_services(user_id: str) -> Dict[str, Any]:
    """
    Fetch user data from all services.
    In production, this would make actual HTTP calls to microservices.
    """
    # Simulated user data (replace with actual service calls)
    return {
        "identification": {
            "name": "João da Silva",
            "cpf": "123.456.789-00",
            "rg": "12.345.678-9",
            "birth_date": "1990-01-15",
            "nationality": "Brasileiro"
        },
        "contact": {
            "email": "joao.silva@email.com",
            "phone": "+55 11 99999-8888",
            "address": {
                "street": "Rua das Flores, 123",
                "city": "São Paulo",
                "state": "SP",
                "zip": "01234-567"
            }
        },
        "financial": {
            "accounts": [
                {"id": "acc-001", "type": "CHECKING", "balance": 1500.00},
                {"id": "acc-002", "type": "SAVINGS", "balance": 5000.00}
            ],
            "cards": [
                {"id": "card-001", "type": "CREDIT", "last_four": "1234"}
            ],
            "transactions_count": 150,
            "pix_keys": ["joao.silva@email.com", "+5511999998888"]
        },
        "behavioral": {
            "login_frequency": "daily",
            "preferred_channels": ["app", "web"],
            "last_access": "2025-01-15T10:30:00Z"
        }
    }


async def anonymize_user_data(user_id: str) -> bool:
    """
    Anonymize user data across all services.
    Replaces identifiable data with hashed/anonymized values.
    """
    logger.info(f"Anonymizing data for user {user_id}")
    # In production, this would:
    # 1. Replace name with hash
    # 2. Replace email with anonymized version
    # 3. Replace phone with anonymized version
    # 4. Keep financial records for compliance but anonymize PII
    return True


async def delete_user_data(user_id: str) -> bool:
    """
    Delete user data across all services (where legally permitted).
    Some data must be retained for legal compliance.
    """
    logger.info(f"Processing deletion request for user {user_id}")
    # In production, this would:
    # 1. Delete marketing preferences
    # 2. Delete behavioral data
    # 3. Anonymize financial records (can't delete due to Bacen requirements)
    # 4. Log the deletion for audit purposes
    return True


# =============================================================================
# FASTAPI APPLICATION
# =============================================================================

app = FastAPI(
    title="Athena Pay - LGPD Service",
    version="1.0.0",
    description="Lei Geral de Proteção de Dados (LGPD) Compliance Service - Art. 18 Implementation"
)


# =============================================================================
# HEALTH ENDPOINTS
# =============================================================================

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "lgpd-service"}


# =============================================================================
# DATA ACCESS ENDPOINTS (Art. 18, II)
# =============================================================================

@app.get("/v1/users/{user_id}/data", response_model=UserDataResponse, tags=["Data Access"])
async def get_user_data(user_id: str):
    """
    Art. 18, II - Acesso aos dados pessoais

    Returns all personal data collected about the user, including:
    - Identification data (name, CPF, etc.)
    - Contact information
    - Financial data
    - Behavioral data
    - Processing activities
    - Consents granted
    """
    logger.info(f"Data access request for user {user_id}")

    user_data = await get_user_data_from_services(user_id)

    # Get user consents
    consents = _consents.get(user_id, [])

    response = UserDataResponse(
        user_id=user_id,
        data_categories=[cat.value for cat in DataCategory],
        personal_data=user_data,
        processing_activities=[p.dict() for p in PROCESSING_ACTIVITIES],
        consents=consents,
        data_sources=["Cadastro inicial", "Transações PIX", "App mobile", "Internet Banking"],
        retention_period="Conforme atividade de tratamento específica",
        exported_at=datetime.utcnow()
    )

    # Log access for audit
    logger.info(f"Data access completed for user {user_id}")

    return response


# =============================================================================
# DATA PORTABILITY ENDPOINTS (Art. 18, V)
# =============================================================================

@app.get("/v1/users/{user_id}/data-export", tags=["Data Portability"])
async def export_user_data(user_id: str, format: str = "json"):
    """
    Art. 18, V - Portabilidade dos dados

    Exports all user data in a machine-readable format.
    Supports: JSON, CSV (within ZIP file)
    """
    logger.info(f"Data export request for user {user_id}, format: {format}")

    user_data = await get_user_data_from_services(user_id)
    consents = _consents.get(user_id, [])

    export_data = {
        "export_info": {
            "user_id": user_id,
            "exported_at": datetime.utcnow().isoformat(),
            "format": format,
            "legal_basis": "Art. 18, V - Portabilidade",
            "data_controller": "Athena Pay Instituição de Pagamento S.A.",
            "dpo_contact": "dpo@athenapay.com.br"
        },
        "personal_data": user_data,
        "consents": consents,
        "processing_activities": [p.dict() for p in PROCESSING_ACTIVITIES]
    }

    if format == "json":
        return JSONResponse(
            content=export_data,
            headers={
                "Content-Disposition": f"attachment; filename=athena_data_export_{user_id}_{datetime.utcnow().strftime('%Y%m%d')}.json"
            }
        )

    elif format == "zip":
        # Create ZIP with multiple files
        buffer = BytesIO()
        with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zf:
            # Main data file
            zf.writestr("personal_data.json", json.dumps(export_data, indent=2, default=str))

            # Separate files for each category
            zf.writestr("identification.json", json.dumps(user_data.get("identification", {}), indent=2))
            zf.writestr("contact.json", json.dumps(user_data.get("contact", {}), indent=2))
            zf.writestr("financial.json", json.dumps(user_data.get("financial", {}), indent=2))
            zf.writestr("consents.json", json.dumps(consents, indent=2, default=str))

            # README with instructions
            readme = """
ATHENA PAY - EXPORTAÇÃO DE DADOS PESSOAIS (LGPD)
================================================

Este arquivo contém todos os seus dados pessoais armazenados pela Athena Pay,
conforme previsto no Art. 18, V da Lei Geral de Proteção de Dados (Lei 13.709/2018).

Arquivos incluídos:
- personal_data.json: Todos os dados consolidados
- identification.json: Dados de identificação
- contact.json: Dados de contato
- financial.json: Dados financeiros (transações anonimizadas)
- consents.json: Histórico de consentimentos

Para exercer outros direitos, acesse: https://athenapay.com.br/lgpd
Contato DPO: dpo@athenapay.com.br

Data de exportação: """ + datetime.utcnow().isoformat()
            zf.writestr("README.txt", readme)

        buffer.seek(0)
        return StreamingResponse(
            buffer,
            media_type="application/zip",
            headers={
                "Content-Disposition": f"attachment; filename=athena_data_export_{user_id}_{datetime.utcnow().strftime('%Y%m%d')}.zip"
            }
        )

    raise HTTPException(status_code=400, detail="Format must be 'json' or 'zip'")


# =============================================================================
# ANONYMIZATION ENDPOINTS (Art. 18, IV)
# =============================================================================

@app.post("/v1/users/{user_id}/anonymize", tags=["Anonymization"])
async def anonymize_user(user_id: str, background_tasks: BackgroundTasks):
    """
    Art. 18, IV - Anonimização, bloqueio ou eliminação de dados

    Requests anonymization of personal data. Data will be converted to
    non-identifiable format while maintaining statistical value.
    """
    request_id = generate_request_id()

    _requests[request_id] = {
        "request_id": request_id,
        "user_id": user_id,
        "request_type": RequestType.ANONYMIZATION.value,
        "status": RequestStatus.PENDING.value,
        "created_at": datetime.utcnow(),
        "estimated_completion": datetime.utcnow() + timedelta(days=15)
    }

    # Process in background
    background_tasks.add_task(anonymize_user_data, user_id)

    return LGPDRequestResponse(
        request_id=request_id,
        user_id=user_id,
        request_type=RequestType.ANONYMIZATION,
        status=RequestStatus.PENDING,
        created_at=datetime.utcnow(),
        estimated_completion=datetime.utcnow() + timedelta(days=15),
        message="Solicitação de anonimização recebida. Prazo: 15 dias úteis conforme LGPD."
    )


# =============================================================================
# DATA DELETION ENDPOINTS (Art. 18, VI)
# =============================================================================

@app.delete("/v1/users/{user_id}/data", tags=["Data Deletion"])
async def delete_user(user_id: str, background_tasks: BackgroundTasks):
    """
    Art. 18, VI - Eliminação dos dados (Direito ao Esquecimento)

    Requests deletion of personal data. Note: Some data must be retained
    for legal compliance (e.g., financial records for Bacen/COAF).
    """
    request_id = generate_request_id()

    _requests[request_id] = {
        "request_id": request_id,
        "user_id": user_id,
        "request_type": RequestType.DELETION.value,
        "status": RequestStatus.PENDING.value,
        "created_at": datetime.utcnow(),
        "estimated_completion": datetime.utcnow() + timedelta(days=15),
        "notes": "Dados financeiros serão anonimizados mas mantidos por 5 anos (exigência COAF)"
    }

    # Process in background
    background_tasks.add_task(delete_user_data, user_id)

    return LGPDRequestResponse(
        request_id=request_id,
        user_id=user_id,
        request_type=RequestType.DELETION,
        status=RequestStatus.PENDING,
        created_at=datetime.utcnow(),
        estimated_completion=datetime.utcnow() + timedelta(days=15),
        message="Solicitação de exclusão recebida. Dados regulatórios serão anonimizados mas mantidos conforme exigência legal (COAF/Bacen)."
    )


# =============================================================================
# CONSENT MANAGEMENT ENDPOINTS (Art. 18, VIII e IX)
# =============================================================================

@app.get("/v1/users/{user_id}/consent", tags=["Consent Management"])
async def get_consents(user_id: str):
    """
    Get all consents granted by the user.
    """
    consents = _consents.get(user_id, [])

    # Add default consents if none exist
    if not consents:
        consents = [
            {
                "purpose": ConsentPurpose.ACCOUNT_MANAGEMENT.value,
                "granted": True,
                "granted_at": "2024-01-01T00:00:00Z",
                "required": True,
                "description": "Necessário para operação da conta"
            },
            {
                "purpose": ConsentPurpose.TRANSACTION_PROCESSING.value,
                "granted": True,
                "granted_at": "2024-01-01T00:00:00Z",
                "required": True,
                "description": "Necessário para processar transações"
            },
            {
                "purpose": ConsentPurpose.FRAUD_PREVENTION.value,
                "granted": True,
                "granted_at": "2024-01-01T00:00:00Z",
                "required": True,
                "description": "Necessário para segurança da conta"
            },
            {
                "purpose": ConsentPurpose.MARKETING.value,
                "granted": False,
                "required": False,
                "description": "Receber ofertas e promoções"
            },
            {
                "purpose": ConsentPurpose.ANALYTICS.value,
                "granted": True,
                "granted_at": "2024-01-01T00:00:00Z",
                "required": False,
                "description": "Melhorar nossos serviços"
            },
            {
                "purpose": ConsentPurpose.THIRD_PARTY_SHARING.value,
                "granted": False,
                "required": False,
                "description": "Compartilhar dados com parceiros"
            }
        ]

    return {
        "user_id": user_id,
        "consents": consents,
        "last_updated": datetime.utcnow().isoformat(),
        "manage_url": f"https://app.athenapay.com.br/privacidade/consentimentos"
    }


@app.post("/v1/users/{user_id}/consent", tags=["Consent Management"])
async def grant_consent(user_id: str, consent: ConsentRequest):
    """
    Art. 18, VIII - Grant or update consent for a specific purpose.
    """
    if user_id not in _consents:
        _consents[user_id] = []

    # Find existing consent for this purpose
    existing = None
    for c in _consents[user_id]:
        if c.get("purpose") == consent.purpose.value:
            existing = c
            break

    consent_record = {
        "purpose": consent.purpose.value,
        "granted": consent.granted,
        "granted_at": datetime.utcnow().isoformat() if consent.granted else None,
        "revoked_at": datetime.utcnow().isoformat() if not consent.granted else None,
        "ip_address": consent.ip_address,
        "version": "1.0"
    }

    if existing:
        existing.update(consent_record)
    else:
        _consents[user_id].append(consent_record)

    logger.info(f"Consent {'granted' if consent.granted else 'revoked'} for user {user_id}: {consent.purpose.value}")

    return {
        "success": True,
        "user_id": user_id,
        "purpose": consent.purpose.value,
        "granted": consent.granted,
        "timestamp": datetime.utcnow().isoformat()
    }


@app.delete("/v1/users/{user_id}/consent/{purpose}", tags=["Consent Management"])
async def revoke_consent(user_id: str, purpose: ConsentPurpose):
    """
    Art. 18, IX - Revoke consent for a specific purpose.
    """
    # Check if consent can be revoked (some are required for account operation)
    required_purposes = [
        ConsentPurpose.ACCOUNT_MANAGEMENT,
        ConsentPurpose.TRANSACTION_PROCESSING,
        ConsentPurpose.FRAUD_PREVENTION,
        ConsentPurpose.LEGAL_COMPLIANCE
    ]

    if purpose in required_purposes:
        raise HTTPException(
            status_code=400,
            detail=f"Consentimento '{purpose.value}' é obrigatório para operação da conta. Para revogar, solicite o encerramento da conta."
        )

    if user_id not in _consents:
        _consents[user_id] = []

    for c in _consents[user_id]:
        if c.get("purpose") == purpose.value:
            c["granted"] = False
            c["revoked_at"] = datetime.utcnow().isoformat()
            break

    logger.info(f"Consent revoked for user {user_id}: {purpose.value}")

    return {
        "success": True,
        "user_id": user_id,
        "purpose": purpose.value,
        "revoked": True,
        "timestamp": datetime.utcnow().isoformat(),
        "message": f"Consentimento para '{purpose.value}' revogado com sucesso."
    }


# =============================================================================
# PROCESSING ACTIVITIES ENDPOINTS (Art. 18, VII)
# =============================================================================

@app.get("/v1/users/{user_id}/processing", tags=["Processing Activities"])
async def get_processing_activities(user_id: str):
    """
    Art. 18, VII - Information about data sharing with third parties.

    Returns all processing activities that apply to the user's data.
    """
    return {
        "user_id": user_id,
        "processing_activities": [p.dict() for p in PROCESSING_ACTIVITIES],
        "data_controller": {
            "name": "Athena Pay Instituição de Pagamento S.A.",
            "cnpj": "00.000.000/0001-00",
            "address": "Av. Paulista, 1000, São Paulo - SP",
            "dpo_email": "dpo@athenapay.com.br",
            "dpo_phone": "0800 123 4567"
        },
        "legal_basis_info": {
            "Art. 7, I": "Consentimento do titular",
            "Art. 7, V": "Execução de contrato",
            "Art. 7, VI": "Exercício regular de direitos",
            "Art. 7, IX": "Interesse legítimo do controlador"
        }
    }


# =============================================================================
# LGPD REQUESTS MANAGEMENT
# =============================================================================

@app.post("/v1/requests", tags=["Request Management"])
async def create_request(request: LGPDRequest, background_tasks: BackgroundTasks):
    """
    Create a new LGPD request (generic endpoint for all request types).
    """
    request_id = generate_request_id()

    _requests[request_id] = {
        "request_id": request_id,
        "user_id": request.user_id,
        "request_type": request.request_type.value,
        "status": RequestStatus.PENDING.value,
        "reason": request.reason,
        "email_notification": request.email_notification,
        "created_at": datetime.utcnow(),
        "estimated_completion": datetime.utcnow() + timedelta(days=15),
        "additional_data": request.additional_data
    }

    return LGPDRequestResponse(
        request_id=request_id,
        user_id=request.user_id,
        request_type=request.request_type,
        status=RequestStatus.PENDING,
        created_at=datetime.utcnow(),
        estimated_completion=datetime.utcnow() + timedelta(days=15),
        message=f"Solicitação {request.request_type.value} recebida. Protocolo: {request_id}"
    )


@app.get("/v1/requests/{request_id}", tags=["Request Management"])
async def get_request_status(request_id: str):
    """
    Get the status of a LGPD request.
    """
    request = _requests.get(request_id)
    if not request:
        raise HTTPException(status_code=404, detail="Solicitação não encontrada")

    return request


@app.get("/v1/users/{user_id}/requests", tags=["Request Management"])
async def get_user_requests(user_id: str):
    """
    Get all LGPD requests for a user.
    """
    user_requests = [r for r in _requests.values() if r.get("user_id") == user_id]
    return {
        "user_id": user_id,
        "requests": user_requests,
        "total": len(user_requests)
    }


# =============================================================================
# DATA RECTIFICATION ENDPOINTS (Art. 18, III)
# =============================================================================

@app.post("/v1/users/{user_id}/rectification", tags=["Data Rectification"])
async def request_rectification(user_id: str, rectification: RectificationRequest):
    """
    Art. 18, III - Correção de dados incompletos, inexatos ou desatualizados.
    """
    request_id = generate_request_id()

    _requests[request_id] = {
        "request_id": request_id,
        "user_id": user_id,
        "request_type": RequestType.RECTIFICATION.value,
        "status": RequestStatus.AWAITING_VERIFICATION.value,
        "field": rectification.field,
        "current_value": rectification.current_value,
        "new_value": rectification.new_value,
        "justification": rectification.justification,
        "created_at": datetime.utcnow(),
        "estimated_completion": datetime.utcnow() + timedelta(days=5)
    }

    return LGPDRequestResponse(
        request_id=request_id,
        user_id=user_id,
        request_type=RequestType.RECTIFICATION,
        status=RequestStatus.AWAITING_VERIFICATION,
        created_at=datetime.utcnow(),
        estimated_completion=datetime.utcnow() + timedelta(days=5),
        message=f"Solicitação de correção recebida. Campo: {rectification.field}. Aguardando verificação de documentos."
    )


# =============================================================================
# DPO CONTACT
# =============================================================================

@app.get("/v1/dpo", tags=["DPO"])
async def get_dpo_info():
    """
    Get Data Protection Officer contact information.
    """
    return {
        "dpo": {
            "name": "Encarregado de Proteção de Dados",
            "email": "dpo@athenapay.com.br",
            "phone": "0800 123 4567",
            "address": "Av. Paulista, 1000, 10º andar, São Paulo - SP, CEP 01310-100"
        },
        "company": {
            "name": "Athena Pay Instituição de Pagamento S.A.",
            "cnpj": "00.000.000/0001-00"
        },
        "privacy_policy": "https://athenapay.com.br/privacidade",
        "lgpd_portal": "https://athenapay.com.br/lgpd"
    }
