"""
Athena Audit Client
Client library for sending audit logs from any service
"""
import os
import httpx
import logging
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

logger = logging.getLogger(__name__)

AUDIT_SERVICE_URL = os.getenv("AUDIT_SERVICE_URL", "http://audit-service:8080")

class AuditAction(str, Enum):
    # Auth actions
    LOGIN = "LOGIN"
    LOGOUT = "LOGOUT"
    LOGIN_FAILED = "LOGIN_FAILED"
    PASSWORD_CHANGE = "PASSWORD_CHANGE"

    # CRUD actions
    CREATE = "CREATE"
    READ = "READ"
    UPDATE = "UPDATE"
    DELETE = "DELETE"

    # Financial actions
    CREDIT = "CREDIT"
    DEBIT = "DEBIT"
    TRANSFER = "TRANSFER"
    PIX_SEND = "PIX_SEND"
    PIX_RECEIVE = "PIX_RECEIVE"
    PIX_KEY_CREATE = "PIX_KEY_CREATE"
    PIX_KEY_DELETE = "PIX_KEY_DELETE"
    CARD_ISSUE = "CARD_ISSUE"
    CARD_BLOCK = "CARD_BLOCK"
    CARD_AUTHORIZE = "CARD_AUTHORIZE"
    LOAN_APPLY = "LOAN_APPLY"
    LOAN_APPROVE = "LOAN_APPROVE"
    LOAN_REJECT = "LOAN_REJECT"
    BOLETO_GENERATE = "BOLETO_GENERATE"
    BOLETO_PAY = "BOLETO_PAY"
    TED_SEND = "TED_SEND"
    DOC_SEND = "DOC_SEND"

    # KYC actions
    KYC_SUBMIT = "KYC_SUBMIT"
    KYC_APPROVE = "KYC_APPROVE"
    KYC_REJECT = "KYC_REJECT"
    DOCUMENT_UPLOAD = "DOCUMENT_UPLOAD"
    FACE_VALIDATE = "FACE_VALIDATE"

    # Admin actions
    ADMIN_ACCESS = "ADMIN_ACCESS"
    CONFIG_CHANGE = "CONFIG_CHANGE"
    LIMIT_CHANGE = "LIMIT_CHANGE"
    RULE_CHANGE = "RULE_CHANGE"

    # Compliance actions
    AML_ALERT = "AML_ALERT"
    AML_REVIEW = "AML_REVIEW"
    SAR_FILE = "SAR_FILE"
    BLOCK_ACCOUNT = "BLOCK_ACCOUNT"
    UNBLOCK_ACCOUNT = "UNBLOCK_ACCOUNT"

class AuditResource(str, Enum):
    ACCOUNT = "ACCOUNT"
    CUSTOMER = "CUSTOMER"
    TRANSACTION = "TRANSACTION"
    PIX_KEY = "PIX_KEY"
    PIX_TRANSACTION = "PIX_TRANSACTION"
    CARD = "CARD"
    CARD_TRANSACTION = "CARD_TRANSACTION"
    LOAN = "LOAN"
    LOAN_APPLICATION = "LOAN_APPLICATION"
    BOLETO = "BOLETO"
    WIRE = "WIRE"
    KYC_SUBMISSION = "KYC_SUBMISSION"
    DOCUMENT = "DOCUMENT"
    CONFIG = "CONFIG"
    AML_ALERT = "AML_ALERT"
    USER = "USER"
    SESSION = "SESSION"

class AuditResult(str, Enum):
    SUCCESS = "SUCCESS"
    FAILURE = "FAILURE"
    PENDING = "PENDING"
    BLOCKED = "BLOCKED"

class AuditClient:
    """
    Async client for sending audit logs
    """

    def __init__(self, service_name: str, base_url: Optional[str] = None):
        self.service_name = service_name
        self.base_url = base_url or AUDIT_SERVICE_URL
        self._client: Optional[httpx.AsyncClient] = None

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None:
            self._client = httpx.AsyncClient(timeout=5.0)
        return self._client

    async def log(
        self,
        action: AuditAction,
        resource_type: AuditResource,
        resource_id: str,
        actor_id: str,
        actor_type: str = "USER",
        result: AuditResult = AuditResult.SUCCESS,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        request_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> bool:
        """
        Send audit log entry
        Returns True if successfully logged, False otherwise
        """
        try:
            client = await self._get_client()

            payload = {
                "service_name": self.service_name,
                "action": action.value if isinstance(action, AuditAction) else action,
                "resource_type": resource_type.value if isinstance(resource_type, AuditResource) else resource_type,
                "resource_id": str(resource_id),
                "actor_id": str(actor_id),
                "actor_type": actor_type,
                "result": result.value if isinstance(result, AuditResult) else result,
                "ip_address": ip_address,
                "user_agent": user_agent,
                "request_id": request_id,
                "metadata": metadata or {},
                "timestamp": datetime.utcnow().isoformat()
            }

            response = await client.post(
                f"{self.base_url}/audit/log",
                json=payload
            )

            if response.status_code != 200:
                logger.warning(f"Audit log failed: {response.status_code}")
                return False

            return True

        except Exception as e:
            # Audit logging should never break the main flow
            logger.error(f"Audit log error: {e}")
            return False

    async def log_security_event(
        self,
        event_type: str,
        severity: str,
        description: str,
        source_ip: Optional[str] = None,
        user_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> bool:
        """
        Log a security event (failed login, suspicious activity, etc.)
        """
        try:
            client = await self._get_client()

            payload = {
                "service_name": self.service_name,
                "event_type": event_type,
                "severity": severity,
                "description": description,
                "source_ip": source_ip,
                "user_id": user_id,
                "metadata": metadata or {},
                "timestamp": datetime.utcnow().isoformat()
            }

            response = await client.post(
                f"{self.base_url}/security/events",
                json=payload
            )

            return response.status_code == 200

        except Exception as e:
            logger.error(f"Security event log error: {e}")
            return False

    async def close(self):
        """Close the HTTP client"""
        if self._client:
            await self._client.aclose()
            self._client = None


# Sync version for simpler use cases
class SyncAuditClient:
    """
    Synchronous client for sending audit logs
    """

    def __init__(self, service_name: str, base_url: Optional[str] = None):
        self.service_name = service_name
        self.base_url = base_url or AUDIT_SERVICE_URL

    def log(
        self,
        action: AuditAction,
        resource_type: AuditResource,
        resource_id: str,
        actor_id: str,
        actor_type: str = "USER",
        result: AuditResult = AuditResult.SUCCESS,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        request_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> bool:
        """Send audit log entry synchronously"""
        try:
            payload = {
                "service_name": self.service_name,
                "action": action.value if isinstance(action, AuditAction) else action,
                "resource_type": resource_type.value if isinstance(resource_type, AuditResource) else resource_type,
                "resource_id": str(resource_id),
                "actor_id": str(actor_id),
                "actor_type": actor_type,
                "result": result.value if isinstance(result, AuditResult) else result,
                "ip_address": ip_address,
                "user_agent": user_agent,
                "request_id": request_id,
                "metadata": metadata or {},
                "timestamp": datetime.utcnow().isoformat()
            }

            response = httpx.post(
                f"{self.base_url}/audit/log",
                json=payload,
                timeout=5.0
            )

            return response.status_code == 200

        except Exception as e:
            logger.error(f"Audit log error: {e}")
            return False

    def log_security_event(
        self,
        event_type: str,
        severity: str,
        description: str,
        source_ip: Optional[str] = None,
        user_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> bool:
        """Log a security event synchronously"""
        try:
            payload = {
                "service_name": self.service_name,
                "event_type": event_type,
                "severity": severity,
                "description": description,
                "source_ip": source_ip,
                "user_id": user_id,
                "metadata": metadata or {},
                "timestamp": datetime.utcnow().isoformat()
            }

            response = httpx.post(
                f"{self.base_url}/security/events",
                json=payload,
                timeout=5.0
            )

            return response.status_code == 200

        except Exception as e:
            logger.error(f"Security event log error: {e}")
            return False
