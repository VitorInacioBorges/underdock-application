# Execution Guide

## Local Setup

### 1. Clone the Repository

```bash
git clone git@github.com:YOUR_USER/auto-improvement-application.git
cd auto-improvement-application
```

### 2. Configure the Database

Make sure PostgreSQL is running and create the database:

```bash
psql -U postgres -c "CREATE DATABASE database_name;"
```

### 3. Configure Environment Variables

#### Backend

Copy the template and fill in with real values:

```bash
cd apps/backend
cp .env.test .env
```

Edit `apps/backend/.env`:

```env
# Database Variables
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=database_name

# Port
PORT=4000

# JWT Auth
JWT_SECRET_KEY=your_long_random_secret_key
JWT_EXPIRATION=24h
BCRYPT_SALT_ROUNDS=10
```

#### Frontend

Copy the template and fill in:

```bash
cd apps/frontend
cp .env.test .env
```

Edit `apps/frontend/.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

### 4. Install Dependencies

```bash
# Backend
cd apps/backend
npm install

# Frontend
cd apps/frontend
npm install
```

### 5. Run Migrations

```bash
cd apps/backend
npm run migration:run
```

### 6. Start in Development Mode

#### Backend (terminal 1)

```bash
cd apps/backend
npm run start:dev
```

The server starts at `http://localhost:4000` with hot-reload via `--watch`.

#### Frontend (terminal 2)

```bash
cd apps/frontend
npm run dev
```

Vite starts at `http://localhost:5173` with instant HMR.

---

## Available Scripts

### Backend (`apps/backend/package.json`)

| Script | Command | Description |
|--------|---------|-------------|
| `start` | `nest start` | Starts the server in production mode |
| `start:dev` | `nest start --watch` | Starts with hot-reload (development) |
| `start:debug` | `nest start --debug --watch` | Starts with debugger and hot-reload |
| `start:prod` | `node dist/main` | Starts from the compiled build |
| `build` | `nest build` | Compiles TypeScript to `dist/` |
| `test` | `jest` | Runs unit tests |
| `test:watch` | `jest --watch` | Tests in watch mode |
| `test:cov` | `jest --coverage` | Tests with coverage report |
| `test:debug` | `jest --runInBand` | Tests with debugger |
| `test:e2e` | `jest --config ...` | End-to-end tests |
| `lint` | `eslint ... --fix` | Lint with auto-fix |
| `format` | `prettier --write ...` | Code formatting |
| `migration:generate` | `typeorm-ts-node-commonjs migration:generate ...` | Generates automatic migration based on entity diff |
| `migration:create` | `typeorm-ts-node-commonjs migration:create ...` | Creates an empty manual migration |
| `migration:run` | `typeorm-ts-node-commonjs -d ... migration:run` | Runs pending migrations |
| `migration:revert` | `typeorm-ts-node-commonjs migration:revert -d ...` | Reverts the last migration |
| `migration:show` | `typeorm-ts-node-commonjs migration:show -d ...` | Lists migration status |

### Frontend (`apps/frontend/package.json`)

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Dev server with HMR |
| `build` | `vite build` | Production build to `dist/` |
| `preview` | `vite preview` | Local preview of the production build |
| `lint` | `eslint .` | Code lint |

---

## Migrations Workflow

### Generate Automatic Migration

When you change an ORM Entity (`*.orm-entity.ts`), generate the corresponding migration:

```bash
cd apps/backend
npm run migration:generate
```

This creates a file in `src/infrastructure/database/typeorm/migrations/` with the necessary SQL changes.

### Review and Execute

1. **Review** the generated file to ensure the changes are correct.
2. **Execute** the migration:

```bash
npm run migration:run
```

### Revert if Necessary

```bash
npm run migration:revert
```

---

## Deploy Strategy (Production)

### Server

The project is hosted on a **Contabo VPS** with **Ubuntu**, accessible via SSH.

### Production Build

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

### Port Exposure

| Port | Service | Description |
|------|---------|-------------|
| `80` | Nginx | Serves static frontend and reverse proxy to API |
| `443` | Nginx + Certbot | HTTPS (when domain is configured) |
| `3000` | PM2 (NestJS) | Backend API (internal, accessible only via proxy) |

### Nginx Configuration

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

> **IMPORTANT**: `proxy_pass` must be `http://127.0.0.1:3000` **without a trailing slash**. With a slash, Nginx removes the `/api/` prefix and NestJS returns 404.

### PM2 — Process Management

```bash
# Start
pm2 start dist/main.js --name fea-api

# Save processes
pm2 save

# Configure automatic startup
pm2 startup
# Copy and execute the command PM2 returns
pm2 save

# Monitor
pm2 status
pm2 logs fea-api
```

### Healthchecks

```bash
# Test backend directly
curl http://127.0.0.1:3000/api

# Test user route
curl -i -X POST http://127.0.0.1:3000/api/users \
  -H "Content-Type: application/json" -d '{}'
# Expected: validation error (400), not 404

# Test frontend via Nginx
curl http://localhost
```

---

## Routine Deploy

Copy-paste checklist for future deploys:

```bash
# 1. Access server
ssh root@SERVER_IP

# 2. Update code
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

# 5. Verification
pm2 status
curl http://127.0.0.1:3000/api
```
