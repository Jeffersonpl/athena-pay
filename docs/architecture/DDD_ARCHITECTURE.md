# Athena Pay - DDD Architecture Documentation

## Overview

Athena Pay follows Domain-Driven Design (DDD) principles to create a maintainable, scalable, and business-aligned architecture. This document describes the architectural patterns, layers, and conventions used across all microservices.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────────────┐
│                         API Layer (FastAPI)                         │
│  Endpoints, Request/Response DTOs, OpenAPI Documentation, Routing   │
├─────────────────────────────────────────────────────────────────────┤
│                       Application Layer                              │
│  Use Cases, Commands, Queries, DTOs, Application Services           │
├─────────────────────────────────────────────────────────────────────┤
│                         Domain Layer                                 │
│  Entities, Value Objects, Domain Events, Repositories, Aggregates   │
├─────────────────────────────────────────────────────────────────────┤
│                      Infrastructure Layer                            │
│  Database, External APIs, Message Queues, Security, Logging         │
└─────────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
services/
├── shared/                           # Shared library
│   └── athena_shared/
│       ├── security/                 # Security components
│       │   ├── jwt_handler.py        # JWT authentication
│       │   ├── encryption.py         # Data encryption
│       │   ├── rate_limiter.py       # Rate limiting
│       │   ├── middleware.py         # Security middleware
│       │   └── permissions.py        # Authorization
│       ├── domain/                   # Domain building blocks
│       │   ├── entities.py           # Base entities
│       │   ├── events.py             # Domain events
│       │   ├── repositories.py       # Repository patterns
│       │   ├── specifications.py     # Business rules
│       │   └── exceptions.py         # Domain exceptions
│       └── application/              # Application patterns
│           ├── use_case.py           # Use case base
│           ├── dto.py                # Data transfer objects
│           ├── commands.py           # CQRS commands
│           └── queries.py            # CQRS queries
│
├── pix-service/                      # PIX Microservice
│   └── app/
│       ├── api/                      # API Layer
│       │   ├── routes/               # Route handlers
│       │   └── schemas/              # OpenAPI schemas
│       ├── application/              # Application Layer
│       │   ├── use_cases/            # Business use cases
│       │   ├── commands/             # Command handlers
│       │   └── queries/              # Query handlers
│       ├── domain/                   # Domain Layer
│       │   ├── entities/             # Domain entities
│       │   ├── value_objects/        # Value objects
│       │   ├── events/               # Domain events
│       │   ├── repositories/         # Repository interfaces
│       │   └── services/             # Domain services
│       └── infrastructure/           # Infrastructure Layer
│           ├── persistence/          # Database implementations
│           ├── external/             # External service clients
│           └── messaging/            # Event publishing
│
├── accounts-service/                 # Similar structure
├── cards-service/
├── boleto-service/
├── wire-service/
├── loans-service/
├── kyc-service/
├── compliance-service/
├── audit-service/
└── ai-service/
```

## Domain Layer

### Entities

Entities have identity and lifecycle. They are mutable and track changes through domain events.

```python
from athena_shared.domain.entities import Entity, AggregateRoot

class PixKey(AggregateRoot):
    """PIX Key aggregate root"""

    def __init__(
        self,
        id: str,
        key_type: PixKeyType,
        key_value: str,
        account_id: str,
        owner_name: str
    ):
        super().__init__(id)
        self.key_type = key_type
        self.key_value = key_value
        self.account_id = account_id
        self.owner_name = owner_name
        self.status = PixKeyStatus.PENDING

    def activate(self) -> None:
        """Activate the PIX key"""
        if self.status != PixKeyStatus.PENDING:
            raise InvalidStateError("Only pending keys can be activated")
        self.status = PixKeyStatus.ACTIVE
        self.add_event(PixKeyActivatedEvent(key_id=self.id))
```

### Value Objects

Value objects are immutable and defined by their attributes, not identity.

```python
from athena_shared.domain.entities import ValueObject

@dataclass(frozen=True)
class Money(ValueObject):
    """Monetary value with currency"""
    amount: Decimal
    currency: str = "BRL"

    def __post_init__(self):
        if self.amount < 0:
            raise ValueError("Amount cannot be negative")

    def add(self, other: "Money") -> "Money":
        if self.currency != other.currency:
            raise ValueError("Cannot add different currencies")
        return Money(self.amount + other.amount, self.currency)

@dataclass(frozen=True)
class EndToEndId(ValueObject):
    """PIX End-to-End identifier"""
    value: str

    def __post_init__(self):
        if len(self.value) != 32:
            raise ValueError("E2E ID must be 32 characters")
        if not self.value.startswith("E"):
            raise ValueError("E2E ID must start with 'E'")
```

### Domain Events

Events capture business occurrences and enable loose coupling between aggregates.

```python
from athena_shared.domain.events import DomainEvent, EventBus

@dataclass
class PixTransactionCompletedEvent(DomainEvent):
    """Raised when a PIX transaction is completed"""
    e2e_id: str
    amount: float
    source_account_id: str
    target_key: str
    aggregate_type: str = field(default="PixTransaction", init=False)

# Publishing events
event_bus = EventBus.get_instance()
event_bus.publish(PixTransactionCompletedEvent(
    aggregate_id=transaction.id,
    e2e_id=transaction.e2e_id,
    amount=transaction.amount,
    source_account_id=transaction.source_account_id,
    target_key=transaction.target_key
))
```

### Repositories

Repositories provide persistence abstraction for aggregates.

```python
from athena_shared.domain.repositories import Repository

class PixKeyRepository(Repository[PixKey]):
    """Repository interface for PIX keys"""

    @abstractmethod
    async def find_by_key_value(self, key_value: str) -> Optional[PixKey]:
        """Find key by its value"""
        pass

    @abstractmethod
    async def find_by_account(self, account_id: str) -> List[PixKey]:
        """Find all keys for an account"""
        pass
```

### Specifications

Specifications encapsulate business rules for querying and validation.

```python
from athena_shared.domain.specifications import Specification

class ActivePixKeySpec(Specification[PixKey]):
    """Specification for active PIX keys"""

    def is_satisfied_by(self, entity: PixKey) -> bool:
        return entity.status == PixKeyStatus.ACTIVE

class DailyLimitSpec(Specification[Transaction]):
    """Check if transaction is within daily limit"""

    def __init__(self, limit: Decimal, today_total: Decimal):
        self.limit = limit
        self.today_total = today_total

    def is_satisfied_by(self, entity: Transaction) -> bool:
        return (self.today_total + entity.amount) <= self.limit

# Combining specifications
active_and_cpf = ActivePixKeySpec() & PixKeyTypeSpec(PixKeyType.CPF)
```

## Application Layer

### Use Cases

Use cases orchestrate domain logic and coordinate between aggregates.

```python
from athena_shared.application.use_case import UseCase

class SendPixTransferUseCase(UseCase[SendPixTransferInput, SendPixTransferOutput]):
    """Send a PIX transfer"""

    def __init__(
        self,
        pix_key_repo: PixKeyRepository,
        transaction_repo: PixTransactionRepository,
        compliance_service: ComplianceService,
        account_service: AccountService
    ):
        self.pix_key_repo = pix_key_repo
        self.transaction_repo = transaction_repo
        self.compliance_service = compliance_service
        self.account_service = account_service

    async def execute(self, input: SendPixTransferInput) -> SendPixTransferOutput:
        # 1. Resolve payee key
        payee_key = await self.pix_key_repo.find_by_key_value(input.payee_key)
        if not payee_key:
            raise PixKeyNotFoundError(input.payee_key)

        # 2. Check compliance
        compliance_result = await self.compliance_service.check_transaction(
            customer_id=input.customer_id,
            amount=input.amount
        )
        if not compliance_result.allowed:
            raise ComplianceRejectedError(compliance_result.reason)

        # 3. Create transaction
        transaction = PixTransaction.create(
            source_account_id=input.source_account_id,
            target_key=payee_key,
            amount=Money(input.amount),
            description=input.description
        )

        # 4. Debit source account
        await self.account_service.debit(
            account_id=input.source_account_id,
            amount=input.amount
        )

        # 5. Process settlement
        transaction.complete()
        await self.transaction_repo.save(transaction)

        return SendPixTransferOutput(
            transaction_id=transaction.id,
            e2e_id=transaction.e2e_id.value,
            status=transaction.status.value
        )
```

### CQRS - Commands and Queries

Commands modify state, queries retrieve data without side effects.

```python
from athena_shared.application.commands import Command, CommandHandler
from athena_shared.application.queries import Query, QueryHandler

# Command
@dataclass
class CreatePixKeyCommand(Command):
    account_id: str
    key_type: str
    key_value: str
    owner_name: str

class CreatePixKeyHandler(CommandHandler[CreatePixKeyCommand, str]):
    async def handle(self, command: CreatePixKeyCommand) -> str:
        # Create key logic
        return key_id

# Query
@dataclass
class GetPixKeysQuery(Query):
    account_id: str

class GetPixKeysHandler(QueryHandler[GetPixKeysQuery, List[PixKeyDTO]]):
    async def handle(self, query: GetPixKeysQuery) -> List[PixKeyDTO]:
        # Fetch keys logic
        return keys
```

## Infrastructure Layer

### Database Persistence

```python
from sqlalchemy.orm import Session
from app.domain.repositories import PixKeyRepository
from app.infrastructure.persistence.models import PixKeyModel

class SqlAlchemyPixKeyRepository(PixKeyRepository):
    """SQLAlchemy implementation of PIX key repository"""

    def __init__(self, session: Session):
        self.session = session

    async def find_by_id(self, id: str) -> Optional[PixKey]:
        model = self.session.query(PixKeyModel).filter_by(id=id).first()
        return self._to_domain(model) if model else None

    async def save(self, entity: PixKey) -> None:
        model = self._to_model(entity)
        self.session.merge(model)
        self.session.commit()

    def _to_domain(self, model: PixKeyModel) -> PixKey:
        return PixKey(
            id=model.id,
            key_type=PixKeyType(model.key_type),
            key_value=model.key_value,
            account_id=model.account_id,
            owner_name=model.owner_name
        )
```

### External Services

```python
import httpx
from app.domain.services import ComplianceService

class HttpComplianceService(ComplianceService):
    """HTTP client for compliance service"""

    def __init__(self, base_url: str):
        self.base_url = base_url

    async def check_transaction(
        self,
        customer_id: str,
        amount: float
    ) -> ComplianceResult:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/compliance/check",
                json={"customer_id": customer_id, "amount": amount}
            )
            data = response.json()
            return ComplianceResult(
                allowed=data["allowed"],
                risk_level=data["risk_level"],
                reason=data.get("reason")
            )
```

## API Layer

### OpenAPI Documentation

All endpoints are documented with OpenAPI/Swagger specifications.

```python
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, Field

class CreatePixKeyRequest(BaseModel):
    """Request schema for creating a PIX key"""
    account_id: str = Field(..., description="Account UUID")
    key_type: str = Field(..., description="Key type: CPF, CNPJ, EMAIL, PHONE, EVP")
    key_value: str = Field(..., description="Key value")

    class Config:
        json_schema_extra = {
            "example": {
                "account_id": "550e8400-e29b-41d4-a716-446655440000",
                "key_type": "CPF",
                "key_value": "12345678901"
            }
        }

@app.post(
    "/pix/keys",
    tags=["PIX Keys"],
    summary="Register PIX key",
    response_model=PixKeyResponse,
    responses={
        201: {"description": "Key created"},
        409: {"description": "Key already exists"}
    }
)
async def create_pix_key(request: CreatePixKeyRequest):
    """Register a new PIX key for an account."""
    pass
```

## Security Architecture

### JWT Authentication

```python
from athena_shared.security.jwt_handler import JWTHandler, JWTConfig

config = JWTConfig(
    secret_key=os.getenv("JWT_SECRET"),
    algorithm="RS256",
    access_token_expire_minutes=30
)
jwt_handler = JWTHandler(config)

# Create token
token = jwt_handler.create_access_token({
    "sub": user_id,
    "permissions": ["pix:read", "pix:write"]
})

# Verify token
payload = jwt_handler.verify_token(token)
```

### Role-Based Access Control

```python
from athena_shared.security.permissions import Permission, require_permission

class Permission(str, Enum):
    PIX_READ = "pix:read"
    PIX_WRITE = "pix:write"
    PIX_ADMIN = "pix:admin"
    ACCOUNTS_READ = "accounts:read"
    ACCOUNTS_WRITE = "accounts:write"

@app.post("/pix/transfer")
@require_permission(Permission.PIX_WRITE)
async def send_transfer(request: TransferRequest):
    pass
```

### Data Encryption

```python
from athena_shared.security.encryption import EncryptionService

encryption = EncryptionService(key=os.getenv("ENCRYPTION_KEY"))

# Encrypt sensitive data
encrypted_document = encryption.encrypt_pii(customer.document)

# Decrypt when needed
document = encryption.decrypt_pii(encrypted_document)

# Mask for display
masked = encryption.mask_document(document)  # "123.***.***-01"
```

### Rate Limiting

```python
from athena_shared.security.rate_limiter import RateLimiter, RateLimitConfig

limiter = RateLimiter(redis_url=os.getenv("REDIS_URL"))

# Configure rules
limiter.add_rule("pix_transfer", RateLimitConfig(
    requests_per_minute=10,
    requests_per_hour=100
))

# Check limit
allowed = await limiter.check("pix_transfer", account_id)
if not allowed:
    raise RateLimitExceeded()
```

## Event-Driven Architecture

### Event Flow

```
┌─────────────┐    Domain Event    ┌─────────────┐    Integration Event    ┌─────────────┐
│   Domain    │ ────────────────▶  │   Event     │ ─────────────────────▶  │   Message   │
│   Entity    │                    │   Handler   │                         │   Queue     │
└─────────────┘                    └─────────────┘                         └─────────────┘
                                                                                  │
                                                                                  ▼
                                   ┌─────────────┐                         ┌─────────────┐
                                   │   Other     │ ◀────────────────────── │  Consumer   │
                                   │   Service   │                         │   Handler   │
                                   └─────────────┘                         └─────────────┘
```

### Event Publishing

```python
from athena_shared.domain.events import EventBus, event_handler

# Define handler
@event_handler(PixTransactionCompletedEvent)
async def notify_customer(event: PixTransactionCompletedEvent):
    await notification_service.send_push(
        account_id=event.source_account_id,
        message=f"PIX de R${event.amount} enviado com sucesso"
    )

# Register handlers
event_bus = EventBus.get_instance()
event_bus.subscribe(PixTransactionCompletedEvent, notify_customer)

# Aggregate publishes events
transaction.complete()  # Adds PixTransactionCompletedEvent
event_bus.publish_all(transaction.domain_events)
```

## Testing Strategy

### Unit Tests

```python
import pytest
from app.domain.entities import PixKey, PixKeyType, PixKeyStatus

class TestPixKey:
    def test_activate_pending_key(self):
        key = PixKey(
            id="key-1",
            key_type=PixKeyType.CPF,
            key_value="12345678901",
            account_id="acc-1",
            owner_name="Test"
        )

        key.activate()

        assert key.status == PixKeyStatus.ACTIVE
        assert len(key.domain_events) == 1

    def test_activate_already_active_raises(self):
        key = PixKey(...)
        key.activate()

        with pytest.raises(InvalidStateError):
            key.activate()
```

### Integration Tests

```python
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

class TestPixTransfer:
    async def test_send_transfer_success(self, client):
        response = await client.post(
            "/pix/transfer",
            json={
                "account_id": "acc-1",
                "payee_key": "12345678901",
                "amount": 100.00
            },
            headers={"Authorization": "Bearer test-token"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "SETTLED"
        assert "e2e_id" in data
```

## Microservices Communication

### Synchronous (HTTP)

```python
# Service-to-service calls with circuit breaker
from athena_shared.infrastructure.http_client import ServiceClient

accounts_client = ServiceClient(
    base_url="http://accounts-service:8080",
    timeout=10.0,
    retry_count=3
)

account = await accounts_client.get(f"/accounts/{account_id}")
```

### Asynchronous (Message Queue)

```python
# Publishing to message queue
from athena_shared.infrastructure.messaging import MessagePublisher

publisher = MessagePublisher(
    connection_url=os.getenv("RABBITMQ_URL")
)

await publisher.publish(
    exchange="transactions",
    routing_key="pix.completed",
    message={
        "event": "PIX_COMPLETED",
        "e2e_id": transaction.e2e_id,
        "amount": transaction.amount
    }
)
```

## Deployment Architecture

```
                                    ┌─────────────────┐
                                    │   API Gateway   │
                                    │    (Kong/AWS)   │
                                    └────────┬────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
            ┌───────▼───────┐        ┌───────▼───────┐        ┌───────▼───────┐
            │ PIX Service   │        │ Accounts Svc  │        │ Cards Service │
            │   (3 pods)    │        │   (3 pods)    │        │   (2 pods)    │
            └───────┬───────┘        └───────┬───────┘        └───────┬───────┘
                    │                        │                        │
            ┌───────▼───────┐        ┌───────▼───────┐        ┌───────▼───────┐
            │  PostgreSQL   │        │  PostgreSQL   │        │  PostgreSQL   │
            │   (Primary)   │        │   (Primary)   │        │   (Primary)   │
            └───────────────┘        └───────────────┘        └───────────────┘
                    │
                    │         ┌─────────────────┐
                    └─────────│     Redis       │
                              │  (Rate Limit)   │
                              └─────────────────┘
```

## Best Practices

1. **Aggregate Design**
   - Keep aggregates small and focused
   - Only modify one aggregate per transaction
   - Use eventual consistency between aggregates

2. **Event Sourcing Readiness**
   - All state changes through domain events
   - Events are immutable
   - Support event replay for debugging

3. **API Design**
   - Follow RESTful conventions
   - Version APIs when breaking changes needed
   - Document all endpoints with OpenAPI

4. **Security**
   - Never store secrets in code
   - Encrypt PII at rest
   - Audit all sensitive operations
   - Implement rate limiting

5. **Testing**
   - Unit test domain logic
   - Integration test use cases
   - E2E test critical flows
   - Maintain 80%+ coverage

## References

- [Domain-Driven Design by Eric Evans](https://www.domainlanguage.com/ddd/)
- [Implementing Domain-Driven Design by Vaughn Vernon](https://www.informit.com/store/implementing-domain-driven-design-9780321834577)
- [Clean Architecture by Robert Martin](https://www.oreilly.com/library/view/clean-architecture-a/9780134494272/)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
