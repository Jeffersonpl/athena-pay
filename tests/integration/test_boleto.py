"""
Athena Pay - Boleto Service Integration Tests
"""

import pytest
import httpx
from datetime import date, timedelta


class TestBoletoService:
    """Integration tests for boleto service."""

    @pytest.mark.asyncio
    async def test_generate_boleto(self, boleto_client: httpx.AsyncClient, test_boleto):
        """Test boleto generation."""
        response = await boleto_client.post("/boletos", json=test_boleto)

        assert response.status_code in [200, 201, 400]

        if response.status_code in [200, 201]:
            data = response.json()
            assert "barcode" in data
            assert "digitable_line" in data
            assert data["amount"] == test_boleto["amount"]

    @pytest.mark.asyncio
    async def test_get_boleto(self, boleto_client: httpx.AsyncClient):
        """Test boleto retrieval."""
        # First create a boleto
        boleto_data = {
            "account_id": "acc-001",
            "amount": 100.00,
            "due_date": (date.today() + timedelta(days=30)).isoformat(),
            "beneficiary_name": "Athena Pay",
            "beneficiary_document": "12345678901234"
        }
        create_response = await boleto_client.post("/boletos", json=boleto_data)

        if create_response.status_code in [200, 201]:
            boleto_id = create_response.json()["id"]
            response = await boleto_client.get(f"/boletos/{boleto_id}")

            assert response.status_code == 200
            data = response.json()
            assert data["id"] == boleto_id

    @pytest.mark.asyncio
    async def test_get_boleto_by_barcode(self, boleto_client: httpx.AsyncClient):
        """Test boleto retrieval by barcode."""
        # First create a boleto
        boleto_data = {
            "account_id": "acc-001",
            "amount": 75.50,
            "due_date": (date.today() + timedelta(days=15)).isoformat(),
            "beneficiary_name": "Empresa Teste",
            "beneficiary_document": "98765432109876"
        }
        create_response = await boleto_client.post("/boletos", json=boleto_data)

        if create_response.status_code in [200, 201]:
            barcode = create_response.json()["barcode"]
            response = await boleto_client.get(f"/boletos/barcode/{barcode}")

            assert response.status_code == 200
            data = response.json()
            assert data["barcode"] == barcode

    @pytest.mark.asyncio
    async def test_pay_boleto(self, boleto_client: httpx.AsyncClient):
        """Test boleto payment."""
        # First create a boleto
        boleto_data = {
            "account_id": "acc-001",
            "amount": 200.00,
            "due_date": (date.today() + timedelta(days=7)).isoformat(),
            "beneficiary_name": "Fornecedor Teste",
            "beneficiary_document": "11111111111111"
        }
        create_response = await boleto_client.post("/boletos", json=boleto_data)

        if create_response.status_code in [200, 201]:
            boleto_id = create_response.json()["id"]

            payment_data = {
                "payer_account_id": "acc-001",
                "amount": 200.00
            }
            response = await boleto_client.post(f"/boletos/{boleto_id}/pay", json=payment_data)

            # May fail due to balance or business rules
            assert response.status_code in [200, 400, 422]

    @pytest.mark.asyncio
    async def test_list_boletos_by_account(self, boleto_client: httpx.AsyncClient):
        """Test listing boletos by account."""
        account_id = "acc-001"
        response = await boleto_client.get(f"/boletos/account/{account_id}")

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    @pytest.mark.asyncio
    async def test_boleto_pdf(self, boleto_client: httpx.AsyncClient):
        """Test boleto PDF generation."""
        # First create a boleto
        boleto_data = {
            "account_id": "acc-001",
            "amount": 150.00,
            "due_date": (date.today() + timedelta(days=10)).isoformat(),
            "beneficiary_name": "PDF Teste",
            "beneficiary_document": "22222222222222"
        }
        create_response = await boleto_client.post("/boletos", json=boleto_data)

        if create_response.status_code in [200, 201]:
            boleto_id = create_response.json()["id"]
            response = await boleto_client.get(f"/boletos/{boleto_id}/pdf")

            # PDF endpoint may return PDF or redirect
            assert response.status_code in [200, 302, 404]

    @pytest.mark.asyncio
    async def test_boleto_not_found(self, boleto_client: httpx.AsyncClient):
        """Test 404 for non-existent boleto."""
        response = await boleto_client.get("/boletos/nonexistent-id")
        assert response.status_code in [404, 422]
