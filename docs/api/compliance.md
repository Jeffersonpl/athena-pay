# Compliance Service API

Base URL: `/api/compliance`

## Endpoints

### Customer Screening

#### Screen Customer
```http
POST /screening/customer
Content-Type: application/json

{
  "customer_id": "uuid",
  "name": "Nome Completo",
  "document": "12345678901",
  "document_type": "CPF",
  "birth_date": "1990-01-15"
}
```

**Response**
```json
{
  "id": "uuid",
  "customer_id": "uuid",
  "result": "CLEAR",
  "checks": {
    "pep": false,
    "ofac": false,
    "coaf": false,
    "internal_blacklist": false
  },
  "matches": [],
  "screened_at": "2024-01-15T10:00:00Z"
}
```

**Screening Results:**
- `CLEAR` - No matches found
- `MATCH` - Matches found, requires review
- `PENDING` - Manual review required

### Transaction Validation

#### Validate Transaction
```http
POST /validate/transaction
Content-Type: application/json

{
  "customer_id": "uuid",
  "transaction_type": "PIX",
  "amount": 5000.00,
  "target_document": "98765432109",
  "target_name": "Destinatário"
}
```

**Response**
```json
{
  "approved": true,
  "checks": {
    "within_limits": true,
    "target_not_blocked": true,
    "pattern_normal": true,
    "kyc_sufficient": true
  },
  "alerts": [],
  "decision": "APPROVED"
}
```

#### Check Limits
```http
POST /check/limits
Content-Type: application/json

{
  "customer_id": "uuid",
  "kyc_level": 2,
  "transaction_type": "PIX",
  "amount": 10000.00
}
```

**Response**
```json
{
  "within_limits": true,
  "limits": {
    "daily": {
      "limit": 50000.00,
      "used": 15000.00,
      "remaining": 35000.00
    },
    "monthly": {
      "limit": 500000.00,
      "used": 100000.00,
      "remaining": 400000.00
    },
    "transaction": {
      "limit": 100000.00
    }
  }
}
```

### Limits Management

#### Get Customer Limits
```http
GET /limits/{customer_id}
```

**Response**
```json
{
  "customer_id": "uuid",
  "kyc_level": 2,
  "limits": {
    "PIX": {
      "daily": 50000.00,
      "monthly": 500000.00,
      "per_transaction": 100000.00
    },
    "TED": {
      "daily": 100000.00,
      "monthly": 1000000.00,
      "per_transaction": 500000.00
    },
    "CARD": {
      "daily": 10000.00,
      "monthly": 100000.00,
      "per_transaction": 5000.00
    }
  }
}
```

#### Update Customer Limits
```http
PUT /limits/{customer_id}
Content-Type: application/json

{
  "PIX": {
    "daily": 75000.00
  }
}
```

### Alerts

#### Create Alert
```http
POST /alerts
Content-Type: application/json

{
  "customer_id": "uuid",
  "transaction_id": "uuid",
  "alert_type": "UNUSUAL_ACTIVITY",
  "severity": "HIGH",
  "description": "Transaction pattern deviation detected"
}
```

**Alert Types:**
- `UNUSUAL_ACTIVITY` - Unusual transaction pattern
- `HIGH_VALUE` - High value transaction
- `SUSPICIOUS` - Suspicious activity
- `BLOCKED_PARTY` - Transaction with blocked party
- `VELOCITY` - High velocity transactions

**Severity Levels:** `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`

#### List Alerts
```http
GET /alerts?status=OPEN&severity=HIGH
```

#### Get Alert
```http
GET /alerts/{alert_id}
```

#### Resolve Alert
```http
POST /alerts/{alert_id}/resolve
Content-Type: application/json

{
  "resolution": "FALSE_POSITIVE",
  "notes": "Verified with customer, legitimate transaction"
}
```

**Resolutions:**
- `FALSE_POSITIVE` - Not actually suspicious
- `LEGITIMATE` - Verified as legitimate
- `SUSPICIOUS_CONFIRMED` - Confirmed suspicious
- `REPORTED` - Reported to authorities

### Rules

#### Get Rules
```http
GET /rules
```

**Response**
```json
[
  {
    "id": "rule-001",
    "name": "High Value PIX",
    "description": "Alert on PIX > R$ 50.000",
    "type": "THRESHOLD",
    "conditions": {
      "transaction_type": "PIX",
      "amount_gt": 50000.00
    },
    "action": "CREATE_ALERT",
    "severity": "HIGH",
    "enabled": true
  }
]
```

### Reports

#### Generate COAF Report
```http
POST /reports/coaf
Content-Type: application/json

{
  "start_date": "2024-01-01",
  "end_date": "2024-01-31"
}
```

#### Get Suspicious Activities Report
```http
GET /reports/suspicious?month=2024-01
```

## KYC Limits by Level

| Level | Daily PIX | Monthly PIX | Description |
|-------|-----------|-------------|-------------|
| 0 | R$ 500 | R$ 2.000 | Unverified |
| 1 | R$ 5.000 | R$ 20.000 | Basic (CPF verified) |
| 2 | R$ 50.000 | R$ 500.000 | Standard (documents + selfie) |
| 3 | R$ 500.000 | R$ 5.000.000 | Premium (full verification) |

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Invalid request |
| 403 | Transaction blocked |
| 404 | Not found |
| 422 | Validation failed |
