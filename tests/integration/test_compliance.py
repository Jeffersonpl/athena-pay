"""
Athena Pay - Compliance Service Integration Tests
"""

import pytest
import httpx


class TestComplianceService:
    """Integration tests for compliance service."""

    @pytest.mark.asyncio
    async def test_screen_customer(self, compliance_client: httpx.AsyncClient):
        """Test customer screening (PEP/OFAC/sanctions)."""
        screening_data = {
            "customer_id": "00000000-0000-0000-0000-000000000001",
            "name": "Usuario Teste",
            "document": "12345678901",
            "document_type": "CPF"
        }
        response = await compliance_client.post("/screening/customer", json=screening_data)

        assert response.status_code in [200, 201]
        data = response.json()
        assert "result" in data
        assert data["result"] in ["CLEAR", "MATCH", "PENDING"]

    @pytest.mark.asyncio
    async def test_validate_transaction(self, compliance_client: httpx.AsyncClient):
        """Test transaction compliance validation."""
        validation_data = {
            "customer_id": "00000000-0000-0000-0000-000000000001",
            "transaction_type": "PIX",
            "amount": 5000.00,
            "target_document": "98765432109"
        }
        response = await compliance_client.post("/validate/transaction", json=validation_data)

        assert response.status_code in [200, 400]
        data = response.json()
        assert "approved" in data

    @pytest.mark.asyncio
    async def test_check_limits(self, compliance_client: httpx.AsyncClient):
        """Test transaction limit checking."""
        limits_data = {
            "customer_id": "00000000-0000-0000-0000-000000000001",
            "kyc_level": 2,
            "transaction_type": "PIX",
            "amount": 1000.00
        }
        response = await compliance_client.post("/check/limits", json=limits_data)

        assert response.status_code in [200, 400]
        data = response.json()
        assert "within_limits" in data

    @pytest.mark.asyncio
    async def test_get_customer_limits(self, compliance_client: httpx.AsyncClient):
        """Test customer limits retrieval."""
        customer_id = "00000000-0000-0000-0000-000000000001"
        response = await compliance_client.get(f"/limits/{customer_id}")

        assert response.status_code in [200, 404]

        if response.status_code == 200:
            data = response.json()
            assert "daily_limit" in data or "limits" in data

    @pytest.mark.asyncio
    async def test_create_alert(self, compliance_client: httpx.AsyncClient):
        """Test compliance alert creation."""
        alert_data = {
            "customer_id": "00000000-0000-0000-0000-000000000001",
            "alert_type": "UNUSUAL_ACTIVITY",
            "severity": "MEDIUM",
            "description": "Unusual transaction pattern detected"
        }
        response = await compliance_client.post("/alerts", json=alert_data)

        assert response.status_code in [200, 201]
        data = response.json()
        assert "id" in data

    @pytest.mark.asyncio
    async def test_list_alerts(self, compliance_client: httpx.AsyncClient):
        """Test compliance alerts listing."""
        response = await compliance_client.get("/alerts")

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    @pytest.mark.asyncio
    async def test_get_alert(self, compliance_client: httpx.AsyncClient):
        """Test alert retrieval."""
        # First create an alert
        alert_data = {
            "customer_id": "00000000-0000-0000-0000-000000000001",
            "alert_type": "HIGH_VALUE",
            "severity": "LOW",
            "description": "High value transaction"
        }
        create_response = await compliance_client.post("/alerts", json=alert_data)

        if create_response.status_code in [200, 201]:
            alert_id = create_response.json()["id"]
            response = await compliance_client.get(f"/alerts/{alert_id}")

            assert response.status_code == 200
            data = response.json()
            assert data["id"] == alert_id

    @pytest.mark.asyncio
    async def test_resolve_alert(self, compliance_client: httpx.AsyncClient):
        """Test alert resolution."""
        # First create an alert
        alert_data = {
            "customer_id": "00000000-0000-0000-0000-000000000001",
            "alert_type": "SUSPICIOUS",
            "severity": "HIGH",
            "description": "Suspicious activity"
        }
        create_response = await compliance_client.post("/alerts", json=alert_data)

        if create_response.status_code in [200, 201]:
            alert_id = create_response.json()["id"]

            resolve_data = {
                "resolution": "FALSE_POSITIVE",
                "notes": "Verified legitimate transaction"
            }
            response = await compliance_client.post(f"/alerts/{alert_id}/resolve", json=resolve_data)

            assert response.status_code in [200, 400]

    @pytest.mark.asyncio
    async def test_get_rules(self, compliance_client: httpx.AsyncClient):
        """Test compliance rules retrieval."""
        response = await compliance_client.get("/rules")

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
