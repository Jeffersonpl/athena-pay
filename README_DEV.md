
# AthenaPay — Dev Compose

## Subir
```bash
docker compose -f docker-compose.dev.yml up -d --build --force-recreate
```

### Endpoints
- Web:   http://localhost:5174
- Admin: http://localhost:5173
- API:   http://localhost:8080
- KC:    http://localhost:8081
- Cards: http://localhost:9084
- Config:http://localhost:9085

### Testes rápidos
- Keycloak: realm `athena`, user `demo@athena` / `demo`
- /health: `http://localhost:8082/health`, `http://localhost:9084/health`, `http://localhost:9085/health`

> Compose não usa mais `dockerfile_inline` com heredoc, evitando o erro `yaml: could not find expected ':'`.
