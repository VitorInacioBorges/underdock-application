# Methodologies and Technologies

## Main Stack

### Backend

| Technology | Version | Function |
|-----------|---------|----------|
| **Node.js** | JavaScript Runtime | Server-side execution environment |
| **TypeScript** | `^5.7.3` | Static typing for compile-time safety |
| **NestJS** | `^11.0.1` | Opinionated framework for REST APIs with native DI |
| **TypeORM** | `^0.3.28` | ORM with support for migrations, decorators, and repositories |
| **PostgreSQL** | Via `pg ^8.18.0` | Relational database for persistence |
| **Passport.js** | `^0.7.0` | Extensible authentication middleware |
| **@nestjs/jwt** | `^11.0.2` | JSON Web Token generation and validation |
| **bcryptjs** | `^3.0.3` | Password hashing with configurable salt rounds |
| **class-validator** | `^0.14.3` | DTO validation via decorators (`@IsEmail`, `@MinLength`) |
| **class-transformer** | `^0.5.1` | Object transformation and serialization |

### Frontend

| Technology | Version | Function |
|-----------|---------|----------|
| **React** | `^19.2.4` | Library for building reactive interfaces |
| **React DOM** | `^19.2.4` | Browser rendering |
| **Vite** | `^8.0.0` | Bundler and dev server with instant HMR |
| **React Router DOM** | `^7.13.1` | SPA routing with protected routes |
| **react-markdown** | `^10.1.0` | Markdown rendering in React components |
| **remark-gfm** | `^4.0.1` | Support for tables, checklists, and GFM in Markdown |
| **rehype-raw** | `^7.0.0` | Allows inline HTML in Markdown content |
| **rehype-sanitize** | `^6.0.0` | HTML sanitization to prevent XSS |

### Development Tools

| Tool | Function |
|------|----------|
| **ESLint** `^9.18.0+` | TypeScript and JSX code linting |
| **Prettier** `^3.4.2` | Consistent code formatting |
| **Jest** `^30.0.0` | Unit testing framework |
| **ts-jest** `^29.2.5` | TypeScript transformer for Jest |
| **Supertest** `^7.0.0` | HTTP integration testing |
| **@vitejs/plugin-react** `^6.0.0` | Vite plugin for JSX and Fast Refresh |

---

## Development Methodology

### Clean Architecture

The backend strictly follows **Clean Architecture** with three layers:

- **Domain**: Business entities, repository interfaces, and use cases. Zero external dependencies.
- **Application**: DTOs with validation for data transport between layers.
- **Infrastructure**: Concrete implementations — HTTP controllers, TypeORM repositories, JWT authentication.

### Conventional Commits

The project uses **Conventional Commits** in Brazilian Portuguese (pt-BR) with commits grouped by directory:

```
feat(backend/controllers): adiciona endpoint de login
fix(frontend/pages): corrige redirecionamento após registro
```

### NestJS Modularization

Each business domain is encapsulated in an independent **NestJS module**, registering its own controllers, providers, and repositories. The `AuthModule` is `@Global()` to make JWT available across all modules.

---

## State and Data Management

### Backend — Persistence

| Aspect | Implementation |
|--------|---------------|
| **ORM** | TypeORM with Active Record pattern via `Repository<T>` |
| **Migrations** | TypeORM CLI with dedicated `DataSource` in `data-source.ts` |
| **Schema Sync** | `synchronize: true` in development, `synchronize: false` in the migrations DataSource |
| **Connection** | PostgreSQL connection pool via `pg` driver |
| **UUID** | IDs automatically generated via `@PrimaryGeneratedColumn('uuid')` |

### Frontend — Global State

| Aspect | Implementation |
|--------|---------------|
| **Authentication** | `AuthContext` via React Context API |
| **JWT Token** | Stored in `localStorage` as `auth_session` |
| **Rehydration** | On initialization, token is restored and user data reloaded via `/users/profile` |
| **401 Interceptor** | `apiClient` fires `auth:unauthorized` event, triggering automatic `logout()` |
| **Local State** | Native React `useState` and `useEffect` for per-component state |

### Frontend ↔ Backend Communication

| Aspect | Implementation |
|--------|---------------|
| **HTTP Client** | Custom `ApiClient` class over native `fetch` |
| **Base URL** | Defined via `VITE_API_URL` environment variable |
| **Authentication** | `Authorization: Bearer <token>` header added automatically |
| **Content-Type** | `application/json` by default, `FormData` for uploads |
| **CORS** | Enabled globally in NestJS via `app.enableCors()` |
