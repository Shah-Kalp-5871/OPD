const { tenancyStore } = require('./dist/modules/tenancy/tenancy.context');
const { PrismaService } = require('./dist/prisma/prisma.service');

async function main() {
  const prismaService = new PrismaService();
  await prismaService.onModuleInit();

  const caseId = '3cc89870-3df5-4e5b-9611-5efaf82a3391';
  const branchId = '484cf7fd-fe57-471b-b8d0-1b492887e735';
  const userId = '86dc100e-a67a-45dc-8325-d91717cf5af5'; // doctor user ID

  console.log('Running full getOrCreateConsultation simulation...');
  
  await tenancyStore.run({ tenantId: 'some-tenant', branchId: branchId }, async () => {
    try {
      const patientCase = await prismaService.patientCase.findFirst({
        where: { id: caseId, branchId },
      });

      if (!patientCase) {
        console.error(`Patient Case with ID ${caseId} not found in this branch!`);
        return;
      }
      console.log('Found Patient Case:', patientCase);

      const result = await prismaService.$transaction(async (tx) => {
        console.log('Beginning transaction...');
        let consultation = await tx.consultationRecord.findUnique({
          where: { caseId },
          include: {
            complaint: true,
            history: true,
            case: {
              include: {
                patient: {
                  include: {
                    profile: true,
                    vitals: {
                      orderBy: { takenAt: 'desc' },
                      take: 4,
                    },
                  },
                },
                investigationOrders: {
                  include: { results: { include: { parameter: true } } },
                },
                prescriptions: {
                  include: { items: { include: { drug: true } } },
                },
                procedureSessions: { include: { procedure: true } },
                clinicalImages: {
                  include: { uploadedBy: { select: { name: true } } },
                },
                doctor: { select: { name: true } },
              },
            },
            session: true,
          },
        });

        console.log('Initial findUnique query completed. Found consultation:', !!consultation);

        if (!consultation) {
          console.log('No consultation found, attempting to create one...');
          const activeSession = await tx.visitSession.findFirst({
            where: { caseId, status: 'ACTIVE', branchId },
          });
          console.log('Active session check completed. Found activeSession:', !!activeSession);

          consultation = await tx.consultationRecord.create({
            data: {
              case: { connect: { id: caseId } },
              doctor: { connect: { id: patientCase.doctorId || userId } },
              branch: { connect: { id: branchId } },
              session: activeSession
                ? { connect: { id: activeSession.id } }
                : undefined,
              status: 'DRAFT',
              complaint: { create: {} },
              history: { create: {} },
            },
            include: {
              complaint: true,
              history: true,
              case: {
                include: {
                  patient: {
                    include: {
                      profile: true,
                      vitals: {
                        orderBy: { takenAt: 'desc' },
                        take: 4,
                      },
                    },
                  },
                  investigationOrders: {
                    include: { results: { include: { parameter: true } } },
                  },
                  prescriptions: {
                    include: { items: { include: { drug: true } } },
                  },
                  procedureSessions: { include: { procedure: true } },
                  clinicalImages: {
                    include: { uploadedBy: { select: { name: true } } },
                  },
                  doctor: { select: { name: true } },
                },
              },
              session: true,
            },
          });
          console.log('Consultation record successfully created!');
        }

        return consultation;
      });

      console.log('Transaction Result:', JSON.stringify(result, null, 2));

    } catch (err) {
      console.error('ERROR CAPTURED DURING FULL SIMULATION:');
      console.error(err);
    }
  });

  await prismaService.onModuleDestroy();
}

main();
