# Accounts Service API

Base URL: `/api/accounts`

## Endpoints

### Customers

#### Create Customer
```http
POST /customers
Content-Type: application/json

{
  "document_number": "12345678901",
  "document_type": "CPF",
  "name": "Nome Completo",
  "email": "email@example.com",
  "phone": "11999999999"
}
```

**Response** `201 Created`
```json
{
  "id": "uuid",
  "document_number": "12345678901",
  "document_type": "CPF",
  "name": "Nome Completo",
  "email": "email@example.com",
  "phone": "11999999999",
  "kyc_level": 0,
  "status": "PENDING",
  "created_at": "2024-01-15T10:00:00Z"
}
```

#### Get Customer
```http
GET /customers/{customer_id}
```

#### Get Customer by Document
```http
GET /customers/document/{document_number}
```

### Accounts

#### Create Account
```http
POST /accounts
Content-Type: application/json

{
  "customer_id": "uuid",
  "type": "CHECKING",
  "branch": "0001"
}
```

**Account Types:** `CHECKING`, `SAVINGS`, `PAYMENT`

#### Get Account
```http
GET /accounts/{account_id}
```

#### Get Account Balance
```http
GET /accounts/{account_id}/balance
```

**Response**
```json
{
  "balance": 10000.00,
  "available_balance": 9500.00,
  "blocked_balance": 500.00,
  "updated_at": "2024-01-15T10:00:00Z"
}
```

#### Get Account Transactions
```http
GET /accounts/{account_id}/transactions?limit=50&offset=0
```

### Internal Operations

#### Credit Account (Internal)
```http
POST /accounts/{account_id}/credit
Content-Type: application/json

{
  "amount": 100.00,
  "type": "PIX_RECEIVED",
  "description": "PIX recebido",
  "reference_id": "e2e-id"
}
```

#### Debit Account (Internal)
```http
POST /accounts/{account_id}/debit
Content-Type: application/json

{
  "amount": 50.00,
  "type": "PIX_SENT",
  "description": "PIX enviado",
  "reference_id": "e2e-id"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Invalid request data |
| 404 | Customer/Account not found |
| 409 | Document already registered |
| 422 | Business validation error |
| 500 | Internal server error |
