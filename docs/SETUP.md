# Athena Pay - Setup Guide

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for frontend development)
- Python 3.12+ (for service development)

### Running with Docker

```bash
# Start all services
docker-compose up -d

# Start with monitoring (Prometheus + Grafana)
docker-compose --profile monitoring up -d

# Start with simulators (PIX simulator for testing)
docker-compose --profile dev up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| API Gateway | http://localhost | Nginx reverse proxy |
| Web Client | http://localhost:3000 | Customer web app |
| Admin Panel | http://localhost:3001 | Admin dashboard |
| Keycloak | http://localhost:8180 | Authentication |
| RabbitMQ | http://localhost:15672 | Message queue UI |
| Grafana | http://localhost:3030 | Monitoring dashboards |
| Prometheus | http://localhost:9090 | Metrics |

### API Service Ports

| Service | Port | Base Path |
|---------|------|-----------|
| Accounts | 8001 | /api/accounts |
| Audit | 8002 | /api/audit |
| Compliance | 8003 | /api/compliance |
| KYC | 8004 | /api/kyc |
| PIX | 8010 | /api/pix |
| Cards | 8011 | /api/cards |
| Boleto | 8012 | /api/boleto |
| Wire | 8013 | /api/wire |
| Loans | 8020 | /api/loans |
| AI | 8030 | /api/ai |

## Development Setup

### Backend Services

```bash
# Navigate to service directory
cd services/pix-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Run service
uvicorn app.main:app --reload --port 8010
```

### Frontend

```bash
# Web Client
cd apps/web-client
npm install
npm run dev

# Admin Panel
cd apps/admin-web
npm install
npm run dev
```

## Configuration

### Environment Variables

Create `.env` file in project root:

```env
# Database
DATABASE_URL=postgresql://athena:athena_secret_2024@localhost:5432/athena

# Redis
REDIS_URL=redis://localhost:6379

# RabbitMQ
RABBITMQ_URL=amqp://athena:athena_mq_2024@localhost:5672

# Keycloak
KEYCLOAK_URL=http://localhost:8180
KEYCLOAK_REALM=athena
KEYCLOAK_CLIENT_ID=athena-api

# AI Service
ATHENA_ENABLED=false
ATHENA_API_URL=http://localhost:8090

# Environment
ENV=dev
DEBUG=true
```

### Service Configuration

Each service can be configured via environment variables:

```env
# Common
ENV=dev|staging|production
LOG_LEVEL=DEBUG|INFO|WARNING|ERROR
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Service-specific
ACCOUNTS_SERVICE_URL=http://accounts-service:8080
COMPLIANCE_SERVICE_URL=http://compliance-service:8080
AUDIT_SERVICE_URL=http://audit-service:8080
```

## Database

### Initialization

The database is automatically initialized when starting PostgreSQL:

```bash
# Manual initialization
psql -h localhost -U athena -d athena -f infra/postgres/init.sql
```

### Schemas

- `accounts` - Customer and account data
- `pix` - PIX keys and transactions
- `cards` - Card data and transactions
- `boleto` - Boleto data
- `wire` - TED/DOC transfers
- `loans` - Loans and installments
- `compliance` - Alerts and screening
- `kyc` - Documents and validations
- `audit` - Audit events

### Migrations

```bash
# Using Alembic (when configured)
alembic upgrade head
alembic revision --autogenerate -m "description"
```

## Testing

### Unit Tests

```bash
# Run tests for a service
cd services/pix-service
pytest tests/ -v

# With coverage
pytest tests/ --cov=app --cov-report=html
```

### Integration Tests

```bash
# Start services first
docker-compose up -d

# Run integration tests
pytest tests/integration/ -v
```

### Load Testing

```bash
# Using k6
k6 run tests/load/pix_transfer.js
```

## Monitoring

### Prometheus Metrics

All services expose metrics at `/metrics`:

- `http_requests_total` - Total HTTP requests
- `http_request_duration_seconds` - Request duration
- `db_connections_active` - Active DB connections
- `transactions_total` - Total transactions by type

### Grafana Dashboards

Access Grafana at http://localhost:3030 (admin/admin):

- **Overview** - System health overview
- **Transactions** - Transaction metrics
- **Services** - Per-service metrics
- **Errors** - Error tracking

### Logging

All services log to stdout in JSON format:

```json
{
  "timestamp": "2024-01-15T10:00:00Z",
  "level": "INFO",
  "service": "pix-service",
  "message": "PIX transfer completed",
  "correlation_id": "abc123",
  "data": {...}
}
```

## Security

### Authentication

- JWT tokens via Keycloak
- Token validation in each service
- Refresh token rotation

### Authorization

- Role-based access control (RBAC)
- Resource-level permissions
- Service-to-service authentication (mTLS planned)

### Data Protection

- PII encryption at rest
- TLS for data in transit
- Tokenized card numbers
- Audit logging of all access

## Troubleshooting

### Common Issues

**Services not starting:**
```bash
# Check logs
docker-compose logs service-name

# Check health
curl http://localhost:8010/health
```

**Database connection issues:**
```bash
# Check PostgreSQL
docker-compose logs postgres

# Test connection
psql -h localhost -U athena -d athena -c "SELECT 1"
```

**Redis connection issues:**
```bash
# Check Redis
docker-compose logs redis

# Test connection
redis-cli -h localhost ping
```

### Health Checks

All services have health endpoints:

```bash
curl http://localhost:8010/health
```

Response:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "dependencies": {
    "database": "ok",
    "redis": "ok"
  }
}
```

## Deployment

### Production Checklist

- [ ] Update all secrets and passwords
- [ ] Enable TLS/HTTPS
- [ ] Configure proper resource limits
- [ ] Set up backup strategies
- [ ] Configure monitoring alerts
- [ ] Review security settings
- [ ] Test disaster recovery

### Kubernetes (Coming Soon)

```bash
kubectl apply -f k8s/
```
