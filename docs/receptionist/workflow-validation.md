# RECEPTION WORKFLOW VALIDATION

## End-to-End Validation Criteria
This document validates the ideal operational transition of a patient through the Reception Module against the system's architecture.

### 1. Registration to Hub
- **Trigger:** Receptionist submits `/patients/register` form.
- **Validation:** DB creates `User` (patient role) + `Patient` + `PatientProfile`.
- **Transition:** Auto-redirects to `/patients/hub?id={mrdNumber}`.
- **Current State:** ✅ Passed (Basic fields only).

### 2. Hub to Check-In
- **Trigger:** Receptionist clicks "Start Visit".
- **Validation:** Patient data flows into Check-In form. Vitals are captured.
- **Transition:** Submitting check-in fires API, opens `PatientCase`, generates `QueueEntry`.
- **Current State:** ✅ Passed.

### 3. Queue Lifecycle (Real-time)
- **Trigger:** Doctor calls patient from their interface.
- **Validation:** SSE event `STATUS_CHANGED` broadcasted.
- **Transition:** Reception Dashboard and TV Display must immediately reflect status = `IN_SESSION`.
- **Current State:** ⚠️ Partial (TV Display uses polling, needs SSE enforcement).

### 4. Checkout & Billing
- **Trigger:** Doctor ends session.
- **Validation:** Queue status changes to `BILLING_PENDING`. SSE alerts Reception.
- **Transition:** Reception opens Billing tab, inputs payment, clicks "Complete".
- **Current State:** ❌ Broken (Queue status `BILLING_PENDING` not strictly handled; Case is not automatically closed after payment).

### 5. Follow-Up Booking (Post-Checkout)
- **Trigger:** Case is closed.
- **Validation:** Receptionist prompts for follow-up date based on Doctor's notes.
- **Transition:** Books `Appointment` for future date.
- **Current State:** ❌ Missing entirely.
