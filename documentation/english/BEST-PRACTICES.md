# Best Practices

## SOLID Principles

### Single Responsibility (SRP)

Each class has a single reason to change:

- **Use Cases**: One class per operation (`CreateUserUseCase`, `DeleteUserUseCase`). There is no monolithic "UserService".
- **Controllers**: Only receive validated DTOs and delegate to use cases. No business logic.
- **Domain Entities**: Only properties and business methods (`isAdmin()`, `publish()`). No ORM annotations.
- **ORM Entities**: Only table mapping. No business logic.

### Open/Closed (OCP)

- **Authentication Strategies**: New strategies (OAuth, SAML) are added by creating new classes that extend `PassportStrategy`, without altering the existing flow.
- **NestJS Modules**: New domains are added by creating new modules and registering them in `AppModule`, without modifying existing modules.

### Liskov Substitution (LSP)

- **Repositories**: Any implementation of `IUserRepository` can replace another without breaking use cases. `TypeOrmUserRepository` can be swapped for `InMemoryUserRepository` in tests.

### Interface Segregation (ISP)

- **Repository Interfaces**: Each interface defines only the methods necessary for that entity. `IUserRepository` contains no course methods.
- **Guards**: `JwtAuthGuard` handles authentication. `RolesGuard` handles authorization. Separate responsibilities.

### Dependency Inversion (DIP)

- **Use Cases depend on abstractions**: The domain declares `IUserRepository`; the infrastructure implements `TypeOrmUserRepository`.
- **Token-based injection**: `@Inject('IUserRepository')` in use cases, `provide: 'IUserRepository', useClass: TypeOrmUserRepository` in modules.

---

## Error Handling

### Backend

| Layer | Strategy |
|-------|----------|
| **DTOs** | Automatic validation via `ValidationPipe` with `whitelist: true` and `transform: true`. Invalid fields return `400 Bad Request` with descriptive messages. |
| **Guards** | `JwtAuthGuard` throws `UnauthorizedException` (401). `RolesGuard` throws `ForbiddenException` (403). |
| **Use Cases** | Business exceptions via NestJS HTTP classes (`NotFoundException`, `ConflictException`). |
| **Repositories** | Database errors propagate naturally via TypeORM and are caught by the NestJS default Exception Filter. |

### Frontend

| Layer | Strategy |
|-------|----------|
| **ApiClient** | Intercepts `response.status === 401` and fires a global `auth:unauthorized` event for automatic logout. |
| **ApiClient** | HTTP errors generate `Error` with `message` extracted from `data.message`, `data.error`, or status code. |
| **AuthContext** | `try/catch` on rehydration operations. Failed refresh triggers a silent `logout()`. |
| **Pages** | `try/catch` on API calls with visual feedback to the user. |

---

## Testing

### Configured Test Types

| Type | Framework | Configuration |
|------|-----------|---------------|
| **Unit** | Jest `^30.0.0` + ts-jest | `testRegex: '.*\\.spec\\.ts$'` |
| **HTTP Integration** | Supertest `^7.0.0` | Via `@nestjs/testing` with `Test.createTestingModule()` |
| **E2E** | Jest + Supertest | Separate configuration in `test/jest-e2e.json` |

### Test Structure

```
apps/backend/
├── src/
│   └── app.controller.spec.ts    # Unit tests alongside code
└── test/                          # Separate E2E tests
```

### Coverage

Command for coverage report:

```bash
npm run test:cov
```

Coverage collection configured for all `.(t|j)s` files, excluding `node_modules` and `dist`.

---

## Security

### Authentication

| Aspect | Implementation |
|--------|---------------|
| **Password Hashing** | `bcryptjs` with configurable salt rounds via `BCRYPT_SALT_ROUNDS` |
| **JWT** | Tokens signed with `JWT_SECRET_KEY`, expiration configurable via `JWT_EXPIRATION` |
| **Strategy** | Bearer Token extracted from the `Authorization` header via Passport |
| **Session Timeout** | Token expires automatically per `JWT_EXPIRATION` (default: `24h`) |

### Authorization

| Aspect | Implementation |
|--------|---------------|
| **RBAC** | Role-Based Access Control with `UserRole` enum (admin/student) |
| **Roles Guard** | `RolesGuard` checks `@Roles()` decorator against `user.role` from JWT payload |
| **Private Routes (Frontend)** | `PrivateRoute` wrapper redirects to `/login` if `!isAuthenticated` |

### Sanitization and Validation

| Aspect | Implementation |
|--------|---------------|
| **Input Validation** | `class-validator` in DTOs with `whitelist: true` (extra fields are removed) |
| **Transform** | `class-transformer` with `transform: true` for automatic type conversion |
| **Markdown Sanitization** | `rehype-sanitize` in the frontend to prevent XSS in Markdown content |
| **CORS** | Enabled globally via `app.enableCors()` |

### Environment Variable Management

Sensitive variables are managed via `.env` files that are **not versioned** (included in `.gitignore`). Templates available in `.env.test`:

**Backend** (`.env.test`):

```env
# Database Variables
DB_HOST=yourdbhost
DB_PORT=yourdbport
DB_USERNAME=yourdbusername
DB_PASSWORD=yourdbpassword
DB_DATABASE=yourdbname

# Port
PORT=yourbackendport

# JWT Auth
JWT_SECRET_KEY=yourjwtsecretkey
JWT_EXPIRATION=yourjwtexpirationdate
BCRYPT_SALT_ROUNDS=yournumberofsaltrounds
```

**Frontend** (`.env.test`):

```env
VITE_API_URL=yourapiurl
```

### Additional Security Best Practices

- `.env.production` files are **never versioned** — they are server-specific.
- `JWT_SECRET_KEY` must be a long, random string in production.
- `BCRYPT_SALT_ROUNDS` recommended: `10` to `12` for a balance between security and performance.
- The frontend stores no sensitive data beyond the `accessToken` required for the session.
- Automatic logout upon receiving `401 Unauthorized` from any endpoint.
