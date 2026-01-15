"""
Athena Pay - Accounts Service Integration Tests
"""

import pytest
import httpx


class TestAccountsService:
    """Integration tests for accounts service."""

    @pytest.mark.asyncio
    async def test_create_customer(self, accounts_client: httpx.AsyncClient, test_customer):
        """Test customer creation."""
        response = await accounts_client.post("/customers", json=test_customer)

        # Either 201 (created) or 409 (already exists from init.sql)
        assert response.status_code in [200, 201, 409]

        if response.status_code in [200, 201]:
            data = response.json()
            assert data["document_number"] == test_customer["document_number"]
            assert data["name"] == test_customer["name"]

    @pytest.mark.asyncio
    async def test_get_customer(self, accounts_client: httpx.AsyncClient):
        """Test customer retrieval."""
        # Test customer from init.sql
        customer_id = "00000000-0000-0000-0000-000000000001"
        response = await accounts_client.get(f"/customers/{customer_id}")

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == customer_id

    @pytest.mark.asyncio
    async def test_get_customer_by_document(self, accounts_client: httpx.AsyncClient):
        """Test customer retrieval by document."""
        document = "12345678901"
        response = await accounts_client.get(f"/customers/document/{document}")

        assert response.status_code == 200
        data = response.json()
        assert data["document_number"] == document

    @pytest.mark.asyncio
    async def test_get_account(self, accounts_client: httpx.AsyncClient):
        """Test account retrieval."""
        # Test account from init.sql
        account_id = "acc-001"
        response = await accounts_client.get(f"/accounts/{account_id}")

        assert response.status_code == 200
        data = response.json()
        assert "balance" in data

    @pytest.mark.asyncio
    async def test_get_account_balance(self, accounts_client: httpx.AsyncClient):
        """Test account balance retrieval."""
        account_id = "acc-001"
        response = await accounts_client.get(f"/accounts/{account_id}/balance")

        assert response.status_code == 200
        data = response.json()
        assert "balance" in data
        assert "available_balance" in data

    @pytest.mark.asyncio
    async def test_get_account_transactions(self, accounts_client: httpx.AsyncClient):
        """Test account transactions list."""
        account_id = "acc-001"
        response = await accounts_client.get(f"/accounts/{account_id}/transactions")

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    @pytest.mark.asyncio
    async def test_customer_not_found(self, accounts_client: httpx.AsyncClient):
        """Test 404 for non-existent customer."""
        response = await accounts_client.get("/customers/00000000-0000-0000-0000-999999999999")
        assert response.status_code == 404
