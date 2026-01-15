# Athena Pay - Security Remediation Report

**Data:** 2025-01-15
**Status:** ✅ CONCLUÍDO

---

## Resumo Executivo

Todas as vulnerabilidades críticas, altas e médias identificadas na auditoria de segurança foram remediadas.

| Prioridade | Total | Resolvidos | Status |
|------------|-------|------------|--------|
| P0 (Crítico) | 3 | 3 | ✅ |
| P1 (Alto) | 3 | 3 | ✅ |
| P2 (Médio) | 1 | 1 | ✅ |
| **Total** | **7** | **7** | **✅ 100%** |

---

## Correções Implementadas

### ✅ SEC-001: Outbox Pattern para Transações Distribuídas

**Arquivo:** `services/shared/aurora_shared/infrastructure/outbox.py`

**Implementação:**
- Tabela `outbox_events` para armazenar eventos na mesma transação
- Status: PENDING → PROCESSING → PUBLISHED / FAILED / DEAD_LETTER
- Retry automático com backoff exponencial
- Dead letter queue para eventos que falharam todas as tentativas
- Migration incluída para PIX Service

**Uso:**
```python
async with OutboxManager(session) as outbox:
    session.add(pix_transaction)
    await outbox.add_event(
        aggregate_type="PIX_TRANSACTION",
        aggregate_id=pix_transaction.id,
        event_type="PIX_CREATED",
        payload={"amount": 100}
    )
# Ambos commitados ou rollback juntos
```

---

### ✅ SEC-002: CORS Restritivo no API Gateway

**Arquivo:** `services/api-gateway/app/main.py`

**Antes:**
```python
allow_origins=["*"]  # INSEGURO
```

**Depois:**
```python
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:5174,https://app.athenapay.com.br"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
    max_age=600,
)
```

---

### ✅ SEC-003: Módulo LGPD Completo

**Arquivo:** `services/lgpd-service/app/main.py`

**Endpoints implementados (Art. 18 LGPD):**

| Endpoint | Art. | Descrição |
|----------|------|-----------|
| `GET /v1/users/{id}/data` | 18, II | Acesso aos dados pessoais |
| `GET /v1/users/{id}/data-export` | 18, V | Portabilidade (JSON/ZIP) |
| `POST /v1/users/{id}/anonymize` | 18, IV | Anonimização |
| `DELETE /v1/users/{id}/data` | 18, VI | Direito ao esquecimento |
| `GET /v1/users/{id}/consent` | 18, VIII | Listar consentimentos |
| `POST /v1/users/{id}/consent` | 18, VIII | Conceder consentimento |
| `DELETE /v1/users/{id}/consent/{purpose}` | 18, IX | Revogar consentimento |
| `GET /v1/users/{id}/processing` | 18, VII | Atividades de tratamento |
| `POST /v1/users/{id}/rectification` | 18, III | Correção de dados |
| `GET /v1/dpo` | - | Contato do DPO |

---

### ✅ SEC-004: Rate Limiting no API Gateway

**Arquivo:** `services/api-gateway/app/main.py`

**Implementação:**
- Sliding Window Algorithm via Redis
- 60 requests/minuto por IP
- Headers de rate limit na resposta:
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
  - `Retry-After` (quando bloqueado)

---

### ✅ SEC-005: KMS para Master Key

**Arquivo:** `services/shared/aurora_shared/security/kms.py`

**Providers suportados:**
- AWS KMS (produção)
- HashiCorp Vault (produção)
- Azure Key Vault (produção)
- Local (apenas desenvolvimento)

**Uso:**
```python
from aurora_shared.security.kms import encrypt_sensitive_data, decrypt_sensitive_data

encrypted = await encrypt_sensitive_data("dados sensíveis", "key-id")
decrypted = await decrypt_sensitive_data(encrypted, "key-id")
```

**Configuração:**
```bash
# AWS
KMS_PROVIDER=aws
AWS_REGION=us-east-1
AWS_KMS_KEY_ID=arn:aws:kms:...

# Vault
KMS_PROVIDER=vault
VAULT_ADDR=https://vault.athenapay.com.br
VAULT_TOKEN=hvs.xxx
```

---

### ✅ SEC-006: DDoS Detection

**Arquivo:** `services/api-gateway/app/main.py`

**Implementação:**
- Detecção de padrões de ataque (100+ requests em 10 segundos)
- Blacklist automático por 30 minutos
- Logging de IPs suspeitos
- Identificador único por IP + User-Agent hash

---

### ✅ SEC-007: Salt Dinâmico na Criptografia

**Arquivo:** `services/shared/crypto.py`

**Antes:**
```python
salt = b'athena_salt_v1'  # FIXO - INSEGURO
```

**Depois:**
```python
def _generate_salt() -> bytes:
    return secrets.token_bytes(16)  # Único por registro

# Formato: v2:<salt>:<nonce>:<ciphertext>
```

**Compatibilidade:**
- Suporte a v1 (legacy) para dados existentes
- Função `reencrypt_v1_to_v2()` para migração

---

## Arquivos Criados/Modificados

### Novos Arquivos:
1. `services/shared/aurora_shared/infrastructure/outbox.py`
2. `services/shared/aurora_shared/security/kms.py`
3. `services/lgpd-service/app/main.py`
4. `services/lgpd-service/Dockerfile`
5. `services/pix-service/migrations/versions/002_add_outbox_table.py`
6. `docs/SECURITY_AUDIT.md`
7. `docs/SECURITY_REMEDIATION.md`

### Arquivos Modificados:
1. `services/api-gateway/app/main.py` - CORS, Rate Limiting, DDoS, Security Headers
2. `services/shared/crypto.py` - Salt dinâmico, máscaras de PII
3. `docker-compose.yml` - Adicionado LGPD Service
4. `docker-compose.dev.yml` - Adicionado LGPD Service e Redis
5. `infra/postgres/init.sql` - Tabelas outbox_events e LGPD
6. `infra/nginx/nginx.conf` - Rotas LGPD e Security Headers

### Infraestrutura Kubernetes:
1. `infra/k8s/lgpd-service.yaml` - Deployment, Service, HPA, PDB, NetworkPolicy
2. `infra/k8s/api-gateway.yaml` - Deployment com configs de segurança
3. `infra/k8s/redis.yaml` - StatefulSet para Rate Limiting e DDoS

---

## Security Headers Adicionados

```python
SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "Content-Security-Policy": "default-src 'self'; frame-ancestors 'none'",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Cache-Control": "no-store, no-cache, must-revalidate",
    "Pragma": "no-cache",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
}
```

---

## Próximos Passos Recomendados

### ✅ Concluído:
1. ~~**Deploy do LGPD Service** - Adicionar ao docker-compose e Kubernetes~~ ✅
2. ~~**Configurar Infraestrutura K8s** - Manifests criados em `infra/k8s/`~~ ✅

### Pendente (Produção):
1. **Executar Migration** - `alembic upgrade head` no PIX Service
2. **Configurar KMS** - Escolher provider (AWS/Vault/Azure) para produção
3. **Migrar dados v1→v2** - Executar `reencrypt_v1_to_v2()` em dados existentes
4. **Configurar Alertas** - Dead letter queue, rate limit violations
5. **Penetration Test** - Validar correções com teste de intrusão
6. **Deploy K8s** - `kubectl apply -f infra/k8s/`

---

## Verificação

### Docker Compose (Desenvolvimento)

```bash
# 1. Build dos serviços
docker compose -f docker-compose.dev.yml build api-gateway lgpd-service

# 2. Subir os serviços
docker compose -f docker-compose.dev.yml up -d

# 3. Testar CORS
curl -i -X OPTIONS http://localhost:8080/health \
  -H "Origin: https://malicious-site.com" \
  -H "Access-Control-Request-Method: GET"
# Deve retornar sem Access-Control-Allow-Origin

# 4. Testar Rate Limiting
for i in {1..100}; do curl -s http://localhost:8080/health; done
# Após 60 requests, deve retornar 429 Too Many Requests

# 5. Testar LGPD
curl http://localhost:8005/v1/users/user-123/data
curl http://localhost:8005/v1/users/user-123/consent
curl http://localhost:8005/v1/dpo
```

### Kubernetes (Produção)

```bash
# 1. Aplicar manifests
kubectl apply -f infra/k8s/redis.yaml
kubectl apply -f infra/k8s/lgpd-service.yaml
kubectl apply -f infra/k8s/api-gateway.yaml

# 2. Verificar pods
kubectl get pods -n athena-pay

# 3. Verificar logs
kubectl logs -l app=lgpd-service -n athena-pay
kubectl logs -l app=api-gateway -n athena-pay

# 4. Testar endpoint
kubectl port-forward svc/lgpd-service 8005:8080 -n athena-pay
curl http://localhost:8005/v1/dpo
```

---

## Assinaturas

| Papel | Nome | Data |
|-------|------|------|
| Desenvolvedor | | 2025-01-15 |
| Security Review | | |
| QA Validation | | |
