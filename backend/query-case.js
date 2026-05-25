const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const caseId = '3cc89870-3df5-4e5b-9611-5efaf82a3391';
  
  console.log('Querying patientCase table for caseId:', caseId);
  try {
    const caseRecord = await prisma.patientCase.findUnique({
      where: { id: caseId }
    });
    console.log('patientCase Record:', caseRecord);

    const consultationRecords = await prisma.consultationRecord.findMany({
      where: { caseId }
    });
    console.log('Consultation Records by caseId:', consultationRecords);

    const allConsultations = await prisma.consultationRecord.findMany({
      take: 5
    });
    console.log('First 5 Consultation Records in DB:', allConsultations);

  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
