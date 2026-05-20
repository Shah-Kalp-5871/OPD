# Functional Requirements Document
## OPD / Clinic Management System

| Field | Details |
| :--- | :--- |
| **Document Title** | FRD – OPD / Clinic Management System |
| **Version** | V1.0 |
| **Document Status** | Initial Draft |
| **Author(s)** | Dr. Nikunj Valaki |
| **Filename** | FRD_OPD_Clinic_Management_System_V1.0 |
| **Date** | April 2026 |
| **Confidentiality** | Confidential |

---

## Table of Contents

1. [Revision History](#1-revision-history)
2. [Acronyms and Abbreviations](#2-acronyms-and-abbreviations)
3. [Responsibility](#3-responsibility)
4. [Objectives of the Document](#4-objectives-of-the-document)
5. [Organizational Classification](#5-organizational-classification-of-the-document)
6. [OPD Clinic Management System – Initial Details](#6-opd-clinic-management-system--initial-details)
    - 6.1 [Purpose of Project](#61-purpose-of-project)
    - 6.2 [Business Objectives](#62-business-objectives)
    - 6.3 [Technology Stack](#63-technology-stack)
    - 6.4 [Scope of Work](#64-scope-of-work)
7. [Admin Panel Features](#7-admin-panel-features)
    - 7.1 [Login](#71-login)
    - 7.2 [Forgot Password](#72-forgot-password)
    - 7.3 [Dashboard](#73-dashboard)
    - 7.4 [Patient Management](#74-patient-management)
    - 7.5 [Appointment Management](#75-appointment-management)
    - 7.6 [Roles & Permissions Management](#76-roles--permissions-management)
    - 7.7 [Doctor Management](#77-doctor-management)
    - 7.8 [Staff Management](#78-staff-management)
    - 7.9 [Billing & Transaction Management](#79-billing--transaction-management)
    - 7.10 [Drug Master & Inventory Management](#710-drug-master--inventory-management)
    - 7.11 [Lab Investigation Master](#711-lab-investigation-master)
    - 7.12 [Procedure Master Management](#712-procedure-master-management)
    - 7.13 [Offers & Discount Management](#713-offers--discount-management)
    - 7.14 [Notifications & Alerts Management](#714-notifications--alerts-management)
    - 7.15 [Reports & Analytics](#715-reports--analytics)
    - 7.16 [Settings](#716-settings)
    - 7.17 [Support](#717-support)
    - 7.18 [My Profile](#718-my-profile)
    - 7.19 [Video Calling](#719-video-calling)
8. [Reception Panel Features](#8-reception-panel-features)
    - 8.1 [Login](#81-login)
    - 8.2 [Forgot Password](#82-forgot-password)
    - 8.3 [Dashboard](#83-dashboard)
    - 8.4 [Patient Registration](#84-patient-registration)
    - 8.5 [Appointment Booking & Management](#85-appointment-booking--management)
    - 8.6 [Check-In Management](#86-check-in-management)
    - 8.7 [Billing & Payment Processing](#87-billing--payment-processing)
    - 8.8 [Consent Form Management](#88-consent-form-management)
    - 8.9 [Lab Report Upload](#89-lab-report-upload)
    - 8.10 [My Profile](#810-my-profile)
9. [Doctor Panel Features](#9-doctor-panel-features)
    - 9.1 [Login](#91-login)
    - 9.2 [Forgot Password](#92-forgot-password)
    - 9.3 [Dashboard](#93-dashboard)
    - 9.4 [Patient Consultation – 7-Tab Workflow](#94-patient-consultation--7-tab-workflow)
    - 9.5 [Appointment & Follow-Up Management](#95-appointment--follow-up-management)
    - 9.6 [Billing View](#96-billing-view)
    - 9.7 [Pharmacy View](#97-pharmacy-view)
    - 9.8 [Reports & Analytics](#98-reports--analytics)
    - 9.9 [My Profile](#99-my-profile)
10. [Nursing Panel Features](#10-nursing-panel-features)
    - 10.1 [Login](#101-login)
    - 10.2 [Forgot Password](#102-forgot-password)
    - 10.3 [Dashboard](#103-dashboard)
    - 10.4 [Patient Vitals Entry](#104-patient-vitals-entry)
    - 10.5 [Lab Report Management](#105-lab-report-management)
    - 10.6 [Follow-Up & Call Management](#106-follow-up--call-management)
    - 10.7 [My Profile](#107-my-profile)
11. [Medical / Pharmacy Panel Features](#11-medical--pharmacy-panel-features)
    - 11.1 [Login](#111-login)
    - 11.2 [Forgot Password](#112-forgot-password)
    - 11.3 [Dashboard](#113-dashboard)
    - 11.4 [Prescription & Drug Dispensing](#114-prescription--drug-dispensing)
    - 11.5 [Drug Stock Management](#115-drug-stock-management)
    - 11.6 [Alerts & Notifications](#116-alerts--notifications)
    - 11.7 [My Profile](#117-my-profile)
12. [Patient Waiting Display Screen](#12-patient-waiting-display-screen)
    - 12.1 [Display Overview](#121-display-overview)
    - 12.2 [Current & Next Patient Display](#122-current--next-patient-display)
    - 12.3 [Real-Time Updates](#123-real-time-updates)

---

## 1. Revision History

### Table 1: Document Information
| Field | Details |
| :--- | :--- |
| **Project** | OPD / Clinic Management System |
| **Document Version** | V1.0 |
| **Document Status** | Initial Draft |
| **Author(s)** | Dr. Nikunj Valaki |
| **Filename** | FRD_OPD_Clinic_Management_System_V1.0 |

### Table 2: Document Version Control
| Revision | Date of Issue | Pages Affected | Reason | Summary of Change |
| :--- | :--- | :--- | :--- | :--- |
| 1.0 | April 2026 | All | Initial Draft | Original – Full FRD document for OPD / Clinic Management System |

---

## 2. Acronyms and Abbreviations

### Table 3: Acronyms and Abbreviations
| Acronym | Definition |
| :--- | :--- |
| **Dr** | Dr. Nikunj Valaki |
| **OPD** | Outpatient Department |
| **FRD** | Functional Requirements Document |
| **MRD** | Medical Record Department – used as the unique Patient ID prefix |
| **JWT** | JSON Web Token – authentication mechanism |
| **RBAC** | Role-Based Access Control |
| **FOC** | Free of Charge – patient category with no billing |
| **F/U** | Follow-Up – scheduled revisit after initial consultation |
| **BRD** | Business Requirements Document |
| **SOW** | Statement of Work |
| **SMS** | Short Message Service |
| **UPI** | Unified Payments Interface |
| **OTP** | One-Time Password |
| **CBC** | Complete Blood Count – lab investigation group |
| **LFT** | Liver Function Test – lab investigation group |
| **RFT** | Renal Function Test – lab investigation group |
| **BMI** | Body Mass Index – auto-calculated from Height and Weight |
| **BP** | Blood Pressure |
| **SpO2** | Oxygen Saturation level (%) |
| **ICD-10** | International Classification of Diseases, 10th Revision |
| **MR** | Medical Representative – drug sample provider |
| **UI** | User Interface |
| **API** | Application Programming Interface |
| **PDF** | Portable Document Format |
| **CSV** | Comma-Separated Values |
| **E/D** | Enable / Disable – field-level admin configuration option |
| **KPI** | Key Performance Indicator |
| **P&L** | Profit and Loss |
| **DOB** | Date of Birth |
| **EMI** | Equated Monthly Instalment |

---

## 3. Responsibility
The following table outlines the roles responsible for the creation, review, and approval of this document.

| Role | Name / Party | Responsibility |
| :--- | :--- | :--- |
| **Business Analyst** | Dr. Nikunj Valaki | Requirement elicitation, FRD creation, gap analysis |
| **Project Manager** | Dr. Nikunj Valaki | Review, approval, and delivery oversight |
| **Client / Clinic Owner**| Confidential | Requirement input, review, and final sign-off |
| **Development Team** | Dr. Nikunj Valaki | Technical feasibility review and implementation |
| **QA Team** | Dr. Nikunj Valaki | UAT support and validation against this FRD |

---

## 4. Objectives of the Document
The purpose of this Functional Requirements Document (FRD) is to ensure all stakeholders share a common understanding of the system's functional scope before development commences. 

- **Alignment:** Ensure all parties are on the same page regarding the project scope.
- **Requirement Definition:** Clearly define all functional and operational requirements, including patient registration, appointment management, billing, EMR, laboratory integration, and pharmacy management.
- **Workflow Optimization:** Define user roles and access controls to ensure data security and an efficient workflow.
- **Efficiency:** Streamline daily operations for doctors and staff while improving patient service quality.
- **Scalability:** Serve as a reference for future upgrades, maintenance, and scalability.

---

## 5. Organizational Classification of the Document
All material prepared under this report is the proprietary property of **Dr. Nikunj Valaki**. 

- **Confidentiality:** This report is classified as confidential and not intended for public disclosure.
- **Access Control:** No third party shall be granted access without prior written authorization from Dr. Nikunj Valaki.

### Table 4: Document Classification
| Document Classification | Details |
| :--- | :--- |
| **Type** | Confidential |
| **Departments** | Classified with access permission to Dr. Nikunj Valaki |

---

## 6. OPD Clinic Management System – Initial Details

### 6.1 Purpose of Project
The OPD / Clinic Management System is a comprehensive, web-based clinical information platform designed to digitize and automate the operations of an outpatient department or specialty clinic. The system replaces manual, paper-based workflows with a structured digital solution covering patient management, clinical consultations, drug prescriptions, procedure tracking, billing, and pharmacy management.

### 6.2 Business Objectives
- **Digitization:** Automate the complete OPD workflow to eliminate paper records.
- **Role-Based Security:** Enforce strict RBAC to ensure data privacy and role-relevant access.
- **Clinical Decision Support:** Provide real-time alerts for drug availability, investigation results, and vitals history.
- **Procedure Tracking:** Enable multi-session tracking with automated follow-up scheduling.
- **Analytics:** Provide comprehensive clinical and financial reporting for decision-making.
- **Privacy:** Implement device-level restrictions, mobile number masking, and OTP-verified edits.
- **Communication:** Streamline internal communication via real-time notifications.

### 6.3 Technology Stack
### Table 5: Technology Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (Single Page Application) |
| **Backend** | Node.js with Express.js (RESTful API) |
| **Database** | PostgreSQL |
| **Authentication** | JWT (JSON Web Tokens) with role-based claims |
| **Payment Gateway** | Razorpay (UPI, Card, Net Banking, Online) |
| **Notifications** | SMS Gateway + WhatsApp Business API |
| **File Storage** | Cloud storage for PDF reports and clinical images |
| **Real-Time Updates** | WebSocket / Server-Sent Events for display screens |

### 6.4 Scope of Work
The following panels and user roles are in scope:
- **Admin Panel:** Full system control, master data, staff accounts, and financial reporting.
- **Reception Panel:** Front-desk interface for registration, booking, check-in, and billing.
- **Doctor Panel:** Clinical interface with a 7-Tab consultation workflow.
- **Nursing Panel:** Entry of patient vitals, lab report management, and follow-up calls.
- **Medical / Pharmacy Panel:** Prescription viewing, drug dispensing, and stock management.
- **Patient Waiting Display:** Read-only screen showing current and next patients in queue.

---

## 7. Admin Panel Features
The master control interface for the Clinic Owner or Manager.

### 7.1 Login
- **Credentials:** Email Address and Password.
- **Validation:** 
    - No blank values.
    - Standard email format validation.
    - Password masking with show/hide toggle.
    - **Security:** Account lock for 15 minutes after 5 failed attempts.
    - **Access Control:** Restricted to admin-authorized devices only.

### 7.2 Forgot Password
- Triggered via email reset link.
- **Complexity Rules:** Min 8 chars, uppercase, lowercase, number, and special character.
- **Expiry:** Reset link expires after 15 minutes.

### 7.3 Dashboard
Real-time KPI overview including:
- **Total Patients:** Lifetime registration count.
- **Today's Appointments:** Breakdown by status (Waiting, In-Progress, Completed, Cancelled).
- **Today's Revenue:** Breakdown by consultation and procedure fees.
- **Active Staff:** Currently logged-in members.
- **Stock Alerts:** Drugs at or below minimum threshold.
- **Visual Analytics:** Bar/Pie/Line charts for trends (auto-refreshing).

### 7.4 Patient Management
- **Search/Filter:** By Name, Mobile, MRD No., or Date Range.
- **Listing View:** MRD No., Name, Age, Gender, Masked Mobile, Date, Status.
- **Management:** Profile upgrades (clinical history, allergies), deactivation, and deletion (with reason).
- **Note:** Mobile numbers are masked in lists; only visible inside individual records.

### 7.5 Appointment Management
- **Filters:** By Date, Doctor, Status, and Purpose.
- **Bulk Operations:** Bulk SMS/WhatsApp, Bulk Reschedule/Cancel, Bulk Shift to Next Day.
- **Doctor Configuration:** 
    - Morning/Evening shifts.
    - Inter-appointment gaps (Default: 10 mins).
    - Holiday management (prevents booking).

### 7.6 Roles & Permissions Management
### Table 6: User Roles & Permissions Matrix
| Module / Feature | Admin | Doctor | Reception | Nursing | Medical |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Patient Registration** | A/E/V/D | V/E* | A/E/V | V | V (Name/MRD) |
| **Profile Upgrade** | A/E | A/E | View Only | View Only | No Access |
| **Appointment Mgmt** | A/E/V/D | V/E | A/E/V | View Only | No Access |
| **Check-In** | V | V | A/E | V | No Access |
| **Consultation (7 Tabs)**| V | A/E/V | V (Billing) | V/E (Vitals) | No Access |
| **Billing / Payment** | A/E/V | Disc/FOC | A/E/V | No Access | No Access |
| **Drug Prescription** | V | A/E/V | No Access | No Access | V (Dispense) |
| **Drug Stock** | A/E/V | V | No Access | No Access | A/E/V |
| **Procedure Mgmt** | V/Config | A/E/V | V (Billing) | V/E (Notes) | No Access |
| **Image Management** | V | A/E/V | No Access | A/V | No Access |
| **Lab Investigation** | Config | Req/V | Upload PDF | Upload/Entry | No Access |
| **Consent Forms** | Config | A/V | Print/V | Print/V | No Access |
| **Reports & Analytics** | Full | Own Patients| Limited | F/U Only | Drug Only |

*(A=Add, E=Edit, V=View, D=Delete)*

### 7.7 Doctor Management
- **Configuration:** Name, Email, Consultation Fee, Available Days.
- **Reporting:** Total patients, income, FOC/Discount approvals.

### 7.8 Staff Management
- Accounts for Reception, Nursing, and Medical roles.
- **Attendance:** Biometric integration or manual logging.
- **Salary:** Monthly calculation based on attendance, overtime, and bonuses.

### 7.9 Billing & Transaction Management
- Comprehensive transaction log.
- **Configuration:** Fee per doctor, payment modes (Cash, Card, UPI, Razorpay).
- **Discounts:** Admin/Doctor-only access to discount fields.

### 7.10 Drug Master & Inventory Management
- Generic/Brand names, form (Tablet, Cream, etc.), dosage, stock levels.
- **Simple Drugs (S):** Separate inventory for sample/MR-provided drugs.
- **Alerts:** Automated low-stock and near-expiry alerts.

### 7.11 Lab Investigation Master
- Configurable test groups (CBC, LFT, etc.) and parameters.
- **Validation:** Normal ranges for Male/Female/Child; critical value flagging in red.

### 7.12 Procedure Master Management
- Base pricing, location-based rates, and size-based rates.
- **Templates:** Pre/Post-procedure instruction templates.

### 7.13 Offers & Discount Management
- Rules for consultation and procedure fees.
- **FOC Category:** Hides all billing fields for specific patients.

### 7.14 Notifications & Alerts Management
- **Templates:** Confirmation, Reminder, Follow-Up, Birthday, Bulk Message.
- Supports dynamic placeholders (e.g., `{Patient Name}`).

### 7.15 Reports & Analytics
- **Patient Reports:** Registrations, F/U, Missed visits, Enquiries.
- **Financial Reports:** Consultation/Procedure income, Transaction logs.
- **Clinic Expenses:** Electricity, Rent, Salary, Drug Purchases, Printing, etc.
- **P&L Summary:** Auto-calculated Net Profit.
- **Pharmacy Reports:** Dispensing history, Stock levels, Returns.

### 7.16 Settings
- **Clinic Profile:** Name, Address, Logo, Operating Hours.
- **Prescription Template:** Global control over fonts, layouts (A4/A3), and headers/footers.
- **Security:** Device authorization management and access logs.
- **Google Review Link:** Sendable review link for Tab 6.

### 7.17 Support
- Ticketing system for technical, billing, or access issues.

### 7.18 My Profile
- Admin personal details and secure password management.

### 7.19 Video Calling
- integrated video consultation capability.

---

## 8. Reception Panel Features

### 8.1 Login
- Email and Password with device-level authorization.

### 8.2 Forgot Password
- Email-based reset with 24-hour link expiry.

### 8.3 Dashboard
- **Summaries:** Today's appointments, check-ins, waiting count.
- **Quick Actions:** Registration, Booking, Search, Billing.
- **Internal Comms:** Notification panel for Doctor signals (e.g., "Next Patient").
- **Visuals:** Colour-coded statuses (Waiting: Yellow, In-Progress: Blue/Blinking, Completed: Green, Cancelled: Red).

### 8.4 Patient Registration
- **Fields:** Surname, Middle Name, Last Name, Mobile (10 digits), Gender, Address, Language.
- **MRD No. Generation:** `P[MM]-[YY][NNNN]` (e.g., P03-260001).
- **Sticker Printing:** Name, MRD No., Barcode.
- **OTP Verification:** Required for editing sensitive fields (Name, Mobile, etc.).

### 8.5 Appointment Booking & Management
- **Case ID Format:** `C[Token]-[VisitCount]-[Date]` (e.g., C001-001-130326).
- **Booking:** Auto-fill from search, auto-generated time slot (editable).
- **F/U Missed Handling:** Log outcome (Rescheduled, No Answer, etc.) and create special notes.

### 8.6 Check-In Management
- Changes status to "In-Progress" (Blinking).
- Triggers notification on Doctor's panel and Waiting Display.

### 8.7 Billing & Payment Processing
- **Net Fee Calculation:** `Base Fee - Discount`.
- **Payment Modes:** Cash, Card, UPI, Split Payments.
- **Receipt Printing:** Service-wise breakdown with Transaction ID.

### 8.8 Consent Form Management
- Auto-populated templates based on procedure and language.

### 8.9 Lab Report Upload
- Upload PDF reports; manual entry of key parameter values.

### 8.10 My Profile
- Personal info and password updates.

---

## 9. Doctor Panel Features

### 9.1 Login
- Standard secure login with authorized device restriction.

### 9.2 Forgot Password
- Secure reset via registered email.

### 9.3 Dashboard
- **Appointment List:** View today's queue and navigate via calendar.
- **Signals:** "Next Patient" button updates Reception and Display screen.
- **Patient Workspace:**
    - **Side Panel:** Profile, Vitals history (last 4), Billing history.
    - **Special Notes:** Alerts for missed visits, drug unavailability, and past advice.
    - **Internal Messaging:** Chat with Nursing staff.

### 9.4 Patient Consultation – 7-Tab Workflow

#### Tab 1 – Complaints
- **Vitals:** Read-only (entered by Nursing) with last 4 records (BP, BMI, Weight).
- **Clinical Entry:** Present complaint, Duration (Days/Months/Years), Severity, Onset, Factors, Past/Personal/Surgical history.
- **Obstetric History:** (Female-only toggle).

#### Tab 2 – Investigation
- Select tests from master list.
- **Comparison View:** Excel-style view showing historical values against normal ranges.
- **Alerts:** Out-of-range values flagged in red; Critical alerts for extreme values.

#### Tab 3 – Drugs / Prescription
- **Search:** By Generic or Brand name.
- **Details:** Dose, Frequency (OD, BD, etc.), Timing (Before/After Food), Duration.
- **Stock Intelligence:** Pop-up if drug is unavailable.
- **Simple Drugs (S):** Auto-deduct from sample inventory.
- **Formatting:** Admin-controlled template; Doctor can only adjust font size.

#### Tab 4 – Procedure Management
- Select from master list (auto-populates consumables/fees).
- **Tracking:** Session counter (e.g., 2/4), technical parameters (Power, Spot Size, etc.).
- **Delay Logic:** If late, prompt to "Auto Upgrade" remaining sessions.
- **Automation:** Pre/Post-procedure notes and auto-consent forms.

#### Tab 5 – Image Management
- Organize by Procedure > Session.
- **Tools:** Zoom, Crop, Rotate, Annotate.
- **Comparison:** Side-by-side view with independent zoom/pan controls.
- **Stamp:** Automated date/time watermark on images.

#### Tab 6 – Diagnosis, Instructions & Follow-Up
- **Diagnosis:** ICD-10 search or free text.
- **Advice:** Auto-suggestions from master instruction list.
- **F/U Calendar:** Scheduled date list (e.g., 1/4 - Monday).
- **Google Reviews:** Toggle to send review link via WhatsApp/SMS.

#### Tab 7 – Final Report / Print Preview
- Preview of compiled prescription.
- **Customization:** Hide/Show sections via Eye icon (per patient).
- **Printing:** A4, A3, or 4-side layout.

### 9.5 Appointment & Follow-Up Management
- Prioritized call list generation for Nursing.
- Smart color-coded calendar (Laser, Inquiry, F/U, New Case).

### 9.6 Billing View
- Side-panel visibility of Today's/Monthly/Yearly/Total billing.
- Doctor-applied discounts trigger Reception alerts.

### 9.7 Pharmacy View
- Dispensing status tracking (Taken / Not Taken / Unavailable).

### 9.8 Reports & Analytics
- Patient volume and income reports for the logged-in doctor.

---

## 10. Nursing Panel Features

### 10.1 Login
- Secure login for nursing staff.

### 10.2 Forgot Password
- Email reset functionality.

### 10.3 Dashboard
- Today's vitals queue and prioritized call list from the Doctor.

### 10.4 Patient Vitals Entry
- Entry of Height, Weight, Temp, Pulse, BP, SpO2.
- Auto-calculated BMI.

### 10.5 Lab Report Management
- PDF upload and manual parameter value entry.
- 'Sample Collected By' field for audit trail.

### 10.6 Follow-Up & Call Management
- Execute prioritized calls.
- **Outcomes:** Record if rescheduled, no answer, or patient feedback.
- **Privacy:** Toggle 'Do Not Call' if requested by patient.

---

## 11. Medical / Pharmacy Panel Features

### 11.1 Login
- Restricted access for pharmacy staff.

### 11.3 Dashboard
- Real-time queue of prescriptions pending dispensing.
- Prominent highlights for low-stock and near-expiry drugs.

### 11.4 Prescription & Drug Dispensing
- **Privacy:** Access limited to drug lists only (no clinical notes).
- **Statuses:**
    - **Taken:** Deducts from stock; records staff ID.
    - **Not Taken:** Logs reason; creates Doctor alert for next visit.
    - **Unavailable:** Sends instant notification to Doctor/Admin.

### 11.5 Drug Stock Management
- Detailed dispense history per drug.
- **Returns:** Process unused drugs back into inventory.

---

## 12. Patient Waiting Display Screen

### 12.1 Display Overview
- Read-only screen for waiting areas.
- Shows current consulting patient and "Next in Queue".

### 12.2 Current & Next Patient Display
- Large, high-visibility text in the patient's preferred language.
- **Blinking:** Highlights the next patient when it's their turn to enter.

### 12.3 Real-Time Updates
- Driven by Doctor's "Next Patient" trigger.
- Persistent display that auto-refreshes and handles network drops gracefully.

---

**Warning:** *A printed document may not contain the up-to-date information! The digital version is the single source of truth.*

**--- End of Document ---**
