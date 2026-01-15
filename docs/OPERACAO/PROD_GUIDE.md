# Guia de Produção (resumo)
1. **Kubernetes/Rancher**: `helm upgrade --install` por serviço, namespaces por ambiente.
2. **TLS**: cert-manager + Ingress com rate-limit por rota.
3. **Secrets**: SealedSecrets ou SOPS; chaves do PSP/PIX/Boleto/KYC/WhatsApp/Coinbase.
4. **KYC**: plugar provedor (Onfido/iProov/Zoom/FaceTech). `kyc-service` chama {KYC_PROVIDER_BASE}.
5. **PIX**: plugar PSP com Dict/DICT e webhooks reais; `pix-service` já possui endpoints e reconciliação de crédito.
6. **Cartões**: token vault do adquirente; nunca tocar PAN; 3DS e antifraude.
7. **Contabilidade/Impostos**: parametrizar na Admin; relatar DARF/REINF/ECD/ECF (módulos a expandir).
8. **COAF/AML**: motor de regras e alertas; relatar conforme normativos.
