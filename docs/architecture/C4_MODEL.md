# Athena Pay - C4 Model Architecture

## Overview

This document describes the Athena Pay architecture using the C4 Model methodology, which provides four levels of abstraction: Context, Container, Component, and Code.

---

## Level 1: System Context Diagram

The System Context diagram shows Athena Pay and its relationship with users and external systems.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              SYSTEM CONTEXT                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│    ┌──────────────┐         ┌──────────────┐         ┌──────────────┐           │
│    │   Cliente    │         │   Admin      │         │   Parceiro   │           │
│    │   (Pessoa    │         │   (Backoffice│         │   (API       │           │
│    │   Física)    │         │   Operator)  │         │   Consumer)  │           │
│    └──────┬───────┘         └──────┬───────┘         └──────┬───────┘           │
│           │                        │                        │                    │
│           │ App Mobile/Web         │ Admin Portal          │ REST API           │
│           │                        │                        │                    │
│           ▼                        ▼                        ▼                    │
│    ┌─────────────────────────────────────────────────────────────────┐          │
│    │                                                                   │          │
│    │                      ATHENA PAY                                  │          │
│    │                                                                   │          │
│    │   Plataforma Financeira Digital                                  │          │
│    │   • Conta Digital          • Investimentos                       │          │
│    │   • PIX                    • Seguros                             │          │
│    │   • Cartões                • Empréstimos                         │          │
│    │   • Pagamentos             • Câmbio/Cripto                       │          │
│    │                                                                   │          │
│    └──────────────────────────────┬──────────────────────────────────┘          │
│                                   │                                              │
│           ┌───────────────────────┼───────────────────────┐                     │
│           │                       │                       │                      │
│           ▼                       ▼                       ▼                      │
│    ┌──────────────┐       ┌──────────────┐       ┌──────────────┐              │
│    │   BACEN      │       │   CIP/SITRAF │       │   Bureaus    │              │
│    │   (PIX/SPI)  │       │   (TED/DOC)  │       │   (Serasa,   │              │
│    │              │       │              │       │   SPC, etc)  │              │
│    └──────────────┘       └──────────────┘       └──────────────┘              │
│                                                                                   │
│    ┌──────────────┐       ┌──────────────┐       ┌──────────────┐              │
│    │   Bandeiras  │       │   B3         │       │   Receita    │              │
│    │   (Visa,     │       │   (Bolsa)    │       │   Federal    │              │
│    │   Master)    │       │              │       │              │              │
│    └──────────────┘       └──────────────┘       └──────────────┘              │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### PlantUML Version

```plantuml
@startuml C4_Context
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml

title System Context Diagram - Athena Pay

Person(customer, "Cliente", "Pessoa física que utiliza serviços bancários")
Person(admin, "Administrador", "Operador de backoffice")
Person(partner, "Parceiro", "Empresa que consome APIs")

System(athena, "Athena Pay", "Plataforma financeira digital completa com conta, PIX, cartões, investimentos e mais")

System_Ext(bacen, "BACEN/SPI", "Sistema de Pagamentos Instantâneos")
System_Ext(cip, "CIP/SITRAF", "Câmara Interbancária de Pagamentos")
System_Ext(bureaus, "Bureaus de Crédito", "Serasa, SPC, Boa Vista")
System_Ext(bandeiras, "Bandeiras", "Visa, Mastercard, Elo")
System_Ext(b3, "B3", "Bolsa de Valores do Brasil")
System_Ext(receita, "Receita Federal", "Validação CPF/CNPJ")

Rel(customer, athena, "Usa", "Mobile App / Web")
Rel(admin, athena, "Gerencia", "Admin Portal")
Rel(partner, athena, "Integra", "REST API")

Rel(athena, bacen, "PIX/TED", "ISO 20022")
Rel(athena, cip, "Transferências", "STR")
Rel(athena, bureaus, "Consulta Score", "API")
Rel(athena, bandeiras, "Transações Cartão", "ISO 8583")
Rel(athena, b3, "Operações", "FIX Protocol")
Rel(athena, receita, "Validação", "API")

@enduml
```

---

## Level 2: Container Diagram

The Container diagram shows the high-level technology choices and how containers communicate.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                CONTAINER DIAGRAM                                         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                              FRONTEND LAYER                                       │   │
│  │  ┌───────────────┐   ┌───────────────┐   ┌───────────────┐                      │   │
│  │  │  Web Client   │   │  Admin Portal │   │  Mobile App   │                      │   │
│  │  │  (React/TS)   │   │  (React/TS)   │   │  (React       │                      │   │
│  │  │  Port: 5174   │   │  Port: 5175   │   │   Native)     │                      │   │
│  │  └───────┬───────┘   └───────┬───────┘   └───────┬───────┘                      │   │
│  └──────────┼───────────────────┼───────────────────┼───────────────────────────────┘   │
│             │                   │                   │                                    │
│             └───────────────────┼───────────────────┘                                    │
│                                 ▼                                                        │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                              GATEWAY LAYER                                        │   │
│  │  ┌───────────────────────────────────────────────────────────────────────────┐  │   │
│  │  │                         API Gateway (FastAPI)                              │  │   │
│  │  │  • Rate Limiting    • JWT Validation    • Request Routing                 │  │   │
│  │  │  • DDoS Protection  • CORS              • Load Balancing                  │  │   │
│  │  │  Port: 8000                                                                │  │   │
│  │  └───────────────────────────────────────────────────────────────────────────┘  │   │
│  │                                                                                   │   │
│  │  ┌───────────────────────────────────────────────────────────────────────────┐  │   │
│  │  │                         Keycloak (Auth Server)                             │  │   │
│  │  │  • OAuth 2.0 / OIDC   • MFA    • Session Management                       │  │   │
│  │  │  Port: 8080                                                                │  │   │
│  │  └───────────────────────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                         │                                               │
│                                         ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                            MICROSERVICES LAYER                                    │   │
│  │                                                                                   │   │
│  │   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │   │
│  │   │  Accounts   │ │    PIX      │ │   Cards     │ │  Payments   │              │   │
│  │   │  Service    │ │  Service    │ │  Service    │ │  Service    │              │   │
│  │   │  (Python)   │ │  (Python)   │ │  (Python)   │ │  (Python)   │              │   │
│  │   │  :8081      │ │  :8082      │ │  :8083      │ │  :8084      │              │   │
│  │   └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘              │   │
│  │                                                                                   │   │
│  │   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │   │
│  │   │   Loans     │ │  Boleto     │ │   Wire      │ │    KYC      │              │   │
│  │   │  Service    │ │  Service    │ │  Service    │ │  Service    │              │   │
│  │   │  (Python)   │ │  (Python)   │ │  (Python)   │ │  (Python)   │              │   │
│  │   │  :8085      │ │  :8086      │ │  :8087      │ │  :8088      │              │   │
│  │   └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘              │   │
│  │                                                                                   │   │
│  │   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │   │
│  │   │ Compliance  │ │   Audit     │ │    LGPD     │ │   Rewards   │              │   │
│  │   │  Service    │ │  Service    │ │  Service    │ │  Service    │              │   │
│  │   │  (Python)   │ │  (Python)   │ │  (Python)   │ │  (Python)   │              │   │
│  │   │  :8089      │ │  :8090      │ │  :8005      │ │  :8091      │              │   │
│  │   └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘              │   │
│  │                                                                                   │   │
│  │   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │   │
│  │   │  FX/Crypto  │ │  Customer   │ │ Accounting  │ │    AI       │              │   │
│  │   │  Service    │ │  Service    │ │  Service    │ │  Service    │              │   │
│  │   │  (Python)   │ │  (Python)   │ │  (Python)   │ │  (Python)   │              │   │
│  │   │  :8092      │ │  :8093      │ │  :8094      │ │  :8095      │              │   │
│  │   └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘              │   │
│  │                                                                                   │   │
│  │   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                              │   │
│  │   │  Statement  │ │  WhatsApp   │ │ Affiliates  │                              │   │
│  │   │  Service    │ │  Service    │ │  Service    │                              │   │
│  │   │  (Python)   │ │  (Python)   │ │  (Python)   │                              │   │
│  │   │  :8096      │ │  :8097      │ │  :8098      │                              │   │
│  │   └─────────────┘ └─────────────┘ └─────────────┘                              │   │
│  │                                                                                   │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                         │                                               │
│                                         ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                              DATA LAYER                                           │   │
│  │                                                                                   │   │
│  │   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐              │   │
│  │   │   PostgreSQL    │   │     Redis       │   │   Kafka/        │              │   │
│  │   │   (Primary DB)  │   │   (Cache/Rate   │   │   RabbitMQ      │              │   │
│  │   │   Port: 5432    │   │    Limiting)    │   │   (Events)      │              │   │
│  │   │                 │   │   Port: 6379    │   │   Port: 9092    │              │   │
│  │   └─────────────────┘   └─────────────────┘   └─────────────────┘              │   │
│  │                                                                                   │   │
│  │   ┌─────────────────┐   ┌─────────────────┐                                     │   │
│  │   │  Elasticsearch  │   │   MinIO/S3      │                                     │   │
│  │   │   (Logs/Search) │   │   (Documents)   │                                     │   │
│  │   │   Port: 9200    │   │   Port: 9000    │                                     │   │
│  │   └─────────────────┘   └─────────────────┘                                     │   │
│  │                                                                                   │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### PlantUML Version

```plantuml
@startuml C4_Container
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

title Container Diagram - Athena Pay

Person(customer, "Cliente", "Usuário da plataforma")
Person(admin, "Admin", "Operador backoffice")

System_Boundary(athena, "Athena Pay") {
    ' Frontend
    Container(web, "Web Client", "React/TypeScript", "Aplicação web para clientes")
    Container(admin_portal, "Admin Portal", "React/TypeScript", "Portal administrativo")
    Container(mobile, "Mobile App", "React Native", "Aplicativo móvel")

    ' Gateway
    Container(gateway, "API Gateway", "FastAPI/Python", "Roteamento, rate limiting, segurança")
    Container(keycloak, "Keycloak", "Java", "Autenticação OAuth2/OIDC")

    ' Core Services
    Container(accounts, "Accounts Service", "Python/FastAPI", "Gestão de contas e saldos")
    Container(pix, "PIX Service", "Python/FastAPI", "Transferências PIX")
    Container(cards, "Cards Service", "Python/FastAPI", "Cartões de crédito/débito")
    Container(payments, "Payments Service", "Python/FastAPI", "Pagamentos e boletos")
    Container(loans, "Loans Service", "Python/FastAPI", "Empréstimos e crédito")
    Container(kyc, "KYC Service", "Python/FastAPI", "Verificação de identidade")
    Container(compliance, "Compliance Service", "Python/FastAPI", "COAF, PLD-FT")
    Container(lgpd, "LGPD Service", "Python/FastAPI", "Proteção de dados")

    ' Data
    ContainerDb(postgres, "PostgreSQL", "Database", "Dados transacionais")
    ContainerDb(redis, "Redis", "Cache", "Cache e rate limiting")
    ContainerQueue(kafka, "Kafka", "Message Broker", "Eventos assíncronos")
}

System_Ext(bacen, "BACEN/SPI", "PIX")
System_Ext(bureaus, "Bureaus", "Score")

Rel(customer, web, "Usa", "HTTPS")
Rel(customer, mobile, "Usa", "HTTPS")
Rel(admin, admin_portal, "Usa", "HTTPS")

Rel(web, gateway, "API", "REST/JSON")
Rel(mobile, gateway, "API", "REST/JSON")
Rel(admin_portal, gateway, "API", "REST/JSON")

Rel(gateway, keycloak, "Auth", "OAuth2")
Rel(gateway, accounts, "Route", "HTTP")
Rel(gateway, pix, "Route", "HTTP")
Rel(gateway, cards, "Route", "HTTP")
Rel(gateway, payments, "Route", "HTTP")

Rel(accounts, postgres, "R/W", "SQL")
Rel(pix, postgres, "R/W", "SQL")
Rel(pix, kafka, "Publish", "Events")
Rel(cards, postgres, "R/W", "SQL")

Rel(pix, bacen, "PIX", "ISO 20022")
Rel(kyc, bureaus, "Query", "API")

@enduml
```

---

## Level 3: Component Diagram - PIX Service

Example of component-level detail for the PIX Service.

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         PIX SERVICE - COMPONENT DIAGRAM                               │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│   ┌─────────────────────────────────────────────────────────────────────────────┐   │
│   │                            API Layer                                          │   │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │   │
│   │  │    Keys     │  │   Transfer  │  │   QRCode    │  │   Webhook   │        │   │
│   │  │  Controller │  │  Controller │  │  Controller │  │  Controller │        │   │
│   │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │   │
│   └─────────┼────────────────┼────────────────┼────────────────┼────────────────┘   │
│             │                │                │                │                     │
│             ▼                ▼                ▼                ▼                     │
│   ┌─────────────────────────────────────────────────────────────────────────────┐   │
│   │                          Domain Layer                                         │   │
│   │  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐  │   │
│   │  │    PIX Key          │  │    Transaction      │  │    Notification     │  │   │
│   │  │    Service          │  │    Service          │  │    Service          │  │   │
│   │  │                     │  │                     │  │                     │  │   │
│   │  │  • RegisterKey()    │  │  • InitTransfer()   │  │  • SendPush()       │  │   │
│   │  │  • DeleteKey()      │  │  • ProcessPIX()     │  │  • SendSMS()        │  │   │
│   │  │  • ValidateKey()    │  │  • RefundPIX()      │  │  • SendEmail()      │  │   │
│   │  │  • ListKeys()       │  │  • SchedulePIX()    │  │                     │  │   │
│   │  └──────────┬──────────┘  └──────────┬──────────┘  └──────────┬──────────┘  │   │
│   └─────────────┼────────────────────────┼────────────────────────┼──────────────┘   │
│                 │                        │                        │                  │
│                 ▼                        ▼                        ▼                  │
│   ┌─────────────────────────────────────────────────────────────────────────────┐   │
│   │                        Infrastructure Layer                                   │   │
│   │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │   │
│   │  │   PIX Key       │  │  Transaction    │  │    Outbox       │              │   │
│   │  │   Repository    │  │  Repository     │  │   Publisher     │              │   │
│   │  │                 │  │                 │  │                 │              │   │
│   │  │ • PostgreSQL    │  │ • PostgreSQL    │  │ • Kafka         │              │   │
│   │  └─────────────────┘  └─────────────────┘  └─────────────────┘              │   │
│   │                                                                               │   │
│   │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │   │
│   │  │   BACEN         │  │    HSM/KMS      │  │    Cache        │              │   │
│   │  │   Client        │  │    Client       │  │    Client       │              │   │
│   │  │                 │  │                 │  │                 │              │   │
│   │  │ • SPI API       │  │ • Key Mgmt      │  │ • Redis         │              │   │
│   │  └─────────────────┘  └─────────────────┘  └─────────────────┘              │   │
│   └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### PlantUML Version

```plantuml
@startuml C4_Component_PIX
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

title Component Diagram - PIX Service

Container_Boundary(pix_service, "PIX Service") {
    ' API Layer
    Component(keys_ctrl, "Keys Controller", "FastAPI Router", "Endpoints para chaves PIX")
    Component(transfer_ctrl, "Transfer Controller", "FastAPI Router", "Endpoints para transferências")
    Component(qr_ctrl, "QRCode Controller", "FastAPI Router", "Geração de QR Codes")
    Component(webhook_ctrl, "Webhook Controller", "FastAPI Router", "Recebe callbacks do BACEN")

    ' Domain Layer
    Component(key_svc, "PIX Key Service", "Python", "Lógica de negócio para chaves")
    Component(transfer_svc, "Transaction Service", "Python", "Lógica de transferências")
    Component(notification_svc, "Notification Service", "Python", "Envio de notificações")

    ' Infrastructure Layer
    Component(key_repo, "Key Repository", "SQLAlchemy", "Persistência de chaves")
    Component(tx_repo, "Transaction Repository", "SQLAlchemy", "Persistência de transações")
    Component(outbox, "Outbox Publisher", "Kafka Producer", "Publicação de eventos")
    Component(bacen_client, "BACEN Client", "HTTP Client", "Integração SPI")
    Component(hsm_client, "HSM/KMS Client", "gRPC", "Gerenciamento de chaves")
}

ContainerDb(postgres, "PostgreSQL", "Database")
ContainerDb(redis, "Redis", "Cache")
ContainerQueue(kafka, "Kafka", "Events")
System_Ext(bacen, "BACEN/SPI", "PIX Network")

Rel(keys_ctrl, key_svc, "Usa")
Rel(transfer_ctrl, transfer_svc, "Usa")
Rel(qr_ctrl, key_svc, "Usa")
Rel(webhook_ctrl, transfer_svc, "Usa")

Rel(key_svc, key_repo, "Persiste")
Rel(transfer_svc, tx_repo, "Persiste")
Rel(transfer_svc, outbox, "Publica")
Rel(transfer_svc, notification_svc, "Notifica")

Rel(key_repo, postgres, "SQL")
Rel(tx_repo, postgres, "SQL")
Rel(outbox, kafka, "Publish")
Rel(bacen_client, bacen, "ISO 20022")

@enduml
```

---

## Level 4: Code Diagram - Transaction Entity

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         TRANSACTION ENTITY - CODE DIAGRAM                             │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│   ┌─────────────────────────────────────────────────────────────────────────────┐   │
│   │                           <<Entity>>                                          │   │
│   │                         PIXTransaction                                        │   │
│   ├─────────────────────────────────────────────────────────────────────────────┤   │
│   │  - id: UUID                                                                   │   │
│   │  - end_to_end_id: str                                                        │   │
│   │  - amount: Decimal                                                            │   │
│   │  - sender_key: PIXKey                                                         │   │
│   │  - receiver_key: str                                                          │   │
│   │  - status: TransactionStatus                                                  │   │
│   │  - created_at: datetime                                                       │   │
│   │  - processed_at: datetime                                                     │   │
│   │  - description: str                                                           │   │
│   ├─────────────────────────────────────────────────────────────────────────────┤   │
│   │  + create(amount, sender, receiver): PIXTransaction                          │   │
│   │  + process(): void                                                            │   │
│   │  + cancel(): void                                                             │   │
│   │  + refund(reason): PIXTransaction                                            │   │
│   │  + is_valid(): bool                                                           │   │
│   └─────────────────────────────────────────────────────────────────────────────┘   │
│                                       │                                              │
│                                       │ uses                                         │
│                                       ▼                                              │
│   ┌─────────────────────────────────────────────────────────────────────────────┐   │
│   │                           <<Enum>>                                            │   │
│   │                       TransactionStatus                                       │   │
│   ├─────────────────────────────────────────────────────────────────────────────┤   │
│   │  PENDING                                                                      │   │
│   │  PROCESSING                                                                   │   │
│   │  COMPLETED                                                                    │   │
│   │  FAILED                                                                       │   │
│   │  CANCELLED                                                                    │   │
│   │  REFUNDED                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                       │
│   ┌─────────────────────────────────────────────────────────────────────────────┐   │
│   │                           <<Entity>>                                          │   │
│   │                             PIXKey                                            │   │
│   ├─────────────────────────────────────────────────────────────────────────────┤   │
│   │  - id: UUID                                                                   │   │
│   │  - key_type: KeyType (CPF, CNPJ, EMAIL, PHONE, EVP)                         │   │
│   │  - key_value: str                                                             │   │
│   │  - account_id: UUID                                                           │   │
│   │  - status: KeyStatus                                                          │   │
│   │  - created_at: datetime                                                       │   │
│   ├─────────────────────────────────────────────────────────────────────────────┤   │
│   │  + register(): void                                                           │   │
│   │  + deactivate(): void                                                         │   │
│   │  + validate(): bool                                                           │   │
│   └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Python Implementation

```python
# pix/domain/entities/transaction.py

from dataclasses import dataclass, field
from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import Optional
from uuid import UUID, uuid4

class TransactionStatus(Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"
    REFUNDED = "REFUNDED"

class KeyType(Enum):
    CPF = "CPF"
    CNPJ = "CNPJ"
    EMAIL = "EMAIL"
    PHONE = "PHONE"
    EVP = "EVP"  # Chave aleatória

@dataclass
class PIXKey:
    id: UUID
    key_type: KeyType
    key_value: str
    account_id: UUID
    status: str = "ACTIVE"
    created_at: datetime = field(default_factory=datetime.utcnow)

@dataclass
class PIXTransaction:
    id: UUID = field(default_factory=uuid4)
    end_to_end_id: str = ""
    amount: Decimal = Decimal("0")
    sender_key: Optional[PIXKey] = None
    receiver_key: str = ""
    status: TransactionStatus = TransactionStatus.PENDING
    created_at: datetime = field(default_factory=datetime.utcnow)
    processed_at: Optional[datetime] = None
    description: str = ""

    def process(self) -> None:
        """Process the transaction"""
        if self.status != TransactionStatus.PENDING:
            raise ValueError("Transaction cannot be processed")
        self.status = TransactionStatus.PROCESSING

    def complete(self) -> None:
        """Mark transaction as completed"""
        self.status = TransactionStatus.COMPLETED
        self.processed_at = datetime.utcnow()

    def cancel(self) -> None:
        """Cancel the transaction"""
        if self.status not in [TransactionStatus.PENDING, TransactionStatus.PROCESSING]:
            raise ValueError("Transaction cannot be cancelled")
        self.status = TransactionStatus.CANCELLED

    def is_valid(self) -> bool:
        """Validate transaction data"""
        return (
            self.amount > 0 and
            self.receiver_key and
            self.sender_key is not None
        )
```

---

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + TypeScript | Web & Admin interfaces |
| **Mobile** | React Native | iOS & Android apps |
| **API Gateway** | FastAPI + Python | Routing, Rate Limiting, Security |
| **Authentication** | Keycloak 26.x | OAuth2/OIDC, MFA, SSO |
| **Microservices** | Python + FastAPI | Business logic |
| **Database** | PostgreSQL 15 | Transactional data |
| **Cache** | Redis 7 | Session, Rate Limiting |
| **Message Queue** | Apache Kafka | Event streaming |
| **Search** | Elasticsearch | Logs, Full-text search |
| **Storage** | MinIO (S3) | Documents, Images |
| **Orchestration** | Kubernetes | Container orchestration |
| **CI/CD** | GitHub Actions | Automated deployment |
| **Monitoring** | Prometheus + Grafana | Metrics & Dashboards |
| **Tracing** | Jaeger | Distributed tracing |

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           SECURITY LAYERS                                            │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │  PERIMETER SECURITY                                                          │    │
│  │  • WAF (Web Application Firewall)                                           │    │
│  │  • DDoS Protection                                                          │    │
│  │  • TLS 1.3 Encryption                                                       │    │
│  │  • CORS Policy                                                              │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                       │                                              │
│                                       ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │  AUTHENTICATION & AUTHORIZATION                                              │    │
│  │  • OAuth 2.0 / OpenID Connect                                               │    │
│  │  • JWT Token Validation                                                      │    │
│  │  • Multi-Factor Authentication (TOTP, SMS)                                  │    │
│  │  • Role-Based Access Control (RBAC)                                         │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                       │                                              │
│                                       ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │  APPLICATION SECURITY                                                        │    │
│  │  • Input Validation & Sanitization                                          │    │
│  │  • Rate Limiting (Redis-based)                                              │    │
│  │  • SQL Injection Prevention (ORM)                                           │    │
│  │  • XSS Protection                                                           │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                       │                                              │
│                                       ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │  DATA SECURITY                                                               │    │
│  │  • Encryption at Rest (AES-256)                                             │    │
│  │  • Encryption in Transit (TLS)                                              │    │
│  │  • Key Management (HSM/KMS)                                                 │    │
│  │  • Dynamic Salt for Passwords                                               │    │
│  │  • PII Masking (LGPD Compliance)                                            │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                       │                                              │
│                                       ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │  COMPLIANCE & AUDIT                                                          │    │
│  │  • LGPD (Brazilian Data Protection)                                         │    │
│  │  • PCI-DSS (Card Data Security)                                             │    │
│  │  • COAF/PLD-FT (Anti-Money Laundering)                                      │    │
│  │  • Full Audit Trail                                                          │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow - PIX Transfer

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         PIX TRANSFER - DATA FLOW                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│   Cliente              API Gateway          PIX Service           BACEN/SPI          │
│      │                     │                    │                    │               │
│      │  1. POST /pix       │                    │                    │               │
│      │ ─────────────────►  │                    │                    │               │
│      │                     │                    │                    │               │
│      │                     │  2. Validate JWT   │                    │               │
│      │                     │ ──────────────────►│                    │               │
│      │                     │                    │                    │               │
│      │                     │  3. Rate Check     │                    │               │
│      │                     │ ──────────────────►│                    │               │
│      │                     │                    │                    │               │
│      │                     │  4. Forward        │                    │               │
│      │                     │ ──────────────────►│                    │               │
│      │                     │                    │                    │               │
│      │                     │                    │  5. Validate Key   │               │
│      │                     │                    │ ──────────────────►│               │
│      │                     │                    │                    │               │
│      │                     │                    │  6. Key Found      │               │
│      │                     │                    │ ◄──────────────────│               │
│      │                     │                    │                    │               │
│      │                     │                    │  7. Init Transfer  │               │
│      │                     │                    │ ──────────────────►│               │
│      │                     │                    │                    │               │
│      │                     │                    │  8. ACK            │               │
│      │                     │                    │ ◄──────────────────│               │
│      │                     │                    │                    │               │
│      │                     │  9. Transaction ID │                    │               │
│      │                     │ ◄──────────────────│                    │               │
│      │                     │                    │                    │               │
│      │  10. Response       │                    │                    │               │
│      │ ◄─────────────────  │                    │                    │               │
│      │                     │                    │                    │               │
│      │                     │                    │  11. Webhook       │               │
│      │                     │                    │ ◄──────────────────│               │
│      │                     │                    │                    │               │
│      │  12. Push Notify    │                    │                    │               │
│      │ ◄─────────────────────────────────────────                    │               │
│      │                     │                    │                    │               │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture (Kubernetes)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         KUBERNETES DEPLOYMENT                                        │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│   ┌───────────────────────────────────────────────────────────────────────────┐     │
│   │                        Ingress Controller (NGINX)                          │     │
│   │                        • TLS Termination                                   │     │
│   │                        • Load Balancing                                    │     │
│   └───────────────────────────────────────────────────────────────────────────┘     │
│                                       │                                              │
│         ┌─────────────────────────────┼─────────────────────────────┐               │
│         ▼                             ▼                             ▼               │
│   ┌───────────────┐           ┌───────────────┐           ┌───────────────┐        │
│   │ athena-web    │           │ athena-admin  │           │ athena-api    │        │
│   │ Namespace     │           │ Namespace     │           │ Namespace     │        │
│   │               │           │               │           │               │        │
│   │ ┌───────────┐ │           │ ┌───────────┐ │           │ ┌───────────┐ │        │
│   │ │Web Client │ │           │ │Admin Portal│ │           │ │API Gateway│ │        │
│   │ │ (3 pods)  │ │           │ │ (2 pods)  │ │           │ │ (3 pods)  │ │        │
│   │ └───────────┘ │           │ └───────────┘ │           │ └───────────┘ │        │
│   └───────────────┘           └───────────────┘           └───────┬───────┘        │
│                                                                   │                 │
│   ┌─────────────────────────────────────────────────────────────────────────────┐   │
│   │                          athena-services Namespace                           │   │
│   │                                                                               │   │
│   │   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐             │   │
│   │   │Accounts │ │   PIX   │ │  Cards  │ │ Payments│ │  Loans  │             │   │
│   │   │(3 pods) │ │(5 pods) │ │(3 pods) │ │(3 pods) │ │(2 pods) │             │   │
│   │   │ HPA     │ │ HPA     │ │ HPA     │ │ HPA     │ │ HPA     │             │   │
│   │   └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘             │   │
│   │                                                                               │   │
│   │   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐             │   │
│   │   │   KYC   │ │Compliance│ │  LGPD   │ │ Rewards │ │FX/Crypto│             │   │
│   │   │(2 pods) │ │(2 pods) │ │(2 pods) │ │(2 pods) │ │(2 pods) │             │   │
│   │   └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘             │   │
│   └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                       │
│   ┌─────────────────────────────────────────────────────────────────────────────┐   │
│   │                          athena-data Namespace                               │   │
│   │   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐                      │   │
│   │   │ PostgreSQL  │   │    Redis    │   │    Kafka    │                      │   │
│   │   │ (StatefulSet│   │ (StatefulSet│   │ (StatefulSet│                      │   │
│   │   │  3 replicas)│   │  3 replicas)│   │  3 brokers) │                      │   │
│   │   └─────────────┘   └─────────────┘   └─────────────┘                      │   │
│   └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## References

- [C4 Model](https://c4model.com/)
- [PlantUML C4 Library](https://github.com/plantuml-stdlib/C4-PlantUML)
- [BACEN PIX Documentation](https://www.bcb.gov.br/estabilidadefinanceira/pix)
- [LGPD](https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd)

---

*Last Updated: January 2026*
*Version: 1.0*
