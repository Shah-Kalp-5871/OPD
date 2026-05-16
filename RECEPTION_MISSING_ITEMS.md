# RECEPTION MISSING ITEMS (PRODUCTION BLOCKERS)

This is the definitive list of items that MUST be implemented to classify the Reception Module as "Production Ready" according to the FRD.

## 1. Backend APIs
- `GET /api/appointments/slots` (Slot validation and availability)
- `POST /api/appointments` (Booking mutation)
- `GET /api/consent/templates` (Fetch DB templates)
- `POST /api/consent/sign` (Save signed PDF/Data)
- `POST /api/investigations/upload` (Multipart upload handler)
- `POST /api/billing/:id/split` (Handle split cash/UPI/Card payments)
- `PATCH /api/billing/:id/discount` (Apply FOC/Discount)

## 2. Frontend Screens & Components
- **Appointments View:** Remove mock arrays, implement fetch hooks, add DatePicker logic linked to DB.
- **Consent View:** Map language/template selection to DB IDs, implement signature capture canvas or print-and-sign workflow.
- **Lab Upload View:** Replace fake progress bar with actual `FormData` POST request.
- **Waiting Display (TV):** Implement the Web Speech API (`window.speechSynthesis.speak`) triggered by SSE `CALL_PATIENT` events.

## 3. Database & System Logic
- **Case Lifecycle:** Implement logic in `queue.service.ts` or `billing.service.ts` that automatically transitions `PatientCase.stage` to `CLOSED` when a final bill is fully paid.
- **Validation Pipes:** Enforce DTO validation on all the new API endpoints.
- **Audit Logs:** Ensure the `AuditLog` table records who accepted payments and who authorized discounts.

## 4. Error Handling & Edge Cases
- Prevent booking an appointment in the past.
- Prevent checking in a patient who already has an `OPEN` case today.
- Prevent modifying a bill once it's marked `PAID`.
