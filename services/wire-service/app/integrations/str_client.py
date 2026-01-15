"""
STR (Sistema de Transferência de Reservas) Client
Integration with BACEN for TED processing

NOTE: This is a stub implementation for development.
Real STR integration requires RSFN connection and digital certificates.
"""
import os
import uuid
import httpx
from datetime import datetime
from typing import Optional
from dataclasses import dataclass
from enum import Enum


ENV = os.getenv("ENV", "dev")


class STRMessageType(str, Enum):
    """STR message types"""
    TED_SEND = "STR0004"  # Liquidação de TED
    TED_RETURN = "STR0005"  # Devolução de TED
    BALANCE_QUERY = "STR0001"  # Consulta de saldo
    SETTLEMENT_CONFIRM = "STR0008"  # Confirmação de liquidação


@dataclass
class STRTransferRequest:
    """TED transfer request to STR"""
    transfer_id: str
    ispb_source: str
    ispb_dest: str
    branch_source: str
    branch_dest: str
    account_source: str
    account_dest: str
    account_type_dest: str  # CC or CP
    document_source: str
    document_dest: str
    name_source: str
    name_dest: str
    amount: float
    purpose_code: str
    description: Optional[str] = None


@dataclass
class STRTransferResponse:
    """STR transfer response"""
    success: bool
    str_reference: Optional[str] = None
    settlement_date: Optional[datetime] = None
    error_code: Optional[str] = None
    error_message: Optional[str] = None


class STRClient:
    """
    Client for STR (Sistema de Transferência de Reservas)

    In production, this would connect to BACEN's RSFN network
    using XML messages signed with digital certificates.

    For development, this simulates STR responses.
    """

    def __init__(self):
        self.base_url = os.getenv("STR_URL", "https://str.bcb.gov.br")
        self.participant_ispb = os.getenv("BANK_ISPB", "00000000")
        self.certificate_path = os.getenv("STR_CERT_PATH")
        self.certificate_key = os.getenv("STR_CERT_KEY")

    async def send_ted(self, request: STRTransferRequest) -> STRTransferResponse:
        """
        Send TED through STR

        In production:
        1. Build XML message (ISO 20022 pacs.008)
        2. Sign with digital certificate
        3. Send to BACEN via RSFN
        4. Wait for confirmation (pacs.002)

        For development, simulates instant settlement.
        """
        if ENV == "dev":
            return await self._simulate_ted(request)

        # Production implementation would go here
        # This requires RSFN connection and proper certificates
        raise NotImplementedError("Production STR not implemented")

    async def _simulate_ted(self, request: STRTransferRequest) -> STRTransferResponse:
        """Simulate TED processing for development"""
        # Simulate processing delay
        import asyncio
        await asyncio.sleep(0.1)

        # Generate STR reference
        str_reference = f"STR{datetime.utcnow().strftime('%Y%m%d')}{uuid.uuid4().hex[:12].upper()}"

        # Simulate some validation failures for testing
        if request.amount <= 0:
            return STRTransferResponse(
                success=False,
                error_code="STR0001",
                error_message="Invalid amount"
            )

        if request.amount > 10000000:  # 10 million limit
            return STRTransferResponse(
                success=False,
                error_code="STR0002",
                error_message="Amount exceeds limit"
            )

        # Successful simulation
        return STRTransferResponse(
            success=True,
            str_reference=str_reference,
            settlement_date=datetime.utcnow()
        )

    async def return_ted(
        self,
        original_str_reference: str,
        reason_code: str,
        reason_description: str
    ) -> STRTransferResponse:
        """
        Return a TED through STR

        Used when a TED needs to be returned (wrong account, etc.)
        """
        if ENV == "dev":
            str_reference = f"STRDEV{datetime.utcnow().strftime('%Y%m%d')}{uuid.uuid4().hex[:12].upper()}"
            return STRTransferResponse(
                success=True,
                str_reference=str_reference,
                settlement_date=datetime.utcnow()
            )

        raise NotImplementedError("Production STR not implemented")

    async def check_balance(self) -> dict:
        """
        Check available balance in STR account

        Banks maintain accounts at BACEN for TED settlement.
        """
        if ENV == "dev":
            return {
                "available_balance": 1000000000.00,  # 1 billion for testing
                "blocked_balance": 0.00,
                "timestamp": datetime.utcnow().isoformat()
            }

        raise NotImplementedError("Production STR not implemented")

    async def get_settlement_status(self, str_reference: str) -> dict:
        """
        Get settlement status for a TED
        """
        if ENV == "dev":
            return {
                "str_reference": str_reference,
                "status": "SETTLED",
                "settlement_date": datetime.utcnow().isoformat(),
                "confirmation_code": f"CONF{uuid.uuid4().hex[:8].upper()}"
            }

        raise NotImplementedError("Production STR not implemented")


# STR Return/Rejection Codes
STR_RETURN_CODES = {
    "AC03": "Conta do recebedor inválida",
    "AC04": "Conta encerrada",
    "AC06": "Conta bloqueada",
    "AC07": "Conta do recebedor inexistente",
    "AG03": "Tipo de transação não suportado",
    "AM02": "Valor não permitido",
    "AM04": "Fundos insuficientes",
    "AM09": "Valor incorreto",
    "BE01": "Identificação do beneficiário inconsistente",
    "BE04": "Endereço do beneficiário faltando ou incorreto",
    "DT01": "Data inválida",
    "FF01": "Formato de arquivo inválido",
    "MD01": "Sem mandato",
    "MS03": "Razão não especificada",
    "RC01": "Identificação da instituição incorreta",
    "RR04": "Regulamentação",
    "NARR": "Motivo narrativo informado",
}

# Operating hours
STR_OPERATING_HOURS = {
    "start": "06:30",
    "end": "17:00",
    "days": ["monday", "tuesday", "wednesday", "thursday", "friday"]
}
