# Project Development Rules

This document outlines the coding standards, behavioral expectations, and safety rules for developing the OPD Clinic Management System.

## 1. General Principles
- **Clarity over Cleverness:** Write code that is easy to read and maintain.
- **Consistency:** Follow the established patterns in the codebase.
- **Separation of Concerns:** Keep frontend, backend, and database logic strictly separated.

## 2. Coding Rules
- **Type Safety:** Always use TypeScript interfaces or types. Avoid `any` at all costs.
- **DRY (Don't Repeat Yourself):** Extract common logic into utility functions or shared services.
- **Documented Logic:** Use meaningful variable names. Add comments for complex business logic.
- **Error Handling:** Use try-catch blocks in services and throw appropriate NestJS exceptions (e.g., `NotFoundException`, `UnauthorizedException`).

## 3. Architecture Rules
- **Controller-Service Pattern:** Controllers handle requests; Services handle business logic.
- **DTOs:** Use Data Transfer Objects for all incoming data validation.
- **Modules:** Every major feature must have its own module (e.g., `PatientModule`, `DoctorModule`).
- **Global Services:** Only core utilities (like Prisma) should be global.

## 4. Database & Migration Rules
- **Migration First:** Never modify the database schema directly. Always use Prisma migrations.
- **Migration Naming:** Use descriptive names for migrations (e.g., `add-user-table`, `update-patient-fields`).
- **Safety:** Before running a migration, ensure the `.env` points to the correct database.
- **Seeds:** Use `prisma/seed.ts` for populating initial data (roles, admin users).

## 5. API Standards
- **Versioned:** (Optional) Prefer `/api/v1/...` prefix.
- **Uniformity:** Return a consistent response object format.
- **Validation:** Use `ValidationPipe` globally in the backend.

## 6. Security Standards
- **Passwords:** Always hash passwords with `bcrypt` (rounds: 10).
- **Authentication:** Protect clinical routes with `AuthGuard` (JWT).
- **Authorization:** Use RBAC to ensure users only see data they are permitted to.
- **Environment:** Secrets must never be committed to Git. Use `.env` and `.env.example`.

## 7. Git Conventions
- **Branches:** Use feature branches (`feature/add-billing`, `fix/login-bug`).
- **Commits:** Use conventional commits:
    - `feat:` for new features
    - `fix:` for bug fixes
    - `docs:` for documentation changes
    - `refactor:` for code changes that neither fix a bug nor add a feature

## 8. AI Agent Behavioral Rules
- **Context Awareness:** Read `STACK.md` and `PROJECT_RULES.md` before making changes.
- **Incremental Changes:** Do not delete large blocks of code without explanation.
- **No Restructuring:** Maintain the current folder hierarchy.
- **Verification:** Always run appropriate linting or testing commands after a change.
- **Transparency:** Clearly explain what was changed and why.

## 9. Migration Safety Checklist
1. Update `prisma/schema.prisma`.
2. Review the impact on existing data.
3. Run `npx prisma migrate dev --name <name>`.
4. Verify migration success in Prisma Studio.
5. Generate the client: `npx prisma generate`.
