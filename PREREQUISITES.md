# Pré-requisitos e Desempenho

## Dependências de Sistema

### Runtime

| Dependência | Versão Mínima | Verificação |
|------------|---------------|-------------|
| **Node.js** | `>=18.0.0` (recomendado `>=20 LTS`) | `node --version` |
| **npm** | `>=9.0.0` (incluso com Node) | `npm --version` |

### Banco de Dados

| Dependência | Versão Mínima | Verificação |
|------------|---------------|-------------|
| **PostgreSQL** | `>=14.0` | `psql --version` |

### Ferramentas de Deploy (Produção)

| Ferramenta | Função | Instalação |
|-----------|--------|-----------|
| **PM2** | Gerenciador de processos Node.js em produção | `npm install -g pm2` |
| **Nginx** | Servidor web / proxy reverso | `apt install nginx` |
| **Certbot** | Certificado SSL/TLS gratuito (Let's Encrypt) | `apt install certbot python3-certbot-nginx` |

### Ferramentas Opcionais

| Ferramenta | Função |
|-----------|--------|
| **Git** | Controle de versão e deploy via `git pull` |
| **SSH** | Acesso remoto ao servidor de produção |
| **curl** | Testes de endpoints diretamente no servidor |

---

## Dependências do Projeto (npm)

### Backend — Dependências de Produção (13 pacotes)

| Pacote | Versão | Categoria |
|--------|--------|-----------|
| `@nestjs/common` | `^11.0.1` | Framework Core |
| `@nestjs/core` | `^11.0.1` | Framework Core |
| `@nestjs/platform-express` | `^11.0.1` | Adaptador HTTP |
| `@nestjs/config` | `^4.0.3` | Configuração / .env |
| `@nestjs/typeorm` | `^11.0.0` | Integração TypeORM |
| `@nestjs/jwt` | `^11.0.2` | Autenticação JWT |
| `@nestjs/passport` | `^11.0.5` | Autenticação Passport |
| `typeorm` | `^0.3.28` | ORM |
| `pg` | `^8.18.0` | Driver PostgreSQL |
| `passport` | `^0.7.0` | Middleware de autenticação |
| `passport-jwt` | `^4.0.1` | Estratégia JWT |
| `bcryptjs` | `^3.0.3` | Hash de senhas |
| `class-validator` | `^0.14.3` | Validação de DTOs |
| `class-transformer` | `^0.5.1` | Transformação de objetos |
| `reflect-metadata` | `^0.2.2` | Metadados para decoradores |
| `rxjs` | `^7.8.1` | Programação reativa (NestJS) |

### Backend — Dependências de Desenvolvimento (18 pacotes)

| Pacote | Versão | Categoria |
|--------|--------|-----------|
| `@nestjs/cli` | `^11.0.0` | CLI de geração e build |
| `@nestjs/schematics` | `^11.0.0` | Schematics de scaffolding |
| `@nestjs/testing` | `^11.0.1` | Módulo de testes |
| `typescript` | `^5.7.3` | Compilador TypeScript |
| `ts-node` | `^10.9.2` | Execução TypeScript sem build |
| `ts-jest` | `^29.2.5` | Transformador Jest p/ TypeScript |
| `ts-loader` | `^9.5.2` | Loader Webpack p/ TypeScript |
| `tsconfig-paths` | `^4.2.0` | Resolução de path aliases |
| `jest` | `^30.0.0` | Framework de testes |
| `supertest` | `^7.0.0` | Testes HTTP |
| `eslint` | `^9.18.0` | Linter |
| `prettier` | `^3.4.2` | Formatador |
| `eslint-config-prettier` | `^10.0.1` | Integração ESLint/Prettier |
| `eslint-plugin-prettier` | `^5.2.2` | Plugin Prettier para ESLint |
| `source-map-support` | `^0.5.21` | Source maps em runtime |
| `@types/express` | `^5.0.0` | Tipagens Express |
| `@types/jest` | `^30.0.0` | Tipagens Jest |
| `@types/node` | `^22.10.7` | Tipagens Node.js |

### Frontend — Dependências de Produção (7 pacotes)

| Pacote | Versão |
|--------|--------|
| `react` | `^19.2.4` |
| `react-dom` | `^19.2.4` |
| `react-router-dom` | `^7.13.1` |
| `react-markdown` | `^10.1.0` |
| `remark-gfm` | `^4.0.1` |
| `rehype-raw` | `^7.0.0` |
| `rehype-sanitize` | `^6.0.0` |

### Frontend — Dependências de Desenvolvimento (8 pacotes)

| Pacote | Versão |
|--------|--------|
| `vite` | `^8.0.0` |
| `@vitejs/plugin-react` | `^6.0.0` |
| `eslint` | `^9.39.4` |
| `@eslint/js` | `^9.39.4` |
| `eslint-plugin-react-hooks` | `^7.0.1` |
| `eslint-plugin-react-refresh` | `^0.5.2` |
| `globals` | `^17.4.0` |
| `@types/react` | `^19.2.14` |

---

## Hardware Sugerido

### Desenvolvimento Local

| Recurso | Mínimo | Recomendado |
|---------|--------|-------------|
| **RAM** | 4 GB | 8 GB |
| **CPU** | 2 cores | 4 cores |
| **Disco** | 2 GB livres (projeto + `node_modules`) | 5 GB livres |
| **SO** | Linux, macOS ou Windows (com WSL2) | Ubuntu 22.04+ |

### Servidor de Produção (VPS)

| Recurso | Mínimo | Recomendado |
|---------|--------|-------------|
| **RAM** | 2 GB | 4 GB |
| **CPU** | 1 vCPU | 2 vCPU |
| **Disco** | 20 GB SSD | 40 GB SSD |
| **SO** | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |
| **Rede** | Porta 80 (HTTP) e 22 (SSH) liberadas | Portas 80, 443, 22 |

### Portas Utilizadas

| Porta | Serviço | Ambiente |
|-------|---------|----------|
| `5173` | Vite Dev Server (frontend) | Desenvolvimento |
| `4000` (ou `PORT`) | NestJS API (backend) | Desenvolvimento |
| `3000` | NestJS API (backend) | Produção (PM2) |
| `5432` | PostgreSQL | Ambos |
| `80` | Nginx (HTTP) | Produção |
| `443` | Nginx (HTTPS) | Produção |
