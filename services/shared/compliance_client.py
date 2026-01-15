"""
Athena Compliance Client
Client library for compliance checks from any service
"""
import os
import httpx
import logging
from typing import Optional, Dict, Any, List
from decimal import Decimal
from enum import Enum
from dataclasses import dataclass

logger = logging.getLogger(__name__)

COMPLIANCE_SERVICE_URL = os.getenv("COMPLIANCE_SERVICE_URL", "http://compliance-service:8080")

class TransactionType(str, Enum):
    PIX = "PIX"
    TED = "TED"
    DOC = "DOC"
    CARD = "CARD"
    BOLETO = "BOLETO"
    INTERNAL = "INTERNAL"
    WITHDRAWAL = "WITHDRAWAL"
    DEPOSIT = "DEPOSIT"

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"
    BLOCKED = "BLOCKED"

class ComplianceDecision(str, Enum):
    APPROVED = "APPROVED"
    MANUAL_REVIEW = "MANUAL_REVIEW"
    BLOCKED = "BLOCKED"
    ALERT = "ALERT"

@dataclass
class ComplianceResult:
    decision: ComplianceDecision
    risk_level: RiskLevel
    alerts: List[str]
    limits: Dict[str, Any]
    message: str
    reference_id: str

class ComplianceClient:
    """
    Async client for compliance checks
    """

    def __init__(self, service_name: str, base_url: Optional[str] = None):
        self.service_name = service_name
        self.base_url = base_url or COMPLIANCE_SERVICE_URL
        self._client: Optional[httpx.AsyncClient] = None

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None:
            self._client = httpx.AsyncClient(timeout=10.0)
        return self._client

    async def check_transaction(
        self,
        customer_id: str,
        transaction_type: TransactionType,
        amount: Decimal,
        currency: str = "BRL",
        recipient_id: Optional[str] = None,
        recipient_document: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> ComplianceResult:
        """
        Pre-transaction compliance check
        Should be called before executing any transaction
        """
        try:
            client = await self._get_client()

            payload = {
                "customer_id": customer_id,
                "transaction_type": transaction_type.value,
                "amount": str(amount),
                "currency": currency,
                "recipient_id": recipient_id,
                "recipient_document": recipient_document,
                "metadata": metadata or {},
                "source_service": self.service_name
            }

            response = await client.post(
                f"{self.base_url}/compliance/check/transaction",
                json=payload
            )

            if response.status_code == 200:
                data = response.json()
                return ComplianceResult(
                    decision=ComplianceDecision(data.get("decision", "APPROVED")),
                    risk_level=RiskLevel(data.get("risk_level", "LOW")),
                    alerts=data.get("alerts", []),
                    limits=data.get("limits", {}),
                    message=data.get("message", ""),
                    reference_id=data.get("reference_id", "")
                )
            else:
                # On error, default to manual review (fail-safe)
                logger.warning(f"Compliance check returned {response.status_code}")
                return ComplianceResult(
                    decision=ComplianceDecision.MANUAL_REVIEW,
                    risk_level=RiskLevel.MEDIUM,
                    alerts=["Compliance service unavailable"],
                    limits={},
                    message="Unable to verify compliance - requires manual review",
                    reference_id=""
                )

        except Exception as e:
            logger.error(f"Compliance check error: {e}")
            # Fail-safe: manual review when service is down
            return ComplianceResult(
                decision=ComplianceDecision.MANUAL_REVIEW,
                risk_level=RiskLevel.MEDIUM,
                alerts=["Compliance service error"],
                limits={},
                message=str(e),
                reference_id=""
            )

    async def check_customer(
        self,
        customer_id: str,
        document: str,
        name: str,
        check_pep: bool = True,
        check_sanctions: bool = True
    ) -> ComplianceResult:
        """
        Customer screening for PEP, sanctions, etc.
        """
        try:
            client = await self._get_client()

            payload = {
                "customer_id": customer_id,
                "document": document,
                "name": name,
                "check_pep": check_pep,
                "check_sanctions": check_sanctions,
                "source_service": self.service_name
            }

            response = await client.post(
                f"{self.base_url}/compliance/check/customer",
                json=payload
            )

            if response.status_code == 200:
                data = response.json()
                return ComplianceResult(
                    decision=ComplianceDecision(data.get("decision", "APPROVED")),
                    risk_level=RiskLevel(data.get("risk_level", "LOW")),
                    alerts=data.get("alerts", []),
                    limits=data.get("limits", {}),
                    message=data.get("message", ""),
                    reference_id=data.get("reference_id", "")
                )
            else:
                return ComplianceResult(
                    decision=ComplianceDecision.MANUAL_REVIEW,
                    risk_level=RiskLevel.MEDIUM,
                    alerts=["Customer screening unavailable"],
                    limits={},
                    message="Unable to screen customer",
                    reference_id=""
                )

        except Exception as e:
            logger.error(f"Customer screening error: {e}")
            return ComplianceResult(
                decision=ComplianceDecision.MANUAL_REVIEW,
                risk_level=RiskLevel.MEDIUM,
                alerts=["Screening service error"],
                limits={},
                message=str(e),
                reference_id=""
            )

    async def get_limits(
        self,
        customer_id: str,
        kyc_level: int,
        customer_type: str = "PF"
    ) -> Dict[str, Any]:
        """
        Get transaction limits for customer based on KYC level
        """
        try:
            client = await self._get_client()

            response = await client.get(
                f"{self.base_url}/compliance/limits/{customer_type}/{kyc_level}",
                params={"customer_id": customer_id}
            )

            if response.status_code == 200:
                return response.json()
            else:
                # Default limits if service unavailable
                return self._default_limits(kyc_level, customer_type)

        except Exception as e:
            logger.error(f"Get limits error: {e}")
            return self._default_limits(kyc_level, customer_type)

    def _default_limits(self, kyc_level: int, customer_type: str) -> Dict[str, Any]:
        """Default limits when service is unavailable"""
        base_limits = {
            "PF": {
                0: {"daily": 500, "monthly": 2000, "per_transaction": 200},
                1: {"daily": 2000, "monthly": 10000, "per_transaction": 1000},
                2: {"daily": 10000, "monthly": 50000, "per_transaction": 5000},
                3: {"daily": 50000, "monthly": 200000, "per_transaction": 20000},
            },
            "PJ": {
                0: {"daily": 2000, "monthly": 10000, "per_transaction": 1000},
                1: {"daily": 10000, "monthly": 50000, "per_transaction": 5000},
                2: {"daily": 50000, "monthly": 200000, "per_transaction": 20000},
                3: {"daily": 200000, "monthly": 1000000, "per_transaction": 100000},
            }
        }

        limits_by_type = base_limits.get(customer_type, base_limits["PF"])
        return limits_by_type.get(kyc_level, limits_by_type[0])

    async def report_suspicious_activity(
        self,
        customer_id: str,
        activity_type: str,
        description: str,
        transaction_ids: Optional[List[str]] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> bool:
        """
        Report suspicious activity for compliance review
        """
        try:
            client = await self._get_client()

            payload = {
                "customer_id": customer_id,
                "activity_type": activity_type,
                "description": description,
                "transaction_ids": transaction_ids or [],
                "metadata": metadata or {},
                "source_service": self.service_name
            }

            response = await client.post(
                f"{self.base_url}/compliance/alerts",
                json=payload
            )

            return response.status_code == 200

        except Exception as e:
            logger.error(f"Report suspicious activity error: {e}")
            return False

    async def close(self):
        """Close the HTTP client"""
        if self._client:
            await self._client.aclose()
            self._client = None


# Sync version
class SyncComplianceClient:
    """Synchronous compliance client"""

    def __init__(self, service_name: str, base_url: Optional[str] = None):
        self.service_name = service_name
        self.base_url = base_url or COMPLIANCE_SERVICE_URL

    def check_transaction(
        self,
        customer_id: str,
        transaction_type: TransactionType,
        amount: Decimal,
        currency: str = "BRL",
        recipient_id: Optional[str] = None,
        recipient_document: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> ComplianceResult:
        """Pre-transaction compliance check (sync)"""
        try:
            payload = {
                "customer_id": customer_id,
                "transaction_type": transaction_type.value,
                "amount": str(amount),
                "currency": currency,
                "recipient_id": recipient_id,
                "recipient_document": recipient_document,
                "metadata": metadata or {},
                "source_service": self.service_name
            }

            response = httpx.post(
                f"{self.base_url}/compliance/check/transaction",
                json=payload,
                timeout=10.0
            )

            if response.status_code == 200:
                data = response.json()
                return ComplianceResult(
                    decision=ComplianceDecision(data.get("decision", "APPROVED")),
                    risk_level=RiskLevel(data.get("risk_level", "LOW")),
                    alerts=data.get("alerts", []),
                    limits=data.get("limits", {}),
                    message=data.get("message", ""),
                    reference_id=data.get("reference_id", "")
                )
            else:
                return ComplianceResult(
                    decision=ComplianceDecision.MANUAL_REVIEW,
                    risk_level=RiskLevel.MEDIUM,
                    alerts=["Compliance service unavailable"],
                    limits={},
                    message="Unable to verify compliance",
                    reference_id=""
                )

        except Exception as e:
            logger.error(f"Compliance check error: {e}")
            return ComplianceResult(
                decision=ComplianceDecision.MANUAL_REVIEW,
                risk_level=RiskLevel.MEDIUM,
                alerts=["Compliance service error"],
                limits={},
                message=str(e),
                reference_id=""
            )
