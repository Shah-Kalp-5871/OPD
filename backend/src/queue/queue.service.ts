import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQueueEntryDto } from './dto/create-queue-entry.dto';
import {
  UpdateQueueStatusDto,
  UpdateCaseStageDto,
} from './dto/update-queue.dto';
import { CaseStage, Prisma, QueueStatus, QueueType } from '@prisma/client';
import { EventsService } from '../common/events.service';

@Injectable()
export class QueueService {
  constructor(
    private prisma: PrismaService,
    private events: EventsService,
  ) {}

  async createEntry(
    dto: CreateQueueEntryDto,
    userId: string,
    branchId: string,
  ) {
    if (!userId)
      throw new BadRequestException('User ID is required for check-in');

    return this.prisma.$transaction(
      (tx) => {
        return this.createEntryInTransaction(tx, dto, userId, branchId);
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  }

  async createEntryInTransaction(
    tx: Prisma.TransactionClient,
    dto: CreateQueueEntryDto,
    userId: string,
    branchId: string,
  ) {
    if (!userId)
      throw new BadRequestException('User ID is required for check-in');

    const { caseId, patientId, doctorId, queueType, priority } = dto;
    await this.lockTransactionKey(tx, `queue-case-${caseId}`);

    const patientCase = await tx.patientCase.findFirst({
      where: { id: caseId, branchId },
      include: { doctor: true },
    });
    if (!patientCase) throw new NotFoundException('Case not found');

    if (patientCase.patientId !== patientId) {
      throw new BadRequestException('Patient does not match the case');
    }

    const existing = await tx.queueEntry.findFirst({
      where: { caseId, branchId },
    });
    if (existing)
      throw new BadRequestException('Patient already in queue for this case');

    const queueTypeValue = queueType || QueueType.OPD;
    const token = await this.generateTokenDisplay(tx, queueTypeValue, branchId);

    const entry = await tx.queueEntry.create({
      data: {
        tokenDisplay: token.tokenDisplay,
        tokenNumber: token.tokenNumber,
        queueType: queueTypeValue,
        priority: priority || patientCase.priority,
        caseId,
        patientId,
        doctorId: doctorId || patientCase.doctorId,
        branchId,
      },
    });

    await tx.queueHistory.create({
      data: {
        queueEntry: { connect: { id: entry.id } },
        action: 'CHECK_IN',
        toStatus: QueueStatus.WAITING,
        performedBy: { connect: { id: userId } },
      },
    });

    await tx.patientCase.update({
      where: { id: caseId },
      data: { stage: CaseStage.NURSING },
    });

    return entry;
  }

  private async generateTokenDisplay(
    tx: Prisma.TransactionClient,
    type: QueueType,
    branchId: string,
  ): Promise<{ tokenDisplay: string; tokenNumber: number }> {
    const prefix = type.toUpperCase();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await this.lockTransactionKey(
      tx,
      `queue-token-${prefix}-${today.toISOString().slice(0, 10)}`,
    );

    const lastEntry = await tx.queueEntry.findFirst({
      orderBy: { tokenNumber: 'desc' },
      where: {
        queueType: type,
        branchId,
        checkInTime: { gte: today },
      },
    });
    let tokenNumber = (lastEntry?.tokenNumber || 0) + 1;
    let tokenDisplay = `${prefix}-${tokenNumber.toString().padStart(3, '0')}`;

    while (
      await tx.queueEntry.findFirst({ where: { tokenDisplay, branchId } })
    ) {
      tokenNumber += 1;
      tokenDisplay = `${prefix}-${tokenNumber.toString().padStart(3, '0')}`;
    }

    return {
      tokenDisplay,
      tokenNumber,
    };
  }

  private async lockTransactionKey(tx: Prisma.TransactionClient, key: string) {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${key}))`;
  }

  async updateStatus(
    id: string,
    dto: UpdateQueueStatusDto,
    userId: string,
    branchId: string,
  ) {
    const entry = await this.prisma.queueEntry.findFirst({
      where: { id, branchId },
    });
    if (!entry) throw new NotFoundException('Queue entry not found');

    return this.prisma.$transaction(async (tx) => {
      const result = await tx.queueEntry.update({
        where: { id },
        data: {
          status: dto.status,
          callCount: dto.status === 'CALLING' ? { increment: 1 } : undefined,
        },
        include: {
          patient: true,
          mr: true,
          doctor: true,
          case: true,
        },
      });

      await tx.queueHistory.create({
        data: {
          queueEntry: { connect: { id } },
          action: dto.action || 'STATUS_UPDATE',
          fromStatus: entry.status,
          toStatus: dto.status,
          performedBy: { connect: { id: userId } },
        },
      });

      // Emit real-time event
      this.events.emitQueueUpdate({
        type: 'STATUS_CHANGED',
        id: result.id,
        status: result.status,
        token: result.tokenDisplay,
        patientName: result.mrId ? `${result.mr?.firstName} ${result.mr?.lastName}` : `${result.patient?.firstName} ${result.patient?.lastName}`,
        room: result.doctor?.name
          ? 'Room ' + (result.doctor as any).roomNumber
          : 'TBD',
      });

      return result;
    });
  }

  async updateStage(
    caseId: string,
    dto: UpdateCaseStageDto,
    userId: string,
    branchId: string,
  ) {
    const entry = await this.prisma.queueEntry.findFirst({
      where: { caseId, branchId },
    });

    return this.prisma.$transaction(async (tx) => {
      const updatedCase = await tx.patientCase.update({
        where: { id: caseId },
        data: { stage: dto.stage },
      });

      if (entry) {
        await tx.queueHistory.create({
          data: {
            queueEntryId: entry.id,
            action: `STAGE_CHANGE_${dto.stage}`,
            toStatus: entry.status,
            performedById: userId,
          },
        });
      }

      return updatedCase;
    });
  }

  async startSession(
    caseId: string,
    doctorId: string,
    userId: string,
    branchId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // End any other active sessions for this doctor
      await tx.visitSession.updateMany({
        where: { doctorId, status: 'ACTIVE', branchId },
        data: { status: 'COMPLETED', endTime: new Date() },
      });

      const session = await tx.visitSession.create({
        data: { caseId, doctorId, branchId },
      });

      const entry = await tx.queueEntry.findFirst({
        where: { caseId, branchId },
        include: { patient: true, mr: true, doctor: true },
      });
      if (entry) {
        await tx.queueEntry.update({
          where: { caseId },
          data: { status: 'IN_SESSION' },
        });

        await tx.queueHistory.create({
          data: {
            queueEntry: { connect: { id: entry.id } },
            action: 'SESSION_START',
            fromStatus: entry.status,
            toStatus: 'IN_SESSION',
            performedBy: { connect: { id: userId } },
          },
        });

        // Emit real-time event
        this.events.emitQueueUpdate({
          type: 'SESSION_STARTED',
          id: entry.id,
          status: 'IN_SESSION',
          token: entry.tokenDisplay,
          patientName: entry.mrId ? `${entry.mr?.firstName} ${entry.mr?.lastName}` : `${entry.patient?.firstName} ${entry.patient?.lastName}`,
          doctorId: doctorId,
        });
      }

      await tx.patientCase.update({
        where: { id: caseId },
        data: { stage: 'DOCTOR' },
      });

      return session;
    });
  }

  async endSession(
    caseId: string,
    userId: string,
    nextStage: CaseStage,
    branchId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // 1. End active sessions for this case
      await tx.visitSession.updateMany({
        where: { caseId, status: 'ACTIVE', branchId },
        data: { status: 'COMPLETED', endTime: new Date() },
      });

      // 2. Update Queue Entry to BILLING_PENDING or COMPLETED
      const entry = await tx.queueEntry.findFirst({
        where: { caseId, branchId },
        include: { patient: true, mr: true },
      });

      let finalQueueStatus: QueueStatus = 'COMPLETED';
      if (nextStage === 'BILLING') finalQueueStatus = 'BILLING_PENDING';
      if (nextStage === 'PHARMACY') finalQueueStatus = 'PHARMACY_PENDING';

      if (entry) {
        await tx.queueEntry.update({
          where: { caseId },
          data: { status: finalQueueStatus },
        });

        await tx.queueHistory.create({
          data: {
            queueEntry: { connect: { id: entry.id } },
            action: `SESSION_END_TO_${nextStage}`,
            fromStatus: entry.status,
            toStatus: finalQueueStatus,
            performedBy: { connect: { id: userId } },
          },
        });

        // Emit real-time event
        this.events.emitQueueUpdate({
          type: 'SESSION_ENDED',
          id: entry.id,
          status: finalQueueStatus,
          token: entry.tokenDisplay,
          patientName: entry.mrId ? `${entry.mr?.firstName} ${entry.mr?.lastName}` : `${entry.patient?.firstName} ${entry.patient?.lastName}`,
          nextStage: nextStage,
        });
      }

      // 3. Update Patient Case Stage
      return tx.patientCase.update({
        where: { id: caseId },
        data: { stage: nextStage },
      });
    });
  }

  async getLiveQueue(branchId: string, doctorId?: string) {
    return this.prisma.queueEntry.findMany({
      where: {
        branchId,
        doctorId: doctorId || undefined,
        checkInTime: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        status: { not: 'CANCELLED' },
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            mrdNumber: true,
            gender: true,
            isFoc: true,
            _count: {
              select: {
                cases: true,
              },
            },
            profile: {
              select: {
                age: true,
                dob: true
              }
            }
          },
        },
        case: {
          select: {
            id: true,
            caseNumber: true,
            priority: true,
            visitType: true,
            stage: true,
            createdAt: true,
            bill: {
              select: {
                paymentStatus: true,
              },
            },
          },
        },
        mr: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            mobile: true,
            companyName: true,
          }
        },
        mrVisit: {
          select: {
            id: true,
            visitDate: true,
            status: true,
          }
        }
      },
      orderBy: [{ priority: 'desc' }, { tokenNumber: 'asc' }],
    });
  }

  async getStats(branchId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, checkedIn, waiting, completed, cancelled] = await Promise.all(
      [
        this.prisma.queueEntry.count({
          where: { checkInTime: { gte: today }, branchId },
        }),
        this.prisma.queueEntry.count({
          where: {
            checkInTime: { gte: today },
            branchId,
            status: { in: ['WAITING', 'IN_SESSION', 'CALLING'] },
          },
        }),
        this.prisma.queueEntry.count({
          where: {
            checkInTime: { gte: today },
            branchId,
            status: { in: ['WAITING', 'CALLING'] },
          },
        }),
        this.prisma.queueEntry.count({
          where: { checkInTime: { gte: today }, status: 'COMPLETED', branchId },
        }),
        this.prisma.queueEntry.count({
          where: { checkInTime: { gte: today }, status: 'CANCELLED', branchId },
        }),
      ],
    );

    return {
      total,
      checkedIn,
      waiting,
      completed,
      cancelled,
    };
  }
}
