# 7-Tab Doctor Consultation Procedure Details

Based on the updated requirements in `OPD-NEW-06042026-3.pdf` and its extracted text. This document serves as the comprehensive blueprint for the Doctor's Consultation Panel.

## Global / Common UI Elements (Visible across all tabs)
*   **Special Note Section (Always Visible at Top):**
    *   Displays critical status:
        *   **Drug Status:** "Drug taken / Not taken" (e.g., "Pro SUGAR advised but patient એ લીધી નથી").
        *   **Appointment Status:** "Missed Appointment" or "Delayed Appointment".
        *   **Delay Details:** E.g., "Delayed Appointment, 10 days delay period" with Delay Reason.
*   **Billing Summary Panel (Left Side / Drawer):**
    *   Opens automatically when a patient is selected.
    *   Displays: Today Bill, Monthly Bill, Yearly Bill, Total Bill.
    *   Separate breakdown for Consultation Billing and Procedure-wise Billing.
    *   Displays Total Discount / FOC (Free of Cost) amount with details on which procedure got the discount.
*   **Patient Profile Sidebar:**
    *   Shows BMI, Weight, and BP history (last 4 records with dates).
    *   Displayed in an Excel-type format (Headings: BP, BMI, Weight; Values below).
*   **Notification Tab / Box (Bottom):**
    *   Always active for Doctor-Nursing messaging.
    *   Shows Payment Received (Patient name + amount), Return Amount.
    *   Clicking it opens Daily Payment History.
*   **Payment & Check-in Flow:**
    *   Payment module opens during check-in or when the patient is marked 'Arrived'.
    *   Receptionist can choose to take payment or click "Pay Later", which leaves the unpaid balance on the patient's file.
    *   System supports highly flexible custom payments (e.g., pay for 1 session, 2 sessions, all at once, or all at the last session).
*   **Next Patient Indicator:**
    *   When the current patient is IN, the Next Patient's name blinks until selected.
    *   Shows: Case No | Time | Patient Name | Visit For | Age | Gender | Address | Payment Status | Mobile No.

---

## Tab 1: COMPLAINTS
**Purpose:** Record the patient's vitals, history, and chief complaints.

### Editable Fields (E/D = Enable/Disable by Admin)
*   **Vitals (Read-only from Reception/Nursing, but Editable by Doctor):**
    *   Height (cm) [E/D]
    *   Weight (kg) [E/D]
    *   BMI (Auto-calculated)
    *   Temperature (°F)
    *   Pulse Rate (bpm)
    *   Blood Pressure (mmHg)
    *   SpO2 (%)
*   **Present Complaint:**
    *   Main reason for today's visit (Text area).
    *   Duration of Complaint (Box for Day, Month, Year).
    *   Severity (Mild / Moderate / Severe - Dropdown).
    *   Onset (Sudden / Gradual - Dropdown).
    *   Aggravating Factors (What makes it worse - Text area).
    *   Relieving Factors (What makes it better - Text area).
*   **Patient History:**
    *   Past History (Summary - pre-filled if old patient, manual if new).
    *   Personal History.
    *   Surgical History (Previous surgeries with dates).
    *   Current Medications (Ongoing medicines from outside - Text area).
    *   Obstetric / Gynae History (For female patients: LMP, parity, etc.).
    *   Allergy H/O.
*   **Nursing Notes:** Nursing-specific observation notes.
*   **Patient Feedback:** Pre-typed by Nursing.

---

## Tab 2: INVESTIGATION
**Purpose:** Advise laboratory tests, upload results, and manage lab parameters.

### Features & Fields
*   **Pre-defined Lab Groups:** CBC, ESR/CRP, Blood Sugar, Lipid Profile, LFT, RFT, Thyroid, Urine, Custom.
*   **Result Entry / Upload:**
    *   Upload File (JPEG / PNG / PDF accepted).
    *   Result values can be manually entered with auto-flagging if out of normal range (Male/Female/Child).
*   **Data Fields:**
    *   Test Name (From lab master list).
    *   Requested By (Auto: Doctor name).
    *   Requested Date / Time (Auto-stamped).
    *   Sample Collected By / Time (Nursing staff).
    *   Result Value, Unit, Normal Range.
    *   Status (Pending / Sample Collected / Result Available).
    *   Lab Cost (Per test).
    *   Remarks.
*   **Previous Reports:** Chat-type view with normal values and previous report history.

---

## Tab 3: DRUGS (Prescription)
**Purpose:** Manage, prescribe, and track medications.

### Features & Fields
*   **Master Excel Sync:** All drugs are managed in an Excel Master Sheet (Content Name, Brand, Dose, Frequency, Days, Timing, Price).
*   **Drug Selection:**
    *   Item Name (Search by drug name or content).
    *   Brand / Generic Toggle.
    *   Auto-population: Selecting a drug auto-fills Dose, Frequency (OD/BD/TDS/QID/HS/Weekly/etc.), Route, and Timing (Before Food / After Food / With Milk, etc.).
*   **Manual Entry Option:** Direct manual entry for new drugs not in the Master file.
*   **Simple Drug Management (S):**
    *   Drugs marked with "(S)" (e.g., (S) Tab Levocip).
    *   Tracked separately. If prescribed, the status (Taken / Not Taken) appears in the Special Note on the next follow-up.
*   **Stock & Alerts:**
    *   Minimum stock limit settings (e.g., Shampoo min 5).
    *   Pop-up alerts: "Drug Not Available. Prescribe Another Drug? Yes / No".
    *   Low stock warnings.

---

## Tab 4: PROCEDURE
**Purpose:** Advise and track clinical/esthetic procedures (e.g., Laser, Peeling, PRP).

### Features & Fields
*   **Procedure Selection:**
    *   Select from Master Key or manually type.
    *   Auto-adds instruments/materials (e.g., "PRP" auto-adds 5 syringes, 1 cotton pad).
*   **Multi-Session Tracking Table:**
    *   Date, Therapist, Procedure by Body Part.
    *   Number of Sessions (e.g., 1/4, 2/4).
    *   Auto-generated Follow-up Date (e.g., 20 days later).
    *   Performance Details: Skin Type, Unit, Power, Wavelength, Pulse Duration, Spot Size, Density, Dot Density, Short Fire.
    *   Status / Remark (Done, Pending, Cancelled, Not Taken).
    *   Payment Status.
*   **Consent Form Integration:**
    *   Auto-selects Consent Form based on procedure.
    *   Doctor is provided with simple text box inputs to fill out (e.g., specific risks, notes).
    *   These text box values automatically set into the final consent form template.
    *   System provides options for both Print buttons (e.g., printing different formats or versions).
*   **Notes & Workflow:**
    *   Pre-Procedure Notes & Post-Procedure Notes (Auto-added from template, editable).
    *   **Payment & Approval Workflow:** System supports fully flexible custom session payments. Patients can pay for 1 session, multiple sessions, or all sessions at once or later. Unpaid balances remain on the patient's file.
    *   **Missed Procedures:** If a patient is advised a procedure but doesn't take it, it saves to "Special Note". If they return later, the doctor can add it directly from the Previous Procedure List.

---

## Tab 5: IMAGE
**Purpose:** Capture, upload, and compare patient images across treatment sessions.

### Features & Fields
*   **Image Management:**
    *   Upload (JPEG/PNG/PDF) or capture via Device Camera, Dermascope, or Face Scanner.
    *   Images are categorized under the specific Procedure Name and Date.
    *   Auto Date & Time stamped (Admin editable).
*   **Session Tracking:**
    *   Before, After 1, After 2, etc., linked to Procedure sessions.
*   **Comparison Tool (Compare View):**
    *   Select 2 or more images for full-screen comparison.
    *   Side-by-side or Up-Down split view.
    *   Tools: Zoom, Crop, Rotation, Marking/Annotation, Delete.
*   **Doctor's Observation:**
    *   Free text interpretation box below images.

---

## Tab 6: DIAGNOSIS WITH INSTRUCTION AND F/U
**Purpose:** Record clinical diagnosis, give advice, and set the next follow-up.

### Features & Fields
*   **Diagnosis:**
    *   Primary Diagnosis (ICD-10 search or free text).
    *   Differential Diagnosis.
    *   Toggle for Provisional vs. Confirmed.
    *   Notes / Other.
*   **Auto-Advice:**
    *   Selecting a specific diagnosis auto-populates pre-defined advice (from Master Chart).
*   **Follow-Up (F/U):**
    *   Next Follow-up Date selection.
    *   Reason for F/U (e.g., Delay F/U, Information).
    *   **Auto Upgrade Option:** If checked, a late patient's next appointment is auto-rescheduled based on the late period. If unchecked, the original date is kept.

---

## Tab 7: FINAL REPORT (VIEW)
**Purpose:** Comprehensive summary view of the entire consultation for printing or digital sharing.

### Features & Fields
*   **Display Sections:**
    *   Patient Details.
    *   Vitals (Only those marked 'Show' by the eye icon).
    *   Chief Complaints, Diagnosis, Prescription table, Investigations, Procedures, Notes.
*   **Formatting & Printing:**
    *   Final layout is standardized and locked by Admin.
    *   Print to PDF or paper.

---

## Mandatory Tab Selection & Navigation
*   **Compulsory Tabs:** Admin can define which tabs are mandatory. If a mandatory tab is not filled/selected, the system will not allow navigation to the Next Tab.
*   **Auto-Open:** After a Receptionist checks in a patient or Doctor registers a new patient, the system automatically navigates to Tab 1 of the Consultation Panel for that patient, ensuring a fast workflow.
