import { PrismaClient, Role, QueueStatus, QueueType, CaseStage, AppointmentStatus } from '@prisma/client';

const prisma = new PrismaClient();

const FIRST_NAMES = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya', 'Diya', 'Ananya', 'Myra', 'Kavya', 'Avni'];
const LAST_NAMES = ['Patel', 'Sharma', 'Reddy', 'Singh', 'Desai', 'Verma', 'Nair', 'Iyer', 'Gupta', 'Joshi', 'Mehta', 'Chaudhari', 'Shah', 'Kumar', 'Pillai'];
const COMPLAINTS = ['Fever', 'Cough', 'Stomach Pain', 'Headache', 'Routine Checkup', 'Follow-up', 'Skin Rash', 'Back Pain', 'Knee Pain', 'Eye Irritation'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const CITIES = ['Mumbai', 'Pune', 'Ahmedabad', 'Surat', 'Vadodara', 'Nashik', 'Nagpur'];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomMobile() {
  return `9${Math.floor(100000000 + Math.random() * 900000000)}`;
}

/**
 * Check which columns actually exist in QueueEntry table in the DB.
 * This makes the seeder robust against schema drift between dev and prod.
 */
async function getExistingQueueEntryColumns(): Promise<Set<string>> {
  const result = await prisma.$queryRaw<{ column_name: string }[]>`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'QueueEntry'
  `;
  return new Set(result.map(r => r.column_name));
}

async function main() {
  console.log('🌱 Starting Daily Seed...');

  // ── Pre-flight: check which columns exist in DB ──────────────────────────
  const queueColumns = await getExistingQueueEntryColumns();
  console.log(`📋 QueueEntry columns detected: ${[...queueColumns].join(', ')}`);

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
  await prisma.patientCase.deleteMany({
    where: {
      caseNumber: { startsWith: 'CASE-DAILY-' }
    }
  });
  await prisma.patientCase.deleteMany({
    where: {
      caseNumber: { startsWith: 'CASE-WLK-' }
    }
  });

  console.log('📅 Seeding fresh appointments and queue for today and tomorrow...');

  let createdAppts = 0;
  let createdQueue = 0;

  // ── Generate 20 seed patients if they don't exist ────────────────────────
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
              bloodGroup: pick(BLOOD_GROUPS),
              city: pick(CITIES),
              state: 'Maharashtra',
            }
          }
        }
      });
    }
    patients.push(p);
  }

  // ── Helper: safe create QueueEntry (omit unknown columns) ────────────────
  async function safeCreateQueueEntry(data: Record<string, any>) {
    // Strip any fields that don't exist in the actual DB
    const safe: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      // Always include known base columns; skip optional extension columns that may not exist
      if (queueColumns.has(key) || ['tokenDisplay', 'tokenNumber', 'queueType', 'status', 'patientId', 'doctorId', 'caseId', 'branchId', 'checkInTime', 'priority'].includes(key)) {
        safe[key] = value;
      } else {
        console.warn(`⚠️  Skipping column '${key}' — not found in DB schema`);
      }
    }
    return prisma.queueEntry.create({ data: safe as any });
  }

  // ── 10 Appointments for Today ─────────────────────────────────────────────
  for (let i = 0; i < 10; i++) {
    const p = patients[i];
    const doc = doctors[i % doctors.length];
    const apptTime = new Date(todayStart);
    apptTime.setHours(9 + i, (i % 2) * 30, 0, 0);

    let status: AppointmentStatus = AppointmentStatus.SCHEDULED;
    let queueStatus: QueueStatus | null = null;
    let caseStage: CaseStage = CaseStage.RECEPTION;

    if (i < 3) {
      status = AppointmentStatus.COMPLETED;
      queueStatus = QueueStatus.COMPLETED;
      caseStage = CaseStage.COMPLETED;
    } else if (i < 5) {
      status = AppointmentStatus.SCHEDULED;
      queueStatus = QueueStatus.WAITING;
      caseStage = CaseStage.RECEPTION;
    } else if (i === 5) {
      status = AppointmentStatus.SCHEDULED;
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
      checkInTime.setMinutes(checkInTime.getMinutes() - 15);

      await prisma.appointment.update({
        where: { id: appt.id },
        data: { caseId: pCase.id }
      });

      await safeCreateQueueEntry({
        tokenDisplay: `DR-${doc.name.substring(0, 3).toUpperCase()}-${i + 1}`,
        tokenNumber: i + 1,
        queueType: QueueType.OPD,
        status: queueStatus,
        patientId: p.id,
        doctorId: doc.id,
        caseId: pCase.id,
        branchId: branch.id,
        checkInTime,
      });
      createdQueue++;
    }
  }

  // ── 5 Appointments for Tomorrow ───────────────────────────────────────────
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

  // ── 3 Walk-In Patients for Today ──────────────────────────────────────────
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

    await safeCreateQueueEntry({
      tokenDisplay: `DR-${doc.name.substring(0, 3).toUpperCase()}-W${i + 1}`,
      tokenNumber: i + 100,
      queueType: QueueType.OPD,
      status: QueueStatus.WAITING,
      patientId: p.id,
      doctorId: doc.id,
      caseId: pCase.id,
      branchId: branch.id,
      checkInTime: new Date(),
    });
    createdQueue++;
  }

  console.log(`\n✅ Seed Complete!`);
  console.log(`   📋 Appointments created : ${createdAppts}`);
  console.log(`   🏥 Queue entries created: ${createdQueue}`);
  console.log(`\n💡 Tip: If you see column warnings above, run 'npx prisma migrate deploy' on your server to apply pending migrations.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e.message || e);
    console.error('\n📌 Possible fixes:');
    console.error('   1. Run: npx prisma migrate deploy   (to apply pending migrations)');
    console.error('   2. Run: npm run seed                (if this is a fresh database)');
    // @ts-ignore
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
