# Prerequisites and Performance

## System Dependencies

### Runtime

| Dependency | Minimum Version | Verification |
|------------|----------------|--------------|
| **Node.js** | `>=18.0.0` (recommended `>=20 LTS`) | `node --version` |
| **npm** | `>=9.0.0` (included with Node) | `npm --version` |

### Database

| Dependency | Minimum Version | Verification |
|------------|----------------|--------------|
| **PostgreSQL** | `>=14.0` | `psql --version` |

### Deploy Tools (Production)

| Tool | Function | Installation |
|------|----------|-------------|
| **PM2** | Node.js process manager for production | `npm install -g pm2` |
| **Nginx** | Web server / reverse proxy | `apt install nginx` |
| **Certbot** | Free SSL/TLS certificate (Let's Encrypt) | `apt install certbot python3-certbot-nginx` |

### Optional Tools

| Tool | Function |
|------|----------|
| **Git** | Version control and deploy via `git pull` |
| **SSH** | Remote access to the production server |
| **curl** | Endpoint testing directly on the server |

---

## Project Dependencies (npm)

### Backend — Production Dependencies (13 packages)

| Package | Version | Category |
|---------|---------|----------|
| `@nestjs/common` | `^11.0.1` | Core Framework |
| `@nestjs/core` | `^11.0.1` | Core Framework |
| `@nestjs/platform-express` | `^11.0.1` | HTTP Adapter |
| `@nestjs/config` | `^4.0.3` | Configuration / .env |
| `@nestjs/typeorm` | `^11.0.0` | TypeORM Integration |
| `@nestjs/jwt` | `^11.0.2` | JWT Authentication |
| `@nestjs/passport` | `^11.0.5` | Passport Authentication |
| `typeorm` | `^0.3.28` | ORM |
| `pg` | `^8.18.0` | PostgreSQL Driver |
| `passport` | `^0.7.0` | Authentication Middleware |
| `passport-jwt` | `^4.0.1` | JWT Strategy |
| `bcryptjs` | `^3.0.3` | Password Hashing |
| `class-validator` | `^0.14.3` | DTO Validation |
| `class-transformer` | `^0.5.1` | Object Transformation |
| `reflect-metadata` | `^0.2.2` | Metadata for decorators |
| `rxjs` | `^7.8.1` | Reactive programming (NestJS) |

### Backend — Development Dependencies (18 packages)

| Package | Version | Category |
|---------|---------|----------|
| `@nestjs/cli` | `^11.0.0` | Generation and build CLI |
| `@nestjs/schematics` | `^11.0.0` | Scaffolding schematics |
| `@nestjs/testing` | `^11.0.1` | Testing module |
| `typescript` | `^5.7.3` | TypeScript compiler |
| `ts-node` | `^10.9.2` | TypeScript execution without build |
| `ts-jest` | `^29.2.5` | Jest transformer for TypeScript |
| `ts-loader` | `^9.5.2` | Webpack loader for TypeScript |
| `tsconfig-paths` | `^4.2.0` | Path alias resolution |
| `jest` | `^30.0.0` | Testing framework |
| `supertest` | `^7.0.0` | HTTP testing |
| `eslint` | `^9.18.0` | Linter |
| `prettier` | `^3.4.2` | Formatter |
| `eslint-config-prettier` | `^10.0.1` | ESLint/Prettier integration |
| `eslint-plugin-prettier` | `^5.2.2` | Prettier plugin for ESLint |
| `source-map-support` | `^0.5.21` | Source maps at runtime |
| `@types/express` | `^5.0.0` | Express typings |
| `@types/jest` | `^30.0.0` | Jest typings |
| `@types/node` | `^22.10.7` | Node.js typings |

### Frontend — Production Dependencies (7 packages)

| Package | Version |
|---------|---------|
| `react` | `^19.2.4` |
| `react-dom` | `^19.2.4` |
| `react-router-dom` | `^7.13.1` |
| `react-markdown` | `^10.1.0` |
| `remark-gfm` | `^4.0.1` |
| `rehype-raw` | `^7.0.0` |
| `rehype-sanitize` | `^6.0.0` |

### Frontend — Development Dependencies (8 packages)

| Package | Version |
|---------|---------|
| `vite` | `^8.0.0` |
| `@vitejs/plugin-react` | `^6.0.0` |
| `eslint` | `^9.39.4` |
| `@eslint/js` | `^9.39.4` |
| `eslint-plugin-react-hooks` | `^7.0.1` |
| `eslint-plugin-react-refresh` | `^0.5.2` |
| `globals` | `^17.4.0` |
| `@types/react` | `^19.2.14` |

---

## Suggested Hardware

### Local Development

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| **RAM** | 4 GB | 8 GB |
| **CPU** | 2 cores | 4 cores |
| **Disk** | 2 GB free (project + `node_modules`) | 5 GB free |
| **OS** | Linux, macOS, or Windows (with WSL2) | Ubuntu 22.04+ |

### Production Server (VPS)

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| **RAM** | 2 GB | 4 GB |
| **CPU** | 1 vCPU | 2 vCPU |
| **Disk** | 20 GB SSD | 40 GB SSD |
| **OS** | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |
| **Network** | Port 80 (HTTP) and 22 (SSH) open | Ports 80, 443, 22 |

### Ports Used

| Port | Service | Environment |
|------|---------|-------------|
| `5173` | Vite Dev Server (frontend) | Development |
| `4000` (or `PORT`) | NestJS API (backend) | Development |
| `3000` | NestJS API (backend) | Production (PM2) |
| `5432` | PostgreSQL | Both |
| `80` | Nginx (HTTP) | Production |
| `443` | Nginx (HTTPS) | Production |
