# MIGRATION RISK REPORT
**Task:** Enterprise Schema Integration

## 1. Executive Summary
This report analyzes the risks associated with applying the `PRODUCTION_SCHEMA.prisma` over the current operational database. Because we adopted a "Merge and Append" strategy rather than a "Replace" strategy, the risk of breaking existing functionalities is strictly minimized.

## 2. Potential Breaking Changes & Risks

### A. Strict Enums vs Strings
- **Risk Level:** Medium
- **Detail:** In the legacy schema, fields like `Patient.gender` and `PatientProfile.bloodGroup` were stored as plain `String`. The new enterprise schema uses Enums (`Gender`, `BloodGroup`).
- **Mitigation:** We have kept the old string fields (`gender`, `bloodGroup`) intact. The new enum fields were added as `genderEnum` and `bloodGroupEnum` with default values (`UNKNOWN`). 
- **Required Action:** No immediate break. Future backend updates will need to sync data from the legacy string field to the new Enum field during updates.

### B. Prisma Relation Mappings
- **Risk Level:** Low to Medium
- **Detail:** New relations were added to `PatientCase` (e.g., `PatientCase` to `PatientVitals`, `Bill` list).
- **Mitigation:** Existing singular/nullable relations like `PatientVitals.caseId` were preserved, but we formalized the reverse relation (`PatientCase.vitalsList`). Same for Bills (`PatientCase.bill` vs `PatientCase.billsList`).
- **Required Action:** Ensure NestJS services that `include` these tables use the correct legacy property name until fully refactored.

### C. Database Size & Indexing
- **Risk Level:** Low
- **Detail:** We added over 20 new tables. Running `prisma migrate dev` will execute a massive CREATE TABLE script.
- **Mitigation:** New tables are isolated. They do not drop or alter existing columns. The migration is purely additive.
- **Required Action:** Run the migration during off-peak hours. 

## 3. Required Frontend Updates
Currently: **NONE**.
Because the backend API signatures have not changed, the frontend will continue to receive the JSON shapes it expects.

**Future Requirements:**
- When the frontend implements the new `ProcedureSession` or `InvestigationOrder` modules, it will consume new endpoints.
- Update the Reception Patient Profile Edit form to send ENUMS instead of free-text strings for `gender` and `bloodGroup` once the API is updated to dual-write.

## 4. Required Backend Updates
Currently: **NONE** for compiling and running.
- **Immediate Task Post-Migration:** Run `npx prisma generate` to update the Prisma Client. 
- **Next Step:** Update `patients.service.ts` to begin writing to `firstName` and `lastName` in the `User` table, in addition to the legacy `name` field, to prepare for phase-out of the legacy field.

## 5. Safe Migration Order
1. **Backup:** Perform a `pg_dump` of the current database.
2. **Dry Run:** Run `npx prisma migrate dev --create-only` to review the generated SQL. Verify no `DROP TABLE` or `ALTER COLUMN ... DROP` commands exist for legacy fields.
3. **Execute:** Run `npx prisma migrate deploy` to apply the changes to production.
4. **Client Update:** Run `npx prisma generate` and restart the NestJS server.
5. **Verify:** Check the Reception Hub and Doctor Dashboard to ensure SSE Queue logic and Patient Vitals loading remain unaffected.
