"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.queueHistory.deleteMany();
    await prisma.queueCall.deleteMany();
    await prisma.queueEntry.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.patientCase.deleteMany();
    console.log('Cleared appointments and queues');
}
main().finally(() => prisma.$disconnect());
//# sourceMappingURL=clear.js.map