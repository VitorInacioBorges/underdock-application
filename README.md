# Course Manager Dashboard

Plataforma de aprendizado, autoaperfeiçoamento, manutenção e criação de cursos por Vitor Inacio Borges.

---

## Propósito

Oferecer um ambiente completo de cursos, aulas, exercícios e acompanhamento de progresso para estudantes, com painel administrativo para gerenciamento de conteúdo. Também serve como base para aprendizado das tecnologias utilizadas no projeto e como projeto de portfólio. O projeto também pode ser hospedado em uma VPS managed ou unmanaged para uso pessoal. 

## Objetivos

- **Gestão de Cursos**: Criação, edição e publicação de cursos com aulas e exercícios vinculados.
- **Progresso do Aluno**: Rastreamento de lições concluídas, submissões de exercícios e feedbacks.
- **Autenticação Segura**: Sistema de login com JWT, controle de acesso baseado em roles (admin/student).
- **Painel Administrativo**: Interface dedicada para administradores criarem e gerenciarem todo o conteúdo da plataforma.

## Serviços

| Serviço          | Descrição                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Backend API**  | API REST construída em **NestJS** com **Clean Architecture**, persistência via **TypeORM** e banco **PostgreSQL**. |
| **Frontend SPA** | Interface de usuário em **React 19** com **Vite 8**, roteamento protegido e CSS Modules.                           |

## Documentação Técnica

| Documento                                | Descrição                                                 |
| ---------------------------------------- | --------------------------------------------------------- |
| [ARCHITECTURE.md](./ARCHITECTURE.md)     | Fundação arquitetural, justificativas e fluxo de dados    |
| [DIRECTORIES.md](./DIRECTORIES.md)       | Mapeamento completo de diretórios e responsabilidades     |
| [TECHNOLOGIES.md](./TECHNOLOGIES.md)     | Stack, metodologias e gerenciamento de estado             |
| [CONVENTIONS.md](./CONVENTIONS.md)       | Padrões de nomeação, organização e design patterns        |
| [BEST-PRACTICES.md](./BEST-PRACTICES.md) | Princípios SOLID, tratamento de erros, testes e segurança |
| [PREREQUISITES.md](./PREREQUISITES.md)   | Dependências de sistema, ferramentas e hardware           |
| [EXECUTION.md](./EXECUTION.md)           | Setup local, variáveis de ambiente, migrations e deploy   |

## Estrutura Geral

```
auto-improvement-application/
├── apps/
│   ├── backend/          # API NestJS (Clean Architecture)
│   └── frontend/         # SPA React + Vite
├── ARCHITECTURE.md
├── DIRECTORIES.md
├── TECHNOLOGIES.md
├── CONVENTIONS.md
├── BEST-PRACTICES.md
├── PREREQUISITES.md
├── EXECUTION.md
└── README.md             # Este arquivo
```
