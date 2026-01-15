# AI Service API

Base URL: `/api/ai`

## Overview

The AI Service provides intelligent features powered by Athena AI:
- Conversational support
- Intent analysis
- Financial insights
- Fraud detection
- Personalized recommendations

## Endpoints

### Chat

#### Send Message
```http
POST /chat
Content-Type: application/json

{
  "message": "Qual meu saldo atual?",
  "customer_id": "uuid",
  "conversation_id": "uuid",
  "context": {
    "channel": "app",
    "language": "pt-BR"
  }
}
```

**Response**
```json
{
  "response": "Seu saldo atual é de R$ 10.000,00, sendo R$ 9.500,00 disponível para uso.",
  "conversation_id": "uuid",
  "intent": {
    "name": "CHECK_BALANCE",
    "confidence": 0.95
  },
  "suggestions": [
    "Ver extrato",
    "Fazer PIX",
    "Ver investimentos"
  ]
}
```

#### Stream Chat (SSE)
```http
POST /chat/stream
Content-Type: application/json

{
  "message": "Me explique como funciona o PIX",
  "customer_id": "uuid"
}
```

**Response (Server-Sent Events)**
```
data: {"type": "start", "conversation_id": "uuid"}
data: {"type": "chunk", "content": "O PIX é o sistema de pagamentos"}
data: {"type": "chunk", "content": " instantâneos do Banco Central..."}
data: {"type": "end", "intent": "EXPLAIN_PIX"}
```

### Intent Analysis

#### Analyze Intent
```http
POST /analyze/intent
Content-Type: application/json

{
  "message": "Quero fazer um pix de 100 reais para o João"
}
```

**Response**
```json
{
  "intent": "PIX_TRANSFER",
  "confidence": 0.92,
  "entities": [
    {
      "type": "AMOUNT",
      "value": 100.00,
      "text": "100 reais"
    },
    {
      "type": "RECIPIENT",
      "value": "João",
      "text": "João"
    }
  ],
  "action": {
    "type": "PIX_TRANSFER",
    "params": {
      "amount": 100.00,
      "recipient_name": "João"
    }
  }
}
```

**Common Intents:**
- `CHECK_BALANCE` - Check account balance
- `PIX_TRANSFER` - Send PIX
- `VIEW_STATEMENT` - View statement
- `BLOCK_CARD` - Block card
- `LOAN_SIMULATION` - Simulate loan
- `SUPPORT` - General support
- `COMPLAINT` - Register complaint

### Financial Insights

#### Get Insights
```http
GET /insights/{customer_id}
```

**Response**
```json
{
  "customer_id": "uuid",
  "insights": [
    {
      "type": "SPENDING_PATTERN",
      "title": "Gastos com alimentação",
      "description": "Seus gastos com alimentação aumentaram 15% este mês",
      "icon": "restaurant",
      "action": {
        "text": "Ver detalhes",
        "route": "/spending/food"
      }
    },
    {
      "type": "SAVINGS_OPPORTUNITY",
      "title": "Oportunidade de economia",
      "description": "Você pode economizar R$ 150/mês reduzindo assinaturas",
      "icon": "savings"
    },
    {
      "type": "INVESTMENT_SUGGESTION",
      "title": "Sugestão de investimento",
      "description": "Com base no seu perfil, considere CDB com liquidez diária",
      "icon": "trending_up"
    }
  ],
  "generated_at": "2024-01-15T10:00:00Z"
}
```

### Fraud Analysis

#### Analyze Transaction
```http
POST /analyze/fraud
Content-Type: application/json

{
  "transaction_type": "PIX",
  "amount": 5000.00,
  "customer_id": "uuid",
  "target_document": "98765432109",
  "target_name": "Nome Destinatário",
  "device_fingerprint": "abc123",
  "ip_address": "192.168.1.100",
  "location": {
    "lat": -23.5505,
    "lng": -46.6333
  }
}
```

**Response**
```json
{
  "risk_score": 0.15,
  "risk_level": "LOW",
  "decision": "APPROVE",
  "factors": [
    {
      "name": "KNOWN_RECIPIENT",
      "impact": -0.20,
      "description": "Destinatário já recebeu transferências anteriores"
    },
    {
      "name": "USUAL_AMOUNT",
      "impact": -0.10,
      "description": "Valor dentro do padrão habitual"
    },
    {
      "name": "NEW_DEVICE",
      "impact": 0.15,
      "description": "Dispositivo não reconhecido"
    }
  ],
  "recommendations": []
}
```

**Risk Levels:**
- `LOW` (0.0 - 0.3) - Approve automatically
- `MEDIUM` (0.3 - 0.6) - May require verification
- `HIGH` (0.6 - 0.8) - Requires verification
- `CRITICAL` (0.8 - 1.0) - Block transaction

### Recommendations

#### Get Recommendations
```http
GET /recommendations/{customer_id}?type=products
```

**Types:** `products`, `actions`, `content`

**Response**
```json
{
  "recommendations": [
    {
      "type": "PRODUCT",
      "id": "credit-card-gold",
      "title": "Cartão Gold",
      "description": "Com base no seu perfil, você pode ter um cartão com limite de R$ 10.000",
      "score": 0.85
    },
    {
      "type": "PRODUCT",
      "id": "personal-loan",
      "title": "Empréstimo Pessoal",
      "description": "Taxa especial de 1.99% ao mês",
      "score": 0.72
    }
  ]
}
```

### WhatsApp Integration

#### WhatsApp Webhook
```http
POST /webhook/whatsapp
Content-Type: application/json

{
  "from": "5511999999999",
  "message": "Qual meu saldo?",
  "timestamp": "2024-01-15T10:00:00Z",
  "message_id": "wamid.123"
}
```

**Response**
```json
{
  "status": "processed",
  "response_sent": true,
  "conversation_id": "uuid"
}
```

### Conversation History

#### Get Conversations
```http
GET /conversations/{customer_id}?limit=10
```

**Response**
```json
[
  {
    "id": "uuid",
    "channel": "app",
    "messages": [
      {
        "role": "user",
        "content": "Qual meu saldo?",
        "timestamp": "2024-01-15T10:00:00Z"
      },
      {
        "role": "assistant",
        "content": "Seu saldo é R$ 10.000,00",
        "timestamp": "2024-01-15T10:00:01Z"
      }
    ],
    "created_at": "2024-01-15T10:00:00Z"
  }
]
```

## Athena Configuration

When Athena is disabled (`ATHENA_ENABLED=false`), the service uses fallback rules:
- Basic intent matching
- Pre-defined responses
- Simple pattern analysis

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Invalid request |
| 404 | Customer/Conversation not found |
| 503 | Athena service unavailable |
| 529 | Rate limit exceeded |
