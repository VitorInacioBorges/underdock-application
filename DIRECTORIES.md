# Mapeamento de Diretórios

## Estrutura Completa

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

## Backend — Detalhamento por Diretório

### `src/domain/entities/`

Modelos de negócio puros, sem dependências externas. Classes com propriedades tipadas e métodos de domínio. Nenhuma anotação de framework.

| Arquivo | Responsabilidade |
|---------|-----------------|
| `user.entity.ts` | Modelo de usuário com enum `UserRole` (admin/student) e método `isAdmin()` |
| `course.entity.ts` | Modelo de curso com métodos `publish()` e `unpublish()` |
| `lesson.entity.ts` | Modelo de aula vinculada a um curso |
| `exercise.entity.ts` | Modelo de exercício vinculado a uma aula |
| `enrollment.entity.ts` | Modelo de matrícula (relação user ↔ course) |
| `lessonProgress.entity.ts` | Modelo de progresso por aula |
| `exerciseSubmission.entity.ts` | Modelo de submissão de exercício |
| `feedback.entity.ts` | Modelo de feedback sobre conteúdo |

### `src/domain/repositories/`

Contratos (interfaces) que definem operações de persistência. Não contêm implementação — apenas assinaturas com `Promise`.

| Arquivo | Operações Definidas |
|---------|-------------------|
| `user.repository.ts` | `create`, `findByEmail`, `findAll`, `update`, `delete` |
| `course.repository.ts` | CRUD completo de cursos |
| `lesson.repository.ts` | CRUD de aulas com filtro por curso |
| `exercise.repository.ts` | CRUD de exercícios com filtro por aula |
| `enrollment.repository.ts` | Matrícula, listagem por curso/usuário |
| `lessonProgress.repository.ts` | Registro e consulta de progresso |
| `exerciseSubmission.ts` | Submissão e listagem de respostas |
| `feedback.repository.ts` | CRUD de feedbacks |

### `src/domain/usecases/`

Cada subdiretório contém use cases isolados por entidade, cada um com um único método `execute()`. Segue o padrão **Command/Query**.

| Diretório | Use Cases |
|-----------|-----------|
| `user-usecases/` | `create-user`, `get-user`, `list-user`, `update-user`, `delete-user`, `login-user` |
| `course-usecases/` | `create-course`, `get-course`, `list-courses`, `update-course`, `delete-course` |
| `lesson-usecases/` | CRUD de aulas |
| `exercise-usecases/` | CRUD de exercícios |
| `enrollment-usecases/` | Operações de matrícula |
| `lessonProgress-usecases/` | Operações de progresso |
| `exerciseSubmission-usecases/` | Operações de submissão |
| `feedback-usecases/` | Operações de feedback |

### `src/application/dto/`

Data Transfer Objects com validação via **class-validator** e transformação via **class-transformer**. Cada subdiretório agrupa DTOs por entidade.

**Exemplo**: `user-dtos/` contém `CreateUserDto`, `UpdateUserDto`, `LoginUserDto`.

### `src/infrastructure/auth/`

Implementação de autenticação JWT com **Passport.js**.

| Subdiretório | Arquivo | Responsabilidade |
|-------------|---------|-----------------|
| `strategies/` | `jwt.strategy.ts` | Extrai e valida JWT do header `Authorization: Bearer` |
| `guards/` | `jwt-auth.guard.ts` | Guard que protege rotas exigindo token válido |
| `guards/` | `roles.guard.ts` | Guard que verifica role do usuário (admin/student) |
| `decorators/` | `get-user.decorator.ts` | Extrai `user` do request via `@GetUser()` |
| `decorators/` | `roles.decorator.ts` | Define roles permitidas via `@Roles(UserRole.admin)` |

### `src/infrastructure/database/orm/`

Entidades ORM com decoradores **TypeORM** (`@Entity`, `@Column`, `@PrimaryGeneratedColumn`). Representam o schema exato das tabelas no PostgreSQL.

**Exemplo**: `user.orm-entity.ts` mapeia a tabela `users` com colunas `id` (UUID), `name`, `email` (unique), `password_hash`, `role` (enum), timestamps.

### `src/infrastructure/database/typeorm/repositories/`

Implementações concretas das interfaces de repositório do domínio. Usam `Repository<OrmEntity>` do TypeORM e fazem o mapeamento ORM Entity ↔ Domain Entity.

**Exemplo**: `typeorm-user.repository.ts` implementa `IUserRepository`.

### `src/infrastructure/database/typeorm/migrations/`

Arquivos de migration gerados pelo **TypeORM CLI**. Controlam alterações incrementais no schema do banco.

### `src/infrastructure/http/controllers/`

Controllers NestJS com decoradores de rota (`@Get`, `@Post`, `@Patch`, `@Delete`). Recebem DTOs validados, invocam use cases e retornam respostas HTTP.

| Controller | Rotas Base |
|-----------|-----------|
| `user.controller.ts` | `/api/users` |
| `course.controller.ts` | `/api/courses` |
| `lesson.controller.ts` | `/api/lessons` |
| `exercise.controller.ts` | `/api/exercises` |
| `enrollment.controller.ts` | `/api/enrollments` |
| `lessonProgress.controller.ts` | `/api/lesson-progress` |
| `exerciseSubmission.controller.ts` | `/api/exercise-submissions` |
| `feedback.controller.ts` | `/api/feedbacks` |

### `src/modules/`

Módulos NestJS que conectam controllers, use cases e repositórios via Dependency Injection. Cada módulo é autocontido.

---

## Frontend — Detalhamento por Diretório

### `src/pages/`

Telas completas da aplicação. Cada arquivo é um componente de página com lógica de estado, chamadas de API e layout.

| Arquivo | Rota | Acesso |
|---------|------|--------|
| `LoginPage.jsx` | `/` | Público |
| `RegisterPage.jsx` | `/register` | Público |
| `CoursesPage.jsx` | `/courses` | Público |
| `CourseDetailPage.jsx` | `/courses/:id` | Público |
| `DashboardPage.jsx` | `/dashboard` | Privado (autenticado) |
| `PanelPage.jsx` | `/painel` | Privado (autenticado) |
| `LessonViewerPage.jsx` | `/courses/:courseId/lessons/:lessonId` | Privado |
| `ExerciseNotebookViewerPage.jsx` | `/courses/:courseId/lessons/:lessonId/exercises/:exerciseId` | Privado |

### `src/components/`

Componentes reutilizáveis da interface.

| Arquivo | Responsabilidade |
|---------|-----------------|
| `Header.jsx` | Barra de navegação superior com links e controle de sessão |
| `Footer.jsx` | Rodapé da aplicação |
| `CourseListItem.jsx` | Card de apresentação de curso em listagens |
| `LastCourseBanner.jsx` | Banner de destaque do último curso acessado |
| `ModalShell.jsx` | Componente genérico de modal reutilizável |

### `src/components/admin/`

Componentes exclusivos do painel administrativo.

| Arquivo | Responsabilidade |
|---------|-----------------|
| `CourseAdminView.jsx` | Listagem e gestão de cursos (admin) |
| `CourseModal.jsx` | Modal de criação/edição de curso |
| `LessonAdminView.jsx` | Listagem e gestão de aulas (admin) |
| `LessonModal.jsx` | Modal de criação/edição de aula |
| `ExerciseAdminView.jsx` | Listagem e gestão de exercícios (admin) |
| `ExerciseModal.jsx` | Modal de criação/edição de exercício |

### `src/services/`

Camada de comunicação com a API REST.

| Arquivo/Diretório | Responsabilidade |
|-------------------|-----------------|
| `apiClient.js` | Classe singleton `ApiClient` com métodos `get`, `post`, `patch`, `delete` e interceptor de 401 |
| `user-services/` | Funções de serviço para operações de usuário |
| `course-services/` | Funções de serviço para operações de cursos |
| `enrollment-services/` | Funções de serviço para matrículas |
| `lesson-services/` | Funções de serviço para aulas |
| `exercise-services/` | Funções de serviço para exercícios |

### `src/contexts/`

| Arquivo | Responsabilidade |
|---------|-----------------|
| `AuthContext.jsx` | Context API para autenticação: `user`, `accessToken`, `login()`, `logout()`, `refreshCurrentUser()` |

### `src/routes/`

| Arquivo | Responsabilidade |
|---------|-----------------|
| `AppRoutes.jsx` | Definição de todas as rotas com `PrivateRoute` para proteção de rotas autenticadas |

### `src/styles/`

| Arquivo/Diretório | Responsabilidade |
|-------------------|-----------------|
| `global.css` | Design tokens (CSS Custom Properties), reset e classes utilitárias globais |
| `components-styles/` | CSS Modules para cada componente (`Header.module.css`, `Footer.module.css`, etc.) |
| `pages-styles/` | CSS Modules para cada página (`DashboardPage.module.css`, `RegisterPage.module.css`, etc.) |

### `src/hooks/`

Diretório reservado para custom hooks React. Atualmente vazio — preparado para expansão.

### `src/utils/`

Diretório reservado para funções utilitárias puras. Atualmente vazio — preparado para expansão.
