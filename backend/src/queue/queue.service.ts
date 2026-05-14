import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQueueEntryDto } from './dto/create-queue-entry.dto';
import { UpdateQueueStatusDto, UpdateCaseStageDto } from './dto/update-queue.dto';
import { QueueStatus, CaseStage } from '@prisma/client';
import { EventsService } from '../common/events.service';

@Injectable()
export class QueueService {
  constructor(
    private prisma: PrismaService,
    private events: EventsService
  ) {}

  async createEntry(dto: CreateQueueEntryDto, userId: string) {
    if (!userId) throw new BadRequestException('User ID is required for check-in');
    
    const { caseId, patientId, doctorId, queueType, priority } = dto;

    // Verify case exists
    const patientCase = await this.prisma.patientCase.findUnique({
      where: { id: caseId },
      include: { doctor: true }
    });
    if (!patientCase) throw new NotFoundException('Case not found');

    // Check if already in queue
    const existing = await this.prisma.queueEntry.findUnique({
      where: { caseId }
    });
    if (existing) throw new BadRequestException('Patient already in queue for this case');

    // Generate Token Display (e.g. OPD-001)
    const tokenDisplay = await this.generateTokenDisplay(dto.queueType || 'OPD');
    
    // Get latest sequence for sorting
    const lastEntry = await this.prisma.queueEntry.findFirst({
      orderBy: { tokenNumber: 'desc' },
      where: { checkInTime: { gte: new Date(new Date().setHours(0,0,0,0)) } }
    });
    const tokenNumber = (lastEntry?.tokenNumber || 0) + 1;

    return this.prisma.$transaction(async (tx) => {
      const entry = await tx.queueEntry.create({
        data: {
          tokenDisplay,
          tokenNumber,
          queueType: queueType || 'OPD',
          priority: priority || patientCase.priority,
          caseId,
          patientId,
          doctorId: doctorId || patientCase.doctorId,
        },
      });

      // Log history
      await tx.queueHistory.create({
        data: {
          queueEntry: { connect: { id: entry.id } },
          action: 'CHECK_IN',
          toStatus: 'WAITING',
          performedBy: { connect: { id: userId } },
        },
      });

      // Update case stage to NURSING (where vitals happen) or DOCTOR
      await tx.patientCase.update({
        where: { id: caseId },
        data: { stage: 'NURSING' }
      });

      return entry;
    });
  }

  private async generateTokenDisplay(type: string): Promise<string> {
    const prefix = type.toUpperCase();
    const count = await this.prisma.queueEntry.count({
      where: { 
        queueType: type as any,
        checkInTime: { gte: new Date(new Date().setHours(0,0,0,0)) } 
      }
    });
    
    return `${prefix}-${(count + 1).toString().padStart(3, '0')}`;
  }

  async updateStatus(id: string, dto: UpdateQueueStatusDto, userId: string) {
    const entry = await this.prisma.queueEntry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundException('Queue entry not found');

    return this.prisma.$transaction(async (tx) => {
      const result = await tx.queueEntry.update({
        where: { id },
        data: { 
          status: dto.status,
          callCount: dto.status === 'CALLING' ? { increment: 1 } : undefined
        },
        include: {
          patient: true,
          doctor: true,
          case: true
        }
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
        patientName: `${result.patient.firstName} ${result.patient.lastName}`,
        room: result.doctor?.name ? 'Room ' + (result.doctor as any).roomNumber : 'TBD'
      });

      return result;
    });
  }

  async updateStage(caseId: string, dto: UpdateCaseStageDto, userId: string) {
    const entry = await this.prisma.queueEntry.findUnique({ where: { caseId } });
    
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

  async startSession(caseId: string, doctorId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      // End any other active sessions for this doctor
      await tx.visitSession.updateMany({
        where: { doctorId, status: 'ACTIVE' },
        data: { status: 'COMPLETED', endTime: new Date() }
      });

      const session = await tx.visitSession.create({
        data: { caseId, doctorId }
      });

      const entry = await tx.queueEntry.findUnique({ 
        where: { caseId },
        include: { patient: true, doctor: true }
      });
      if (entry) {
        await tx.queueEntry.update({
          where: { caseId },
          data: { status: 'IN_SESSION' }
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
          patientName: `${entry.patient.firstName} ${entry.patient.lastName}`,
          doctorId: doctorId
        });
      }

      await tx.patientCase.update({
        where: { id: caseId },
        data: { stage: 'DOCTOR' }
      });

      return session;
    });
  }

  async endSession(caseId: string, userId: string, nextStage: CaseStage) {
    return this.prisma.$transaction(async (tx) => {
      // 1. End active sessions for this case
      await tx.visitSession.updateMany({
        where: { caseId, status: 'ACTIVE' },
        data: { status: 'COMPLETED', endTime: new Date() }
      });

      // 2. Update Queue Entry to BILLING_PENDING or COMPLETED
      const entry = await tx.queueEntry.findUnique({ 
        where: { caseId },
        include: { patient: true }
      });
      
      const finalQueueStatus = (nextStage === 'BILLING' ? 'BILLING_PENDING' : 'COMPLETED') as unknown as QueueStatus;

      if (entry) {
        await tx.queueEntry.update({
          where: { caseId },
          data: { status: finalQueueStatus }
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
          patientName: `${entry.patient.firstName} ${entry.patient.lastName}`,
          nextStage: nextStage
        });
      }

      // 3. Update Patient Case Stage
      return tx.patientCase.update({
        where: { id: caseId },
        data: { stage: nextStage },
      });
    });
  }

  async getLiveQueue(doctorId?: string) {
    return this.prisma.queueEntry.findMany({
      where: {
        doctorId: doctorId || undefined,
        checkInTime: { gte: new Date(new Date().setHours(0,0,0,0)) },
        status: { not: 'CANCELLED' }
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            mrdNumber: true,
            gender: true
          }
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
                paymentStatus: true
              }
            }
          }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { tokenNumber: 'asc' }
      ]
    });
  }

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, checkedIn, waiting, completed, cancelled] = await Promise.all([
      this.prisma.queueEntry.count({ where: { checkInTime: { gte: today } } }),
      this.prisma.queueEntry.count({ where: { checkInTime: { gte: today }, status: { in: ['WAITING', 'IN_SESSION', 'CALLING'] } } }),
      this.prisma.queueEntry.count({ where: { checkInTime: { gte: today }, status: { in: ['WAITING', 'CALLING'] } } }),
      this.prisma.queueEntry.count({ where: { checkInTime: { gte: today }, status: 'COMPLETED' } }),
      this.prisma.queueEntry.count({ where: { checkInTime: { gte: today }, status: 'CANCELLED' } }),
    ]);

    return {
      total,
      checkedIn,
      waiting,
      completed,
      cancelled
    };
  }
}
