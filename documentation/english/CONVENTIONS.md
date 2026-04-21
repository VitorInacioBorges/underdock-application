# Organization and Naming Standards

## Naming Conventions

### Backend (TypeScript)

| Element | Convention | Example |
|---------|------------|---------|
| **Classes** | `PascalCase` | `UserEntity`, `CreateUserUseCase`, `TypeOrmUserRepository` |
| **Interfaces** | `PascalCase` with `I` prefix | `IUserRepository`, `ICourseRepository` |
| **Enums** | `PascalCase` | `UserRole` |
| **Enum Values** | `camelCase` | `UserRole.admin`, `UserRole.student` |
| **Methods and Functions** | `camelCase` | `execute()`, `findByEmail()`, `isAdmin()` |
| **Variables** | `camelCase` | `passwordHash`, `isPublished`, `createdAt` |
| **Constants** | `SCREAMING_SNAKE_CASE` | `ROLES_KEY` |
| **Entity Files** | `kebab-case` with suffix | `user.entity.ts`, `course.entity.ts` |
| **ORM Files** | `kebab-case` with double suffix | `user.orm-entity.ts` |
| **Use Case Files** | `kebab-case` with suffix | `create-user.usecase.ts`, `login-user.usecase.ts` |
| **Repository Files** | `kebab-case` with prefix/suffix | `typeorm-user.repository.ts` |
| **Controller Files** | `kebab-case` with suffix | `user.controller.ts` |
| **Module Files** | `camelCase` with suffix | `user.module.ts`, `auth.module.ts` |
| **Guard Files** | `kebab-case` with suffix | `jwt-auth.guard.ts`, `roles.guard.ts` |
| **Decorator Files** | `kebab-case` with suffix | `get-user.decorator.ts`, `roles.decorator.ts` |
| **Strategy Files** | `kebab-case` with suffix | `jwt.strategy.ts` |
| **DB Tables** | `snake_case` plural | `users`, `courses`, `lesson_progress` |
| **DB Columns** | `snake_case` | `password_hash`, `created_at`, `updated_at` |

### Frontend (JavaScript/JSX)

| Element | Convention | Example |
|---------|------------|---------|
| **React Components** | `PascalCase` | `DashboardPage`, `CourseListItem`, `ModalShell` |
| **Component Files** | `PascalCase` with `.jsx` | `LoginPage.jsx`, `Header.jsx` |
| **Hooks** | `camelCase` with `use` prefix | `useAuth()` |
| **Contexts** | `PascalCase` with suffix | `AuthContext.jsx` |
| **Services** | `camelCase` | `apiClient.js`, `userService.js`, `courseService.js` |
| **Service Directories** | `kebab-case` with suffix | `user-services/`, `course-services/` |
| **CSS Modules** | `PascalCase` matching component | `Header.module.css`, `DashboardPage.module.css` |
| **CSS Custom Properties** | `--` prefix with `kebab-case` | `--bg`, `--accent`, `--text-muted`, `--radius-lg` |
| **Environment Variables** | `SCREAMING_SNAKE_CASE` with prefix | `VITE_API_URL` |

---

## File Type Suffix Standard

| Suffix | Type | Layer |
|--------|------|-------|
| `.entity.ts` | Domain entity | Domain |
| `.repository.ts` | Repository interface | Domain |
| `.usecase.ts` | Use case | Domain |
| `.dto.ts` | Data Transfer Object | Application |
| `.orm-entity.ts` | ORM Entity (TypeORM) | Infrastructure |
| `typeorm-*.repository.ts` | Concrete repository | Infrastructure |
| `.controller.ts` | HTTP Controller | Infrastructure |
| `.module.ts` | NestJS Module | Modules |
| `.guard.ts` | Authentication/Authorization Guard | Infrastructure |
| `.decorator.ts` | Custom Decorator | Infrastructure |
| `.strategy.ts` | Passport Strategy | Infrastructure |
| `.spec.ts` | Unit test | Test |
| `.module.css` | Scoped CSS Module | Frontend |

---

## Design Patterns Used

### Repository Pattern

Persistence abstraction via domain interfaces and concrete infrastructure implementations. Allows swapping the storage mechanism without altering business logic.

```
IUserRepository (interface) ← TypeOrmUserRepository (implementation)
```

### Use Case Pattern (Interactor)

Each business operation is an isolated class with a single `execute()` method. Ensures **Single Responsibility** and simplifies unit testing.

```typescript
class CreateUserUseCase {
  async execute(dto: CreateUserDto): Promise<UserEntity> { ... }
}
```

### Dependency Injection

NestJS automatically injects dependencies via tokens. Repositories are registered against abstract interfaces using `provide/useClass`.

### Strategy Pattern

Authentication uses **Passport Strategies** (`JwtStrategy`), allowing new strategies (OAuth, Google, etc.) to be added without modifying the existing flow.

### Guard Pattern

NestJS guards (`JwtAuthGuard`, `RolesGuard`) implement `CanActivate` to intercept requests before they reach the controller.

### Decorator Pattern

Custom decorators (`@GetUser()`, `@Roles()`) encapsulate data extraction logic and metadata in reusable annotations.

### Context Pattern (Frontend)

React Context API with `AuthProvider` encapsulates authentication state and exposes it via the `useAuth()` hook to the entire component tree.

### Singleton Pattern (Frontend)

The `apiClient` instance is exported as a singleton, ensuring all HTTP calls share the same token and configuration.

### Module Pattern

Each business domain is encapsulated in an independent NestJS module, registering controllers, providers, and exports in a self-contained manner.

---

## Directory Organization by Domain

The project follows **business domain** (feature-based) grouping rather than type-based grouping. Each entity has its own set of:

```
domain/entities/       → user.entity.ts
domain/repositories/   → user.repository.ts
domain/usecases/       → user-usecases/create-user.usecase.ts
application/dto/       → user-dtos/CreateUserDto
infrastructure/orm/    → user.orm-entity.ts
infrastructure/typeorm/repositories/ → typeorm-user.repository.ts
infrastructure/http/controllers/     → user.controller.ts
modules/               → user.module.ts
```

This organization allows new domains to be added by replicating the same pattern, without interfering with existing ones.
