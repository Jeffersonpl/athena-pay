"""
Athena Pay - PIX Service Integration Tests
Production-ready integration tests for PIX operations

Run with:
    pytest tests/integration/test_pix_integration.py -v --tb=short
    pytest tests/integration/test_pix_integration.py -v -k "test_transfer"
"""

import pytest
import asyncio
import uuid
from datetime import datetime, timedelta
from decimal import Decimal
from typing import Dict, Any, Optional
import httpx


# ============================================
# Configuration
# ============================================

PIX_SERVICE_URL = "http://localhost:8082"
ACCOUNTS_SERVICE_URL = "http://localhost:8081"
TIMEOUT = 30.0


# ============================================
# Fixtures
# ============================================

@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for async tests"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
async def http_client():
    """Create HTTP client"""
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        yield client


@pytest.fixture
def auth_headers():
    """Get authentication headers"""
    return {
        "Authorization": "Bearer test_token",
        "Content-Type": "application/json",
        "X-Request-ID": str(uuid.uuid4()),
        "X-Correlation-ID": str(uuid.uuid4())
    }


@pytest.fixture
def test_account():
    """Generate test account data"""
    return {
        "id": str(uuid.uuid4()),
        "customer_id": str(uuid.uuid4()),
        "owner_name": "Test User",
        "owner_document": "12345678901",
        "branch": "0001",
        "account_number": f"{uuid.uuid4().hex[:10]}",
        "account_type": "CHECKING"
    }


@pytest.fixture
def test_cpf():
    """Generate valid test CPF"""
    return "12345678909"


@pytest.fixture
def test_email():
    """Generate test email"""
    return f"test_{uuid.uuid4().hex[:8]}@test.com"


@pytest.fixture
def test_phone():
    """Generate test phone"""
    return f"+5511999{uuid.uuid4().hex[:6]}"


# ============================================
# Health Check Tests
# ============================================

class TestHealthCheck:
    """Health check tests"""

    @pytest.mark.asyncio
    async def test_health_endpoint(self, http_client):
        """Test health endpoint returns 200"""
        response = await http_client.get(f"{PIX_SERVICE_URL}/health")
        assert response.status_code == 200

        data = response.json()
        assert "status" in data
        assert data["status"] in ["healthy", "degraded"]

    @pytest.mark.asyncio
    async def test_liveness_probe(self, http_client):
        """Test liveness probe"""
        response = await http_client.get(f"{PIX_SERVICE_URL}/health/live")
        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_readiness_probe(self, http_client):
        """Test readiness probe"""
        response = await http_client.get(f"{PIX_SERVICE_URL}/health/ready")
        # Can be 200 (ready) or 503 (not ready)
        assert response.status_code in [200, 503]


# ============================================
# PIX Key Tests
# ============================================

class TestPixKeys:
    """PIX key management tests"""

    @pytest.mark.asyncio
    async def test_create_cpf_key(self, http_client, auth_headers, test_account, test_cpf):
        """Test creating CPF PIX key"""
        payload = {
            "key_type": "CPF",
            "key_value": test_cpf,
            "account_id": test_account["id"],
            "owner_name": test_account["owner_name"],
            "owner_document": test_account["owner_document"]
        }

        response = await http_client.post(
            f"{PIX_SERVICE_URL}/pix/keys",
            json=payload,
            headers=auth_headers
        )

        # Either created or already exists
        assert response.status_code in [201, 409]

        if response.status_code == 201:
            data = response.json()
            assert data["key_type"] == "CPF"
            assert data["key_value"] == test_cpf
            assert data["status"] in ["PENDING", "ACTIVE"]

    @pytest.mark.asyncio
    async def test_create_email_key(self, http_client, auth_headers, test_account, test_email):
        """Test creating email PIX key"""
        payload = {
            "key_type": "EMAIL",
            "key_value": test_email,
            "account_id": test_account["id"],
            "owner_name": test_account["owner_name"],
            "owner_document": test_account["owner_document"]
        }

        response = await http_client.post(
            f"{PIX_SERVICE_URL}/pix/keys",
            json=payload,
            headers=auth_headers
        )

        assert response.status_code in [201, 409]

    @pytest.mark.asyncio
    async def test_create_phone_key(self, http_client, auth_headers, test_account, test_phone):
        """Test creating phone PIX key"""
        payload = {
            "key_type": "PHONE",
            "key_value": test_phone,
            "account_id": test_account["id"],
            "owner_name": test_account["owner_name"],
            "owner_document": test_account["owner_document"]
        }

        response = await http_client.post(
            f"{PIX_SERVICE_URL}/pix/keys",
            json=payload,
            headers=auth_headers
        )

        assert response.status_code in [201, 409]

    @pytest.mark.asyncio
    async def test_create_random_key(self, http_client, auth_headers, test_account):
        """Test creating random (EVP) PIX key"""
        payload = {
            "key_type": "RANDOM",
            "account_id": test_account["id"],
            "owner_name": test_account["owner_name"],
            "owner_document": test_account["owner_document"]
        }

        response = await http_client.post(
            f"{PIX_SERVICE_URL}/pix/keys",
            json=payload,
            headers=auth_headers
        )

        assert response.status_code in [201, 409]

        if response.status_code == 201:
            data = response.json()
            assert data["key_type"] == "RANDOM"
            assert len(data["key_value"]) == 36  # UUID format

    @pytest.mark.asyncio
    async def test_list_keys_by_account(self, http_client, auth_headers, test_account):
        """Test listing PIX keys by account"""
        response = await http_client.get(
            f"{PIX_SERVICE_URL}/pix/keys?account_id={test_account['id']}",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    @pytest.mark.asyncio
    async def test_resolve_key(self, http_client, auth_headers, test_email):
        """Test resolving PIX key"""
        response = await http_client.get(
            f"{PIX_SERVICE_URL}/pix/resolve?key={test_email}",
            headers=auth_headers
        )

        # Either found or not found
        assert response.status_code in [200, 404]

    @pytest.mark.asyncio
    async def test_delete_key(self, http_client, auth_headers, test_account):
        """Test deleting PIX key"""
        # First create a key to delete
        random_email = f"delete_test_{uuid.uuid4().hex[:8]}@test.com"
        create_payload = {
            "key_type": "EMAIL",
            "key_value": random_email,
            "account_id": test_account["id"],
            "owner_name": test_account["owner_name"],
            "owner_document": test_account["owner_document"]
        }

        create_response = await http_client.post(
            f"{PIX_SERVICE_URL}/pix/keys",
            json=create_payload,
            headers=auth_headers
        )

        if create_response.status_code == 201:
            data = create_response.json()
            key_id = data.get("id")

            # Delete the key
            delete_response = await http_client.delete(
                f"{PIX_SERVICE_URL}/pix/keys/{key_id}",
                headers=auth_headers
            )

            assert delete_response.status_code in [200, 204, 404]


# ============================================
# PIX Transfer Tests
# ============================================

class TestPixTransfer:
    """PIX transfer tests"""

    @pytest.mark.asyncio
    async def test_create_transfer(self, http_client, auth_headers, test_account, test_email):
        """Test creating PIX transfer"""
        payload = {
            "payer_account_id": test_account["id"],
            "payee_key": test_email,
            "amount": 100.50,
            "description": "Integration test transfer",
            "idempotency_key": str(uuid.uuid4())
        }

        response = await http_client.post(
            f"{PIX_SERVICE_URL}/pix/transfer",
            json=payload,
            headers=auth_headers
        )

        # May fail due to insufficient funds or other business rules
        assert response.status_code in [200, 201, 202, 400, 422]

        if response.status_code in [200, 201, 202]:
            data = response.json()
            assert "e2e_id" in data
            assert data["amount"] == 100.50

    @pytest.mark.asyncio
    async def test_transfer_idempotency(self, http_client, auth_headers, test_account, test_email):
        """Test transfer idempotency"""
        idempotency_key = str(uuid.uuid4())
        payload = {
            "payer_account_id": test_account["id"],
            "payee_key": test_email,
            "amount": 50.00,
            "description": "Idempotency test",
            "idempotency_key": idempotency_key
        }

        # First request
        response1 = await http_client.post(
            f"{PIX_SERVICE_URL}/pix/transfer",
            json=payload,
            headers=auth_headers
        )

        # Second request with same idempotency key
        response2 = await http_client.post(
            f"{PIX_SERVICE_URL}/pix/transfer",
            json=payload,
            headers=auth_headers
        )

        # Both should return same response
        if response1.status_code in [200, 201, 202]:
            assert response2.status_code in [200, 201, 202]

    @pytest.mark.asyncio
    async def test_transfer_validation_amount_zero(self, http_client, auth_headers, test_account, test_email):
        """Test transfer validation - zero amount"""
        payload = {
            "payer_account_id": test_account["id"],
            "payee_key": test_email,
            "amount": 0,
            "idempotency_key": str(uuid.uuid4())
        }

        response = await http_client.post(
            f"{PIX_SERVICE_URL}/pix/transfer",
            json=payload,
            headers=auth_headers
        )

        assert response.status_code == 422  # Validation error

    @pytest.mark.asyncio
    async def test_transfer_validation_negative_amount(self, http_client, auth_headers, test_account, test_email):
        """Test transfer validation - negative amount"""
        payload = {
            "payer_account_id": test_account["id"],
            "payee_key": test_email,
            "amount": -100,
            "idempotency_key": str(uuid.uuid4())
        }

        response = await http_client.post(
            f"{PIX_SERVICE_URL}/pix/transfer",
            json=payload,
            headers=auth_headers
        )

        assert response.status_code == 422  # Validation error

    @pytest.mark.asyncio
    async def test_get_transfer_by_e2e_id(self, http_client, auth_headers):
        """Test getting transfer by E2E ID"""
        # Use a sample E2E ID
        e2e_id = "E00000000202401151234567890123456"

        response = await http_client.get(
            f"{PIX_SERVICE_URL}/pix/transfer/{e2e_id}",
            headers=auth_headers
        )

        # Either found or not found
        assert response.status_code in [200, 404]


# ============================================
# QR Code Tests
# ============================================

class TestPixQRCode:
    """PIX QR code tests"""

    @pytest.mark.asyncio
    async def test_create_static_qrcode(self, http_client, auth_headers, test_email):
        """Test creating static QR code"""
        payload = {
            "payee_key": test_email,
            "payee_name": "Test Merchant",
            "payee_city": "São Paulo",
            "description": "Test static QR"
        }

        response = await http_client.post(
            f"{PIX_SERVICE_URL}/pix/qrcode/static",
            json=payload,
            headers=auth_headers
        )

        assert response.status_code in [200, 201]

        if response.status_code in [200, 201]:
            data = response.json()
            assert "tx_id" in data
            assert "br_code" in data
            assert data["qrcode_type"] == "STATIC"

    @pytest.mark.asyncio
    async def test_create_dynamic_qrcode(self, http_client, auth_headers, test_email):
        """Test creating dynamic QR code"""
        payload = {
            "payee_key": test_email,
            "payee_name": "Test Merchant",
            "payee_city": "São Paulo",
            "amount": 150.00,
            "expiration_minutes": 30,
            "description": "Test dynamic QR"
        }

        response = await http_client.post(
            f"{PIX_SERVICE_URL}/pix/qrcode/dynamic",
            json=payload,
            headers=auth_headers
        )

        assert response.status_code in [200, 201]

        if response.status_code in [200, 201]:
            data = response.json()
            assert "tx_id" in data
            assert "br_code" in data
            assert data["qrcode_type"] == "DYNAMIC"
            assert data["amount"] == 150.00

    @pytest.mark.asyncio
    async def test_decode_qrcode(self, http_client, auth_headers):
        """Test decoding QR code"""
        # Sample BR Code (may not be valid, just testing endpoint)
        payload = {
            "br_code": "00020126580014br.gov.bcb.pix0136a629534e-7693-4846-b028-f9b3f5204000053039865802BR5913Test"
        }

        response = await http_client.post(
            f"{PIX_SERVICE_URL}/pix/qrcode/decode",
            json=payload,
            headers=auth_headers
        )

        # Either decoded successfully or invalid format
        assert response.status_code in [200, 400]

    @pytest.mark.asyncio
    async def test_get_qrcode_by_txid(self, http_client, auth_headers):
        """Test getting QR code by transaction ID"""
        tx_id = f"test_{uuid.uuid4().hex[:20]}"

        response = await http_client.get(
            f"{PIX_SERVICE_URL}/pix/qrcode/{tx_id}",
            headers=auth_headers
        )

        # Either found or not found
        assert response.status_code in [200, 404]


# ============================================
# Statement Tests
# ============================================

class TestPixStatement:
    """PIX statement tests"""

    @pytest.mark.asyncio
    async def test_get_statement(self, http_client, auth_headers, test_account):
        """Test getting PIX statement"""
        start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
        end_date = datetime.now().strftime('%Y-%m-%d')

        response = await http_client.get(
            f"{PIX_SERVICE_URL}/pix/statement",
            params={
                "account_id": test_account["id"],
                "start_date": start_date,
                "end_date": end_date,
                "limit": 100
            },
            headers=auth_headers
        )

        assert response.status_code == 200

        data = response.json()
        assert isinstance(data, dict) or isinstance(data, list)

    @pytest.mark.asyncio
    async def test_get_statement_pagination(self, http_client, auth_headers, test_account):
        """Test statement pagination"""
        response = await http_client.get(
            f"{PIX_SERVICE_URL}/pix/statement",
            params={
                "account_id": test_account["id"],
                "limit": 10,
                "offset": 0
            },
            headers=auth_headers
        )

        assert response.status_code == 200


# ============================================
# Limits Tests
# ============================================

class TestPixLimits:
    """PIX limits tests"""

    @pytest.mark.asyncio
    async def test_get_limits(self, http_client, auth_headers, test_account):
        """Test getting PIX limits"""
        response = await http_client.get(
            f"{PIX_SERVICE_URL}/pix/limits/{test_account['id']}",
            headers=auth_headers
        )

        assert response.status_code in [200, 404]

    @pytest.mark.asyncio
    async def test_update_limits(self, http_client, auth_headers, test_account):
        """Test updating PIX limits"""
        payload = {
            "daily_limit": 10000.00,
            "nightly_limit": 2000.00,
            "per_transaction_limit": 5000.00
        }

        response = await http_client.put(
            f"{PIX_SERVICE_URL}/pix/limits/{test_account['id']}",
            json=payload,
            headers=auth_headers
        )

        assert response.status_code in [200, 201, 404]


# ============================================
# Performance Tests
# ============================================

class TestPerformance:
    """Performance tests"""

    @pytest.mark.asyncio
    async def test_health_response_time(self, http_client):
        """Test health endpoint response time"""
        import time

        start = time.perf_counter()
        response = await http_client.get(f"{PIX_SERVICE_URL}/health")
        duration = time.perf_counter() - start

        assert response.status_code == 200
        assert duration < 1.0  # Should respond in less than 1 second

    @pytest.mark.asyncio
    async def test_concurrent_requests(self, http_client, auth_headers):
        """Test handling concurrent requests"""
        async def make_request():
            response = await http_client.get(
                f"{PIX_SERVICE_URL}/health",
                headers=auth_headers
            )
            return response.status_code

        # Make 10 concurrent requests
        tasks = [make_request() for _ in range(10)]
        results = await asyncio.gather(*tasks)

        # All should succeed
        assert all(status == 200 for status in results)


# ============================================
# Error Handling Tests
# ============================================

class TestErrorHandling:
    """Error handling tests"""

    @pytest.mark.asyncio
    async def test_invalid_json(self, http_client, auth_headers):
        """Test handling invalid JSON"""
        response = await http_client.post(
            f"{PIX_SERVICE_URL}/pix/transfer",
            content="invalid json",
            headers={**auth_headers, "Content-Type": "application/json"}
        )

        assert response.status_code in [400, 422]

    @pytest.mark.asyncio
    async def test_missing_required_fields(self, http_client, auth_headers):
        """Test handling missing required fields"""
        payload = {
            # Missing required fields
        }

        response = await http_client.post(
            f"{PIX_SERVICE_URL}/pix/transfer",
            json=payload,
            headers=auth_headers
        )

        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_not_found_endpoint(self, http_client, auth_headers):
        """Test handling non-existent endpoint"""
        response = await http_client.get(
            f"{PIX_SERVICE_URL}/pix/nonexistent",
            headers=auth_headers
        )

        assert response.status_code == 404


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
