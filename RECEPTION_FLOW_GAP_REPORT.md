# RECEPTION FLOW GAP REPORT

## Core Clinic Operations Validation
Validated against `SYSTEM_WORKFLOW_MASTER.md` and current codebase implementation.

| ID | Operational Flow | Status | Gap Description |
|---|---|---|---|
| 1 | Walk-In Registration | ✅ Operational | Basic registration works. Missing linkage to new Enterprise tables (Guardian, Addresses). |
| 2 | Existing Patient Search | ✅ Operational | Search works with debouncing. |
| 3 | Appointment Booking | ❌ Broken | Pure UI mock. Needs DB linkage for slots, doctor limits, and conflict resolution. |
| 4 | Follow-Up Booking | ❌ Broken | No distinct flow exists outside of the standard mock appointment view. |
| 5 | Queue Check-In | ✅ Operational | Creates `PatientCase` and `QueueEntry`. Missing DB validation for active existing cases. |
| 6 | Token Generation | ✅ Operational | Token formatted dynamically. |
| 7 | Queue Monitoring | ✅ Operational | `/opd-queue` works correctly with SSE events. |
| 8 | Doctor Assignment | ✅ Operational | Doctor assigned during check-in. |
| 9 | Waiting Display Sync | ⚠️ Partial | Dashboard uses polling (10s) instead of SSE. TV Display relies on API polling/SSE combo but lacks TTS announcements. |
| 10 | Billing Processing | ⚠️ Partial | Displays pending bills from SSE. Lacks generation of true procedural line-items dynamically. |
| 11 | Split Payment | ❌ Missing | No UI or backend logic to accept multiple `BillPayment` types for a single `Bill`. |
| 12 | FOC / Discount Handling | ❌ Missing | Need to implement `isFoc` flag checking and discount authorization logic. |
| 13 | Consent Form Flow | ❌ Broken | UI only. Needs DB schema integration (`ConsentTemplate`, `ConsentForm`). |
| 14 | Lab Upload Flow | ❌ Broken | UI only. No file storage or `InvestigationFile` DB logic implemented. |
| 15 | Missed Follow-Up Handling | ❌ Missing | No background job or dashboard UI to flag expired follow-ups. |
| 16 | Real-time Doctor Notifications| ⚠️ Partial | Basic SSE works, but specific `NOTIFICATION` table inserts and alerts are unlinked. |
| 17 | Patient Status Tracking | ✅ Operational | Queue status accurately represents patient state. |
| 18 | Case Creation | ✅ Operational | Check-in creates new open case. |
| 19 | Queue Status Lifecycle | ⚠️ Partial | Core lifecycle works, but enterprise variants (`BILLING_PENDING`, `SUSPENDED`) are not fully integrated into frontend logic. |
| 20 | Session Completion → Billing | ⚠️ Partial | SSE triggers billing display, but strict queue enforcement of `BILLING_PENDING` state is missing. |
| 21 | Final Payment → Case Closed | ❌ Missing | Paying a bill updates the bill, but doesn't auto-update `PatientCase.stage` to `CLOSED`. |

## Major Blockers Identified
1. **Financial Security:** The lack of split payment and explicit FOC/Discount authorization breaks hospital accounting standards.
2. **Scheduling:** The entire appointment system is non-operational mock data.
3. **Data Completeness:** The Consent and Lab modules are entirely disconnected from the database, preventing legal archiving and clinical review.
