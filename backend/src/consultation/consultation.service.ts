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

  async getPatientLabHistory(caseId: string, branchId: string) {
    const patientCase = await this.prisma.patientCase.findUnique({
      where: { id: caseId, branchId },
      select: { patientId: true }
    });

    if (!patientCase) {
      throw new NotFoundException('Patient case not found');
    }

    // Get all completed lab results for this patient, ordered by date descending
    const history = await this.prisma.investigationOrder.findMany({
      where: {
        patientCase: { patientId: patientCase.patientId },
        status: { in: ['COMPLETED', 'RESULT_READY'] },
        results: { some: {} }
      },
      include: {
        results: {
          include: {
            parameter: true
          }
        },
        files: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return history;
  }

  async saveInvestigationResults(
    orderId: string,
    resultsData: { parameterId: string, value: string, notes?: string }[],
    userId: string,
    branchId: string,
  ) {
    const order = await this.prisma.investigationOrder.findFirst({
      where: { id: orderId, patientCase: { branchId } }
    });

    if (!order) {
      throw new NotFoundException('Investigation order not found');
    }

    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      // Create/update results for this order
      for (const res of resultsData) {
        const numVal = !isNaN(Number(res.value)) && res.value.trim() !== '' ? Number(res.value) : null;
        
        const existing = await tx.investigationResult.findFirst({
          where: { orderId, parameterId: res.parameterId }
        });
        if (existing) {
          await tx.investigationResult.update({
            where: { id: existing.id },
            data: { 
              numericValue: numVal, 
              textValue: numVal === null ? res.value : null,
              notes: res.notes 
            }
          });
        } else {
          await tx.investigationResult.create({
            data: {
              orderId,
              parameterId: res.parameterId,
              numericValue: numVal,
              textValue: numVal === null ? res.value : null,
              notes: res.notes,
              enteredById: userId,
              branchId: branchId,
            }
          });
        }
      }

      // Mark the order as completed
      const updated = await tx.investigationOrder.update({
        where: { id: orderId },
        data: { status: 'COMPLETED', resultEntryTime: new Date() },
        include: {
          results: {
            include: { parameter: true }
          }
        }
      });

      return updated;
    });

    return updatedOrder;
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
              visitComplaint: true,
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
                visitComplaint: true,
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

  async getPendingInvestigations(branchId: string) {
    return this.prisma.investigationOrder.findMany({
      where: {
        status: { not: 'RESULT_READY' },
        patientCase: { branchId },
      },
      include: {
        results: { include: { parameter: true } },
        patientCase: {
          include: { patient: { include: { profile: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
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
              simpleDrugId: item.simpleDrugId,
              drugName: item.drugName,
              isSimpleDrug: item.isSimpleDrug || false,
              isManualDrug: item.isManualDrug || false,
              dosage: item.dosage,
              frequency: item.frequency,
              duration: item.duration,
              totalQuantity: item.totalQuantity || 1,
              unitCost: item.unitCost || 0,
              route: item.route,
              instructions: item.instructions,
              slotNo: item.slotNo,
              isDispensed: false,
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

      // Stock check warnings
      const warnings: string[] = [];
      for (const item of items) {
        if (item.drugId && !item.isSimpleDrug && !item.isManualDrug) {
          const inventory = await tx.drugInventory.findUnique({
            where: { drugId_branchId: { drugId: item.drugId, branchId } },
          });
          const totalStock = inventory?.totalStock || 0;
          if (totalStock < (item.totalQuantity || 1)) {
            warnings.push(`Drug ${item.drugName} is out of stock (Requested: ${item.totalQuantity || 1}, Available: ${totalStock})`);
          }
        } else if (item.simpleDrugId && item.isSimpleDrug) {
          const simpleDrug = await tx.simpleDrug.findUnique({
            where: { id: item.simpleDrugId },
          });
          const stock = simpleDrug?.stockQuantity || 0;
          if (stock < (item.totalQuantity || 1)) {
            warnings.push(`Simple Drug ${item.drugName} is out of stock (Requested: ${item.totalQuantity || 1}, Available: ${stock})`);
          }
        }
      }

      return { ...prescription, warnings };
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
    scheduledDate: string | undefined,
    scheduledTime: string | undefined,
    sessions: number | undefined,
    isCompletedByDoctor: boolean | undefined,
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
      const actualSessions = sessions || 1;
      let status: any = 'SCHEDULED';
      
      // Check if requires consent and consent not yet done (this is a simplified check, adjust if needed)
      // Usually if the bill is > 5000, we mark as APPROVAL_PENDING.
      const procedure = await tx.procedure.findUnique({ where: { id: procedureId } });
      const estCost = (Number(procedure?.basePrice) || 0) * actualSessions;
      
      if (estCost > 5000) {
        status = 'APPROVAL_PENDING';
      }
      
      if (isCompletedByDoctor) {
        status = 'COMPLETED';
      }
      
      const sessionDate = scheduledDate ? new Date(`${scheduledDate}T${scheduledTime || '00:00:00'}`) : null;

      const session = await tx.procedureSession.create({
        data: {
          caseId,
          procedureId,
          doctorId,
          branchId,
          status,
          notes,
          ...(isCompletedByDoctor ? { startTime: new Date(), endTime: new Date() } : {}),
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
            quantity: actualSessions,
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
    discountPercentage?: number,
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

      if (discountPercentage !== undefined && discountPercentage > 0) {
        const bill = await tx.bill.findFirst({
          where: { caseId },
          include: { items: true },
        });
        
        if (bill) {
          const grossAmount = bill.grossAmount.toNumber();
          const paidAmount = bill.paidAmount.toNumber();
          const discountTotal = (grossAmount * discountPercentage) / 100;
          const netAmount = grossAmount - discountTotal;
          const balanceAmount = netAmount - paidAmount;
          
          let paymentStatusEnum = bill.paymentStatusEnum;
          if (balanceAmount < 0) {
            paymentStatusEnum = 'REFUND_DUE' as any;
          } else if (balanceAmount === 0 && netAmount > 0) {
            paymentStatusEnum = 'PAID';
          }

          await tx.bill.update({
            where: { id: bill.id },
            data: {
              discountTotal,
              netAmount,
              balanceAmount,
              paymentStatusEnum,
              paymentStatus: paymentStatusEnum,
            },
          });
        }
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
      differentialDiagnosis,
      finalDiagnosis,
      treatmentPlan,
      advice,
      nextVisitDate,
      vitals,
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
            currentMedications: history.currentMedications,
            updatedAt: new Date(),
          },
        });
        
        // Update nursing notes and patient feedback on VisitComplaint if present
        if (history.nursingNotes !== undefined || history.patientFeedback !== undefined) {
          await tx.visitComplaint.upsert({
            where: { caseId: consultation.caseId },
            create: {
              caseId: consultation.caseId,
              nursingNotes: history.nursingNotes || '',
              patientFeedback: history.patientFeedback || '',
            },
            update: {
              nursingNotes: history.nursingNotes !== undefined ? history.nursingNotes : undefined,
              patientFeedback: history.patientFeedback !== undefined ? history.patientFeedback : undefined,
            }
          });
        }
      }

      if (vitals) {
        const existingVitals = await tx.patientVitals.findFirst({
          where: { caseId: consultation.caseId },
          orderBy: { takenAt: 'desc' }
        });

        if (existingVitals) {
          await tx.patientVitals.update({
            where: { id: existingVitals.id },
            data: {
              height: vitals.height,
              weight: vitals.weight,
              bmi: vitals.bmi,
              bloodPressure: vitals.bloodPressure,
              pulse: vitals.pulse,
              temperature: vitals.temperature,
              spo2: vitals.spo2,
            }
          });
        } else {
          // fetch patientId
          const patientCase = await tx.patientCase.findUnique({ where: { id: consultation.caseId }});
          if (patientCase) {
             await tx.patientVitals.create({
               data: {
                 patientId: patientCase.patientId,
                 caseId: patientCase.id,
                 branchId: branchId,
                 takenById: userId,
                 height: vitals.height,
                 weight: vitals.weight,
                 bmi: vitals.bmi,
                 bloodPressure: vitals.bloodPressure,
                 pulse: vitals.pulse,
                 temperature: vitals.temperature,
                 spo2: vitals.spo2,
               }
             });
          }
        }
      }

      const result = await tx.consultationRecord.update({
        where: { id: consultation.id },
        data: {
          provisionalDiagnosis,
          differentialDiagnosis,
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

  async getPatientDocuments(caseId: string, branchId: string) {
    const patientCase = await this.prisma.patientCase.findFirst({
      where: { id: caseId, branchId },
    });
    if (!patientCase) {
      throw new NotFoundException(`Patient Case not found`);
    }

    return this.prisma.patientDocument.findMany({
      where: { patientId: patientCase.patientId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async uploadPatientDocument(
    caseId: string,
    file: Express.Multer.File,
    documentType: string | undefined,
    labName: string | undefined,
    reportDate: string | undefined,
    userId: string,
    branchId: string,
  ) {
    const patientCase = await this.prisma.patientCase.findFirst({
      where: { id: caseId, branchId },
    });
    if (!patientCase) {
      throw new NotFoundException(`Patient Case not found`);
    }

    const savedFile = await this.fileStorage.saveFile(file, 'lab', userId);

    return this.prisma.patientDocument.create({
      data: {
        patientId: patientCase.patientId,
        documentType: documentType || 'LAB_REPORT',
        labName,
        reportDate: reportDate ? new Date(reportDate) : new Date(),
        fileUrl: savedFile.url,
      },
    });
  }
}
