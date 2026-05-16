# FRONTEND DEPENDENCY MAP
**Task:** Enterprise Schema Integration

This document maps the existing frontend views and pages to the specific Prisma models they depend on, ensuring we understand the blast radius of any future schema changes.

## 1. Reception Module

### A. Patient Hub (`/views/reception/patients/PatientHubView.tsx`)
- **API Endpoints:** `/patients`, `/patients/:id`
- **Models Used:** 
  - `Patient` (mrdNumber, firstName, lastName, mobile)
  - `PatientProfile` (age, gender, address, photo)
  - `PatientVitals` (latest BMI, BP)
  - `PatientCase` (latest OPEN case)
- **Status Post-Merge:** Unaffected. Legacy string fields remain actively supported.

### B. Queue Management (`/views/reception/queue/QueueManager.tsx`)
- **API Endpoints:** `/queue`, `/queue/status` (SSE)
- **Models Used:**
  - `QueueEntry` (tokenDisplay, status, queueType)
  - `QueueHistory` (for tracking check-in times)
- **Status Post-Merge:** Unaffected. Real-time updates rely on exact QueueStatus enums which were strictly preserved.

### C. Billing Flow (`/views/reception/billing/page.tsx`)
- **API Endpoints:** `/billing/case/:caseId`
- **Models Used:**
  - `Bill` (grossAmount, netAmount, paymentStatus)
  - `BillItem` (serviceName, unitPrice)
- **Status Post-Merge:** Unaffected.

## 2. Doctor Module

### A. Doctor Dashboard / Schedule (`/views/doctor/dashboard/page.tsx`)
- **API Endpoints:** `/doctors/me/schedule`
- **Models Used:**
  - `User` (name, role)
  - `DoctorProfile` (specialization, slotDuration)
  - `QueueEntry` (where `doctorId` matches)
- **Status Post-Merge:** Unaffected. The `User.name` field is preserved for the greeting UI.

### B. Consultation 7-Tab Workflow (`/views/doctor/consultation/[caseId]/page.tsx`)
- **API Endpoints:** `/consultation/:caseId`
- **Models Used:**
  - `PatientCase` (status, complaint)
  - `ConsultationRecord` (status)
  - `ComplaintEntry` (chiefComplaint, duration)
  - `PatientVitals`
- **Status Post-Merge:** Unaffected. 

## 3. Waiting Display (TV)

### A. Queue Display (`/views/display/queue/page.tsx`)
- **API Endpoints:** `/queue/display` (SSE)
- **Models Used:**
  - `QueueEntry` (Filtered by status = CALLING / IN_SESSION)
- **Status Post-Merge:** Unaffected.

## 4. API Dependency Mapping Summary

| Service Layer | Key Prisma Models Dependent On | Action Required |
|---------------|--------------------------------|-----------------|
| `PatientsService` | `Patient`, `PatientProfile`, `PatientVitals`, `PatientCase` | None (Backward compatibility maintained) |
| `QueueService` | `QueueEntry`, `QueueHistory` | None |
| `BillingService` | `Bill`, `BillItem` | None |
| `Auth/UsersService`| `User`, `AdminProfile`, `DoctorProfile` | None (Legacy `name` and `password` fields kept) |

*Note: As new frontend modules (like Pharmacy or Lab) are built, they will immediately map to the new Enterprise domains (e.g., `DrugInventory`, `InvestigationOrder`) without touching the legacy code.*
