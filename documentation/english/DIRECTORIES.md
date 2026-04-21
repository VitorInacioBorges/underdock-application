# Directory Mapping

## Full Structure

```bash
auto-improvement-application/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── application/
│   │   │   │   └── dto/
│   │   │   │       ├── course-dtos/
│   │   │   │       ├── enrollment-dtos/
│   │   │   │       ├── exercise-dtos/
│   │   │   │       ├── exerciseSubmission-dtos/
│   │   │   │       ├── feedback-dtos/
│   │   │   │       ├── lesson-dtos/
│   │   │   │       ├── lessonProgress-dtos/
│   │   │   │       └── user-dtos/
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   ├── repositories/
│   │   │   │   └── usecases/
│   │   │   │       ├── course-usecases/
│   │   │   │       ├── enrollment-usecases/
│   │   │   │       ├── exercise-usecases/
│   │   │   │       ├── exerciseSubmission-usecases/
│   │   │   │       ├── feedback-usecases/
│   │   │   │       ├── lesson-usecases/
│   │   │   │       ├── lessonProgress-usecases/
│   │   │   │       └── user-usecases/
│   │   │   ├── infrastructure/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── decorators/
│   │   │   │   │   ├── guards/
│   │   │   │   │   └── strategies/
│   │   │   │   ├── database/
│   │   │   │   │   ├── orm/
│   │   │   │   │   └── typeorm/
│   │   │   │   │       ├── migrations/
│   │   │   │   │       └── repositories/
│   │   │   │   └── http/
│   │   │   │       └── controllers/
│   │   │   ├── modules/
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── test/
│   │   ├── uploads/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── frontend/
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   │   ├── admin/
│       │   │   ├── CourseListItem.jsx
│       │   │   ├── Footer.jsx
│       │   │   ├── Header.jsx
│       │   │   ├── LastCourseBanner.jsx
│       │   │   └── ModalShell.jsx
│       │   ├── contexts/
│       │   ├── hooks/
│       │   ├── pages/
│       │   ├── routes/
│       │   ├── services/
│       │   │   ├── course-services/
│       │   │   ├── enrollment-services/
│       │   │   ├── exercise-services/
│       │   │   ├── lesson-services/
│       │   │   ├── user-services/
│       │   │   └── apiClient.js
│       │   ├── styles/
│       │   │   ├── components-styles/
│       │   │   ├── pages-styles/
│       │   │   └── global.css
│       │   ├── utils/
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── public/
│       ├── index.html
│       ├── package.json
│       └── vite.config.js
├── .gitignore
├── manual_deploy.md
└── README.md
```

---

## Backend — Directory Details

### `src/domain/entities/`

Pure business models with no external dependencies. Classes with typed properties and domain methods. No framework annotations.

| File | Responsibility |
|------|---------------|
| `user.entity.ts` | User model with `UserRole` enum (admin/student) and `isAdmin()` method |
| `course.entity.ts` | Course model with `publish()` and `unpublish()` methods |
| `lesson.entity.ts` | Lesson model linked to a course |
| `exercise.entity.ts` | Exercise model linked to a lesson |
| `enrollment.entity.ts` | Enrollment model (user ↔ course relationship) |
| `lessonProgress.entity.ts` | Per-lesson progress model |
| `exerciseSubmission.entity.ts` | Exercise submission model |
| `feedback.entity.ts` | Content feedback model |

### `src/domain/repositories/`

Contracts (interfaces) that define persistence operations. Contain no implementation — only signatures with `Promise`.

| File | Defined Operations |
|------|-------------------|
| `user.repository.ts` | `create`, `findByEmail`, `findAll`, `update`, `delete` |
| `course.repository.ts` | Full course CRUD |
| `lesson.repository.ts` | Lesson CRUD with course filter |
| `exercise.repository.ts` | Exercise CRUD with lesson filter |
| `enrollment.repository.ts` | Enrollment, listing by course/user |
| `lessonProgress.repository.ts` | Progress recording and querying |
| `exerciseSubmission.ts` | Answer submission and listing |
| `feedback.repository.ts` | Feedback CRUD |

### `src/domain/usecases/`

Each subdirectory contains use cases isolated per entity, each with a single `execute()` method. Follows the **Command/Query** pattern.

| Directory | Use Cases |
|-----------|-----------|
| `user-usecases/` | `create-user`, `get-user`, `list-user`, `update-user`, `delete-user`, `login-user` |
| `course-usecases/` | `create-course`, `get-course`, `list-courses`, `update-course`, `delete-course` |
| `lesson-usecases/` | Lesson CRUD |
| `exercise-usecases/` | Exercise CRUD |
| `enrollment-usecases/` | Enrollment operations |
| `lessonProgress-usecases/` | Progress operations |
| `exerciseSubmission-usecases/` | Submission operations |
| `feedback-usecases/` | Feedback operations |

### `src/application/dto/`

Data Transfer Objects with validation via **class-validator** and transformation via **class-transformer**. Each subdirectory groups DTOs by entity.

**Example**: `user-dtos/` contains `CreateUserDto`, `UpdateUserDto`, `LoginUserDto`.

### `src/infrastructure/auth/`

JWT authentication implementation with **Passport.js**.

| Subdirectory | File | Responsibility |
|-------------|------|---------------|
| `strategies/` | `jwt.strategy.ts` | Extracts and validates JWT from `Authorization: Bearer` header |
| `guards/` | `jwt-auth.guard.ts` | Guard that protects routes requiring a valid token |
| `guards/` | `roles.guard.ts` | Guard that checks the user's role (admin/student) |
| `decorators/` | `get-user.decorator.ts` | Extracts `user` from the request via `@GetUser()` |
| `decorators/` | `roles.decorator.ts` | Defines allowed roles via `@Roles(UserRole.admin)` |

### `src/infrastructure/database/orm/`

ORM entities with **TypeORM** decorators (`@Entity`, `@Column`, `@PrimaryGeneratedColumn`). Represent the exact schema of tables in PostgreSQL.

**Example**: `user.orm-entity.ts` maps the `users` table with columns `id` (UUID), `name`, `email` (unique), `password_hash`, `role` (enum), timestamps.

### `src/infrastructure/database/typeorm/repositories/`

Concrete implementations of domain repository interfaces. Use TypeORM's `Repository<OrmEntity>` and perform the ORM Entity ↔ Domain Entity mapping.

**Example**: `typeorm-user.repository.ts` implements `IUserRepository`.

### `src/infrastructure/database/typeorm/migrations/`

Migration files generated by the **TypeORM CLI**. Control incremental changes to the database schema.

### `src/infrastructure/http/controllers/`

NestJS controllers with route decorators (`@Get`, `@Post`, `@Patch`, `@Delete`). Receive validated DTOs, invoke use cases, and return HTTP responses.

| Controller | Base Routes |
|-----------|-------------|
| `user.controller.ts` | `/api/users` |
| `course.controller.ts` | `/api/courses` |
| `lesson.controller.ts` | `/api/lessons` |
| `exercise.controller.ts` | `/api/exercises` |
| `enrollment.controller.ts` | `/api/enrollments` |
| `lessonProgress.controller.ts` | `/api/lesson-progress` |
| `exerciseSubmission.controller.ts` | `/api/exercise-submissions` |
| `feedback.controller.ts` | `/api/feedbacks` |

### `src/modules/`

NestJS modules that connect controllers, use cases, and repositories via Dependency Injection. Each module is self-contained.

---

## Frontend — Directory Details

### `src/pages/`

Complete application screens. Each file is a page component with state logic, API calls, and layout.

| File | Route | Access |
|------|-------|--------|
| `LoginPage.jsx` | `/` | Public |
| `RegisterPage.jsx` | `/register` | Public |
| `CoursesPage.jsx` | `/courses` | Public |
| `CourseDetailPage.jsx` | `/courses/:id` | Public |
| `DashboardPage.jsx` | `/dashboard` | Private (authenticated) |
| `PanelPage.jsx` | `/painel` | Private (authenticated) |
| `LessonViewerPage.jsx` | `/courses/:courseId/lessons/:lessonId` | Private |
| `ExerciseNotebookViewerPage.jsx` | `/courses/:courseId/lessons/:lessonId/exercises/:exerciseId` | Private |

### `src/components/`

Reusable interface components.

| File | Responsibility |
|------|---------------|
| `Header.jsx` | Top navigation bar with links and session control |
| `Footer.jsx` | Application footer |
| `CourseListItem.jsx` | Course presentation card in listings |
| `LastCourseBanner.jsx` | Highlight banner for the last accessed course |
| `ModalShell.jsx` | Generic reusable modal component |

### `src/components/admin/`

Components exclusive to the admin panel.

| File | Responsibility |
|------|---------------|
| `CourseAdminView.jsx` | Course listing and management (admin) |
| `CourseModal.jsx` | Course creation/editing modal |
| `LessonAdminView.jsx` | Lesson listing and management (admin) |
| `LessonModal.jsx` | Lesson creation/editing modal |
| `ExerciseAdminView.jsx` | Exercise listing and management (admin) |
| `ExerciseModal.jsx` | Exercise creation/editing modal |

### `src/services/`

REST API communication layer.

| File/Directory | Responsibility |
|----------------|---------------|
| `apiClient.js` | Singleton `ApiClient` class with `get`, `post`, `patch`, `delete` methods and 401 interceptor |
| `user-services/` | Service functions for user operations |
| `course-services/` | Service functions for course operations |
| `enrollment-services/` | Service functions for enrollments |
| `lesson-services/` | Service functions for lessons |
| `exercise-services/` | Service functions for exercises |

### `src/contexts/`

| File | Responsibility |
|------|---------------|
| `AuthContext.jsx` | Context API for authentication: `user`, `accessToken`, `login()`, `logout()`, `refreshCurrentUser()` |

### `src/routes/`

| File | Responsibility |
|------|---------------|
| `AppRoutes.jsx` | Definition of all routes with `PrivateRoute` for authenticated route protection |

### `src/styles/`

| File/Directory | Responsibility |
|----------------|---------------|
| `global.css` | Design tokens (CSS Custom Properties), reset, and global utility classes |
| `components-styles/` | CSS Modules for each component (`Header.module.css`, `Footer.module.css`, etc.) |
| `pages-styles/` | CSS Modules for each page (`DashboardPage.module.css`, `RegisterPage.module.css`, etc.) |

### `src/hooks/`

Directory reserved for custom React hooks. Currently empty — prepared for expansion.

### `src/utils/`

Directory reserved for pure utility functions. Currently empty — prepared for expansion.
