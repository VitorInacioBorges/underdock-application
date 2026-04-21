# Project Architecture

## Architecture Rationale

The project adopts **Clean Architecture** in the backend, separating responsibilities into concentric layers with unidirectional dependencies (outside-in). This choice addresses three core problems of this project:

1. **Framework Independence**: The business logic (entities and use cases) is unaware of NestJS, TypeORM, or Express. If there is ever a need to migrate ORM or framework, only the infrastructure layer needs to change.
2. **Testability**: Use cases depend on interfaces (`IUserRepository`, `ICourseRepository`), allowing mock injection without configuring a database.
3. **Team Scalability**: Student league members can work on isolated layers without conflicts — someone implementing a controller doesn't need to understand ORM mapping.

On the frontend, the architecture follows the **Feature-Based** pattern with separation between pages, reusable components, API services, and global state contexts.

---

## Architecture Diagram (Backend)

```
┌─────────────────────────────────────────────────────────────────┐
│                        INFRASTRUCTURE                           │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │  Controllers │  │  ORM Entities│  │  TypeORM Repositories │  │
│  │  (HTTP)      │  │  (Postgres)  │  │  (Implementation)     │  │
│  └──────┬───────┘  └──────┬───────┘  └───────────┬───────────┘  │
│         │                 │                      │              │
├─────────┼─────────────────┼──────────────────────┼──────────────┤
│         │          APPLICATION                   │              │
│         │    ┌─────────────────────┐             │              │
│         │    │       DTOs          │             │              │
│         │    │  (Validation)       │             │              │
│         │    └─────────────────────┘             │              │
├─────────┼────────────────────────────────────────┼──────────────┤
│         ▼              DOMAIN                    ▼              │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │  Use Cases  │─►│  Entities    │  │  Repository Interfaces │  │
│  │  (Logic)    │  │  (Model)     │  │  (Contracts)           │  │
│  └─────────────┘  └──────────────┘  └────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Architecture Diagram (Frontend)

```
┌───────────────────────────────────────────────┐
│                    App.jsx                    │
│  ┌──────────────────────────────────────────┐ │
│  │  BrowserRouter → AuthProvider → Routes   │ │
│  └────────────────────┬─────────────────────┘ │
│                       ▼                       │
│  ┌───────────┐  ┌──────────┐  ┌────────────┐  │
│  │   Pages   │  │Components│  │   Admin    │  │
│  │ (Screens) │  │(Reusable)│  │(Management)│  │
│  └─────┬─────┘  └──────────┘  └────────────┘  │
│        ▼                                      │
│  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │
│  │ Services │  │ Contexts │  │   Styles    │  │
│  │(REST API)│  │ (State)  │  │(CSS Modules)│  │
│  └──────────┘  └──────────┘  └─────────────┘  │
└───────────────────────────────────────────────┘
```

---

## Data Flow — Typical Request

### Backend: User Creation

```
1. Client sends POST /api/users with JSON body
2. NestJS routes to UserController.create()
3. ValidationPipe validates the body against CreateUserDto (class-validator)
4. Controller invokes CreateUserUseCase.execute(dto)
5. UseCase creates UserEntity (pure domain)
6. UseCase calls IUserRepository.create(entity)
7. TypeOrmUserRepository converts to UserOrmEntity and persists via TypeORM
8. Response returns UserEntity → Controller → JSON to client
```

### Frontend: User Login

```
1. User fills out the form in LoginPage.jsx
2. Submit calls apiClient.post('/auth/login', credentials)
3. ApiClient adds headers and sends fetch to VITE_API_URL
4. Response with accessToken is passed to AuthContext.login()
5. AuthContext saves token in state and localStorage
6. apiClient.setToken() configures Bearer for subsequent requests
7. React Router redirects to /dashboard (protected route)
```

---

## Dependency Inversion

The connection between layers occurs via **Dependency Injection** native to NestJS. In the module, the concrete repository is registered against the abstract interface:

```typescript
// user.module.ts
{
  provide: 'IUserRepository',        // Abstract token
  useClass: TypeOrmUserRepository,   // Concrete implementation
}
```

Use cases receive the repository via `@Inject('IUserRepository')`, ensuring the domain layer **never imports** infrastructure code.

---

## System Modules

The backend is organized into **9 independent NestJS modules**:

| Module | Responsibility |
|--------|---------------|
| `AuthModule` | JWT, Passport configuration and authentication strategies (Global) |
| `UserModule` | User CRUD, login, role control |
| `CourseModule` | Course CRUD, publish/unpublish |
| `LessonModule` | Lesson CRUD linked to courses |
| `ExerciseModule` | Exercise CRUD linked to lessons |
| `EnrollmentModule` | Student enrollment in courses |
| `LessonProgressModule` | Progress tracking per lesson |
| `ExerciseSubmissionModule` | Exercise answer submissions |
| `FeedbackModule` | Feedback on lessons and exercises |
