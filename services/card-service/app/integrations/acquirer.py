"""
Acquirer Integration Layer
Abstract interface for card acquirers (Cielo, Rede, Stone, etc.)
"""
import os
import uuid
import logging
import random
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Optional, Dict, Any
from dataclasses import dataclass
from enum import Enum
import httpx

logger = logging.getLogger(__name__)

ENV = os.getenv("ENV", "dev")


class AcquirerType(Enum):
    SIMULATOR = "SIMULATOR"
    CIELO = "CIELO"
    REDE = "REDE"
    STONE = "STONE"
    GETNET = "GETNET"


class TransactionStatus(Enum):
    AUTHORIZED = "AUTHORIZED"
    CAPTURED = "CAPTURED"
    DECLINED = "DECLINED"
    VOIDED = "VOIDED"
    REFUNDED = "REFUNDED"
    ERROR = "ERROR"


class DeclineCode(Enum):
    INSUFFICIENT_FUNDS = "51"
    INVALID_CARD = "14"
    EXPIRED_CARD = "54"
    SUSPECTED_FRAUD = "59"
    RESTRICTED_CARD = "62"
    INCORRECT_CVV = "82"
    INVALID_AMOUNT = "13"
    DO_NOT_HONOR = "05"
    TRANSACTION_NOT_ALLOWED = "57"
    INVALID_MERCHANT = "58"
    LIMIT_EXCEEDED = "61"
    SYSTEM_ERROR = "96"


@dataclass
class AuthorizationRequest:
    """Request for card authorization"""
    card_token: str
    amount: float
    currency: str
    merchant_id: str
    merchant_name: str
    merchant_category_code: str
    installments: int = 1
    capture: bool = True  # Auto-capture
    soft_descriptor: str = None
    three_ds: Optional[Dict] = None


@dataclass
class AuthorizationResponse:
    """Response from authorization"""
    success: bool
    authorization_code: Optional[str] = None
    nsu: Optional[str] = None
    acquirer_reference: Optional[str] = None
    status: TransactionStatus = TransactionStatus.ERROR
    decline_code: Optional[str] = None
    decline_message: Optional[str] = None
    raw_response: Optional[Dict] = None


@dataclass
class CaptureRequest:
    """Request to capture an authorized transaction"""
    authorization_code: str
    amount: float
    nsu: str


@dataclass
class RefundRequest:
    """Request to refund a captured transaction"""
    authorization_code: str
    amount: float
    nsu: str
    reason: str = None


class AcquirerClient(ABC):
    """Abstract base class for acquirer integrations"""

    @abstractmethod
    async def authorize(self, request: AuthorizationRequest) -> AuthorizationResponse:
        """Authorize a card transaction"""
        pass

    @abstractmethod
    async def capture(self, request: CaptureRequest) -> AuthorizationResponse:
        """Capture an authorized transaction"""
        pass

    @abstractmethod
    async def void(self, authorization_code: str, nsu: str) -> AuthorizationResponse:
        """Void an authorized (not captured) transaction"""
        pass

    @abstractmethod
    async def refund(self, request: RefundRequest) -> AuthorizationResponse:
        """Refund a captured transaction"""
        pass


class SimulatorAcquirer(AcquirerClient):
    """
    Simulated acquirer for development and testing
    Provides realistic responses for testing various scenarios
    """

    def __init__(self):
        self.name = "SIMULATOR"

    def _generate_auth_code(self) -> str:
        """Generate a random authorization code"""
        return str(random.randint(100000, 999999))

    def _generate_nsu(self) -> str:
        """Generate a unique NSU"""
        return str(random.randint(100000000000, 999999999999))

    def _should_decline(self, amount: float, card_token: str) -> Optional[DeclineCode]:
        """
        Determine if transaction should be declined based on test scenarios

        Test amounts:
        - 0.51: Insufficient funds
        - 0.14: Invalid card
        - 0.54: Expired card
        - 0.59: Fraud
        - 0.05: Do not honor
        """
        # Check for test amounts (decimal part indicates decline code)
        decimal = amount - int(amount)

        if 0.50 <= decimal < 0.52:
            return DeclineCode.INSUFFICIENT_FUNDS
        elif 0.13 <= decimal < 0.15:
            return DeclineCode.INVALID_CARD
        elif 0.53 <= decimal < 0.55:
            return DeclineCode.EXPIRED_CARD
        elif 0.58 <= decimal < 0.60:
            return DeclineCode.SUSPECTED_FRAUD
        elif 0.04 <= decimal < 0.06:
            return DeclineCode.DO_NOT_HONOR

        # Small random decline rate (2%)
        if random.random() < 0.02:
            return DeclineCode.DO_NOT_HONOR

        return None

    async def authorize(self, request: AuthorizationRequest) -> AuthorizationResponse:
        """Simulate authorization"""
        logger.info(f"Simulator: Authorizing {request.amount} {request.currency}")

        # Check for decline scenarios
        decline = self._should_decline(request.amount, request.card_token)

        if decline:
            return AuthorizationResponse(
                success=False,
                status=TransactionStatus.DECLINED,
                decline_code=decline.value,
                decline_message=decline.name.replace("_", " ").title(),
                raw_response={
                    "simulator": True,
                    "decline_code": decline.value
                }
            )

        auth_code = self._generate_auth_code()
        nsu = self._generate_nsu()

        return AuthorizationResponse(
            success=True,
            authorization_code=auth_code,
            nsu=nsu,
            acquirer_reference=f"SIM-{uuid.uuid4().hex[:12].upper()}",
            status=TransactionStatus.CAPTURED if request.capture else TransactionStatus.AUTHORIZED,
            raw_response={
                "simulator": True,
                "authorization_code": auth_code,
                "nsu": nsu,
                "captured": request.capture
            }
        )

    async def capture(self, request: CaptureRequest) -> AuthorizationResponse:
        """Simulate capture"""
        logger.info(f"Simulator: Capturing {request.amount}")

        return AuthorizationResponse(
            success=True,
            authorization_code=request.authorization_code,
            nsu=request.nsu,
            status=TransactionStatus.CAPTURED,
            raw_response={"simulator": True, "captured": True}
        )

    async def void(self, authorization_code: str, nsu: str) -> AuthorizationResponse:
        """Simulate void"""
        logger.info(f"Simulator: Voiding {authorization_code}")

        return AuthorizationResponse(
            success=True,
            authorization_code=authorization_code,
            nsu=nsu,
            status=TransactionStatus.VOIDED,
            raw_response={"simulator": True, "voided": True}
        )

    async def refund(self, request: RefundRequest) -> AuthorizationResponse:
        """Simulate refund"""
        logger.info(f"Simulator: Refunding {request.amount}")

        return AuthorizationResponse(
            success=True,
            authorization_code=request.authorization_code,
            nsu=self._generate_nsu(),
            status=TransactionStatus.REFUNDED,
            raw_response={"simulator": True, "refunded": True}
        )


class CieloAcquirer(AcquirerClient):
    """
    Cielo acquirer integration (stub for future implementation)
    """

    def __init__(self):
        self.name = "CIELO"
        self.base_url = os.getenv("CIELO_API_URL", "https://api.cielo.com.br")
        self.merchant_id = os.getenv("CIELO_MERCHANT_ID", "")
        self.merchant_key = os.getenv("CIELO_MERCHANT_KEY", "")

    async def authorize(self, request: AuthorizationRequest) -> AuthorizationResponse:
        # TODO: Implement real Cielo integration
        logger.warning("Cielo integration not implemented, using simulator")
        return await SimulatorAcquirer().authorize(request)

    async def capture(self, request: CaptureRequest) -> AuthorizationResponse:
        return await SimulatorAcquirer().capture(request)

    async def void(self, authorization_code: str, nsu: str) -> AuthorizationResponse:
        return await SimulatorAcquirer().void(authorization_code, nsu)

    async def refund(self, request: RefundRequest) -> AuthorizationResponse:
        return await SimulatorAcquirer().refund(request)


class RedeAcquirer(AcquirerClient):
    """
    Rede acquirer integration (stub for future implementation)
    """

    def __init__(self):
        self.name = "REDE"
        self.base_url = os.getenv("REDE_API_URL", "https://api.userede.com.br")

    async def authorize(self, request: AuthorizationRequest) -> AuthorizationResponse:
        logger.warning("Rede integration not implemented, using simulator")
        return await SimulatorAcquirer().authorize(request)

    async def capture(self, request: CaptureRequest) -> AuthorizationResponse:
        return await SimulatorAcquirer().capture(request)

    async def void(self, authorization_code: str, nsu: str) -> AuthorizationResponse:
        return await SimulatorAcquirer().void(authorization_code, nsu)

    async def refund(self, request: RefundRequest) -> AuthorizationResponse:
        return await SimulatorAcquirer().refund(request)


def get_acquirer(acquirer_type: AcquirerType = AcquirerType.SIMULATOR) -> AcquirerClient:
    """
    Factory function to get appropriate acquirer client
    """
    acquirers = {
        AcquirerType.SIMULATOR: SimulatorAcquirer,
        AcquirerType.CIELO: CieloAcquirer,
        AcquirerType.REDE: RedeAcquirer,
    }

    acquirer_class = acquirers.get(acquirer_type, SimulatorAcquirer)
    return acquirer_class()


# Default acquirer
default_acquirer = get_acquirer(
    AcquirerType.SIMULATOR if ENV == "dev" else AcquirerType.CIELO
)
