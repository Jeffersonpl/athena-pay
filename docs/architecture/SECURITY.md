# Athena Pay - Security Architecture

## Overview

Athena Pay implements enterprise-grade security following OWASP guidelines, Brazilian financial regulations (BACEN), and industry best practices for PSP (Payment Service Provider) operations.

## Security Layers

```
┌─────────────────────────────────────────────────────────────────────┐
│                        API Gateway Layer                             │
│  Rate Limiting, WAF, DDoS Protection, TLS Termination               │
├─────────────────────────────────────────────────────────────────────┤
│                      Authentication Layer                            │
│  JWT (RS256/ES256), mTLS, API Keys, OAuth 2.0                       │
├─────────────────────────────────────────────────────────────────────┤
│                       Authorization Layer                            │
│  RBAC, ABAC, Permissions, Resource-Level Access Control             │
├─────────────────────────────────────────────────────────────────────┤
│                        Application Layer                             │
│  Input Validation, Output Encoding, CSRF Protection                 │
├─────────────────────────────────────────────────────────────────────┤
│                          Data Layer                                  │
│  Encryption at Rest, Field-Level Encryption, Data Masking           │
├─────────────────────────────────────────────────────────────────────┤
│                         Audit Layer                                  │
│  Logging, Monitoring, Alerting, Compliance Reporting                │
└─────────────────────────────────────────────────────────────────────┘
```

## Authentication

### JWT Authentication

Athena Pay uses JWT (JSON Web Tokens) for API authentication with support for RS256 and ES256 algorithms.

```python
from athena_shared.security.jwt_handler import JWTHandler, JWTConfig

# Configuration
config = JWTConfig(
    secret_key=os.getenv("JWT_SECRET"),
    algorithm="RS256",  # or "ES256" for ECDSA
    access_token_expire_minutes=30,
    refresh_token_expire_days=7,
    issuer="athena-pay",
    audience=["athena-api"]
)

jwt_handler = JWTHandler(config)

# Token creation
access_token = jwt_handler.create_access_token({
    "sub": user_id,
    "customer_id": customer_id,
    "account_ids": [account_id],
    "permissions": ["pix:read", "pix:write"],
    "kyc_level": 2
})

# Token verification
payload = jwt_handler.verify_token(token)
# Returns: TokenPayload with sub, exp, iat, permissions, etc.
```

### Token Structure

```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT",
    "kid": "athena-key-2024"
  },
  "payload": {
    "sub": "user-uuid",
    "iss": "athena-pay",
    "aud": ["athena-api"],
    "exp": 1705320000,
    "iat": 1705318200,
    "customer_id": "customer-uuid",
    "account_ids": ["account-1", "account-2"],
    "permissions": ["pix:read", "pix:write"],
    "kyc_level": 2,
    "session_id": "session-uuid"
  }
}
```

### mTLS (Mutual TLS)

For service-to-service communication and BACEN integration:

```python
import ssl
import httpx

# Client certificate configuration
ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
ssl_context.load_cert_chain(
    certfile="/certs/client.crt",
    keyfile="/certs/client.key"
)
ssl_context.load_verify_locations("/certs/ca.crt")

# HTTP client with mTLS
async with httpx.AsyncClient(verify=ssl_context) as client:
    response = await client.post(
        "https://spi.bcb.gov.br/pix/transfer",
        json=transfer_data
    )
```

### API Key Authentication

For backend service integration:

```python
from fastapi import Security
from fastapi.security import APIKeyHeader

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def verify_api_key(api_key: str = Security(api_key_header)):
    if not api_key:
        raise HTTPException(status_code=401, detail="API key required")

    # Validate API key against database
    key_record = await api_key_repo.find_by_key(api_key)
    if not key_record or key_record.is_expired():
        raise HTTPException(status_code=401, detail="Invalid API key")

    return key_record
```

## Authorization

### Role-Based Access Control (RBAC)

```python
from athena_shared.security.permissions import Role, Permission

class Role(str, Enum):
    CUSTOMER = "customer"
    MERCHANT = "merchant"
    ADMIN = "admin"
    COMPLIANCE = "compliance"
    SUPPORT = "support"
    SYSTEM = "system"

class Permission(str, Enum):
    # PIX permissions
    PIX_READ = "pix:read"
    PIX_WRITE = "pix:write"
    PIX_ADMIN = "pix:admin"

    # Account permissions
    ACCOUNTS_READ = "accounts:read"
    ACCOUNTS_WRITE = "accounts:write"
    ACCOUNTS_ADMIN = "accounts:admin"

    # Cards permissions
    CARDS_READ = "cards:read"
    CARDS_WRITE = "cards:write"

    # Admin permissions
    COMPLIANCE_READ = "compliance:read"
    COMPLIANCE_WRITE = "compliance:write"
    AUDIT_READ = "audit:read"
    SYSTEM_ADMIN = "system:admin"

# Role to permissions mapping
ROLE_PERMISSIONS = {
    Role.CUSTOMER: [
        Permission.PIX_READ, Permission.PIX_WRITE,
        Permission.ACCOUNTS_READ,
        Permission.CARDS_READ, Permission.CARDS_WRITE
    ],
    Role.MERCHANT: [
        Permission.PIX_READ, Permission.PIX_WRITE,
        Permission.ACCOUNTS_READ, Permission.ACCOUNTS_WRITE
    ],
    Role.ADMIN: [
        Permission.PIX_ADMIN,
        Permission.ACCOUNTS_ADMIN,
        Permission.COMPLIANCE_READ, Permission.COMPLIANCE_WRITE,
        Permission.AUDIT_READ
    ],
    Role.SYSTEM: ["*"]  # All permissions
}
```

### Permission Decorators

```python
from athena_shared.security.permissions import require_permission, require_role

@app.post("/pix/transfer")
@require_permission(Permission.PIX_WRITE)
async def send_transfer(request: TransferRequest, token: dict = Depends(verify_token)):
    """Requires PIX write permission"""
    pass

@app.get("/admin/users")
@require_role(Role.ADMIN)
async def list_users(token: dict = Depends(verify_token)):
    """Requires admin role"""
    pass

@app.delete("/pix/keys/{key_id}")
@require_permission(Permission.PIX_WRITE)
async def delete_key(
    key_id: str,
    token: dict = Depends(verify_token),
    db=Depends(get_db)
):
    """Also checks resource ownership"""
    key = await pix_key_repo.find_by_id(key_id)
    if key.account_id not in token.get("account_ids", []):
        raise HTTPException(status_code=403, detail="Access denied")
    pass
```

### Attribute-Based Access Control (ABAC)

```python
from athena_shared.security.permissions import PermissionChecker

checker = PermissionChecker()

# Complex authorization rules
async def can_send_pix(user: User, amount: Decimal) -> bool:
    rules = [
        # Basic permission check
        checker.has_permission(user, Permission.PIX_WRITE),

        # KYC level check
        user.kyc_level >= required_kyc_for_amount(amount),

        # Account status check
        user.account_status == "ACTIVE",

        # Transaction limit check
        await check_daily_limit(user.id, amount),

        # Time-based restriction (night limits)
        await check_time_based_limit(user.id, amount)
    ]

    return all(rules)
```

## Data Encryption

### Encryption at Rest

```python
from athena_shared.security.encryption import EncryptionService

encryption = EncryptionService(
    key=os.getenv("ENCRYPTION_KEY"),  # Base64-encoded 32-byte key
    algorithm="AES-256-GCM"
)

# Encrypt sensitive data before storage
customer_data = {
    "name": customer.name,
    "document": encryption.encrypt_pii(customer.document),
    "email": encryption.encrypt_pii(customer.email),
    "phone": encryption.encrypt_pii(customer.phone)
}

# Decrypt when needed
document = encryption.decrypt_pii(customer_data["document"])
```

### Field-Level Encryption

```python
# SQLAlchemy model with encrypted fields
from sqlalchemy import Column, String
from app.infrastructure.encryption import EncryptedString

class Customer(Base):
    __tablename__ = "customers"

    id = Column(String, primary_key=True)
    name = Column(String)
    document = Column(EncryptedString)  # Automatically encrypted
    email = Column(EncryptedString)
    phone = Column(EncryptedString)
```

### Card Data Protection (PCI DSS)

```python
# Card tokenization
from athena_shared.security.encryption import EncryptionService

class CardVault:
    """Secure card data storage"""

    def tokenize_card(self, card_number: str) -> str:
        """Convert card number to token"""
        # Validate card number
        if not self._is_valid_card(card_number):
            raise ValueError("Invalid card number")

        # Generate token
        token = f"tok_{uuid.uuid4().hex}"

        # Encrypt and store
        encrypted_pan = self.encryption.encrypt_card_number(card_number)
        self.vault_repo.store(token, encrypted_pan)

        return token

    def get_card_number(self, token: str) -> str:
        """Retrieve card number from token (restricted access)"""
        encrypted_pan = self.vault_repo.get(token)
        return self.encryption.decrypt_card_number(encrypted_pan)

    def get_masked_card(self, token: str) -> str:
        """Get masked card for display"""
        encrypted_pan = self.vault_repo.get(token)
        pan = self.encryption.decrypt_card_number(encrypted_pan)
        return f"****-****-****-{pan[-4:]}"
```

### Data Masking

```python
from athena_shared.security.encryption import EncryptionService

# Document masking
masked_cpf = encryption.mask_document("12345678901")  # "123.***.***-01"
masked_cnpj = encryption.mask_document("12345678000199")  # "12.345.***/**99-**"

# Card masking
masked_card = encryption.mask_card_number("4111111111111111")  # "****-****-****-1111"

# Email masking
masked_email = encryption.mask_email("john@example.com")  # "j***@example.com"

# Phone masking
masked_phone = encryption.mask_phone("+5511987654321")  # "+55 11 9****-4321"
```

## Rate Limiting

### Redis-Based Rate Limiter

```python
from athena_shared.security.rate_limiter import RateLimiter, RateLimitConfig

limiter = RateLimiter(
    redis_url=os.getenv("REDIS_URL"),
    prefix="athena:ratelimit"
)

# Configure rate limits
limiter.add_rule("pix_transfer", RateLimitConfig(
    requests_per_minute=10,
    requests_per_hour=100,
    burst_size=5
))

limiter.add_rule("login_attempt", RateLimitConfig(
    requests_per_minute=5,
    requests_per_hour=20,
    penalty_seconds=300  # 5 min cooldown after exceeded
))

# Check rate limit
@app.post("/pix/transfer")
async def send_transfer(request: TransferRequest, token: dict = Depends(verify_token)):
    allowed, remaining = await limiter.check_limit(
        rule_name="pix_transfer",
        identifier=token["sub"]
    )

    if not allowed:
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded",
            headers={"Retry-After": str(remaining)}
        )

    # Process transfer
    pass
```

### Rate Limit Tiers

```python
# Different limits based on customer tier
RATE_LIMIT_TIERS = {
    "basic": RateLimitConfig(requests_per_minute=10, requests_per_hour=100),
    "premium": RateLimitConfig(requests_per_minute=30, requests_per_hour=500),
    "enterprise": RateLimitConfig(requests_per_minute=100, requests_per_hour=2000)
}

async def get_rate_limit_config(user: User) -> RateLimitConfig:
    return RATE_LIMIT_TIERS.get(user.tier, RATE_LIMIT_TIERS["basic"])
```

## Security Middleware

### Request Correlation

```python
from athena_shared.security.middleware import CorrelationMiddleware

# Adds correlation ID to all requests for tracing
app.add_middleware(CorrelationMiddleware)

# Access correlation ID in handlers
@app.post("/pix/transfer")
async def send_transfer(request: Request):
    correlation_id = request.state.correlation_id
    logger.info(f"Processing transfer", extra={"correlation_id": correlation_id})
```

### Security Headers

```python
from athena_shared.security.middleware import SecurityMiddleware

app.add_middleware(
    SecurityMiddleware,
    content_security_policy="default-src 'self'",
    strict_transport_security="max-age=31536000; includeSubDomains",
    x_content_type_options="nosniff",
    x_frame_options="DENY",
    x_xss_protection="1; mode=block"
)
```

### Audit Logging

```python
from athena_shared.security.middleware import AuditMiddleware

app.add_middleware(
    AuditMiddleware,
    audit_service_url=os.getenv("AUDIT_SERVICE_URL"),
    excluded_paths=["/health", "/metrics"]
)

# Automatic audit log for all requests:
# - Request timestamp
# - User ID
# - IP address
# - Endpoint
# - Request body (sanitized)
# - Response status
# - Response time
```

## Input Validation

### Request Validation

```python
from pydantic import BaseModel, Field, validator
import re

class CreatePixKeyRequest(BaseModel):
    account_id: str = Field(..., min_length=36, max_length=36)
    key_type: str = Field(..., regex="^(CPF|CNPJ|EMAIL|PHONE|EVP)$")
    key_value: str = Field(..., max_length=77)

    @validator('key_value')
    def validate_key_value(cls, v, values):
        key_type = values.get('key_type')

        if key_type == 'CPF':
            if not re.match(r'^\d{11}$', v):
                raise ValueError('CPF must be 11 digits')
            if not cls._validate_cpf(v):
                raise ValueError('Invalid CPF')

        elif key_type == 'CNPJ':
            if not re.match(r'^\d{14}$', v):
                raise ValueError('CNPJ must be 14 digits')
            if not cls._validate_cnpj(v):
                raise ValueError('Invalid CNPJ')

        elif key_type == 'EMAIL':
            if not re.match(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$', v):
                raise ValueError('Invalid email format')

        elif key_type == 'PHONE':
            if not re.match(r'^\+55\d{10,11}$', v):
                raise ValueError('Phone must be +55 followed by 10-11 digits')

        return v

    @staticmethod
    def _validate_cpf(cpf: str) -> bool:
        """Validate CPF checksum"""
        if len(set(cpf)) == 1:
            return False

        def calc_digit(cpf, multipliers):
            total = sum(int(d) * m for d, m in zip(cpf, multipliers))
            remainder = total % 11
            return 0 if remainder < 2 else 11 - remainder

        d1 = calc_digit(cpf[:9], range(10, 1, -1))
        d2 = calc_digit(cpf[:10], range(11, 1, -1))

        return cpf[-2:] == f"{d1}{d2}"
```

### SQL Injection Prevention

```python
from sqlalchemy.orm import Session
from sqlalchemy import text

# NEVER do this:
# query = f"SELECT * FROM users WHERE email = '{email}'"

# Always use parameterized queries:
user = db.query(User).filter(User.email == email).first()

# Or with raw SQL:
result = db.execute(
    text("SELECT * FROM users WHERE email = :email"),
    {"email": email}
)
```

### XSS Prevention

```python
from markupsafe import escape

# Escape output in templates
user_name = escape(user_input)

# Use Pydantic for automatic escaping
class UserResponse(BaseModel):
    name: str
    email: str

    class Config:
        # Pydantic will validate and escape
        str_strip_whitespace = True
```

## Secrets Management

### Environment Variables

```bash
# Production environment variables
JWT_SECRET=<base64-encoded-secret>
ENCRYPTION_KEY=<base64-encoded-32-byte-key>
DATABASE_URL=postgresql://user:password@host:5432/db
REDIS_URL=redis://host:6379/0
```

### HashiCorp Vault Integration

```python
import hvac

class VaultClient:
    def __init__(self):
        self.client = hvac.Client(
            url=os.getenv("VAULT_ADDR"),
            token=os.getenv("VAULT_TOKEN")
        )

    def get_secret(self, path: str, key: str) -> str:
        response = self.client.secrets.kv.v2.read_secret_version(path=path)
        return response["data"]["data"][key]

# Usage
vault = VaultClient()
jwt_secret = vault.get_secret("athena/jwt", "secret_key")
```

## Compliance

### LGPD (Brazilian Data Protection)

```python
class DataSubjectRights:
    """LGPD data subject rights implementation"""

    async def export_data(self, customer_id: str) -> dict:
        """Right to access - export all customer data"""
        return await self._collect_customer_data(customer_id)

    async def delete_data(self, customer_id: str) -> None:
        """Right to deletion - anonymize customer data"""
        await self._anonymize_customer_data(customer_id)

    async def correct_data(self, customer_id: str, corrections: dict) -> None:
        """Right to rectification - update customer data"""
        await self._update_customer_data(customer_id, corrections)
```

### Audit Trail

```python
@dataclass
class AuditEvent:
    timestamp: datetime
    user_id: str
    action: str
    resource_type: str
    resource_id: str
    ip_address: str
    user_agent: str
    request_body: dict
    response_status: int
    correlation_id: str

class AuditService:
    async def log(self, event: AuditEvent) -> None:
        """Log audit event to immutable storage"""
        await self.repository.save(event)

    async def query(
        self,
        user_id: Optional[str] = None,
        action: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[AuditEvent]:
        """Query audit logs"""
        return await self.repository.query(
            user_id=user_id,
            action=action,
            start_date=start_date,
            end_date=end_date
        )
```

### COAF Reporting

```python
class CoafReporter:
    """COAF (Financial Activities Control Council) reporting"""

    REPORT_THRESHOLD = 50000.00  # R$ 50,000

    async def check_and_report(self, transaction: Transaction) -> None:
        """Check if transaction requires COAF reporting"""
        if transaction.amount >= self.REPORT_THRESHOLD:
            await self._create_coaf_report(transaction)

        # Check for suspicious patterns
        if await self._is_suspicious(transaction):
            await self._create_suspicious_activity_report(transaction)

    async def _is_suspicious(self, transaction: Transaction) -> bool:
        """Detect suspicious activity patterns"""
        patterns = [
            self._check_structuring(transaction),
            self._check_round_amounts(transaction),
            self._check_high_frequency(transaction),
            self._check_geographic_anomaly(transaction)
        ]
        return any(await asyncio.gather(*patterns))
```

## Security Checklist

### API Security
- [ ] All endpoints require authentication
- [ ] JWT tokens are properly validated
- [ ] Rate limiting is applied to all endpoints
- [ ] Input validation on all requests
- [ ] Output encoding to prevent XSS
- [ ] CORS properly configured

### Data Security
- [ ] PII encrypted at rest
- [ ] Card data tokenized (PCI DSS)
- [ ] Database connections encrypted (TLS)
- [ ] Secrets stored in vault, not code
- [ ] Data retention policies implemented

### Infrastructure Security
- [ ] TLS 1.3 for all connections
- [ ] mTLS for service-to-service
- [ ] Network segmentation
- [ ] Regular security patches
- [ ] Container security scanning

### Monitoring & Response
- [ ] Security event logging
- [ ] Intrusion detection
- [ ] Incident response plan
- [ ] Regular penetration testing
- [ ] Vulnerability scanning

## Security Incident Response

```python
class SecurityIncidentHandler:
    """Handle security incidents"""

    SEVERITY_LEVELS = {
        "CRITICAL": 1,
        "HIGH": 2,
        "MEDIUM": 3,
        "LOW": 4
    }

    async def handle_incident(self, incident: SecurityIncident) -> None:
        """Process security incident"""

        # 1. Log incident
        await self.audit_service.log_incident(incident)

        # 2. Notify security team
        await self.notify_security_team(incident)

        # 3. Take immediate action based on severity
        if incident.severity == "CRITICAL":
            await self._emergency_response(incident)

        # 4. Create incident ticket
        await self.ticket_service.create(incident)

    async def _emergency_response(self, incident: SecurityIncident) -> None:
        """Emergency response for critical incidents"""
        if incident.type == "ACCOUNT_BREACH":
            await self._lock_account(incident.account_id)
        elif incident.type == "API_ATTACK":
            await self._block_ip(incident.source_ip)
        elif incident.type == "DATA_LEAK":
            await self._revoke_all_tokens()
```

## References

- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [PCI DSS Requirements](https://www.pcisecuritystandards.org/)
- [LGPD (Lei Geral de Proteção de Dados)](http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [BACEN Circular 3.909](https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?tipo=Circular&numero=3909)
- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
