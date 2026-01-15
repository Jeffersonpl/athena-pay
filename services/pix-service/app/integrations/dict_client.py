"""
DICT Client - Diretório de Identificadores de Contas Transacionais
Interface for PIX key management with BACEN

In production, this will connect to the real DICT API
For now, provides a local simulation
"""
import os
import uuid
import logging
from datetime import datetime
from typing import Optional, Dict, Any
from dataclasses import dataclass
from enum import Enum
import httpx

logger = logging.getLogger(__name__)

# Configuration
DICT_URL = os.getenv("DICT_URL", "http://pix-simulator:8080/dict")
DICT_ISPB = os.getenv("DICT_ISPB", "00000000")  # Athena's ISPB (placeholder)
ENV = os.getenv("ENV", "dev")


class DictOperationType(Enum):
    CREATE = "CREATE"
    DELETE = "DELETE"
    PORTABILITY = "PORTABILITY"
    OWNERSHIP = "OWNERSHIP"


class DictKeyStatus(Enum):
    ACTIVE = "ACTIVE"
    PENDING = "PENDING"
    PORTABILITY_CLAIM = "PORTABILITY_CLAIM"
    OWNERSHIP_CLAIM = "OWNERSHIP_CLAIM"
    DELETED = "DELETED"


@dataclass
class DictKeyInfo:
    """Information about a PIX key from DICT"""
    key: str
    key_type: str
    owner_name: str
    owner_document: str
    owner_type: str  # PF/PJ
    ispb: str
    branch: Optional[str]
    account: str
    account_type: str
    created_at: datetime
    status: DictKeyStatus


@dataclass
class DictResponse:
    """Response from DICT operations"""
    success: bool
    key_id: Optional[str] = None
    key_info: Optional[DictKeyInfo] = None
    error_code: Optional[str] = None
    error_message: Optional[str] = None
    raw_response: Optional[Dict[str, Any]] = None


class DictClient:
    """
    Client for DICT (Diretório de Identificadores de Contas Transacionais)

    In production:
    - Uses mTLS for authentication
    - Connects to BACEN's DICT API
    - Requires PIX participant certification

    For development:
    - Simulates DICT responses locally
    """

    def __init__(self, ispb: str = DICT_ISPB, timeout: float = 30.0):
        self.ispb = ispb
        self.timeout = timeout
        self.base_url = DICT_URL

    async def create_key(
        self,
        key_value: str,
        key_type: str,
        owner_name: str,
        owner_document: str,
        owner_type: str,
        account: str,
        branch: Optional[str] = None,
        account_type: str = "CACC"
    ) -> DictResponse:
        """
        Register a new PIX key in DICT

        Args:
            key_value: The PIX key (CPF, CNPJ, email, phone, or EVP)
            key_type: Type of key (CPF, CNPJ, EMAIL, PHONE, EVP)
            owner_name: Name of the key owner
            owner_document: CPF or CNPJ of owner
            owner_type: PF or PJ
            account: Account number
            branch: Branch code (optional)
            account_type: CACC (checking), SVGS (savings), TRAN (transaction)

        Returns:
            DictResponse with key_id if successful
        """
        logger.info(f"DICT: Creating key {key_type}:{key_value[:4]}*** for {owner_document[:4]}***")

        # In DEV mode, simulate success
        if ENV == "dev":
            return self._simulate_create_key(
                key_value, key_type, owner_name, owner_document,
                owner_type, account, branch, account_type
            )

        # Production: call real DICT API
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/keys",
                    json={
                        "key": key_value,
                        "keyType": key_type,
                        "participant": {
                            "ispb": self.ispb,
                            "branch": branch,
                            "account": account,
                            "accountType": account_type
                        },
                        "owner": {
                            "name": owner_name,
                            "taxIdNumber": owner_document,
                            "type": owner_type
                        }
                    },
                    headers=self._get_headers()
                )

                if response.status_code == 201:
                    data = response.json()
                    return DictResponse(
                        success=True,
                        key_id=data.get("keyId"),
                        raw_response=data
                    )
                else:
                    data = response.json()
                    return DictResponse(
                        success=False,
                        error_code=data.get("code"),
                        error_message=data.get("message"),
                        raw_response=data
                    )

        except Exception as e:
            logger.error(f"DICT create_key error: {e}")
            return DictResponse(
                success=False,
                error_code="CONNECTION_ERROR",
                error_message=str(e)
            )

    async def lookup_key(self, key_value: str) -> DictResponse:
        """
        Look up a PIX key in DICT

        Args:
            key_value: The PIX key to look up

        Returns:
            DictResponse with key_info if found
        """
        logger.info(f"DICT: Looking up key {key_value[:4]}***")

        # In DEV mode, simulate
        if ENV == "dev":
            return self._simulate_lookup_key(key_value)

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.base_url}/keys/{key_value}",
                    headers=self._get_headers()
                )

                if response.status_code == 200:
                    data = response.json()
                    return DictResponse(
                        success=True,
                        key_info=self._parse_key_info(data),
                        raw_response=data
                    )
                elif response.status_code == 404:
                    return DictResponse(
                        success=False,
                        error_code="KEY_NOT_FOUND",
                        error_message="PIX key not found in DICT"
                    )
                else:
                    data = response.json()
                    return DictResponse(
                        success=False,
                        error_code=data.get("code"),
                        error_message=data.get("message"),
                        raw_response=data
                    )

        except Exception as e:
            logger.error(f"DICT lookup_key error: {e}")
            return DictResponse(
                success=False,
                error_code="CONNECTION_ERROR",
                error_message=str(e)
            )

    async def delete_key(self, key_value: str, reason: str = "USER_REQUESTED") -> DictResponse:
        """
        Delete a PIX key from DICT

        Args:
            key_value: The PIX key to delete
            reason: Reason for deletion

        Returns:
            DictResponse indicating success/failure
        """
        logger.info(f"DICT: Deleting key {key_value[:4]}***")

        if ENV == "dev":
            return DictResponse(success=True)

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.delete(
                    f"{self.base_url}/keys/{key_value}",
                    json={"reason": reason},
                    headers=self._get_headers()
                )

                if response.status_code in [200, 204]:
                    return DictResponse(success=True)
                else:
                    data = response.json()
                    return DictResponse(
                        success=False,
                        error_code=data.get("code"),
                        error_message=data.get("message"),
                        raw_response=data
                    )

        except Exception as e:
            logger.error(f"DICT delete_key error: {e}")
            return DictResponse(
                success=False,
                error_code="CONNECTION_ERROR",
                error_message=str(e)
            )

    async def claim_portability(
        self,
        key_value: str,
        owner_document: str,
        new_account: str,
        new_branch: Optional[str] = None
    ) -> DictResponse:
        """
        Initiate a portability claim for a PIX key

        This allows a user to move their key to a new bank account

        Args:
            key_value: The PIX key to port
            owner_document: Document of the owner requesting portability
            new_account: New account number
            new_branch: New branch code

        Returns:
            DictResponse with claim_id if successful
        """
        logger.info(f"DICT: Portability claim for {key_value[:4]}***")

        if ENV == "dev":
            return DictResponse(
                success=True,
                key_id=f"CLAIM-{uuid.uuid4().hex[:16].upper()}"
            )

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/claims",
                    json={
                        "key": key_value,
                        "claimType": "PORTABILITY",
                        "claimer": {
                            "ispb": self.ispb,
                            "branch": new_branch,
                            "account": new_account,
                            "taxIdNumber": owner_document
                        }
                    },
                    headers=self._get_headers()
                )

                if response.status_code == 201:
                    data = response.json()
                    return DictResponse(
                        success=True,
                        key_id=data.get("claimId"),
                        raw_response=data
                    )
                else:
                    data = response.json()
                    return DictResponse(
                        success=False,
                        error_code=data.get("code"),
                        error_message=data.get("message"),
                        raw_response=data
                    )

        except Exception as e:
            logger.error(f"DICT claim_portability error: {e}")
            return DictResponse(
                success=False,
                error_code="CONNECTION_ERROR",
                error_message=str(e)
            )

    def _get_headers(self) -> Dict[str, str]:
        """Get headers for DICT API calls"""
        return {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Participant-ISPB": self.ispb,
            "X-Request-Id": str(uuid.uuid4())
        }

    def _simulate_create_key(
        self,
        key_value: str,
        key_type: str,
        owner_name: str,
        owner_document: str,
        owner_type: str,
        account: str,
        branch: Optional[str],
        account_type: str
    ) -> DictResponse:
        """Simulate DICT key creation for dev environment"""
        # Generate a simulated key ID
        key_id = f"KEY-{uuid.uuid4().hex[:16].upper()}"

        return DictResponse(
            success=True,
            key_id=key_id,
            key_info=DictKeyInfo(
                key=key_value,
                key_type=key_type,
                owner_name=owner_name,
                owner_document=owner_document,
                owner_type=owner_type,
                ispb=self.ispb,
                branch=branch,
                account=account,
                account_type=account_type,
                created_at=datetime.utcnow(),
                status=DictKeyStatus.ACTIVE
            )
        )

    def _simulate_lookup_key(self, key_value: str) -> DictResponse:
        """Simulate DICT key lookup for dev environment"""
        # For dev, we'll check our local database
        # This is a placeholder - actual lookup happens in service layer
        return DictResponse(
            success=False,
            error_code="KEY_NOT_FOUND",
            error_message="Key not found (dev simulation)"
        )

    def _parse_key_info(self, data: Dict[str, Any]) -> DictKeyInfo:
        """Parse DICT response into DictKeyInfo"""
        participant = data.get("participant", {})
        owner = data.get("owner", {})

        return DictKeyInfo(
            key=data.get("key"),
            key_type=data.get("keyType"),
            owner_name=owner.get("name"),
            owner_document=owner.get("taxIdNumber"),
            owner_type=owner.get("type"),
            ispb=participant.get("ispb"),
            branch=participant.get("branch"),
            account=participant.get("account"),
            account_type=participant.get("accountType"),
            created_at=datetime.fromisoformat(data.get("createdAt", datetime.utcnow().isoformat())),
            status=DictKeyStatus(data.get("status", "ACTIVE"))
        )


# Default client instance
dict_client = DictClient()
