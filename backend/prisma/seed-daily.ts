import { PrismaClient, Role, QueueStatus, QueueType, CaseStage, AppointmentStatus } from '@prisma/client';

const prisma = new PrismaClient();

const FIRST_NAMES = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya', 'Diya', 'Ananya', 'Myra', 'Kavya', 'Avni'];
const LAST_NAMES = ['Patel', 'Sharma', 'Reddy', 'Singh', 'Desai', 'Verma', 'Nair', 'Iyer', 'Gupta', 'Joshi', 'Mehta', 'Chaudhari', 'Shah', 'Kumar', 'Pillai'];
const COMPLAINTS = ['Fever', 'Cough', 'Stomach Pain', 'Headache', 'Routine Checkup', 'Follow-up', 'Skin Rash', 'Back Pain', 'Knee Pain', 'Eye Irritation'];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomMobile() {
  return `9${Math.floor(100000000 + Math.random() * 900000000)}`;
}

async function main() {
  console.log('🌱 Starting Daily Seed...');

  const doctors = await prisma.user.findMany({
    where: { role: Role.DOCTOR },
    include: { doctorProfile: true },
  });

  const branch = await prisma.branch.findFirst();

  if (doctors.length === 0 || !branch) {
    throw new Error('❌ Missing basic data (Doctors/Branch). Run `npm run seed` first.');
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  const tomorrowEnd = new Date(tomorrowStart);
  tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);

  console.log('🧹 Cleaning up today\'s existing appointments and queue entries...');
  await prisma.queueEntry.deleteMany({});
  await prisma.appointment.deleteMany({
    where: { appointmentDate: { gte: todayStart } }
  });

  console.log('📅 Seeding fresh appointments and queue for today and tomorrow...');

  let createdAppts = 0;
  let createdQueue = 0;

  // Generate 20 patients if they don't exist
  const patients: any[] = [];
  for (let i = 0; i < 20; i++) {
    const mobile = randomMobile();
    let p = await prisma.patient.findFirst({ where: { mobile } });
    if (!p) {
      p = await prisma.patient.create({
        data: {
          firstName: FIRST_NAMES[i % FIRST_NAMES.length],
          lastName: LAST_NAMES[i % LAST_NAMES.length],
          mobile,
          mrdNumber: `MRD-DAILY-${Date.now()}-${i}`,
          gender: i % 2 === 0 ? 'MALE' : 'FEMALE',
          profile: {
            create: {
              age: Math.floor(Math.random() * 60) + 10,
              bloodGroup: 'O+',
              city: 'Mumbai',
              state: 'Maharashtra',
            }
          }
        }
      });
    }
    patients.push(p);
  }

  // Generate 10 appointments for Today
  for (let i = 0; i < 10; i++) {
    const p = patients[i];
    const doc = doctors[i % doctors.length];
    const apptTime = new Date(todayStart);
    apptTime.setHours(9 + i, (i % 2) * 30, 0, 0); // between 9 AM and 6 PM
    
    // Status can be SCHEDULED, COMPLETED, CANCELLED, NO_SHOW
    let status: AppointmentStatus = AppointmentStatus.SCHEDULED;
    let queueStatus: QueueStatus | null = null;
    let caseStage: CaseStage = CaseStage.RECEPTION;

    if (i < 3) {
      status = AppointmentStatus.COMPLETED;
      queueStatus = QueueStatus.COMPLETED;
      caseStage = CaseStage.COMPLETED;
    } else if (i < 5) {
      status = AppointmentStatus.SCHEDULED; // arrived but waiting
      queueStatus = QueueStatus.WAITING;
      caseStage = CaseStage.RECEPTION;
    } else if (i === 5) {
      status = AppointmentStatus.SCHEDULED; // arrived and in session
      queueStatus = QueueStatus.IN_SESSION;
      caseStage = CaseStage.DOCTOR;
    }

    const appt = await prisma.appointment.create({
      data: {
        patientId: p.id,
        doctorId: doc.doctorProfile!.id,
        branchId: branch.id,
        appointmentDate: todayStart,
        appointmentTime: apptTime,
        purpose: pick(COMPLAINTS),
        status,
      }
    });
    createdAppts++;

    // If they have arrived (or completed), create a case and queue entry
    if (queueStatus) {
      const pCase = await prisma.patientCase.create({
        data: {
          caseNumber: `CASE-DAILY-${Date.now()}-${i}`,
          patientId: p.id,
          doctorId: doc.id,
          branchId: branch.id,
          visitType: 'CONSULTATION',
          priority: 'NORMAL',
          complaint: pick(COMPLAINTS),
          status: queueStatus === QueueStatus.COMPLETED ? 'CLOSED' : 'OPEN',
          stage: caseStage,
        }
      });

      const checkInTime = new Date(apptTime);
      checkInTime.setMinutes(checkInTime.getMinutes() - 15); // checked in 15 mins before appt

      await prisma.appointment.update({
        where: { id: appt.id },
        data: { caseId: pCase.id }
      });

      await prisma.queueEntry.create({
        data: {
          tokenDisplay: `DR-${doc.name.substring(0, 3).toUpperCase()}-${i + 1}`,
          tokenNumber: i + 1,
          queueType: QueueType.OPD,
          status: queueStatus,
          patientId: p.id,
          doctorId: doc.id,
          caseId: pCase.id,
          branchId: branch.id,
          checkInTime
        }
      });
      createdQueue++;
    }
  }

  // Generate 5 appointments for Tomorrow
  for (let i = 10; i < 15; i++) {
    const p = patients[i];
    const doc = doctors[i % doctors.length];
    const apptTime = new Date(tomorrowStart);
    apptTime.setHours(9 + (i - 10), 0, 0, 0); 
    
    await prisma.appointment.create({
      data: {
        patientId: p.id,
        doctorId: doc.doctorProfile!.id,
        branchId: branch.id,
        appointmentDate: tomorrowStart,
        appointmentTime: apptTime,
        purpose: pick(COMPLAINTS),
        status: AppointmentStatus.SCHEDULED,
      }
    });
    createdAppts++;
  }

  // Generate 3 Walk-Ins for Today
  for (let i = 15; i < 18; i++) {
    const p = patients[i];
    const doc = doctors[i % doctors.length];
    
    const pCase = await prisma.patientCase.create({
      data: {
        caseNumber: `CASE-WLK-${Date.now()}-${i}`,
        patientId: p.id,
        doctorId: doc.id,
        branchId: branch.id,
        visitType: 'CONSULTATION',
        priority: 'NORMAL',
        complaint: pick(COMPLAINTS),
        status: 'OPEN',
        stage: CaseStage.RECEPTION,
      }
    });

    await prisma.queueEntry.create({
      data: {
        tokenDisplay: `DR-${doc.name.substring(0, 3).toUpperCase()}-W${i + 1}`,
        tokenNumber: i + 100,
        queueType: QueueType.OPD,
        status: QueueStatus.WAITING,
        patientId: p.id,
        doctorId: doc.id,
        caseId: pCase.id,
        branchId: branch.id,
        checkInTime: new Date(),
      }
    });
    createdQueue++;
  }

  console.log(`✅ Seed Complete! Created ${createdAppts} appointments and ${createdQueue} queue entries.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    // @ts-ignore
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
