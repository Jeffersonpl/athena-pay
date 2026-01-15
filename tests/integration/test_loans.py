"""
Athena Pay - Loans Service Integration Tests
"""

import pytest
import httpx


class TestLoansService:
    """Integration tests for loans service."""

    @pytest.mark.asyncio
    async def test_get_credit_score(self, loans_client: httpx.AsyncClient):
        """Test credit score retrieval."""
        customer_id = "00000000-0000-0000-0000-000000000001"
        response = await loans_client.get(f"/credit/score/{customer_id}")

        assert response.status_code in [200, 404]

        if response.status_code == 200:
            data = response.json()
            assert "score" in data
            assert 0 <= data["score"] <= 1000
            assert "band" in data

    @pytest.mark.asyncio
    async def test_simulate_loan(self, loans_client: httpx.AsyncClient):
        """Test loan simulation."""
        simulation_data = {
            "customer_id": "00000000-0000-0000-0000-000000000001",
            "product": "PERSONAL",
            "amount": 10000.00,
            "installments": 12
        }
        response = await loans_client.post("/loans/simulate", json=simulation_data)

        assert response.status_code in [200, 400]

        if response.status_code == 200:
            data = response.json()
            assert "installment_value" in data
            assert "total_amount" in data
            assert "interest_rate" in data

    @pytest.mark.asyncio
    async def test_apply_for_loan(self, loans_client: httpx.AsyncClient, test_loan_application):
        """Test loan application."""
        response = await loans_client.post("/loans/apply", json=test_loan_application)

        assert response.status_code in [200, 201, 400, 422]

        if response.status_code in [200, 201]:
            data = response.json()
            assert "id" in data
            assert "status" in data
            assert data["principal"] == test_loan_application["amount"]

    @pytest.mark.asyncio
    async def test_get_loan(self, loans_client: httpx.AsyncClient):
        """Test loan retrieval."""
        # First apply for a loan
        application = {
            "customer_id": "00000000-0000-0000-0000-000000000001",
            "account_id": "acc-001",
            "product": "PERSONAL",
            "amount": 5000.00,
            "installments": 6
        }
        create_response = await loans_client.post("/loans/apply", json=application)

        if create_response.status_code in [200, 201]:
            loan_id = create_response.json()["id"]
            response = await loans_client.get(f"/loans/{loan_id}")

            assert response.status_code == 200
            data = response.json()
            assert data["id"] == loan_id

    @pytest.mark.asyncio
    async def test_get_loan_installments(self, loans_client: httpx.AsyncClient):
        """Test loan installments retrieval."""
        # First apply for a loan
        application = {
            "customer_id": "00000000-0000-0000-0000-000000000001",
            "account_id": "acc-001",
            "product": "PERSONAL",
            "amount": 3000.00,
            "installments": 3
        }
        create_response = await loans_client.post("/loans/apply", json=application)

        if create_response.status_code in [200, 201]:
            loan_id = create_response.json()["id"]
            response = await loans_client.get(f"/loans/{loan_id}/installments")

            assert response.status_code == 200
            data = response.json()
            assert isinstance(data, list)
            assert len(data) == 3  # 3 installments

    @pytest.mark.asyncio
    async def test_list_customer_loans(self, loans_client: httpx.AsyncClient):
        """Test listing loans by customer."""
        customer_id = "00000000-0000-0000-0000-000000000001"
        response = await loans_client.get(f"/loans/customer/{customer_id}")

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    @pytest.mark.asyncio
    async def test_prepay_loan(self, loans_client: httpx.AsyncClient):
        """Test loan prepayment."""
        # First apply for a loan
        application = {
            "customer_id": "00000000-0000-0000-0000-000000000001",
            "account_id": "acc-001",
            "product": "PERSONAL",
            "amount": 2000.00,
            "installments": 4
        }
        create_response = await loans_client.post("/loans/apply", json=application)

        if create_response.status_code in [200, 201]:
            loan_id = create_response.json()["id"]

            prepay_data = {
                "amount": 1000.00,
                "reduce_installments": True
            }
            response = await loans_client.post(f"/loans/{loan_id}/prepay", json=prepay_data)

            assert response.status_code in [200, 400, 422]

    @pytest.mark.asyncio
    async def test_loan_not_found(self, loans_client: httpx.AsyncClient):
        """Test 404 for non-existent loan."""
        response = await loans_client.get("/loans/nonexistent-id")
        assert response.status_code in [404, 422]

    @pytest.mark.asyncio
    async def test_loan_products(self, loans_client: httpx.AsyncClient):
        """Test loan products listing."""
        response = await loans_client.get("/products")

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    @pytest.mark.asyncio
    async def test_credit_limit(self, loans_client: httpx.AsyncClient):
        """Test credit limit retrieval."""
        customer_id = "00000000-0000-0000-0000-000000000001"
        response = await loans_client.get(f"/credit/limit/{customer_id}")

        assert response.status_code in [200, 404]

        if response.status_code == 200:
            data = response.json()
            assert "total_limit" in data
            assert "available_limit" in data
