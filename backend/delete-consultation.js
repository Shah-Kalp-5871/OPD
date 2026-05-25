const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const caseId = '3cc89870-3df5-4e5b-9611-5efaf82a3391';
  console.log('Deleting created consultation for case:', caseId);
  try {
    const deleted = await prisma.consultationRecord.deleteMany({
      where: { caseId }
    });
    console.log('Deleted records count:', deleted.count);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
