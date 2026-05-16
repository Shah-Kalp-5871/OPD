# SCHEMA MERGE ANALYSIS
**Task:** Enterprise Schema Integration while preserving Current Schema backward-compatibility

## 1. Overview
The goal of this merge is to integrate the `FULL_PRISMA_SCHEMA_DESIGN.prisma` (enterprise version) into the existing `backend/prisma/schema.prisma` without breaking any existing frontend pages, NestJS APIs, or real-time (SSE) queue logic.

## 2. Current Schema Audit
### Actively Used Models
- **Auth/Profiles:** `User`, `AdminProfile`, `ReceptionProfile`, `DoctorProfile`, `NurseProfile`, `MedicalProfile`.
- **Patient Hub:** `Patient`, `PatientProfile`, `PatientVitals` (note the 's').
- **Workflow:** `PatientCase`, `QueueEntry`, `VisitSession`, `QueueHistory`.
- **Billing:** `Bill`, `BillItem`.
- **Clinical:** `ConsultationRecord`, `ComplaintEntry`, `ClinicalHistory`.

### Deprecation & Evolution Rules
1. **Never Rename:** `PatientVitals`, `VisitSession`, `PatientCase`, `QueueEntry`. The frontend and backend (`patients.service.ts`, `queue.service.ts`) heavily depend on exact names and relations.
2. **Safe to Add:** All new domains (`AuditLog`, `DrugInventory`, `InvestigationOrder`, `Notification`, etc.) can be safely added as they do not conflict with existing logic.

## 3. Field-Level Compatibility

### `User`
- **Old Schema:** Uses `name` (String), `password` (String).
- **New Schema:** Uses `firstName`, `lastName`, `passwordHash`.
- **Resolution:** Keep `name` and `password`. Add `firstName`, `lastName` as optional fields for future migration. Keep `lastLoginAt`, `deletedAt`, etc.

### `Profiles`
- **Old Schema:** Uses specific profile tables (`AdminProfile`, `ReceptionProfile`, `NurseProfile`, `MedicalProfile`).
- **New Schema:** Consolidates into `StaffProfile`.
- **Resolution:** Keep all old specific profile tables to avoid breaking the `UserService` and `StaffService`. Do not introduce `StaffProfile` yet, or introduce it alongside for new features only.

### `PatientProfile`
- **Old Schema:** Contains flat fields for address (`address`, `city`, `state`), `allergies` (String), `bloodGroup` (String).
- **New Schema:** Uses ENUM for `BloodGroup`, moves address to `PatientAddress` (1-to-N), moves allergies to `PatientAllergy` (1-to-N).
- **Resolution:** Keep flat string fields (`address`, `city`, `state`, `allergies`, `bloodGroup`) on `PatientProfile` to prevent breaking `patients.service.ts` profile completion logic. Add relation arrays (`addresses`, `allergyRecords`) to `Patient` for enterprise scaling, allowing dual-write or gradual UI updates later.

### `QueueEntry`
- **Old Schema:** `queueType` is `QueueType` enum (`OPD`, `FOLLOWUP`, etc.).
- **Resolution:** Maintain existing enums (`QueueType`, `QueueStatus`, `CaseStage`) precisely as they are.

### `PatientCase`
- **Old Schema:** Uses `stage` (Enum: `CaseStage`), `priority` (String).
- **Resolution:** Keep `stage` field. Add missing enterprise fields.

## 4. Migration Strategy
1. **Append, Don't Replace:** Add all new enterprise models and enums to the bottom of the schema file.
2. **Expand Existing Models:** Add new enterprise columns (like `deletedAt`) to existing tables (`User`, `Patient`, `Bill`).
3. **Relation Mapping:** Ensure any new 1-to-many relations point to the existing ID structures.

This ensures zero-downtime and zero broken APIs while setting the stage for future refactoring.
