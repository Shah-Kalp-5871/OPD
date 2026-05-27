OPD / Clinic Management System
Admin Panel - Full Feature Documentation
Technology Stack
● Frontend: React. JS
● Backend: Node. JS with Express. JS
● Database: PostgreSQL (as per deployment)
• Payment gateway: Razorpay.
• JWT-based role authentication
Notifications: SMS / Email (OTP & reminders)




• Roles and permissions
Each user role has defined access to modules. Admin has full control over all sections.


• The reception of:
Patient registration, appointment booking, payment collection, billing, follow-up scheduling
● B Doctor: Full OPD workflow - complaints, investigations, drugs, procedures, diagnosis, instructions, reports
● Nursing: Patient vitals entry, assisting doctor, uploading lab reports & images, updating vitals
● D Admin: Master data management - drugs, lab, procedure, advice lists. Full system access and reporting.
● E Medical: showing only prescription, conformation drugh tacken, no drugh available INFORM BY ADMINE / DOCTOR /
NOTE: Nursing and reception can VIEW patient history but can only EDIT their respective permitted fields (see section 4)

The management of the patient
Access: Reception, Doctor, Nursing, Admin (View / Listing / Add / Edit)
.1 features.
• Add the patient.
• Edit Patient with OTP
Delete / Deactivate Patient (Admin / Doctor only)


OPD Appointment
Access: Reception (Add / Edit / Pay) | Doctor, Nursing (View) | Admin (Full)

.2 features.
• Add a new appointment.
• Edit Appointment
● Cancel Appointment (with reason)

Data safety All patient numbers should not appear in the list at once, so that no one can take a screenshot and misuse it. "
• The mobile number of the particular patient should be visible only when the patient's record is opened.
• No staff should be allowed to log in from a mobile or other computer. The system should be open and accessible only on the authorized system / computer provided by the hospital. Unauthorized

• Attempting to login from devices should be auto-blocked. Allow Verified Device Only Access from Admin / IT Security System.





PATTIENT REGISTATION Search by Name, Unique ID, Contact Number

• Profile upgrade can only be done by Doctor or Admin.
• No staff can make changes to the patient's profile, so that data safety is maintained.
• When the patient makes a physical visit to the hospital for the first time, the doctor will check the profile and will be responsible.
• If the patient's profile needs to be upgraded, this information will have to be given to the doctor at the time of visiting, and the doctor will only upgrade the profile.





• MRD NO (Medical Record Identification)
P-PARMENET ID P 03-260001
03 SUGESTIVE MOUNT
260001.1 ST 2 DIGIT SUGESTIVE YR AND LAST 4 DIGHT SUGESTIVE FOR NUMBER OF PT THIS MONTH



• Registan Patient Basic Detyl Online Bailout
● Patient Name * - Full name-text field (SURNAME, MIDDLE NAME, LAST NAME)
● Contact number * - Primary mobile number (multiple patient create)



Unique ID * - Auto-generated system ID (e.g. P 03-260001)
P03 - PARMENET ID WITH MOUNT, 2ND 6TH WORD SUGGESTIVE 26-YR, LAST FOR MOTHER OF TOTOL PT)
Gender * - Male / Female / Other - dropdown
● Address * - Full address-text

● Age (Display) * days / months / year DAY / Auto-calculated from DOB; show as years (IF ADD BIRTH DATE)

Language * Preferred language for communication - GUJRATI / HINDI / ENGLISH (ENTER) dropdown


(ED: ENDEBAL-DISEBAL OPTION)
ONE BUTTON GIVE PRIENT STICKER PARMENET NUMBER (FILE FRUINT)
PARMENET NUMBER STICKER SHOW NAME / M / F 26YR WITH BARCORD FOR FILE NAME

PRIENT PAYMENT ID STICKER
SUBMIT



After Submission Portfolio Given Option Add Appointment

If the patient is in the hospital for the first time and the staff clicks on search, the basic details of the patient will be automatically displayed.
• The following options should be displayed:
o Book Appointment
o Add Report
o All other available options
• All these options will be activated after patient selection.


Book Appointment
Click on the Book Appointment

TODAY DATE AUTO SETION, BUT CLICK AND CHANGES PICK UP IN CALENDAR AKING WITH TIME PICK IN TIME
After GANRET CASE AUTO ACCODING TIME

CASE ID GENRATED Ex for C 001-001-130326
C-case, 1st 3 digit today opd token no,
2nd 3 digit PT visit (NUMBER OF VISIT THIS PT)
3rd 6 digit suggestive for date
• If a patient comes to the call for an appointment for the first time, the staff should register the patient. The patient's appointment should then be created.
• When the patient makes a physical visit to the hospital (first time) → his profile should be updated BY DOCTOR, with all the details.
• Confirmation number as soon as the appointment is created. message WITH DATE auto send AFTER SUBIMTION APPOINTMENT should be

CHEECK PATIENT
When the patient comes to the hospital, the mobile number (Mo. Or search by name.
• After the selection of the patient:
Patient check-in entry
The check-in time should be automatically generated as soon as the check-in is done.


• Date Auto, Check Time Auto

• All other details must be filled up at the time of appointment visit.
If an elderly patient calls for an appointment → Create an appointment and when the patient alerts the hospideo call
_ _ _ _ _ _ _ _ _
Reports & Records:
• Record all video calls.
• Reporting system for the doctor
_ _ _ _ _ _ _ _ _
Platform Requirement:
• System runs on PC (Doctor & Nursing)
• Mobile support if required (Android / iPhone)
_ _ _ _ _ _ _ _ _

Cloud requirement:
• Customized cloud solution according to our needs.
• We will decide which company's cloud to take.
• Must have a backup system.
_ _ _ _ _ _ _ _ _
. Additional requirements:
• The system should be simple and user-friendly
• Must have the flexibility to add features in the future
_ _ _ _ _ _ _ _ _
Terms of Service and Payment Agreement
The total cost of the project is Rs. 50,000 has been fixed.
• 1 payment: 15% (Rs. 7,500) - to be paid when the project is confirmed.
• 2 payments: 25% (Rs. 12,500) - 50% of the software has to be given when the work is completed
• 3 payments: 25% (Rs. 12,500) - to be paid when the full development of the software is completed.
• 4 payments: 35% (Rs. 17,500) when the project is fully live.
• If the software is not 100% complete or is delayed beyond the specified time
Or if the correct service is not found, 100% of the payment must be returned.
• It will be mandatory to handover the entire source code, database and structure of the software to us
The consent of both the parties will be mandatory to start the project and work will start only after receiving the first payment.
• It will be mandatory to complete the project within the stipulated time (3 MOUNTH), if there is a delay, it will have to be informed in advance.
• The software should be fully functional and bug-free.
• All source code, databases, and project structures must be fully transferred to the client.
• No data should be deleted or damaged without the client's approval.
• Free service will be provided for 3 months after the project is live.
• After 3 months, if any service or support is required, then for 1 year Rs. A fee of Rs 4,000 will be charged.
• If the software is not completed according to the stipulated conditions or is delayed beyond the deadline, it will be mandatory to return 100% of the payment.
• After completion of 3 months of free service, if any service or support is required, then for 1 year Rs. A fee of Rs 4,000 will be charged. No additional service charge will be charged other than this charge during this 1 year period.
• WhatsApp API and cloud-related payments worth Rs. 50,000 is not included in the total project cost. The payment for these services will have to be paid directly to the concerned party separately.
• Automatic compression system will be applied at the time of all image uploads, (AUTO-ON / OFF so that the file size is reduced but there is no significant effect on the clarity and quality of the image.
• The specific doctor, when the hospital is closed, the patient should know exactly what date and time you will return. This will make it easier for the patient to wait.
• This is the perfect and modest message draft for your software:
• _ _ _ _ _ _ _ _ _ _ _ _ _ _
Greetings! ❤ ️
• "We are at your service for expert treatment and natural refinement. "
• The hospital is currently closed.
• At present, the hospital is closed due to holidays, now the hospital will reopen at the following times:
• Date of opening: [Date, e.g. 26-04-2026] WAR: [WAR, e.g. Monday: 10:00 a.m.
• You can book an appointment for that day right away. Press 1 for it.
• Apologies for the inconvenience.
• Dr. Chhaya Walaki (SKIN CITY) MBBS, DDV (Gold Medalist)
• _ _ _ _ _ _ _ _ _ _ _ _ _ _
• Notification to the developer (Smart Feature)
• Ask your developer to give a "Holiday Settings" form in the software in which you can fill in these 3 details so that the message is automatically created:
• 1. How long is the holiday? (Date)
• 2. What time is it
• 3. What time will it open?



WhatsApp Business API (Meta Cloud API)
Confirmation: When an appointment is booked at the reception, a confirmation message should be sent to the patient immediately.
Reminder: The patient should be given an automatic reminder 2 hours before the appointment. (E / D) for particular patient in personal profile and without selection patient for all
Cancellations (Holiday Logic) If I take a day off, the message of cancellation should be sent to the patients who have an appointment for that day only after selecting the date in the software.
Birthday Wishes: The software checks the patient data every morning and automatically wishes the person whose birthday it is from "Skin City."
Festival Bulk SMS: On festivals like Diwali or Holi, there should be an option to wish all the patients at once.
Auto Follow-up: 7 days after the patient takes the medicine "How is your health? This should be an automatic message.
Today's Status: There should be a 'Yes / No' button on the reception dashboard. If I say 'No' and a patient inquires on WhatsApp, he should get an automatic reply that "The doctor is not present today. "
As soon as the bill or prescription is generated in the digital prescription software, its PDF should be seen on the patient's WhatsApp.
Template Tracking: Whether the message has been received by the patient or not (Sent / Delivered / Read), its status should appear in front of the patient's name in the software.

WhatsApp MATE Official Meta Cloud API should be used only.

1. Welcome Message for Patient
When a new patient sends a message, it should go like this:
Hello and welcome to Skin City Clinic. Type the number (1 to 9) of the following:

Appointment booking (for new and old patients)
Location of the clinic (Google Maps link)
3.Clinic time (morning and evening)
Is the hospital open or closed today? (Live Status)
Introduction to the doctor and available treatment (degrees, gold medals and specialties)
To send a report or photos (direct upload option).
How to talk to the receptionist (direct phone number)


Hello [patient's name],
I hope that your health will be good. Please contact the hospital in time for any assistance regarding treatment.
Have a nice day! हो
Dr. Skin City
MBBS, DDV (Gold Medalist)


Hello [patient's name],
I hope that your health will be good. Request you to come to the hospital in time for your further check-up tomorrow.
Have a nice day! हो
Dr. SKIN CITY MBBS, DDV (Gold Medalist)


Appointment booking (for new and old patients)
Step 1: Verify your mobile number
As the patient will message, the software will check from his number:
• If there is an old patient, then directly ask - "Namaste [name], what date will you come for the follow-up? "MORING / EVING SELECTION KARIYA PACHI CALENDAR OPTION BOOK AND CANFORMATION MSG
• If there is a new patient, the following details will be asked.
Step 1: The welcome message (auto-detection) software will directly identify the patient and send the following message:
"Namaste [patient's name], welcome to 'Skin City' hospital. You are booking an appointment for your next follow-up. "
Step 2: The morning / evening selection will immediately come up with two buttons:
• In the morning
• In the evening (evening)
Step 3: The calendar option will select 'Morning' or 'Evening' like the patient, so the calendar window will open immediately.
• The patient will click on the date of his convenience from it.
•
Hello [patient name], welcome to the best treatment for skin and hair.
"Congratulations! Your appointment has been booked for Dr Chaya Walaki (SKIN CITY). "
Date: [date] ⁇ Time: [morning / evening]
Time: from 10:00 to 01:00
Location: Location: [address of clinic] Location: [Google Maps link]
Dr. Skin City
MBBS, DDV (Gold Medalist)


_ _ _ _ _ _ _ _ _
Step 2: Sign up for a new membership
Step-by-step procedure for a new patient:
1. The trigger will select "Booking an appointment" from the Patient menu.
2. Verification of mobile number (OTP)
The software will ask the patient: "An OTP has been sent to verify your mobile number. "
• 4 or 6 digit OTP will be received on the patient's phone. (This will prevent mis-booking)
• The patient will enter the OTP so that the software will check that this number is new.
3. Since the patient profile (form for new patient) is a new number, the software will open a window in which the patient will fill in these 3 details:
4. Immediately after filling the Session & Calendar form, the patient will see two options:
• In the morning
• Evening after which the calendar will open and the patient will select the date.
5. Final Confirmation Message: After selecting the date and time, the patient will receive the following final message:
_ _ _ _ _ _ _ _ _


Hello [patient's name], ❤ ️
Your appointment
"Congratulations! [Patient Name], your appointment has been booked for Dr. Chaya Walaki (SKIN CITY).

Hello [patient name], welcome to the best treatment for skin and hair.
"Congratulations! Your appointment has been booked for Dr Chaya Walaki (SKIN CITY). "
Date: [date] ⁇ Time: [morning / evening]
Time: from 10:00 to 01:00
Location: Location: [address of clinic] Location: [Google Maps link]
Dr. Skin City
MBBS, DDV (Gold Medalist)



Location of the clinic (Google Maps link)
Hello! ❤ ️
"Welcome to the best skin care. Easily reach with the help of maps. "
Google Maps link: [link]
Address: [your address]





3.Clinic time (morning and evening)
Hello, welcome to the best treatment for skin and hair.
Time: from 10:00 to 01:00
Location: Location: [address of clinic] Location: [Google Maps link]
Dr. Skin City
MBBS, DDV (Gold Medalist)



Is the hospital open or closed today? (Live Status)
Hello! ❤ ️
Accurate diagnosis, the best result - welcome to Skin City. "
"" "The hospital is running today."
Time: 10:00 am to 01:00 pm to 08:00 pm
Location: Location: [address of clinic] Location: [Google Maps link]
Dr. Chaya Walaki (SKIN CITY)
MBBS, DDV (Gold Medalist)

• When the hospital is closed.
Greetings! "Taking care of your health is our goal. "
Sorry, I'm currently in the hospital. We will be at your service again from [date] to [date].
Opening hours: 10am to 1pm and 5pm to 8pm
Press 1 to confirm the appointment.
Best wishes!
Dr. Skin City
MBBS, DDV (Gold Medalist)

To send a report or photos (direct upload option).
7. to talk to the receptionist

Hello! ❤ ️
"Your convenience is our priority. "
If you would like more information about the appointment or to speak directly, you can call by clicking on the number below:
Reception: [your mobile number] Landline: [number if any]
Time to call: 10:00 am to 01:00 pm to 08:00 pm
Note: If the phone gets busy or doesn't receive, please request to try again a few minutes later.
Dr. Skin City

