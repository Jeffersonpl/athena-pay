# Audit Service API

Base URL: `/api/audit`

## Endpoints

### Event Logging

#### Log Event
```http
POST /events
Content-Type: application/json

{
  "event_type": "TRANSACTION",
  "service": "pix-service",
  "action": "PIX_TRANSFER",
  "actor_id": "uuid",
  "actor_type": "CUSTOMER",
  "resource_type": "TRANSACTION",
  "resource_id": "tx-uuid",
  "correlation_id": "corr-123",
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "metadata": {
    "amount": 100.00,
    "target_key": "12345678901"
  }
}
```

**Event Types:**
- `TRANSACTION` - Financial transactions
- `SECURITY` - Security events (login, logout, failed attempts)
- `API_CALL` - API calls
- `DATA_ACCESS` - Data access events
- `ADMIN` - Administrative actions
- `COMPLIANCE` - Compliance-related events

**Actor Types:**
- `CUSTOMER` - End user
- `ADMIN` - Administrator
- `SYSTEM` - Automated system
- `SERVICE` - Another service
- `ANONYMOUS` - Unknown actor

**Response** `201 Created`
```json
{
  "id": "uuid",
  "event_type": "TRANSACTION",
  "service": "pix-service",
  "action": "PIX_TRANSFER",
  "created_at": "2024-01-15T10:00:00Z"
}
```

### Event Queries

#### Get Events
```http
GET /events?limit=100&offset=0
```

**Query Parameters:**
- `event_type` - Filter by event type
- `service` - Filter by service name
- `actor_id` - Filter by actor
- `resource_type` - Filter by resource type
- `resource_id` - Filter by resource ID
- `start_date` - Filter from date
- `end_date` - Filter to date
- `limit` - Results limit (default: 100)
- `offset` - Results offset

#### Get Events by Actor
```http
GET /events/actor/{actor_id}
```

#### Get Events by Resource
```http
GET /events/resource/{resource_type}/{resource_id}
```

#### Get Events by Correlation ID
```http
GET /events/correlation/{correlation_id}
```

### Security Events

#### Log Security Event
```http
POST /events/security
Content-Type: application/json

{
  "action": "LOGIN_FAILED",
  "actor_type": "ANONYMOUS",
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "metadata": {
    "email": "user@example.com",
    "reason": "INVALID_PASSWORD",
    "attempts": 3
  }
}
```

**Security Actions:**
- `LOGIN_SUCCESS`
- `LOGIN_FAILED`
- `LOGOUT`
- `PASSWORD_CHANGED`
- `PASSWORD_RESET`
- `MFA_ENABLED`
- `MFA_DISABLED`
- `ACCOUNT_LOCKED`
- `SUSPICIOUS_LOGIN`

### Reports

#### Generate Compliance Report
```http
GET /reports/compliance?start_date=2024-01-01&end_date=2024-01-31&report_type=COAF
```

**Report Types:**
- `COAF` - COAF suspicious activities
- `BACEN` - Central Bank report
- `INTERNAL` - Internal audit report

#### Get Transaction Summary
```http
GET /reports/transactions?month=2024-01
```

**Response**
```json
{
  "period": "2024-01",
  "summary": {
    "total_transactions": 15420,
    "by_type": {
      "PIX": 10250,
      "TED": 2100,
      "CARD": 2500,
      "BOLETO": 570
    },
    "total_volume": {
      "PIX": 5250000.00,
      "TED": 8500000.00,
      "CARD": 750000.00,
      "BOLETO": 450000.00
    }
  }
}
```

### Event Retention

Events are retained according to regulatory requirements:
- Financial transactions: 10 years
- Security events: 5 years
- API calls: 1 year

### Event Export

#### Export Events
```http
POST /export
Content-Type: application/json

{
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "format": "CSV",
  "filters": {
    "event_type": "TRANSACTION"
  }
}
```

**Formats:** `CSV`, `JSON`, `PARQUET`

## Event Schema

```json
{
  "id": "uuid",
  "event_type": "string",
  "service": "string",
  "action": "string",
  "actor_id": "string",
  "actor_type": "string",
  "resource_type": "string",
  "resource_id": "string",
  "correlation_id": "string",
  "ip_address": "string",
  "user_agent": "string",
  "metadata": {},
  "created_at": "timestamp"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Invalid request |
| 404 | Event not found |
| 422 | Validation error |
