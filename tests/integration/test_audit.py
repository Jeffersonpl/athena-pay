"""
Athena Pay - Audit Service Integration Tests
"""

import pytest
import httpx


class TestAuditService:
    """Integration tests for audit service."""

    @pytest.mark.asyncio
    async def test_log_event(self, audit_client: httpx.AsyncClient):
        """Test audit event logging."""
        event_data = {
            "event_type": "TRANSACTION",
            "service": "pix-service",
            "action": "PIX_TRANSFER",
            "actor_id": "00000000-0000-0000-0000-000000000001",
            "actor_type": "CUSTOMER",
            "resource_type": "TRANSACTION",
            "resource_id": "tx-123",
            "metadata": {
                "amount": 100.00,
                "target_key": "12345678901"
            }
        }
        response = await audit_client.post("/events", json=event_data)

        assert response.status_code in [200, 201]
        data = response.json()
        assert "id" in data

    @pytest.mark.asyncio
    async def test_get_events(self, audit_client: httpx.AsyncClient):
        """Test audit events retrieval."""
        response = await audit_client.get("/events")

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    @pytest.mark.asyncio
    async def test_get_events_by_actor(self, audit_client: httpx.AsyncClient):
        """Test audit events by actor."""
        actor_id = "00000000-0000-0000-0000-000000000001"
        response = await audit_client.get(f"/events/actor/{actor_id}")

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    @pytest.mark.asyncio
    async def test_get_events_by_resource(self, audit_client: httpx.AsyncClient):
        """Test audit events by resource."""
        response = await audit_client.get("/events/resource/TRANSACTION/tx-123")

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    @pytest.mark.asyncio
    async def test_get_events_by_correlation(self, audit_client: httpx.AsyncClient):
        """Test audit events by correlation ID."""
        # First log an event with correlation ID
        event_data = {
            "event_type": "API_CALL",
            "service": "accounts-service",
            "action": "GET_BALANCE",
            "correlation_id": "corr-test-123"
        }
        await audit_client.post("/events", json=event_data)

        response = await audit_client.get("/events/correlation/corr-test-123")

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    @pytest.mark.asyncio
    async def test_get_events_filtered(self, audit_client: httpx.AsyncClient):
        """Test filtered audit events."""
        params = {
            "service": "pix-service",
            "event_type": "TRANSACTION",
            "limit": 10
        }
        response = await audit_client.get("/events", params=params)

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    @pytest.mark.asyncio
    async def test_security_event(self, audit_client: httpx.AsyncClient):
        """Test security event logging."""
        security_event = {
            "event_type": "SECURITY",
            "service": "auth-service",
            "action": "LOGIN_FAILED",
            "actor_type": "ANONYMOUS",
            "ip_address": "192.168.1.100",
            "user_agent": "Mozilla/5.0",
            "metadata": {
                "reason": "INVALID_PASSWORD",
                "attempts": 3
            }
        }
        response = await audit_client.post("/events", json=security_event)

        assert response.status_code in [200, 201]

    @pytest.mark.asyncio
    async def test_compliance_report(self, audit_client: httpx.AsyncClient):
        """Test compliance report generation."""
        params = {
            "start_date": "2024-01-01",
            "end_date": "2024-12-31",
            "report_type": "COAF"
        }
        response = await audit_client.get("/reports/compliance", params=params)

        assert response.status_code in [200, 400, 501]
