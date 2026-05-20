# Implementation Status Matrix — MedFlow OPD

**Status legend**

| Status | Meaning |
|--------|---------|
| NOT STARTED | No meaningful code |
| MOCK ONLY | UI or hardcoded data only |
| PARTIAL | Some layers connected, gaps remain |
| CONNECTED | End-to-end works in happy path |
| STABLE | Connected + error handling + used in flows |
| PRODUCTION READY | Security, tests, ops — **none rated this today** |

---

## Module matrix

| Module | UI Status | Backend Status | DB Status | SSE Status | Billing Sync | Production Status |
|--------|-----------|----------------|-----------|------------|--------------|-------------------|
| **Auth — Login** | CONNECTED | CONNECTED | CONNECTED (User) | N/A | N/A | PARTIAL |
| **Auth — Forgot/Reset** | MOCK ONLY | NOT STARTED | NOT STARTED (OtpVerification unused) | N/A | N/A | NOT STARTED |
| **Users — Profile** | PARTIAL | PARTIAL (`GET /users/me` only) | CONNECTED | N/A | N/A | PARTIAL |
| **Admin — Doctors** | CONNECTED | CONNECTED | CONNECTED | N/A | N/A | PARTIAL |
| **Admin — Staff** | CONNECTED | CONNECTED | CONNECTED | N/A | N/A | PARTIAL |
| **Admin — Dashboard** | MOCK ONLY | NOT STARTED | NOT STARTED (DailyStatistic unused) | N/A | N/A | NOT STARTED |
| **Admin — Reports** | MOCK ONLY | NOT STARTED | NOT STARTED | N/A | N/A | NOT STARTED |
| **Admin — Drugs** | MOCK ONLY | PARTIAL (read via consultation) | CONNECTED (Drug) | N/A | N/A | PARTIAL |
| **Admin — Lab masters** | MOCK ONLY | PARTIAL (read via consultation/lab) | CONNECTED | N/A | N/A | PARTIAL |
| **Admin — Procedures** | MOCK ONLY | PARTIAL (read via consultation) | CONNECTED | N/A | N/A | PARTIAL |
| **Admin — Patients** | MOCK ONLY | CONNECTED (search exists, UI not wired) | CONNECTED | N/A | N/A | PARTIAL |
| **Admin — Appointments** | MOCK ONLY | CONNECTED | CONNECTED | N/A | N/A | PARTIAL |
| **Admin — Billing** | MOCK ONLY | CONNECTED | CONNECTED | N/A | PARTIAL | PARTIAL |
| **Admin — Notifications** | MOCK ONLY | NOT STARTED | NOT STARTED (Notification*) | N/A | N/A | NOT STARTED |
| **Admin — Settings** | MOCK ONLY | NOT STARTED | NOT STARTED (ClinicSetting) | N/A | N/A | NOT STARTED |
| **Reception — Register** | CONNECTED | CONNECTED | CONNECTED | N/A | N/A | STABLE |
| **Reception — Search** | CONNECTED | CONNECTED | CONNECTED | N/A | N/A | STABLE |
| **Reception — Patient Hub** | CONNECTED | CONNECTED | CONNECTED | N/A | N/A | STABLE |
| **Reception — Appointments** | CONNECTED | CONNECTED | CONNECTED | N/A | N/A | PARTIAL |
| **Reception — Queue** | CONNECTED | CONNECTED | CONNECTED | CONNECTED | N/A | STABLE |
| **Reception — Check-in** | CONNECTED | CONNECTED | CONNECTED | CONNECTED | N/A | STABLE |
| **Reception — Billing** | CONNECTED | CONNECTED | CONNECTED | CONNECTED | CONNECTED | PARTIAL |
| **Reception — Consent** | PARTIAL | CONNECTED | CONNECTED | N/A | N/A | PARTIAL |
| **Reception — Lab upload** | PARTIAL | PARTIAL (API accepts URL) | CONNECTED | N/A | N/A | PARTIAL |
| **Reception — Dashboard** | CONNECTED | CONNECTED | CONNECTED | CONNECTED | N/A | PARTIAL |
| **Reception — Waiting display** | CONNECTED (orphan view) | CONNECTED | CONNECTED | CONNECTED | N/A | PARTIAL |
| **Reception — Profile** | PARTIAL | PARTIAL | CONNECTED | N/A | N/A | PARTIAL |
| **Nursing — Vitals** | CONNECTED | CONNECTED | CONNECTED | CONNECTED (clinical) | N/A | STABLE |
| **Nursing — Dashboard** | CONNECTED | CONNECTED | CONNECTED | CONNECTED | N/A | PARTIAL |
| **Nursing — Lab reports** | PARTIAL | PARTIAL | CONNECTED | N/A | N/A | PARTIAL |
| **Nursing — Follow-up** | MOCK ONLY | NOT STARTED | NOT STARTED (Followup) | N/A | N/A | NOT STARTED |
| **Nursing — Profile** | MOCK ONLY | NOT STARTED | N/A | N/A | N/A | NOT STARTED |
| **Doctor — Dashboard** | CONNECTED | CONNECTED | CONNECTED | CONNECTED (both) | N/A | PARTIAL |
| **Doctor — Consultation** | CONNECTED | CONNECTED | CONNECTED | N/A | CONNECTED | PARTIAL |
| **Doctor — Follow-up list** | MOCK ONLY | NOT STARTED | NOT STARTED | N/A | N/A | NOT STARTED |
| **Doctor — Billing view** | MOCK ONLY | CONNECTED (API exists) | CONNECTED | N/A | PARTIAL | PARTIAL |
| **Pharmacy — Queue** | CONNECTED | CONNECTED | CONNECTED | NOT STARTED | N/A | PARTIAL |
| **Pharmacy — Inventory** | CONNECTED | CONNECTED | CONNECTED | N/A | N/A | PARTIAL |
| **Pharmacy — Dispense** | CONNECTED | CONNECTED | CONNECTED | N/A | N/A | PARTIAL |
| **Laboratory — Pending** | CONNECTED | CONNECTED | CONNECTED | PARTIAL (via queue SSE) | N/A | PARTIAL |
| **Laboratory — Process** | CONNECTED | CONNECTED | CONNECTED | PARTIAL | N/A | PARTIAL |
| **Medical (legacy)** | MOCK ONLY | NOT STARTED | CONNECTED (unused by UI) | N/A | N/A | NOT STARTED |
| **Public — Waiting screen** | MOCK ONLY | CONNECTED (API exists) | CONNECTED | NOT STARTED | N/A | NOT STARTED |
| **Print — Rx/Lab** | PARTIAL (components) | PARTIAL (data via parent) | CONNECTED | N/A | N/A | NOT STARTED |
| **SSE infrastructure** | CONNECTED | CONNECTED | N/A | PARTIAL (no auth, no billing stream) | N/A | NOT STARTED |
| **File storage** | PARTIAL | PARTIAL (dummy hash) | CONNECTED (InvestigationFile, ClinicalImage) | N/A | N/A | NOT STARTED |
| **Multi-clinic / Branch** | NOT STARTED | NOT STARTED | NOT STARTED (models exist) | N/A | N/A | NOT STARTED |
| **OTP / Device auth** | NOT STARTED | NOT STARTED | NOT STARTED | N/A | N/A | NOT STARTED |

---

## Feature-level matrix (clinical spine)

| Feature | UI | API | DB | Notes |
|---------|-----|-----|-----|-------|
| MRD generation | ✓ | ✓ | ✓ | `/patients/next-mrd` |
| Case creation | ✓ | ✓ | ✓ | Hub + check-in |
| Token assignment | ✓ | ✓ | ✓ | Race risk |
| Vitals → doctor view | ✓ | ✓ | ✓ | Clinical SSE |
| Visit session start/end | ✓ | ✓ | ✓ | Queue + case stage |
| Complaints/history save | ✓ | ✓ | ✓ | Debounced save |
| Investigations order | ✓ | ✓ | ✓ | Adds bill items |
| Lab processing | ✓ | ✓ | ✓ | |
| Prescriptions | ✓ | ✓ | ✓ | Pharmacy queue |
| Procedures | ✓ | ✓ | ✓ | Bill linkage |
| Clinical images | ✓ | ✓ | ✓ | **Fake URL in UI** |
| Finalize consultation | ✓ | ✓ | ✓ | Stage + SSE |
| Bill auto-items | ✓ | ✓ | ✓ | Consultation fee + procedures |
| Split payment | ✓ | ✓ | ✓ | |
| FOC settlement | ✓ | ✓ | ✓ | |
| Case close on pay | ✓ | ✓ | ✓ | |

---

## Role coverage matrix

| Role | Login redirect | Middleware guard | Backend routes | Usable UI |
|------|----------------|------------------|----------------|-----------|
| ADMIN | ✓ | ✓ | Partial | Doctors/staff only |
| RECEPTION | ✓ | ✓ | Broad | Strong |
| DOCTOR | ✓ | ✓ | Consultation+queue | Strong |
| NURSING | ✓ | ✓ | Vitals+patients | Mixed |
| MEDICAL | ✓ | ✓ | Legacy static UI | **Misleading** |
| PHARMACY | ✗ (redirect `/`) | ✓ | Pharmacy module | Good (3 pages) |
| LAB_TECHNICIAN | ✗ (redirect `/`) | ✓ | Laboratory module | Good (2 pages) |
| ACCOUNTANT | N/A | N/A | Not used in decorators | No UI |
| SUPERADMIN | N/A | N/A | Not used | No UI |

---

## Summary counts

| Production Status | Module count |
|-------------------|--------------|
| NOT STARTED | 12 |
| MOCK ONLY | 10 |
| PARTIAL | 22 |
| STABLE | 5 |
| PRODUCTION READY | **0** |

**Stable modules (happy-path reliable):** Reception register/search/hub/queue/check-in, nursing vitals, reception billing (excluding audit bug).

---

*Matrix reflects code verification 2026-05-15.*
