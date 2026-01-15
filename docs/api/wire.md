# Wire Service API (TED/DOC)

Base URL: `/api/wire`

## Endpoints

### Transfers

#### Create Transfer
```http
POST /transfers
Content-Type: application/json

{
  "source_account_id": "uuid",
  "type": "TED",
  "target_bank": "001",
  "target_branch": "0001",
  "target_account": "123456",
  "target_document": "98765432109",
  "target_name": "Nome do Destinatário",
  "amount": 1000.00,
  "purpose": "PAYMENT"
}
```

**Transfer Types:**
- `TED` - Real-time, no limit, available until 17h
- `DOC` - Next business day, limit R$ 4,999.99

**Response** `201 Created`
```json
{
  "id": "uuid",
  "type": "TED",
  "amount": 1000.00,
  "status": "PROCESSING",
  "str_protocol": "STR123456",
  "created_at": "2024-01-15T10:00:00Z",
  "estimated_completion": "2024-01-15T10:05:00Z"
}
```

#### Get Transfer
```http
GET /transfers/{transfer_id}
```

#### List Account Transfers
```http
GET /transfers/account/{account_id}?type=TED&status=COMPLETED
```

### Bank Information

#### List Banks
```http
GET /banks
```

**Response**
```json
[
  {
    "code": "001",
    "ispb": "00000000",
    "name": "Banco do Brasil",
    "short_name": "BB"
  },
  {
    "code": "237",
    "ispb": "60746948",
    "name": "Bradesco",
    "short_name": "BRADESCO"
  }
]
```

#### Get Bank by Code
```http
GET /banks/{bank_code}
```

### Account Validation

#### Validate Target Account
```http
POST /validate-account
Content-Type: application/json

{
  "bank_code": "001",
  "branch": "0001",
  "account": "123456",
  "document": "12345678901"
}
```

**Response**
```json
{
  "valid": true,
  "account_type": "CHECKING",
  "holder_name": "Nome do Titular",
  "document_match": true
}
```

### Transfer Purposes

#### List Transfer Purposes
```http
GET /purposes
```

**Response**
```json
[
  {"code": "01", "description": "Crédito em Conta Corrente"},
  {"code": "02", "description": "Pagamento de Títulos"},
  {"code": "03", "description": "Pagamento de Impostos"},
  {"code": "10", "description": "Transferência para Mesma Titularidade"}
]
```

## Transfer Rules

### TED
- **Operating Hours:** 06:30 - 17:00 (business days)
- **Settlement:** Real-time (D+0)
- **Minimum:** No minimum
- **Maximum:** Account limit

### DOC
- **Operating Hours:** Until 21:59 (business days)
- **Settlement:** Next business day (D+1)
- **Minimum:** No minimum
- **Maximum:** R$ 4,999.99

### Cutoff Times
```json
{
  "TED": {
    "same_day_cutoff": "17:00",
    "timezone": "America/Sao_Paulo"
  },
  "DOC": {
    "submission_cutoff": "21:59",
    "processing_next_day": true
  }
}
```

## Transfer Status

| Status | Description |
|--------|-------------|
| PENDING | Created, awaiting processing |
| PROCESSING | Sent to STR/COMPE |
| COMPLETED | Successfully completed |
| FAILED | Transfer failed |
| RETURNED | Returned by destination bank |
| SCHEDULED | Scheduled for future date |

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Invalid request data |
| 404 | Transfer not found |
| 422 | Insufficient balance / Invalid account |
| 503 | STR/COMPE unavailable |

## Webhooks

### Transfer Status Update
```http
POST /webhook/status
Content-Type: application/json

{
  "transfer_id": "uuid",
  "status": "COMPLETED",
  "str_protocol": "STR123456",
  "completed_at": "2024-01-15T10:05:00Z"
}
```
