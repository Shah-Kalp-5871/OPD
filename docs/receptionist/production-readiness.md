# RECEPTION PRODUCTION READINESS

## Readiness Assessment
The Reception Module is currently **60% Production Ready**. 

### Working & Stable (Ready)
1. **Walk-In Registration:** Database models correctly save, DTO validation functions, error states are caught.
2. **Search Engine:** Debounce searching against DB records is performant.
3. **Queue Core Engine:** Check-in works, Token assignment logic is perfect, SSE broadcasting correctly triggers UI updates for the live queue board.
4. **Patient Hub:** Aggregation of patient details and history works.

### Unstable / Not Ready (Blockers)
1. **Appointment Engine:** Completely static. Cannot schedule, reschedule, or map to doctors.
2. **Financial Engine:** Missing split-payments and FOC, meaning real accounting cannot happen. Cash reconciliation relies on this.
3. **Clinical Archival:** Consent forms and Lab Uploads exist as mock UI only, failing medical/legal compliance if pushed to production.
4. **Patient Checkout Lifecycle:** The system lacks strict validation preventing a patient from leaving without clearing bills or transitioning from `BILLING_PENDING` to `CLOSED`.

## Action Plan to Achieve 100% Readiness
1. **Sprint 1 (Financials):** Refactor the NestJS Billing API to accept split payments and FOC parameters. Update the frontend `/billing` view to use this API.
2. **Sprint 2 (Scheduling):** Build the Appointment backend (Doctor Schedule lookup, Slot assignment) and replace the mock arrays in `/appointments/book`.
3. **Sprint 3 (Clinical/Legal):** Build the multipart upload API for labs, and the schema-driven consent template API. Link these to the frontend.
4. **Sprint 4 (UX/Polish):** Implement TTS on the waiting display. Remove polling on the dashboard and replace entirely with the robust SSE hook.
