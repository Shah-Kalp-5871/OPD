const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany({
    select: {
      email: true,
      role: true,
      name: true
    }
  });
  console.log('--- USERS ---');
  console.table(users);
  
  const cases = await prisma.patientCase.findMany({
    include: {
      patient: true
    }
  });
  console.log('--- CASES ---');
  cases.forEach(c => {
    console.log(`Case: ${c.caseNumber}, Stage: ${c.stage}, Patient: ${c.patient.firstName}`);
  });
}

check().then(() => prisma.$disconnect());
