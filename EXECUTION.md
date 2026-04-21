# Guia de Execução

## Setup Local

### 1. Clonar o Repositório

```bash
git clone git@github.com:SEU_USUARIO/auto-improvement-application.git
cd auto-improvement-application
```

### 2. Configurar o Banco de Dados

Certifique-se de que o PostgreSQL está rodando e crie o banco:

```bash
psql -U postgres -c "CREATE DATABASE nome_do_banco;"
```

### 3. Configurar Variáveis de Ambiente

#### Backend

Copiar o template e preencher com valores reais:

```bash
cd apps/backend
cp .env.test .env
```

Editar `apps/backend/.env`:

```env
# Database Variables
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha
DB_DATABASE=nome_do_banco

# Port
PORT=4000

# JWT Auth
JWT_SECRET_KEY=sua_chave_secreta_longa_e_aleatoria
JWT_EXPIRATION=24h
BCRYPT_SALT_ROUNDS=10
```

#### Frontend

Copiar o template e preencher:

```bash
cd apps/frontend
cp .env.test .env
```

Editar `apps/frontend/.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

### 4. Instalar Dependências

```bash
# Backend
cd apps/backend
npm install

# Frontend
cd apps/frontend
npm install
```

### 5. Executar Migrations

```bash
cd apps/backend
npm run migration:run
```

### 6. Iniciar em Modo de Desenvolvimento

#### Backend (terminal 1)

```bash
cd apps/backend
npm run start:dev
```

O servidor inicia em `http://localhost:4000` com hot-reload via `--watch`.

#### Frontend (terminal 2)

```bash
cd apps/frontend
npm run dev
```

O Vite inicia em `http://localhost:5173` com HMR instantâneo.

---

## Scripts Disponíveis

### Backend (`apps/backend/package.json`)

| Script | Comando | Descrição |
|--------|---------|-----------|
| `start` | `nest start` | Inicia o servidor em modo produção |
| `start:dev` | `nest start --watch` | Inicia com hot-reload (desenvolvimento) |
| `start:debug` | `nest start --debug --watch` | Inicia com debugger e hot-reload |
| `start:prod` | `node dist/main` | Inicia a partir do build compilado |
| `build` | `nest build` | Compila TypeScript para `dist/` |
| `test` | `jest` | Executa testes unitários |
| `test:watch` | `jest --watch` | Testes em modo watch |
| `test:cov` | `jest --coverage` | Testes com relatório de cobertura |
| `test:debug` | `jest --runInBand` | Testes com debugger |
| `test:e2e` | `jest --config ...` | Testes end-to-end |
| `lint` | `eslint ... --fix` | Lint com auto-correção |
| `format` | `prettier --write ...` | Formatação de código |
| `migration:generate` | `typeorm-ts-node-commonjs migration:generate ...` | Gera migration automática baseada em diff das entities |
| `migration:create` | `typeorm-ts-node-commonjs migration:create ...` | Cria migration manual vazia |
| `migration:run` | `typeorm-ts-node-commonjs -d ... migration:run` | Executa migrations pendentes |
| `migration:revert` | `typeorm-ts-node-commonjs migration:revert -d ...` | Reverte última migration |
| `migration:show` | `typeorm-ts-node-commonjs migration:show -d ...` | Lista status das migrations |

### Frontend (`apps/frontend/package.json`)

| Script | Comando | Descrição |
|--------|---------|-----------|
| `dev` | `vite` | Dev server com HMR |
| `build` | `vite build` | Build de produção para `dist/` |
| `preview` | `vite preview` | Preview local do build de produção |
| `lint` | `eslint .` | Lint do código |

---

## Workflow de Migrations

### Gerar Migration Automática

Quando alterar uma ORM Entity (`*.orm-entity.ts`), gere a migration correspondente:

```bash
cd apps/backend
npm run migration:generate
```

Isso cria um arquivo em `src/infrastructure/database/typeorm/migrations/` com as alterações SQL necessárias.

### Revisar e Executar

1. **Revise** o arquivo gerado para garantir que as alterações estão corretas.
2. **Execute** a migration:

```bash
npm run migration:run
```

### Reverter se Necessário

```bash
npm run migration:revert
```

---

## Estratégia de Deploy (Produção)

### Servidor

O projeto está hospedado em uma **VPS Contabo** com **Ubuntu**, acessível via SSH.

### Build de Produção

#### Backend

```bash
cd /var/www/fea-dev/auto-improvement-application/apps/backend
npm install
npm run build
npm run migration:run
pm2 restart fea-api
```

#### Frontend

```bash
cd /var/www/fea-dev/auto-improvement-application/apps/frontend
npm install
npm run build
systemctl reload nginx
```

### Exposição de Portas

| Porta | Serviço | Descrição |
|-------|---------|-----------|
| `80` | Nginx | Serve frontend estático e proxy reverso para API |
| `443` | Nginx + Certbot | HTTPS (quando domínio configurado) |
| `3000` | PM2 (NestJS) | Backend API (interno, acessível apenas via proxy) |

### Configuração Nginx

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    root /var/www/fea-dev/auto-improvement-application/apps/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

> **IMPORTANTE**: `proxy_pass` deve ser `http://127.0.0.1:3000` **sem barra final**. Com barra, o Nginx remove o prefixo `/api/` e o NestJS retorna 404.

### PM2 — Gerenciamento de Processo

```bash
# Iniciar
pm2 start dist/main.js --name fea-api

# Salvar processos
pm2 save

# Configurar startup automático
pm2 startup
# Copie e execute o comando que o PM2 retornar
pm2 save

# Monitorar
pm2 status
pm2 logs fea-api
```

### Healthchecks

```bash
# Testar backend diretamente
curl http://127.0.0.1:3000/api

# Testar rota de usuários
curl -i -X POST http://127.0.0.1:3000/api/users \
  -H "Content-Type: application/json" -d '{}'
# Esperado: erro de validação (400), não 404

# Testar frontend via Nginx
curl http://localhost
```

---

## Deploy de Rotina

Checklist copy-paste para deploys futuros:

```bash
# 1. Acessar servidor
ssh root@IP_DO_SERVIDOR

# 2. Atualizar código
cd /var/www/fea-dev/auto-improvement-application
git pull

# 3. Deploy backend
cd apps/backend
npm install
npm run build
npm run migration:run
pm2 restart fea-api

# 4. Deploy frontend
cd ../frontend
npm install
npm run build
systemctl reload nginx

# 5. Verificação
pm2 status
curl http://127.0.0.1:3000/api
```
