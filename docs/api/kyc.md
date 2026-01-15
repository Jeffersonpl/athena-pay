# KYC Service API

Base URL: `/api/kyc`

## Endpoints

### KYC Status

#### Get KYC Status
```http
GET /kyc/status/{customer_id}
```

**Response**
```json
{
  "customer_id": "uuid",
  "level": 2,
  "status": "VERIFIED",
  "documents": {
    "cpf": "VERIFIED",
    "rg": "VERIFIED",
    "selfie": "VERIFIED",
    "proof_of_address": "PENDING"
  },
  "face_validation": {
    "status": "PASSED",
    "similarity_score": 0.95,
    "liveness_score": 0.98
  },
  "last_verification": "2024-01-15T10:00:00Z"
}
```

### KYC Levels

| Level | Requirements | Limits |
|-------|-------------|--------|
| 0 | None | Very limited |
| 1 | CPF verification | Basic limits |
| 2 | Document + Selfie | Standard limits |
| 3 | Full verification + Proof of income | Premium limits |

#### Get Requirements
```http
GET /requirements
```

**Response**
```json
{
  "levels": {
    "1": {
      "required": ["cpf_verification"],
      "optional": []
    },
    "2": {
      "required": ["document_front", "document_back", "selfie"],
      "optional": ["proof_of_address"]
    },
    "3": {
      "required": ["proof_of_income", "bank_statements"],
      "optional": ["tax_return"]
    }
  }
}
```

### Document Submission

#### Submit Document
```http
POST /documents
Content-Type: application/json

{
  "customer_id": "uuid",
  "document_type": "RG",
  "document_front": "base64-encoded-image",
  "document_back": "base64-encoded-image"
}
```

**Document Types:**
- `RG` - Carteira de Identidade
- `CNH` - Carteira Nacional de Habilitação
- `PASSPORT` - Passaporte
- `PROOF_OF_ADDRESS` - Comprovante de Endereço
- `PROOF_OF_INCOME` - Comprovante de Renda

**Response** `201 Created`
```json
{
  "id": "uuid",
  "customer_id": "uuid",
  "document_type": "RG",
  "status": "PENDING",
  "created_at": "2024-01-15T10:00:00Z"
}
```

#### Get Documents
```http
GET /documents/{customer_id}
```

#### Get Document Status
```http
GET /documents/{customer_id}/{document_type}
```

### Selfie / Face Validation

#### Submit Selfie
```http
POST /selfie
Content-Type: application/json

{
  "customer_id": "uuid",
  "selfie": "base64-encoded-image",
  "liveness_data": {
    "challenge_response": "...",
    "device_info": "..."
  }
}
```

#### Validate Face
```http
POST /validate/face/{customer_id}
```

**Response**
```json
{
  "result": "MATCH",
  "similarity_score": 0.95,
  "liveness_score": 0.98,
  "document_id": "uuid",
  "validated_at": "2024-01-15T10:00:00Z"
}
```

**Face Validation Results:**
- `MATCH` - Face matches document (> 0.85 similarity)
- `NO_MATCH` - Face doesn't match
- `LOW_QUALITY` - Image quality insufficient
- `LIVENESS_FAILED` - Liveness check failed

### Document Validation (OCR)

#### Validate Document
```http
POST /validate/document/{customer_id}
```

**Response**
```json
{
  "document_id": "uuid",
  "document_type": "RG",
  "result": "VALID",
  "extracted_data": {
    "name": "Nome Completo",
    "document_number": "12345678",
    "birth_date": "1990-01-15",
    "issuing_authority": "SSP/SP",
    "issue_date": "2015-05-20"
  },
  "validation": {
    "data_match": true,
    "document_authentic": true,
    "not_expired": true
  }
}
```

### KYC Upgrade

#### Request Upgrade
```http
POST /kyc/upgrade
Content-Type: application/json

{
  "customer_id": "uuid",
  "target_level": 2
}
```

**Response**
```json
{
  "customer_id": "uuid",
  "current_level": 1,
  "target_level": 2,
  "status": "IN_PROGRESS",
  "missing_requirements": ["selfie"],
  "submitted": ["document_front", "document_back"]
}
```

### Validation History

#### Get History
```http
GET /validations/{customer_id}
```

**Response**
```json
[
  {
    "id": "uuid",
    "type": "DOCUMENT_VALIDATION",
    "document_type": "RG",
    "result": "VALID",
    "validated_at": "2024-01-15T10:00:00Z"
  },
  {
    "id": "uuid",
    "type": "FACE_VALIDATION",
    "result": "MATCH",
    "similarity_score": 0.95,
    "validated_at": "2024-01-15T10:05:00Z"
  }
]
```

### Manual Review

#### Get Pending Reviews
```http
GET /reviews/pending
```

#### Submit Review
```http
POST /reviews/{review_id}
Content-Type: application/json

{
  "decision": "APPROVED",
  "notes": "Document verified manually"
}
```

## Document Status

| Status | Description |
|--------|-------------|
| PENDING | Submitted, awaiting validation |
| PROCESSING | Being validated |
| VERIFIED | Successfully verified |
| REJECTED | Rejected (invalid/fake) |
| EXPIRED | Document expired |

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Invalid image/data |
| 404 | Customer not found |
| 409 | Document already submitted |
| 422 | Validation failed |
| 503 | Validation service unavailable |
