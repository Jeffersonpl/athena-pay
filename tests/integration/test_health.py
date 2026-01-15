"""
Athena Pay - Health Check Integration Tests
Verifies all services are running and healthy.
"""

import pytest
import httpx
from conftest import (
    ACCOUNTS_URL, PIX_URL, CARDS_URL, BOLETO_URL, WIRE_URL,
    LOANS_URL, COMPLIANCE_URL, KYC_URL, AUDIT_URL, AI_URL
)


class TestHealthChecks:
    """Test health endpoints for all services."""

    @pytest.mark.asyncio
    async def test_accounts_service_health(self, accounts_client: httpx.AsyncClient):
        """Test accounts service health endpoint."""
        response = await accounts_client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"

    @pytest.mark.asyncio
    async def test_pix_service_health(self, pix_client: httpx.AsyncClient):
        """Test PIX service health endpoint."""
        response = await pix_client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"

    @pytest.mark.asyncio
    async def test_cards_service_health(self, cards_client: httpx.AsyncClient):
        """Test cards service health endpoint."""
        response = await cards_client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"

    @pytest.mark.asyncio
    async def test_boleto_service_health(self, boleto_client: httpx.AsyncClient):
        """Test boleto service health endpoint."""
        response = await boleto_client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"

    @pytest.mark.asyncio
    async def test_wire_service_health(self, wire_client: httpx.AsyncClient):
        """Test wire service health endpoint."""
        response = await wire_client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"

    @pytest.mark.asyncio
    async def test_loans_service_health(self, loans_client: httpx.AsyncClient):
        """Test loans service health endpoint."""
        response = await loans_client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"

    @pytest.mark.asyncio
    async def test_compliance_service_health(self, compliance_client: httpx.AsyncClient):
        """Test compliance service health endpoint."""
        response = await compliance_client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"

    @pytest.mark.asyncio
    async def test_kyc_service_health(self, kyc_client: httpx.AsyncClient):
        """Test KYC service health endpoint."""
        response = await kyc_client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"

    @pytest.mark.asyncio
    async def test_audit_service_health(self, audit_client: httpx.AsyncClient):
        """Test audit service health endpoint."""
        response = await audit_client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"

    @pytest.mark.asyncio
    async def test_ai_service_health(self, ai_client: httpx.AsyncClient):
        """Test AI service health endpoint."""
        response = await ai_client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
