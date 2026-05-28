OPD / Clinic Management System
Admin Panel — Full Feature Documentation
Technology Stack
●	Frontend: React.js
●	Backend: Node.js with Express.js
●	Database: PostgreSQL(as per deployment)
●	Payment Gateway: Razorpay
●	Authentication: JWT-based role authentication
●	Notifications: SMS / Email (OTP & reminders)




•	Roles & Permissions
Each user role has defined access to modules. Admin has full control over all sections.


●	A  Reception: 
Patient registration, appointment booking, payment collection, billing, follow-up scheduling
●	B  Doctor: Full OPD workflow - complaints, investigation, drugs, procedure, diagnosis, instructions, reports
●	C  Nursing: Patient vitals entry, assisting doctor, uploading lab reports & images, updating vitals
●	D  Admin: Master data management — drugs, lab, procedure, advice lists. Full system access & reporting
●	E  Medical: showing only prescription,conformation drugh tacken,no drugh avelibal INFORM BY ADMINE/DOCTOR /
NOTE: Nursing and Reception can VIEW patient history but can only EDIT their respective permitted fields (see section 4).

Patient Management
Access: Reception, Doctor, Nursing, Admin (View/Listing/Add/Edit)
.1	Features
●	Add Patient
●	Edit Patient with OTP
●	Delete / Deactivate Patient (Admin / Doctor only)


OPD Appointment
Access: Reception (Add/Edit/Pay) | Doctor, Nursing (View) | Admin (Full)

.2	Features
●	Add New Appointment 
●	Edit Appointment
●	Cancel Appointment (with reason

data sefty બધા દર્દીઓના નંબર એક સાથે લિસ્ટમાં દેખાવા ન જોઈએ, જેથી કોઈ સ્ક્રીનશોટ લઈને તેનો દુરુપયોગ ન કરી શકે.” 
•	ખાસ દર્દીનો રેકોર્ડ ખોલીએ ત્યારે જ તેનો મોબાઇલ નંબર દેખાવા જોઈએ.
•	કોઈ પણ Staff ને Mobile અથવા અન્ય Computer પરથી Login કરવાની permission ન હોવી જોઈએ. ,System માત્ર Hospital દ્વારા પ્રોવાઇડ કરેલી Authorized System / Computer પર જ Open અને Access થવું જોઈએ.  Unauthorized

•	Devices થી Login કરવાનો પ્રયાસ Auto Block થવો જોઈએ.  Admin / IT Security System થી Verify કરેલી Device Only Access Allow કરે.





PATIENT RAGIESTATION Search by Name, Unique ID, Contact Numbe
 
•	Profile upgrade માત્ર Doctor અથવા Admin કરી શકે. 
•	કોઈ પણ staff patient ની profile માં changes ન કરી શકે, જેથી data safety maintain થાય. 
•	જયારે patient first time hospital physical visit કરે, ત્યારે doctor profile check કરશે અને તેની responsibility રહેશે. 
•	જો patient ની profile upgrade કરવાની જરૂર પડે, તો visiting time doctor ને આ માહિતી આપવી પડશે, અને doctor જ profile upgrade કરશે.





•	MRD  NO  (MEDICAL RECORD DIPARMENT – MRD NO KNOW AS PARMENT ID)
P- PARMENET ID P03-260001 
03 SUGESTIVE  MOUNTH
260001  1ST 2 DIGIT SUGESTIVE YR AND LAST 4 DIGHT SUGESTIVE FOR NUMBER OF PT  THIS MONTH  
 


•	RAGIESTION PATIENT BASIC DETIL ONLY BELOW 
●	Patient Name* — Full name — text field  (SURNAME ,MIDDLE NAME ,LAST NAME )
●	Contact Number* — Primary mobile number ( Multiple patient create )



●	Unique ID* — Auto-generated system ID (e.g. P03-260001)
     P03-PARMENET ID WITH MOUNTH,2ND 6TH WORD SUGGESTIVE  26 – YR,LAST FOR MOTH OF TOTOL PT)
●	Gender* — Male / Female / Other — dropdown
●	Address* — Full address — text

●	Age (Display)* days /months /year DAY / Auto-calculated from DOB; shown as years (IF ADD BIRTH DATE ) 

Language* Preferred language for communication — GUJRATI/HINDI/ENGLISH (ENTER) dropdown

	
        (ED :- ENDEBAL-DISEBAL    OPTION )
ONE BUTTONE GIVE PRIENT STICKER PARMENET NUMBER (FILE FRUINT)
PARMENET NUMBER STICKER SHOW NAME /M/F 26YR WITH BARCORD  FOR FILE NAME 

PRIENT PAMENT ID STICKER   
	SUBMIT 



AFTER SUBMITION PRTOFILE GIVEN OPTION ADD APPOIENTMENT 

જો patient first time hospital માં હોય અને staff search કરીને click કરે, તો patient ની basic details automatically display થાશે.
•	તેની નીચે options દેખાવા જોઈએ: 
o	Book Appointment 
o	Add Report 
o	All other available options  ETC 
•	આ તમામ options patient selection પછી active થશે.


Book Appointment 
BOOK APOENTMENT CLICK AFTER OPEN 

TODAY DATE AUTO SETION ,BUT CLICK AND CHANGES PICK UP IN CALENDAR  AKING WITH TIME  PIC IN TIME 
AFTER GANRET CASE AUTO ACCODING TIME  

CASE ID GENRATED  Ex for C001-001-130326  
C –case ,1st 3 digit today opd token no ,
2nd 3 digit pt visit (NUMBER OF VISIT THIS PT)
3rd 6 digit  suggestive for date 
•	જો કોઈ patient call પર પહેલીવાર appointment માટે આવે છે, તો staff એ patient નો registration કરવો જોઈએ. ત્યારબાદ patient ની appointment create કરવી જોઈએ.
•	જયારે patient hospital physical visit કરે (પ્રથમવાર આવે) → તેની profile update કરવી જોઈએ BY DOCTOR, તમામ details સાથે. 
•	Appointment create થતા જ confirmation no. message WITH DATE  auto send  AFTER SUBIMTION APPOIENTMENT થવું જોઈએ
△品
CHEECK PATIENT 
જ્યારે patient hospital માં આવે, ત્યારે Mobile Number (Mo.) અથવા Name દ્વારા search કરવો.
•	Patient select કર્યા પછી: 
o	Patient Check-in entry કરવી 
o	Check-in થતાં જ check-in time automatically generate થવું જોઈએ.


•	DATE AUTO ,CHEEK TIME AUTO 

•	બાકીની તમામ details appointment visit વખતે fill up કરવી જોઈએ. 
જો કોઈ old patient appointment માટે call કરે → appointment create કરવી અને જયારે patient hospital physical visit કરે → auto check-in time record થવું જોઈએ.
•	Case box patient માટે color coding દ્વારા visually indicate કરવું જોઈએ.



C001-001-130326  
 C001-001-130326  
C001-001-130326  
C001-001-130326  

Waiting
In-Progress
Completed
 Cancelled

ACTION BOTTONE IN  EDIT /CANCLE 

•	Appointment SMS / WhatsApp communication system: 
 જેના માટે appointment પહેલેથી છે, તેને 1 day પહેલાં auto message send કરવું જોઈએ. 
•	જો patient call કરીને appointment book કરે, તો call થી appointment પછી pre-type message / WITH IF SELETION  TIME WhatsApp automatically CONFORMATIO send થવું જોઈએ
•	Purpose of Visit — Dropdown + free text (e.g. New Consultation, Follow-up, repoting )  ( IF POSSIBAL 3 TAB SHOW  OPEN ONLY SLECTION seletion direct )
●	F/U  AUTO  UPDATE  RESION FOR EX  LESSOR  OTHER PROCER IF PT COMING  ON DUE DATE auto update DELY F/U  DELY INFORMATION   Follow-up information detail It will be showing in the OPD

●	Patient Category - FOC/Payment ( Height Light only for FOC ) SELECTION auto   ganrated  IF  PRE FILD (OLD  PT)  FOR  EX  FOR     FOC   PT Payment type  if foc category auto ganrateted all further no show payment option only in constation in only  
•	
•	Date of Birth (OPTONAL) (E/D)— Date picker — system auto-calculates Age (updates ,UPGREAD day by day)
•	If give send auto sms Birthday Wish SMS
•	Pre type wish msg manage by admine 
•	Blood Group (E/D)— A+, A-, B+, B-, O+, O-, AB+, AB- — box 
•	Email Address (E/D) — Optional — for digital prescriptions & reminders (E/D BY ADMINE )
•	Created Date / Time — Auto-stamped on registration
•	Created By — Auto-stamped — staff name
•	એક વખત profile upgrade થઈ જાય પછી ફરીથી ઉપરના options દેખાવા ન જોઈએ, આ options માત્ર પ્રથમ વખત જ દેખાવા જોઈએ.
•	
IN GRAY  1TIME ONLY ASKING  NEXT VISITI ONLY SHOW DO NOT SHOW F/U    

•	Past History (Summary) — Pre-fill from patient profile  if old pt or manual entry  new pt /menully entery  avelebal option given /IF CHANGES ANY UPDATE 
•	F/U FOR /CONSUTATION FOR ALL ENTER BY RESPTION/NURSING STFF  SHOW DOCTOR  BUT EDIT OPTION BY DOCTO ECHING ON ON FACE 
•	HEIGHT (CM)
•	WEIGHT (KG)
•	BMI AUTO CALCULATION 
•	TEMPERATURE (°F)
•	PULSE RATE (BPM)
•	BLOOD PRESSURE (MMHG)
•	SPO2 (%)
•	

•	PRENT FOR NEW RAGISTED  PT STICKER FOR FILE  NEW PATIEN AFTER OPEN BOOK APOIENTMENT 
•	Consultation Fee — Editable amount  pre fix amount by ganareted  (up- down by admine)
•	Discount (%) — Discount on consultation fee ( admin  and doctor ) not acces by nursing and reseption 
•	Net Fee — Auto-calculated after discount
•	Payment Status — Paid / Pending / Partial
•	Payment Mode * — Cash / Card / UPI / Online (Razorpay)
•	Transaction / Receipt ID — Auto-generated on payment
•	Payment Time — Auto-stamped when payment recorded







  Followup reminder SMS (1 day prior)manage by admit  

•	પીળી લાઇન ફરજિયાત છે. આગળના ટેબ પર જવા માટે ‘Tab’ કી વાપરો. વૈકલ્પિક ફીલ્ડ બતાવવામાં આવશે, પરંતુ તેને સ્કિપ કરીને સીધા સબમિટ સુધી જઈ શકાય છે. તમામ સોફ્ટવેરમાં ‘Tab’ કીથી માત્ર જરૂરી ફીલ્ડમાં જ જમ્પ થાય છે.”
	
        (ED :- ENDEBAL-DISEBAL    OPTION )
ONE BUTTONE GIVE PRIENT STICKER PARMENET NUMBER (FILE FRUINT)
PARMENET NUMBER STICKER SHOW NAME /M/F 26YR WITH BARCORD  FOR FILE NAME 
●	Past History (Summary)* — Pre-fill from patient profile  if old pt or manual entry  new pt 
●	Height (cm)* — Numeric(E/D)
●	Weight (kg) *— Numeric (E/D)
●	BMI — Auto-calculated from Height & Weight (E/D)
●	Temperature (°F / °C) — Numeric — taken by nursing
●	Pulse Rate (bpm) — Numeric — taken by nursing
●	Blood Pressure (mmHg) — Systolic / Diastolic — e.g. 120/80
●	Oxygen Saturation SpO2 (%) — Numeric
●	Consultation Fee — Editable amount  pre fix amount by ganareted  (up- down by admine)
●	Discount (%) — Discount on consultation fee ( admin  and doctor ) not acces by nursing and reseption 
●	Net Fee — Auto-calculated after discount
●	Payment Status — Paid / Pending / Partial Payment Status (Paid / Pending / Partial (COLOR BOX )
●	Payment Mode * — Cash / Card / UPI / Online (Razorpay)
●	Transaction / Receipt ID — Auto-generated on payment
Payment Time — Auto-stamped when payment recorded
Notes — Reception internal note

  Followup reminder SMS (1 day prior)manage by admit  
•	પીળી લાઇન ફરજિયાત છે. આગળના ટેબ પર જવા માટે ‘Tab’ કી વાપરો. વૈકલ્પિક ફીલ્ડ બતાવવામાં આવશે, પરંતુ તેને સ્કિપ કરીને સીધા સબમિટ સુધી જઈ શકાય છે. તમામ સોફ્ટવેરમાં ‘Tab’ કીથી માત્ર જરૂરી ફીલ્ડમાં જ જમ્પ થાય છે.”

SUBMITION  Submit કરીએ પછી form close થવું જોઈએ, અને જો submit કર્યા વગર પણ બહાર નીકળીએ તો માહિતી auto save થવી જોઈએ.








•	જો કોઈ patient call પર પહેલીવાર appointment માટે આવે છે, તો staff એ patient નો registration કરવો જોઈએ. ત્યારબાદ patient ની appointment create કરવી જોઈએ.
•	જયારે patient hospital physical visit કરે (પ્રથમવાર આવે) → તેની profile update કરવી જોઈએ BY DOCTOR, તમામ details સાથે. 
•	Appointment create થતા જ confirmation no. message auto send થવું જોઈએ. 
•	બાકીની તમામ details appointment visit વખતે fill up કરવી જોઈએ. 
જો કોઈ old patient appointment માટે call કરે → appointment create કરવી અને જયારે patient hospital physical visit કરે → auto check-in time record થવું જોઈએ.
•	Case box patient માટે color coding દ્વારા visually indicate કરવું જોઈએ.

•	Appointment SMS / WhatsApp communication system: 
o	જેના માટે appointment પહેલેથી છે, તેને 1 day પહેલાં auto message send કરવું જોઈએ. 
o	જો patient call કરીને appointment book કરે, તો call થી appointment પછી pre-type message / WITH IF SELETION  TIME WhatsApp automatically CONFORMATIO send થવું જોઈએ. 














	   BY DEFOLT CURRENT LIEST                                             Cheek pt liest

Case no  |APPOIENTMENT TIME |CHEEK IN TIME | Patient Name| visit for  |Age|Gender|address |BILIG |SATUES |ACTION BUTTONE 


•	ફિલ્ટર માટે ઉંમર રેન્જ, સમય અને દર્દીનું નામ (અક્ષરક્રમ મુજબ) ના નાના વિકલ્પો નીચે પેનલમાં આપવામાં આવ્યા છે.”


 
લિસ્ટ ખોલતી વખતે છેલ્લો દર્દી છેલ્લી પેજ પર જ ખુલવો જોઈએ. ઉદાહરણ: પેજ 1,2,3,4 – જો છેલ્લો દર્દી પેજ 3 પર હતો, તો લિસ્ટ ખોલતી વખતે સીધા પેજ 3 ખુલવું જોઈએ



SATUES 

C001-001-130326  
 C001-001-130326  
C001-001-130326  
C001-001-130326  

Waiting
In-Progress
Completed
 Cancelle

1.	ACCTION BUTTON – 1)MODIFIED APOIENTMENT ,2)NEXT PT,3) CANCLE AFTER DAY AUTO ADD IN SPECIAL NOT ,IF F/U CANCLE

PAYMENT BOX Payment BOX  satues  below box highlight 

PENDING
PAID
FOC
DISCOUNT

OLD/NEW  CASE  SATUES BY HIGH LIGHT ON NAME BOX     

Color coding for ex
NEW PT HIGHLIGHT 
     FOR .EX - AMESHBHAI BABUBHAI  PATEL

   


AMESHBHAI BABUBHAI  PATEL

OLD HIGHTLIGHT 

RESPTION FILED 

SARCHING PATION  OPATION 						
SELECTION PATION  AFTR GIVEN

NEW PT RAGISTRTION
BOOK APOIENTMENT 
BILLING
CONSENT FROM
MR ENTRAY
UP
•	“લેબ રિપોર્ટ (PDF) સ્કેન અને અપલોડ – રિસેપ્શન ,DOCTOR,SAFF  પર. વેલ્યુ મુજબ (CBC - HB, TLC) ઓટો-ડિટેક્ટ અથવા મેન્યુઅલી એન્ટ્રી કરવી.” EX IN CBC IN HB,TLC…



RESPTION                                                                   NEW PATION RAGISTRATION                CALENDAR (BOOK APPIENTMENT) 

SARCHING PATION  OPATION 						
SELECTION PATION  AFTR GIVEN
Case no  |APPOIENTMENT TIME |CHEEK IN TIME | Patient Name| visit for  |Age|Gender|address |BILIG |SATUES |ACTION BUTTONE 


                                                     

SATUES DONE:- WITING/CANCLE (BOX COLOUR)
ACCTION BUTTON:- ADD,EDIT,CANCLEL.

•	જો “Patient 3” પર સીધું ક્લિક કરવામાં આવે અથવા કોઈપણ અન્ય ઓપ્શન પસંદ કરવામાં આવે તો:
•	તરત જ ચાલતા (Running) પેશન્ટનું નામ બતાવવું 
•	સાથે જ આગળના (Next) પેશન્ટનું નામ અને નંબર ડિસ્પ્લે પર બતાવવું ડિસ્પ્લે માહિતી સ્ક્રીન પર હંમેશા બતાવવું:  પેશન્ટનું નામ (GUJRATI) કેસ નંબર (Case No.) NEXT BY ACTION BUTTONE 
•	PC ની ડાબી સાઇડ પર હંમેશા પોપ-અપ નોટિફિકેશન દેખાવું જોઈએ આ નોટિફિકેશન દ્વારા:  ડોક્ટર અને નર્સિંગ સ્ટાફ વચ્ચે મેસેજિંગ થઈ શકે  ઝડપી કોમ્યુનિકેશન શક્ય બને
•	Calendar view સાથે date અને time select કરીને appointment આપવાની સુવિધા હોવી જોઈએ. Patient select કર્યા પછી edit option દ્વારા appointment માં ફેરફાર (edit) કરવાની સુવિધા ઉપલબ્ધ હોવી જોઈએ.

•	Patient profile upgrading માટે report સાથે update કરવાની સુવિધા હોવી જોઈએ. Running patients માંથી patient select કરી શકાય અને check-in option દ્વારા patient entry કરી profile update કરી શકાય તેવી વ્યવસ્થા હોવી જોઈએ.
•	Payment માત્ર particular patient માટે લેવાની સુવિધા હોવી જોઈએ, આખા દિવસની total collection તરીકે નહીં.
o	All opation acces disieded  by admine who can use and not used 

•	All opation acces disieded  by admine who can use and not used 
•	Search /  Mobile number*/ Patient Name — Search by Name or Unique ID (MRD)— auto-fill patient details
Ex. Rajeshbahi Jitubhai Patel ( P03-260001 )

•	OPD Specific ID* — Auto-generated per day per patient (e.g. OPD  C001-001-130326   — resets daily
•	Appointment Date* — auto ganreat  today  date/in click edit opation IF SELETION DATE 
•	(Date picker OPTION  — booked slots hidden/disabled)
•	Appointment Time — Auto ganarated  editebal with menully  (enable/disable)


•	દરેક 2 કેસ વચ્ચે ડિફોલ્ટ 10 મિનિટનું અંતર આપમેળે જનરેટ થવું જોઈએ  આ સમય એડિટેબલ (Editable) હોવો જોઈએ (જરૂર મુજબ બદલી શકાય) એડમિન દ્વારા કન્ફિગર કરી શકાય દરેક નવા પેશન્ટ માટેનો એપોઇન્ટમેન્ટ ટાઈમ: અગાઉના (Last) પેશન્ટના સમય મુજબ આપમેળે અપડેટ થવો જોઈએ પેશન્ટ “IN” થયા પછી

1.	પેશન્ટ એપોઇન્ટમેન્ટ અને ફોલો-અપ મેનેજમેન્ટ
o	પેશન્ટ એપોઇન્ટમેન્ટ ચેકિંગ 
o	જ્યારે પેશન્ટની એપોઇન્ટમેન્ટ હોય અને તે આવે: 
	ત્યારે રિસેપ્શન દ્વારા ચેક-ઇન (Check-in) કરવું 
2.	પેશન્ટ હાજર ન હોય ત્યારે 
o	જો પેશન્ટ એપોઇન્ટમેન્ટ માટે ન આવે: 
	રિસેપ્શન તરફથી કોલ કરીને અપડેટ લેવું 
3.	Next Appointment અપડેટ 
o	જો પેશન્ટ નવી તારીખ આપે: 
	તો તે Next Appointment માં ઉમેરાઈ જવું જોઈએ 
	જેથી સિસ્ટમમાં આગળનું શેડ્યૂલ ક્લિયર રહે 
4.	કોલનો જવાબ ન મળે ત્યારે 
o	જો પેશન્ટ કોલનો જવાબ ન આપે: 
	તો તેને Follow-up Missed તરીકે માર્ક કરવું 
Special Note સિસ્ટમ 
o	આવા કેસમાં એક Special Note Box માં નોંધ કરવી: 
	જેમ કે: “Call not answered  F/U Missed” જેથી જ્યારે પણ પેશન્ટ ફરીથી કન્સલ્ટેશન માટે આવે:  ત્યારે આ માહિતી તરત જ દેખાય
	Purpose of Visit — Dropdown + free text (e.g. New Consultation, Follow-up, repoting ,INQUIERY,) 
સમગ્ર software નું design આ રીતે બનાવવું જોઈએ કે એક વ્યક્તિ પણ સરળતાથી handle કરી શકે.
એવું system હોવું જોઈએ કે જો કોઈ staff રજા પર હોય તો પણ બીજો વ્યક્તિ સહેલાઈથી બધું manage કરી શકે, અને કામમાં કોઈ મુશ્કેલી ન પડે.
●	Assigned Doctor — Select from active doctor list ( enable /disable )

DOCTOR  PAGE 
Hospital     logo   and name and doctor name                                                                                              CALENDAR
NEXT PATIEN NAME/AGE/M/F RESOUN 
FOR EX NIKUNJRAMJIBHAI 28YR MALE FOR ACNE SCARE color coding

                               add new patient ragiestrion /f/u pt
 ragistation (samjva mate real tabNAME  N  |f/u)
sarching tab              next patient name rameshbhai patel visit itching  with color coding

7TAB VIEW DOCTOR PENAL  
1 COMPLAINTS | 2 INVESTIGATION |3 DRUGH|4 PROSESSUER|5 IMAGE|6 DIGNOSI WITH INTRUTION AND F/U |7  FINAL REPOT (VIEW)


														DOCTR FILED 

•	CONSUTATION
•	PT PROFILE 
•	BOOK APOIENTMEN
•	BILLING
•	CONSENT
•	MR MEGEGMENT
•	PHARMACY MANAGEMENT
•	CALENDAR
•	UPLORD REPOT


MSG BOX                                                                                                                                                                  PAYMENT BOX 




●	Appointment Time — Auto ganarated  editebal with menully  (enable/disable)

દરેક 2 કેસ વચ્ચે ડિફોલ્ટ રીતે 15 મિનિટનું સમય અંતર ઓટોમેટિક જનરેટ થવું જોઈએ, અને આ સમય જરૂર મુજબ એડિટ કરી શકાય એવો હોવો જોઈએ. જો કોઈ પેશન્ટની કન્સલ્ટેશનમાં મોડું થાય, તો આગળના પેશન્ટના એપોઇન્ટમેન્ટ ટાઈમ છેલ્લા (Last) પેશન્ટના સમય મુજબ આપમેળે અપડેટ થવો જોઈએ.
સિસ્ટમમાં એડમિનને સુવિધા હોવી જોઈએ કે તે 2 સ્લોટ વચ્ચેનો સમય બદલી શકે, અને સાથે સાથે મિનિમમ સ્લોટ સમય પણ કન્ફિગર કરી શકે.
એડમિન દ્વારા ડોક્ટરના ટાઈમ સ્લોટ રેન્જ સેટ અને અપડેટ કરી શકાય તેવી સુવિધા હોવી જોઈએ, જેમ કે:
•	સવારે 9:00 થી 1:00 
•	અને સાંજે 4:00 થી 7:30 
આ તમામ ટાઈમ સેટિંગ્સ સરળતાથી બદલાવી શકાય અને સિસ્ટમમાં ઓટોમેટિક રીતે લાગુ પડી જાય તેવી વ્યવસ્થા હોવી જોઈએ.

●	Patient select કર્યા પછી left side માં patient profile દેખાવું જોઈએ, જેથી doctor તેમાં focus કરી શકે. જો કોઈ changes કરવાની જરૂર હોય તો તે પણ સરળતાથી કરી શકાય. આ માટે profile button આપવું જોઈએ જેથી profile સરળતાથી access થઈ શકે.
●	Patient નો BMI, Weight અને BP સતત update થતો રહે અને તેની છેલ્લા 4 record (date સાથે) history box માં બતાવવી જોઈએ.
•	આ history Excel type format માં હોવી જોઈએ, જેમાં:  ઉપર BP, BMI, Weight જેવા headings હોય અને નીચે તેમની date મુજબ values બતાવવામાં આવે (latest records સાથે
•	Payment type  if foc category auto ganrateted all further no show payment option only in constation in only  
●	Consultation Fee — Editable amount  pre fix amount by ganareted  (up- down by admine)
●	Discount (%) — Discount on consultation fee ( admin  and doctor ) not acces by nursing and reseption 
●	Net Fee — Auto-calculated after discount
●	Payment Status — Paid / Pending / Partial 
●	A STAFF SHOW ONLT APPOIENT MENT TODAY AND TOMOEEY NOT SHOW SELETED ON DATE 
IF DOCTOR GNRET % / FOC  PYMENT  DONE BY PT POP NOTIFICATION GNARTION BY RESPTION  

•	Notes — Reception internal note

PROFILE UPGREDING  WITH  (REQUIED OTP new pt ganaret with otp ? 

•	TODAY CANFOM  APPOIENTMENT ,TOMORE APPOIENT VIEW ONLY

•	tab give direct 7 tab consultion open if  doctor ragestted  patient  /book  appoientment 
•	જ્યારે ડોક્ટર નવો પેશન્ટ ઉમેરે અથવા નવી એપોઇન્ટમેન્ટ જનરેટ કરે, અને તે પ્રક્રિયા પૂર્ણ થાય (એપોઇન્ટમેન્ટ સેવ થયા પછી), ત્યારે સિસ્ટમમાં આપમેળે 7 Tab ઓપન થવો જોઈએ.
•	IF …Doctor દ્વારા New Patient / Appointment બનાવ્યા પછી  બધી વિગતો સેવ થયા પછી  સિસ્ટમ સીધી જ Tab 7 પર નાવીગેટ (Open) થવી જોઈએ 
•	આથી: કામનો ફ્લો ઝડપી રહેશે  અને ડોક્ટર  મેન્યુઅલી Tab બદલવાની જરૂર નહીં પડે
•	
•	patient saching  after selection mulipal tab option given by doctor penal SAME AS NAMO HOSPITAL 





•	bilig  and repot
 DOCTOR NE LEFT SIDE MA HAMESHA VISITING H/O , TOAL PAYMENT H/O IN DETILE – TOTL FOC AMOUNT, TOTAL DISCOUNT AMOUNT  ANA PAR CLICK KARI ALL DETILE MELVI SAKE 1ST  TOTAL CONSLING, TOTAL PROSEGUR,TOTAL PAYMENT AFTER CLICK (AFTER PAT OPEN IN 8 
o	પેશન્ટ ઓપન કર્યા પછી Billing માહિતી દર્શાવવાની સિસ્ટમ જ્યારે પેશન્ટને ઓપન કરવામાં આવે, ત્યારે સાઈડમાં એક Billing Tab આપમેળે દેખાવું જોઈએ, જેથી તરત જ પેશન્ટની તમામ બિલિંગ માહિતી જાણી શકાય.આ Billing Tab માં નીચેની માહિતી સ્પષ્ટ રીતે બતાવવી જોઈએ: પેશન્ટનું આજનું બિલ (Today Bill) ,એક મહિનાનું બિલ (Monthly Bill) , એક વર્ષનું બિલ (Yearly Bill) , અને ટોટલ બિલ (Total Bill) તે ઉપરાંત, પેશન્ટે કરાવેલ દરેક સર્વિસ માટે અલગ માહિતી દેખાવવી જોઈએ:Procedure મુજબ બિલિંગ (Procedure-wise Billing) Consultation બિલ અલગથી બતાવવું (Consultation Billing Separate)
o	બધું બિલિંગ એક જ રિપોર્ટમાં નહીં પરંતુ અલગ અલગ વિભાગમાં (Separate View) સ્પષ્ટ રીતે બતાવવું જોઈએ.
જો કોઈ ડિસ્કાઉન્ટ આપવામાં આવ્યું હોય, તો:, તે પણ સ્પષ્ટ રીતે દર્શાવવું જોઈએ ,કયા પ્રોસિજર પર કેટલો ડિસ્કાઉન્ટ છે તેની માહિતી પણ દેખાવવી જોઈએ , Total ,Discount અથવા FOC (Free of Cost) કેટલું છે તે પણ જાણી શકાય
આ તમામ માહિતી પેશન્ટ પ્રમાણે (Patient-wise) સ્પષ્ટ અને સરળ રીતે જોવા મળી શકે તેવી હોવી
o	જ્યારે ડોક્ટર પેશન્ટનું પ્રોફાઇલ સિલેક્ટ કરે, ત્યારે પેશન્ટની માહિતી 7 Tabs માં ઓપન થવી જોઈએ. આ Tabs માં પેશન્ટની કુલ કન્સલ્ટેશન ફી તારીખ પ્રમાણે, કુલ ફી ડિસ્કાઉન્ટ સાથે અથવા વગર, પ્રોસિજર ફી તારીખ અને પ્રોસિજર પ્રમાણે, કુલ પ્રોસિજર ફી ડિસ્કાઉન્ટ સાથે અથવા વગર, અને Master Total બિલિંગ with / without discount દર્શાવવી જોઈએ. 

•	cheek pt
done in consultion pt edit all 7 tab if re open and in cheek pt direct patien profile pick up show option given 
                                                             current pt liest  DOCTOR 
•	DOCTOR INFORM WHO IS NEXT PT NANE WITH PT CATOGARY . IN UPPER IN ONE  
                 Case no|time | Patient Name| visit for  |Age|Gender|address |PAYMENT  satues|MOBILE NO  | ACTION BUTTONE 
•	પેશન્ટ સિલેક્ટ કર્યા પછી, પ્રથમ Tab ઓપન રહેશે. ડોક્ટર માટે “Next Patient” બટન ઉપલબ્ધ હોવું જોઈએ. જ્યારે પેશન્ટ OPD માં IN થાય ત્યારે પેશન્ટનું Running નામ બ્લિંક થાય, અને પેશન્ટની પ્રોફાઇલ સિલેક્ટ થતાં બ્લિંકિંગ બંધ થાય. બ્લિંકિંગ બંધ થતાં રિસેપ્શનને ખબર પડે કે Next Patient કોને ડિસ્પ્લે કરવું. ડોક્ટર માટે સ્ક્રીનના સાઈડમાં Notification Tab હંમેશા ચાલું રહેવું જોઈએ, જે Next Patient કોને આવવાનો છે તેની જાણ આપે. જ્યારે ડોક્ટર Next Patient Notification Tab પર ક્લિક કરે, ત્યારે Next Patient ડિસ્પ્લે પર બ્લિંક થવા લાગે અને રિસેપ્શનની Patient List માં પણ Update થાય.
•	સ્ક્રીનના નીચે એક નાનું Notification Box હંમેશા ચાલુ રહેવું જોઈએ, જેમાં Payment Received – પેશન્ટનું નામ અને રકમ, Return Amount – કોણે અને કેટલું, વગેરે માહિતી દેખાય. જો આ Box પર ક્લિક કરવામાં આવે તો આજના તમામ Payment History ની વિગત ખુલવી જોઈએ. Payment Window હોવી જોઈએ, જ્યાં Daily Payment, Patient-wise Payment, Return Payment / Refund Details અને All Transactionsની માહિતી સતત જોવા મળે.
•	




7TAB VIEW DOCTOR PENAL  

1 COMPLAINTS | 2 INVESTIGATION |3 DRUGH|4 PROSESSUER|5 IMAGE|6 DIGNOSI WITH INTRUTION AND F/U |7  FINAL REPOT (VIEW)

Particular patient પર click કર્યા પછી open થાય ત્યારે special note section દેખાવું જોઈએ.
•	તેમાં નીચે મુજબની માહિતી automatically show થવી જોઈએ: 
o	દવા લીધી છે કે નહીં (Drug taken / Not taken status) 
o	Example: “ProSUGAR advised but patient એ લીધી નથી” 
o	Missed Appointment (ચૂકેલી appointment) 
o	Delayed Appointment (મોડી appointment) 
👉 ઉપરની side માં special note section સતત દેખાવું જોઈએ. આ special note consultation tab ખુલ્લી હોય ત્યાં સુધી સતત ઉપર દેખાતું રહેવું જોઈએ જેથી doctor ને દરેક સમયે જરૂરી માહિતી તરત મળી 

1	Display (read-only vitals from appointment): but edit option if click 
●	f/u for /consutation for all enter by resption/nursing stff  show doctor  but edit option by doctor 
●	Height (cm)
●	Weight (kg)
●	BMI
●	Temperature (°F)
●	Pulse Rate (bpm)
●	Blood Pressure (mmHg)
●	SpO2 (%)
Editable Fields (Doctor):
NOTE: All complaint field labels are configurable by Admin. (E/D/ADD IF ANY )


•	







1 Complaints Tab















 


Relieving Factors
What makes it better — text area
Past History
●	— Relevant past medical history
Personal History
Surgical History
Previous surgeries with dates
Current Medications
●	— Ongoing medicines from outside — text area
Obstetric / Gynae History
●	For female patients: LMP, parity, etc.
Alargy H/O 
Nursing Notes
●	— Nursing-specific observation notes (Nursing role)
PATIEN FEED BACK  PRE TYPING BY NURSING 

 f/u for /consutation for all enter by resption/nursing stff  show doctor  but edit option by doctor 
●	Height (cm)
●	Weight (kg)
●	BMI
●	Temperature (°F)
●	Pulse Rate (bpm)
●	Blood Pressure (mmHg)
●	SpO2 (%)
●	all tab endalbal disebal option given , changes position option given edit tital name optin given WITH ENEBAL /DISEBAL OPTION  
●	Present Complaint
●	Main reason for today's visit — text area
●	Duration of Complaint
How long the patient has had this complaint option in day box and moth box and yr box 
●	Severity  Mild / Moderate / Severe — dropdown
●	Onset
●	Sudden / Gradual — dropdown
●	Aggravating Factors
What makes it worse — text area


















 
 
2   Investigation Tab   
PRIVIOUS REPOT 	UPLORD REPOT 
Access: Doctor (Request) | Nursing and reseption  (Upload Results)

Sub-Tab: Lab Report
Structured input for lab values. All parameters are configurable by Admin.

Default parameter groups
Master key add by admit      show priviuely result   date, visit vies 

Sarching name …………………. Seletin add auto right side note box given if any note type 






Date
CHAT TYPE WITH NORMAL VALU EXIL SHIT IN PRIVIOUS REPOT IN NAMO TRETMENT SHEET 








 
MENUALLY WEITING INVESTIGATIN TYPE OPTION GIVEN 
i.	CBC — WBC, RBC, Haemoglobin, Haematocrit, MCV, MCH, MCHC, Platelets, Neutrophils
%, Lymphocytes %, Eosinophils % (NEW: extended)
ii.	ESR / CRP — ESR (1hr), CRP
iii.	Blood Sugar — Fasting, Post-Prandial, HbA1c
iv.	Lipid Profile — Total Cholesterol, LDL, HDL, Triglycerides
v.	LFT — SGOT, SGPT, ALP, Bilirubin Total/Direct
vi.	RFT — BUN, Creatinine, Uric Acid, eGFR
vii.	Thyroid — TSH, T3, T4
viii.	Urine — Routine Urine Examination
ix.	Custom — Any parameter defined by Admin

Not rquied information all below  gry  colour 
x.	Test Name — From lab master list
xi.	Requested By — Auto: doctor name
xii.	Requested Date / Time — Auto-stamped
xiii.	Sample Collected By — Nursing staff name
xiv.	Sample Collection Time — Date + Time
xv.	Result Value — Numeric or text
xvi.	Unit — From master
xvii.	Normal Range — From master — flag if out of range
2	Status — Pending / Sample Collected / Result Available
i.	Result Entry Time — Auto-stamped
ii.	Lab Cost — Per test cost
iii.	Remarks — Lab tech or doctor note
iv.	Admin — Lab Master Management:
NOTE: Admin manages lab test groups and parameters. Add / Edit / Delete / Listing.
v.	Test Group Name — e.g. CBC, LFT, Thyroid
vi.	Parameter Name — Individual parameter within the group
vii.	Unit — e.g. g/dL, mg/dL, %
viii.	Normal Range (Male) — Reference range for males
ix.	Normal Range (Female) — Reference range for females
x.	Normal Range (Child) — Paediatric reference range
xi.	Critical Low / High — Threshold to flag critical values
xii.	Display Order — Sequence in which parameters appear
xiii.	Is Active — Show / hide in investigation selection
 If final prient time  time 

      3  Drugs Tab 
Access: Doctor (Full Edit)


Drugh tab open direct  AFTER  SINGLE  CLICK but right side OPTION GIVEN   procuressur pricription BELOW EXAMPAL 


Instrument /drugh	qunity	ID CORD
3.0 VICRIL SUTURE	1	BZX  320
Ex darma rollar	1	ZVX  580
Ex 5cc series	2	KMX 30



                                                                                                                        					SUB ID :-  BUX 930
 
Master chart upte proseser vies liest  avelibal if seletion prosesser add all instrument auto
Ex…. Seletion prp 1ml 5 syring.1cottone pad, medical tab
 
 


			
NO


	
Content 
name/cobinatin
	
Brand name
	
brand
	dose

	
frequncy
	

day	

total	note

	
Slot no



	

								
1	Tab fluconazone 400 mg	TAB Flucocip 400mg	Cipla pvt	1 tab	Od after mill	5 day
	Total
5	Note
Not teken with milk	
BZX 120

2
2	Cream  
clotrimazole  1%
hide	
CREAM
Monpic

show         	
Atopic darma
hide	
1

show         	tds

show         	7
show         	1


hide	Before apply dry

hide	
BYX 80

hide
 
                








Prescription Fields (Repeating rows — add multiple drugs):





DRUGH NOTE 

                                                                                             


 

     



•	Slot Number ને Costing સાથે Correspond કરવાની સુવિધા: 
o	Example: 
	BXZ Corresponding – Rs 120 
	BYX Corresponding – Rs 80 
	HKX Corresponding – Total Rs 200 
•	. Mandatory Tab Selection
•	દરેક Tab Compulsory Selection: 
o	જો કોઈ Tab Select ન થાય → Next Tab Open ન થાય. 
o	Admin Decide કરે કઈ Tab Compulsory છે અને કઈ Skip કરી શકાય. 







SIMPAL DRUGH MANEGMENT



•	Simple દવાઓ માટે અલગ Excel sheet રાખવી જોઈએ. આ દવાઓ normal drug જેવી જ રહેશે, પરંતુ તેમાં ખાસ ઓળખ માટે code મૂકવો જોઈએ.
•	Example: 
•	Normal: Tab Levocip 
•	Simple: (S) Tab Levocip 
•	👉 એટલે drug ના નામ પહેલા (S) મુકવાથી doctor ને તરત ખબર પડી જશે કે આ simple drug છે.
•	જ્યારે MR આવે અને simple drug આપે, ત્યારે તેને system માં update કરી દેવું જોઈએ. 
•	જો કોઈ drug simple તરીકે set કરવામાં આવે, તો તે next tab / list માં પણ દેખાવું જોઈએ, પણ તેમાં આગળથી (S) code word automatically show થવું જોઈએ. 
•	👉 આ રીતે coding રાખવાથી simple અને normal drugs વચ્ચેનો ફરક સરળતાથી સમજાઈ જશે.


•	જો કોઈ patient ને simple drug આપવામાં આવે, તો special note માં drug taken / not taken status બતાવતી વખતે (S) Taken અથવા આ રીતે દર્શાવવું જોઈએ.
•	👉 આથી જ્યારે patient next time Follow-up (F/U) માટે આવે, ત્યારે doctor ને તરત ખબર પડી જશે કે simple drug આપવામાં આવી હતી અને patient એ લીધી હતી કે નહીં.


•	SIMPLE LIEST તેમાં manually add કરવાની facility હોવી જોઈએ જેથી MR આવે ત્યારે નવી દવા સરળતાથી add કરી શકાય. જ્યારે દવા prescribe કરવામાં આવે ત્યારે તે (S) stock માંથી આપમેળે ઘટી જવી જોઈએ. દર્દીને simple API આપવામાં આવી હોય તો તે માહિતી save થવી જોઈએ જેથી patient ફરીથી આવે ત્યારે તેની profile માંથી આ માહિતી સરળતાથી મળી શકે.
•	જ્યારે simple દવા આપવામાં આવે ત્યારે TAB, Cream, Capsule જેવા code wording માં દર્શાવવું જોઈએ. ઉદાહરણ તરીકે, સામાન્ય રીતે “Tab” લખાયેલું હોય પરંતુ simple તરીકે આપતી વખતે “T” અથવા “S” ને bold માં બતાવવું જોઈએ જેથી તરત જ ઓળખી શકાય કે આ simple medication છે. આ રીતે display કરવાથી માહિતી વધુ સ્પષ્ટ અને સ


•	4. Manual Drug Entry
•	One Tab provided for Direct Manual Entry for New Drugs (Not in Excel File). 
•	New Drug Add કરવાની Field Options: 
•	Drug Type / Form:
•	Cream, Syrup, Injection, Tablet, Gel, Serum, Oil, Face Wash, Liquid, Capsule, Solution, Drop, Soap, Shampoo, Lotion, Powder, Sachet, Pessary 
•	All added at one time 
•	Additional Details:
•	Brand Name 
•	Brand 
•	Dose (1 Tab, Half Tab, ML, etc.) → Manual Add 
•	Frequency (OD, BD, TDS, QID, HS/Night, Alternative Day, Weekly, Weekly 2 Times, Weekly 3 Times, Every 1 Month) 
•	Day 
•	Price / Per Tab / Per Piece 
•	Timing (Before Food / After Food / With Food / Bedtime) → Pre-entered, Direct Edit Option Available 
•	________________________________________
•	5. Auto Generation of Fields
•	All Fields once added in Master Sheet → After Drug Selection, Remaining Fields Auto Populate. 
•	Example: BD, Before Food, Weekly → Master Sheet માં Add કરેલા हिसાબથી Auto Generate. 
•	Direct Edit Option Available → But Frequency Manual Writing Not Needed. 
•	________________________________________
•	6. Drug Availability & Pop-up Alerts
•	If Drug Not Available → Pop-up Alert & Question: 
o	“Drug Not Available. Prescribe Another Drug? Yes / No” 
•	________________________________________
•	7. Stock & Low Limit Management
•	Admin / Doctor can Set Low Stock Limit (Example: Shampoo – Minimum 5 pieces) 
•	Show Option: Low Stock / Near Low Stock → Example: 6 Available 
•	Admin / Doctor → Show Drug Stock / Expiry Information 
•	________________________________________
•	✅ આ સુવિધાઓ Doctor/Admin માટે Drug Management, Auto Population, Frequency Auto Generation, Stock Alert અને Manual Override સાથે Complete System Friendly બનશે.
           


•	If drugh not avelibal show pop up /AFTER AND QUTION DRUGH NOT AVLIBAL PRISCRIB DRUGH .. YES /NO   ?

Admin અથવા Doctor દરેક દવા માટે minimum stock limit set કરી શકે તેવી facility હોવી જોઈએ, જેમ કે કોઈ shampoo માટે stock હંમેશા ઓછામાં ઓછો 5 રહે એવો limit મુકવામાં આવે. જો દવાનો stock આ limit નજીક આવી જાય, જેમ કે 6 available હોય, તો system માં low stock અથવા near low stock નો option બતાવવો જોઈએ. આ alert daily alert માં સતત દેખાતો રહે અને જ્યાં સુધી stock ફરીથી પૂરતો available ન થાય ત્યાં સુધી ચાલુ રહેવું જોઈએ. સાથે સાથે Admin અથવા Doctor ને આ alert ને modify કરવાની અને જરૂર પડે તો કોઈ દવાને alert list માંથી cancel અથવા remove કરવાની પણ સુવિધા આપવી જોઈએ

•	Admine / doctor  show drugh stock ,show information  near expariry 
DRUGH NAME
	BRAND NAME 	BRAND 	DOSE	FRQUNCY 	DAY

	BEFOR/AFTER  FOOD/AFTER  WASH /AFTER BATH/AFTER DRY/OTHER OPTION GIVEN AUTO ADD BY EXCIL FILE  AND EDIT OPTIN 	NOTE
IF ANY NOT ADD PRE TYPE ADD AND EDIT OTION 
EX EVER WEEK 	PRICE /PS /PR TABLET 











	













Tab Levocetrizine 10 mg  	Zylivo 10 mg 	zudus	1tab 	BD		After food	Not tacken with acohol	5/tab	100
•	દરેક દવા select કર્યા પછી તેની dose અને frequency આપમેળે (auto) add થવી જોઈએ અને સાથે જ direct click દ્વારા edit કરવાનો option પણ ઉપલબ્ધ હોવો જોઈએ. દવા માટે edit option dropdown અથવા ઉપરના option દ્વારા સરળતાથી access કરી શકાય તેવી વ્યવસ્થા હોવી જોઈએ. દિવસ પૂર્ણ થયા પછી reporting માટે Admin ને alert મળવો જોઈએ અને નવી ઉમેરાયેલી દવાઓની માહિતી Excel file માં update થવી જોઈએ.





•	1st windo continent name show /HIDE MANGE BY ADMINE 


•	All drugh addIN  tab  IN SINGLE EXILE SHIT / MASTER SHEET 

•	CONTENET NAME | BRAND NAME | BRAND |BEFORE /AFTER / WITH MEAL | PRICE 1 TAB /UNIT 

•	BELOW CREAM / LOATION   -  USE FOR BEFORE /AFTER /OTHER 

•	DRUGH UPDATE IN EXICLE SHITE 
•	EXIEL  SHIT SARCHING OPTION GIVEN

•	IF POSIBAL WINDOW PROVIED  IN EXCLE FILE /SACHING OPTIN / DIRECT NEW DRUGH ADD IN TAB UPDATE IN EXCILE SHIT AUTO METICLYY 
•	Before / aftr/ with water/ with milk /other 
•	IN EXICLE SHITE PROVIED 
•	CREAM  \ SYRUP \ INJ \ TAB \ GEL \ SERUM \ OIL \ FACE WASH \ LIQUIED \ CAPSULE \ SOLUTION \ DROP \ SHOPE  \ SHAMPU \ FROM \ LOTION \ .POWDAR \ SACHET  \ PESSORY 
    Prescription Fields (Repeating rows — add multiple drugs):
xiv.	Item Name — Search by drug name or content with dose /composition
xv.	Brand / Generic Toggle — Switch between brand name and generic name
xvi.	
xvii.	Frequency — OD / BD / TDS / QID / HS  (night ) /SOS / Custom
xviii.	Route — Oral / Topical / IV / IM / Inhalation — dropdown allreday drugh name dipent seletion for ex tab E/D)
xix.	Timing — Before Food / After Food / With Food / Bedtime  pre entar by seletion drugh 
xx.	Days — Number of days
xxi.	Total Quantity — Auto-calculated: Frequency x Days 
xxii.	Unit Cost — Auto-filled from drug master price
xxiii.	Note — Special instruction for this drug



o	જ્યારે કોઈ Drug માટે Minimum Stock Level સેટ કરેલો હોય અને સ્ટોક તે લેવલ કરતા ઓછો થઈ જાય, ત્યારે Doctor અને Admin ને ઓટોમેટિક મેસેજ/નોટિફિકેશન જવું જોઈએ. જો કોઈ Drug સ્ટોકમાં ઉપલબ્ધ ન હોય, તો Medical Store તરફથી Update કરવામાં આવે કે આ Drug ઉપલબ્ધ નથી, ત્યારે પણ સિસ્ટમમાં તરત જ “Drug Not Available” નો મેસેજ દેખાવવો જોઈએ.

o	સાથે સાથે, Pharmacy Management માટે એક Daily List હોવી જોઈએ, જેમાં તમામ Drugs ની માહિતી દેખાય જેમ કે Available Stock, Low Stock, Out of Stock વગેરે. આ List દ્વારા Pharmacy નું સંપૂર્ણ મેનેજમેન્ટ સરળતાથી જોઈ શકાય.


4 PROCEDURE TAB
Access: Doctor (Add/Edit) | Reception (View for billing)
Ask/doctor/nursing staff 

•	આ સાથે, List View ને અલગ-અલગ પ્રકાર પ્રમાણે અલગ પાડવાની (Filter / Separate List View) સુવિધા હોવી જોઈએ, જેથી દરેક કેટેગરીના Appointment અલગથી સરળતાથી જોઈ શકાય. તેમજ Appointment ને મહત્વ મુજબ ગ્રેડિંગ (Priority / Importance Level) આપવાની સુવિધા પણ હોવી જોઈએ, જેથી મહત્વના અથવા તાત્કાલિક Appointment તરત ઓળખી શકાય.
SMART Calendar માં એવી સુવિધા હોવી જોઈએ કે જેમાં Selected Date / 1 દિવસ પહેલાંના બધા Appointment Calendar View માં દેખાય. Appointment
dmin માં આવી સુવિધા હોવી જોઈએ કે selected date પસંદ કરે પછી તે દિવસની બધી appointments માટે auto message મોકલી શકાય (બધા patients ને એક સાથે).
•	Admin particular patients select કરીને appointment cancel અથવા reschedule પણ કરી શકે. 
•	જો appointment next date પર મૂકાશે, તો તે calendar માં પણ automatically update થવું જોઈએ. 
•	Messages માટે: 
o	Admin દ્વારા pre-typed message template બનાવેલો હોવો જોઈએ 
o	જરૂર મુજબ તે message edit કરી શકાય એવો option પણ હોવો જોઈએ 
👉 આથી appointment management, communication અને rescheduling સરળતાથી manage થઈ શકશે
•	  Calendar માં અલગ-અલગ પ્રકારના Appointment દર્શાવવા માટે Option હોવો જોઈએ, જેમ કે Consultation, Procedure, Laser, Follow-up (F/U), New Case અને Inquiry.
•	આ તમામ Appointment ને Category પ્રમાણે Filter કરીને અલગ-અલગ રીતે જોવા મળે તેવી સુવિધા હોવી જોઈએ, જેથી Doctor અને Staff સરળતાથી જરૂરી Appointment મેનેજ કરી શકે.

•	સિસ્ટમમાં Date Selection કરવાની સુવિધા હોવી જોઈએ, જેથી કોઈપણ પસંદ કરેલી તારીખની તમામ Appointment ની સંપૂર્ણ માહિતી મેળવી શકાય. જો કોઈ ચોક્કસ તારીખ માટે Appointment હોય અને તે દિવસ માટે Doctor ઉપલબ્ધ ન હોય, તો તે તારીખના તમામ Appointment ને એકસાથે Cancel / Reschedule કરવાની સુવિધા હોવી જોઈએ.
સાથે સાથે, તે દિવસના તમામ પેશન્ટને એકસાથે Pre-typed Message મોકલી શકાય, જેમ કે “તમારી Appointment છે, પરંતુ હું તે દિવસે ઉપલબ્ધ નથી,” જેથી તમામને એકસાથે જાણ કરી શકાય.   આ ઉપરાંત, તે તારીખના Appointment ને Next Available Day પર ઓટોમેટિક Shift / Move કરવાની સુવિધા હોવી જોઈએ, જેથી દિવસની તમામ Appointment આગળના દિવસે ટ્રાન્સફર થઈ જાય અને Schedule સતત ચાલુ રહે.

NOTE: When a procedure is added, the pending balance is automatically updated at the Reception billing counter.

Procedure Fields
•	

 AFTER SELECTIN PROCESSUR ALL (fixed by syste /IF ANY TAB ADD OPTION GIVEB BY MASTER 
 TAB OPTION SHOW BLOW PROCUESR 
PRIVIOUES /CURRENT PROCUGAR LIEST VIEW ALL VIEW ONLY /ACTION BOTTONE VIEW LIEST IMAGE SHOW OPTION GIVEN   /ADD/EDIT/DELIT 

														




જ્યારે ડોક્ટર કોઈ પેશન્ટ માટે પ્રોસિજર એડ કરે પરંતુ પેશન્ટ તે પ્રોસિજર તરત ન કરાવે, ત્યારે તે પ્રોસિજરની માહિતી Special Note માં આપમેળે સેવ થવી જોઈએ, અને તે Previous / Current List માં પણ દેખાવવી જોઈએ.
જો પેશન્ટને પહેલા પ્રોસિજર માટે એડવાઇઝ કરવામાં આવ્યો હોય પરંતુ પેશન્ટે તે પ્રોસિજર ન કરાવ્યો હોય અને ઘણા દિવસો પછી ફરીથી આવે, ત્યારે ડોક્ટર ફરીથી તે જ પ્રોસિજર કરવા કહે, તો ડોક્ટર Previous Procedure List માંથી સીધું સિલેક્ટ કરીને એડ કરી શકે.
જ્યારે આ પ્રોસિજર ફરીથી એડ થાય, ત્યારે તે Special Note માંથી આપમેળે Remove (Delete) થઈ જવું જોઈએ, જેથી ડુપ્લિકેટ અથવા પેન્ડિંગ નોંધો ન રહે
Date 
---------------Therapiest
	
Procegues ------------
by
	BODY PART	
Number of setion

4

Auto ganretor from 1st seletion day 
	
Auto ganrated f/u date  from today/ given date  


B/W-F 
DAY	20 


AUTO UPGREAD 

 	 
PERFOMENS DATE done 
	Skin type
	Unit
	Powar
	Wawe length
	plus duration
	sport size
	Pulse impuls
	Thick ness
	Den city
	Dot dencity
	Short fire
	satues	Remark
/ resouen	Rate
	Payment satues
	Action button 


25/03/2026
---------------
Dr valaki 	HAIR REMOWAL
------------
DIOED 
	FACE	1/4	1/4   5/03/2026	25/03/2026	2	0	10	100 hz	10	2.2	25	10	.5	10	100		done	2000	Done/pending	*
	HAIR REMOWAL
------------
DIOED 
	FACE	2/4	2/4   14/04/2026													CANFORMED 

PAYMENT PAY AND GIVE APPIENTMENT 



DALY BY 12 DAY  AUTO UPDATE 

Cancle

Not tacken further interested 

NOT TACKEN	Not avelibal

20/04/2026 f/u date 	2000	Cancle 	*cancle setion 
	HAIR REMOWAL
------------
DIOED 
	FACE	3/4	3/4  04/05/2026																	
	HAIR REMOWAL
------------
DIOED 
	FACE	4/4	4/4  24/05/2026																	



Note	



Dicouent     10 %	Acully price   10000	After discount price  9000 	Total    9000  







•	CONSENT FROM UPDTE  - 

•	જયારે ડોક્ટર કોઈ પણ Procedure સિલેક્ટ કરે, ત્યારે Consent Form આપમેળે સિલેક્ટ થવું જોઈએ. 
•	Consent Form માં નીચેની Patient ની માહિતી આપમેળે ભરાઈ જવી જોઈએ: 
•	Patient Name (નામ) ,M/F (લિંગ) ,Age (ઉમર) ,Place (સ્થાન) ,IPD No ,MRD No ,Procedure Name (પ્રોસિજરનું નામ) 
•	Consent Form માં Update Procedure Option હોવી જોઈએ, જેથી Doctor Procedure સુધારી શકે. 
•	Xerox Option હોવી જોઈએ, જેથી Doctor, Reception અને Nursing Panelમાંથી Consent Form ની Copy (Xerox) કરી શકે. 
•	જો 10-12 Consent Form તૈયાર છે અને Doctorને બદલી કરવી હોય, જેમ કે 12 Lessons માંથી 11 Lessons નું Form જોઈએ, તો Doctor પસંદગી કરીને Consent Form બદલી શકે. 
•	Patient Profile માં જે Language પસંદ કરેલી છે, Consent Form તે Language માં Generate થશે. 
•	 Consent Form Template માં Patient ની તમામ વિગતો હશે. Doctor જે લખે છે તે Selected Procedure Name, Date, Name, MRD No, Case No માં Auto Populate
•	જયારે Auto Upgrade Option પર Click કરવામાં આવે, ત્યારે Last Appointment Date આધારે પેશન્ટ માટે New Date આપમેળે Generate / Update થઈ જાય, અને Appointment હવે Late Period પછી Automatically Set થાય.
•	જો Auto Upgrade Option Unclick હોય, તો પેશન્ટની પ્રથમ આપેલી (Old) Date જ રાખવામાં આવે અને દરેક Previously Given Appointment Detail દેખાય.
•	આ સુવિધાથી પેશન્ટ માટે Appointment Auto Reschedule અથવા Original Date બંને સરળતાથી Manage થઈ શકે.


•	ADD NEW PROCUES IN EXICLE FILE SHOW  ACCODING TEBALE ADD  UPATE PRICE BY ADMINE



1.	નવું પ્રોસિજર ઉમેરવું (Add New Procedure) 
o	નવું પ્રોસિજર Excel ફાઈલ માં Table પ્રમાણે બતાવવું જોઈએ. 
o	Admin દ્વારા પ્રોસિજરની કિંમત (Price) અપડેટ કરવાની સુવિધા હોવી જોઈએ. 
o	Admin ને Direct Procedure View, Payment Option, Edit Price Option (Location / Size / Appointment સાથે કે વગર) આપવી. 
2.	ડોક્ટર અને Admin બંને માટે Excel Sheet Sync 
o	જો ડોક્ટર કોઈ નવું પ્રોસિજર ઉમેરે, તો તે Admin Excel Sheet માં આપમેળે Update થઈ જાય. 
o	New Procedure Add Option બંને માટે ઉપલબ્ધ હોવી જોઈએ. 
3.	Appointment Auto Update – Delayed Patient 
o	જો પેશન્ટ DUE Date પછી આવે, તો Last Procedure ની તારીખ પ્રમાણે Auto Update થવું જોઈએ. 
o	Example: Appointment Date 22/02/2026, પેશન્ટ 10 દિવસ પછી આવે → Pop-up દેખાડવું: Delayed Appointment, 10 દિવસ delay period સાથે. 
o	Delay Reason Special Note માં Auto Save થવી જોઈએ. 
o	Delay Appointment માટે Manual Procedure List Update પણ કરવા માટે Option આપવી. 
4.	Next Appointment / Follow-up (F/U) 
o	પેશન્ટ કહી શકે: “Coming Next Monday” → Auto Update Date Option સાથે F/U Notification બતાવવી. 
o	Sunday/Unavailable Dates: Admin દ્વારા Selection ન હોય તો Pop-up show AND GIVEN Appointment Date /NEXT AVELIBAL DATE  પર આપવી. 
5.	Procedure Payment / Due Management 
o	Doctor Procedure Generate કરે અને Payment / Due જો કરે, તો Record Excel માં Update થાય. 
o	જો Procedure Not Taken, તો Auto Delete + Special Note માં Save થાય: Not Taken / Advised Procedure / Reason. 
o	Inquiry Procedure: Patient Name, Reason, F/U Info Save થાય, જેથી Admin / Doctor જાણે કયા Patient Inquiry માટે આવ્યો. 
6.	Payment Edit Option 
o	તમામ Session માટે Direct Edit Payment Option હોવી જોઈએ. 
o	Payment Add થાય ત્યારે Excel Book માં Price Auto Update થાય. 
7.	Auto Writing Pre-type Procedure Name 
o	Procedure Add અને Session Set કરતી વખતે Pre-type Procedure Name Auto IN MULTIPAL SETION થવી જોઈએ.
1. Pre-Procedure Notes (પ્રિ-પ્રોસિજર નોટ્સ)
•	Doctor માટે Pre-op Instructions Template ઉપલબ્ધ હોવી જોઈએ. 
•	Template Add કરવી Compulsory નથી → Hide/Show Option ઉપલબ્ધ હોવી જોઈએ. 
•	Procedure Selection સમયે Auto Add: જો Admin દ્વારા Template Add કરાયું હોય, તો તે Auto Add થઈ જવું જોઈએ. 
•	Doctor પાસે Edit / Delete (E/D) કરવાની સુવિધા હોવી જોઈએ. 
________________________________________
2. Post-Procedure Notes (પોસ્ટ-પ્રોસિજર નોટ્સ)
•	Procedure Template પ્રમાણે Post-Procedure Care Instructions Auto Add થવી જોઈએ. 
•	Doctor ઈચ્છે તો તેને બદલી શકે. 
•	Hide / Edit Option Admin દ્વારા Control કરી શકાય. 
________________________________________
4. Role-Based Viewing (Access Control)
•	Reception: ફક્ત Procedure Name + Payment Status જોવું જોઈએ, બીજુ કશું નહી. 
•	Nursing: Patient ની તમામ details, Pre/Post Notes, Advice, Procedure History બધું જોવું જોઈએ. 
________________________________________
5. Payment & Doctor Approval Workflow
•	Patient Payment થયાં પછી પણ Procedure Conducted હોય, જો Doctor Approval Pending હોય: 
o	Procedure Completion Record Save થાય 
o	Approval Pending Flag Auto Set થાય 
o	Doctor Approval આપ્યા પછી Remaining Payment Auto Update થાય. 
•	Suggested Developer Logic: 
o	Procedure Status: Pending → Completed → Approved 
o	Role-Based Access + Notification (Doctor, Reception, Nursing) 
o	Auto Alerts for Pending Approval 
If any patient  after  payment done with posesser  doctor aprvuval after  payment remening but prosessur done but after doctor   approval 
 Suggest in best devlopar 
NOTE: When a procedure is added, the pending balance is automatically updated at the Reception billing counter 


       																				5 IMAGE  TAB 

		ADD PROSEGUER 
SESELETION FOR PRE LIEST/MENUALLY TYE /IF ADD PROSESSUER AUTO ADD
	 COMPERESSON 




1.	જ્યારે ડોક્ટર 7મા Tab માં પેશન્ટ માટે કોઈ ઈમેજ સિલેક્ટ કરે, ત્યાર પછી Add Procedure માં Master Key પરથી Selection કરી શકાય અને Manual પણ લખી શકાય. 
2.	બટનની નીચે બધા પ્રોસિજરની લિસ્ટ (All List) ઓટોમેટિક Open થવી જોઈએ. આ લિસ્ટમાં પેશન્ટના તમામ પ્રોસિજર A થી Z ક્રમમાં દેખાવા જોઈએ. લિસ્ટમાંથી કોઈ પણ પ્રોસિજર સીધું સિલેક્ટ કરી શકાય અને તે પેશન્ટની પ્રોફાઇલમાં ઈમેજ સાથે Add થઈ શકે. લિસ્ટમાં સિલેક્ટ કરેલા પ્રોસિજર સાથે Comparison પણ કરી શકાય.
3.	જ્યારે ડોક્ટર Add Procedure Button મારફત કોઈ પ્રોસિજર એડ કરે, ત્યારે એ પ્રોસિજર તરત જ પ્રોસિજરની લિસ્ટ (Procedure List) માં બતાવવું જોઈએ. લિસ્ટમાં એ પ્રોસિજર ઉમેરાઈ જાય અને ત્યાંથી તે Directly Selectable રહે, જેથી ડોક્ટર અથવા સ્ટાફ તેને જોઈ અને એડ કરી શકે

LIEST VIEW 

NO	PROCESGAR  	DATE  LIESTING AROW HIG /LOW
1	PRP	02/02/2026
2	HAIR REMOVAL	26/02/2026
3	PILING 	16/03/2026

















SINGAL SETION 














•	જ્યારે કોઈ સેકશનનો Before / After પિક અપડેટ થઈ ગયો હોય, અથવા કોઈ પેશન્ટની 4 પ્રોસિજર સેટિંગ પૂર્ણ થઈ ગઈ હોય અને 1 એક્સ્ટ્રા પ્રોસિજર ઉમેરવો હોય, ત્યારે પ્રોસિજર Tab માં 5મી સેકશન એડ કરવાથી, તે સેકશન પ્રમાણે પિક પણ ઓટોમેટિક અપડેટ થવું જોઈએ.
•	સેકશનની ઓરિજિન પેનલ પર રાઈટ-ક્લિક કરતાં પણ સબ-સેકશન ઉમેરવાની સુવિધા હોવી જોઈએ, અને સબ-સેકશન ડબલ-ક્લિક કરતાં ઓટોમેટિક એડ થવું જોઈએ. સબ-સેકશન એડ કર્યા પછી, પ્રોસિજરનું નામ અને તારીખ ઓટોમેટિક દેખાવું જોઈએ (જે દિવસે એડ કરવું છે તે તારીખ auto). સબ-સેકશનમાં Before પિકની જરૂર નથી.
•	એક પિક સિલેક્ટ કરતાં તે Full Screen માં ઓપન થાય. સાઈડના બટનથી Send Image / Next Slide Press કરી શકાય, ત્યાં સુધી પહેલા / પછીના સેકશન ફરી ન આવે. ESC દબાવતા Full Screen બંધ થાય.
•	જો Compare બટન પર ક્લિક થાય, તો Compare View માં Full Screen સિલેક્શન પિક 2 અથવા વધુ પિક સાથે ઓપન થાય. Compare પિકમાં લાઇટ ડિવાઇઝર દેખાય, 2 પાર્ટમાં વહેંચાય – Left અને Right, અને બંને સાઇડ પર Zoom Option ઉપલબ્ધ હોય.
Compare કરી શકાય. Compare Screen પર તમામ પિક Side-to-Side અને Up-Down મাউસથી Adjust કરી શકાય. Compare Box માં પિક મૂકેલ સ્થાને રહી શકે અને Zoom Option પણ ઉપલબ્ધ રહે. Compare Reset કરવાની સુવિધા પણ હોવી જોઈએ.
•	

MULTIPAL SETION 






BEFORE

	
AFTER 1



	







AFTER 2

































COMPER 



NOTE 



mage સિલેક્શન થયા પછી, તમામ Title નામો Time અને Date પ્રમાણે દેખાવા જોઈએ, જેમાં સૌથી નવી (Recent) એન્ટ્રી સૌથી પહેલા દેખાય અને Date પ્રમાણે Up/Down સોર્ટિંગ થઈ શકે, જેમાં default તરીકે Recent પહેલા બતાવવું


1.	જો કોઈ નવી Procedure બનાવવામાં આવે, તો તે Auto Generate થઈને List માં Box View તરીકે દેખાવું જોઈએ. જો પેશન્ટ માટે કોઈ નવી Procedure બનાવવામાં આવે, તો તે Procedure Name અને Date સાથે ઓટોમેટિક એન્ટ્રી બને.
2.	Before / After ફોટા માટે Direct Selectionની સુવિધા હોવી જોઈએ, એટલે કે ફોટો અપલોડ કરતા પહેલા જ Before / After પસંદ કરી શકાય. એક જ Procedure માટે Multiple Appointment જનરેટ થઈ શકે, પણ તે બધું એક જ Folder / Sub Title હેઠળ ગોઠવાયેલું રહે (ઉદાહરણ તરીકે Blue/Green Box View માં).
3.	Photo Add કરતા વખતે, ફોટામાં Auto Date અને Time Generate થવું જોઈએ, અને સાથે Crop, Left-Right Adjustment જેવા Option ઉપલબ્ધ હોવા જોઈએ. ફોટો અપડેટ થયા પછી Edit Option હોવું જોઈએ, જેમાં Crop, Rotation, Mark, Delete જેવી સુવિધાઓ મળે, અને નીચે Photo માટે Auto Generated Date અને Time દેખાવા જોઈએ.
4.	દરેક ફોટાના નીચે નાના White Box માં Black Fontમાં Date અને Time દેખાવા જોઈએ, અને Admin માટે Edit/Delete (E/D) Option ઉપલબ્ધ હોવો જોઈએ, જેથી જરૂર મુજબ Date અને Time બદલી શકાય.





          
AFTER ADD IMAGE  OPTION  GIVEN   AND SELETION DIRECT OPEN  DIVIES   
CAMERA IF POSIBAL LOGO 	DARMA SCOPE LOGO AND BLOW NAME 	FACE SACNER (E/D OPTION BY ADMINE 




અહીં ફક્ત ક્લિનિકલ પ્રોસિજર જ જનરેટ થવી જોઈએ, એટલે કે માત્ર મેડિકલ સંબંધિત ટ્રીટમેન્ટ જ લિસ્ટમાં દેખાવા જોઈએ. ઉદાહરણ તરીકે, પિમ્પલ (Pimples) જેવી ક્લિનિકલ કન્ડીશન અથવા ટ્રીટમેન્ટ માટે જ પ્રોસિજર બનાવવી અને બતાવવી. અન્ય નોન-ક્લિનિકલ અથવા અનરિલેટેડ પ્રોસિજર લિસ્ટમાં આવવી નહીં જોઈએ.












●	Upload File — JPEG / PNG / PDF OPEN accepted

●	Image Capture Date / Time — Auto-stamped or manual entry
●	
●	Doctor's Observation / Report — Free text interpretation by doctor

●	PIC EDIT OPTION – ZOOM,CROP,ROTATION,MARKING OPTION GIVEN 

 


BETWEEN  2 PROSSUSUER   -----------------------------------------00000---------------- (ONLY FOR EXAMPAL DEVLOPAR GIVEN FOR BEST )




















DIAGNOSIS TAB 
Access: Doctor (Edit)
i.	Diagnosis — Main diagnosis — search ICD-10 code or free text (NEW: ICD-10 search) HIDE/SHOW OPTINE 

ii.	Differential Diagnosis — List of possible diagnoses considered HIDE /SHOW OPTION  HIDE/SHOW OPTION 
iii.	Provisional / Confirmed — Toggle — provisional or confirmed diagnosis (E/D OPTIONE )

iv.	Notes — Additional diagnostic notes/OTHER IF ANY 

v.	AFTER SELETION DIGNOSIS ADD DEVISED AUTO BY MASTER CHAT (HIDE DIGNOSISI)


AUTO HIDE /SHOW BY ADMINE PENAL  (IF PATICULAR PATIENT NOT SHOW CLICK HIDE/SHOW )
 
EYE OPTION (HIDE/SHOW ) AND ADMINE                                                                 EYE OPTION (HIDE/SHOW ) AND ADMINE  


                	
Tinea curies 
Tinea capities







 
In tabal given eye symbol  hide /show  in priciption page 

PROSEUER F/U SETION SHOW ONLY DATE  (EYE HIDE SHOW OPTINE)

1/4  20/02/20226
 2/4  25/03/2026
3/4    25/04/2026
4/4    26/05/2026





REVIW LINK 
•	આ option બધા patients માટે auto ન હોય, માત્ર doctor જે patient record માં click કરે તેના માટે. 
•	Admin દ્વારા Google review link add કરવાની સુવિધા હોવી જોઈએ, જેમાં tick box આપવામાં આવે. 
•	Doctor જ્યારે patient record open કરે → tick box mark કરે → Send button press કરે → patient ને review link auto send થઈ જાય. 
👉 આ રીતે, review link જરૂરી patient માટે જ મોકલવામાં આવશે અને admin દ્વારા manage પણ થઈ શકે.

 

RAMESHBHAI MANUBHAI PATEL                                                               DATE 20/03/2026
AGE 35YR  MALE                                                                                           CASE:- C001-001-130326  
PLACE :-SURAT							           MRD:-  P03-260001


VITAL (H) ( H/S ) (EYE SIMBOLI)
WIGHT 45 KG |HIGHT 5.6 FT| TEM 98.6F |PLUS 76/MINIT | BP 122/82mmhg | BMI 125 

[PARTICULAR (H) OPTION SIMBOLY EYE /ON EYE COSS]

C/C – ICING  WITH REDNESS  ON  AXILARRY  AREA
DIGNOSIS (H)
PRIMORY:- TINIEA
DIAGNOS :-TINIA CURIES 
DIRRENT :-DIGNOSIS  ECT,ECT,ECT 
[PARTICULAR (H) OPTION SIMBOLY EYE /ON EYE COSS]

DRUGH

Rx	NAME	DOSE	FREQUENCY	DURATION	NOTE IF ANY 
1	TAB DOLO 650 MG	1TAB	1-1-1
(AFTER FOOD)	7 DAY 	         -
2	SYP ALBENDAZOLE	5ML	0-0-1
(BEFOR FOOD) 	EVERY WEEK FOR 4 WEEK 	WITH MILK 
3	CREAM TM PHOB	1	1-0-1
(KEEP DRY PLCE BE FOR APPLIY)	8 DAY	ALTRNATIVE DAY 

4	CREAM  MONPIC	1	1-1-1
(KEEP DRY PLCE BE FOR APPLIY)	10 DAY	-
5	CREAM  FUCIBET	1	1-1-1
(KEEP DRY PLCE BE FOR APPLIY)	10 DAY 	-

NOTE

xxiv.		xxv.	RX -1 AND 2 MIX AND  APPLYxxvi.	

PROCUER NAME AND LIEST AND F/U DATE /SETION  IF ADVIESD 

INVESTIGATIN
s.IgE
cbc


ADVIESD
Sdgfsdah sdfigdsafg hyudsgfhagd yuhfgyuhgf yuhsdgfyudasg yufgduwesaf yusdgfsdgf yudgfyu fgtaedsgvfdhj yudgahfd ytugfdaS YUFGASD FFYUGFa fyu ggfdvbaG FDAEDSFG GDFGAHYFG YD FYUGYF DAsgfdyu gyudasg f fdasedfsadf fsadgfsadgf fsade df afd gf asdgfaSDGFG FDSFGA FASDGS GFSDFGGA FASDGASDGF FASFASDF GSR GF SDG G SDGF SDF G SDFG G SDGF SDF HDGF H FG GH FXDZsda F ASDDGF SD GF SDFFG D AGVFDSDF GH SDG  SDRFGH BDF H FGDKJDFG SFD G RSDG XC BV FDGJ FD F G SDFHFDGH FGDH SX GFFDGTGHFDGHSD GBH FDG H FDGTH DFGH DFGG HFGDHJDFGT H 

CONSLING WITH  DOCTOR 
DR R.R. PATED MD MEDICINE 
 FOR HIGH SGPT 

Next F/U
AFTER 12 DAY ON 02/04/2026 (PIMPUL )

 
Prescription માં font size માટે arrow (High / Low) option આપવું જોઈએ.
•	જો prescription log 2 pages નું હોય, doctor font size adjust કરી શકે છે. 
•	Prescription માં બધી fonts, bold, formatting admin દ્વારા pre-generated હોય છે. 
•	Doctor માટે માત્ર size increase / decrease કરવાની option ઉપલબ્ધ રહેશે. 
👉 એટલે prescriptionની overall design/admin settings secure રહેશે, અને doctor માત્ર size control કરી શકશે.


F/U WITH 
1/4  20/02/20226 MONDAY
 2/4  25/03/2026  FRYDAY
3/4    25/04/2026 MONDAY
4/4    26/05/2026 MONDAY 























 
ર્સિંગ પેનલ માટે મલ્ટિપલ યુઝર (Multiple User) સિસ્ટમ ઉપલબ્ધ કરાવવી જરૂરી છે, જેથી એકથી વધુ નર્સિંગ સ્ટાફ એક સાથે લોગિન કરીને સિસ્ટમમાં કામ કરી શકે. દરેક યુઝર માટે અલગ-અલગ લોગિન અને પરમિશન સિસ્ટમ હોવી જોઈએ.
•	HOSPITAL NAME
•	MOBILE NUMBER
•	EMAIL ED
•	LOCATION
•	DOCTOR NAME
•	ALL CONSULATION FEES EDITEBAL PRE TYPING OPATION 
•	PRICPTION TEMPLET AND MANAGE FOR PRIENT 4 SIDE AND , PAGE SELECTION A4,A3 ETC 
•	ALL WHATS APP MASENGAR MENEGMENT /TEX MSG MANAGE 
•	ALL DRUGH LIEST  MANAGEMENT 
•	ALL TEST LIEST MANEGMENT 
•	CONSULATION FEE ,ETC FEES MANAGEMENT 
•	PRECIPTION  ALL COLUM HIDIN AND SHOW OPTION BOTH  DOCTOR AND ADDMINE ONE TIME  CLICK NEXT PATIEN REMINING ,IF NEXT PATEN SELECT FURTHER NEXT OT SAME AS CANTINUES 
•	PAYMENT TYPE  SELECTIN BY DOCTOR ONE TIME ..FOC ETC 
•	PAYMENT OPTION AND FOC ODAR ONLY BY DOCTOR 
•	PATIENT GIVEN SHADUAL APPOIENTMENT BUT DOCTOR NOT AVELBAL THIS DATE SELECTION DATE RANGE ALL SHDUAL  APPOIENT PT SEND  SMS BUK AND NEW MSG IF ANY SEND (DOCTOR ON MONAY REGULY AVELIBAL ,ETC )
•	BILIG  AND REPOT
•	
•	AFTER DAY REPOTING ALART IN ADMINE NEW DRUGH UPADTE IN EXCILE FILE 
•	HOSPITAL REVIE LINK SHARE BY WHATS APP 
•	Patient not tacken druugh by medical repoting day,week,montly,particular patient vies ,repoting wich patient mulipal consoling but not tacken by drugh name ( time of  not taken)

રિપોર્ટિંગ અને Appointment System – Gujarati Translation
Reporting Views: 

1.	•કેટલા New Patients આવ્યા 
2.	•  કેટલા F/U (Follow-up) Patients આવ્યા 
3.	•  કેટલા Missed F/U Patients છે 
4.	•  કેટલી Procedures થઈ 
5.	•  કેટલા Inquiry (પૂછપરછ) આવ્યા 
6.	•  કેટલા Appointments Cancel થયા

🔹 💰 Income / Payment Report (₹ માં)
•	Consultation માંથી કેટલો income થયો 
•	Procedures માંથી કેટલો income થયો 
•	Total income (Consultation + Procedure)

🔹 🧾 Detailed Procedure Report
•	કઈ કઈ procedures થઈ 
•	કેટલા patients એ લીધી 
•	કેટલા patients એ not taken રાખી 
•	Procedure-wise complete details 
________________________________________
🔹 📋 Appointment Report
•	Total appointments 
•	Done appointments 
•	Pending appointments 
•	Cancelled appointments (reason સાથે) 
•	Cancel થયેલ appointment ની list view 
________________________________________
🔹 📞 Inquiry Report
•	Total inquiry count 
•	Inquiry ની list (date wise / patient detail સાથે) 
________________________________________
🔹 📈 View Types (બધું view માં મળવું જોઈએ)
•	Particular Date wise 
•	Weekly 
•	Monthly 
•	Yearly 
•	Custom Selection Date 
________________________________________
🔹 📊 Graph / Chart View
•	Bar chart / Pie chart / Line graph માં show કરવું: 
o	Patients (New / F/U / Missed) 
o	Income (Consultation / Procedure) 
o	Appointments (Done / Cancel / Pending) 
o	Inquiry 
👉 Graphical view થી analysis easy અને fast થઈ જશે



o	Staff Reporting: 
o	NURSING REPORTING 1,2,3 / RECEPTION REPORTING ,PHARMACES ,ETC WORKER 
o	DAILY WORKING ATTENDANCE, EXTRA TIME, PAYMENT HISTORY, ABSENT 
o	TOTAL MONTHLY PAYMENT, EXTRA TIME INCREMENT CALCULATION 
o	EXTRA TIME PER HOUR PRICE ADMIN દ્વારા DECIDE 
1.	WEEKLY / MONTHLY / YEARLY VIEWS: 
o	COUNSELING / FOLLOW-UP (F/U) REPORT GENERATOR 
o	કેટલી INCUMAE  STAFF દ્વારા GENERATED છે, ADMIN DECISION પ્રમાણે 
o	STAFF PRESENT, EXTRA BONUS, INCENTIVES, PERFORMANCE REPORT 
o	Staff માટે auto biometric attendance machine દ્વારા attendance record generate થવું જોઈએ.
o	Admin દ્વારા: 
o	Attendance report generate કરી શકાય 
o	Monthly total hours view કરી શકાય 
o	Regular payment અને extra time payment calculate કરી શકાય 
o	તમામ payment અને reports admin દ્વારા manage થવી જોઈએ 
o	👉 આ રીતે staff attendance, working hours અને payments centralized system માં accurately track અને manage થઈ શકે.
Time Views: 
o	Today | 1 week | 1 month | Date-wise reporting 
       Detailed Report: 
o	Consulting fees 
o	Lessor 
o	Procedure 
o	Total price 
o	Patient-wise breakdown 
                                                                                                                                                                                                                                                                                             Doctor View: 
o	Total patients A to Z 
o	Payment received history 
o	New registration information (daily, weekly, monthly, yearly) 
o	Follow-up patient information (today, weekly, monthly, yearly) 
o	Number of procedures, lesser, selections (today, weekly, monthly, yearly) 
2.	Income Reporting: 
o	Reporting by day, week, month, yearly 
o	Patient-wise income generated reporting 
👉 આ system થી financial, patient, procedure અને follow-up reporting structured, accurate અને easy-to-access બની શકે.
o	
o	
Appointment: 

o	Staff call/communication notes recorded 
o	Appointment missed / not decided / 1 day advance notification reports generate




Follow-up (F/U) Date Missed Patients – :
•	જો કોઈ patient F/U date ચૂકી જાય, તો system માં: 
o	Patient ની previous date-wise list દેખાવું જોઈએ 
o	Previous treatment, drug not taken status સહિત તમામ details દેખાવું જોઈએ  IN SPECIAL NOTE 
•	Call / Reporting: 
o	F/U માટે call કરો → notes enter કરો, જેમ કે: 
	“Out of city, next visit 5 days પછી કરો” 
o	Nursing staff patient ની next F/U date 5 days પછી update કરશે 
o	New F/U date automatically generate થશે 
•	Notification to Patient: 
o	Patient ને SMS / WhatsApp દ્વારા confirmation message મોકલાશે 
o	Message pre-type અથવા type-able format માં હોવો જોઈએ,  ADMINE  દ્વારા edit કરી શકાય 
👉 આથી missed F/U patients efficiently track થઇ શકે અને next visit ensure થાય

Doctor અને Nursing Staff Daily Reporting –
•	Doctor daily track કરી શકે કે કયા patients કયા treatment લીધા. 
•	Next day doctor patient નો name click કરીને nursing station ને list મોકલી શકે, જેથી nursing staff F/U કરે. 
•	Nursing staff F/U કર્યા પછી notes લખશે, જેમ કે treatment progress, drug taken/not taken, patient feedback  NOTE DO NOT CALL વગેરે.  
•	Doctor ને daily F/U patients ની list આપવામાં આવશે, અને તે કેટલા patients treat થયા તેની complete reporting  
•	Nursing / doctor માટે daily reporting morning માં auto generate થશે, જેમાં બતાવવામાં આવશે કે આજે કેટલા patientsના F/U છે અને કયા patientsના F/U pending છે. 
👉 આ systemથી daily treatment, F/U tracking, અને reporting સરળ અને systematic રીતે manage થઈ શકે.
•  આ list માંથી doctor જે patients નો F/U લેવાનો નથી તે patients ને select કરીને અલગ list બનાવી શકે. 
•  Doctor patient selection કરીને F/U call માટેની list nursing staff ને મોકલી શકે. 
•  Doctor પાસે option હોવું જોઈએ કે: 
•	Consultation wise 
•	Procedure wise
પ્રમાણે patients ને અલગ કરી શકે 
•  સાથે doctor priority set કરી શકે: 
•	કોણે પહેલો call કરવો 
•	પછી કોણે next call કરવો 
•  આ પ્રમાણે તૈયાર થયેલી priority-wise F/U list nursing panel માં મોકલી શકાય જેથી nursing staff સરળતાથી call કરીને follow-up manage ક

Doctor Next Day / Selection Day Calendar & F/U Reporting – Gujarati Translation:
•	Doctor next day અથવા selection day ના calendar માં જઈને report જોઈ શકે. 
•	Report માંથી કોઈ patient ને F/U માટે call કરવો એ select (tick) કરી શકે. 
•	Priority માટે 1st કોનાથી call કરવું એ પણ tick કરી nursing panel માં મોકલવામાં આવશે. 
•	Nursing panel થી call કરી patient appointment time book કરશે. 
•	Patient feedback પણ nursing staff write કરશે, જેથી doctor ને અલગ call કરવાની જરૂર ન પડે. 
•	Doctor daily report generate કરશે, જેમાં: 
o	જે patients માટે call કરવાની જરૂર નથી એ alag highlight થાય. 
o	Report list view generated પછી nursing staff ને forward કરવામાં આવશે. 
•	Doctor processes view, counseling view વગેરે alag grading / categories પ્રમાણે structured રહેશે, 
o	જેથી procedure patients ને પહેલા call કરી શકાય. 
👉 આ systemથી F/U management, call prioritization અને daily reporting organized અને efficient બનશે.


 
Pre type information 
Drugh taken  - not taken by color cording /helf tacken 

Advise taken /not  tacken 
( advise name moll removal ,co2 lessor ,pilling )
Information tack by procure iest  and medical cornformation 



	Note 
P[ayment  issue ,next time after time tacken ,poor consoling, missing consoling poient like  don,t proper undarstebding  etc 


MEDICAL SHOW ONLY DRUGH LIEST ONLY AND PATIEN DETILE NAME,MRD,OPD CASE NO,M/F 

Patient Advice, Calendar & Appointment System – Gujarati Translation:
1.	Patient Advice / Procedure Tab: 
o	Patient ને advise કરેલ procedures જેમ કે lessor, peeling વગેરે directly procedures tab માં add કરી શકાય. 
o	Appointment એ same day માટે આપ્યું હોય અને patient એ procedure not taken હોય, તો procedures tab માં “advised but not taken” તરીકે record કરવું. 
o	Doctor માટે easy reference રહેશે, જેથી next visit પર પણ patient ને advised procedures બતાવી શકાય. 
Calendar View & Appointment Booking: 
o	Left upper side માં small calendar show કરવો – current month display. 
o	Particular date click → time select → appointment booking. 
o	Calendar માં show થવું: 
	Today / Selection day info 
	Today inquiry generation 
	Today procedure confirmation 
	Done procedure 
	Today new case 
	Follow-up (F/U) case 
	Today payment (esthetic & consultation) 
	All details single date view 
2.	Nursing Access: 
o	Nursing staff માટે appointment booking & today / next day appointment list show only. 
o	Particular day access admin permission દ્વારા manage. 
o	Next day appointment list: consultation / new patient / F/U / procedure all show. 

3.	Today / Selection Date Report: 
o	Total patients 
o	Total new patients 
o	Total appointments 
o	Total done appointments 
o	Today pending appointments 
o	Total canceled appointments with reason 
o	Today total advised procedures / taken / not taken 
o	Today payment – consultation / procedure 
o	Today inquiry 
4.	Graphic / Chart View: 
o	Reports should be graphical / chart view for better understanding. 
o	Best idea: develop software with easy visualization, color-coded status, clear single-date reporting and summary dashboard for admin and doctor.






.
•	. Pharmacy Management (Admin Panel / Doctor Panel)
•	New drug add કરવી હોય: 
o	List admin અને doctor દ્વારા update કરી શકાય. 
•	Patient drug pending: 
o	જો patient drug માટે request કર્યો પરંતુ drug મળી નથી → patient list today / selected date show. 
•	Patient half drug લીઈ છે: 
o	Half drug patients નું today / selected date list show. 
•	Drug unavailable: 
o	Patient drug લેવા ગયો પરંતુ drug available નથી → list notify medical shop. 
•	Drug return: 
o	Patient drug return કરે → today / selected date list show 
o	Medical shop update કરશો → automatically patient profile માં update. 
Medical shop દ્વારા total drug stock Excel file માં daily add કરવામાં આવશે. ત્યારબાદ patient જેમ જેમ drug લેશે, તેમ તે stock માંથી આપમેળે ઘટતું જશે.
•	કોઈ પણ drug પર click કરીએ તો તેની સંપૂર્ણ માહિતી મળવી જોઈએ: 
o	હાલ કેટલો stock ઉપલબ્ધ છે 
o	કેટલો stock કયા patient ને આપવામાં આવ્યો છે 
👉 આથી stock tracking અને drug distribution સરળતાથી m

જો હું કોઈ દવા select કરું, તો મને તે દવા કયા patient ને આપવામાં આવી છે તેની list view મળવી જોઈએ.
•	તેમાં નીચે મુજબની માહિતી દેખાવા જોઈએ: 
o	Patient ID 
o	Patient Name 
o	કેટલી quantity આપવામાં આવી 
o	કયા દિવસે આપવામાં આવી (Date)
















2. MR Management (Admin & Doctor Panel)
•	Admin management: 
o	All staff attendance 
o	Staff work report 
o	Staff payment history 
👉 આ system થી pharmacy drug tracking, patient drug status, staff management & payments centralized અને efficient રીતે manage થ

Reporting System – 
•	Time Views: 
o	Today | 1 week | 1 month | Date-wise reporting 
•	Detailed Report: 
o	Consulting fees 
o	Lessor 
o	Procedure 
o	Total price 
o	Patient-wise breakdown 
•	Doctor View: 
o	Total patients A to Z 
o	Payment received history 
o	New registration information (daily, weekly, monthly, yearly) 
o	Follow-up patient information (today, weekly, monthly, yearly) 
o	Number of procedures, lesser, selections (today, weekly, monthly, yearly) 
•	Income Reporting: 
o	Reporting by day, week, month, yearly 
o	Patient-wise income generated reporting 
👉 આ system થી financial, patient, procedure અને follow-up reporting structured, accurate અને easy-to-access બની શકે.



HOSPIAL EXPENSIS 
1.	Income 
2.	Expense 
3.	Profit (Auto Calculation) 

Expense
•	Light Bill (વિજળી બિલ) 
•	Rent (ભાડું) 
•	Municipality Tax 
•	Worker Salary 
•	Sanitary / Cleaning ખર્ચ 
•	Installment (Loan / EMI) 
•	Internet / WiFi Bill 
•	Phone Bill 
•	 Printing / Stationary (પેન, પેપર, રજીસ્ટર)
•	 Drug Purchase (દવા ખરીદી) 
•	 Surgical Items (Injection, Syringe, Gloves) 
•	  Equipment Purchase
•	  Maintenance
•	Staff Related Expenses
•	Doctor Salary / Sharing 
•	Nursing Salary 
•	Reception Salary 
•	Bonus / Incentive 
•	Overtime Payment 

મને મારા સોફ્ટવેરમાં એવો ફીચર જોઈએ છે કે જેમાં ઇમેજ (ફોટો) સેવ થઈ શકે. હાલ મારું સોફ્ટવેર ક્લાઉડ પર ચાલે છે, પણ મને ઈમેજ લોકલ ડ્રાઈવ (કમ્પ્યુટર)માં સેવ થવી જોઈએ.
સિસ્ટમ આ રીતે કામ કરવો જોઈએ:
•	એક મેઇન PC ડોક્ટર માટે રહેશે 
•	બીજો PC નર્સિંગ માટે રહેશે 
નર્સિંગના PC પરથી:
•	ફક્ત ફોટો અપલોડ/અપડેટ કરી શકાશે 
•	ફોટો ડિલીટ કે અન્ય કોઈ ફેરફાર કરી શકાશે નહીં 
ડોક્ટરના PC પરથી:
•	બધા કંટ્રોલ્સ રહેશે (ફોટો જોવો, મેનેજ કરવો વગેરે) 

કઈ કંપનીનું ક્લાઉડ સોલ્યુશન પસંદ કરવું તે નિર્ણય અમે પોતે લઈશું. ક્લાઉડ આધારિત સોલ્યુશન અમારાં ખાસ જરૂરિયાતોને અનુરૂપ કસ્ટમાઇઝ કરીને તૈયાર કરી આપવું રહેશે.

•	Doctor અને Patient વચ્ચે વિડિયો કોલ
•	કોલ શેડ્યૂલ કરવાની સુવિધા
•	કોલ શરૂ/બંધ (Start/End) બટન
•	Low internet માટે optimized કોલ
•	Audio-only વિકલ્પ
________________________________________
4. Appointment System:
•	Patient સમય બુક કરી શકે
•	Doctor એપ્રુવ/રિજેક્ટ કરી શકે
•	તારીખ અને સમય મુજબ એપોઇન્ટમેન્ટ લિસ્ટ video nu alag thi 
________________________________________
5. Patient Management:
•	Patient માહિતી (નામ, ઉંમર, મોબાઇલ નંબર)
•	Patient history જોવા મળે
•	Prescription add અને save કરી શકાય
________________________________________
6. File & Image Management:
•	Photo/Report upload system

•	Delete permission ફક્ત Doctor પાસે
________________________________________. Security:
•	Login system (ID + Password +OTP)
•	Role-based access control
•	Data encryption જરૂરી
________________________________________
 Notifications:
•	Appointment reminder
•	Video call alert
________________________________________
Reports & Records:
•	તમામ વિડિયો કોલનો રેકોર્ડ
•	Doctor માટે રિપોર્ટ સિસ્ટમ
________________________________________
 Platform Requirement:
•	System PC પર ચાલે (Doctor & Nursing)
•	જરૂર હોય તો Mobile support (Android/iPhone)
________________________________________

 Cloud Requirement:
•	Cloud solution અમારી જરૂરિયાત મુજબ કસ્ટમાઇઝ કરવું
•	કઈ કંપનીનું ક્લાઉડ લેવું તે અમે નક્કી કરીશું
•	Proper backup system હોવો જોઈએ
________________________________________
. Additional Requirement:
•	System સરળ અને user-friendly હોવું જોઈએ
•	Future માં feature add કરી શકાય તેવી flexibility હોવી જોઈએ
________________________________________
Payment Terms & Service Agreement
ડેવલપર માટે કુલ ચાર્જ રૂ. 50,000 નક્કી કરવામાં આવ્યા છે.
•	1પેમેન્ટ: 15% (રૂ. 7,500) — પ્રોજેક્ટ કન્ફર્મ થાય ત્યારે આપવાનું રહેશે
•	2 પેમેન્ટ: 25% (રૂ. 12,500) — સોફ્ટવેરનું 50% કામ પૂર્ણ થાય ત્યારે આપવાનું રહેશે
•	3 પેમેન્ટ: 25% (રૂ. 12,500) — સોફ્ટવેરનું સંપૂર્ણ ડેવલપમેન્ટ પૂર્ણ થાય ત્યારે આપવાનું રહેશે
•	4 પેમેન્ટ: 35% (રૂ. 17,500) — પ્રોજેક્ટ સંપૂર્ણ રીતે લાઈવ (Live) થાય ત્યારે આપવાનું રહેશે
•	જો સોફ્ટવેર 100% પૂર્ણ ન થાય અથવા નક્કી કરેલા સમય કરતાં વધુ મોડું થાય
અથવા યોગ્ય સર્વિસ ન મળે, તો 100% પેમેન્ટ પરત આપવું રહેશે
•	સોફ્ટવેરનો સંપૂર્ણ સોર્સ કોડ, ડેટાબેઝ અને સ્ટ્રક્ચર અમને હસ્તાંતરિત (handover) કરવો ફરજિયાત રહેશે
•	પ્રોજેક્ટ શરૂ કરવા માટે બંને પક્ષની સહમતિ ફરજિયાત રહેશે અને પ્રથમ પેમેન્ટ મળ્યા પછી જ કામ શરૂ થશે.
•	નક્કી કરેલા સમય (3 MOUNTH ) અંદર પ્રોજેક્ટ પૂર્ણ કરવો ફરજિયાત રહેશે, જો વિલંબ થાય તો તે અંગે અગાઉથી જાણ કરવી પડશે.
•	સોફ્ટવેર સંપૂર્ણ રીતે કાર્યરત (fully functional) અને બગ-ફ્રી હોવો જોઈએ.
•	તમામ સોર્સ કોડ, ડેટાબેઝ અને પ્રોજેક્ટ સ્ટ્રક્ચર ક્લાયન્ટને સંપૂર્ણ રીતે હસ્તાંતરિત કરવાનું રહેશે.
•	ક્લાયન્ટની મંજૂરી વગર કોઈપણ ડેટા ડિલીટ અથવા નુકસાન ન થવું જોઈએ.
•	પ્રોજેક્ટ Live થયા પછી 3 મહિના સુધી ફ્રી સર્વિસ આપવામાં આવશે.
•	3 મહિના પછી જો કોઈ સર્વિસ અથવા સપોર્ટ જોઈએ તો 1 વર્ષ માટે રૂ. 4,000 ચાર્જ લાગુ પડશે.
•	જો સોફ્ટવેર નક્કી કરેલી શરતો મુજબ પૂર્ણ ન થાય અથવા સમયમર્યાદા કરતાં વધુ વિલંબ થાય, તો 100% પેમેન્ટ પરત આપવું ફરજિયાત રહેશે.
•	3 મહિના ફ્રી સર્વિસ પૂર્ણ થયા પછી, જો કોઈ સર્વિસ અથવા સપોર્ટ જોઈએ તો 1 વર્ષ માટે રૂ. 4,000 ચાર્જ લાગુ પડશે. આ 1 વર્ષની અવધિ દરમિયાન આ ચાર્જ સિવાય કોઈ વધારાનો સર્વિસ ચાર્જ લેવામાં આવશે નહીં.
•	WhatsApp API અને Cloud સંબંધિત પેમેન્ટ રૂ. 50,000ના કુલ પ્રોજેક્ટ ચાર્જમાં સમાવેશ થતું નથી. આ સેવાઓ માટેનું પેમેન્ટ સંબંધિત  પાર્ટીને અલગથી સીધું ચૂકવવાનું રહેશે. 
•	તમામ ઇમેજ અપલોડ સમયે Automatic Compression System લાગુ કરાશે, (AUTO - ON/OFF જેથી ફાઇલ સાઇઝ ઓછી થાય પરંતુ ઇમેજની સ્પષ્ટતા (Clarity) અને ગુણવત્તા (Quality) પર કોઈ નોંધપાત્ર અસર ન થાય.
•	ચોક્કસ ડોક્ટર, હોસ્પિટલ જ્યારે બંધ હોય ત્યારે પેશન્ટને ચોક્કસ ખબર પડવી જોઈએ કે તમે કઈ તારીખે અને કયા વારે પાછા આવશો. આનાથી પેશન્ટને રાહ જોવામાં સરળતા રહેશે.
•	તમારા સોફ્ટવેર માટે આ એકદમ પરફેક્ટ અને વિનમ્ર મેસેજ ડ્રાફ્ટ છે:
•	________________________________________
•	નમસ્કાર! 🙏
•	✨ "નિષ્ણાત સારવાર અને કુદરતી નિખાર માટે અમે આપની સેવામાં હાજર છીએ."
•	🔴 અત્યારે હોસ્પિટલ બંધ છે.
•	અત્યારે હોસ્પિટલ રજાના કારણે બંધ છે, હવે હોસ્પિટલ નીચે મુજબના સમયે ફરી શરૂ થશે:
•	📅 ખુલવાની તારીખ: [તારીખ, દા.ત. ૨૬-૦૪-૨૦૨૬] 🗓️ વાર: [વાર, દા.ત. સોમવાર] ⏰ સમય: સવારે ૧૦:૦૦ વાગ્યે
•	તમે તે દિવસ માટે એડવાન્સ એપોઇન્ટમેન્ટ અત્યારે જ બુક કરી શકો છો. તે માટે ૧ દબાવો.
•	અસુવિધા બદલ ખેદ છે.
•	ડૉ. છાયા વાલાકી (SKIN CITY) MBBS, DDV (Gold Medalist)
•	________________________________________
•	ડેવલપર માટે સૂચના (Smart Feature):
•	તમારા ડેવલપરને કહેજો કે સોફ્ટવેરમાં એક "Holiday Settings" નું ફોર્મ આપે જેમાં તમે આ ૩ વિગત ભરો એટલે મેસેજ જાતે બની જાય: 
•	૧. રજા ક્યાં સુધી છે? (તારીખ) 
•	૨. કયો વાર છે?
•	 ૩. કયા સમયDATE થી ઓપન થશે?



WhatsApp Business API  :- Meta Cloud API 
 Confirmation: જ્યારે રિસેપ્શન પર એપોઇન્ટમેન્ટ બુક થાય, ત્યારે પેશન્ટને તરત જ કન્ફર્મેશન મેસેજ જવો જોઈએ.
Reminder: એપોઇન્ટમેન્ટના ૨ કલાક પહેલા પેશન્ટને ઓટોમેટિક રીમાઇન્ડર જવો જોઈએ. (E/D) for particular patient in personal profile and without seletion patient for all  for ( E/D)
Cancellations (Holiday Logic): જો હું કોઈ દિવસ રજા રાખું, તો સોફ્ટવેરમાં તારીખ સિલેક્ટ કરતા જ માત્ર તે દિવસની એપોઇન્ટમેન્ટ ધરાવતા પેશન્ટ્સને કેન્સલેશનનો મેસેજ જવો જોઈએ.
Birthday Wishes: સોફ્ટવેર રોજ સવારે પેશન્ટ ડેટા ચેક કરી જેનો જન્મદિવસ હોય તેને "Skin City" તરફથી ઓટોમેટિક વિશ કરે.
Festival Bulk SMS: દિવાળી કે હોળી જેવા તહેવારો પર એકસાથે બધા જ પેશન્ટને વિશ કરવાનો ઓપ્શન હોવો જોઈએ.
Auto Follow-up: પેશન્ટ દવા લઈ જાય તેના ૭ દિવસ પછી "તમારી તબિયત કેવી છે?" તેવો ઓટોમેટિક મેસેજ જવો જોઈએ.
Today's Status: રિસેપ્શન ડેશબોર્ડ પર એક 'Yes/No' બટન હોવું જોઈએ. જો હું 'No' કરું અને કોઈ પેશન્ટ WhatsApp પર ઈન્ક્વાયરી કરે, તો તેને ઓટોમેટિક જવાબ જવો જોઈએ કે "ડોક્ટર આજે હાજર નથી."
Digital Prescription સોફ્ટવેરમાં બિલ કે પ્રિસ્ક્રિપ્શન જનરેટ થાય એટલે તરત જ પેશન્ટના WhatsApp પર તેની PDF જવી જોઈએ.
Template Tracking: મેસેજ પેશન્ટને મળ્યો કે નહીં (Sent/Delivered/Read) તેનું સ્ટેટસ સોફ્ટવેરમાં પેશન્ટના નામ સામે દેખાવું જોઈએ.

 WhatsApp MATE Official Meta Cloud API નો જ ઉપયોગ કરવાનો રહેશે

૧. પેશન્ટ માટે મેનુ (Welcome Message)
જ્યારે નવો પેશન્ટ મેસેજ કરે ત્યારે તેને આવો મેસેજ જવો જોઈએ:
નમસ્તે, Skin City ક્લિનિકમાં આપનું સ્વાગત છે. 🙏 નીચેનામાંથી જે સુવિધાનો લાભ લેવો હોય તેનો નંબર (1 થી 9) ટાઇપ કરીને મોકલો:

1️⃣ એપોઇન્ટમેન્ટ બુકિંગ (નવા અને જૂના પેશન્ટ માટે) 
2️⃣ ક્લિનિકનું લોકેશન (Google Maps લિંક) 
3️⃣ ક્લિનિકનો સમય (સવાર અને સાંજનો સમય)
 4️⃣ આજે હોસ્પિટલ ચાલુ છે કે બંધ? (Live Status) 
5️⃣ ડૉક્ટર પરિચય અને ઉપલબ્ધ સારવાર (ડિગ્રી, ગોલ્ડ મેડલ અને સ્પેશિયાલિટી)
 6️⃣ રિપોર્ટ અથવા ફોટા મોકલવા માટે (ડાયરેક્ટ અપલોડ ઓપ્શન) 
7️⃣ રિસેપ્શનિસ્ટ સાથે વાત કરવા (સીધો ફોન નંબર)


નમસ્તે [પેશન્ટનું નામ],
આશા છે કે આપની તબિયત સારી હશે. સારવાર બાબતે કોઈપણ મદદ માટે હોસ્પિટલના સમયે સંપર્ક કરવા વિનંતી.
આપનો દિવસ શુભ રહે! ✨
ડૉ. છાયા વાલાકી (SKIN CITY)
MBBS, DDV (Gold Medalist)


નમસ્તે [પેશન્ટનું નામ],
આશા છે કે આપની તબિયત સારી હશે. આવતીકાલે આપની આગળની તપાસ માટે હોસ્પિટલના સમયે આવવા વિનંતી.
આપનો દિવસ શુભ રહે! ✨
ડૉ. છાયા વાલાકી (SKIN CITY) MBBS, DDV (Gold Medalist


1️⃣ એપોઇન્ટમેન્ટ બુકિંગ (નવા અને જૂના પેશન્ટ માટે) 
પગલું ૧: મોબાઈલ નંબર ચેકિંગ
પેશન્ટ જેવો મેસેજ કરશે, સોફ્ટવેર એના નંબર પરથી ચેક કરશે:
•	જો જૂના પેશન્ટ છે: તો સીધું પૂછશે - "નમસ્તે [નામ], તપાસ (Follow-up) માટે કઈ તારીખે આવશો?"  MORING / EVING  SELETION KARIYA PACHI CALENDAR OPTION  BOOK AND CANFORMATION MSG 
•	જો નવા પેશન્ટ છે: તો નીચે મુજબની વિગતો પૂછશે.
સ્ટેપ ૧: સ્વાગત મેસેજ (ઓટો-ડિટેક્શન) સોફ્ટવેર પેશન્ટને ઓળખીને સીધો આ મેસેજ કરશે:
"નમસ્તે [પેશન્ટનું નામ], 'સ્કિન સિટી' હોસ્પિટલમાં આપનું સ્વાગત છે. તમારી આગળની તપાસ (Follow-up) માટે એપોઇન્ટમેન્ટ બુક કરી રહ્યા છો."
સ્ટેપ ૨: સવાર/સાંજ પસંદગી (Selection) તરત જ બે બટન આવશે:
•	☀️ સવાર (Morning)
•	🌙 સાંજ (Evening)
સ્ટેપ ૩: કેલેન્ડર ઓપ્શન (Calendar View) પેશન્ટ જેવું 'સવાર' કે 'સાંજ' પસંદ કરશે, એટલે તરત જ કેલેન્ડરની વિન્ડો (Flow) ખુલશે.
•	પેશન્ટ તેમાંથી પોતાની અનુકૂળ તારીખ પર ક્લિક કરશે.
•	
નમસ્કાર [પેશન્ટનું નામ], સ્કીન અને વાળની શ્રેષ્ઠ સારવાર માટે આપનું સ્વાગત છે🙏
"અભિનંદન! તમારી એપોઇન્ટમેન્ટ ડૉ. છાયા વાલાકી (SKIN CITY)માટે બુક થઈ ગઈ છે."
          📅 તારીખ: [તારીખ] ⏰ સમય: [સવાર / સાંજ]
          ⏰ સમય: ☀️ સવારે: ૧૦:૦૦ થી ૦૧:૦૦ 
            સ્થળ: 📍 સ્થળ: [ક્લિનિકનું સરનામું] 🗺️ લોકેશન: [Google Maps લિંક]
                ડૉ. છાયા વાલાકી (SKIN CITY)
                MBBS, DDV (Gold Medalist)


________________________________________
પગલું ૨: નવા પેશન્ટ માટે (Registration) 
નવા પેશન્ટ માટે સ્ટેપ-બાય-સ્ટેપ પ્રોસેસ:
૧. શરૂઆત (Trigger): પેશન્ટ મેનૂમાંથી "1️⃣ એપોઇન્ટમેન્ટ બુકિંગ" સિલેક્ટ કરશે.
૨. મોબાઈલ વેરિફિકેશન (OTP):
•	સોફ્ટવેર પેશન્ટને પૂછશે: "તમારો મોબાઈલ નંબર વેરીફાય કરવા માટે OTP મોકલવામાં આવ્યો છે."
•	પેશન્ટના ફોન પર ૪ કે ૬ આંકડાનો OTP આવશે. (આનાથી ખોટા બુકિંગ અટકશે).
•	પેશન્ટ OTP નાખશે એટલે સોફ્ટવેર ચેક કરશે કે આ નંબર નવો છે.
૩. પેશન્ટ પ્રોફાઇલ (નવા પેશન્ટ માટે ફોર્મ): નવો નંબર હોવાથી સોફ્ટવેર એક વિન્ડો (Flow) ખોલશે જેમાં પેશન્ટ આ ૩ વિગત ભરશે:
૪. સમય અને તારીખની પસંદગી (Session & Calendar): ફોર્મ ભર્યા પછી તરત જ પેશન્ટને બે ઓપ્શન દેખાશે:
•	☀️ સવાર (Morning)
•	🌙 સાંજ (Evening) ત્યારબાદ Calendar ખુલશે અને પેશન્ટ તારીખ પસંદ કરશે.
૫. ફાઈનલ કન્ફર્મેશન મેસેજ: તારીખ અને સમય સિલેક્ટ કરતા જ પેશન્ટને નીચે મુજબનો ફાઈનલ મેસેજ જશે:
________________________________________


નમસ્કાર [પેશન્ટનું નામ], 🙏
આપની એપોઇન્ટમેન્ટ 
           "અભિનંદન! [પેશન્ટનું નામ], તમારી એપોઇન્ટમેન્ટ ડૉ. છાયા વાલાકી (SKIN CITY)માટે બુક થઈ ગઈ છે.

નમસ્કાર [પેશન્ટનું નામ], સ્કીન અને વાળની શ્રેષ્ઠ સારવાર માટે આપનું સ્વાગત છે🙏
"અભિનંદન! તમારી એપોઇન્ટમેન્ટ ડૉ. છાયા વાલાકી (SKIN CITY)માટે બુક થઈ ગઈ છે."
          📅 તારીખ: [તારીખ] ⏰ સમય: [સવાર / સાંજ]
          ⏰ સમય: ☀️ સવારે: ૧૦:૦૦ થી ૦૧:૦૦ 
            સ્થળ: 📍 સ્થળ: [ક્લિનિકનું સરનામું] 🗺️ લોકેશન: [Google Maps લિંક]
                ડૉ. છાયા વાલાકી (SKIN CITY)
                MBBS, DDV (Gold Medalist)



2️⃣ ક્લિનિકનું લોકેશન (Google Maps લિંક) 
નમસ્કાર! 🙏
"શ્રેષ્ઠ સ્કીન કેર માટે આપનું સ્વાગત છે. મેપ્સની મદદથી સરળતાથી પધારો."
📍 ગૂગલ મેપ્સ લિંક: [તમારી લિંક]
🏠 સરનામું: [તમારું એડ્રેસ]





3️⃣ ક્લિનિકનો સમય (સવાર અને સાંજનો સમય)
નમસ્કાર ,સ્કીન અને વાળની શ્રેષ્ઠ સારવાર માટે આપનું સ્વાગત છે🙏
⏰ સમય: ☀️ સવારે: ૧૦:૦૦ થી ૦૧:૦૦ 
            સ્થળ: 📍 સ્થળ: [ક્લિનિકનું સરનામું] 🗺️ લોકેશન: [Google Maps લિંક]
                ડૉ. છાયા વાલાકી (SKIN CITY)
                MBBS, DDV (Gold Medalist)



 4️⃣ આજે હોસ્પિટલ ચાલુ છે કે બંધ? (Live Status) 
નમસ્કાર! 🙏
   સચોટ નિદાન, શ્રેષ્ઠ પરિણામ – Skin City માં આપનું સ્વાગત છે."
✅ આજે હોસ્પિટલ ચાલુ છે.
⏰ સમય: ☀️ સવારે: ૧૦:૦૦ થી ૦૧:૦૦ 🌙 સાંજે: ૦૫:૦૦ થી ૦૮:૦૦
        સ્થળ: 📍 સ્થળ: [ક્લિનિકનું સરનામું] 🗺️ લોકેશન: [Google Maps લિંક]
                ડૉ. છાયા વાલાકી (SKIN CITY)
                MBBS, DDV (Gold Medalist)

•	હોસ્પિટલ બંધ હોય ત્યારે
•	✨ નમસ્કાર! 🙏 "તમારા સ્વાસ્થ્યની કાળજી, એ જ અમારું લક્ષ્ય."
ક્ષમા કરશો, અત્યારે હોસ્પિટલમાં રજા છે. અમે [વાર] તારીખ [તારીખ] થી ફરી આપની સેવામાં હાજર થઈશું.
🕒 સમય: સવારે ૧૦ થી ૧ અને સાંજે ૫ થી ૮
એપોઇન્ટમેન્ટ કન્ફર્મ કરવા માટે અત્યારે જ ૧ દબાવો.
શુભકામનાઓ! 
ડૉ. છાયા વાલાકી (SKIN CITY)
MBBS, DDV (Gold Medalist)

 6️⃣ રિપોર્ટ અથવા ફોટા મોકલવા માટે (ડાયરેક્ટ અપલોડ ઓપ્શન) 
7️⃣ રિસેપ્શનિસ્ટ સાથે વાત કરવા 

નમસ્કાર! 🙏
✨ "આપની સુવિધા, અમારી પ્રાથમિકતા."
જો તમારે એપોઇન્ટમેન્ટ વિશે વધુ માહિતી જોઈતી હોય અથવા સીધી વાત કરવી હોય, તો નીચે આપેલા નંબર પર ક્લિક કરીને ફોન કરી શકો છો:
📱 રિસેપ્શન: [તમારો મોબાઈલ નંબર] ☎️ લેન્ડલાઇન: [જો હોય તો નંબર]
⏰ ફોન કરવાનો સમય: સવારે ૧૦:૦૦ થી ૦૧:૦૦ | સાંજે ૦૫:૦૦ થી ૦૮:૦૦
નોંધ: જો ફોન વ્યસ્ત આવે અથવા રિસીવ ન થાય, તો કૃપા કરીને થોડીવાર પછી ફરી પ્રયત્ન કરવા વિનંતી.
ડૉ. છાયા વાલાકી (SKIN CITY)

