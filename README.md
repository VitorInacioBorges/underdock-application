# 🇧🇷​ / 🇵🇹​ Projeto UnderDock

[Português](#course-manager-dashboard) 🇧🇷​ / 🇵🇹​ | [English](#course-manager-dashboard-english) 🇺🇸​ / 🇬🇧​ / 🇨🇦​ / 🇦🇺​

Plataforma de aprendizado, autoaperfeiçoamento, manutenção e criação de cursos por Vitor Inacio Borges.

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
| [ARCHITECTURE.md](./documentation/portuguese/ARCHITECTURE.md)     | Fundação arquitetural, justificativas e fluxo de dados    |
| [DIRECTORIES.md](./documentation/portuguese/DIRECTORIES.md)       | Mapeamento completo de diretórios e responsabilidades     |
| [TECHNOLOGIES.md](./documentation/portuguese/TECHNOLOGIES.md)     | Stack, metodologias e gerenciamento de estado             |
| [CONVENTIONS.md](./documentation/portuguese/CONVENTIONS.md)       | Padrões de nomeação, organização e design patterns        |
| [BEST-PRACTICES.md](./documentation/portuguese/BEST-PRACTICES.md) | Princípios SOLID, tratamento de erros, testes e segurança |
| [PREREQUISITES.md](./documentation/portuguese/PREREQUISITES.md)   | Dependências de sistema, ferramentas e hardware           |
| [EXECUTION.md](./documentation/portuguese/EXECUTION.md)           | Setup local, variáveis de ambiente, migrations e deploy   |

## Estrutura Geral

```
course-manager-dashboard/
├── apps/
│   ├── backend/          # API NestJS (Clean Architecture)
│   └── frontend/         # SPA React + Vite
├── documentation/
│   ├── english/          # Documentação em Inglês
│   └── portuguese/       # Documentação em Português
└── README.md             # Este arquivo
```

---

# 🇺🇸​ / 🇬🇧​ / 🇨🇦​ / 🇦🇺​ UnderDock Project (English)

[Português](#course-manager-dashboard) 🇧🇷​ / 🇵🇹​ | [English](#course-manager-dashboard-english) 🇺🇸​ / 🇬🇧​ / 🇨🇦​ / 🇦🇺​

Learning, self-improvement, maintenance, and course creation platform by Vitor Inacio Borges.

## Purpose

To offer a complete environment of courses, classes, exercises, and progress tracking for students, with an administrative panel for content management. It also serves as a basis for learning the technologies used in the project and as a portfolio project. The project can also be hosted on a managed or unmanaged VPS for personal use.

## Objectives

- **Course Management**: Creation, editing, and publishing of courses with linked classes and exercises.
- **Student Progress**: Tracking of completed lessons, exercise submissions, and feedback.
- **Secure Authentication**: Login system with JWT, role-based access control (admin/student).
- **Administrative Panel**: Dedicated interface for administrators to create and manage all platform content.

## Services

| Service          | Description                                                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Backend API**  | REST API built in **NestJS** with **Clean Architecture**, persistence via **TypeORM**, and **PostgreSQL** database. |
| **Frontend SPA** | User interface in **React 19** with **Vite 8**, protected routing, and CSS Modules.                               |

## Technical Documentation

| Document                                 | Description                                                 |
| ---------------------------------------- | ----------------------------------------------------------- |
| [ARCHITECTURE.md](./documentation/english/ARCHITECTURE.md)     | Architectural foundation, justifications, and data flow    |
| [DIRECTORIES.md](./documentation/english/DIRECTORIES.md)       | Complete mapping of directories and responsibilities       |
| [TECHNOLOGIES.md](./documentation/english/TECHNOLOGIES.md)     | Stack, methodologies, and state management                 |
| [CONVENTIONS.md](./documentation/english/CONVENTIONS.md)       | Naming patterns, organization, and design patterns         |
| [BEST-PRACTICES.md](./documentation/english/BEST-PRACTICES.md) | SOLID principles, error handling, testing, and security    |
| [PREREQUISITES.md](./documentation/english/PREREQUISITES.md)   | System dependencies, tools, and hardware                   |
| [EXECUTION.md](./documentation/english/EXECUTION.md)           | Local setup, environment variables, migrations, and deployment |

## General Structure

```
course-manager-dashboard/
├── apps/
│   ├── backend/          # NestJS API (Clean Architecture)
│   └── frontend/         # React + Vite SPA
├── documentation/
│   ├── english/          # English Documentation
│   └── portuguese/       # Portuguese Documentation
└── README.md             # This file
```
