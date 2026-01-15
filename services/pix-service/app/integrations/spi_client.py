"""
SPI Client - Sistema de Pagamentos Instantâneos
Interface for PIX instant payments with BACEN

In production, this will connect to the real SPI
For now, provides a local simulation with full message structure
"""
import os
import uuid
import logging
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from dataclasses import dataclass
from enum import Enum
import httpx

logger = logging.getLogger(__name__)

# Configuration
SPI_URL = os.getenv("SPI_URL", "http://pix-simulator:8080/spi")
SPI_ISPB = os.getenv("SPI_ISPB", "00000000")  # Athena's ISPB (placeholder)
ENV = os.getenv("ENV", "dev")


class SpiMessageType(Enum):
    """SPI Message Types (ISO 20022 based)"""
    PACS_008 = "pacs.008"  # Credit Transfer
    PACS_002 = "pacs.002"  # Payment Status Report
    PACS_004 = "pacs.004"  # Payment Return
    CAMT_056 = "camt.056"  # Cancel Request
    CAMT_029 = "camt.029"  # Resolution of Investigation


class SpiStatus(Enum):
    """SPI Transaction Status"""
    PENDING = "PENDING"
    ACCEPTED = "ACCP"
    SETTLED = "ACSC"
    REJECTED = "RJCT"
    RETURNED = "RTRN"


class SpiRejectReason(Enum):
    """SPI Rejection Reasons"""
    INSUFFICIENT_FUNDS = "AM04"
    INVALID_ACCOUNT = "AC01"
    CLOSED_ACCOUNT = "AC04"
    BLOCKED_ACCOUNT = "AC06"
    INVALID_CREDITOR = "AC07"
    INVALID_DEBTOR = "AM03"
    DUPLICATE = "AM05"
    INVALID_AMOUNT = "AM09"
    LIMIT_EXCEEDED = "AM02"
    TECHNICAL_ERROR = "AM21"
    TIMEOUT = "AB09"
    FRAUD = "FRAUD"


@dataclass
class SpiParticipant:
    """SPI Participant Information"""
    ispb: str
    name: str
    document: str
    document_type: str  # CPF or CNPJ
    account: str
    branch: Optional[str] = None
    account_type: str = "CACC"


@dataclass
class SpiTransfer:
    """SPI Transfer Request"""
    e2e_id: str
    amount: float
    currency: str
    debtor: SpiParticipant
    creditor: SpiParticipant
    pix_key: Optional[str] = None
    pix_key_type: Optional[str] = None
    description: Optional[str] = None
    tx_id: Optional[str] = None


@dataclass
class SpiResponse:
    """Response from SPI operations"""
    success: bool
    e2e_id: Optional[str] = None
    status: Optional[SpiStatus] = None
    settled_at: Optional[datetime] = None
    reject_reason: Optional[SpiRejectReason] = None
    reject_message: Optional[str] = None
    raw_response: Optional[Dict[str, Any]] = None


def generate_e2e_id(ispb: str = SPI_ISPB) -> str:
    """
    Generate End-to-End ID for PIX transaction

    Format: E{ISPB}{YYYYMMDDHHMMSS}{SEQUENCE}
    Total: 32 characters

    Args:
        ispb: ISPB of the initiating participant

    Returns:
        32-character E2E ID
    """
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    sequence = uuid.uuid4().hex[:10].upper()
    return f"E{ispb}{timestamp}{sequence}"


class SpiClient:
    """
    Client for SPI (Sistema de Pagamentos Instantâneos)

    In production:
    - Uses mTLS for authentication
    - Connects to BACEN's SPI RSFN network
    - Follows ISO 20022 message format
    - Requires PIX participant certification

    For development:
    - Simulates SPI responses locally
    - Full message structure for testing
    """

    def __init__(self, ispb: str = SPI_ISPB, timeout: float = 30.0):
        self.ispb = ispb
        self.timeout = timeout
        self.base_url = SPI_URL

    async def send_transfer(self, transfer: SpiTransfer) -> SpiResponse:
        """
        Send PIX transfer via SPI (pacs.008)

        Args:
            transfer: SpiTransfer with all payment details

        Returns:
            SpiResponse with settlement status
        """
        logger.info(f"SPI: Sending transfer {transfer.e2e_id} for {transfer.amount}")

        # In DEV mode, simulate success
        if ENV == "dev":
            return self._simulate_transfer(transfer)

        # Production: call real SPI API
        try:
            message = self._build_pacs008(transfer)

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/messages",
                    json=message,
                    headers=self._get_headers()
                )

                if response.status_code == 200:
                    data = response.json()
                    return self._parse_response(data)
                else:
                    data = response.json()
                    return SpiResponse(
                        success=False,
                        e2e_id=transfer.e2e_id,
                        status=SpiStatus.REJECTED,
                        reject_reason=SpiRejectReason.TECHNICAL_ERROR,
                        reject_message=data.get("message", "SPI error"),
                        raw_response=data
                    )

        except Exception as e:
            logger.error(f"SPI send_transfer error: {e}")
            return SpiResponse(
                success=False,
                e2e_id=transfer.e2e_id,
                status=SpiStatus.REJECTED,
                reject_reason=SpiRejectReason.TECHNICAL_ERROR,
                reject_message=str(e)
            )

    async def request_return(
        self,
        original_e2e_id: str,
        return_e2e_id: str,
        amount: float,
        reason: str = "FRAUD"
    ) -> SpiResponse:
        """
        Request return/devolution of PIX (pacs.004)

        Args:
            original_e2e_id: E2E ID of original transaction
            return_e2e_id: New E2E ID for return
            amount: Amount to return
            reason: Reason for return

        Returns:
            SpiResponse with return status
        """
        logger.info(f"SPI: Requesting return for {original_e2e_id}")

        if ENV == "dev":
            return SpiResponse(
                success=True,
                e2e_id=return_e2e_id,
                status=SpiStatus.SETTLED,
                settled_at=datetime.utcnow()
            )

        try:
            message = self._build_pacs004(original_e2e_id, return_e2e_id, amount, reason)

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/messages",
                    json=message,
                    headers=self._get_headers()
                )

                if response.status_code == 200:
                    data = response.json()
                    return self._parse_response(data)
                else:
                    data = response.json()
                    return SpiResponse(
                        success=False,
                        e2e_id=return_e2e_id,
                        status=SpiStatus.REJECTED,
                        reject_message=data.get("message"),
                        raw_response=data
                    )

        except Exception as e:
            logger.error(f"SPI request_return error: {e}")
            return SpiResponse(
                success=False,
                e2e_id=return_e2e_id,
                status=SpiStatus.REJECTED,
                reject_message=str(e)
            )

    async def query_status(self, e2e_id: str) -> SpiResponse:
        """
        Query status of a PIX transaction

        Args:
            e2e_id: E2E ID to query

        Returns:
            SpiResponse with current status
        """
        logger.info(f"SPI: Querying status for {e2e_id}")

        if ENV == "dev":
            return SpiResponse(
                success=True,
                e2e_id=e2e_id,
                status=SpiStatus.SETTLED,
                settled_at=datetime.utcnow() - timedelta(seconds=5)
            )

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.base_url}/transactions/{e2e_id}",
                    headers=self._get_headers()
                )

                if response.status_code == 200:
                    data = response.json()
                    return self._parse_response(data)
                else:
                    return SpiResponse(
                        success=False,
                        e2e_id=e2e_id,
                        status=SpiStatus.PENDING
                    )

        except Exception as e:
            logger.error(f"SPI query_status error: {e}")
            return SpiResponse(
                success=False,
                e2e_id=e2e_id,
                status=SpiStatus.PENDING,
                reject_message=str(e)
            )

    def _get_headers(self) -> Dict[str, str]:
        """Get headers for SPI API calls"""
        return {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Participant-ISPB": self.ispb,
            "X-Request-Id": str(uuid.uuid4()),
            "X-Message-Id": str(uuid.uuid4())
        }

    def _build_pacs008(self, transfer: SpiTransfer) -> Dict[str, Any]:
        """
        Build pacs.008 (FIToFICustomerCreditTransfer) message

        Based on ISO 20022 format adapted for PIX
        """
        return {
            "messageType": "pacs.008",
            "messageId": str(uuid.uuid4()),
            "creationDateTime": datetime.utcnow().isoformat(),
            "numberOfTransactions": 1,
            "settlementMethod": "CLRG",
            "creditTransfer": {
                "endToEndId": transfer.e2e_id,
                "txId": transfer.tx_id,
                "amount": {
                    "value": transfer.amount,
                    "currency": transfer.currency
                },
                "debtor": {
                    "name": transfer.debtor.name,
                    "taxId": transfer.debtor.document,
                    "taxIdType": transfer.debtor.document_type
                },
                "debtorAccount": {
                    "ispb": transfer.debtor.ispb,
                    "branch": transfer.debtor.branch,
                    "number": transfer.debtor.account,
                    "type": transfer.debtor.account_type
                },
                "creditor": {
                    "name": transfer.creditor.name,
                    "taxId": transfer.creditor.document,
                    "taxIdType": transfer.creditor.document_type
                },
                "creditorAccount": {
                    "ispb": transfer.creditor.ispb,
                    "branch": transfer.creditor.branch,
                    "number": transfer.creditor.account,
                    "type": transfer.creditor.account_type
                },
                "pixKey": transfer.pix_key,
                "pixKeyType": transfer.pix_key_type,
                "remittanceInformation": transfer.description
            }
        }

    def _build_pacs004(
        self,
        original_e2e_id: str,
        return_e2e_id: str,
        amount: float,
        reason: str
    ) -> Dict[str, Any]:
        """
        Build pacs.004 (PaymentReturn) message
        """
        return {
            "messageType": "pacs.004",
            "messageId": str(uuid.uuid4()),
            "creationDateTime": datetime.utcnow().isoformat(),
            "originalEndToEndId": original_e2e_id,
            "returnEndToEndId": return_e2e_id,
            "returnAmount": amount,
            "returnReason": reason,
            "returnReasonDescription": self._get_return_reason_description(reason)
        }

    def _get_return_reason_description(self, reason: str) -> str:
        """Get human-readable return reason"""
        reasons = {
            "FRAUD": "Devolucao por fraude",
            "OPERATIONAL_FAILURE": "Falha operacional",
            "REQUESTED_BY_RECEIVER": "Devolucao solicitada pelo recebedor",
            "DUPLICATE": "Transacao duplicada"
        }
        return reasons.get(reason, "Devolucao solicitada")

    def _simulate_transfer(self, transfer: SpiTransfer) -> SpiResponse:
        """
        Simulate SPI transfer for dev environment

        Simulates:
        - Instant settlement (most cases)
        - Random delays
        - Occasional rejections (for testing)
        """
        import random

        # 95% success rate in simulation
        if random.random() < 0.95:
            return SpiResponse(
                success=True,
                e2e_id=transfer.e2e_id,
                status=SpiStatus.SETTLED,
                settled_at=datetime.utcnow(),
                raw_response={
                    "status": "ACSC",
                    "settledAt": datetime.utcnow().isoformat(),
                    "message": "Simulated settlement successful"
                }
            )
        else:
            # Simulate rejection
            return SpiResponse(
                success=False,
                e2e_id=transfer.e2e_id,
                status=SpiStatus.REJECTED,
                reject_reason=SpiRejectReason.TECHNICAL_ERROR,
                reject_message="Simulated rejection for testing"
            )

    def _parse_response(self, data: Dict[str, Any]) -> SpiResponse:
        """Parse SPI response into SpiResponse"""
        status_map = {
            "ACCP": SpiStatus.ACCEPTED,
            "ACSC": SpiStatus.SETTLED,
            "RJCT": SpiStatus.REJECTED,
            "RTRN": SpiStatus.RETURNED,
            "PDNG": SpiStatus.PENDING
        }

        status = status_map.get(data.get("status"), SpiStatus.PENDING)
        settled_at = None
        if data.get("settledAt"):
            settled_at = datetime.fromisoformat(data["settledAt"].replace("Z", ""))

        reject_reason = None
        if data.get("rejectReason"):
            try:
                reject_reason = SpiRejectReason(data["rejectReason"])
            except ValueError:
                pass

        return SpiResponse(
            success=status == SpiStatus.SETTLED,
            e2e_id=data.get("endToEndId"),
            status=status,
            settled_at=settled_at,
            reject_reason=reject_reason,
            reject_message=data.get("rejectMessage"),
            raw_response=data
        )


# Default client instance
spi_client = SpiClient()
