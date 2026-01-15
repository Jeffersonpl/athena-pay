"""
Athena Pay - Load Testing with Locust
Production-ready load tests for performance validation

Usage:
    # Run locally
    locust -f locustfile.py --host=http://localhost:8080

    # Run headless with 100 users, spawn rate 10/s, for 5 minutes
    locust -f locustfile.py --host=http://localhost:8080 \
           --headless -u 100 -r 10 -t 5m \
           --csv=results/load_test

    # Run distributed (master)
    locust -f locustfile.py --master --host=http://localhost:8080

    # Run distributed (worker)
    locust -f locustfile.py --worker --master-host=<master-ip>
"""

import random
import uuid
import json
from datetime import datetime, timedelta
from locust import HttpUser, task, between, tag, events
from locust.runners import MasterRunner


# ============================================
# Test Data Generators
# ============================================

def generate_cpf():
    """Generate random valid CPF"""
    def calculate_digit(cpf, weights):
        total = sum(int(cpf[i]) * weights[i] for i in range(len(weights)))
        remainder = total % 11
        return '0' if remainder < 2 else str(11 - remainder)

    base = ''.join([str(random.randint(0, 9)) for _ in range(9)])
    digit1 = calculate_digit(base, [10, 9, 8, 7, 6, 5, 4, 3, 2])
    digit2 = calculate_digit(base + digit1, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2])
    return base + digit1 + digit2


def generate_phone():
    """Generate random Brazilian phone"""
    ddd = random.choice(['11', '21', '31', '41', '51', '61', '71', '81', '91'])
    number = '9' + ''.join([str(random.randint(0, 9)) for _ in range(8)])
    return f"+55{ddd}{number}"


def generate_email():
    """Generate random email"""
    domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com']
    name = ''.join(random.choices('abcdefghijklmnopqrstuvwxyz', k=10))
    return f"{name}_{random.randint(1000, 9999)}@{random.choice(domains)}"


def generate_random_key():
    """Generate random PIX key"""
    return str(uuid.uuid4())


# ============================================
# Base User Class
# ============================================

class AthenaUser(HttpUser):
    """Base user for Athena Pay load testing"""

    abstract = True
    wait_time = between(1, 3)

    def on_start(self):
        """Initialize user session"""
        self.account_id = str(uuid.uuid4())
        self.customer_id = str(uuid.uuid4())
        self.auth_token = self._get_auth_token()
        self.pix_keys = []
        self.created_qrcodes = []

    def _get_auth_token(self):
        """Get authentication token"""
        # In production, implement actual auth
        return f"Bearer test_token_{self.account_id}"

    def _headers(self):
        """Get request headers with auth"""
        return {
            "Authorization": self.auth_token,
            "Content-Type": "application/json",
            "X-Request-ID": str(uuid.uuid4()),
            "X-Correlation-ID": str(uuid.uuid4())
        }


# ============================================
# PIX Service Load Tests
# ============================================

class PixServiceUser(AthenaUser):
    """Load tests for PIX service"""

    @tag('health')
    @task(1)
    def health_check(self):
        """Test health endpoint"""
        with self.client.get(
            "/health",
            name="PIX - Health Check"
        ) as response:
            if response.status_code != 200:
                response.failure("Health check failed")

    @tag('keys', 'create')
    @task(5)
    def create_pix_key(self):
        """Test PIX key creation"""
        key_type = random.choice(['CPF', 'EMAIL', 'PHONE', 'RANDOM'])

        if key_type == 'CPF':
            key_value = generate_cpf()
        elif key_type == 'EMAIL':
            key_value = generate_email()
        elif key_type == 'PHONE':
            key_value = generate_phone()
        else:
            key_value = generate_random_key()

        payload = {
            "key_type": key_type,
            "key_value": key_value,
            "account_id": self.account_id,
            "owner_name": "Test User",
            "owner_document": generate_cpf()
        }

        with self.client.post(
            "/pix/keys",
            json=payload,
            headers=self._headers(),
            name="PIX - Create Key"
        ) as response:
            if response.status_code == 201:
                data = response.json()
                self.pix_keys.append(data.get('key_value', key_value))
            elif response.status_code == 409:
                # Key already exists - acceptable
                pass
            else:
                response.failure(f"Create key failed: {response.status_code}")

    @tag('keys', 'read')
    @task(10)
    def list_pix_keys(self):
        """Test listing PIX keys"""
        with self.client.get(
            f"/pix/keys?account_id={self.account_id}",
            headers=self._headers(),
            name="PIX - List Keys"
        ) as response:
            if response.status_code != 200:
                response.failure(f"List keys failed: {response.status_code}")

    @tag('keys', 'read')
    @task(8)
    def resolve_pix_key(self):
        """Test resolving PIX key"""
        # Use a common test key or random
        key = random.choice(self.pix_keys) if self.pix_keys else generate_random_key()

        with self.client.get(
            f"/pix/resolve?key={key}",
            headers=self._headers(),
            name="PIX - Resolve Key"
        ) as response:
            # 404 is acceptable for non-existent keys
            if response.status_code not in [200, 404]:
                response.failure(f"Resolve key failed: {response.status_code}")

    @tag('transfer', 'write')
    @task(15)
    def create_pix_transfer(self):
        """Test PIX transfer creation"""
        payload = {
            "payer_account_id": self.account_id,
            "payee_key": random.choice(self.pix_keys) if self.pix_keys else generate_email(),
            "amount": round(random.uniform(10, 5000), 2),
            "description": f"Test transfer {uuid.uuid4().hex[:8]}",
            "idempotency_key": str(uuid.uuid4())
        }

        with self.client.post(
            "/pix/transfer",
            json=payload,
            headers=self._headers(),
            name="PIX - Transfer"
        ) as response:
            if response.status_code not in [200, 201, 202]:
                response.failure(f"Transfer failed: {response.status_code}")

    @tag('transfer', 'read')
    @task(12)
    def get_pix_transfer(self):
        """Test getting PIX transfer details"""
        # Use a random E2E ID format
        e2e_id = f"E0000000020240115{random.randint(10000000000000, 99999999999999)}"

        with self.client.get(
            f"/pix/transfer/{e2e_id}",
            headers=self._headers(),
            name="PIX - Get Transfer"
        ) as response:
            # 404 is acceptable for non-existent transfers
            if response.status_code not in [200, 404]:
                response.failure(f"Get transfer failed: {response.status_code}")

    @tag('qrcode', 'create')
    @task(8)
    def create_qrcode_static(self):
        """Test static QR code creation"""
        payload = {
            "payee_key": random.choice(self.pix_keys) if self.pix_keys else generate_email(),
            "payee_name": "Test Merchant",
            "payee_city": "São Paulo",
            "description": f"Test QR {uuid.uuid4().hex[:8]}"
        }

        with self.client.post(
            "/pix/qrcode/static",
            json=payload,
            headers=self._headers(),
            name="PIX - Create QR Static"
        ) as response:
            if response.status_code in [200, 201]:
                data = response.json()
                self.created_qrcodes.append(data.get('tx_id'))
            else:
                response.failure(f"Create QR static failed: {response.status_code}")

    @tag('qrcode', 'create')
    @task(5)
    def create_qrcode_dynamic(self):
        """Test dynamic QR code creation"""
        payload = {
            "payee_key": random.choice(self.pix_keys) if self.pix_keys else generate_email(),
            "payee_name": "Test Merchant",
            "payee_city": "São Paulo",
            "amount": round(random.uniform(50, 1000), 2),
            "expiration_minutes": 30,
            "description": f"Test dynamic QR {uuid.uuid4().hex[:8]}"
        }

        with self.client.post(
            "/pix/qrcode/dynamic",
            json=payload,
            headers=self._headers(),
            name="PIX - Create QR Dynamic"
        ) as response:
            if response.status_code in [200, 201]:
                data = response.json()
                self.created_qrcodes.append(data.get('tx_id'))
            else:
                response.failure(f"Create QR dynamic failed: {response.status_code}")

    @tag('qrcode', 'read')
    @task(6)
    def decode_qrcode(self):
        """Test QR code decoding"""
        # Sample BR Code (EMV format)
        br_code = "00020126580014br.gov.bcb.pix0136a629534e-7693-4846-b028-f9b3f"

        payload = {"br_code": br_code}

        with self.client.post(
            "/pix/qrcode/decode",
            json=payload,
            headers=self._headers(),
            name="PIX - Decode QR"
        ) as response:
            if response.status_code not in [200, 400]:
                response.failure(f"Decode QR failed: {response.status_code}")

    @tag('statement', 'read')
    @task(10)
    def get_statement(self):
        """Test statement retrieval"""
        start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
        end_date = datetime.now().strftime('%Y-%m-%d')

        with self.client.get(
            f"/pix/statement?account_id={self.account_id}&start_date={start_date}&end_date={end_date}&limit=50",
            headers=self._headers(),
            name="PIX - Get Statement"
        ) as response:
            if response.status_code != 200:
                response.failure(f"Get statement failed: {response.status_code}")


# ============================================
# Accounts Service Load Tests
# ============================================

class AccountsServiceUser(AthenaUser):
    """Load tests for Accounts service"""

    @tag('health')
    @task(1)
    def health_check(self):
        """Test health endpoint"""
        with self.client.get(
            "/health",
            name="Accounts - Health Check"
        ) as response:
            if response.status_code != 200:
                response.failure("Health check failed")

    @tag('balance', 'read')
    @task(20)
    def get_balance(self):
        """Test balance retrieval"""
        with self.client.get(
            f"/accounts/{self.account_id}/balance",
            headers=self._headers(),
            name="Accounts - Get Balance"
        ) as response:
            if response.status_code not in [200, 404]:
                response.failure(f"Get balance failed: {response.status_code}")

    @tag('statement', 'read')
    @task(10)
    def get_statement(self):
        """Test statement retrieval"""
        start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
        end_date = datetime.now().strftime('%Y-%m-%d')

        with self.client.get(
            f"/accounts/{self.account_id}/statement?start={start_date}&end={end_date}&limit=100",
            headers=self._headers(),
            name="Accounts - Get Statement"
        ) as response:
            if response.status_code not in [200, 404]:
                response.failure(f"Get statement failed: {response.status_code}")

    @tag('transfer', 'write')
    @task(8)
    def create_internal_transfer(self):
        """Test internal transfer"""
        payload = {
            "from_account_id": self.account_id,
            "to_account_id": str(uuid.uuid4()),
            "amount": round(random.uniform(10, 1000), 2),
            "description": f"Test transfer {uuid.uuid4().hex[:8]}",
            "idempotency_key": str(uuid.uuid4())
        }

        with self.client.post(
            "/accounts/transfer",
            json=payload,
            headers=self._headers(),
            name="Accounts - Internal Transfer"
        ) as response:
            if response.status_code not in [200, 201, 202, 400, 422]:
                response.failure(f"Transfer failed: {response.status_code}")


# ============================================
# Combined Load Test
# ============================================

class CombinedUser(AthenaUser):
    """Combined load test simulating real user behavior"""

    weight = 10

    @task(15)
    def check_balance(self):
        """Most common operation - check balance"""
        with self.client.get(
            f"/accounts/{self.account_id}/balance",
            headers=self._headers(),
            name="[Combined] Check Balance"
        ) as response:
            pass

    @task(10)
    def list_transactions(self):
        """View recent transactions"""
        with self.client.get(
            f"/pix/statement?account_id={self.account_id}&limit=20",
            headers=self._headers(),
            name="[Combined] List Transactions"
        ) as response:
            pass

    @task(5)
    def send_pix(self):
        """Send PIX transfer"""
        payload = {
            "payer_account_id": self.account_id,
            "payee_key": generate_email(),
            "amount": round(random.uniform(10, 500), 2),
            "description": "Test payment",
            "idempotency_key": str(uuid.uuid4())
        }

        with self.client.post(
            "/pix/transfer",
            json=payload,
            headers=self._headers(),
            name="[Combined] Send PIX"
        ) as response:
            pass

    @task(3)
    def generate_qr(self):
        """Generate QR code for receiving"""
        payload = {
            "payee_key": generate_random_key(),
            "payee_name": "Test User",
            "payee_city": "São Paulo",
            "amount": round(random.uniform(50, 200), 2)
        }

        with self.client.post(
            "/pix/qrcode/dynamic",
            json=payload,
            headers=self._headers(),
            name="[Combined] Generate QR"
        ) as response:
            pass


# ============================================
# Event Handlers
# ============================================

@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    """Called when test starts"""
    if isinstance(environment.runner, MasterRunner):
        print("Load test starting on master node")


@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    """Called when test stops"""
    if isinstance(environment.runner, MasterRunner):
        print("Load test complete")


@events.request.add_listener
def on_request(request_type, name, response_time, response_length, response, context, exception, **kwargs):
    """Called on each request - useful for custom metrics"""
    if exception:
        print(f"Request failed: {name} - {exception}")
