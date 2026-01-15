# PIX Service API

Base URL: `/api/pix`

## Endpoints

### PIX Keys

#### Register Key
```http
POST /keys
Content-Type: application/json

{
  "account_id": "uuid",
  "key_type": "CPF",
  "key_value": "12345678901"
}
```

**Key Types:** `CPF`, `CNPJ`, `EMAIL`, `PHONE`, `RANDOM`

**Response** `201 Created`
```json
{
  "id": "uuid",
  "account_id": "uuid",
  "key_type": "CPF",
  "key_value": "12345678901",
  "status": "ACTIVE",
  "created_at": "2024-01-15T10:00:00Z"
}
```

#### Get Key
```http
GET /keys/{key_value}
```

#### List Account Keys
```http
GET /keys/account/{account_id}
```

#### Delete Key
```http
DELETE /keys/{key_id}
```

### PIX Transfers

#### Send PIX
```http
POST /transfer
Content-Type: application/json

{
  "source_account_id": "uuid",
  "target_key": "98765432109",
  "amount": 100.00,
  "description": "Pagamento"
}
```

**Response** `201 Created`
```json
{
  "id": "uuid",
  "e2e_id": "E12345678901234567890123456789012",
  "source_account_id": "uuid",
  "target_key": "98765432109",
  "amount": 100.00,
  "status": "COMPLETED",
  "created_at": "2024-01-15T10:00:00Z",
  "processed_at": "2024-01-15T10:00:01Z"
}
```

#### Get Transaction
```http
GET /transactions/{transaction_id}
```

#### Get Transaction by E2E ID
```http
GET /transactions/e2e/{e2e_id}
```

### QR Codes

#### Generate Static QR Code
```http
POST /qrcode/static
Content-Type: application/json

{
  "key_value": "12345678901",
  "amount": 100.00,
  "description": "Pagamento"
}
```

**Response**
```json
{
  "payload": "00020126...",
  "qr_code_base64": "iVBORw0KGgo...",
  "expiration": null
}
```

#### Generate Dynamic QR Code
```http
POST /qrcode/dynamic
Content-Type: application/json

{
  "account_id": "uuid",
  "amount": 250.00,
  "expiration_seconds": 3600,
  "description": "Cobrança #123"
}
```

**Response**
```json
{
  "id": "uuid",
  "payload": "00020126...",
  "qr_code_base64": "iVBORw0KGgo...",
  "expiration": "2024-01-15T11:00:00Z",
  "location": "qrcode.athena.com/v1/abc123"
}
```

### DICT (Directory)

#### Resolve Key
```http
GET /resolve/{key_value}
```

**Response**
```json
{
  "key_type": "CPF",
  "key_value": "98765432109",
  "account": {
    "ispb": "12345678",
    "branch": "0001",
    "account_number": "123456",
    "account_type": "CHECKING"
  },
  "owner": {
    "name": "Nome do Titular",
    "document_type": "CPF"
  }
}
```

### Devolutions

#### Request Devolution
```http
POST /devolution
Content-Type: application/json

{
  "original_e2e_id": "E12345678901234567890123456789012",
  "amount": 100.00,
  "reason": "FRAUD"
}
```

**Devolution Reasons:** `FRAUD`, `OPERATIONAL_FLAW`, `CUSTOMER_REQUEST`

## Webhooks

### Incoming PIX Notification
```http
POST /webhook/incoming
Content-Type: application/json

{
  "e2e_id": "E12345678901234567890123456789012",
  "amount": 100.00,
  "payer": {
    "name": "Pagador",
    "document": "12345678901"
  },
  "target_key": "98765432109",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

## Status Codes

| Status | Description |
|--------|-------------|
| PENDING | Transaction created, awaiting processing |
| PROCESSING | Being processed by SPI |
| COMPLETED | Successfully completed |
| FAILED | Transaction failed |
| RETURNED | Returned/Devolved |

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Invalid request |
| 404 | Key/Transaction not found |
| 409 | Key already registered |
| 422 | Insufficient balance / Limit exceeded |
| 503 | SPI unavailable |
