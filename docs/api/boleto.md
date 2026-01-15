# Boleto Service API

Base URL: `/api/boleto`

## Endpoints

### Boleto Generation

#### Generate Boleto
```http
POST /boletos
Content-Type: application/json

{
  "account_id": "uuid",
  "amount": 150.00,
  "due_date": "2024-02-15",
  "beneficiary_name": "Empresa XYZ",
  "beneficiary_document": "12345678901234",
  "payer_name": "Cliente ABC",
  "payer_document": "98765432109",
  "description": "Fatura #123"
}
```

**Response** `201 Created`
```json
{
  "id": "uuid",
  "barcode": "23793.38128 60000.000003 00000.000402 1 91540000015000",
  "digitable_line": "23793381286000000000300000004021915400000150.00",
  "amount": 150.00,
  "due_date": "2024-02-15",
  "beneficiary_name": "Empresa XYZ",
  "status": "PENDING",
  "created_at": "2024-01-15T10:00:00Z"
}
```

### Boleto Queries

#### Get Boleto
```http
GET /boletos/{boleto_id}
```

#### Get Boleto by Barcode
```http
GET /boletos/barcode/{barcode}
```

#### List Account Boletos
```http
GET /boletos/account/{account_id}?status=PENDING
```

### Boleto Payment

#### Pay Boleto
```http
POST /boletos/{boleto_id}/pay
Content-Type: application/json

{
  "payer_account_id": "uuid",
  "amount": 150.00
}
```

**Response**
```json
{
  "id": "uuid",
  "boleto_id": "uuid",
  "amount_paid": 150.00,
  "status": "PAID",
  "paid_at": "2024-01-15T10:00:00Z"
}
```

#### Validate Boleto (Before Payment)
```http
POST /boletos/validate
Content-Type: application/json

{
  "barcode": "23793381286000000000300000004021915400000150.00"
}
```

**Response**
```json
{
  "valid": true,
  "barcode": "...",
  "amount": 150.00,
  "due_date": "2024-02-15",
  "beneficiary": "Empresa XYZ",
  "bank_code": "237",
  "can_pay": true,
  "fees": {
    "late_fee": 0,
    "interest": 0
  }
}
```

### PDF Generation

#### Get Boleto PDF
```http
GET /boletos/{boleto_id}/pdf
Accept: application/pdf
```

Returns PDF binary or redirect to storage URL.

### CNAB Processing

#### Generate Remittance File
```http
POST /cnab/remittance
Content-Type: application/json

{
  "boleto_ids": ["uuid1", "uuid2"],
  "format": "CNAB240"
}
```

**Formats:** `CNAB240`, `CNAB400`

**Response**
```json
{
  "file_id": "uuid",
  "filename": "REMESSA_20240115.REM",
  "download_url": "https://storage.athena.com/cnab/...",
  "boletos_count": 2
}
```

#### Process Return File
```http
POST /cnab/return
Content-Type: multipart/form-data

file: [CNAB file]
```

**Response**
```json
{
  "processed": 50,
  "paid": 45,
  "rejected": 3,
  "errors": 2,
  "details": [...]
}
```

## Boleto Status

| Status | Description |
|--------|-------------|
| PENDING | Generated, awaiting payment |
| PAID | Paid |
| OVERDUE | Past due date |
| CANCELLED | Cancelled |
| EXPIRED | Expired (past validity) |

## Interest & Fees Calculation

Boletos support automatic calculation of:
- **Late Fee (Multa):** Percentage applied after due date
- **Daily Interest (Juros):** Daily interest rate
- **Discount:** Early payment discount

```json
{
  "fine_percentage": 2.0,
  "daily_interest_rate": 0.033,
  "discount": {
    "type": "FIXED",
    "amount": 10.00,
    "deadline": "2024-02-10"
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Invalid barcode/data |
| 404 | Boleto not found |
| 409 | Boleto already paid |
| 422 | Cannot pay (expired, cancelled) |
