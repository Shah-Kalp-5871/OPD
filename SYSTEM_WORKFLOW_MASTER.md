# MedFlow OPD Management System - Comprehensive Master Workflow Directory

This document serves as the absolute single source of truth for **every operational workflow** within the MedFlow OPD Management System. It details every action, from the smallest data entry task to the most complex multi-step clinical process, mapping real-world clinic operations to exact system interactions.

---

## 1. System Foundations & Principles

Before detailing specific workflows, these core principles govern all interactions:

*   **The `PatientCase` (Visit Session):** Every physical visit is a unique `PatientCase` tying together the Patient, Doctor, Appointment, Vitals, Consultation Notes, Prescriptions, and Billing.
*   **Real-Time Sync (SSE):** Changes made by one user (e.g., Doctor clicks "Next Patient") instantly reflect on all other relevant screens (Reception, Waiting Display) via Server-Sent Events without manual page refreshes.
*   **Strict RBAC:** Permissions are absolute. Reception cannot prescribe drugs; Medical cannot view clinical notes; Admin sees everything.
*   **Privacy & Security:** 
    *   Patient mobile numbers are strictly masked (`+91 98765****0`) in all list views.
    *   Editing core demographic fields requires OTP verification sent to the patient's phone.
    *   Logins are restricted to Admin-authorized devices only.

---

## 2. Reception & Front Desk Workflows

### Workflow 2.1: Walk-In Registration (New Patient)
**Actor:** Receptionist
**Scenario:** A patient visits the clinic for the very first time.
1. Receptionist opens `PatientHubView` and clicks **"New Patient Registration"**.
2. Inputs mandatory fields: Surname, Middle Name, Last Name, Mobile Number, Gender, Address, Preferred Language.
3. System automatically generates a unique `MRD No` (e.g., P03-260001).
4. Receptionist saves the profile.
5. System displays **"Print Patient Sticker"** button (prints Name, Age, Gender, MRD, Barcode for physical file).
6. Receptionist clicks **"Book Appointment"** to proceed to Workflow 2.3.

### Workflow 2.2: Booking an Appointment (Existing Patient)
**Actor:** Receptionist
**Scenario:** An old patient calls to book an appointment.
1. Receptionist opens `PatientHubView` or `OpdQueueView` and clicks **"Book Appointment"**.
2. Uses the autocomplete search bar to find the patient by Name or MRD No.
3. Selects the patient (details auto-fill).
4. Selects **Appointment Date** (calendar disables holidays and booked slots).
5. System auto-generates **Appointment Time** based on doctor's slot gap (Receptionist can manually edit).
6. Selects **Purpose of Visit** (e.g., Follow-Up, Procedure).
7. Selects **Assigned Doctor** and **Patient Category** (Payment or FOC).
8. Clicks **"Save"**.
9. System generates `Case ID` and auto-sends an SMS/WhatsApp confirmation to the patient.

### Workflow 2.3: Patient Check-In & Queue Activation
**Actor:** Receptionist
**Scenario:** A booked patient physically arrives at the clinic.
1. Receptionist locates the patient in the `OpdQueueView` (status is `WAITING` - Yellow).
2. Receptionist clicks **"Check-In"**.
3. System stamps the exact Check-In Time.
4. Status changes to `IN_PROGRESS` (Blue & Blinking).
5. The patient's name instantly appears on the **Waiting Display Screen** and starts blinking in the **Doctor's Dashboard**.

### Workflow 2.4: Upgrading Patient Profile (OTP Verified)
**Actor:** Receptionist / Doctor / Admin
**Scenario:** Staff needs to correct a typo in a patient's name or update their phone number.
1. User opens the Patient Profile and edits the restricted field.
2. Clicks **"Save"**.
3. System prompts: "An OTP has been sent to the patient's registered mobile number."
4. User asks the patient for the OTP and enters it into the system.
5. If valid, the profile is permanently updated.

### Workflow 2.5: Billing & Payment Collection (End of Visit)
**Actor:** Receptionist
**Scenario:** Consultation is over, patient is at the front desk to pay.
1. Receptionist opens `BillingView` and selects the patient.
2. System displays the **Net Fee** (Base Consultation Fee + any Procedure Fees - Doctor applied Discounts).
3. Receptionist selects **Payment Mode** (Cash, Card, UPI, Online).
4. *(Split Payment)* If patient pays part cash, part UPI, Receptionist clicks "Add Split Payment", enters amounts for each mode.
5. Clicks **"Confirm Payment"**.
6. System marks status as `PAID` (Green), generates a Transaction ID, and prints a detailed Receipt.

### Workflow 2.6: Generating Consent Forms
**Actor:** Receptionist
**Scenario:** Doctor advised a minor surgical procedure requiring consent.
1. Receptionist opens the patient's Case ID.
2. Clicks **"Generate Consent Form"**.
3. System auto-selects the template based on the procedure added by the Doctor and the patient's preferred language.
4. System auto-fills Name, Age, MRD, Case No, Procedure Name, Date.
5. Receptionist prints the form for physical signature, then scans and uploads it back to the Case ID.

### Workflow 2.7: Handling a Missed Follow-Up
**Actor:** Receptionist / Nursing
**Scenario:** Patient did not show up for their scheduled date.
1. User reviews the "Pending Follow-Ups" list.
2. Calls the patient.
3. If Rescheduled: User enters new date. System auto-creates appointment and sends SMS.
4. If No Answer: User clicks "No Answer". System auto-creates a **Special Note**: *'Call not answered – F/U Missed'* which the Doctor will see on their next visit.

---

## 3. Waiting Area Workflows

### Workflow 3.1: The Waiting Display Auto-Cycle
**Actor:** System (Automated)
**Scenario:** Patients are sitting in the lobby watching the TV.
1. TV loads `/reception/waiting-display` and connects to the SSE stream.
2. Screen displays the name of the patient currently inside the cabin (in local language).
3. Below it, displays "Next Patient: [Name] [Token]".
4. When Reception checks someone in, they enter the pool.
5. When Doctor clicks "Call Next", the TV plays an auditory chime, and the 'Next Patient' moves to the 'Currently Calling' spotlight.

---

## 4. Nursing & Pre-Consultation Workflows

### Workflow 4.1: Vitals Entry
**Actor:** Nurse
**Scenario:** Nurse calls the patient before they see the doctor to check BP and weight.
1. Nurse opens Nursing Dashboard and selects the checked-in patient.
2. Enters Height, Weight, Temp, Pulse, BP, and SpO2.
3. System auto-calculates BMI.
4. Nurse clicks **"Save Vitals"**.
5. Vitals instantly appear on the Doctor's Tab 1 for this patient.

### Workflow 4.2: Uploading External Lab Reports
**Actor:** Nurse / Receptionist
**Scenario:** Patient brings physical blood test reports.
1. User clicks **"Upload Lab Report"** for the specific Case ID.
2. Uploads the scanned PDF.
3. System presents a fast-entry grid for key parameters (e.g., Hb, Sugar).
4. User manually types the numeric values.
5. Clicks **"Save"**. Doctor can now see both the PDF and the trend graph in Tab 2.

---

## 5. Doctor Clinical Workflows (The Core Consultation)

### Workflow 5.1: Starting & Managing the Queue
**Actor:** Doctor
**Scenario:** Doctor is ready for the next patient.
1. Doctor clicks **"Next Patient"** on their dashboard.
2. The UI switches to the 7-Tab Consultation interface for the next scheduled, checked-in patient.
3. Blinking stops on Reception and Waiting Display screens.
4. Doctor reviews the **Left-Side Summary Panel** (past visits, billing status, last 4 vitals) and the **Special Notes** (missed visits, drug not taken alerts).

### Workflow 5.2: Tab 1 - Complaints & History
**Actor:** Doctor
1. Doctor reviews Nurse-entered vitals.
2. Types the Chief Complaint, selects Severity (Mild/Mod/Severe) and Onset (Sudden/Gradual).
3. Inputs duration (e.g., 3 Days, 1 Month).
4. Reviews/Edits Past History, Allergies, and Current outside medications.
5. Clicks "Next" to move to Tab 2.

### Workflow 5.3: Tab 2 - Requesting Investigations
**Actor:** Doctor
1. Doctor searches for a test (e.g., "CBC") or selects from standard groups.
2. To review past tests, Doctor scrolls through the Excel-style comparison grid.
3. System flags historical values in **RED** if they were outside the Admin-configured normal ranges.

### Workflow 5.4: Tab 3 - Prescribing Drugs
**Actor:** Doctor
1. Doctor types drug generic/brand name. Autocomplete suggests from Master List.
2. Selects drug. System auto-fills default Dose, Frequency, Route, and Timing.
3. Doctor enters Duration (e.g., 5 Days).
4. System auto-calculates Total Quantity (e.g., 10 Tabs).
5. **(Unavailable Check):** If Medical has marked this drug out-of-stock, a pop-up appears: *"Drug Unavailable. Prescribe Another?"*
6. **(Sample Drug):** If doctor selects a drug with an (S) prefix, it is flagged to be deducted from the separate sample inventory.

### Workflow 5.5: Tab 4 - Adding a Procedure & Delay Logic
**Actor:** Doctor
**Scenario:** Doctor performs a Laser Hair Removal session.
1. Selects "Diode Laser" from the procedure master.
2. System auto-adds required consumables to the list and updates Reception's pending bill.
3. System generates Session Number (e.g., 2/4) and auto-calculates the Next F/U Date.
4. **(Delay Logic):** If the patient arrived 10 days late for session 2, a pop-up appears. Doctor chooses **"Auto Upgrade"** (shifts all future sessions forward by 10 days) or **"Keep Original Date"**.
5. Doctor enters technical parameters (Power, Spot Size).
6. Auto-populates pre/post procedure notes for the prescription.

### Workflow 5.6: Tab 5 - Image Management (Before/After)
**Actor:** Doctor
1. Doctor selects the procedure folder.
2. Clicks "Upload Image" and flags it as "Before" or "After".
3. System auto-stamps the current Date/Time on the image.
4. Doctor clicks **"Compare"**, selecting one Before and one After image.
5. System opens a split-screen view with independent zoom/pan to show patient progress.

### Workflow 5.7: Tab 6 - Diagnosis, Advice & Review
**Actor:** Doctor
1. Searches ICD-10 database for Diagnosis.
2. Toggles "Provisional" or "Confirmed".
3. Selects advice from auto-suggested list based on diagnosis.
4. Sets next Follow-Up Date using the smart calendar (skipping Sundays/holidays).
5. Checks the **"Send Google Review Link"** box to auto-send the clinic's review link via SMS.

### Workflow 5.8: Financial Override (Discounts / FOC)
**Actor:** Doctor
**Scenario:** Doctor wants to waive fees for a relative or poor patient.
1. Doctor opens the Billing Side-Panel.
2. Enters a Discount % OR toggles **"FOC (Free of Charge)"**.
3. System instantly hides billing fields for this session and pushes a notification alert to the Receptionist's screen.

### Workflow 5.9: Tab 7 - Final Report Print & End Session
**Actor:** Doctor
1. Doctor reviews the compiled 7-tab preview.
2. Uses the **"Eye Icon"** to hide specific internal notes or diagnoses from printing.
3. Adjusts font size using up/down arrows.
4. Clicks **"Print / End Consultation"**.
5. Status changes to `COMPLETED`. Doctor is returned to Dashboard.

### Workflow 5.10: Generating Prioritised Call Lists
**Actor:** Doctor
**Scenario:** End of the day, doctor reviews follow-ups.
1. Doctor opens the Follow-Up Management view.
2. Selects patients who need calls tomorrow.
3. Drags and drops to set priority (High, Med, Low).
4. Clicks "Forward to Nursing". Nursing dashboard is instantly updated with the task list.

---

## 6. Pharmacy & Dispensary Workflows

### Workflow 6.1: Dispensing Drugs
**Actor:** Pharmacist / Medical Staff
**Scenario:** Patient hands over prescription to get medicines.
1. Pharmacist opens Pharmacy Dashboard. Sees queue of completed consultations.
2. Clicks on the patient. Views ONLY the prescribed drug list (no clinical history).
3. Hands medicines to patient.
4. Clicks **"Mark as Taken"** for each drug.
5. System permanently deducts exact quantity from Live Inventory.

### Workflow 6.2: Handling "Not Taken" or "Unavailable"
**Actor:** Pharmacist
1. If patient refuses a drug (too expensive, already has it), Pharmacist clicks **"Not Taken"**.
   - System auto-generates a Special Note for the Doctor: *"Drug Not Taken: [Drug Name]"*.
2. If the drug is physically out of stock, Pharmacist clicks **"Drug Unavailable"**.
   - System instantly alerts Doctor/Admin and prevents future prescriptions until restocked.

### Workflow 6.3: Drug Returns
**Actor:** Pharmacist
1. Patient returns 5 unused tablets.
2. Pharmacist opens "Return Processing".
3. Selects patient and drug, enters quantity '5'.
4. System adds 5 back to Live Inventory and updates the patient's financial ledger for a refund.

---

## 7. Admin & Management Workflows

### Workflow 7.1: Master Data Management
**Actor:** Admin
1. Admin opens `ServiceMaster` or `DrugMaster`.
2. Adds a new procedure (e.g., "Chemical Peel").
3. Sets Base Price, configures location-based variants (Face vs Back), and attaches required default consumables.
4. Updates immediately reflect in Doctor's Tab 4 dropdowns.

### Workflow 7.2: Staff Attendance & Salary
**Actor:** Admin
1. End of month, Admin opens Staff Reports.
2. Views auto-logged attendance (from logins or biometric).
3. System auto-calculates base salary.
4. Admin manually adds Overtime hours (calculated at configured OT rate) and Bonus.
5. Generates final Salary Slip.

### Workflow 7.3: Expense & P&L Tracking
**Actor:** Admin
1. Admin opens Expense Ledger.
2. Logs daily expenses (e.g., Category: "Sanitary", Amount: "500").
3. Opens P&L Report.
4. System automatically subtracts logged expenses and staff salaries from the Total Revenue (Consultation + Procedure income) to display the **Net Profit**.

### Workflow 7.4: Modifying Prescription Templates
**Actor:** Admin
1. Admin wants to stop printing patient age on prescriptions.
2. Opens Settings -> Prescription Template.
3. Toggles "Age" to OFF.
4. All future prescriptions printed by Doctors will no longer show the Age field. Doctors cannot override this layout change, only adjust font size.

---
**End of Master Workflow Directory**
