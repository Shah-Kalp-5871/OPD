Functional Requirements Document
OPD / Clinic Management System


Field	Details
Document Title	FRD – OPD / Clinic Management System
Version	V1.0
Document Status	Initial Draft
Author(s)	Dr Nikunj Valaki
Filename	FRD_OPD_Clinic_Management_System_V1.0
Date	April 2026
Document	Confidential
 
Table of Content

1. Revision History
2. Acronyms and Abbreviations
3. Responsibility
4. Objectives of the Document
5. Organizational Classification of the Document
6. OPD Clinic Management System – Initial Details
6.1 Purpose of Project
6.2 Business Objectives
6.3 Technology Stack
6.4 Scope of Work
7. Admin Panel Features
7.1 Login
7.2 Forgot Password
7.3 Dashboard
7.4 Patient Management
7.5 Appointment Management
7.6 Roles & Permissions Management
7.7 Doctor Management
7.8 Staff Management
7.9 Billing & Transaction Management
7.10 Drug Master & Inventory Management
7.11 Lab Investigation Master
7.12 Procedure Master Management
7.13 Offers & Discount Management
7.14 Notifications & Alerts Management
7.15 Reports & Analytics
7.16 Settings
7.17 Support
7.18 My Profile
7.19 Vidio calling 
8. Reception Panel Features
8.1 Login
8.2 Forgot Password
8.3 Dashboard
8.4 Patient Registration
8.5 Appointment Booking & Management
8.6 Check-In Management
8.7 Billing & Payment Processing
8.8 Consent Form Management
8.9 Lab Report Upload
8.10 My Profile
9. Doctor Panel Features
9.1 Login
9.2 Forgot Password
9.3 Dashboard
9.4 Patient Consultation – 7-Tab Workflow
9.4.1 Tab 1 – Complaints
9.4.2 Tab 2 – Investigation
9.4.3 Tab 3 – Drugs / Prescription
9.4.4 Tab 4 – Procedure Management
9.4.5 Tab 5 – Image Management
9.4.6 Tab 6 – Diagnosis, Instructions & Follow-Up
9.4.7 Tab 7 – Final Report / Print Preview
9.5 Appointment & Follow-Up Management
9.6 Billing View
9.7 Pharmacy View
9.8 Reports & Analytics
9.9 My Profile
10. Nursing Panel Features
10.1 Login
10.2 Forgot Password
10.3 Dashboard
10.4 Patient Vitals Entry
10.5 Lab Report Management
10.6 Follow-Up & Call Management
10.7 My Profile
11. Medical / Pharmacy Panel Features
11.1 Login
11.2 Forgot Password
11.3 Dashboard
11.4 Prescription & Drug Dispensing
11.5 Drug Stock Management
11.6 Alerts & Notifications
11.7 My Profile
12. Patient Waiting Display Screen
12.1 Display Overview
12.2 Current & Next Patient Display
12.3 Real-Time Updates
 
Table of Tables

Table 1  Document Information
Table 2  Document Version Control
Table 3  Acronyms and Abbreviations
Table 4  Document Classification
Table 5  Technology Stack
Table 6  User Roles & Permissions Matrix
Table 7  MRD No. Format
Table 8  OPD Case ID Format
Table 9  Patient Registration Fields
Table 10 Appointment Form Fields
Table 11 Consultation Fee Fields
Table 12 Drug Prescription Fields
Table 13 Procedure Tracking Fields
Table 14 Lab Investigation Groups
Table 15 Vitals Parameters
Table 16 Reporting Views

Warning: A printed document may not contain the up to date information! The current document is located in the specified path shown in the footer.
 
1. Revision History
Document Information
Table 1 Document Information
Document Information	
Project:	OPD / Clinic Management System
Document Version	V1.0
Document Status	Initial Draft
Author(s):	Dr Nikunj Valaki 
Filename:	FRD_OPD_Clinic_Management_System_V1.0

Document Version Control
Table 2 Document Version Control
Revision	Date of Issue	Pages Affected	Reason	Summary of Change
1.0	April 2026	All	Initial Draft	Original – Full FRD document for OPD / Clinic Management System
 
2. Acronyms and Abbreviations
Table 3 Acronyms and Abbreviations
Acronym	Definition
Dr 	Dr Nikunj Valaki 
OPD	Outpatient Department
FRD	Functional Requirements Document
MRD	Medical Record Department – used as the unique Patient ID prefix
JWT	JSON Web Token – authentication mechanism
RBAC	Role-Based Access Control
FOC	Free of Charge – patient category with no billing
F/U	Follow-Up – scheduled revisit after initial consultation
BRD	Business Requirements Document
SOW	Statement of Work
SMS	Short Message Service
UPI	Unified Payments Interface
OTP	One-Time Password
CBC	Complete Blood Count – lab investigation group
LFT	Liver Function Test – lab investigation group
RFT	Renal Function Test – lab investigation group
BMI	Body Mass Index – auto-calculated from Height and Weight
BP	Blood Pressure
SpO2	Oxygen Saturation level (%)
ICD-10	International Classification of Diseases, 10th Revision
MR	Medical Representative – drug sample provider
UI	User Interface
API	Application Programming Interface
PDF	Portable Document Format
CSV	Comma-Separated Values
E/D	Enable / Disable – field-level admin configuration option
KPI	Key Performance Indicator
P&L	Profit and Loss
DOB	Date of Birth
EMI	Equated Monthly Instalment
 
3. Responsibility
The following table outlines the roles responsible for the creation, review, and approval of this document.

Role	Name / Party	Responsibility
Business Analyst	Dr Nikunj Valaki	Requirement elicitation, FRD creation, gap analysis
Project Manager	Dr Nikunj Valaki	Review, approval, and delivery oversight
Client / Clinic Owner	Confidential	Requirement input, review, and final sign-off
Development Team	Dr Nikunj Valaki	Technical feasibility review and implementation
QA Team	Dr Nikunj Valaki	UAT support and validation against this FRD
 
4. Objectives of the Document
This document is to ensure that we are on the same page before starting the new project together. Please go through the same and let us know if there is any query or concern regarding any of the listed points in this document.

The purpose of the Functional Requirements Document (FRD) is to ensure all stakeholders share a common understanding of the system's functional scope before development commences. A functional requirement defines a purpose or function of a system and its components. A function is described as a set of inputs, the behavior, and outputs. Functional requirements may be technical details, data manipulation, calculations and processing, and other specific functionality that define what a system is supposed to accomplish. Functional requirements specify particular results of a system and drive the application architecture of a system.


The primary objective of this document is to clearly define all functional and operational requirements of the hospital/clinic management software, ensuring that all stakeholders have a common understanding before the development process begins.
This document provides a detailed description of the system’s key features, including patient registration, appointment management, OPD/IPD management, billing system, electronic medical records (EMR), laboratory integration, pharmacy management, and report generation.
Furthermore, it defines user roles and access controls (such as doctor, receptionist, and admin) to ensure data security and an efficient workflow.
The main goal of this software is to simplify, streamline, and enhance the efficiency of daily operations for doctors and staff, while also ensuring that patients receive better, faster, and more convenient services, enabling them to benefit from maximum facilities.
Additionally, this document aims to make the development process more structured, and to serve as a reference for future changes, upgrades, and maintenance, ensuring that the system remains scalable and reliable.










5. Organizational Classification of the Document
All documentation, communication, or material prepared under this report shall be considered the proprietary property of Dr. Nikunj Valaki. All rights over such material shall remain solely with Dr. Nikunj Valaki.
No third party shall be granted access to this material without prior written authorization from Dr. Nikunj Valaki.
This report is classified as confidential and is not intended for public disclosure. Any request to access or use this report shall be subject to prior approval from Dr. Nikunj Valaki.

Table 4 Document Classification
Document Classification	
Type	Confidential
Departments	Classified with access permission to Dr Nikunj valaki
 
6. OPD Clinic Management System – Initial Details
6.1 Purpose of Project
The OPD / Clinic Management System is a comprehensive, web-based clinical information platform designed to fully digitise and automate the operations of an outpatient department or specialty clinic (such as a dermatology/skin clinic). The system replaces all manual, paper-based workflows with a structured, role-controlled digital solution covering patient management, appointment scheduling, clinical consultations, drug prescriptions, multi-session procedure tracking, before/after image documentation, billing, pharmacy management, and reporting and analytics ,video calling .
6.2 Business Objectives
-	To digitise and automate the complete OPD workflow, from patient registration through final report generation, eliminating paper-based records.
-	To enforce role-based access control, ensuring that each staff member can only access the features and data relevant to their role.
-	To provide real-time clinical decision support through drug availability alerts, investigation out-of-range flagging, and vitals history tracking.
-	To enable multi-session procedure tracking with automated follow-up scheduling, missed appointment detection, and delay management.
-	To provide comprehensive reporting and analytics for clinical, financial, and operational decision-making by Admin and Doctors.
-	To ensure patient data privacy through device-level access restrictions, mobile number masking in list views, and OTP-verified record edits.
-	To streamline internal communication between Doctor, Reception, and Nursing staff through real-time in-system notifications and messaging.
6.3 Technology Stack
Table 5 Technology Stack
Layer	Technology
Frontend	React.js (Single Page Application)
Backend	Node.js with Express.js (RESTful API)
Database	PostgreSQL
Authentication	JWT (JSON Web Tokens) with role-based claims
Payment Gateway	Razorpay (UPI, Card, Net Banking, Online)
Notifications	SMS Gateway + WhatsApp Business API
File Storage	Server-side / Cloud storage for PDF reports and clinical images
Real-Time Updates	WebSocket / Server-Sent Events for display screen and notifications
6.4 Scope of Work
The following panels and user roles are in scope for this project:
-	Admin Panel (Clinic Owner / Manager): Full system control — master data, staff accounts, RBAC permissions, billing configuration, reporting, and system-wide settings.
-	Reception Panel (Web): Front-desk staff interface for patient registration, appointment booking, check-in, billing, consent forms, and lab report uploads.
-	Doctor Panel (Web): Primary clinical interface with a structured 7-Tab OPD consultation workflow — Complaints, Investigation, Drugs, Procedure, Images, Diagnosis, and Final Report — along with appointment and follow-up management.
-	Nursing Panel (Web): Used by nursing staff to enter patient vitals, upload lab reports, and manage follow-up call lists.
-	Medical / Pharmacy Panel (Web): Restricted panel for pharmacy staff to view prescriptions, confirm drug dispensing, manage stock, and report unavailability.
-	Patient Waiting Display Screen: A dedicated read-only display (TV/monitor in the waiting area) showing the current and next patient in queue, updated in real-time.
 
7. Admin Panel Features
The Admin Panel is the master control interface of the OPD / Clinic Management System. It is accessible exclusively by the Clinic Owner or designated Manager. The Admin has full control over all modules, master data, staff accounts, permissions, financial configuration, and system settings.
7.1 Login
-	The admin will be able to log in to the system by entering the following credentials:
●	Email Address: The admin will have to enter their registered email address.
○	Here is the acceptance criteria for this detail:
○	The field must not accept blank or null values.
○	Email format must follow standard validation (e.g., name@example.com).
○	Leading and trailing spaces must be trimmed automatically.
○	On an invalid format, an error message must be displayed stating, "Please enter a valid email address."
●	Password: The admin will have to enter their account password.
○	Here is the acceptance criteria for this detail:
○	The field must not accept blank or null values.
○	The password field must be masked by default.
○	The admin will have a 'Show/Hide password' toggle to view or mask the password.
○	On incorrect password, the system must display: "Invalid credentials. Please try again."
○	After 5 consecutive failed login attempts, the account must be temporarily locked for 15 minutes.
-	After entering the above credentials, the admin will be able to log in to the system.
-	The system must restrict login to admin-authorised devices only. If an unauthorised device attempts to log in, the access must be automatically blocked and the attempt must be logged for admin review.
-	On successful login, the admin will be redirected to the Admin Dashboard.
7.2 Forgot Password
-	If the admin forgets their password, they can click on the 'Forgot Password' link on the login screen.
-	Upon clicking, the admin will be prompted to enter their registered email address. A password reset link will be sent to that email.
●	Enter New Password: The admin will be able to create a new password.
○	Here is the acceptance criteria for this detail:
○	The password must meet defined complexity rules: minimum 8 characters, at least one uppercase letter, at least one lowercase letter, at least one number, and at least one special character.
○	No spaces in between the characters are allowed.
○	The admin will have a 'Show/Hide password' toggle; by default the password will be masked.
●	Confirm New Password: The admin must re-enter the new password to confirm.
○	Here is the acceptance criteria for this detail:
○	The Confirm Password field must match the New Password exactly.
○	In case the passwords do not match, the system must display: "Passwords do not match."
○	The reset link must expire after 15 minit  for security.
-	Upon successful password reset, the admin will be required to log in again with the new credentials.
7.3 Dashboard
-	Upon login, the admin will be directed to the main dashboard which provides a real-time overview of clinic operations.
-	The admin will be able to view the following KPI cards on the dashboard:
●	Total Registered Patients: The admin will be able to view the total number of patients ever registered in the system.
●	Today's Appointments: The admin will be able to view the total number of appointments scheduled for the current date, with a breakdown by status (Waiting, In-Progress, Completed, Cancelled).
●	Today's Revenue: The admin will be able to view the total billing amount collected on the current day, broken down by consultation fees and procedure fees.
●	Active Staff: The admin will be able to view the number of staff members currently logged in and active on the system.
●	Pending Follow-Ups: The admin will be able to view the number of patients whose follow-up date falls on the current day and are yet to check in.
●	Drug Stock Alerts: The admin will be able to view the number of drugs that have fallen at or below their configured minimum stock threshold.
-	Clicking on any KPI card will redirect the admin to the corresponding management section for detailed information.
-	The dashboard will include visual analytics in the form of bar charts, pie charts, and line graphs for patient volume trends, consultation income, procedure revenue, and follow-up compliance rates.
-	All charts and KPI data will auto-refresh in real-time without manual page reload.
7.4 Patient Management
-	The admin will be able to view a complete listing of all registered patients with the ability to search, filter, and manage patient records.
-	The admin will be able to search patients by:
●	Patient Name (partial or full name match)
●	Mobile Number (exact match)
●	MRD No. (exact match)
●	Registration Date (date range filter)
-	The patient listing will display the following columns: MRD No. | Patient Name | Age | Gender | Contact Number (masked) | Registration Date | Status.
-	The admin will be able to upgrade patient profiles by adding clinical details including Date of Birth, Blood Group, Email Address, Past History, and Allergy History.
-	The admin will be able to deactivate a patient record. Deactivated patients will be retained in historical records but excluded from active lists. A confirmation prompt must appear before deactivation.
-	The admin will be able to permanently delete a patient record with a mandatory reason entry and a double-confirmation prompt.
NOTE: Mobile numbers must never appear in any patient listing or search result. They are only visible when an individual patient record is opened.
7.5 Appointment Management
-	The admin will be able to view and manage all clinic appointments across all dates and doctors.
-	The admin will be able to filter appointments by Date, Doctor, Status (Waiting / In-Progress / Completed / Cancelled), and Purpose of Visit.
-	The admin will be able to perform the following bulk operations on appointments for a selected date:
●	Send Pre-Typed SMS/WhatsApp Messages: The admin will be able to select a date and send a pre-configured message to all patients scheduled on that date simultaneously.
●	Bulk Cancel / Reschedule: The admin will be able to cancel or reschedule all appointments for a specific date (e.g., when the doctor is unavailable).
●	Bulk Shift to Next Available Day: The admin will be able to move all appointments from a cancelled date to the next available working day in a single action.
-	The admin will be able to configure each doctor's time slot settings:
●	Available Time Ranges: Define morning and evening shift timings (e.g., 9:00 AM – 1:00 PM and 4:00 PM – 7:30 PM).
●	Inter-Appointment Gap: Set the default time gap between consecutive appointments (default: 10 minutes). This setting must be configurable per doctor.
●	Minimum Slot Duration: Configure the minimum time allocated per appointment slot.
●	Holiday / Unavailable Dates: Mark specific dates as unavailable. The system must prevent appointment booking on those dates and show a pop-up with the next available date.
7.6 Roles & Permissions Management
-	The admin will be able to define and manage what each staff role can view, add, edit, or delete across all system modules.
-	The system supports the following roles: Admin, Doctor, Reception, Nursing, Medical/Pharmacy.
Table 6 User Roles & Permissions Matrix
Module / Feature	Admin	Doctor	Reception	Nursing	Medical
Patient Registration	A/E/V/D	V/E*	A/E/V	V	V (Name/MRD)
Profile Upgrade	A/E	A/E	View Only	View Only	No Access
Appointment Management	A/E/V/D	V/E	A/E/V	View Only	No Access
Check-In	V	V	A/E	V	No Access
Consultation (7 Tabs)	V	A/E/V	V (Billing)	V/E (Vitals)	No Access
Billing / Payment	A/E/V	Discount/FOC	A/E/V	No Access	No Access
Drug Prescription	V	A/E/V	No Access	No Access	V (Dispense)
Drug Stock	A/E/V	V	No Access	No Access	A/E/V
Procedure Management	V/Configure	A/E/V	V (Billing)	V/E (Notes)	No Access
Image Management	V	A/E/V	No Access	A/V	No Access
Lab Investigation	Configure	Request/V	Upload PDF	Upload/Entry	No Access
Consent Forms	Configure	A/V	Print/V	Print/V	No Access
Reports & Analytics	Full	Own Patients	Limited	F/U Only	Drug Only
Master Data	A/E/V/D	Add Drug/Proc	No Access	No Access	No Access
Staff Management	A/E/V/D	No Access	No Access	No Access	No Access
System Settings	Full	No Access	No Access	No Access	No Access
* Doctor can only edit clinical fields. Basic registration fields require OTP verification even for Doctor edits.
-	The admin will be able to configure which consultation tabs are mandatory (patient cannot proceed to the next step without completing them) and which can be skipped.
-	The admin will be able to enable or disable specific fields and sections within each panel at the field level.
-	A = Add: Permission to create a new record 
-	E = Edit: Permission to modify existing information 
-	V = View: Permission to view information only (no changes allowed) 
-	D = Delete: Permission to permanently remove a record
-	E/D= Enable / Disable
-	No Access
-	View Only
-	
7.7 Doctor Management
-	The admin will be able to create, edit, enable, or disable doctor accounts on the system.
-	For each doctor, the admin will be able to configure the following:
●	Doctor Name: The admin will be able to enter the full name of the doctor.
○	Here is the acceptance criteria for this detail:
○	The field must not accept blank or null values.
○	The field must allow alphabetic characters, spaces, and standard title prefixes (Dr., Prof.).
●	Email Address: The admin will be able to enter the doctor's registered email address for login.
○	Here is the acceptance criteria for this detail:
○	The field must not accept blank or null values.
○	Email format must follow standard validation.
○	Duplicate emails must not be allowed.
●	Consultation Fee: The admin will be able to set the default consultation fee for the doctor.
○	Here is the acceptance criteria for this detail:
○	The field must accept only numeric values.
○	The field must not accept blank or null values.
○	The value must be editable at any time by the admin.
●	Available Days: The admin will be able to select the days of the week on which the doctor is available.
○	Here is the acceptance criteria for this detail:
○	Days must be selectable from a predefined checklist (Monday to Sunday).
○	At least one day must be selected.
-	The admin will be able to view doctor-level reporting including total patients seen, consultation and procedure income generated, and FOC and discount approvals made.
7.8 Staff Management
-	The admin will be able to add, edit, and deactivate staff accounts for Reception, Nursing, and Medical/Pharmacy roles.
-	For each staff member, the admin will be able to configure the following:
●	Full Name: The admin will be able to enter the staff member's full name.
○	Here is the acceptance criteria for this detail:
○	The field must not accept blank or null values.
○	Must allow alphabetic characters and spaces only.
●	Email Address: The admin will be able to enter the staff member's email address used for login.
○	Here is the acceptance criteria for this detail:
○	Email format must follow standard validation.
○	Duplicate emails must not be allowed.
●	Role: The admin will be able to assign a role to the staff member.
○	Here is the acceptance criteria for this detail:
○	Role must be selected from the predefined list: Reception, Nursing, Medical.
○	The field must not accept blank or null values.
-	The admin will be able to track staff attendance. If a biometric machine is integrated, attendance will be auto-recorded. Otherwise, the admin can manually log attendance.
-	The admin will be able to view individual staff performance reports showing patients registered, appointments handled, follow-up calls made, and income generated.
-	The admin will be able to calculate monthly salary based on attendance, with overtime hours calculated at the admin-configured per-hour overtime rate. Bonus and incentive amounts can also be added manually.
7.9 Billing & Transaction Management
-	The admin will be able to view all financial transactions across the clinic including consultation fees, procedure payments, discounts applied, FOC records, partial payments, and refunds.
-	The admin will be able to set and update the default consultation fee per doctor. This fee will be pre-filled at the Reception billing counter for each appointment.
-	The admin will be able to configure accepted payment modes: Cash, Card, UPI, and Online (Razorpay). The Razorpay API key and secret will be configured from this section.
-	The admin will be able to generate detailed financial reports by date range with patient-wise and service-wise breakdowns, exportable in PDF and CSV formats.
-	The admin will be able to configure discount rules. Only Admin and Doctor are authorised to apply discounts at the patient level during a consultation. Reception and Nursing will not have access to the discount field.
7.10 Drug Master & Inventory Management
-	The admin will be able to maintain a complete drug master database that is synced with the clinic's Excel drug list.
-	For each drug, the admin will be able to configure or view:
●	Content Name / Generic Name
●	Brand Name and Manufacturer
●	Drug Form (e.g., Tablet, Cream, Syrup, Injection, Gel, Serum, Oil, Face Wash, Liquid, Capsule, Solution, Drop, Soap, Shampoo, Lotion, Powder, Sachet, Pessary)
●	Default Dose, Frequency, Timing, and Route
●	Price per Unit / per Tablet
●	Stock Code / Slot Number (internal identifier for costing)
●	Current Stock Quantity
●	Minimum Stock Alert Threshold
●	Near-Expiry Date
-	The admin will be able to manage the Simple Drug list — sample/MR-provided drugs tagged with an (S) prefix. When an (S) drug is prescribed by the Doctor, stock will auto-deduct from this separate (S) inventory.
-	The system will automatically alert the Admin and Doctor when any drug's stock falls at or below the configured minimum threshold. Alerts will persist until stock is replenished.
-	The admin will receive an end-of-day alert listing any new drugs added to the master during the day, with the master Excel file updated automatically.
7.11 Lab Investigation Master
-	The admin will be able to add, edit, disable, or reorder lab investigation groups and their individual parameters.
-	For each investigation parameter, the admin will be able to configure:
●	Test Group Name (e.g., CBC, LFT, Thyroid, Blood Sugar, Lipid Profile, RFT, ESR/CRP, Urine)
●	Parameter Name (e.g., Haemoglobin, SGPT, TSH)
●	Unit (e.g., g/dL, mg/dL, %)
●	Normal Range for Male, Female, and Child (paediatric)
●	Critical Low and Critical High threshold values — results outside these thresholds will be automatically flagged in red
●	Display Order — sequence in which parameters appear in the investigation tab
●	Active / Inactive status — inactive parameters are hidden from the Doctor's investigation selection
7.12 Procedure Master Management
-	The admin will be able to maintain the complete clinical procedure list synced with an Excel file.
-	For each procedure, the admin will be able to configure:
●	Procedure Name
●	Base Price
●	Location-Based Pricing (different body parts may have different rates)
●	Size-Based Pricing
●	Appointment-Inclusive and Appointment-Exclusive pricing variants
●	Associated Instruments and Consumables (auto-populate when procedure is selected by Doctor)
-	The admin will be able to create and manage Pre-Procedure Instruction Templates and Post-Procedure Care Instruction Templates. These templates auto-populate in the Doctor's Procedure Tab when a procedure is selected.
-	If a Doctor adds a new procedure not in the master list, it will appear as a pending addition in the admin panel for review and permanent addition.
7.13 Offers & Discount Management
-	The admin will be able to set and manage discount rules applicable to consultation fees and procedure fees.
-	The admin will be able to configure the FOC (Free of Charge) patient category. When a patient is categorised as FOC, all billing and payment fields will be hidden throughout their entire session.
-	Discounts can only be applied by Admin or Doctor during an active consultation. Reception and Nursing staff do not have access to discount fields.
-	When a Doctor applies a discount or marks a patient as FOC, an automatic pop-up notification will appear at the Reception billing counter informing them of the change.
7.14 Notifications & Alerts Management
-	The admin will be able to manage all SMS and WhatsApp notification templates used across the system. The following template types can be configured:
●	Appointment Confirmation: Sent immediately after an appointment is booked.
●	1-Day Advance Reminder: Auto-sent one day before the scheduled appointment.
●	Follow-Up Reminder: Auto-sent one day before the scheduled follow-up date.
●	Appointment Cancellation: Sent when an appointment is cancelled by staff or admin.
●	Birthday Wish: Auto-sent on the patient's registered birthday if DOB is in their profile.
●	Bulk Appointment Message: Admin-triggered message sent to all patients scheduled on a selected date.
●	F/U Rescheduled Confirmation: Sent after nursing updates a patient's follow-up date from a call.
-	All templates support dynamic placeholders such as {Patient Name}, {Appointment Date}, {Appointment Time}, {Clinic Name}, and {Doctor Name}.
-	The admin will be able to enable or disable each notification type individually.
7.15 Reports & Analytics
-	The admin will be able to access all system reports. All reports support the following time-based filters: Today, 1 Week, 1 Month, Yearly, and Custom Date Range.
7.15.1 Patient Reports
-	The admin will be able to view and export reports on new patient registrations, follow-up visits, missed follow-ups, inquiries, and cancelled appointments.
7.15.2 Income & Financial Reports
-	The admin will be able to view consultation income, procedure income, total revenue, discounts applied, FOC amounts, pending dues, and a full transaction log with patient-wise and service-wise breakdowns.
7.15.3 Hospital Expense Report
-	The admin will be able to log and track all clinic expenses under the following configurable categories:
●	Electricity Bill, Rent, Municipality Tax, Internet/WiFi, Phone Bill
●	Worker Salary, Doctor Salary/Sharing, Nursing Salary, Reception Salary, Bonus/Incentive, Overtime
●	Drug Purchase, Surgical Items (Injections, Syringes, Gloves), Equipment Purchase, Equipment Maintenance
●	Printing / Stationery, Sanitary/Cleaning expenses, Loan/EMI Instalment
-	The admin will be able to view an auto-calculated Profit & Loss (P&L) summary: Total Income minus Total Expenses = Net Profit.
7.15.4 Drug & Pharmacy Reports
-	The admin will be able to view drug dispensing history, drug not-taken records (by patient, drug name, and date), low stock and out-of-stock lists, near-expiry drug lists, and drug return logs.
7.15.5 Staff Reports
-	The admin will be able to view attendance records, working hours, salary summaries, overtime, and individual staff performance KPIs.
7.15.6 Graphical / Chart Views
-	All key report categories will be available in graphical views including bar charts (patient volume, income), pie charts (income breakdown), and line graphs (revenue trends). All charts are interactive and support drill-down.
-	All reports are downloadable in PDF and CSV formats.
7.16 Settings
7.16.1 Clinic Profile
-	The admin will be able to update clinic details including clinic name, address, contact number, email address, operating hours, and clinic logo.
7.16.2 Prescription Template
-	The admin will be able to configure the prescription print template including fonts, bold formatting, page size (A4, A3, 4-side), column layout, header content, footer content, and default hide/show settings for each section.
-	The admin-managed template will control all prescription formatting. Doctors will only be permitted to adjust font size (increase/decrease using arrow controls).
7.16.3 Payment Settings
-	The admin will be able to configure the Razorpay API credentials (API Key and Secret), accepted payment modes, and default fee structures.
7.16.4 Security Settings
-	The admin will be able to manage the list of authorised devices from which the system can be accessed.
-	The admin will be able to review a log of all unauthorised access attempts including the device details, IP address, and timestamp.
-	The system must automatically block login attempts from devices that are not on the authorised device list.
7.16.5 Google Review Link
-	The admin will be able to configure the clinic's Google Review link in the system settings. This link will appear as a sendable option in the Doctor's Diagnosis Tab (Tab 6) on a per-patient, per-visit basis.
7.17 Support
-	The admin will be able to raise, view, and manage support tickets for any system-related issue.
-	Support ticket fields include:
●	Category: Technical Error, Billing Issue, User Access, Feature Request, Other.
●	Priority: Low, Medium, High, Urgent.
●	Status: Open, In Progress, Resolved, Closed.
-	The admin will be able to track the status of each ticket and receive updates from the AIS support team.
7.18 My Profile
-	The admin will be able to update their personal details including name, contact information, and profile picture.
●	Change Password: The admin will be able to change their account password.
○	Here is the acceptance criteria for this detail:
○	The admin must first enter their current password for verification.
○	The new password must meet the defined complexity rules.
○	The Confirm New Password must match the new password exactly.
○	On mismatch, the system must display: "Passwords do not match."
 
8. Reception Panel Features
The Reception Panel is the front-desk interface used by clinic reception staff to manage patient registrations, appointment bookings, check-ins, billing, consent forms, and lab report uploads. All access is restricted to admin-authorised devices only.
8.1 Login
-	The reception staff will be able to log in to the system by entering the following credentials:
●	Email Address: The system must allow the reception staff to enter their registered email address.
○	Here is the acceptance criteria for this detail:
○	The field must not accept blank or null values.
○	Email format must follow standard validation (e.g., name@example.com).
○	Leading and trailing spaces must be trimmed.
○	On invalid format, an error message must be displayed.
●	Password: The system must allow the reception staff to enter their account password.
○	Here is the acceptance criteria for this detail:
○	The field must not accept blank or null values.
○	The password field must be masked by default.
○	A 'Show/Hide password' toggle must be available.
○	The system must restrict login to admin-authorised devices only.
○	Unauthorised device login attempts must be automatically blocked.
-	After successful login, the reception staff will be redirected to the Reception Dashboard.
8.2 Forgot Password
-	If the reception staff forgets their password, they can click the 'Forgot Password' link on the login screen.
-	A password reset link will be sent to the registered email address.
-	The new password must comply with the defined complexity rules. The reset link must expire after 24 hours.
8.3 Dashboard
-	The reception staff will see a real-time dashboard showing today's clinic status at a glance.
-	The dashboard will display the following information:
●	Today's appointment summary: Total appointments, checked-in patients, waiting patients, completed consultations, and cancelled appointments.
●	Quick Action buttons: New Patient Registration, Book Appointment, Search Patient, and View Billing — enabling fast single-person clinic management.
●	Notification Panel: A left-side persistent pop-up notification panel for real-time internal communication between the Doctor and Reception (e.g., next patient signal, payment confirmation notifications, FOC/discount approvals).
-	The appointment list will display by default the current day's patients sorted by appointment time, with the last visited page auto-restored on return.
-	The appointment list will show the following columns: Case No. | Appointment Time | Check-In Time | Patient Name | Visit For | Age | Gender | Address | Billing Status | Status | Action Buttons.
-	Each appointment row will display a colour-coded status indicator:
●	Waiting: Yellow background
●	In-Progress / Blinking: Blue background with blinking patient name
●	Completed: Green background
●	Cancelled: Red/Grey background
●	New Patient: Highlighted in a distinct colour
●	Old Patient: Highlighted in a different colour
-	A Payment Status box will appear below each appointment row showing: PENDING (orange), PAID (green), FOC (blue), or DISCOUNT (purple).
8.4 Patient Registration
-	The reception staff will be able to register new patients in the system. The registration form will collect the following details:
Table 9 Patient Registration Fields
●	Patient Name: The system must allow entry of the patient's full name in three separate sub-fields: Surname, Middle Name, and Last Name.
○	Here is the acceptance criteria for this detail:
○	Each sub-field must not accept blank or null values.
○	Only alphabetic characters and spaces must be allowed.
○	No numbers or special characters are permitted.
○	Minimum length per sub-field: 2 characters.
●	Contact Number: The system must allow entry of the patient's primary mobile number.
○	Here is the acceptance criteria for this detail:
○	The field must accept only numeric values.
○	The number must be 10 digits in length.
○	Duplicate mobile numbers are permitted (multiple patients may share a contact number).
○	The field must not accept blank or null values.
●	Unique MRD No.: The system will automatically generate a unique permanent patient ID in the format P[MM]-[YY][NNNN].
○	Here is the acceptance criteria for this detail:
○	This field is read-only and system-generated; it cannot be manually entered or edited.
○	Format: P = Patient prefix, [MM] = 2-digit month of registration, [YY] = 2-digit year, [NNNN] = 4-digit sequential count of patients registered that month.
○	Example: P03-260001 = First patient registered in March 2026.
Table 7 MRD No. Format
Component	Meaning	Example
P	Permanent Patient ID prefix	P
[MM]	2-digit month of registration	03 (March)
[YY]	2-digit year of registration	26 (2026)
[NNNN]	4-digit sequential patient count for that month	0001 (1st patient)
Full Example	First patient registered in March 2026	P03-260001
●	Gender: The system must allow selection of the patient's gender.
○	Here is the acceptance criteria for this detail:
○	Gender must be selected from a dropdown: Male, Female, Other.
○	The field must not accept blank or null values.
●	Address: The system must allow entry of the patient's full residential address.
○	Here is the acceptance criteria for this detail:
○	The field must not accept blank or null values.
○	Must allow alphanumeric characters and standard punctuation.
○	Minimum length: 10 characters.
●	Preferred Language: The system must allow selection of the patient's preferred communication language.
○	Here is the acceptance criteria for this detail:
○	Language must be selected from a dropdown: Gujarati, Hindi, English.
○	The field must not accept blank or null values.
○	This setting will determine the language used for consent forms and notification messages for this patient.
-	After successful registration, the system will display a 'Print Patient Sticker' button. The sticker will include: Patient Name, Gender, Age, MRD No., and a barcode encoding the MRD No. for physical file labelling.
-	After registration submission, the system will prompt the reception staff with options: Book Appointment, Add Report, or other available actions.
NOTE: Optional profile fields including Date of Birth, Blood Group, Email Address, Allergies, and Past History are available but greyed out at initial registration. These fields can only be completed or edited by the Doctor or Admin at the first physical visit.
-	The following optional fields are available as profile upgrade fields (Enable/Disable by Admin):
●	Date of Birth (Optional E/D): The system must allow entry of the patient's date of birth using a date picker.
○	Here is the acceptance criteria for this detail:
○	Future dates must not be allowed.
○	If entered, the system will auto-calculate and display the patient's age in years, months, or days as appropriate.
○	If a DOB is on file, the system will automatically send a birthday wish SMS/WhatsApp message on the patient's birthday using the Admin-configured template.
●	Blood Group (Optional E/D): The system must allow selection of the patient's blood group.
○	Here is the acceptance criteria for this detail:
○	Blood group must be selected from a dropdown: A+, A-, B+, B-, O+, O-, AB+, AB-.
●	Email Address (Optional E/D): The system must allow entry of the patient's email address.
○	Here is the acceptance criteria for this detail:
○	Email format must follow standard validation.
○	This field is used for digital prescriptions and reminders if configured by Admin.
-	Editing any basic registration field (Name, Contact, Gender, Address, Language) requires OTP verification sent to the patient's registered mobile number. Edits are not saved until OTP is successfully validated.
8.5 Appointment Booking & Management
-	The reception staff will be able to book appointments for both new and existing patients.
Table 8 OPD Case ID Format
Component	Meaning	Example
C	Case prefix
[TTT]	3-digit OPD token number for today (resets daily)	001
[VVV]	3-digit visit count for this specific patient	001 (1st visit)
[DDMMYY]	6-digit appointment date	130326 (13 Mar 2026)
Full Example	Token 1, 1st visit for this patient, 13 March 2026	C001-001-130326
-	The appointment booking form will collect the following details:
Table 10 Appointment Form Fields
●	Patient Search: The reception staff will be able to search for an existing patient by Name, Mobile Number, or MRD No.
○	Here is the acceptance criteria for this detail:
○	Real-time autocomplete suggestions must appear as the user types.
○	Mobile numbers must not appear in search result lists.
○	Selecting a patient must auto-fill their details in the appointment form.
●	Appointment Date: The system will automatically set today's date. The reception staff may change it using a calendar picker.
○	Here is the acceptance criteria for this detail:
○	Already-booked time slots for the selected date and doctor must be shown as disabled.
○	Admin-configured holiday/unavailable dates must show a warning pop-up and suggest the next available date.
●	Appointment Time: The system will auto-generate the appointment time based on the last booked appointment plus the configured inter-appointment gap.
○	Here is the acceptance criteria for this detail:
○	The auto-generated time must be editable by the reception staff.
○	The system must enforce doctor-configured available time ranges.
○	Appointment times outside the configured range must not be permitted.
●	Purpose of Visit: The reception staff must select the purpose from a dropdown.
○	Here is the acceptance criteria for this detail:
○	Options: New Consultation, Follow-Up, Reporting, Inquiry, Procedure.
○	A free-text field must also be available for additional detail.
○	The field must not accept blank or null values.
●	Assigned Doctor: The reception staff must select the consulting doctor from the active doctor list.
○	Here is the acceptance criteria for this detail:
○	Only active/enabled doctors must appear in the dropdown.
○	The field must not accept blank or null values.
●	Patient Category: The reception staff must select the billing category for this appointment.
○	Here is the acceptance criteria for this detail:
○	Options: FOC (Free of Charge) or Payment.
○	Selecting FOC will hide all billing and payment fields throughout the entire session for this patient.
○	For FOC patients, a FOC highlight must appear on the patient name box in all list views.
-	Upon saving the appointment, the system will auto-generate the OPD Case ID and immediately send an appointment confirmation SMS/WhatsApp message to the patient's registered mobile number.
-	The reception staff will be able to edit an existing appointment including date, time, purpose, and doctor assignment. A mandatory reason must be entered before cancelling an appointment.
-	Cancellation of a Follow-Up appointment must automatically create a Special Note in the patient's permanent record.
-	If a patient's follow-up date passes without them checking in, the reception staff must record the outcome:
●	Called & Rescheduled: Enter a new appointment date. The system auto-creates the next appointment and sends a confirmation SMS/WhatsApp to the patient.
●	Called — No Answer: The system auto-creates a Special Note: 'Call not answered – F/U Missed' in the patient's record.
8.6 Check-In Management
-	When a patient arrives at the clinic, the reception staff will be able to check them in.
-	The reception staff will search for the patient by Name or Mobile Number. After selecting the patient:
●	The reception staff will click the Check-In button.
●	The check-in date and time will be automatically stamped on the appointment record.
●	The appointment status will change from Waiting to In-Progress with a blinking indicator.
●	The patient's name will begin blinking on the Doctor's panel and on the Patient Waiting Display Screen.
-	When the Doctor selects the patient's profile in the consultation view, the blinking will stop. This signals the reception staff to prepare the next patient.
-	The reception staff will be able to enter any outstanding appointment details (vitals summary, purpose) at the time of check-in if not previously entered.
8.7 Billing & Payment Processing
-	The reception staff will be able to process billing and collect payments for each patient.
Table 11 Consultation Fee Fields
●	Consultation Fee: The system will pre-fill the consultation fee as configured by the Admin for the assigned doctor.
○	Here is the acceptance criteria for this detail:
○	The field must not accept blank or null values.
○	The fee is editable only by Admin or Doctor; Reception staff cannot change the base consultation fee.
●	Discount (%): A discount percentage can only be applied by the Doctor or Admin.
○	Here is the acceptance criteria for this detail:
○	This field must not be visible or editable by Reception or Nursing staff.
○	When a discount is applied by the Doctor, a pop-up notification must appear at the Reception counter.
●	Net Fee: The system will automatically calculate the net fee after applying any discount.
○	Here is the acceptance criteria for this detail:
○	Net Fee = Consultation Fee – (Consultation Fee × Discount %).
○	This field is read-only and auto-calculated.
●	Payment Status: The system must display the current payment status with colour coding.
○	Here is the acceptance criteria for this detail:
○	Paid: Green colour.
○	Pending: Orange colour.
○	Partial: Yellow colour.
○	FOC: Blue colour (billing fields hidden).
●	Payment Mode: The reception staff must select the payment method used by the patient.
○	Here is the acceptance criteria for this detail:
○	Options: Cash, Card, UPI, Online (Razorpay).
○	Split payments across multiple modes must be supported.
○	The field must not accept blank or null values for paid transactions.
-	Upon payment confirmation, the system will auto-generate a Transaction ID and stamp the payment date and time.
-	The system will auto-generate a detailed printable receipt including Patient Name, MRD No., Case ID, Date, Services Billed (Consultation/Procedure separately), Discount Applied, Amount Paid, Payment Mode, Transaction ID, and Staff Name.
-	For procedure billing, when the Doctor adds a procedure in the Procedure Tab, the pending balance at the Reception counter will be instantly updated.
8.8 Consent Form Management
-	The reception staff will be able to generate, view, and print consent form documents for procedures.
-	When a procedure is added by the Doctor in the Procedure Tab, the corresponding consent form template will be auto-selected.
-	The consent form will auto-populate the following patient details: Patient Name, Gender, Age, Location/City, MRD No., OPD Case No., Procedure Name, and Date.
-	The consent form will be generated in the patient's preferred language as recorded in their profile.
-	The reception staff will be able to print the consent form from the Reception Panel.
-	Signed/scanned consent forms can be uploaded and stored digitally in the patient record, linked to the specific procedure and Case ID.
8.9 Lab Report Upload
-	The reception staff will be able to upload scanned lab reports for any patient.
●	File Upload: The system must allow uploading a scanned lab report in PDF format.
○	Here is the acceptance criteria for this detail:
○	Accepted format: PDF only.
○	The file must be linked to the specific patient and Case ID.
○	The uploaded report will be accessible in the Doctor's Investigation Tab (Tab 2).
○	Maximum file size: As configured by Admin.
-	The reception staff will also have the option to manually enter key lab values (e.g., CBC – Haemoglobin, TLC) alongside the uploaded PDF report. These values will be visible in the Doctor's structured investigation view.
8.10 My Profile
-	The reception staff will be able to update their personal details, contact information, and profile picture.
-	The reception staff will be able to change their account password with current password verification, subject to the same complexity rules as the login password.
 
9. Doctor Panel Features
The Doctor Panel is the primary clinical interface for the consulting physician. It provides a structured 7-Tab OPD consultation workflow, appointment and follow-up management, patient history access, billing visibility, and pharmacy tracking. Access is restricted to admin-authorised devices.
9.1 Login
-	The doctor will be able to log in to the system using their registered email address and password.
-	Login is restricted to admin-authorised devices. Unauthorised device attempts will be auto-blocked.
-	On successful login, the doctor will be directed to the Doctor Dashboard showing today's patient list.
9.2 Forgot Password
-	The doctor will be able to request a password reset via their registered email address. The new password must comply with defined complexity rules and the reset link must expire after 24 hours.
9.3 Dashboard
-	The doctor's default landing view will display today's OPD appointment list with the following columns: Case No. | Appointment Time | Patient Name | Visit Purpose | Age | Gender | Payment Status | Mobile No. | Action Buttons.
-	The dashboard will include a persistent Next Patient Notification area at the top, always showing the next patient's Name, Age, Gender, and Reason for Visit with colour coding.
-	When the doctor clicks 'Next Patient', a signal will be sent to the Reception panel and the Patient Waiting Display Screen to display the next patient.
-	The patient's name in the appointment list will blink when they are checked in by Reception. The blinking stops when the doctor selects that patient's profile, signalling Reception to call the next patient.
-	When a patient is selected from the list, the following persistent panels will be visible at all times:
●	Left-Side Patient Summary Panel: Displays Patient Profile (Name, MRD No., Age, Gender), Full Visiting History, Total Payment History (with clickable drill-down), Latest Vitals History (last 4 records of BP, BMI, Weight in tabular format with dates), and Billing Summary (Today/Monthly/Yearly/Total bills, Consultation and Procedure billed separately).
●	Special Note Section: Always visible at the top of the consultation view. Auto-populated with drug taken/not taken alerts, missed appointment history, delayed follow-up information, and advised-but-not-taken procedures.
●	Internal Message Box: Real-time messaging interface between the Doctor and Nursing staff, accessible without leaving the consultation view.
-	A persistent Notification Box at the bottom of the screen will show payment received (patient name and amount) and return/refund details. Clicking the notification box will open the full daily payment history.
9.4 Patient Consultation – 7-Tab Workflow
The 7-Tab consultation workflow is the core feature of the Doctor Panel. Each tab represents a distinct phase of the clinical encounter. All tab labels, display order, mandatory/optional status, and enable/disable settings are configurable by Admin. When a Doctor registers a new patient or books a new appointment, the system will automatically open Tab 7 (Final Report) after all details are saved, so the Doctor can immediately begin consultation.
9.4.1 Tab 1 – Complaints
-	Tab 1 displays the patient's vitals entered by Nursing or Reception and provides the doctor with fields to record the chief complaint and clinical history.
Table 15 Vitals Parameters
-	The following vitals will be displayed in read-only format (entered by Nursing/Reception). The doctor can click any field to enable inline editing:
●	Height (cm): Numeric field. Enable/Disable by Admin.
●	Weight (kg): Numeric field. Enable/Disable by Admin. Last 4 records tracked.
●	BMI: Auto-calculated from Height and Weight. Last 4 records tracked.
●	Temperature (°F / °C): Numeric field. Entered by Nursing.
●	Pulse Rate (bpm): Numeric field. Entered by Nursing.
●	Blood Pressure (mmHg): Two separate fields for Systolic and Diastolic values (e.g., 120/80). Last 4 records tracked.
●	Oxygen Saturation SpO2 (%): Numeric field. Entered by Nursing.
-	The doctor will be able to enter and edit the following clinical fields in Tab 1:
●	Present Complaint: The doctor will be able to enter the main reason for the patient's visit today.
○	Here is the acceptance criteria for this detail:
○	Free text area. Must not accept blank or null values.
○	No character length restriction.
●	Duration of Complaint: The doctor will be able to enter how long the patient has had this complaint.
○	Here is the acceptance criteria for this detail:
○	Three separate numeric input boxes: Days, Months, Years.
○	Each box must accept only numeric values.
●	Severity: The doctor will be able to select the severity of the complaint.
○	Here is the acceptance criteria for this detail:
○	Must be selected from a dropdown: Mild, Moderate, Severe.
●	Onset: The doctor will be able to select the onset type of the complaint.
○	Here is the acceptance criteria for this detail:
○	Must be selected from a dropdown: Sudden, Gradual.
●	Aggravating Factors: The doctor will be able to enter what makes the complaint worse.
○	Here is the acceptance criteria for this detail:
○	Free text area.
●	Relieving Factors: The doctor will be able to enter what makes the complaint better.
○	Here is the acceptance criteria for this detail:
○	Free text area.
●	Past History: The doctor will be able to record relevant past medical history.
○	Here is the acceptance criteria for this detail:
○	Pre-filled from the patient profile if available.
○	Manually editable.
●	Personal History: The doctor will be able to record relevant personal habits or lifestyle details.
○	Here is the acceptance criteria for this detail:
○	Free text area.
●	Surgical History: The doctor will be able to record previous surgeries.
○	Here is the acceptance criteria for this detail:
○	Free text area with approximate dates.
●	Current Medications: The doctor will be able to record any medications the patient is currently taking from outside the clinic.
○	Here is the acceptance criteria for this detail:
○	Free text area.
●	Obstetric / Gynaecological History: For female patients: the doctor will be able to record LMP, parity, and other relevant details. (Enable/Disable by Admin)
○	Here is the acceptance criteria for this detail:
○	Free text area.
●	Allergy History: The doctor will be able to document known drug or food allergies.
○	Here is the acceptance criteria for this detail:
○	Free text area.
●	Nursing Notes: Nursing-specific observation notes entered before the consultation.
○	Here is the acceptance criteria for this detail:
○	Read-only to Doctor. Entered by Nursing role only.
NOTE: All field labels, positions, and enable/disable status in Tab 1 are fully configurable by Admin.
9.4.2 Tab 2 – Investigation
-	The doctor will be able to request lab investigations from the Admin-configured master investigation list.
-	The doctor will be able to search for a test by name or group. On selection, the test is added to the requested investigations list.
-	Previous investigation results will be displayed in an Excel-style date-wise comparison chart showing historical values against normal ranges. The doctor will be able to scroll through previous results by date and visit.
Table 14 Lab Investigation Groups
Investigation Group	Parameters Included
CBC (Complete Blood Count)	WBC, RBC, Haemoglobin, Haematocrit, MCV, MCH, MCHC, Platelets, Neutrophils %, Lymphocytes %, Eosinophils %
ESR / CRP	ESR (1hr), CRP
Blood Sugar	Fasting, Post-Prandial, HbA1c
Lipid Profile	Total Cholesterol, LDL, HDL, Triglycerides
LFT (Liver Function Test)	SGOT, SGPT, ALP, Bilirubin Total, Bilirubin Direct
RFT (Renal Function Test)	BUN, Creatinine, Uric Acid, eGFR
Thyroid	TSH, T3, T4
Urine	Routine Urine Examination
Custom	Any parameter defined by Admin
-	The system will automatically flag out-of-range values in red against the configured normal range. Critical low/high values will trigger a prominent alert visible to the doctor.
-	Nursing or Reception staff can upload scanned lab reports (PDF) and manually enter individual parameter values against the doctor-requested tests. All results are accessible to the doctor in this tab.
9.4.3 Tab 3 – Drugs / Prescription
-	The doctor will be able to prescribe multiple drugs in a repeating row interface. Each drug row will include the following fields:
Table 12 Drug Prescription Fields
●	Drug Name / Content: The doctor will be able to search for a drug by content name or brand name.
○	Here is the acceptance criteria for this detail:
○	Real-time autocomplete suggestions from the master drug list.
○	On selection, all associated fields (dose, frequency, timing, route, unit cost) must auto-populate.
○	A Brand/Generic name toggle must allow switching between brand and generic display.
●	Dose: The auto-filled dose from the master list.
○	Here is the acceptance criteria for this detail:
○	Editable by the doctor via direct click. Options: 1 Tab, Half Tab, 5 ml, etc.
●	Frequency: The auto-filled frequency from the master list.
○	Here is the acceptance criteria for this detail:
○	Options include: OD, BD, TDS, QID, HS (Night), SOS, Alternate Day, Weekly, Weekly 2 Times, Weekly 3 Times, Every Month.
○	Editable by dropdown selection; manual free-text frequency is not required.
●	Route: Auto-set based on drug type, editable by dropdown.
○	Here is the acceptance criteria for this detail:
○	Options: Oral, Topical, IV, IM, Inhalation.
●	Timing: Auto-filled from master, editable.
○	Here is the acceptance criteria for this detail:
○	Options: Before Food, After Food, With Food, Bedtime, Before Bath, After Dry, With Water, With Milk, Other.
●	Duration (Days): The doctor must enter the number of days for which the drug is prescribed.
○	Here is the acceptance criteria for this detail:
○	Must accept only numeric values.
○	Must not accept blank or null values.
●	Total Quantity: The system will automatically calculate the total quantity required.
○	Here is the acceptance criteria for this detail:
○	Auto-calculated: Frequency × Days.
○	Read-only and auto-updated when Frequency or Days change.
●	Unit Cost: Auto-filled from the master drug price.
○	Here is the acceptance criteria for this detail:
○	Configurable to show or hide on the final prescription by Admin.
●	Special Instructions / Note: The doctor will be able to add specific instructions for this drug.
○	Here is the acceptance criteria for this detail:
○	Pre-typed options available from master (e.g., 'Not taken with milk', 'Keep dry before apply').
○	Free text entry also available.
●	Slot No. / Stock Code: Internal code linking this drug to its stock record.
○	Here is the acceptance criteria for this detail:
○	Auto-filled from the master drug list.
○	Used for cost tracking and costing correspondence.
-	If a prescribed drug is not available in stock, the system must display a pop-up alert: "Drug Not Available. Prescribe Another Drug? Yes / No"
-	If a drug is manually marked as unavailable by Medical staff, a 'Drug Not Available' indicator will be visible to the doctor when prescribing that drug.
-	When a drug's stock falls below the configured minimum threshold, the system will automatically send an alert to the Doctor and Admin.
-	Simple Drugs (S-tagged sample/MR drugs): The doctor will be able to prescribe sample drugs identified by the (S) prefix in the drug list (e.g., '(S) Tab Levocip'). When an (S) drug is prescribed, stock will auto-deduct from the separate simple drug inventory. The taken/not-taken status of (S) drugs will appear in the Special Note section on the patient's next visit.
-	Manual Drug Entry: The doctor will be able to manually enter a drug not found in the master list. Manually added drugs can be pushed to the master list for future use.
-	The first column (content/generic name) can be shown or hidden on the final prescription by Admin. All other prescription formatting is controlled by the Admin template.
9.4.4 Tab 4 – Procedure Management
-	The doctor will be able to add clinical procedures from the Admin-configured master procedure list or enter them manually.
-	When a procedure is selected from the master list, all associated instruments and consumables will auto-populate in the procedure table. This addition will also instantly update the pending balance at the Reception billing counter.
-	The procedure tracking table will include the following fields per session row:
Table 13 Procedure Tracking Fields
Field	Description
Date & Therapist	Date the procedure was performed and the therapist/doctor name
Procedure Name & Device	Procedure name and device used (e.g., Hair Removal – Diode Laser)
Body Part	Treatment area (e.g., Face, Back, Arms)
Session Number	Auto-generated sequential session counter (e.g., 1/4, 2/4, 3/4, 4/4)
Next F/U Date	Auto-generated based on the first session date plus configured between-session interval. Auto-upgrades if patient arrives late.
Technical Parameters	Skin Type, Unit, Power, Wavelength, Pulse Duration, Spot Size, Pulse Impulse, Thickness, Density, Dot Density, Short Fire — configurable fields
Status	Confirmed / Done / Cancelled / Not Available / Not Taken / Advised
Remark / Reason	Free text for status explanation
Rate	Session price — editable by Doctor
Payment Status	Done (green) / Pending (orange)
Action Button	Edit / Cancel session
-	If a procedure is advised but the patient does not schedule it immediately, it will be auto-saved in the Special Note as 'Advised – Not Yet Taken'. When the patient later agrees to the procedure, the doctor can select it from the Previous Procedure List; on re-selection, the Special Note entry is automatically removed.
-	Delayed Appointment: If a patient arrives after their scheduled procedure F/U date, a delay pop-up will appear showing the number of days delay. The doctor will be presented with two options:
●	Auto Upgrade: Reschedule all remaining sessions based on the actual visit date.
●	Keep Original Date: Retain the originally scheduled dates for remaining sessions.
-	The delay reason will be auto-saved in the Special Note section.
-	Pre-Procedure Notes: Admin-configurable instruction templates that auto-populate when a procedure is selected. The doctor can edit or delete them. The admin can set these as optional (hide/show).
-	Post-Procedure Notes: Procedure-specific post-care instruction templates that auto-populate after procedure completion. The doctor can edit them.
-	Consent Form Automation: When a procedure is selected, the corresponding consent form template is automatically selected and populated with the patient's details (Name, Gender, Age, City, MRD No., Case No., Procedure Name, Date) in the patient's preferred language.
9.4.5 Tab 5 – Image Management
-	The doctor will be able to manage before/after clinical photographs organised by procedure and session.
-	Each procedure will have a dedicated image folder auto-created in the image management panel. Images will be organised into sub-folders by session number.
-	The doctor will be able to upload images in JPEG or PNG format. Before/After selection must be made before uploading. An optional camera integration and dermoscope/face scanner integration (Enable/Disable by Admin) are also supported.
-	Each uploaded image will be automatically stamped with the date and time of upload. The date/time stamp will be displayed in a small white box with black font below each image thumbnail. Admin can edit or delete the date/time stamp if required.
-	The following image editing tools will be available: Zoom, Crop, Rotation, Marking/Annotation, Delete.
-	Full-Screen View: Clicking on a single image will open it in full screen. The doctor can navigate between images using side arrow buttons. ESC closes the full-screen view.
-	Comparison View: Clicking the 'Compare' button will open a side-by-side comparison of two or more selected images. The comparison view includes a light divider, independent zoom controls on each side, mouse-drag adjustment, and a reset option.
-	Image list view will be sorted by date, with the most recent entry shown first by default. Sorting by date ascending/descending must be available.
9.4.6 Tab 6 – Diagnosis, Instructions & Follow-Up
-	The doctor will be able to enter the clinical diagnosis, patient instructions, and schedule the next follow-up.
●	Primary Diagnosis: The doctor will be able to search and select the diagnosis by ICD-10 code or free text.
○	Here is the acceptance criteria for this detail:
○	The system must support real-time search of ICD-10 codes and descriptions.
○	Free text entry must also be available for diagnoses not in the ICD-10 list.
○	Individual diagnosis entries can be shown or hidden using the Eye icon on the prescription (per patient, per visit; not permanently deleted).
●	Differential Diagnosis: The doctor will be able to list possible alternative diagnoses considered.
○	Here is the acceptance criteria for this detail:
○	Free text area with ability to add multiple entries.
○	Enable/Disable by Admin.
●	Provisional / Confirmed Toggle: The doctor will be able to mark the diagnosis as Provisional or Confirmed.
○	Here is the acceptance criteria for this detail:
○	Toggle switch. Enable/Disable by Admin.
●	Diagnostic Notes: The doctor will be able to add additional diagnostic observations.
○	Here is the acceptance criteria for this detail:
○	Free text area.
-	After a diagnosis is selected, the system will auto-suggest patient advice/instructions from the Admin-configured master advice list. The doctor can accept, modify, or delete these suggestions.
-	Follow-Up Scheduling:
●	The doctor will be able to set the next follow-up date using an integrated calendar.
●	Multi-session follow-up schedules are displayed as a numbered list with date and day label (e.g., 1/4 – Monday 20/02/2026, 2/4 – Friday 25/03/2026).
●	Admin-blocked dates (Sundays, holidays) are disabled in the F/U calendar. If a blocked date is selected, the system shows the next available date.
●	If a patient arrives after their F/U due date, a delay pop-up appears with Auto Upgrade or Keep Original Date options.
-	Google Review Link: The admin will have configured the clinic's Google Review link in Settings. In Tab 6, the doctor will see a tick box per patient. Checking the box and clicking Send will automatically dispatch the review link to the patient via SMS/WhatsApp.
9.4.7 Tab 7 – Final Report / Print Preview
-	Tab 7 displays a compiled print preview of the complete consultation record generated from all 7 tabs.
-	The doctor will be able to adjust font size using increase/decrease arrow buttons on the preview. All other formatting (fonts, bold, column visibility, section order, page size) is controlled by the Admin-managed prescription template.
-	Page size options available: A4, A3, and 4-side (quarter-page) print format.
-	Each section of the prescription supports per-patient, per-visit hide/show toggling via an Eye icon. Admin-managed global defaults apply; the doctor can override for individual patients.
-	The prescription print layout includes: Hospital Logo, Clinic Name, Doctor Name, Patient Name/MRD No./Age/Gender/Case No., Vitals, Chief Complaint, Diagnosis, Drug Table (Rx), Investigation Requests, Advice/Instructions, Procedure F/U session dates, Counselling Note, and Next Appointment Date.
-	A 'Next Patient' button will be available directly in Tab 7 so the doctor can proceed without navigating back to the dashboard.
-	One-click column hide/show option is available. If the doctor clicks Next Patient, the same settings continue for the next patient. If a new patient is selected manually, the settings reset to admin defaults.
9.5 Appointment & Follow-Up Management
-	The doctor will be able to view today's appointments and navigate to any date using the calendar view.
-	The doctor will be able to generate a prioritised follow-up call list by selecting patients who require a follow-up call (consultation-wise or procedure-wise), ordering them by priority, and forwarding the list to the Nursing Panel for call execution.
-	The doctor will be able to flag specific patients as 'No F/U Call Required' to exclude them from the call list.
-	Each morning, the system will auto-generate a F/U report for the Doctor and Nursing team showing today's follow-up patients and all pending F/U cases.
-	The doctor will be able to view the Smart Calendar which shows all appointment types (Consultation, Procedure, Laser, Follow-Up, New Case, Inquiry) colour-coded. Clicking any date reveals all scheduled appointments for that day.
-	If the Doctor is unavailable on a specific date, the admin or doctor can bulk cancel/reschedule all appointments for that date, send pre-typed notifications to all affected patients, and shift all appointments to the next available day.
9.6 Billing View
-	When any patient record is opened, a Billing Tab will auto-display on the side panel showing: Today's Bill, Monthly Bill, Yearly Bill, Total Bill — with Consultation and Procedure billing shown in separate clearly labelled sections.
-	Discount and FOC amounts are clearly shown per line item. Clicking any billing line drills down to the individual transaction details.
-	The doctor will be able to apply a discount percentage or mark a patient as FOC for the current session. Upon doing so, a pop-up notification is automatically sent to the Reception billing counter.
9.7 Pharmacy View
-	The doctor will be able to view the dispensing status of all prescribed drugs for each patient: Taken, Not Taken, or Drug Unavailable.
-	The doctor will be able to view current drug stock levels, low-stock alerts, and near-expiry drug information.
9.8 Reports & Analytics
-	The doctor will be able to view patient-specific reports for their own patients:
●	Total patients seen (A to Z), new registrations, follow-up patients, and procedure patients — by Today, Week, Month, Year, or Custom Date Range.
●	Consultation income and procedure income generated — with patient-wise breakdown.
●	Number of procedures, laser sessions, and follow-up compliance rates.
9.9 My Profile
-	The doctor will be able to update personal details, contact information, and profile picture.
-	The doctor will be able to change their account password with current password verification, subject to defined complexity rules.
 
10. Nursing Panel Features
The Nursing Panel is used by nursing staff to enter patient vitals before consultation, upload and enter lab reports, and manage follow-up call lists forwarded by the Doctor. Access is restricted to admin-authorised devices.
10.1 Login
-	The nursing staff will be able to log in using their registered email and password, restricted to admin-authorised devices only. Unsuccessful login handling follows the same rules as the Reception Panel.
10.2 Forgot Password
-	Password recovery via registered email. Reset link expires in 24 hours. New password must meet complexity rules.
10.3 Dashboard
-	The nursing dashboard will display today's appointment list showing patient names, check-in status, assigned doctor, and pending vitals entries.
-	The nursing dashboard will also display the Doctor-forwarded follow-up call list with assigned priority order.
10.4 Patient Vitals Entry
-	Before the doctor sees each patient, the nursing staff will be able to enter and save the following vitals against the patient's Case ID:
●	Height (cm): Numeric. Enable/Disable by Admin.
●	Weight (kg): Numeric. Enable/Disable by Admin.
●	BMI: Auto-calculated from Height and Weight. Read-only.
●	Temperature: Numeric (°F or °C as configured).
●	Pulse Rate (bpm): Numeric.
●	Blood Pressure (mmHg): Two separate fields for Systolic and Diastolic.
●	Oxygen Saturation SpO2 (%): Numeric.
-	The system will maintain the last 4 records of BP, BMI, and Weight per patient (with dates) in an Excel-style table format, visible in the Doctor's left-side patient summary panel.
10.5 Lab Report Management
-	The nursing staff will be able to upload scanned lab reports (PDF) for any patient, linked to the specific Case ID. Uploaded reports will appear in the Doctor's Investigation Tab.
-	The nursing staff will be able to manually enter individual parameter result values (numeric or text) against doctor-requested investigation parameters, including the sample collection time and their name as 'Sample Collected By'.
10.6 Follow-Up & Call Management
-	The nursing staff will receive Doctor-forwarded prioritised follow-up call lists and execute calls on behalf of the clinic.
-	For each call, the nursing staff will record the outcome:
●	Appointment Rescheduled: Enter the new F/U date. The system will auto-create the appointment and send a confirmation SMS/WhatsApp to the patient.
●	Call Not Answered: The system will auto-flag the patient as 'F/U Missed' and create a Special Note: 'Call not answered – F/U Missed'.
●	Patient Feedback Notes: The nursing staff will record any patient feedback, including drug taken/not taken status, advice taken/not taken, and patient comments.
●	Do Not Call Flag: The nursing staff can flag a patient as 'Do Not Call' if the patient requests no further follow-up calls.
-	The nursing staff will be able to view today's and the next day's appointment list. Booking access for specific future dates is controlled by Admin-defined permissions.
10.7 My Profile
-	The nursing staff will be able to update personal details and contact information. Password change is available with current password verification.
 
11. Medical / Pharmacy Panel Features
The Medical / Pharmacy Panel is a restricted interface for pharmacy or medical staff. It provides access only to drug dispensing, stock management, and drug-related alerts. Clinical data beyond the prescription is not accessible from this panel.
11.1 Login
-	The medical staff will be able to log in using their registered email and password, restricted to admin-authorised devices only.
11.2 Forgot Password
-	Password recovery via registered email. Reset link expires in 24 hours. New password must meet complexity rules.
11.3 Dashboard
-	The pharmacy dashboard will display a real-time summary of today's prescription queue: pending dispensing count, drugs marked as taken, drugs not taken, and active out-of-stock alerts.
-	Low-stock drugs (at or near the Admin/Doctor-configured minimum threshold) and near-expiry drugs will be persistently highlighted at the top of the dashboard.
11.4 Prescription & Drug Dispensing
-	The medical staff will be able to view the prescription/drug list for each patient showing: Patient Name, MRD No., OPD Case No., Gender, and the list of prescribed drugs. No other clinical data will be accessible.
-	For each prescribed drug, the medical staff will be able to mark the dispensing status:
●	Taken: The drug has been dispensed and given to the patient.
○	Here is the acceptance criteria for this detail:
○	On marking as Taken, the drug quantity is automatically deducted from the stock.
○	Dispensing confirmation is recorded with the medical staff name and timestamp.
●	Not Taken: The patient declined or did not collect the drug.
○	Here is the acceptance criteria for this detail:
○	On marking as Not Taken, a Special Note is automatically created in the patient's record: 'Drug Not Taken – [Drug Name]'.
○	This Special Note will be visible to the Doctor on the patient's next visit.
●	Drug Unavailable: The drug is out of stock and cannot be dispensed.
○	Here is the acceptance criteria for this detail:
○	On marking as Drug Unavailable, an instant notification is sent to both the Admin and the Doctor with the specific drug name and patient details.
○	The drug's status will be updated in the system-wide drug availability indicator.
-	Simple Drug (S) Dispensing: When an (S)-tagged sample drug is dispensed, it is deducted from the simple drug inventory separately from the regular stock.
11.5 Drug Stock Management
-	The medical staff will be able to view real-time stock levels for all drugs in the system.
-	Clicking on any drug will reveal its detailed stock information including: current available quantity and a list of all patients to whom it was dispensed (Patient ID, Name, Quantity dispensed, Date).
-	The medical staff will be able to add new stock to the system. Stock can be entered manually or uploaded via the daily Excel stock file from the medical shop. Stock quantities will auto-deduct as drugs are dispensed.
-	Drug Return Processing: When a patient returns unused drugs, the medical staff will be able to record the return. The patient's profile will be automatically updated and the returned quantity will be re-added to the inventory.
11.6 Alerts & Notifications
-	Low Stock Alerts: Real-time alerts will be displayed when any drug's stock falls at or near the configured minimum threshold. Alerts will persist on the dashboard until stock is replenished.
-	Near-Expiry Alerts: Notifications for drugs approaching their expiry date. The Admin and Doctor will also be notified.
-	Drug Not Taken Report: A daily, weekly, and monthly list of patients who did not take their prescribed drugs, viewable by drug name, patient name, and date.
11.7 My Profile
-	The medical staff will be able to update personal details and contact information. Password change is available with current password verification.
 
12. Patient Waiting Display Screen
The Patient Waiting Display Screen is a dedicated read-only output screen mounted in the clinic's patient waiting area (e.g., a TV or monitor). It requires no user login and is driven by real-time signals from the Doctor Panel and Reception Panel via WebSocket or Server-Sent Events.
12.1 Display Overview
-	The display screen will show the currently consulting patient and the next patient in queue.
-	The screen content will be updated in real-time without any manual intervention.
-	The patient names will be displayed in large, clearly readable text. The name will be shown in the patient's preferred regional language (e.g., Gujarati) as recorded in their profile.
12.2 Current & Next Patient Display
-	Currently Consulting Patient: The name and Case No. of the patient currently in consultation with the Doctor will be prominently displayed in the centre of the screen.
-	Next Patient: Below the current patient, the name, token number, and Case No. of the next patient in the queue will be displayed. This updates in real-time when the Doctor clicks 'Next Patient' in the Doctor Panel.
-	Blinking Indicator: When a patient is checked in by Reception and it is their turn to be called, their name will blink on the display screen to draw their attention. The blinking stops when the Doctor selects that patient's profile in the consultation view.
12.3 Real-Time Updates
-	Doctor-Triggered Update: When the Doctor clicks the 'Next Patient' button in the Doctor Panel, the display screen immediately updates to show the new current patient and the following next patient.
-	Reception-Triggered Update: When Reception completes a check-in, the patient is added to the active queue and their name becomes eligible for display on the waiting screen.
-	Auto-Refresh: The display screen will auto-refresh continuously without manual intervention. If the network connection is interrupted, the screen will display the last known state and resume updates automatically once the connection is restored.
 


--- End of Document ---

