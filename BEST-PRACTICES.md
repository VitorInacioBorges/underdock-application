# Boas Práticas

## Princípios SOLID

### Single Responsibility (SRP)

Cada classe tem uma única razão para mudar:

- **Use Cases**: Uma classe por operação (`CreateUserUseCase`, `DeleteUserUseCase`). Não existe um "UserService" monolítico.
- **Controllers**: Apenas recebem DTOs validados e delegam para use cases. Sem lógica de negócio.
- **Entidades de Domínio**: Apenas propriedades e métodos de negócio (`isAdmin()`, `publish()`). Sem anotações de ORM.
- **ORM Entities**: Apenas mapeamento de tabelas. Sem lógica de negócio.

### Open/Closed (OCP)

- **Strategies de Autenticação**: Novas estratégias (OAuth, SAML) são adicionadas criando novas classes que estendem `PassportStrategy`, sem alterar o fluxo existente.
- **Módulos NestJS**: Novos domínios são adicionados criando novos módulos e registrando-os no `AppModule`, sem modificar módulos existentes.

### Liskov Substitution (LSP)

- **Repositórios**: Qualquer implementação de `IUserRepository` pode substituir outra sem quebrar os use cases. `TypeOrmUserRepository` pode ser trocado por `InMemoryUserRepository` em testes.

### Interface Segregation (ISP)

- **Repository Interfaces**: Cada interface define apenas os métodos necessários para aquela entidade. `IUserRepository` não contém métodos de curso.
- **Guards**: `JwtAuthGuard` trata autenticação. `RolesGuard` trata autorização. Responsabilidades separadas.

### Dependency Inversion (DIP)

- **Use Cases dependem de abstrações**: O domínio declara `IUserRepository`; a infraestrutura implementa `TypeOrmUserRepository`.
- **Injeção via token**: `@Inject('IUserRepository')` nos use cases, `provide: 'IUserRepository', useClass: TypeOrmUserRepository` nos módulos.

---

## Tratamento de Erros

### Backend

| Camada | Estratégia |
|--------|-----------|
| **DTOs** | Validação automática via `ValidationPipe` com `whitelist: true` e `transform: true`. Campos inválidos retornam `400 Bad Request` com mensagens descritivas. |
| **Guards** | `JwtAuthGuard` lança `UnauthorizedException` (401). `RolesGuard` lança `ForbiddenException` (403). |
| **Use Cases** | Exceções de negócio via classes HTTP do NestJS (`NotFoundException`, `ConflictException`). |
| **Repositórios** | Erros de banco propagam naturalmente via TypeORM e são capturados pelo Exception Filter padrão do NestJS. |

### Frontend

| Camada | Estratégia |
|--------|-----------|
| **ApiClient** | Intercepta `response.status === 401` e dispara evento global `auth:unauthorized` para logout automático. |
| **ApiClient** | Erros HTTP geram `Error` com `message` extraída de `data.message`, `data.error` ou status code. |
| **AuthContext** | `try/catch` em operações de reidratação. Falha no refresh aciona `logout()` silencioso. |
| **Pages** | `try/catch` nas chamadas de API com feedback visual ao usuário. |

---

## Testes

### Tipos de Teste Configurados

| Tipo | Framework | Configuração |
|------|----------|-------------|
| **Unitários** | Jest `^30.0.0` + ts-jest | `testRegex: '.*\\.spec\\.ts$'` |
| **Integração HTTP** | Supertest `^7.0.0` | Via `@nestjs/testing` com `Test.createTestingModule()` |
| **E2E** | Jest + Supertest | Configuração separada em `test/jest-e2e.json` |

### Estrutura de Teste

```
apps/backend/
├── src/
│   └── app.controller.spec.ts    # Testes unitários junto ao código
└── test/                          # Testes E2E separados
```

### Cobertura

Comando para relatório de cobertura:

```bash
npm run test:cov
```

Coleta de cobertura configurada para todos os arquivos `.(t|j)s`, excluindo `node_modules` e `dist`.

---

## Segurança

### Autenticação

| Aspecto | Implementação |
|---------|--------------|
| **Hash de Senhas** | `bcryptjs` com salt rounds configurável via `BCRYPT_SALT_ROUNDS` |
| **JWT** | Tokens assinados com `JWT_SECRET_KEY`, expiração configurável via `JWT_EXPIRATION` |
| **Estratégia** | Bearer Token extraído do header `Authorization` via Passport |
| **Timeout de Sessão** | Token expira automaticamente conforme `JWT_EXPIRATION` (padrão: `24h`) |

### Autorização

| Aspecto | Implementação |
|---------|--------------|
| **RBAC** | Role-Based Access Control com enum `UserRole` (admin/student) |
| **Guard de Roles** | `RolesGuard` verifica `@Roles()` decorator contra `user.role` do JWT payload |
| **Rotas Privadas (Frontend)** | `PrivateRoute` wrapper redireciona para `/login` se `!isAuthenticated` |

### Sanitização e Validação

| Aspecto | Implementação |
|---------|--------------|
| **Input Validation** | `class-validator` nos DTOs com `whitelist: true` (campos extras são removidos) |
| **Transform** | `class-transformer` com `transform: true` para conversão automática de tipos |
| **Markdown Sanitization** | `rehype-sanitize` no frontend para prevenir XSS em conteúdo Markdown |
| **CORS** | Habilitado globalmente via `app.enableCors()` |

### Gestão de Variáveis de Ambiente

Variáveis sensíveis são gerenciadas via arquivos `.env` **não versionados** (incluídos no `.gitignore`). Templates disponíveis em `.env.test`:

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

### Boas Práticas de Segurança Adicionais

- Arquivos `.env.production` **nunca são versionados** — são específicos do servidor.
- `JWT_SECRET_KEY` deve ser uma string longa e aleatória em produção.
- `BCRYPT_SALT_ROUNDS` recomendado: `10` a `12` para equilíbrio entre segurança e performance.
- Frontend não armazena dados sensíveis além do `accessToken` necessário para sessão.
- Logout automático ao receber `401 Unauthorized` de qualquer endpoint.
