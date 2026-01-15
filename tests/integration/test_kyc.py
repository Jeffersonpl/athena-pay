"""
Athena Pay - KYC Service Integration Tests
"""

import pytest
import httpx
import base64


class TestKycService:
    """Integration tests for KYC service."""

    @pytest.mark.asyncio
    async def test_get_kyc_status(self, kyc_client: httpx.AsyncClient):
        """Test KYC status retrieval."""
        customer_id = "00000000-0000-0000-0000-000000000001"
        response = await kyc_client.get(f"/kyc/status/{customer_id}")

        assert response.status_code in [200, 404]

        if response.status_code == 200:
            data = response.json()
            assert "level" in data
            assert data["level"] in [0, 1, 2, 3]

    @pytest.mark.asyncio
    async def test_submit_document(self, kyc_client: httpx.AsyncClient):
        """Test document submission."""
        # Create a minimal valid image (1x1 pixel PNG)
        minimal_png = base64.b64encode(
            b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01'
            b'\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde'
        ).decode()

        document_data = {
            "customer_id": "00000000-0000-0000-0000-000000000001",
            "document_type": "RG",
            "document_front": minimal_png,
            "document_back": minimal_png
        }
        response = await kyc_client.post("/documents", json=document_data)

        assert response.status_code in [200, 201, 400, 422]

        if response.status_code in [200, 201]:
            data = response.json()
            assert "id" in data
            assert "status" in data

    @pytest.mark.asyncio
    async def test_get_documents(self, kyc_client: httpx.AsyncClient):
        """Test documents retrieval."""
        customer_id = "00000000-0000-0000-0000-000000000001"
        response = await kyc_client.get(f"/documents/{customer_id}")

        assert response.status_code in [200, 404]

        if response.status_code == 200:
            data = response.json()
            assert isinstance(data, list)

    @pytest.mark.asyncio
    async def test_submit_selfie(self, kyc_client: httpx.AsyncClient):
        """Test selfie submission for face validation."""
        minimal_png = base64.b64encode(
            b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01'
            b'\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde'
        ).decode()

        selfie_data = {
            "customer_id": "00000000-0000-0000-0000-000000000001",
            "selfie": minimal_png
        }
        response = await kyc_client.post("/selfie", json=selfie_data)

        assert response.status_code in [200, 201, 400, 422]

    @pytest.mark.asyncio
    async def test_validate_face(self, kyc_client: httpx.AsyncClient):
        """Test face validation."""
        customer_id = "00000000-0000-0000-0000-000000000001"
        response = await kyc_client.post(f"/validate/face/{customer_id}")

        assert response.status_code in [200, 400, 404, 422]

        if response.status_code == 200:
            data = response.json()
            assert "similarity_score" in data or "result" in data

    @pytest.mark.asyncio
    async def test_validate_document(self, kyc_client: httpx.AsyncClient):
        """Test document validation (OCR)."""
        customer_id = "00000000-0000-0000-0000-000000000001"
        response = await kyc_client.post(f"/validate/document/{customer_id}")

        assert response.status_code in [200, 400, 404, 422]

    @pytest.mark.asyncio
    async def test_upgrade_kyc_level(self, kyc_client: httpx.AsyncClient):
        """Test KYC level upgrade."""
        upgrade_data = {
            "customer_id": "00000000-0000-0000-0000-000000000001",
            "target_level": 2
        }
        response = await kyc_client.post("/kyc/upgrade", json=upgrade_data)

        assert response.status_code in [200, 400, 422]

    @pytest.mark.asyncio
    async def test_get_validation_history(self, kyc_client: httpx.AsyncClient):
        """Test validation history retrieval."""
        customer_id = "00000000-0000-0000-0000-000000000001"
        response = await kyc_client.get(f"/validations/{customer_id}")

        assert response.status_code in [200, 404]

        if response.status_code == 200:
            data = response.json()
            assert isinstance(data, list)

    @pytest.mark.asyncio
    async def test_kyc_requirements(self, kyc_client: httpx.AsyncClient):
        """Test KYC requirements for each level."""
        response = await kyc_client.get("/requirements")

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, dict) or isinstance(data, list)
