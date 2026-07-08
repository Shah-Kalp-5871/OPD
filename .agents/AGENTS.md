# OPD System Agent Rules

These rules have been compiled based on past debugging sessions and production incidents. Agents must strictly adhere to these guidelines when working on this project.

## 1. HTTP Environment Compatibility (CRITICAL)
- **Context:** The production environment currently runs over standard HTTP (e.g., `http://187.127.131.26:8080`), not HTTPS.
- **Rule:** Do NOT use `crypto.randomUUID()` or any Web Crypto API that requires a secure context. Calling `crypto.randomUUID()` on HTTP will result in `undefined`, throwing a `TypeError` and crashing the React app (yielding an `Uncaught error: {}` in error boundaries).
- **Solution:** Use safe alternatives for local/idempotency keys, such as `Date.now().toString() + Math.random().toString(36).substring(2)`.

## 2. API URL Prefixing (Double `/api` Bug)
- **Context:** The Axios instance in `frontend/lib/api.ts` automatically ensures the base URL ends with `/api` (based on `NEXT_PUBLIC_API_URL`).
- **Rule:** When manually constructing absolute URLs for services that don't use the Axios instance (like `EventSource` for SSE), check if `APP_CONFIG.API_BASE_URL` already includes `/api` before appending it again.
- **Solution:** Use the updated `getApiUrl` utility in `frontend/lib/path-utils.ts` which handles this safely. Do not hardcode `/api` prefixes in SSE paths.

## 3. Database Schema Verification
- **Context:** The schema (`prisma/schema.prisma`) evolves rapidly. In the past, queries and seed scripts (`seed-drugs.ts`, etc.) have crashed because they referenced outdated models (e.g., `SimpleDrug`) or fields (e.g., `drugName` vs `name`).
- **Rule:** Always inspect `prisma/schema.prisma` before writing Prisma queries, updates, or seeding scripts. Do not guess model names or properties from old files.

## 4. PM2 Server Management
- **Context:** The production server hosts multiple node applications.
- **Rule:** The PM2 processes for this project are named `opd-backend` and `opd-frontend`. 
- **Warning:** Do NOT restart processes with the `fylex-` prefix, as they belong to a completely different application on the same server.

## 5. Production Database Migrations
- **Context:** `prisma migrate deploy` can fail if the migration history gets out of sync (e.g., migrations deleted from the codebase but present in the DB).
- **Rule:** Do not blindly run `prisma migrate reset` or drop tables in production. Use a baselining strategy: squash/re-create the baseline migration, run `npx prisma migrate resolve --applied <migration_name>`, and follow up with `npx prisma db push --accept-data-loss` (after confirming no destructive changes to core data) to sync the schema.
