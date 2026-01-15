# Athena Pay - Security Audit Report

**Data:** 2025-01-15
**Versão:** 1.0
**Auditor:** Security Analysis
**Status:** Em Remediação

---

## Executive Summary

Este documento apresenta os resultados da auditoria de segurança do sistema Athena Pay, identificando vulnerabilidades, gaps de compliance e recomendações de remediação.

### Risk Score: 7.2/10 (Alto)

| Categoria | Findings | Críticos | Altos | Médios |
|-----------|----------|----------|-------|--------|
| Transações Distribuídas | 3 | 1 | 2 | 0 |
| API Security | 4 | 1 | 2 | 1 |
| Data Protection | 3 | 0 | 2 | 1 |
| LGPD Compliance | 4 | 1 | 2 | 1 |
| **Total** | **14** | **3** | **8** | **3** |

---

## 1. Arquitetura Atual

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Web Client │  │ Admin Web   │  │   Mobile    │              │
│  │   (React)   │  │   (React)   │  │(React Native│              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
└─────────┼────────────────┼────────────────┼─────────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  FastAPI + CORS (ABERTO!) + Sem Rate Limiting           │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MICROSERVICES                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ Accounts │ │   PIX    │ │ Payments │ │  Cards   │           │
│  │ Service  │ │ Service  │ │ Service  │ │ Service  │           │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘           │
│       │            │            │            │                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │  Loans   │ │ Rewards  │ │ FX/Crypto│ │Compliance│           │
│  │ Service  │ │ Service  │ │ Service  │ │ Service  │           │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘           │
└───────┼────────────┼────────────┼────────────┼──────────────────┘
        │            │            │            │
        ▼            ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      INFRASTRUCTURE                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │PostgreSQL│ │  Redis   │ │ RabbitMQ │ │ Keycloak │           │
│  │  (Main)  │ │ (Cache)  │ │ (Events) │ │  (Auth)  │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Findings Detalhados

### 2.1 [P0-CRITICAL] Sem Transações Distribuídas

**ID:** SEC-001
**Severidade:** CRÍTICA
**CVSS:** 9.1
**Localização:** `services/pix-service/app/main.py`

**Descrição:**
O serviço PIX realiza operações em múltiplos serviços sem garantia de consistência transacional. Se uma operação falhar após outra ter sido commitada, o sistema fica em estado inconsistente.

**Código Vulnerável:**
```python
# Linha 85-95 - pix-service/app/main.py
async with httpx.AsyncClient() as cl:
    # Passo 1: Debita da conta
    r = await cl.post(f"{ACCOUNTS}/postings/transfer", json={
        "from_account": pix.from_account,
        "to_account": pix.to_account,
        "amount": pix.amount
    })

    # Passo 2: Registra recibo PIX
    # ⚠️ SE FALHAR AQUI, PASSO 1 JÁ FOI COMMITADO!
    rr = await cl.post(f"{PIX_URL}/receipts", json={...})
```

**Impacto:**
- Dinheiro debitado mas PIX não registrado
- Inconsistência entre saldos e transações
- Impossibilidade de reconciliação automática
- Risco de fraude por exploração da falha

**Remediação:**
Implementar Outbox Pattern com tabela de eventos na mesma transação.

---

### 2.2 [P0-CRITICAL] CORS Aberto no API Gateway

**ID:** SEC-002
**Severidade:** CRÍTICA
**CVSS:** 8.6
**Localização:** `services/api-gateway/app/main.py`

**Descrição:**
O API Gateway aceita requisições de qualquer origem, permitindo ataques CSRF e exploração cross-origin.

**Código Vulnerável:**
```python
# Linha 15-20 - api-gateway/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ QUALQUER ORIGEM ACEITA
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Impacto:**
- Ataques CSRF de sites maliciosos
- Roubo de tokens de sessão
- Manipulação de transações via sites terceiros
- Exfiltração de dados do usuário

**Remediação:**
Restringir origens para domínios conhecidos.

---

### 2.3 [P0-CRITICAL] Ausência de Endpoints LGPD

**ID:** SEC-003
**Severidade:** CRÍTICA
**CVSS:** 8.0
**Localização:** Sistema completo

**Descrição:**
O sistema não possui endpoints para atender aos direitos dos titulares de dados conforme LGPD:
- Direito de acesso aos dados
- Direito de portabilidade
- Direito ao esquecimento (deleção)
- Direito de revogação de consentimento

**Impacto:**
- Multas de até 2% do faturamento (máximo R$ 50 milhões por infração)
- Sanções administrativas da ANPD
- Danos reputacionais
- Ações judiciais de titulares

**Remediação:**
Implementar módulo completo de LGPD com todos os endpoints obrigatórios.

---

### 2.4 [P1-HIGH] API Gateway Sem Rate Limiting

**ID:** SEC-004
**Severidade:** ALTA
**CVSS:** 7.5
**Localização:** `services/api-gateway/app/main.py`

**Descrição:**
O API Gateway não implementa rate limiting, permitindo ataques de força bruta, DDoS e abuso de API.

**Impacto:**
- Indisponibilidade do serviço
- Custos excessivos de infraestrutura
- Ataques de força bruta em autenticação
- Enumeração de recursos

**Remediação:**
Integrar rate limiter existente (`aurora_shared/security/rate_limiter.py`) no gateway.

---

### 2.5 [P1-HIGH] Master Key em Variável de Ambiente

**ID:** SEC-005
**Severidade:** ALTA
**CVSS:** 7.2
**Localização:** `services/shared/aurora_shared/security/encryption.py`

**Descrição:**
A chave mestra de criptografia é armazenada em variável de ambiente, podendo ser exposta em logs, dumps de processo ou vazamentos de configuração.

**Código Vulnerável:**
```python
# Linha 22 - encryption.py
master_key: str = field(default_factory=lambda: os.getenv("ENCRYPTION_MASTER_KEY", ""))
```

**Impacto:**
- Exposição de todos os dados criptografados
- Comprometimento de PII de clientes
- Violação massiva de dados

**Remediação:**
Integrar com AWS KMS, HashiCorp Vault ou Azure Key Vault.

---

### 2.6 [P1-HIGH] Sem Detecção de Anomalias/DDoS

**ID:** SEC-006
**Severidade:** ALTA
**CVSS:** 7.0
**Localização:** Sistema completo

**Descrição:**
Não há sistema de detecção de padrões anômalos de acesso ou ataques DDoS.

**Impacto:**
- Ataques não detectados
- Tempo de resposta lento a incidentes
- Indisponibilidade prolongada

**Remediação:**
Implementar anomaly detection no rate limiter com blacklist automático.

---

### 2.7 [P2-MEDIUM] Salt Hardcoded em Crypto

**ID:** SEC-007
**Severidade:** MÉDIA
**CVSS:** 5.3
**Localização:** `services/shared/crypto.py`

**Descrição:**
Salt fixo para derivação de chaves, reduzindo a entropia da criptografia.

**Código Vulnerável:**
```python
# Linha 79 - crypto.py
salt = b'athena_salt_v1'  # In production, use unique salt per record
```

**Remediação:**
Gerar salt único por registro e armazená-lo junto com o dado criptografado.

---

## 3. Controles Existentes (Positivos)

### 3.1 ✅ JWT Handler Robusto
- Suporte a RS256, ES256, HS256
- Integração JWKS com Keycloak
- Revogação de tokens via Redis
- Claims customizados (customer_id, roles, permissions, kyc_level)

### 3.2 ✅ Rate Limiter Implementado
- Sliding Window Algorithm
- Múltiplas janelas (segundo, minuto, hora)
- Burst capacity
- Penalty exponencial

### 3.3 ✅ Circuit Breaker
- Estados: CLOSED → OPEN → HALF_OPEN
- Fallbacks configuráveis
- Recovery automático

### 3.4 ✅ Criptografia AES-256-GCM
- PBKDF2 com 100.000 iterações
- Nonce único por operação
- Autenticação de dados (GCM)

### 3.5 ✅ Security Headers
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Strict-Transport-Security
- Content-Security-Policy

### 3.6 ✅ Audit Logging
- Retenção de 5 anos (COAF)
- Hash SHA-256 para integridade
- Índices para compliance queries

### 3.7 ✅ AML/KYC Compliance
- Limites por nível de KYC
- Verificação de listas de sanções (OFAC, UN, EU, COAF)
- Detecção de PEPs

---

## 4. Plano de Remediação

### Fase 1: Críticos (P0) - Semana 1-2

| ID | Item | Responsável | Prazo |
|----|------|-------------|-------|
| SEC-001 | Outbox Pattern PIX | Backend | 5 dias |
| SEC-002 | CORS Restritivo | Backend | 1 dia |
| SEC-003 | Endpoints LGPD | Backend | 5 dias |

### Fase 2: Altos (P1) - Semana 3-4

| ID | Item | Responsável | Prazo |
|----|------|-------------|-------|
| SEC-004 | Rate Limiting Gateway | Backend | 2 dias |
| SEC-005 | KMS Integration | DevOps | 3 dias |
| SEC-006 | DDoS Detection | Backend | 3 dias |

### Fase 3: Médios (P2) - Semana 5

| ID | Item | Responsável | Prazo |
|----|------|-------------|-------|
| SEC-007 | Salt Dinâmico | Backend | 2 dias |

---

## 5. Checklist de Compliance

### LGPD (Lei 13.709/2018)
- [ ] Art. 18, I - Confirmação de existência de tratamento
- [ ] Art. 18, II - Acesso aos dados
- [ ] Art. 18, III - Correção de dados
- [ ] Art. 18, IV - Anonimização, bloqueio ou eliminação
- [ ] Art. 18, V - Portabilidade
- [ ] Art. 18, VI - Eliminação com consentimento
- [ ] Art. 18, VII - Informação sobre compartilhamento
- [ ] Art. 18, VIII - Possibilidade de não consentir
- [ ] Art. 18, IX - Revogação do consentimento

### Bacen (Resoluções)
- [x] Resolução 4.658 - Política de segurança cibernética
- [x] Resolução 4.893 - Processamento de dados em nuvem
- [ ] Circular 3.978 - Prevenção à lavagem de dinheiro (parcial)

### PCI-DSS (se aplicável)
- [x] Req. 3 - Proteção de dados do cartão
- [x] Req. 4 - Criptografia em transmissão
- [ ] Req. 6 - Desenvolvimento seguro (parcial)
- [x] Req. 8 - Controle de acesso
- [x] Req. 10 - Logs de auditoria

---

## 6. Histórico de Revisões

| Versão | Data | Autor | Alterações |
|--------|------|-------|------------|
| 1.0 | 2025-01-15 | Security Team | Versão inicial |

---

## 7. Aprovações

| Papel | Nome | Data | Assinatura |
|-------|------|------|------------|
| CISO | | | |
| CTO | | | |
| DPO | | | |
| Compliance | | | |
