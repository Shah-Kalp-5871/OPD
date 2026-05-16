# Database & Architecture Audit — MedFlow OPD

**Runtime schema:** `backend/prisma/schema.prisma`  
**Planning schemas:** `db_doc/FULL_PRISMA_SCHEMA_DESIGN.prisma`, `db_doc/PRODUCTION_SCHEMA.prisma` (not deployed)

---

## 1. Schema statistics

| Metric | Count |
|--------|-------|
| Models | 76 |
| Enums | 18 |
| Models referenced in `backend/src` | ~43 |
| Models unused by application code | ~33 |

---

## 2. Enums (all)

`Role`, `CaseStage`, `QueueStatus`, `QueueType`, `Gender`, `MaritalStatus`, `BloodGroup`, `CasePriority`, `AppointmentStatus`, `BillStatus`, `PaymentMode`, `PaymentStatus`, `ConsultationStatus`, `StockStatus`, `FollowupStatus`, `InvestigationStatus`, `ProcedureStatus`, `NotificationType`, `NotificationStatus`, `ConsentStatus`, `Severity`

**Issue:** Many entities store **both** `String` status and `*Enum` field (dual representation) — sync drift risk.

Examples:
- `PatientCase.status` (String) + `stage` (CaseStage)
- `Bill.paymentStatus` (String) + `paymentStatusEnum` (BillStatus)
- `ConsultationRecord.status` (String) + `statusEnum`

---

## 3. Unused models (defined, zero app references)

`AdminProfile`, `StaffProfile` (staff uses User+profile tables differently), `UserSession`, `AuthorizedDevice`, `LoginHistory`, `OtpVerification`, `ActivityLog`, `Clinic`, `Branch`, `Department`, `Room`, `ClinicSetting`, `PatientAddress`, `PatientGuardian`, `PatientDocument`, `PatientFlag`, `PatientAllergy`, `PatientHistory`, `PatientInsurance`, `PatientNote`, `Followup`, `Reminder`, `CaseStatusHistory`, `CaseNote`, `CaseTag`, `QueueCall`, `DrugBatch`, `ProcedureParameter`, `ProcedureConsumable`, `ProcedureImage`, `LabReferenceRange`, `NotificationTemplate`, `Notification`, `ImageFolder`, `ComparisonSession`, `DailyStatistic`, `ClinicExpense`, `MasterSetting`

**Architecture smell:** Schema designed for enterprise clinic suite; application is a **subset implementation**.

---

## 4. Duplicate / redundant fields

| Model | Issue |
|-------|-------|
| `User` | `password` + `passwordHash` — which is canonical? |
| `Patient` | `gender` (String) + `genderEnum` |
| `PatientProfile` | `bloodGroup` + `bloodGroupEnum`, `maritalStatus` + `maritalStatusEnum` |
| `Bill` | `caseId` unique + optional `patientCaseId` second relation `CaseBillsList` — confusing dual FK |
| `PatientCase` | `bill` 1:1 + `billsList` 1:n — ambiguous billing model |

---

## 5. Missing relations / weak constraints

| Gap | Impact |
|-----|--------|
| `QueueEntry.doctorId` optional | Orphan queue entries possible |
| `Holiday.branchId` without Branch FK relation in schema | Orphan holidays |
| No FK from appointments to `PatientCase` until check-in | OK by design |
| `InvestigationFile` / uploads | URL string only — no storage metadata enforcement |

---

## 6. Indexes (present vs needed)

**Present:**
- `AuditLog`: `@@index([entityType, entityId])`
- `OtpVerification`: `@@index([mobile])`

**Missing (recommended):**
- `QueueEntry`: composite `(status, checkInTime)`
- `PatientCase`: `(stage, visitDate)`
- `Appointment`: `(doctorId, date/time)`
- `Bill`: `(paymentStatusEnum, billingDate)`
- `InvestigationOrder`: `(status, createdAt)`

---

## 7. Cascading & orphan risks

| Relation | onDelete | Risk |
|----------|----------|------|
| Patient → cases | Cascade | Deleting patient destroys clinical history — intended? |
| Case → queue | Cascade | OK |
| Case → bill | Cascade | Financial records lost with case delete — **dangerous for compliance** |
| User → profiles | Cascade | OK |

**Recommendation:** Soft-delete patients/cases; restrict hard delete when bills exist.

---

## 8. Normalization issues

- Complaints/history split across `ComplaintEntry`, `ClinicalHistory` — good
- Vitals on both `Patient` and `PatientCase` — OK for visit-scoped vitals
- Bill items duplicate denormalized `serviceName` — OK for invoices
- Allergies: string on profile AND `PatientAllergy` table unused — **denormalized dead design**

---

## 9. Audit trails

| Mechanism | Usage |
|-----------|-------|
| `AuditLog` | FOC payment only (partial) |
| `ActivityLog` | Unused |
| `QueueHistory` | Used — good |
| `CaseStatusHistory` | Unused |
| `AppointmentStatusHistory` | Model exists — verify appointments.service usage |

---

## 10. Seed data

`backend/prisma/seed.ts`:
- Creates users per role
- Sample patients, cases, lab categories, procedures
- **Console.log only** — OK for dev

---

## 11. db_doc divergence

| File | Purpose |
|------|---------|
| `MASTER_DATABASE_ARCHITECTURE.md` | Target architecture |
| `SCHEMA_MERGE_ANALYSIS.md` | Merge notes |
| `MIGRATION_RISK_REPORT.md` | Risk |
| `DATABASE_EVOLUTION_PLAN.md` | Roadmap |

**Risk:** Developers may apply wrong schema file. **Single source of truth must be `backend/prisma/schema.prisma`.**

---

## 12. Architecture alignment recommendations

1. **Prune or implement** — Either drop unused models from schema or build modules (document in roadmap phases).  
2. **Remove dual status strings** — Migrate to enum-only columns.  
3. **Resolve Bill ↔ PatientCase** — One canonical relation; deprecate `billsList` if unused.  
4. **Add soft delete** — `deletedAt` on Patient exists; extend to cases/bills.  
5. **Financial immutability** — No cascade delete Bill with Case; use archival status.  
6. **Branch/clinic FK** — If multi-branch not in v1, remove from schema or stub `branchId` on cases.  

---

*Database audit date: 2026-05-15*
