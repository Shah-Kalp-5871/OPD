import { PrismaClient, Role, CaseStage, QueueStatus, QueueType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  const password = await bcrypt.hash('password123', 10);

  // 1. Create Users & Profiles
  console.log('Creating users and profiles...');

  // Admin
  await prisma.user.upsert({
    where: { email: 'admin@opd.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@opd.com',
      password: password,
      role: Role.ADMIN,
      adminProfile: { create: { notes: 'Global System Administrator' } },
    },
  });

  // Reception
  await prisma.user.upsert({
    where: { email: 'reception@opd.com' },
    update: {},
    create: {
      name: 'Riya Patel',
      email: 'reception@opd.com',
      password: password,
      role: Role.RECEPTION,
      mobile: '+91 9876543210',
      receptionProfile: { create: { salary: 25000, overtimeRate: 150 } },
    },

  });

  // Doctors
  const drShah = await prisma.user.upsert({
    where: { email: 'doctor.shah@opd.com' },
    update: {},
    create: {
      name: 'Dr. Arvind Shah',
      email: 'doctor.shah@opd.com',
      password: password,
      role: Role.DOCTOR,
      doctorProfile: {
        create: {
          specialization: 'General Physician',
          consultationFee: 500,
          licenseNumber: 'GMC-12345',
          availableDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'],
          morningStart: '09:00',
          morningEnd: '13:00',
          eveningStart: '17:00',
          eveningEnd: '21:00',
        },
      },
    },
  });

  const drMehta = await prisma.user.upsert({
    where: { email: 'doctor.mehta@opd.com' },
    update: {},
    create: {
      name: 'Dr. Sneha Mehta',
      email: 'doctor.mehta@opd.com',
      password: password,
      role: Role.DOCTOR,
      doctorProfile: {
        create: {
          specialization: 'Dermatologist',
          consultationFee: 800,
          licenseNumber: 'GMC-67890',
          availableDays: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
          morningStart: '10:00',
          morningEnd: '14:00',
        },
      },
    },
  });

  // Nurse
  await prisma.user.upsert({
    where: { email: 'nurse.jane@opd.com' },
    update: {},
    create: {
      name: 'Nurse Jane Doe',
      email: 'nurse.jane@opd.com',
      password: password,
      role: Role.NURSING,
      nurseProfile: { create: { department: 'OPD', salary: 30000, overtimeRate: 200 } },
    },
  });

  // Pharmacist/Medical
  await prisma.user.upsert({
    where: { email: 'pharmacist@opd.com' },
    update: {},
    create: {
      name: 'Rahul Sharma',
      email: 'pharmacist@opd.com',
      password: password,
      role: Role.MEDICAL,
      medicalProfile: { create: { isPharmacist: true, salary: 28000, overtimeRate: 180 } },
    },
  });

  // 2. Create Sample Patients
  console.log('Creating sample patients...');
  const patient1 = await prisma.patient.upsert({
    where: { mobile: '9876543210' },
    update: {},
    create: {
      mrdNumber: 'MRD-001',
      firstName: 'Rajesh',
      lastName: 'Kumar',
      mobile: '9876543210',
      gender: 'MALE',
      profileCompletionStatus: 100,
      profile: {
        create: {
          age: 45,
          bloodGroup: 'O+',
          address: '123, Lotus Valley',
          city: 'Mumbai',
          state: 'Maharashtra',
        },
      },
    },
  });

  const patient2 = await prisma.patient.upsert({
    where: { mobile: '9123456789' },
    update: {},
    create: {
      mrdNumber: 'MRD-002',
      firstName: 'Priya',
      lastName: 'Sharma',
      mobile: '9123456789',
      gender: 'FEMALE',
      profileCompletionStatus: 80,
      profile: {
        create: {
          age: 32,
          bloodGroup: 'B+',
          address: 'Apartment 4B, Green Heights',
          city: 'Pune',
          state: 'Maharashtra',
        },
      },
    },
  });

  // 3. Create Sample Cases
  console.log('Creating sample clinical cases...');
  
  // Active Case for Rajesh with Dr. Shah
  await prisma.patientCase.upsert({
    where: { caseNumber: 'CASE-2024-001' },
    update: {},
    create: {
      caseNumber: 'CASE-2024-001',
      patientId: patient1.id,
      doctorId: drShah.id,
      visitType: 'CONSULTATION',
      priority: 'NORMAL',
      complaint: 'Fever and cold since 2 days',
      status: 'OPEN',
      stage: CaseStage.NURSING,
      queueEntry: {
        create: {
          tokenDisplay: 'DR-SHAH-001',
          tokenNumber: 1,
          queueType: QueueType.OPD,
          status: QueueStatus.WAITING,
          patientId: patient1.id,
          doctorId: drShah.id,
        }
      }
    }
  });

  // Completed Case for Priya with Dr. Mehta
  const case2 = await prisma.patientCase.upsert({
    where: { caseNumber: 'CASE-2024-002' },
    update: {},
    create: {
      caseNumber: 'CASE-2024-002',
      patientId: patient2.id,
      doctorId: drMehta.id,
      visitType: 'CONSULTATION',
      priority: 'NORMAL',
      complaint: 'Skin rash on arm',
      status: 'CLOSED',
      stage: CaseStage.COMPLETED,
    }
  });

  // Add a bill for the completed case
  await prisma.bill.upsert({
    where: { caseId: case2.id },
    update: {},
    create: {
      billNumber: 'BILL-2024-001',
      caseId: case2.id,
      patientId: patient2.id,
      grossAmount: 800,
      netAmount: 800,
      paidAmount: 800,
      balanceAmount: 0,
      paymentStatus: 'PAID',
      paymentMode: 'CASH',
      items: {
        create: [
          {
            serviceName: 'Consultation Fee',
            quantity: 1,
            unitPrice: 800,
            totalPrice: 800,
          }
        ]
      }
    }
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

