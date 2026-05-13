# Technical Stack & Architecture

This document serves as the single source of truth for the project's technical architecture, development standards, and implementation conventions. All contributors (including AI agents) must adhere to these standards to ensure consistency and scalability.

## 1. Project Overview
A comprehensive clinic management system designed for OPD (Outpatient Department) operations, including patient registration, clinical consultations, billing, and pharmacy management.

## 2. Core Technology Stack
| Layer | Technology | Version |
| :--- | :--- | :--- |
| **Runtime** | Node.js | v18+ |
| **Package Manager** | npm | Latest |
| **Frontend Framework** | Next.js | Latest (App Router) |
| **Backend Framework** | NestJS | Latest |
| **Language** | TypeScript | Latest |
| **Styling** | Tailwind CSS | Latest |
| **Database** | PostgreSQL | Latest |
| **ORM** | Prisma | Latest |

## 3. Frontend Stack
- **Framework:** Next.js (TypeScript)
- **Styling:** Tailwind CSS (Vanilla CSS where needed)
- **State Management:** React Context / Zustand (as needed)
- **Components:** Shadcn/UI (Recommended)
- **Icons:** Lucide React
- **Animations:** Framer Motion

## 4. Backend Stack
- **Framework:** NestJS
- **Modules:** Modular architecture (isolated features)
- **Validation:** `class-validator` + `class-transformer`
- **Error Handling:** Global Exception Filters

## 5. Database & ORM
- **Provider:** PostgreSQL
- **ORM:** Prisma
- **Pattern:** Migration-first workflow
- **Prisma Service:** Global module pattern (`PrismaService` extending `PrismaClient`)
- **Workflow:**
    1. Update `schema.prisma`
    2. Run `npm run prisma:migrate -- --name <description>`
    3. Run `npm run prisma:generate`

## 6. Authentication & Security
- **Strategy:** JWT (JSON Web Tokens)
- **Hashing:** bcrypt
- **Access Control:** Role-Based Access Control (RBAC) via Guards
- **Standards:**
    - Never store plain-text passwords.
    - Use HttpOnly cookies or Secure headers for token storage.
    - Validate all DTOs at the entry point.

## 7. Repository Structure

### Root Directory
```text
/opd-system
├── /frontend       # Next.js Application
├── /backend        # NestJS Application
├── STACK.md         # Architecture & Tech Stack
└── PROJECT_RULES.md # Standards & Rules
```

### Backend Structure
```text
/backend
├── /prisma          # Schema & Migrations
├── /src
│   ├── /prisma      # Global Prisma Module/Service
│   ├── /auth        # Auth logic (Guards, Strategies)
│   ├── /users       # User management
│   ├── /common      # Decorators, Filters, Interceptors
│   ├── app.module.ts
│   └── main.ts
└── .env             # Environment Secrets
```

### Frontend Structure
```text
/frontend
├── /app             # Next.js App Router (Pages)
├── /components      # Reusable UI components
│   ├── /ui          # Atomic components (Shadcn)
│   └── /shared      # Business components
├── /lib             # Utils, hooks, constants
└── /public          # Static assets
```

## 8. Environment Variables
Environment variables must be used for all secrets. Never hardcode credentials.

| Variable | Description | Placeholder Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL Connection String | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret for token signing | `your-super-secret-key` |
| `PORT` | Application Port | `3001` |

## 9. Port Conventions
- **Frontend:** `3000`
- **Backend:** `3001` (or as configured in `.env`)
- **Database:** `5432`

## 10. Development Commands
- **Install:** `npm install`
- **Dev Mode:** `npm run start:dev` (Backend) / `npm run dev` (Frontend)
- **Build:** `npm run build`
- **Prisma Studio:** `npm run prisma:studio`

## 11. API Standards
- **RESTful:** Use proper HTTP verbs (GET, POST, PUT, DELETE).
- **Response Structure:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional feedback message",
  "meta": { "total": 100, "page": 1 } // For paginated results
}
```

## 12. Naming Conventions
- **Classes/Interfaces:** `PascalCase` (e.g., `UserService`)
- **Variables/Methods:** `camelCase` (e.g., `getUserById`)
- **Folders/Files:** `kebab-case` (e.g., `prisma-service.ts`)
- **Database:** `snake_case` (only if explicitly required by DB conventions)

## 13. AI Agent Instructions
When working on this project, AI agents must:
- **Follow Existing Patterns:** Do not introduce new libraries or architectures without explicit request.
- **Maintain Modularization:** Keep services and modules isolated.
- **Prisma Workflow:** Always update the schema first and run migrations/generation.
- **Security:** Never remove validation decorators or auth guards.
- **No Restructuring:** Do not change folder structures or move core files.
- **Placeholders:** Never output actual passwords or API keys in logs or documentation.

## 14. Future Scalability
- **Microservices:** Designed for easy extraction of modules into separate services.
- **Caching:** Redis-ready for future performance optimization.
- **Storage:** S3-ready for clinical image management.
