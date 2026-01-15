# Loans Service API

Base URL: `/api/loans`

## Endpoints

### Credit Score

#### Get Credit Score
```http
GET /credit/score/{customer_id}
```

**Response**
```json
{
  "customer_id": "uuid",
  "score": 750,
  "band": "A",
  "factors": {
    "payment_history": 0.85,
    "account_age": 0.70,
    "balance_stability": 0.80,
    "income_consistency": 0.75
  },
  "calculated_at": "2024-01-15T10:00:00Z"
}
```

**Score Bands:**
| Band | Score Range | Risk Level |
|------|-------------|------------|
| A | 800-1000 | Very Low |
| B | 600-799 | Low |
| C | 400-599 | Medium |
| D | 200-399 | High |
| E | 0-199 | Very High |

#### Get Credit Limit
```http
GET /credit/limit/{customer_id}
```

**Response**
```json
{
  "customer_id": "uuid",
  "total_limit": 50000.00,
  "available_limit": 35000.00,
  "used_limit": 15000.00,
  "products": {
    "PERSONAL": 30000.00,
    "PAYROLL": 20000.00
  }
}
```

### Loan Products

#### List Products
```http
GET /products
```

**Response**
```json
[
  {
    "code": "PERSONAL",
    "name": "Empréstimo Pessoal",
    "min_amount": 500.00,
    "max_amount": 50000.00,
    "min_installments": 3,
    "max_installments": 48,
    "interest_rate_range": {
      "min": 0.0199,
      "max": 0.0599
    }
  },
  {
    "code": "PAYROLL",
    "name": "Crédito Consignado",
    "min_amount": 1000.00,
    "max_amount": 100000.00,
    "min_installments": 6,
    "max_installments": 84,
    "interest_rate_range": {
      "min": 0.0149,
      "max": 0.0299
    }
  }
]
```

### Loan Simulation

#### Simulate Loan
```http
POST /loans/simulate
Content-Type: application/json

{
  "customer_id": "uuid",
  "product": "PERSONAL",
  "amount": 10000.00,
  "installments": 12
}
```

**Response**
```json
{
  "product": "PERSONAL",
  "principal": 10000.00,
  "installments": 12,
  "interest_rate": 0.0299,
  "installment_value": 975.50,
  "total_amount": 11706.00,
  "total_interest": 1706.00,
  "cet": 0.4125,
  "iof": 156.00,
  "first_due_date": "2024-02-15",
  "last_due_date": "2025-01-15"
}
```

### Loan Application

#### Apply for Loan
```http
POST /loans/apply
Content-Type: application/json

{
  "customer_id": "uuid",
  "account_id": "uuid",
  "product": "PERSONAL",
  "amount": 10000.00,
  "installments": 12
}
```

**Response** `201 Created`
```json
{
  "id": "uuid",
  "customer_id": "uuid",
  "product": "PERSONAL",
  "principal": 10000.00,
  "interest_rate": 0.0299,
  "installments": 12,
  "installment_value": 975.50,
  "total_amount": 11706.00,
  "status": "APPROVED",
  "disbursement_date": "2024-01-16",
  "created_at": "2024-01-15T10:00:00Z"
}
```

#### Get Loan
```http
GET /loans/{loan_id}
```

#### List Customer Loans
```http
GET /loans/customer/{customer_id}?status=ACTIVE
```

### Loan Installments

#### Get Installments
```http
GET /loans/{loan_id}/installments
```

**Response**
```json
[
  {
    "id": "uuid",
    "number": 1,
    "due_date": "2024-02-15",
    "principal": 780.00,
    "interest": 195.50,
    "total": 975.50,
    "status": "PAID",
    "paid_at": "2024-02-14T15:30:00Z"
  },
  {
    "id": "uuid",
    "number": 2,
    "due_date": "2024-03-15",
    "principal": 795.00,
    "interest": 180.50,
    "total": 975.50,
    "status": "PENDING"
  }
]
```

#### Pay Installment
```http
POST /loans/{loan_id}/installments/{installment_id}/pay
Content-Type: application/json

{
  "source_account_id": "uuid",
  "amount": 975.50
}
```

### Prepayment

#### Simulate Prepayment
```http
POST /loans/{loan_id}/prepay/simulate
Content-Type: application/json

{
  "amount": 5000.00,
  "reduce_installments": true
}
```

**Response**
```json
{
  "current_balance": 8500.00,
  "prepay_amount": 5000.00,
  "new_balance": 3500.00,
  "discount": 250.00,
  "options": [
    {
      "type": "REDUCE_INSTALLMENTS",
      "new_installments": 4,
      "installment_value": 975.50
    },
    {
      "type": "REDUCE_VALUE",
      "installments": 8,
      "new_installment_value": 487.75
    }
  ]
}
```

#### Execute Prepayment
```http
POST /loans/{loan_id}/prepay
Content-Type: application/json

{
  "source_account_id": "uuid",
  "amount": 5000.00,
  "reduce_installments": true
}
```

## Loan Status

| Status | Description |
|--------|-------------|
| PENDING | Application under analysis |
| APPROVED | Approved, awaiting disbursement |
| ACTIVE | Disbursed and active |
| PAID_OFF | Fully paid |
| DEFAULTED | In default |
| CANCELLED | Application cancelled |

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Invalid request data |
| 404 | Loan not found |
| 422 | Credit denied / Limit exceeded |
| 409 | Duplicate application |
