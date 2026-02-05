# 🏦 Athena Pay

**Plataforma Fintech Open Source para criação de bancos digitais e instituições de pagamento.**

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Commercial License](https://img.shields.io/badge/License-Commercial-green.svg)](#licença-comercial)

---

## 📋 Sobre o Projeto

Athena Pay é uma solução completa de infraestrutura fintech, desenvolvida com arquitetura de microserviços, que permite a criação de bancos digitais, fintechs e instituições de pagamento.

O projeto nasceu da experiência prática de mais de 29 anos em desenvolvimento de software, com foco em escalabilidade, segurança e conformidade regulatória.

---

## 🚀 Features

### Core Banking
- ✅ Gestão de contas digitais
- ✅ Transferências (TED, PIX, P2P)
- ✅ Gestão de cartões
- ✅ Extrato e histórico de transações
- ✅ Conciliação bancária

### Pagamentos
- ✅ Gateway de pagamentos
- ✅ Boletos
- ✅ PIX (QR Code, Copia e Cola)
- ✅ Cartão de crédito/débito
- ✅ Split de pagamentos

### Segurança
- ✅ Autenticação multi-fator (MFA)
- ✅ Criptografia end-to-end
- ✅ Tokenização de dados sensíveis
- ✅ Audit logs
- ✅ Fraud detection

### Compliance
- ✅ KYC (Know Your Customer)
- ✅ AML (Anti-Money Laundering)
- ✅ PLD/FT
- ✅ LGPD ready
- ✅ PCI-DSS guidelines

### Infraestrutura
- ✅ Arquitetura de microserviços
- ✅ API RESTful
- ✅ Webhooks
- ✅ Event-driven architecture
- ✅ Horizontal scaling

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                        ATHENA PAY                                │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  Frontend   │  │  Mobile API │  │  WebPanel   │             │
│  │   (Apps)    │  │             │  │     API     │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         │                │                │                     │
│         └────────────────┼────────────────┘                     │
│                          ▼                                      │
│              ┌───────────────────────┐                          │
│              │     API Gateway       │                          │
│              │   (Authentication)    │                          │
│              └───────────┬───────────┘                          │
│                          ▼                                      │
│              ┌───────────────────────┐                          │
│              │     Athena Core       │                          │
│              │   (Business Logic)    │                          │
│              └───────────┬───────────┘                          │
│                          │                                      │
│    ┌─────────┬─────────┬─┴───────┬─────────┬─────────┐        │
│    ▼         ▼         ▼         ▼         ▼         ▼        │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        │
│ │Account│ │Payment│ │ Card │ │ KYC  │ │Notif.│ │Audit │        │
│ │Service│ │Service│ │Service│ │Service│ │Service│ │ Log  │        │
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Camada | Tecnologias |
|--------|-------------|
| **Backend** | Java 21, Spring Boot 3.x, Spring Security, Spring Cloud |
| **Mensageria** | Apache Kafka, RabbitMQ |
| **Database** | PostgreSQL, Redis, MongoDB |
| **Infraestrutura** | Docker, Kubernetes, AWS/GCP |
| **Monitoramento** | Prometheus, Grafana, ELK Stack |
| **CI/CD** | GitHub Actions, ArgoCD |

---

## 📦 Instalação

### Pré-requisitos

- Java 21+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+
- Kafka (opcional para produção)

### Quick Start

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/athena-pay.git
cd athena-pay

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# Suba os serviços com Docker Compose
docker-compose up -d

# Acesse a documentação da API
open http://localhost:8080/swagger-ui.html
```

### Configuração Manual

```bash
# Build do projeto
./mvnw clean install

# Execute cada serviço
java -jar athena-core/target/athena-core.jar
java -jar account-service/target/account-service.jar
java -jar payment-service/target/payment-service.jar
# ... demais serviços
```

---

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| [API Reference](docs/api-reference.md) | Documentação completa da API |
| [Architecture](docs/architecture.md) | Decisões arquiteturais |
| [Security](docs/security.md) | Práticas de segurança |
| [Deployment](docs/deployment.md) | Guia de deploy |
| [Contributing](CONTRIBUTING.md) | Como contribuir |

---

## ⚖️ Licenciamento

Este projeto utiliza **licenciamento dual**:

### 🆓 Licença Open Source (AGPL v3)

O Athena Pay é disponibilizado sob a licença **GNU Affero General Public License v3.0 (AGPL-3.0)**.

Isso significa que você pode:
- ✅ Usar para estudo e aprendizado
- ✅ Usar em projetos pessoais
- ✅ Modificar o código
- ✅ Distribuir suas modificações

**Com as seguintes condições:**
- ⚠️ Se você modificar e disponibilizar como serviço (SaaS), **deve abrir seu código fonte**
- ⚠️ Deve manter os avisos de copyright
- ⚠️ Deve licenciar trabalhos derivados sob AGPL v3

### 💼 Licença Comercial

Se você deseja usar o Athena Pay comercialmente **sem a obrigação de abrir seu código fonte**, oferecemos uma licença comercial.

**A licença comercial é indicada para:**
- Empresas que não desejam abrir seu código
- Fintechs e bancos digitais em produção
- White-label solutions
- SaaS comercial

**Entre em contato para licenciamento comercial:**
- 📧 Email: [seu-email@dominio.com]
- 💼 LinkedIn: [seu-linkedin]

---

## ⚠️ DISCLAIMER - AVISO LEGAL IMPORTANTE

### Isenção de Responsabilidade

```
ESTE SOFTWARE É FORNECIDO "COMO ESTÁ", SEM GARANTIA DE QUALQUER TIPO, 
EXPRESSA OU IMPLÍCITA, INCLUINDO, MAS NÃO SE LIMITANDO ÀS GARANTIAS 
DE COMERCIALIZAÇÃO, ADEQUAÇÃO A UM PROPÓSITO ESPECÍFICO E NÃO VIOLAÇÃO.
```

### Responsabilidades do Usuário

Ao utilizar o Athena Pay, você reconhece e concorda que:

1. **Compliance Regulatório**: É de **SUA TOTAL RESPONSABILIDADE** garantir conformidade com:
   - Regulamentações do Banco Central do Brasil (BACEN)
   - Lei Geral de Proteção de Dados (LGPD)
   - Normas PCI-DSS para dados de cartão
   - Normas de Prevenção à Lavagem de Dinheiro (PLD/FT)
   - Demais regulamentações aplicáveis à sua jurisdição

2. **Licenças e Autorizações**: A operação de instituições financeiras ou de pagamento requer **licenças específicas** junto aos órgãos reguladores. Este software **NÃO CONCEDE** tais licenças.

3. **Segurança**: Você é responsável por:
   - Implementar medidas de segurança adequadas
   - Proteger dados sensíveis dos usuários
   - Realizar auditorias de segurança
   - Manter o software atualizado

4. **Integrações Externas**: Integrações com sistemas bancários (PIX, TED, SPB) requerem:
   - Homologação junto ao Banco Central
   - Certificados digitais válidos
   - Contratos com instituições participantes

5. **Não Responsabilidade**: Os autores e mantenedores deste projeto **NÃO SÃO RESPONSÁVEIS** por:
   - Perdas financeiras
   - Vazamento de dados
   - Uso indevido do software
   - Multas ou penalidades regulatórias
   - Danos diretos ou indiretos decorrentes do uso

### Uso em Ambiente de Produção

⚠️ **ATENÇÃO**: Antes de utilizar em produção, você **DEVE**:

- [ ] Realizar auditoria completa de segurança
- [ ] Implementar testes de penetração
- [ ] Contratar consultoria jurídica especializada
- [ ] Obter as licenças necessárias junto ao BACEN
- [ ] Implementar política de backup e disaster recovery
- [ ] Contratar seguro de responsabilidade civil
- [ ] Estabelecer processo de gestão de incidentes

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia nosso [Guia de Contribuição](CONTRIBUTING.md) antes de submeter um PR.

### Como Contribuir

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Code of Conduct

Este projeto adota um Código de Conduta. Ao participar, você concorda em respeitar seus termos.

---

## 🙏 Agradecimentos

- Comunidade Open Source
- Todos os contribuidores

---

## 📞 Contato

- **Autor**: Jefferson Pereira
- **LinkedIn**: [seu-linkedin]
- **Email**: [seu-email]

---

## 📈 Roadmap

- [ ] Suporte a Open Banking Brasil
- [ ] Módulo de Investimentos
- [ ] Integração com CIP
- [ ] Módulo de Câmbio
- [ ] App Mobile (React Native)
- [ ] Dashboard Analytics

---

<p align="center">
  Feito com ❤️ para a comunidade fintech brasileira
</p>

<p align="center">
  <sub>Se este projeto te ajudou, considere dar uma ⭐️</sub>
</p>
