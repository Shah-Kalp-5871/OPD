import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  InvestigationOrder,
  LabParameter,
  CaseStage,
  QueueStatus,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EventsService } from '../common/events.service';
import { BillingService } from '../billing/billing.service';
import {
  CreateInvestigationOrderDto,
  PrescriptionItemDto,
  CreateProcedureSessionDto,
  UpdateConsultationDto,
} from './dto/consultation.dto';
import { FileStorageService } from '../common/file-storage/file-storage.service';

@Injectable()
export class ConsultationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsService,
    private readonly billing: BillingService,
    private readonly fileStorage: FileStorageService,
  ) {}

  async processInvestigationUpload(
    orderId: string,
    file: Express.Multer.File,
    userId: string,
    branchId: string,
  ) {
    const savedFile = await this.fileStorage.saveFile(file, 'lab', userId);

    return this.uploadInvestigationFile(
      orderId,
      savedFile.originalName,
      savedFile.size.toString(),
      userId,
      savedFile.mimeType,
      savedFile.path,
      savedFile.sha256Hash,
      savedFile.url,
      branchId,
    );
  }

  async getOrCreateConsultation(
    caseId: string,
    userId: string,
    branchId: string,
  ) {
    const patientCase = await this.prisma.patientCase.findFirst({
      where: { id: caseId, branchId },
    });

    if (!patientCase) {
      throw new NotFoundException(`Patient Case with ID ${caseId} not found`);
    }

    return this.prisma.$transaction(async (tx) => {
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

      if (!consultation) {
        const activeSession = await tx.visitSession.findFirst({
          where: { caseId, status: 'ACTIVE', branchId },
        });

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
      }

      return consultation;
    });
  }

  async getLabMasters() {
    return this.prisma.labCategory.findMany({
      include: {
        parameters: {
          where: { isActive: true },
        },
      },
    });
  }

  async createInvestigationOrders(
    caseId: string,
    orders: CreateInvestigationOrderDto[],
    doctorId: string,
    branchId: string,
  ) {
    if (!orders || orders.length === 0) {
      throw new BadRequestException('Investigation orders cannot be empty');
    }

    const consultation = await this.prisma.consultationRecord.findUnique({
      where: { caseId },
    });
    if (consultation?.isFinalized) {
      throw new BadRequestException(
        'Cannot add investigations to finalized consultation',
      );
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const createdOrders: any[] = [];
      for (const order of orders) {
        const created = await tx.investigationOrder.create({
          data: {
            patientCase: { connect: { id: caseId } },
            doctorId: doctorId,
            branch: { connect: { id: branchId } },
            status: 'ORDERED',
            priority: order.urgent ? 'URGENT' : 'NORMAL',
            results: {
              create: {
                parameter: { connect: { id: order.id } },
                enteredById: doctorId,
                branch: { connect: { id: branchId } },
              },
            },
          },
          include: {
            results: {
              include: {
                parameter: true,
              },
            },
          },
        });
        createdOrders.push(created);
      }

      const patientCase = await tx.patientCase.findUnique({
        where: { id: caseId },
        select: { patientId: true },
      });
      if (!patientCase) throw new NotFoundException('Patient case not found');

      const bill = await this.billing.ensureActiveBill(
        caseId,
        patientCase.patientId,
        doctorId,
        branchId,
        tx,
      );

      await this.billing.addItemsToBill(
        bill.id,
        createdOrders.map((order) => ({
          serviceName: order.results[0].parameter.name,
          quantity: 1,
          unitPrice: order.results[0].parameter.basePrice,
          discount: 0,
          itemType: 'LAB',
          referenceId: order.id,
        })),
        branchId,
        tx,
      );

      await tx.auditLog.create({
        data: {
          userId: doctorId,
          entityType: 'INVESTIGATION_ORDER',
          entityId: caseId,
          action: 'CREATE_BATCH',
          details: `Doctor ordered ${createdOrders.length} investigations for Case ${caseId}`,
        },
      });

      return createdOrders;
    });

    this.events.emitBillingUpdate({
      type: 'BILL_UPDATED',
      caseId,
      source: 'INVESTIGATION',
    });

    return result;
  }

  async getDrugs() {
    return this.prisma.drug.findMany({
      where: { isActive: true },
      include: {
        inventory: true,
      },
    });
  }

  async createPrescription(
    caseId: string,
    items: PrescriptionItemDto[],
    notes: string,
    doctorId: string,
    branchId: string,
  ) {
    if (!items || items.length === 0) {
      throw new BadRequestException('Prescription items cannot be empty');
    }

    const consultation = await this.prisma.consultationRecord.findFirst({
      where: { caseId, branchId },
    });
    if (consultation?.isFinalized) {
      throw new BadRequestException(
        'Cannot add prescription to finalized consultation',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const prescription = await tx.prescription.create({
        data: {
          caseId,
          doctorId,
          branchId,
          notes,
          status: 'ACTIVE',
          items: {
            create: items.map((item) => ({
              drugId: item.drugId,
              drugName: item.drugName,
              dosage: item.dosage,
              frequency: item.frequency,
              duration: item.duration,
              instructions: item.instructions,
              branch: { connect: { id: branchId } },
            })),
          },
        },
        include: {
          items: true,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: doctorId,
          entityType: 'PRESCRIPTION',
          entityId: prescription.id,
          action: 'CREATE',
          details: `Doctor created prescription with ${items.length} items for Case ${caseId}`,
        },
      });

      return prescription;
    });
  }

  async getProcedures() {
    return this.prisma.procedure.findMany({
      where: { isActive: true },
      include: { consumableTemplates: true },
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async createProcedureSession(
    caseId: string,
    procedureId: string,
    notes: string,
    doctorId: string,
    branchId: string,
  ) {
    const consultation = await this.prisma.consultationRecord.findFirst({
      where: { caseId, branchId },
    });
    if (consultation?.isFinalized) {
      throw new BadRequestException(
        'Cannot add procedures to finalized consultation',
      );
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const session = await tx.procedureSession.create({
        data: {
          caseId,
          procedureId,
          doctorId,
          branchId,
          status: 'SCHEDULED',
          notes,
        },
        include: { procedure: true },
      });

      const patientCase = await tx.patientCase.findUnique({
        where: { id: caseId },
        select: { patientId: true },
      });
      if (!patientCase) throw new NotFoundException('Patient case not found');

      const bill = await this.billing.ensureActiveBill(
        caseId,
        patientCase.patientId,
        doctorId,
        branchId,
        tx,
      );

      await this.billing.addItemsToBill(
        bill.id,
        [
          {
            serviceName: session.procedure.name,
            quantity: 1,
            unitPrice: session.procedure.basePrice,
            discount: 0,
            itemType: 'PROCEDURE',
            referenceId: session.id,
            procedureSessionId: session.id,
          },
        ],
        branchId,
        tx,
      );

      await tx.auditLog.create({
        data: {
          userId: doctorId,
          entityType: 'PROCEDURE_SESSION',
          entityId: session.id,
          action: 'CREATE',
          details: `Doctor scheduled procedure ${session.procedure.name} for Case ${caseId}`,
        },
      });

      return session;
    });

    this.events.emitBillingUpdate({
      type: 'BILL_UPDATED',
      caseId,
      source: 'PROCEDURE',
    });

    return result;
  }

  async getClinicalImages(caseId: string, branchId: string) {
    return this.prisma.clinicalImage.findMany({
      where: { caseId, patientCase: { branchId } },
      include: { uploadedBy: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async saveClinicalImageWithFile(
    caseId: string,
    file: Express.Multer.File,
    tag: string | undefined,
    notes: string | undefined,
    userId: string,
    branchId: string,
  ) {
    const consultation = await this.prisma.consultationRecord.findFirst({
      where: { caseId, case: { branchId } },
    });
    if (consultation?.isFinalized) {
      throw new BadRequestException(
        'Cannot upload images to finalized consultation',
      );
    }

    const savedFile = await this.fileStorage.saveFile(file, 'clinical', userId);

    return this.prisma.clinicalImage.create({
      data: {
        caseId,
        fileName: savedFile.originalName,
        tag,
        notes,
        uploadedById: userId,
        imageUrl: savedFile.url,
        mimeType: savedFile.mimeType,
        storedPath: savedFile.path,
        sha256Hash: savedFile.sha256Hash,
        branchId,
      },
    });
  }
  async finalizeConsultation(
    caseId: string,
    doctorId: string,
    nextStage: CaseStage,
    branchId: string,
  ) {
    const currentConsultation = await this.prisma.consultationRecord.findFirst({
      where: { caseId, case: { branchId } },
      include: { complaint: true },
    });

    if (!currentConsultation)
      throw new NotFoundException('Consultation not found');
    if (currentConsultation.isFinalized)
      throw new BadRequestException('Consultation is already finalized');

    // Validation for required data
    if (
      !currentConsultation.finalDiagnosis &&
      !currentConsultation.provisionalDiagnosis &&
      !currentConsultation.complaint?.chiefComplaint
    ) {
      throw new BadRequestException(
        'Cannot finalize consultation without at least a diagnosis or chief complaint',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const consultation = await tx.consultationRecord.update({
        where: { caseId },
        data: {
          isFinalized: true,
          finalizedAt: new Date(),
          finalizedById: doctorId,
          status: 'FINALIZED',
          statusEnum: 'SIGNED',
        },
      });

      await tx.patientCase.update({
        where: { id: caseId },
        data: {
          status: nextStage === 'COMPLETED' ? 'CLOSED' : 'OPEN',
          stage: nextStage,
          updatedAt: new Date(),
        },
      });

      const entry = await tx.queueEntry.findFirst({
        where: { caseId, branchId },
      });
      if (entry) {
        let finalQueueStatus: QueueStatus = 'COMPLETED';
        if (nextStage === 'BILLING') finalQueueStatus = 'BILLING_PENDING';
        if (nextStage === 'PHARMACY') finalQueueStatus = 'PHARMACY_PENDING';

        await tx.queueEntry.update({
          where: { caseId },
          data: { status: finalQueueStatus, updatedAt: new Date() },
        });

        await tx.queueHistory.create({
          data: {
            queueEntryId: entry.id,
            action: `CLINICAL_FINALIZE_TO_${nextStage}`,
            fromStatus: entry.status,
            toStatus: finalQueueStatus,
            performedById: doctorId,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          userId: doctorId,
          entityType: 'CONSULTATION',
          entityId: consultation.id,
          action: 'FINALIZE',
          details: `Doctor finalized consultation for Case ${caseId}. Patient moved to ${nextStage}.`,
        },
      });

      this.events.emitQueueUpdate({
        type: 'CASE_COMPLETED',
        caseId,
        nextStage: nextStage as string,
        message: `Consultation finalized. Patient moved to ${nextStage}.`,
      });

      return consultation;
    });
  }
  async updateConsultation(
    caseId: string,
    dto: UpdateConsultationDto,
    userId: string,
    branchId: string,
  ) {
    const consultation = await this.prisma.consultationRecord.findFirst({
      where: { caseId, case: { branchId } },
    });

    if (!consultation) throw new NotFoundException('Consultation not found');
    if (consultation.isFinalized)
      throw new BadRequestException('Cannot update finalized consultation');

    const {
      complaint,
      history,
      provisionalDiagnosis,
      finalDiagnosis,
      treatmentPlan,
      advice,
      nextVisitDate,
    } = dto;

    return this.prisma.$transaction(async (tx) => {
      if (complaint) {
        await tx.complaintEntry.update({
          where: { consultationId: consultation.id },
          data: {
            chiefComplaint: complaint.chiefComplaint,
            duration: complaint.duration,
            durationType: complaint.durationType,
            severity: complaint.severity,
            onset: complaint.onset,
            aggravatingFactors: complaint.aggravatingFactors,
            relievingFactors: complaint.relievingFactors,
            presentIllness: complaint.presentIllness,
            updatedAt: new Date(),
          },
        });
      }

      if (history) {
        await tx.clinicalHistory.update({
          where: { consultationId: consultation.id },
          data: {
            pastHistory: history.pastHistory,
            personalHistory: history.personalHistory,
            surgicalHistory: history.surgicalHistory,
            familyHistory: history.familyHistory,
            obstetricHistory: history.obstetricHistory,
            allergies: history.allergies,
            chronicDiseases: history.chronicDiseases,
            updatedAt: new Date(),
          },
        });
      }

      const result = await tx.consultationRecord.update({
        where: { id: consultation.id },
        data: {
          provisionalDiagnosis,
          finalDiagnosis,
          treatmentPlan,
          advice,
          nextVisitDate: nextVisitDate ? new Date(nextVisitDate) : null,
          updatedById: userId,
          updatedAt: new Date(),
        },
        include: { complaint: true, history: true },
      });

      await tx.auditLog.create({
        data: {
          userId,
          entityType: 'CONSULTATION',
          entityId: consultation.id,
          action: 'UPDATE',
          details: `User updated consultation data (Diagnosis/Advice/History)`,
        },
      });

      return result;
    });
  }

  async getInvestigationOrders(caseId: string, branchId: string) {
    return this.prisma.investigationOrder.findMany({
      where: { caseId, branchId },
      include: {
        results: { include: { parameter: true } },
        files: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getInvestigationOrderById(orderId: string, branchId: string) {
    const order = await this.prisma.investigationOrder.findFirst({
      where: { id: orderId, branchId },
      include: {
        results: {
          include: {
            parameter: {
              include: {
                category: true,
                referenceRanges: true,
              },
            },
          },
        },
        files: {
          include: {
            uploadedBy: {
              select: { name: true },
            },
          },
        },
        patientCase: {
          include: {
            patient: {
              include: {
                profile: true,
              },
            },
            doctor: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(
        `Investigation Order with ID ${orderId} not found`,
      );
    }

    return order;
  }

  async uploadInvestigationFile(
    orderId: string,
    fileName: string,
    fileSize: string | null,
    userId: string,
    mimeType: string,
    storedPath: string,
    sha256Hash: string,
    fileUrl: string,
    branchId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const file = await tx.investigationFile.create({
        data: {
          orderId,
          fileUrl,
          fileName,
          fileSize,
          mimeType,
          storedPath,
          sha256Hash,
          uploadedById: userId,
          branchId,
        },
      });

      const order = await tx.investigationOrder.findFirst({
        where: { id: orderId, branchId },
      });
      if (order && order.status === 'ORDERED') {
        await tx.investigationOrder.update({
          where: { id: orderId },
          data: { status: 'RESULT_READY', updatedAt: new Date() },
        });
      }

      await tx.auditLog.create({
        data: {
          userId,
          entityType: 'INVESTIGATION_FILE',
          entityId: orderId,
          action: 'UPLOAD',
          details: `User uploaded file ${fileName} for Investigation Order ${orderId}`,
        },
      });

      return file;
    });
  }
}
