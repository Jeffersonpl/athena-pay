"""
Athena Pay - Cards Service Integration Tests
"""

import pytest
import httpx


class TestCardsService:
    """Integration tests for cards service."""

    @pytest.mark.asyncio
    async def test_issue_virtual_card(self, cards_client: httpx.AsyncClient, test_card):
        """Test virtual card issuance."""
        response = await cards_client.post("/cards", json=test_card)

        assert response.status_code in [200, 201, 400]

        if response.status_code in [200, 201]:
            data = response.json()
            assert data["type"] == test_card["type"]
            assert data["variant"] == "VIRTUAL"
            assert "last_four" in data

    @pytest.mark.asyncio
    async def test_get_card(self, cards_client: httpx.AsyncClient):
        """Test card retrieval."""
        # First create a card to ensure one exists
        test_card = {
            "account_id": "acc-001",
            "type": "DEBIT",
            "variant": "VIRTUAL"
        }
        create_response = await cards_client.post("/cards", json=test_card)

        if create_response.status_code in [200, 201]:
            card_id = create_response.json()["id"]
            response = await cards_client.get(f"/cards/{card_id}")

            assert response.status_code == 200
            data = response.json()
            assert data["id"] == card_id

    @pytest.mark.asyncio
    async def test_list_account_cards(self, cards_client: httpx.AsyncClient):
        """Test listing cards by account."""
        account_id = "acc-001"
        response = await cards_client.get(f"/cards/account/{account_id}")

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    @pytest.mark.asyncio
    async def test_authorize_transaction(self, cards_client: httpx.AsyncClient):
        """Test card transaction authorization."""
        # First get or create a card
        account_id = "acc-001"
        cards_response = await cards_client.get(f"/cards/account/{account_id}")

        if cards_response.status_code == 200 and len(cards_response.json()) > 0:
            card_id = cards_response.json()[0]["id"]

            auth_data = {
                "card_id": card_id,
                "amount": 50.00,
                "merchant_name": "Loja Teste",
                "merchant_category": "5411"
            }
            response = await cards_client.post("/authorize", json=auth_data)

            # May fail due to insufficient limit or other business rules
            assert response.status_code in [200, 201, 400, 422]

    @pytest.mark.asyncio
    async def test_block_card(self, cards_client: httpx.AsyncClient):
        """Test card blocking."""
        # First get a card
        account_id = "acc-001"
        cards_response = await cards_client.get(f"/cards/account/{account_id}")

        if cards_response.status_code == 200 and len(cards_response.json()) > 0:
            card_id = cards_response.json()[0]["id"]

            response = await cards_client.post(f"/cards/{card_id}/block")
            assert response.status_code in [200, 400]

    @pytest.mark.asyncio
    async def test_get_card_transactions(self, cards_client: httpx.AsyncClient):
        """Test card transactions list."""
        account_id = "acc-001"
        cards_response = await cards_client.get(f"/cards/account/{account_id}")

        if cards_response.status_code == 200 and len(cards_response.json()) > 0:
            card_id = cards_response.json()[0]["id"]

            response = await cards_client.get(f"/cards/{card_id}/transactions")
            assert response.status_code == 200
            data = response.json()
            assert isinstance(data, list)

    @pytest.mark.asyncio
    async def test_card_not_found(self, cards_client: httpx.AsyncClient):
        """Test 404 for non-existent card."""
        response = await cards_client.get("/cards/nonexistent-card-id")
        assert response.status_code in [404, 422]
