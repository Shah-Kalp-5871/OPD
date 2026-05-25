import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const updatedBill = await prisma.bill.update({
    where: { id: '4177702b-3df1-4844-af21-f34fef9b84ee' },
    data: {
      paidAmount: 0,
      balanceAmount: 800,
      paymentStatus: 'PENDING',
      paymentMode: null
    }
  });
  console.log('Successfully reverted bill to PENDING (Due) state:');
  console.log(updatedBill);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
