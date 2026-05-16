import { PrismaClient, Role, CaseStage, QueueStatus, QueueType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Master Database Reset & Seed...');

  // 0. Clear Database (Reverse order of dependencies)
  console.log('Cleaning existing data...');
  await prisma.auditLog.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.queueHistory.deleteMany();
  await prisma.queueCall.deleteMany();
  await prisma.queueEntry.deleteMany();
  await prisma.billPayment.deleteMany();
  await prisma.billItem.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.prescriptionItem.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.investigationOrder.deleteMany();
  await prisma.patientVitals.deleteMany();
  await prisma.patientCase.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctorProfile.deleteMany();
  await prisma.nurseProfile.deleteMany();
  await prisma.medicalProfile.deleteMany();
  await prisma.adminProfile.deleteMany();
  await prisma.receptionProfile.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('123456', 10);

  // 1. Create Users & Profiles
  console.log('Creating fresh users and profiles...');

  // Admin
  await prisma.user.upsert({
    where: { email: 'admin@clinic.com' },
    update: {
      isActive: true,
      failedLoginAttempts: 0,
      lockedUntil: null,
      password: password,
    },
    create: {
      name: 'System Admin',
      email: 'admin@clinic.com',
      password: password,
      role: Role.ADMIN,
      adminProfile: { create: { notes: 'Global System Administrator' } },
    },
  });

  // Reception
  await prisma.user.upsert({
    where: { email: 'reception@clinic.com' },
    update: {
      isActive: true,
      failedLoginAttempts: 0,
      lockedUntil: null,
      password: password,
    },
    create: {
      name: 'Riya Patel',
      email: 'reception@clinic.com',
      password: password,
      role: Role.RECEPTION,
      mobile: '+91 9876543210',
      receptionProfile: { create: { salary: 25000, overtimeRate: 150 } },
    },
  });

  // Doctors
  const drShah = await prisma.user.upsert({
    where: { email: 'doctor.shah@clinic.com' },
    update: {},
    create: {
      name: 'Dr. Arvind Shah',
      email: 'doctor.shah@clinic.com',
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
    where: { email: 'doctor.mehta@clinic.com' },
    update: {},
    create: {
      name: 'Dr. Sneha Mehta',
      email: 'doctor.mehta@clinic.com',
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
    where: { email: 'nurse.jane@clinic.com' },
    update: {},
    create: {
      name: 'Nurse Jane Doe',
      email: 'nurse.jane@clinic.com',
      password: password,
      role: Role.NURSING,
      nurseProfile: { create: { department: 'OPD', salary: 30000, overtimeRate: 200 } },
    },
  });

  // Generic Doctor for testing
  await prisma.user.upsert({
    where: { email: 'doctor@clinic.com' },
    update: {},
    create: {
      name: 'Dr. Test User',
      email: 'doctor@clinic.com',
      password: password,
      role: Role.DOCTOR,
      doctorProfile: {
        create: {
          specialization: 'General Practice',
          consultationFee: 300,
          licenseNumber: 'GMC-TEST',
          availableDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
          morningStart: '08:00',
          morningEnd: '20:00',
        },
      },
    },
  });

  // Pharmacist/Medical
  await prisma.user.upsert({
    where: { email: 'medical@clinic.com' },
    update: {},
    create: {
      name: 'Pharmacist John',
      email: 'medical@clinic.com',
      password: password,
      role: Role.MEDICAL,
      mobile: '+91 8888888888',
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

  // 4. Create Lab Masters
  console.log('Creating lab masters...');
  const hematology = await prisma.labCategory.upsert({
    where: { name: 'HEMATOLOGY' },
    update: {},
    create: {
      name: 'HEMATOLOGY',
      parameters: {
        create: [
          { name: 'Complete Blood Count (CBC)', code: 'CBC', basePrice: 450 },
          { name: 'Hemoglobin (Hb)', code: 'HB', basePrice: 150 },
          { name: 'ESR', code: 'ESR', basePrice: 100 },
        ]
      }
    }
  });

  const biochemistry = await prisma.labCategory.upsert({
    where: { name: 'BIOCHEMISTRY' },
    update: {},
    create: {
      name: 'BIOCHEMISTRY',
      parameters: {
        create: [
          { name: 'Liver Function Test (LFT)', code: 'LFT', basePrice: 850 },
          { name: 'Kidney Function Test (KFT)', code: 'KFT', basePrice: 750 },
          { name: 'Blood Sugar (Fasting)', code: 'BSF', basePrice: 120 },
          { name: 'Lipid Profile', code: 'LIPID', basePrice: 1200 },
        ]
      }
    }
  });

  const radiology = await prisma.labCategory.upsert({
    where: { name: 'RADIOLOGY' },
    update: {},
    create: {
      name: 'RADIOLOGY',
      parameters: {
        create: [
          { name: 'Chest X-Ray PA View', code: 'XRAY-CHEST', basePrice: 600 },
          { name: 'USG Abdomen', code: 'USG-ABD', basePrice: 1500 },
        ]
      }
    }
  });
  
  // 5. Create Procedure Masters
  console.log('Creating procedure masters...');
  const procedures = [
    { name: 'Wound Dressing (Minor)', category: 'GENERAL', code: 'PROC-WD-01', basePrice: 200, estimatedDuration: 15 },
    { name: 'Wound Dressing (Major)', category: 'GENERAL', code: 'PROC-WD-02', basePrice: 500, estimatedDuration: 30 },
    { name: 'Suturing (Small)', category: 'MINOR_SURGERY', code: 'PROC-SUT-01', basePrice: 1200, estimatedDuration: 20 },
    { name: 'Incision & Drainage', category: 'MINOR_SURGERY', code: 'PROC-ID', basePrice: 2500, estimatedDuration: 45 },
    { name: 'Nebulization', category: 'RESPIRATORY', code: 'PROC-NEB', basePrice: 150, estimatedDuration: 15 },
    { name: 'ECG', category: 'DIAGNOSTIC', code: 'PROC-ECG', basePrice: 350, estimatedDuration: 10 },
  ];

  for (const proc of procedures) {
    await prisma.procedure.upsert({
      where: { code: proc.code },
      update: proc,
      create: proc
    });
  }

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

