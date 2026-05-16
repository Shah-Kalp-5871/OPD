# DATABASE EVOLUTION PLAN
**Task:** Phased Rollout for Enterprise Architecture

This document outlines the zero-downtime strategy to transition from the current monolithic schema usages to the fully normalized enterprise architecture mapped in `PRODUCTION_SCHEMA.prisma`.

## Phase 1: Additive Schema Merge (Current Phase)
**Goal:** Introduce new tables and fields without breaking existing code.
- **Action:** Applied `PRODUCTION_SCHEMA.prisma`.
- **Result:** Database gains ~20 new tables and ~30 new fields on existing tables.
- **Impact:** Zero impact. Existing APIs continue to read/write to legacy fields (`User.name`, `Patient.gender` as string).

## Phase 2: Dual-Write API Implementation
**Goal:** Begin populating new enterprise fields alongside legacy fields.
- **Action:** Update NestJS services.
  - When creating a `User`, write to `name` AND `firstName`/`lastName`.
  - When updating `PatientProfile`, map string `bloodGroup` to `bloodGroupEnum`.
- **Result:** New columns start getting real data. Old columns still serve the frontend.
- **Impact:** Minor backend updates. No frontend changes required.

## Phase 3: Data Backfill Scripting
**Goal:** Sync historical data into new normalized structures.
- **Action:** Write one-off Prisma scripts (`seed-migration.ts`).
  - Parse `User.name` and split into `firstName` and `lastName` for old users.
  - Convert `PatientProfile.address` into rows in the new `PatientAddress` table.
- **Result:** Enterprise tables are now fully populated with both old and new data.

## Phase 4: Frontend Component Switch
**Goal:** Switch UI components to read/write using the new enterprise endpoints.
- **Action:** Update React components.
  - Change `<ProfileView name={user.name} />` to `<ProfileView firstName={user.firstName} lastName={user.lastName} />`.
  - Update dropdowns to strictly use the new Enum values.
- **Result:** Frontend is now fully decoupled from legacy fields.

## Phase 5: Deprecation & Cleanup
**Goal:** Remove technical debt and legacy columns.
- **Action:** Once logs confirm that no API calls are reading from or writing to the legacy fields, create a final Prisma migration to `DROP COLUMN`.
  - Remove `name` from `User`.
  - Remove `gender` string from `Patient`.
  - Drop obsolete profile tables (`AdminProfile`, etc.) in favor of the unified `StaffProfile` (if fully migrated).
- **Result:** The schema is now pristine, highly normalized, and fully enterprise-grade.

## Future Scalability Notes
- **Horizontal Scaling:** The heavy use of UUIDs ensures that if MedFlow opens a second branch with an offline-first local database, merging the databases centrally later will not result in ID collisions.
- **Microservices Readiness:** The schema is strongly domain-separated. The `Pharmacy` tables (Drug, Inventory, Batches) have no hard foreign keys to the core `User` profile, meaning Pharmacy can easily be split into a separate microservice and separate database if hospital load requires it in the future.
