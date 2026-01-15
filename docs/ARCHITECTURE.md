# Athena Pay - Architecture

## Overview

Athena Pay is a complete Payment Service Provider (PSP) built with microservices architecture, designed for:
- Direct integration with Brazilian banking infrastructure (BACEN, SPI, DICT, STR, COMPE)
- High scalability and availability
- Regulatory compliance (COAF, LGPD)
- Modern user experience

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Load Balancer                              │
└─────────────────────────────────────────────────────────────────────┘
                                   │
┌─────────────────────────────────────────────────────────────────────┐
│                         API Gateway (Nginx)                          │
│                    Rate Limiting, SSL Termination                    │
└─────────────────────────────────────────────────────────────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
┌───────▼───────┐   ┌──────────────▼──────────────┐   ┌──────▼──────┐
│  Web Client   │   │      Backend Services       │   │ Admin Panel │
│   (React)     │   │                              │   │   (React)   │
└───────────────┘   └──────────────────────────────┘   └─────────────┘
```

## Service Architecture

```
                    ┌──────────────────────────────────────────────────────┐
                    │                    Core Services                      │
                    │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
                    │  │  Accounts   │  │    Audit    │  │   Keycloak  │   │
                    │  │   Service   │  │   Service   │  │    (Auth)   │   │
                    │  └─────────────┘  └─────────────┘  └─────────────┘   │
                    └──────────────────────────────────────────────────────┘
                                            │
        ┌───────────────────────────────────┼───────────────────────────────┐
        │                                   │                               │
┌───────▼──────────────────────┐   ┌───────▼──────────────────────┐   ┌────▼─────────────────────┐
│     Security Services        │   │     Payment Services          │   │    Credit Services       │
│  ┌─────────┐  ┌─────────┐   │   │  ┌─────┐ ┌─────┐ ┌─────────┐ │   │  ┌───────┐  ┌─────────┐ │
│  │Compliance│  │   KYC   │   │   │  │ PIX │ │Cards│ │ Boleto  │ │   │  │ Loans │  │   AI    │ │
│  │ Service  │  │ Service │   │   │  └─────┘ └─────┘ └─────────┘ │   │  │Service│  │ Service │ │
│  └─────────┘  └─────────┘   │   │           ┌─────┐             │   │  └───────┘  └─────────┘ │
│                              │   │           │Wire │             │   │                         │
│                              │   │           └─────┘             │   │                         │
└──────────────────────────────┘   └──────────────────────────────┘   └─────────────────────────┘
```

## Data Flow

### PIX Transfer Flow

```
┌──────┐    ┌─────────┐    ┌───────────┐    ┌─────────┐    ┌──────────┐
│Client│───▶│ Gateway │───▶│PIX Service│───▶│Compliance│───▶│ Accounts │
└──────┘    └─────────┘    └───────────┘    └─────────┘    └──────────┘
                                │                               │
                                │                               │
                                ▼                               ▼
                          ┌──────────┐                   ┌───────────┐
                          │  Audit   │                   │  Ledger   │
                          │ Service  │                   │ (Balance) │
                          └──────────┘                   └───────────┘
                                │
                                ▼
                          ┌──────────┐
                          │SPI/DICT  │
                          │(External)│
                          └──────────┘
```

### Card Authorization Flow

```
┌──────────┐    ┌─────────┐    ┌────────────┐    ┌───────────┐
│ Acquirer │───▶│ Gateway │───▶│Card Service│───▶│  Fraud    │
│          │    │         │    │            │    │  Engine   │
└──────────┘    └─────────┘    └────────────┘    └───────────┘
                                     │                │
                                     │                │
                                     ▼                ▼
                               ┌──────────┐    ┌───────────┐
                               │ Accounts │    │ Compliance│
                               │ (Limit)  │    │           │
                               └──────────┘    └───────────┘
```

## Technology Stack

### Backend
- **Language:** Python 3.12
- **Framework:** FastAPI
- **ORM:** SQLAlchemy
- **Validation:** Pydantic

### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **Styling:** CSS Variables (Design Tokens)
- **Build:** Vite

### Infrastructure
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **Message Queue:** RabbitMQ
- **API Gateway:** Nginx
- **Authentication:** Keycloak
- **Containers:** Docker

### Monitoring
- **Metrics:** Prometheus
- **Visualization:** Grafana
- **Logging:** JSON stdout (ELK-ready)

## Database Design

### Schema Separation

Each service has its own schema for isolation:

```sql
-- Core
accounts.customers
accounts.accounts
accounts.transactions

-- Payments
pix.keys
pix.transactions
cards.cards
cards.transactions
boleto.boletos
wire.transfers

-- Credit
loans.credit_scores
loans.loans
loans.installments

-- Security
compliance.alerts
compliance.screening_results
kyc.documents
kyc.face_validations

-- Operations
audit.events
```

### Ledger Pattern

Account balances use double-entry bookkeeping:

```
┌────────────┐     ┌──────────────┐
│  Account   │────▶│ Transactions │
│  balance   │     │   (Ledger)   │
└────────────┘     └──────────────┘
      │
      │ Derived from
      ▼
┌──────────────────────────────────┐
│  SUM(credits) - SUM(debits)      │
└──────────────────────────────────┘
```

## Security Architecture

### Authentication Flow

```
┌──────┐    ┌─────────┐    ┌──────────┐
│Client│───▶│ Keycloak│───▶│  JWT     │
└──────┘    └─────────┘    │  Token   │
                           └──────────┘
                                │
                                ▼
┌───────────────────────────────────────────┐
│              API Gateway                   │
│         Token Validation                   │
└───────────────────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────┐
│              Services                      │
│    Claims Extraction & Authorization       │
└───────────────────────────────────────────┘
```

### KYC Levels & Limits

```
Level 0 (Unverified)
├── Daily PIX: R$ 500
├── Monthly: R$ 2.000
└── Features: Basic

Level 1 (CPF Verified)
├── Daily PIX: R$ 5.000
├── Monthly: R$ 20.000
└── Features: +TED, +Cards

Level 2 (Documents + Selfie)
├── Daily PIX: R$ 50.000
├── Monthly: R$ 500.000
└── Features: +Loans

Level 3 (Full Verification)
├── Daily PIX: R$ 500.000
├── Monthly: R$ 5.000.000
└── Features: All
```

## External Integrations

### Brazilian Banking Infrastructure

```
┌─────────────────────────────────────────────────────────────┐
│                     Athena Pay                               │
└─────────────────────────────────────────────────────────────┘
        │              │              │              │
        ▼              ▼              ▼              ▼
   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
   │   SPI   │   │  DICT   │   │   STR   │   │  COMPE  │
   │  (PIX)  │   │ (PIX    │   │  (TED)  │   │ (DOC/   │
   │         │   │  Keys)  │   │         │   │ Boleto) │
   └─────────┘   └─────────┘   └─────────┘   └─────────┘
        │              │              │              │
        └──────────────┴──────────────┴──────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │     BACEN       │
                    │ (Central Bank)  │
                    └─────────────────┘
```

### Card Processing

```
┌─────────────────┐
│   Athena Pay    │
│  Card Service   │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   Acquirer      │
│  Integration    │
│  (Abstract)     │
└─────────────────┘
   │    │    │
   ▼    ▼    ▼
┌────┐┌────┐┌─────┐
│Cielo││Rede││Stone│
└────┘└────┘└─────┘
```

## Scalability

### Horizontal Scaling

All services are stateless and can scale horizontally:

```
                    ┌──────────────────┐
                    │   Load Balancer  │
                    └──────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   ┌────▼────┐        ┌────▼────┐        ┌────▼────┐
   │PIX Svc 1│        │PIX Svc 2│        │PIX Svc 3│
   └─────────┘        └─────────┘        └─────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                    ┌───────▼───────┐
                    │   PostgreSQL  │
                    │  (Read Replicas)│
                    └───────────────┘
```

### Event-Driven Architecture

High-throughput operations use message queues:

```
┌─────────┐     ┌──────────┐     ┌─────────────┐
│ Service │────▶│ RabbitMQ │────▶│  Workers    │
└─────────┘     └──────────┘     └─────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
   ┌────▼────┐ ┌────▼────┐ ┌────▼────┐
   │  Audit  │ │Compliance│ │  Email  │
   │ Worker  │ │  Worker  │ │ Worker  │
   └─────────┘ └──────────┘ └─────────┘
```

## Future Roadmap

1. **Kubernetes Deployment** - Container orchestration
2. **Event Sourcing** - Full audit trail with replay
3. **Multi-Region** - Geographic redundancy
4. **Open Banking** - Open Finance integration
5. **Real BACEN Integration** - Direct SPI/DICT connection
