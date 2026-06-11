/**
 * Queue Data Seeder — OPD Reception Demo
 * Adds 15 realistic patients to today's live queue WITHOUT wiping existing data.
 * Run with: npx ts-node prisma/seed-queue.ts
 */
import { PrismaClient, Role, CaseStage, QueueStatus, QueueType } from '@prisma/client';

const prisma = new PrismaClient();

const FIRST_NAMES = [
  'Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Pooja', 'Suresh', 'Anita',
  'Ravi', 'Meera', 'Kiran', 'Divya', 'Nikhil', 'Kavya', 'Arjun'
];
const LAST_NAMES = [
  'Sharma', 'Patel', 'Mehta', 'Shah', 'Kumar', 'Joshi', 'Desai', 'Verma',
  'Singh', 'Gupta', 'Reddy', 'Nair', 'Iyer', 'Pillai', 'Chaudhari'
];
const CITIES = ['Mumbai', 'Pune', 'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Anand', 'Gandhinagar'];
const COMPLAINTS = [
  'Fever and headache since 2 days',
  'Cough and cold, difficulty breathing',
  'Stomach pain and acidity',
  'Back pain, unable to stand for long',
  'Skin rash on forearm',
  'High blood pressure, dizziness',
  'Diabetes follow-up, sugar check',
  'Eye irritation and redness',
  'Knee pain while walking',
  'Routine health check-up',
  'Ear pain and discharge',
  'Throat infection, difficulty swallowing',
  'Migraine, severe headache',
  'Urinary burning sensation',
  'Chest discomfort after meals',
];
const VISIT_TYPES = ['CONSULTATION', 'FOLLOW_UP', 'PROCEDURE'];
const BLOOD_GROUPS = ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'];
const GENDERS: ('MALE' | 'FEMALE')[] = ['MALE', 'FEMALE'];

const STATUSES: QueueStatus[] = [
  QueueStatus.WAITING,
  QueueStatus.WAITING,
  QueueStatus.WAITING,
  QueueStatus.WAITING,
  QueueStatus.WAITING,
  QueueStatus.WAITING,
  QueueStatus.WAITING,
  QueueStatus.IN_SESSION,
  QueueStatus.COMPLETED,
  QueueStatus.COMPLETED,
  QueueStatus.COMPLETED,
  QueueStatus.WAITING,
  QueueStatus.WAITING,
  QueueStatus.WAITING,
  QueueStatus.CANCELLED,
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomMobile() {
  return `9${Math.floor(100000000 + Math.random() * 900000000)}`;
}

function randomAge() {
  return Math.floor(Math.random() * 60) + 10; // 10-70
}

function minutesAgo(n: number) {
  return new Date(Date.now() - n * 60 * 1000);
}

async function main() {
  console.log('🌱 Starting Queue Demo Seed...');

  // --- Find existing doctors and branch ---
  const doctors = await prisma.user.findMany({
    where: { role: Role.DOCTOR },
    include: { doctorProfile: true },
    take: 3,
  });

  if (doctors.length === 0) {
    throw new Error('❌ No doctors found. Run the main seed first: npm run seed');
  }

  const branch = await prisma.branch.findFirst();
  if (!branch) {
    throw new Error('❌ No branch found. Run the main seed first: npm run seed');
  }

  const branchId = branch.id;
  console.log(`✅ Using branch: ${branch.name} (${branchId})`);
  console.log(`✅ Found ${doctors.length} doctors`);

  // --- Create 15 demo patients + cases + queue entries ---
  let created = 0;

  for (let i = 0; i < 15; i++) {
    const firstName = FIRST_NAMES[i];
    const lastName = LAST_NAMES[i];
    const gender = i % 3 === 0 ? 'FEMALE' : 'MALE';
    const age = randomAge();
    const doctor = doctors[i % doctors.length];
    const status = STATUSES[i];
    const visitType = VISIT_TYPES[i % VISIT_TYPES.length];
    const mobileNumber = randomMobile();
    const tokenNumber = i + 1;
    const tokenDisplay = `DR-${doctor.name.split(' ')[1]?.substring(0, 3).toUpperCase() || 'DOC'}-${String(tokenNumber).padStart(3, '0')}`;
    const caseNumber = `DEMO-${Date.now()}-${i + 1}`;
    const mrdNumber = `MRD-DEMO-${Date.now()}-${i + 1}`;
    const checkInTime = minutesAgo((15 - i) * 8); // spaced 8 min apart
    const caseCreatedAt = minutesAgo((15 - i) * 10);

    try {
      // Create patient (skip if mobile already exists)
      let patient = await prisma.patient.findFirst({ where: { mobile: mobileNumber } });
      if (!patient) {
        patient = await prisma.patient.create({
          data: {
            mrdNumber,
            firstName,
            lastName,
            mobile: mobileNumber,
            gender,
            profileCompletionStatus: 85,
            isFoc: i === 7, // 1 FOC patient for demo
            profile: {
              create: {
                age,
                bloodGroup: pick(BLOOD_GROUPS),
                address: `${Math.floor(Math.random() * 999) + 1}, Demo Street`,
                city: CITIES[i % CITIES.length],
                state: 'Gujarat',
              },
            },
          },
        });
      }

      // Determine case stage from status
      let caseStage: CaseStage = CaseStage.RECEPTION;
      if (status === QueueStatus.IN_SESSION) caseStage = CaseStage.DOCTOR;
      if (status === QueueStatus.COMPLETED) caseStage = CaseStage.COMPLETED;
      if (status === QueueStatus.CANCELLED) caseStage = CaseStage.RECEPTION;

      // Create case
      const patientCase = await prisma.patientCase.create({
        data: {
          caseNumber,
          patientId: patient.id,
          doctorId: doctor.id,
          visitType,
          priority: i === 3 ? 'URGENT' : 'NORMAL',
          complaint: COMPLAINTS[i],
          status: status === QueueStatus.COMPLETED ? 'CLOSED' : (status === QueueStatus.CANCELLED ? 'CANCELLED' : 'OPEN'),
          stage: caseStage,
          branchId,
        },
      });

      // Create queue entry
      await prisma.queueEntry.create({
        data: {
          tokenDisplay,
          tokenNumber,
          queueType: QueueType.OPD,
          status,
          patientId: patient.id,
          doctorId: doctor.id,
          caseId: patientCase.id,
          branchId,
          checkInTime,
        },
      });

      // Add bill for COMPLETED entries
      if (status === QueueStatus.COMPLETED) {
        const fee = doctor.doctorProfile?.consultationFee || 500;
        const isPaid = Math.random() > 0.3;
        await prisma.bill.create({
          data: {
            billNumber: `BILL-DEMO-${Date.now()}-${i}`,
            caseId: patientCase.id,
            patientId: patient.id,
            grossAmount: fee,
            netAmount: fee,
            paidAmount: isPaid ? fee : 0,
            balanceAmount: isPaid ? 0 : fee,
            paymentStatus: isPaid ? 'PAID' : 'PENDING',
            paymentMode: isPaid ? 'CASH' : null,
            branchId,
            items: {
              create: [{
                serviceName: 'Consultation Fee',
                quantity: 1,
                unitPrice: fee,
                totalPrice: fee,
                branchId,
              }]
            }
          }
        });
      }

      created++;
      console.log(`  ✓ [${status.padEnd(12)}] ${firstName} ${lastName} → ${doctor.name} | Token: ${tokenDisplay}`);
    } catch (err: any) {
      console.warn(`  ⚠ Skipped ${firstName} ${lastName}: ${err.message?.slice(0, 80)}`);
    }
  }

  console.log(`\n✅ Queue seed complete! Created ${created}/15 patients in today's queue.`);
  console.log(`   → Visit http://localhost:3000/reception/dashboard to see the live queue.`);
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
