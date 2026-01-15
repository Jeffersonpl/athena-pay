# Checklist de Homologação
- [ ] Importar realm do Keycloak (users/roles/clients).
- [ ] Subir compose HML (`docker-compose.hml.yml`) com `ENV=hml` (KYC obrigatório).
- [ ] Configurar callbacks de PIX no `pix-service` (/pix/webhook).
- [ ] Testes: criar conta, gerar PIX, simular webhook, TED/DOC (initiate + settle), baixar extrato com token.
- [ ] Observabilidade: logs, p95/p99, alertas (base grafana incluída).
