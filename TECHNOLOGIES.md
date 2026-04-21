# Metodologias e Tecnologias

## Stack Principal

### Backend

| Tecnologia | Versão | Função |
|-----------|--------|--------|
| **Node.js** | Runtime JavaScript | Ambiente de execução server-side |
| **TypeScript** | `^5.7.3` | Tipagem estática para segurança em tempo de compilação |
| **NestJS** | `^11.0.1` | Framework opinado para APIs REST com DI nativa |
| **TypeORM** | `^0.3.28` | ORM com suporte a migrations, decoradores e repositórios |
| **PostgreSQL** | Via `pg ^8.18.0` | Banco de dados relacional para persistência |
| **Passport.js** | `^0.7.0` | Middleware de autenticação extensível |
| **@nestjs/jwt** | `^11.0.2` | Geração e validação de JSON Web Tokens |
| **bcryptjs** | `^3.0.3` | Hash de senhas com salt rounds configurável |
| **class-validator** | `^0.14.3` | Validação de DTOs via decoradores (`@IsEmail`, `@MinLength`) |
| **class-transformer** | `^0.5.1` | Transformação e serialização de objetos |

### Frontend

| Tecnologia | Versão | Função |
|-----------|--------|--------|
| **React** | `^19.2.4` | Biblioteca para construção de interfaces reativas |
| **React DOM** | `^19.2.4` | Renderização no navegador |
| **Vite** | `^8.0.0` | Bundler e dev server com HMR instantâneo |
| **React Router DOM** | `^7.13.1` | Roteamento SPA com rotas protegidas |
| **react-markdown** | `^10.1.0` | Renderização de Markdown em componentes React |
| **remark-gfm** | `^4.0.1` | Suporte a tabelas, checklists e GFM no Markdown |
| **rehype-raw** | `^7.0.0` | Permite HTML inline em conteúdo Markdown |
| **rehype-sanitize** | `^6.0.0` | Sanitização de HTML para prevenir XSS |

### Ferramentas de Desenvolvimento

| Ferramenta | Função |
|-----------|--------|
| **ESLint** `^9.18.0+` | Linting de código TypeScript e JSX |
| **Prettier** `^3.4.2` | Formatação consistente de código |
| **Jest** `^30.0.0` | Framework de testes unitários |
| **ts-jest** `^29.2.5` | Transformador TypeScript para Jest |
| **Supertest** `^7.0.0` | Testes HTTP de integração |
| **@vitejs/plugin-react** `^6.0.0` | Plugin Vite para JSX e Fast Refresh |

---

## Metodologia de Desenvolvimento

### Clean Architecture

O backend segue estritamente **Clean Architecture** com três camadas:

- **Domain**: Entidades de negócio, interfaces de repositório e use cases. Zero dependências externas.
- **Application**: DTOs com validação para transporte de dados entre camadas.
- **Infrastructure**: Implementações concretas — controllers HTTP, repositórios TypeORM, autenticação JWT.

### Conventional Commits

O projeto utiliza **Conventional Commits** em português brasileiro (pt-BR) com commits agrupados por diretório:

```
feat(backend/controllers): adiciona endpoint de login
fix(frontend/pages): corrige redirecionamento após registro
```

### Modularização NestJS

Cada domínio de negócio é encapsulado em um **módulo NestJS** independente, registrando seus próprios controllers, providers e repositórios. O `AuthModule` é `@Global()` para disponibilizar JWT em todos os módulos.

---

## Gerenciamento de Estado e Dados

### Backend — Persistência

| Aspecto | Implementação |
|---------|--------------|
| **ORM** | TypeORM com padrão Active Record via `Repository<T>` |
| **Migrations** | CLI TypeORM com `DataSource` dedicado em `data-source.ts` |
| **Schema Sync** | `synchronize: true` em desenvolvimento, `synchronize: false` no DataSource de migrations |
| **Conexão** | Pool de conexões PostgreSQL via driver `pg` |
| **UUID** | IDs gerados automaticamente via `@PrimaryGeneratedColumn('uuid')` |

### Frontend — Estado Global

| Aspecto | Implementação |
|---------|--------------|
| **Autenticação** | `AuthContext` via React Context API |
| **Token JWT** | Armazenado em `localStorage` como `auth_session` |
| **Reidratação** | Na inicialização, token é restaurado e dados do usuário recarregados via `/users/profile` |
| **Interceptor 401** | `apiClient` dispara evento `auth:unauthorized`, que aciona `logout()` automático |
| **Estado Local** | `useState` e `useEffect` nativos do React para estado por componente |

### Comunicação Frontend ↔ Backend

| Aspecto | Implementação |
|---------|--------------|
| **HTTP Client** | Classe `ApiClient` customizada sobre `fetch` nativo |
| **Base URL** | Definida via variável de ambiente `VITE_API_URL` |
| **Autenticação** | Header `Authorization: Bearer <token>` adicionado automaticamente |
| **Content-Type** | `application/json` por padrão, `FormData` para uploads |
| **CORS** | Habilitado globalmente no NestJS via `app.enableCors()` |
