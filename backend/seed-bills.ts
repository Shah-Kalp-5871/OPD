import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
  // Get an existing branch
  const branch = await prisma.branch.findFirst();
  if (!branch) throw new Error("No branch found");

  // Get some patients or create one
  let patient = await prisma.patient.findFirst();
  if (!patient) throw new Error("No patient found");

  // Get a doctor
  let doctor = await prisma.user.findFirst({ where: { role: 'DOCTOR' }});
  if (!doctor) doctor = await prisma.user.findFirst();

  for (let i = 1; i <= 5; i++) {
    const caseId = `dummy-case-${Date.now()}-${i}`;
    const pCase = await prisma.patientCase.create({
      data: {
        id: caseId,
        caseNumber: `C${Math.floor(Math.random()*900)+100}-${Math.floor(Math.random()*900)+100}-` + i,
        patientId: patient.id,
        doctorId: doctor!.id,
        branchId: branch.id,
        visitType: 'CONSULTATION',
        priority: 'NORMAL',
        complaint: 'Fever and headache',
        status: 'OPEN',
        stage: 'BILLING',
        visitDate: new Date(),
      }
    });

    const netAmount = 500 + i * 100;

    await prisma.bill.create({
      data: {
        billNumber: `BILL-${Date.now()}-${i}`,
        caseId: pCase.id,
        patientId: patient.id,
        grossAmount: netAmount,
        discountTotal: 0,
        netAmount: netAmount,
        paidAmount: 0,
        balanceAmount: netAmount,
        paymentStatusEnum: 'PENDING',
        branchId: branch.id,
        items: {
          create: [
            {
              serviceName: 'Consultation Fee',
              quantity: 1,
              unitPrice: netAmount,
              totalPrice: netAmount,
              branchId: branch.id
            }
          ]
        }
      }
    });
    console.log(`Created bill ${i}`);
  }
}
seed().then(() => {
  console.log('Seeded bills successfully');
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
