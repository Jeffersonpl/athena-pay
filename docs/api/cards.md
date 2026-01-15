# Cards Service API

Base URL: `/api/cards`

## Endpoints

### Card Management

#### Issue Card
```http
POST /cards
Content-Type: application/json

{
  "account_id": "uuid",
  "type": "CREDIT",
  "variant": "VIRTUAL",
  "credit_limit": 5000.00
}
```

**Card Types:** `DEBIT`, `CREDIT`, `MULTIPLE`
**Card Variants:** `PHYSICAL`, `VIRTUAL`

**Response** `201 Created`
```json
{
  "id": "uuid",
  "account_id": "uuid",
  "last_four": "1234",
  "brand": "MASTERCARD",
  "type": "CREDIT",
  "variant": "VIRTUAL",
  "status": "ACTIVE",
  "credit_limit": 5000.00,
  "available_limit": 5000.00,
  "expiry_month": 12,
  "expiry_year": 2028,
  "created_at": "2024-01-15T10:00:00Z"
}
```

#### Get Card
```http
GET /cards/{card_id}
```

#### List Account Cards
```http
GET /cards/account/{account_id}
```

#### Get Card Details (Sensitive)
```http
GET /cards/{card_id}/details
Authorization: Bearer {token}
```

**Response** (Encrypted/Tokenized)
```json
{
  "card_number": "5432********1234",
  "cvv": "***",
  "expiry": "12/28"
}
```

### Card Operations

#### Block Card
```http
POST /cards/{card_id}/block
Content-Type: application/json

{
  "reason": "LOST"
}
```

**Block Reasons:** `LOST`, `STOLEN`, `DAMAGED`, `CUSTOMER_REQUEST`

#### Unblock Card
```http
POST /cards/{card_id}/unblock
```

#### Update Limits
```http
PATCH /cards/{card_id}/limits
Content-Type: application/json

{
  "daily_limit": 2000.00,
  "transaction_limit": 1000.00,
  "international_enabled": false
}
```

### Transactions

#### Authorize Transaction
```http
POST /authorize
Content-Type: application/json

{
  "card_id": "uuid",
  "amount": 150.00,
  "currency": "BRL",
  "merchant_name": "Loja ABC",
  "merchant_category": "5411",
  "installments": 1
}
```

**Response**
```json
{
  "id": "uuid",
  "authorization_code": "123456",
  "status": "APPROVED",
  "amount": 150.00
}
```

#### Capture Transaction
```http
POST /capture/{authorization_id}
Content-Type: application/json

{
  "amount": 150.00
}
```

#### Reverse Transaction
```http
POST /reverse/{transaction_id}
Content-Type: application/json

{
  "amount": 150.00,
  "reason": "CUSTOMER_REQUEST"
}
```

### 3D Secure

#### Initialize 3DS
```http
POST /3ds/init
Content-Type: application/json

{
  "card_id": "uuid",
  "amount": 500.00,
  "merchant_name": "E-commerce",
  "return_url": "https://merchant.com/callback"
}
```

**Response**
```json
{
  "transaction_id": "uuid",
  "acs_url": "https://acs.bank.com/3ds",
  "pareq": "base64-encoded-data",
  "status": "CHALLENGE_REQUIRED"
}
```

#### Complete 3DS
```http
POST /3ds/complete
Content-Type: application/json

{
  "transaction_id": "uuid",
  "pares": "base64-response"
}
```

### Invoice (Credit Card)

#### Get Current Invoice
```http
GET /cards/{card_id}/invoice
```

**Response**
```json
{
  "id": "uuid",
  "card_id": "uuid",
  "due_date": "2024-02-10",
  "close_date": "2024-02-03",
  "total_amount": 1500.00,
  "minimum_payment": 150.00,
  "transactions": [...]
}
```

#### Pay Invoice
```http
POST /cards/{card_id}/invoice/pay
Content-Type: application/json

{
  "source_account_id": "uuid",
  "amount": 1500.00
}
```

### Card Transactions History
```http
GET /cards/{card_id}/transactions?limit=50&offset=0
```

## Transaction Status

| Status | Description |
|--------|-------------|
| PENDING | Awaiting authorization |
| AUTHORIZED | Authorized, not captured |
| CAPTURED | Captured/Completed |
| REVERSED | Reversed/Refunded |
| DECLINED | Declined |

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Invalid request |
| 403 | Card blocked |
| 404 | Card not found |
| 422 | Insufficient limit / Declined |
| 503 | Acquirer unavailable |
