
Aurora patch aplicado automaticamente.

Alterações principais:
- apps/web-client/src/api/client.ts : cliente HTTP resiliente, fallbacks, sem throws em 404.
- apps/web-client/src/pages/Dashboard.tsx : saldo seguro (corrente/poupança), cartões e PIX com defaults.
- apps/*/src/ui/useTheme.ts : hook com named export (useTheme).
- apps/admin-web/src/pages/Console.tsx : import corrigido do tema.

Seu fluxo de autenticação não foi alterado.
