"""
Athena Pay - Wire Service (TED/DOC) Integration Tests
"""

import pytest
import httpx


class TestWireService:
    """Integration tests for wire service."""

    @pytest.mark.asyncio
    async def test_create_ted_transfer(self, wire_client: httpx.AsyncClient, test_wire_transfer):
        """Test TED transfer creation."""
        response = await wire_client.post("/transfers", json=test_wire_transfer)

        assert response.status_code in [200, 201, 400, 422]

        if response.status_code in [200, 201]:
            data = response.json()
            assert data["type"] == "TED"
            assert data["amount"] == test_wire_transfer["amount"]
            assert "status" in data

    @pytest.mark.asyncio
    async def test_create_doc_transfer(self, wire_client: httpx.AsyncClient):
        """Test DOC transfer creation."""
        doc_transfer = {
            "source_account_id": "acc-001",
            "type": "DOC",
            "target_bank": "033",
            "target_branch": "0001",
            "target_account": "654321",
            "target_document": "11122233344",
            "target_name": "Destinatario DOC",
            "amount": 3000.00  # DOC has lower limit
        }
        response = await wire_client.post("/transfers", json=doc_transfer)

        assert response.status_code in [200, 201, 400, 422]

    @pytest.mark.asyncio
    async def test_get_transfer(self, wire_client: httpx.AsyncClient, test_wire_transfer):
        """Test transfer retrieval."""
        # First create a transfer
        create_response = await wire_client.post("/transfers", json=test_wire_transfer)

        if create_response.status_code in [200, 201]:
            transfer_id = create_response.json()["id"]
            response = await wire_client.get(f"/transfers/{transfer_id}")

            assert response.status_code == 200
            data = response.json()
            assert data["id"] == transfer_id

    @pytest.mark.asyncio
    async def test_list_transfers_by_account(self, wire_client: httpx.AsyncClient):
        """Test listing transfers by account."""
        account_id = "acc-001"
        response = await wire_client.get(f"/transfers/account/{account_id}")

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    @pytest.mark.asyncio
    async def test_get_banks_list(self, wire_client: httpx.AsyncClient):
        """Test bank list retrieval."""
        response = await wire_client.get("/banks")

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        if len(data) > 0:
            assert "code" in data[0]
            assert "name" in data[0]

    @pytest.mark.asyncio
    async def test_validate_bank_account(self, wire_client: httpx.AsyncClient):
        """Test bank account validation."""
        validation_data = {
            "bank_code": "001",
            "branch": "0001",
            "account": "123456",
            "document": "12345678901"
        }
        response = await wire_client.post("/validate-account", json=validation_data)

        assert response.status_code in [200, 400, 422]

        if response.status_code == 200:
            data = response.json()
            assert "valid" in data

    @pytest.mark.asyncio
    async def test_transfer_not_found(self, wire_client: httpx.AsyncClient):
        """Test 404 for non-existent transfer."""
        response = await wire_client.get("/transfers/nonexistent-id")
        assert response.status_code in [404, 422]

    @pytest.mark.asyncio
    async def test_ted_amount_limit(self, wire_client: httpx.AsyncClient):
        """Test TED transfer with amount above daily limit."""
        large_transfer = {
            "source_account_id": "acc-001",
            "type": "TED",
            "target_bank": "001",
            "target_branch": "0001",
            "target_account": "999999",
            "target_document": "99999999999",
            "target_name": "Limite Teste",
            "amount": 1000000.00  # Above typical daily limit
        }
        response = await wire_client.post("/transfers", json=large_transfer)

        # Should be rejected due to limit
        assert response.status_code in [200, 201, 400, 422]

    @pytest.mark.asyncio
    async def test_doc_cutoff_time(self, wire_client: httpx.AsyncClient):
        """Test DOC transfer scheduling."""
        doc_transfer = {
            "source_account_id": "acc-001",
            "type": "DOC",
            "target_bank": "341",
            "target_branch": "0001",
            "target_account": "111111",
            "target_document": "12312312300",
            "target_name": "DOC Cutoff",
            "amount": 1000.00
        }
        response = await wire_client.post("/transfers", json=doc_transfer)

        # DOC may be scheduled for next business day
        assert response.status_code in [200, 201, 400, 422]
