# RECEPTION API MAP

This document defines the strict API contracts required for the Reception module to be completely dynamic, mapped to the new Enterprise Schema (`PRODUCTION_SCHEMA.prisma`).

## 1. Dashboard & Analytics
- `GET /api/reception/dashboard/stats`
  - *Response:* `{ total: number, checkedIn: number, waiting: number, completed: number, cancelled: number, revenueToday: number, activeDoctors: number }`
- `GET /api/reception/dashboard/queue-live`
  - *Response:* Array of active `QueueEntry` with `Patient` and `Doctor` details.

## 2. Patient Registration & Search
- `POST /api/patients`
  - *Payload:* `{ firstName, lastName, mobile, genderEnum, bloodGroupEnum, dateOfBirth, address... }`
  - *Action:* Creates `User`, `Patient`, `PatientProfile`, `PatientAddress`.
- `GET /api/patients/search?q={query}&page={page}`
  - *Response:* Paginated list of patients matching MRD, mobile, or name.
- `GET /api/patients/:id/hub`
  - *Response:* Full aggregation of `Patient` + active `PatientCase` + `PatientVitals` + recent `PatientDocument`.

## 3. Appointments & Scheduling
- `GET /api/appointments/slots?doctorId={id}&date={YYYY-MM-DD}`
  - *Response:* Array of available slot times based on `DoctorSchedule` and existing `Appointment`s.
- `POST /api/appointments`
  - *Payload:* `{ patientId, doctorId, appointmentDate, timeSlot, type, reason }`
  - *Action:* Creates `Appointment` row.

## 4. Queue Check-In
- `POST /api/queue/check-in`
  - *Payload:* `{ patientId, doctorId, visitType, priorityEnum, complaint, vitals: {...} }`
  - *Action:* Opens `PatientCase`, records `PatientVitals`, creates `QueueEntry` with token.

## 5. Billing & Payments
- `GET /api/billing/pending`
  - *Response:* Array of `Bill` objects where `paymentStatusEnum` != 'PAID'.
- `POST /api/billing/:billId/pay`
  - *Payload:* `{ amount, method, transactionId, isSplit, secondaryAmount, secondaryMethod }`
  - *Action:* Inserts into `BillPayment`, updates `Bill`, sets `PatientCase.stage = CLOSED`.
- `POST /api/billing/:billId/discount`
  - *Payload:* `{ discountAmount, reason, authorizedBy }`

## 6. Consent Forms
- `GET /api/consent/templates`
  - *Response:* List of active `ConsentTemplate` records.
- `POST /api/consent/:caseId/sign`
  - *Payload:* `{ templateId, language, signatureBase64 }`
  - *Action:* Creates `ConsentForm` linked to `PatientCase`.

## 7. Lab Uploads
- `POST /api/investigations/upload`
  - *Payload:* `multipart/form-data` (File + `caseId` + `reportDate` + `notes`)
  - *Action:* Saves file, creates `InvestigationOrder` and `InvestigationFile`.
