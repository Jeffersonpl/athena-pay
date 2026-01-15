# Athena Mobile (Expo, RN)
- UX nativa (sem WebView), estilo banco: **tabs** (Início, Contas, Pagamentos, Cartões, Ajustes).
- **Login** com Keycloak (PKCE via `expo-auth-session`).
- **Contas**: saldo, extrato, transferência (`accounts-service`).
- **Cartões**: solicitar e criar **virtual** (`card-service`).
- **Temas**: gamer/nerd/teen/pj/neoGold; sincronia via `config-service`.

## Rodar
```bash
cd apps/mobile
npm i
npm start
# use app Expo Go ou simulador
```
Ajuste `app.json` → `extra` para seus endpoints.
