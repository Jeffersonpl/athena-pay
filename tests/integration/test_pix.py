"""
Athena Pay - PIX Service Integration Tests
"""

import pytest
import httpx


class TestPixService:
    """Integration tests for PIX service."""

    @pytest.mark.asyncio
    async def test_register_pix_key(self, pix_client: httpx.AsyncClient, test_pix_key):
        """Test PIX key registration."""
        response = await pix_client.post("/keys", json=test_pix_key)

        # Either 201 (created) or 409 (already exists)
        assert response.status_code in [200, 201, 409]

        if response.status_code in [200, 201]:
            data = response.json()
            assert data["key_type"] == test_pix_key["key_type"]
            assert data["key_value"] == test_pix_key["key_value"]

    @pytest.mark.asyncio
    async def test_get_pix_key(self, pix_client: httpx.AsyncClient):
        """Test PIX key retrieval."""
        key_value = "12345678901"
        response = await pix_client.get(f"/keys/{key_value}")

        assert response.status_code == 200
        data = response.json()
        assert data["key_value"] == key_value

    @pytest.mark.asyncio
    async def test_list_account_keys(self, pix_client: httpx.AsyncClient):
        """Test listing PIX keys by account."""
        account_id = "acc-001"
        response = await pix_client.get(f"/keys/account/{account_id}")

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    @pytest.mark.asyncio
    async def test_resolve_pix_key(self, pix_client: httpx.AsyncClient):
        """Test PIX key resolution (DICT lookup)."""
        key_value = "12345678901"
        response = await pix_client.get(f"/resolve/{key_value}")

        assert response.status_code == 200
        data = response.json()
        assert "account_id" in data or "key_value" in data

    @pytest.mark.asyncio
    async def test_create_pix_transfer(self, pix_client: httpx.AsyncClient, test_pix_transfer):
        """Test PIX transfer creation."""
        response = await pix_client.post("/transfer", json=test_pix_transfer)

        # Check for success or business validation error
        assert response.status_code in [200, 201, 400, 422]

        if response.status_code in [200, 201]:
            data = response.json()
            assert "e2e_id" in data
            assert data["amount"] == test_pix_transfer["amount"]

    @pytest.mark.asyncio
    async def test_create_qrcode_static(self, pix_client: httpx.AsyncClient):
        """Test static QR code generation."""
        qrcode_data = {
            "key_value": "12345678901",
            "amount": 100.00,
            "description": "Teste QR Code"
        }
        response = await pix_client.post("/qrcode/static", json=qrcode_data)

        assert response.status_code in [200, 201]
        data = response.json()
        assert "payload" in data or "qr_code" in data

    @pytest.mark.asyncio
    async def test_create_qrcode_dynamic(self, pix_client: httpx.AsyncClient):
        """Test dynamic QR code generation."""
        qrcode_data = {
            "account_id": "acc-001",
            "amount": 250.00,
            "expiration_seconds": 3600,
            "description": "Cobranca Teste"
        }
        response = await pix_client.post("/qrcode/dynamic", json=qrcode_data)

        assert response.status_code in [200, 201]
        data = response.json()
        assert "payload" in data or "qr_code" in data

    @pytest.mark.asyncio
    async def test_get_pix_transaction(self, pix_client: httpx.AsyncClient):
        """Test PIX transaction retrieval."""
        # This would need a real transaction ID
        # For now, test 404 behavior
        response = await pix_client.get("/transactions/nonexistent-id")
        assert response.status_code in [404, 422]

    @pytest.mark.asyncio
    async def test_pix_key_not_found(self, pix_client: httpx.AsyncClient):
        """Test 404 for non-existent PIX key."""
        response = await pix_client.get("/keys/nonexistent-key-value")
        assert response.status_code == 404
