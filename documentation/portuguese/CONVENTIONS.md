# Padrões de Organização e Nomeação

## Naming Conventions

### Backend (TypeScript)

| Elemento | Convenção | Exemplo |
|----------|-----------|---------|
| **Classes** | `PascalCase` | `UserEntity`, `CreateUserUseCase`, `TypeOrmUserRepository` |
| **Interfaces** | `PascalCase` com prefixo `I` | `IUserRepository`, `ICourseRepository` |
| **Enums** | `PascalCase` | `UserRole` |
| **Valores de Enum** | `camelCase` | `UserRole.admin`, `UserRole.student` |
| **Métodos e Funções** | `camelCase` | `execute()`, `findByEmail()`, `isAdmin()` |
| **Variáveis** | `camelCase` | `passwordHash`, `isPublished`, `createdAt` |
| **Constantes** | `SCREAMING_SNAKE_CASE` | `ROLES_KEY` |
| **Arquivos de Entidade** | `kebab-case` com sufixo | `user.entity.ts`, `course.entity.ts` |
| **Arquivos ORM** | `kebab-case` com sufixo duplo | `user.orm-entity.ts` |
| **Arquivos de Use Case** | `kebab-case` com sufixo | `create-user.usecase.ts`, `login-user.usecase.ts` |
| **Arquivos de Repositório** | `kebab-case` com prefixo/sufixo | `typeorm-user.repository.ts` |
| **Arquivos de Controller** | `kebab-case` com sufixo | `user.controller.ts` |
| **Arquivos de Módulo** | `camelCase` com sufixo | `user.module.ts`, `auth.module.ts` |
| **Arquivos de Guard** | `kebab-case` com sufixo | `jwt-auth.guard.ts`, `roles.guard.ts` |
| **Arquivos de Decorator** | `kebab-case` com sufixo | `get-user.decorator.ts`, `roles.decorator.ts` |
| **Arquivos de Strategy** | `kebab-case` com sufixo | `jwt.strategy.ts` |
| **Tabelas no BD** | `snake_case` plural | `users`, `courses`, `lesson_progress` |
| **Colunas no BD** | `snake_case` | `password_hash`, `created_at`, `updated_at` |

### Frontend (JavaScript/JSX)

| Elemento | Convenção | Exemplo |
|----------|-----------|---------|
| **Componentes React** | `PascalCase` | `DashboardPage`, `CourseListItem`, `ModalShell` |
| **Arquivos de Componente** | `PascalCase` com `.jsx` | `LoginPage.jsx`, `Header.jsx` |
| **Hooks** | `camelCase` com prefixo `use` | `useAuth()` |
| **Contexts** | `PascalCase` com sufixo | `AuthContext.jsx` |
| **Services** | `camelCase` | `apiClient.js`, `userService.js`, `courseService.js` |
| **Diretórios de Serviço** | `kebab-case` com sufixo | `user-services/`, `course-services/` |
| **CSS Modules** | `PascalCase` matching componente | `Header.module.css`, `DashboardPage.module.css` |
| **CSS Custom Properties** | Prefixo `--` com `kebab-case` | `--bg`, `--accent`, `--text-muted`, `--radius-lg` |
| **Variáveis de Ambiente** | `SCREAMING_SNAKE_CASE` com prefixo | `VITE_API_URL` |

---

## Padrão de Sufixos por Tipo de Arquivo

| Sufixo | Tipo | Camada |
|--------|------|--------|
| `.entity.ts` | Entidade de domínio | Domain |
| `.repository.ts` | Interface de repositório | Domain |
| `.usecase.ts` | Caso de uso | Domain |
| `.dto.ts` | Data Transfer Object | Application |
| `.orm-entity.ts` | Entidade ORM (TypeORM) | Infrastructure |
| `typeorm-*.repository.ts` | Repositório concreto | Infrastructure |
| `.controller.ts` | Controller HTTP | Infrastructure |
| `.module.ts` | Módulo NestJS | Modules |
| `.guard.ts` | Guard de autenticação/autorização | Infrastructure |
| `.decorator.ts` | Decorator customizado | Infrastructure |
| `.strategy.ts` | Estratégia Passport | Infrastructure |
| `.spec.ts` | Teste unitário | Test |
| `.module.css` | CSS Module escopado | Frontend |

---

## Design Patterns Utilizados

### Repository Pattern

Abstração da persistência via interfaces no domínio e implementações concretas na infraestrutura. Permite trocar o mecanismo de storage sem alterar lógica de negócio.

```
IUserRepository (interface) ← TypeOrmUserRepository (implementação)
```

### Use Case Pattern (Interactor)

Cada operação de negócio é uma classe isolada com um único método `execute()`. Garante **Single Responsibility** e facilita testes unitários.

```typescript
class CreateUserUseCase {
  async execute(dto: CreateUserDto): Promise<UserEntity> { ... }
}
```

### Dependency Injection

O NestJS injeta dependências automaticamente via tokens. Repositórios são registrados contra interfaces abstratas usando `provide/useClass`.

### Strategy Pattern

Autenticação utiliza **Passport Strategies** (`JwtStrategy`), permitindo adicionar novas estratégias (OAuth, Google, etc.) sem modificar o fluxo existente.

### Guard Pattern

Guards do NestJS (`JwtAuthGuard`, `RolesGuard`) implementam `CanActivate` para interceptar requisições antes de chegarem ao controller.

### Decorator Pattern

Decoradores customizados (`@GetUser()`, `@Roles()`) encapsulam lógica de extração de dados e metadados em anotações reutilizáveis.

### Context Pattern (Frontend)

React Context API com `AuthProvider` encapsula estado de autenticação e expõe via hook `useAuth()` para toda a árvore de componentes.

### Singleton Pattern (Frontend)

A instância `apiClient` é exportada como singleton, garantindo que todas as chamadas HTTP compartilhem o mesmo token e configuração.

### Module Pattern

Cada domínio de negócio é encapsulado em um módulo NestJS independente, registrando controllers, providers e exports de forma autocontida.

---

## Organização de Diretórios por Domínio

O projeto segue agrupamento por **domínio de negócio** (feature-based) ao invés de agrupamento por tipo. Cada entidade tem seu próprio conjunto de:

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

Essa organização permite que novos domínios sejam adicionados replicando o mesmo padrão, sem interferir nos existentes.
