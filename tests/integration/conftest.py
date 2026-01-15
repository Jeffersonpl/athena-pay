"""
Athena Pay - Integration Test Configuration
"""

import os
import pytest
import asyncio
from typing import AsyncGenerator, Generator
import httpx

# Service base URLs
ACCOUNTS_URL = os.getenv("ACCOUNTS_SERVICE_URL", "http://localhost:8001")
PIX_URL = os.getenv("PIX_SERVICE_URL", "http://localhost:8010")
CARDS_URL = os.getenv("CARDS_SERVICE_URL", "http://localhost:8011")
BOLETO_URL = os.getenv("BOLETO_SERVICE_URL", "http://localhost:8012")
WIRE_URL = os.getenv("WIRE_SERVICE_URL", "http://localhost:8013")
LOANS_URL = os.getenv("LOANS_SERVICE_URL", "http://localhost:8020")
COMPLIANCE_URL = os.getenv("COMPLIANCE_SERVICE_URL", "http://localhost:8003")
KYC_URL = os.getenv("KYC_SERVICE_URL", "http://localhost:8004")
AUDIT_URL = os.getenv("AUDIT_SERVICE_URL", "http://localhost:8002")
AI_URL = os.getenv("AI_SERVICE_URL", "http://localhost:8030")


@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """Create event loop for async tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
async def http_client() -> AsyncGenerator[httpx.AsyncClient, None]:
    """Create shared HTTP client."""
    async with httpx.AsyncClient(timeout=30.0) as client:
        yield client


@pytest.fixture(scope="session")
async def accounts_client() -> AsyncGenerator[httpx.AsyncClient, None]:
    """Create accounts service client."""
    async with httpx.AsyncClient(base_url=ACCOUNTS_URL, timeout=30.0) as client:
        yield client


@pytest.fixture(scope="session")
async def pix_client() -> AsyncGenerator[httpx.AsyncClient, None]:
    """Create PIX service client."""
    async with httpx.AsyncClient(base_url=PIX_URL, timeout=30.0) as client:
        yield client


@pytest.fixture(scope="session")
async def cards_client() -> AsyncGenerator[httpx.AsyncClient, None]:
    """Create cards service client."""
    async with httpx.AsyncClient(base_url=CARDS_URL, timeout=30.0) as client:
        yield client


@pytest.fixture(scope="session")
async def boleto_client() -> AsyncGenerator[httpx.AsyncClient, None]:
    """Create boleto service client."""
    async with httpx.AsyncClient(base_url=BOLETO_URL, timeout=30.0) as client:
        yield client


@pytest.fixture(scope="session")
async def wire_client() -> AsyncGenerator[httpx.AsyncClient, None]:
    """Create wire service client."""
    async with httpx.AsyncClient(base_url=WIRE_URL, timeout=30.0) as client:
        yield client


@pytest.fixture(scope="session")
async def loans_client() -> AsyncGenerator[httpx.AsyncClient, None]:
    """Create loans service client."""
    async with httpx.AsyncClient(base_url=LOANS_URL, timeout=30.0) as client:
        yield client


@pytest.fixture(scope="session")
async def compliance_client() -> AsyncGenerator[httpx.AsyncClient, None]:
    """Create compliance service client."""
    async with httpx.AsyncClient(base_url=COMPLIANCE_URL, timeout=30.0) as client:
        yield client


@pytest.fixture(scope="session")
async def kyc_client() -> AsyncGenerator[httpx.AsyncClient, None]:
    """Create KYC service client."""
    async with httpx.AsyncClient(base_url=KYC_URL, timeout=30.0) as client:
        yield client


@pytest.fixture(scope="session")
async def audit_client() -> AsyncGenerator[httpx.AsyncClient, None]:
    """Create audit service client."""
    async with httpx.AsyncClient(base_url=AUDIT_URL, timeout=30.0) as client:
        yield client


@pytest.fixture(scope="session")
async def ai_client() -> AsyncGenerator[httpx.AsyncClient, None]:
    """Create AI service client."""
    async with httpx.AsyncClient(base_url=AI_URL, timeout=30.0) as client:
        yield client


# Test data fixtures
@pytest.fixture
def test_customer():
    """Sample customer data."""
    return {
        "document_number": "12345678901",
        "document_type": "CPF",
        "name": "Usuario Teste",
        "email": "teste@athena.com",
        "phone": "11999999999"
    }


@pytest.fixture
def test_account():
    """Sample account data."""
    return {
        "customer_id": "00000000-0000-0000-0000-000000000001",
        "account_number": "12345678",
        "branch": "0001",
        "type": "CHECKING"
    }


@pytest.fixture
def test_pix_key():
    """Sample PIX key data."""
    return {
        "account_id": "acc-001",
        "key_type": "CPF",
        "key_value": "12345678901"
    }


@pytest.fixture
def test_pix_transfer():
    """Sample PIX transfer data."""
    return {
        "source_account_id": "acc-001",
        "target_key": "98765432109",
        "amount": 100.00,
        "description": "Teste PIX"
    }


@pytest.fixture
def test_card():
    """Sample card data."""
    return {
        "account_id": "acc-001",
        "type": "CREDIT",
        "variant": "VIRTUAL",
        "credit_limit": 5000.00
    }


@pytest.fixture
def test_boleto():
    """Sample boleto data."""
    return {
        "account_id": "acc-001",
        "amount": 150.00,
        "due_date": "2025-12-31",
        "beneficiary_name": "Athena Pay",
        "beneficiary_document": "12345678901234"
    }


@pytest.fixture
def test_wire_transfer():
    """Sample wire transfer data."""
    return {
        "source_account_id": "acc-001",
        "type": "TED",
        "target_bank": "001",
        "target_branch": "0001",
        "target_account": "123456",
        "target_document": "98765432109",
        "target_name": "Destinatario Teste",
        "amount": 500.00
    }


@pytest.fixture
def test_loan_application():
    """Sample loan application data."""
    return {
        "customer_id": "00000000-0000-0000-0000-000000000001",
        "account_id": "acc-001",
        "product": "PERSONAL",
        "amount": 10000.00,
        "installments": 12
    }


# ============================================
# Authentication Headers
# ============================================

@pytest.fixture
def auth_headers():
    """Get authentication headers for API requests."""
    import uuid
    return {
        "Authorization": "Bearer test_token_integration",
        "Content-Type": "application/json",
        "X-Request-ID": str(uuid.uuid4()),
        "X-Correlation-ID": str(uuid.uuid4())
    }


# ============================================
# Data Generators
# ============================================

@pytest.fixture
def generate_cpf():
    """Generate valid CPF numbers."""
    def _generate():
        import random

        def calculate_digit(cpf, weights):
            total = sum(int(cpf[i]) * weights[i] for i in range(len(weights)))
            remainder = total % 11
            return '0' if remainder < 2 else str(11 - remainder)

        base = ''.join([str(random.randint(0, 9)) for _ in range(9)])
        digit1 = calculate_digit(base, [10, 9, 8, 7, 6, 5, 4, 3, 2])
        digit2 = calculate_digit(base + digit1, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2])
        return base + digit1 + digit2

    return _generate


@pytest.fixture
def generate_email():
    """Generate random email addresses."""
    def _generate():
        import uuid
        import random
        domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'test.com']
        name = f"test_{uuid.uuid4().hex[:8]}"
        return f"{name}@{random.choice(domains)}"

    return _generate


@pytest.fixture
def generate_phone():
    """Generate random Brazilian phone numbers."""
    def _generate():
        import random
        ddd = random.choice(['11', '21', '31', '41', '51', '61'])
        number = '9' + ''.join([str(random.randint(0, 9)) for _ in range(8)])
        return f"+55{ddd}{number}"

    return _generate


# ============================================
# Pytest Configuration
# ============================================

def pytest_configure(config):
    """Register custom markers."""
    config.addinivalue_line("markers", "slow: marks tests as slow")
    config.addinivalue_line("markers", "integration: integration tests")
    config.addinivalue_line("markers", "smoke: smoke tests")
    config.addinivalue_line("markers", "pix: PIX related tests")
    config.addinivalue_line("markers", "accounts: Accounts related tests")
    config.addinivalue_line("markers", "cards: Cards related tests")
    config.addinivalue_line("markers", "loans: Loans related tests")
