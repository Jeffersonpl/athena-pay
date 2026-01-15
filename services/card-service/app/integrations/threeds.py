"""
3D Secure 2.0 Integration
Authentication for e-commerce transactions
"""
import os
import uuid
import logging
import random
import base64
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)

ENV = os.getenv("ENV", "dev")


class ThreeDSVersion(Enum):
    V2_1 = "2.1"
    V2_2 = "2.2"


class TransStatus(Enum):
    AUTHENTICATED = "Y"  # Fully authenticated
    NOT_AUTHENTICATED = "N"  # Not authenticated
    UNABLE = "U"  # Could not be authenticated
    ATTEMPTED = "A"  # Attempted, but not enrolled
    CHALLENGE = "C"  # Challenge required
    REJECTED = "R"  # Authentication rejected


class DeviceChannel(Enum):
    APP = "01"
    BROWSER = "02"
    THREE_RI = "03"  # 3DS Requestor Initiated


@dataclass
class ThreeDSAuthRequest:
    """Request to initiate 3DS authentication"""
    card_token: str
    amount: float
    currency: str
    merchant_id: str
    merchant_name: str
    device_channel: DeviceChannel
    browser_info: Optional[Dict] = None
    sdk_info: Optional[Dict] = None
    cardholder_email: Optional[str] = None
    cardholder_phone: Optional[str] = None
    billing_address: Optional[Dict] = None
    shipping_address: Optional[Dict] = None


@dataclass
class ThreeDSAuthResponse:
    """Response from 3DS authentication"""
    success: bool
    session_id: str
    trans_status: TransStatus
    eci: Optional[str] = None  # Electronic Commerce Indicator
    cavv: Optional[str] = None  # Cardholder Authentication Verification Value
    ds_trans_id: Optional[str] = None  # Directory Server Transaction ID
    acs_url: Optional[str] = None  # For challenge flow
    creq: Optional[str] = None  # Challenge Request (base64)
    error_code: Optional[str] = None
    error_message: Optional[str] = None


@dataclass
class ThreeDSChallengeResult:
    """Result of challenge completion"""
    success: bool
    trans_status: TransStatus
    eci: Optional[str] = None
    cavv: Optional[str] = None


class ThreeDSClient:
    """
    3D Secure 2.0 Client

    In production, this connects to 3DS Server (MPI - Merchant Plug-In)
    which communicates with card schemes' Directory Servers

    For development, provides simulation
    """

    def __init__(self, version: ThreeDSVersion = ThreeDSVersion.V2_2):
        self.version = version
        self.ds_url = os.getenv("THREEDS_DS_URL", "")
        self.merchant_id = os.getenv("THREEDS_MERCHANT_ID", "")

    def _get_eci(self, brand: str, authenticated: bool) -> str:
        """
        Get ECI based on card brand and authentication result

        ECI values:
        - Visa/Amex: 05 (authenticated), 06 (attempted), 07 (not enrolled)
        - Mastercard: 02 (authenticated), 01 (attempted), 00 (not enrolled)
        """
        if brand.upper() in ["VISA", "AMEX"]:
            return "05" if authenticated else "06"
        else:  # Mastercard, Elo, etc.
            return "02" if authenticated else "01"

    def _generate_cavv(self) -> str:
        """Generate a simulated CAVV"""
        return base64.b64encode(os.urandom(20)).decode()[:28]

    async def authenticate(
        self,
        request: ThreeDSAuthRequest,
        card_brand: str = "VISA"
    ) -> ThreeDSAuthResponse:
        """
        Initiate 3DS authentication

        Flow:
        1. Authenticate request sent to Directory Server
        2. DS routes to card issuer's ACS
        3. ACS determines if challenge needed
        4. Return frictionless auth or challenge URL
        """
        session_id = str(uuid.uuid4())

        # In DEV mode, simulate frictionless authentication
        if ENV == "dev":
            return self._simulate_authentication(session_id, request, card_brand)

        # Production: Call real 3DS Server
        # TODO: Implement real 3DS Server integration
        return self._simulate_authentication(session_id, request, card_brand)

    def _simulate_authentication(
        self,
        session_id: str,
        request: ThreeDSAuthRequest,
        card_brand: str
    ) -> ThreeDSAuthResponse:
        """
        Simulate 3DS authentication for testing

        Test scenarios based on amount:
        - Amount ending in .30: Challenge required
        - Amount ending in .40: Not authenticated
        - Amount ending in .50: Unable to authenticate
        - Other: Frictionless success
        """
        decimal = request.amount - int(request.amount)

        # Challenge required
        if 0.29 <= decimal < 0.31:
            return ThreeDSAuthResponse(
                success=True,
                session_id=session_id,
                trans_status=TransStatus.CHALLENGE,
                acs_url="https://acs.simulator.local/challenge",
                creq=base64.b64encode(f'{{"threeDSServerTransID":"{session_id}"}}'.encode()).decode(),
                ds_trans_id=str(uuid.uuid4())
            )

        # Not authenticated
        if 0.39 <= decimal < 0.41:
            return ThreeDSAuthResponse(
                success=False,
                session_id=session_id,
                trans_status=TransStatus.NOT_AUTHENTICATED,
                error_message="Authentication failed"
            )

        # Unable to authenticate
        if 0.49 <= decimal < 0.51:
            return ThreeDSAuthResponse(
                success=False,
                session_id=session_id,
                trans_status=TransStatus.UNABLE,
                error_message="Unable to complete authentication"
            )

        # Frictionless authentication
        return ThreeDSAuthResponse(
            success=True,
            session_id=session_id,
            trans_status=TransStatus.AUTHENTICATED,
            eci=self._get_eci(card_brand, True),
            cavv=self._generate_cavv(),
            ds_trans_id=str(uuid.uuid4())
        )

    async def complete_challenge(
        self,
        session_id: str,
        cres: str  # Challenge Response from ACS
    ) -> ThreeDSChallengeResult:
        """
        Complete 3DS challenge

        Called after user completes challenge at ACS
        """
        # In DEV mode, simulate success
        if ENV == "dev":
            return ThreeDSChallengeResult(
                success=True,
                trans_status=TransStatus.AUTHENTICATED,
                eci="05",
                cavv=self._generate_cavv()
            )

        # TODO: Implement real challenge completion
        return ThreeDSChallengeResult(
            success=True,
            trans_status=TransStatus.AUTHENTICATED,
            eci="05",
            cavv=self._generate_cavv()
        )

    def get_method_notification(self, session_id: str) -> Dict[str, Any]:
        """
        Get 3DS Method notification data

        This is used for device fingerprinting before authentication
        """
        return {
            "threeDSMethodNotificationURL": f"https://api.athena.pay/cards/3ds/notify/{session_id}",
            "threeDSServerTransID": session_id
        }


# Default 3DS client
threeds_client = ThreeDSClient()
