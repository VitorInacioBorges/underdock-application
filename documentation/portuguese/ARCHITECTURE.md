# Arquitetura do Projeto

## Justificativa da Arquitetura

O projeto adota **Clean Architecture** no backend, separando responsabilidades em camadas concêntricas com dependências unidirecionais (de fora para dentro). Essa escolha resolve três problemas centrais deste projeto:

1. **Independência de Framework**: A lógica de negócio (entidades e use cases) não conhece NestJS, TypeORM ou Express. Se houver necessidade de migrar de ORM ou framework, apenas a camada de infraestrutura é alterada.
2. **Testabilidade**: Use cases dependem de interfaces (`IUserRepository`, `ICourseRepository`), permitindo injeção de mocks sem configurar banco de dados.
3. **Escalabilidade da Equipe**: Membros da liga estudantil podem trabalhar em camadas isoladas sem conflitos — quem implementa um controller não precisa entender o mapeamento ORM.

No frontend, a arquitetura segue o padrão **Feature-Based** com separação entre páginas, componentes reutilizáveis, serviços de API e contextos de estado global.

---

## Visualização da Arquitetura (Backend)

```
┌─────────────────────────────────────────────────────────────────┐
│                        INFRASTRUCTURE                           │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │  Controllers │  │  ORM Entities│  │  TypeORM Repositories │  │
│  │  (HTTP)      │  │  (Postgres)  │  │  (Implementação)      │  │
│  └──────┬───────┘  └──────┬───────┘  └───────────┬───────────┘  │
│         │                 │                      │              │
├─────────┼─────────────────┼──────────────────────┼──────────────┤
│         │          APPLICATION                   │              │
│         │    ┌─────────────────────┐             │              │
│         │    │       DTOs          │             │              │
│         │    │  (Validação)        │             │              │
│         │    └─────────────────────┘             │              │
├─────────┼────────────────────────────────────────┼──────────────┤
│         ▼              DOMAIN                    ▼              │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │  Use Cases  │─►│  Entities    │  │  Repository Interfaces │  │
│  │  (Lógica)   │  │  (Modelo)    │  │  (Contratos)           │  │
│  └─────────────┘  └──────────────┘  └────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Visualização da Arquitetura (Frontend)

```
┌───────────────────────────────────────────────┐
│                    App.jsx                    │
│  ┌──────────────────────────────────────────┐ │
│  │  BrowserRouter → AuthProvider → Routes   │ │
│  └────────────────────┬─────────────────────┘ │
│                       ▼                       │
│  ┌───────────┐  ┌──────────┐  ┌────────────┐  │
│  │   Pages   │  │Components│  │   Admin    │  │
│  │ (Telas)   │  │(Reusável)│  │ (Gestão)   │  │
│  └─────┬─────┘  └──────────┘  └────────────┘  │
│        ▼                                      │
│  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │
│  │ Services │  │ Contexts │  │   Styles    │  │
│  │(API REST)│  │ (Estado) │  │(CSS Modules)│  │
│  └──────────┘  └──────────┘  └─────────────┘  │
└───────────────────────────────────────────────┘
```

---

## Fluxo de Dados — Requisição Típica

### Backend: Criação de Usuário

```
1. Cliente envia POST /api/users com body JSON
2. NestJS roteia para UserController.create()
3. ValidationPipe valida o body contra CreateUserDto (class-validator)
4. Controller invoca CreateUserUseCase.execute(dto)
5. UseCase cria UserEntity (domínio puro)
6. UseCase chama IUserRepository.create(entity)
7. TypeOrmUserRepository converte para UserOrmEntity e persiste via TypeORM
8. Resposta retorna UserEntity → Controller → JSON ao cliente
```

### Frontend: Login do Usuário

```
1. Usuário preenche formulário em LoginPage.jsx
2. Submit chama apiClient.post('/auth/login', credentials)
3. ApiClient adiciona headers e envia fetch para VITE_API_URL
4. Resposta com accessToken é passada para AuthContext.login()
5. AuthContext salva token no estado e localStorage
6. apiClient.setToken() configura Bearer para próximas requisições
7. React Router redireciona para /dashboard (rota protegida)
```

---

## Inversão de Dependência

A conexão entre camadas ocorre via **Dependency Injection** nativa do NestJS. No módulo, o repositório concreto é registrado contra a interface abstrata:

```typescript
// user.module.ts
{
  provide: 'IUserRepository',        // Token abstrato
  useClass: TypeOrmUserRepository,   // Implementação concreta
}
```

Os use cases recebem o repositório via `@Inject('IUserRepository')`, garantindo que a camada de domínio **nunca importe** código de infraestrutura.

---

## Módulos do Sistema

O backend é organizado em **9 módulos NestJS** independentes:

| Módulo | Responsabilidade |
|--------|-----------------|
| `AuthModule` | Configuração JWT, Passport e estratégias de autenticação (Global) |
| `UserModule` | CRUD de usuários, login, controle de roles |
| `CourseModule` | CRUD de cursos, publicação/despublicação |
| `LessonModule` | CRUD de aulas vinculadas a cursos |
| `ExerciseModule` | CRUD de exercícios vinculados a aulas |
| `EnrollmentModule` | Matrícula de alunos em cursos |
| `LessonProgressModule` | Rastreamento de progresso por aula |
| `ExerciseSubmissionModule` | Submissão de respostas de exercícios |
| `FeedbackModule` | Feedbacks sobre aulas e exercícios |
