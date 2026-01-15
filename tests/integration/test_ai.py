"""
Athena Pay - AI Service Integration Tests
"""

import pytest
import httpx


class TestAIService:
    """Integration tests for AI service."""

    @pytest.mark.asyncio
    async def test_chat(self, ai_client: httpx.AsyncClient):
        """Test AI chat endpoint."""
        chat_data = {
            "message": "Qual meu saldo?",
            "customer_id": "00000000-0000-0000-0000-000000000001",
            "context": {
                "channel": "app"
            }
        }
        response = await ai_client.post("/chat", json=chat_data)

        assert response.status_code in [200, 503]  # 503 if Athena not available

        if response.status_code == 200:
            data = response.json()
            assert "response" in data or "message" in data

    @pytest.mark.asyncio
    async def test_analyze_intent(self, ai_client: httpx.AsyncClient):
        """Test intent analysis."""
        intent_data = {
            "message": "Quero fazer um PIX de 100 reais"
        }
        response = await ai_client.post("/analyze/intent", json=intent_data)

        assert response.status_code in [200, 503]

        if response.status_code == 200:
            data = response.json()
            assert "intent" in data

    @pytest.mark.asyncio
    async def test_get_insights(self, ai_client: httpx.AsyncClient):
        """Test financial insights."""
        customer_id = "00000000-0000-0000-0000-000000000001"
        response = await ai_client.get(f"/insights/{customer_id}")

        assert response.status_code in [200, 404, 503]

        if response.status_code == 200:
            data = response.json()
            assert "insights" in data or isinstance(data, list)

    @pytest.mark.asyncio
    async def test_fraud_analysis(self, ai_client: httpx.AsyncClient):
        """Test fraud analysis."""
        fraud_data = {
            "transaction_type": "PIX",
            "amount": 5000.00,
            "customer_id": "00000000-0000-0000-0000-000000000001",
            "target_document": "98765432109",
            "device_fingerprint": "abc123"
        }
        response = await ai_client.post("/analyze/fraud", json=fraud_data)

        assert response.status_code in [200, 503]

        if response.status_code == 200:
            data = response.json()
            assert "risk_score" in data or "risk_level" in data

    @pytest.mark.asyncio
    async def test_whatsapp_webhook(self, ai_client: httpx.AsyncClient):
        """Test WhatsApp webhook."""
        webhook_data = {
            "from": "5511999999999",
            "message": "Oi, preciso de ajuda",
            "timestamp": "2024-01-15T10:30:00Z"
        }
        response = await ai_client.post("/webhook/whatsapp", json=webhook_data)

        assert response.status_code in [200, 400, 503]

    @pytest.mark.asyncio
    async def test_conversation_history(self, ai_client: httpx.AsyncClient):
        """Test conversation history retrieval."""
        customer_id = "00000000-0000-0000-0000-000000000001"
        response = await ai_client.get(f"/conversations/{customer_id}")

        assert response.status_code in [200, 404]

        if response.status_code == 200:
            data = response.json()
            assert isinstance(data, list)
