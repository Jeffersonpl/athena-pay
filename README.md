# AthenaPay — Grand Finale (DEV + HML + PROD-ready)

Este pacote reúne **todo o projeto** com ambientes **DEV**, **HML (homologação)** e **base para PROD**:
- Micros FastAPI (contas, pagamentos, PIX, TED/DOC, extrato, KYC, etc.)
- Web (React) + Admin (React) + Mobile (Expo RN) **com login Keycloak** e telas de **PIX**, **TED/DOC**, **KYC** e **Extrato**.
- Keycloak (realm com papéis + usuários), Traefik (base), Charts Helm por serviço, templates de Secrets (SOPS/SealedSecrets), OPA/NetworkPolicies, Grafana dashboards (base) e CI/CD (templates).
- **Toggle de KYC**: DEV pula validação; HML/PROD exigem submissão de documentos e verificação de face via provedor externo (interface pronta).

> Observação: Integrações com PSP/adquirentes reais exigem credenciais e homologação; todos fluxos aqui estão **prontos para plugar** e possuem **stubs** para HML.

## Subir DEV
```bash
cp .env.example .env
docker compose -f docker-compose.dev.yml up -d --build
```
- Web:   http://localhost:5174
- Admin: http://localhost:5173
- Keycloak: http://localhost:8081
- Extrato: `GET http://localhost:9091/accounts/<acc-id>/statement.pdf` com Bearer

## Subir HML (homologação)
```bash
cp envs/hml/.env.hml .env
docker compose -f docker-compose.hml.yml up -d --build
```
- Mesma estrutura de portas, mas com `ENV=hml` **(KYC obrigatório)** e Traefik com rate-limit ligado.

## Produção (Kubernetes/Rancher)
- Ajuste `envs/prod/*.yaml` e **Secrets**. Faça `helm upgrade --install` por serviço com `charts/<svc>`.
- Ative TLS (cert-manager), rate-limit, OPA/NP e Argo Rollouts.
- Configure provedores reais: PIX/Boleto/Cartões/WhatsApp, KYC (face match), Coinbase Commerce.

## Usuários (Keycloak)
- `admin1 / Passw0rd!` (roles: cto,user)
- `user1  / Passw0rd!` (roles: user)

## Novidades (Grand Finale + UX real de banco)
- **Web** com abas: Resumo, **Contas (saldo, extrato, transferência)**, **Pagamentos**, **Cartões** (solicitar + virtual).
- **Admin**: gestão de **Temas** (cores por tipo de conta) e **Taxas**.
- **Accounts-service**: adicionados **transactions**, **/statement**, **/transfer**.
- **Card-service** (novo): emissão de cartão físico/virtual com **tokenização** (sem PAN).
- **Config-service** (novo): temas por conta (CRUD + associação).

### Mobile (novo)
- App **Expo/React Native** nativo: login PKCE, saldo/estrato/transferência, cartões e temas (gamer/nerd/teen/pj).
- Configuração em `apps/mobile/app.json > extra`.


## Dev local com Docker Compose
```bash
docker compose -f docker-compose.dev.yml up -d --build
# Web:   http://localhost:5174
# Admin: http://localhost:5173
# API:   http://localhost:8080
# KC:    http://localhost:8081
```
> Se você via adicionou blocos de serviço manualmente e viu `yaml: line N: did not find expected key`, é quase sempre **indentação** ou `volumes:` colocado no nível errado. No arquivo acima, `volumes:` fica **no topo** (sem recuo) após `services:`.

### Simuladores (dev real-fake)
- `pix-simulator` → `POST /pix/webhook` (simula liquidação).
- `acquirer-simulator` → `GET /reconcile-file` devolve CSV de conciliação.
Esses serviços existem **apenas em dev**; em produção você usa os provedores reais.
