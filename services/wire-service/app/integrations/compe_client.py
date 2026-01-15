"""
COMPE (Câmara de Compensação) Client
Integration for DOC processing

NOTE: This is a stub implementation for development.
Real COMPE integration requires connection to CIP (Câmara Interbancária de Pagamentos).
"""
import os
import uuid
from datetime import datetime, timedelta
from typing import Optional
from dataclasses import dataclass


ENV = os.getenv("ENV", "dev")


@dataclass
class DOCRequest:
    """DOC transfer request"""
    transfer_id: str
    bank_source: str
    bank_dest: str
    branch_source: str
    branch_dest: str
    account_source: str
    account_dest: str
    account_type_dest: str
    document_source: str
    document_dest: str
    name_source: str
    name_dest: str
    amount: float
    purpose_code: str
    description: Optional[str] = None


@dataclass
class DOCResponse:
    """DOC transfer response"""
    success: bool
    compe_reference: Optional[str] = None
    expected_settlement: Optional[datetime] = None
    error_code: Optional[str] = None
    error_message: Optional[str] = None


class COMPEClient:
    """
    Client for COMPE (DOC processing)

    DOC (Documento de Ordem de Crédito):
    - Maximum value: R$ 4,999.99
    - Settlement: D+1 (next business day)
    - Uses COMPE clearing system

    For development, this simulates DOC processing.
    """

    def __init__(self):
        self.max_doc_amount = 4999.99

    async def send_doc(self, request: DOCRequest) -> DOCResponse:
        """
        Send DOC through COMPE

        DOC characteristics:
        - Lower cost than TED
        - Settlement on D+1
        - Maximum amount: R$ 4,999.99
        """
        if ENV == "dev":
            return await self._simulate_doc(request)

        raise NotImplementedError("Production COMPE not implemented")

    async def _simulate_doc(self, request: DOCRequest) -> DOCResponse:
        """Simulate DOC processing for development"""
        import asyncio
        await asyncio.sleep(0.05)

        # Validate amount
        if request.amount <= 0:
            return DOCResponse(
                success=False,
                error_code="DOC001",
                error_message="Invalid amount"
            )

        if request.amount > self.max_doc_amount:
            return DOCResponse(
                success=False,
                error_code="DOC002",
                error_message=f"Amount exceeds DOC limit of R$ {self.max_doc_amount}"
            )

        # Generate COMPE reference
        compe_reference = f"DOC{datetime.utcnow().strftime('%Y%m%d')}{uuid.uuid4().hex[:10].upper()}"

        # Calculate expected settlement (next business day)
        settlement = self._next_business_day(datetime.utcnow())

        return DOCResponse(
            success=True,
            compe_reference=compe_reference,
            expected_settlement=settlement
        )

    def _next_business_day(self, date: datetime) -> datetime:
        """Calculate next business day for DOC settlement"""
        next_day = date + timedelta(days=1)

        # Skip weekends
        while next_day.weekday() >= 5:  # Saturday = 5, Sunday = 6
            next_day += timedelta(days=1)

        # In production, would also check for holidays
        return next_day

    async def check_settlement(self, compe_reference: str) -> dict:
        """Check DOC settlement status"""
        if ENV == "dev":
            return {
                "compe_reference": compe_reference,
                "status": "PENDING_SETTLEMENT",
                "expected_date": self._next_business_day(datetime.utcnow()).isoformat()
            }

        raise NotImplementedError("Production COMPE not implemented")

    async def get_batch_status(self, batch_date: datetime) -> dict:
        """Get status of DOC batch for a specific date"""
        if ENV == "dev":
            return {
                "batch_date": batch_date.date().isoformat(),
                "status": "PROCESSED",
                "total_docs": 0,
                "total_amount": 0.00
            }

        raise NotImplementedError("Production COMPE not implemented")


# DOC Return Codes
DOC_RETURN_CODES = {
    "01": "Conta destino não existe",
    "02": "Conta destino encerrada",
    "03": "CPF/CNPJ inválido",
    "04": "Dados do favorecido divergentes",
    "05": "Agência inexistente",
    "06": "Banco não participante do COMPE",
    "07": "Conta bloqueada",
    "08": "Tipo de conta inválido",
    "09": "Duplicidade de operação",
    "10": "Valor zerado ou negativo",
    "11": "Excede limite DOC",
    "99": "Outros motivos"
}

# DOC Operating Schedule
DOC_SCHEDULE = {
    "cutoff_same_day": "14:00",  # After this, processes D+2
    "cutoff_final": "21:30",  # After this, rejected
    "settlement_time": "08:00",  # Settlement time on D+1
}
