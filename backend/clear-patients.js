"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    try {
        await prisma.queueHistory.deleteMany();
        await prisma.queueCall.deleteMany();
        await prisma.queueEntry.deleteMany();
        await prisma.appointment.deleteMany();
        
        // Some tables might not exist or might fail if we don't handle relations
        // For testing, let's just use deleteMany on related records first
        if (prisma.prescription) await prisma.prescription.deleteMany();
        if (prisma.vitals) await prisma.vitals.deleteMany();
        if (prisma.visitComplaint) await prisma.visitComplaint.deleteMany();
        if (prisma.bill) await prisma.bill.deleteMany();
        
        await prisma.patientCase.deleteMany();
        
        // Finally delete the patients
        await prisma.patient.deleteMany();
        console.log('Successfully cleared all patients and their related records');
    } catch (e) {
        console.error('Error clearing patients:', e);
    }
}
main().finally(() => prisma.$disconnect());
