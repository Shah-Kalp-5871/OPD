import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsService } from '../common/events.service';
import {
  UpdateInvestigationStatusDto,
  SubmitLabResultsDto,
  InvestigationStatus,
} from './dto/laboratory.dto';

@Injectable()
export class LaboratoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsService,
  ) {}

  async getPendingInvestigations() {
    return this.prisma.investigationOrder.findMany({
      where: {
        status: { in: ['ORDERED', 'SAMPLE_COLLECTED', 'PROCESSING'] },
      },
      include: {
        patientCase: {
          include: { patient: true },
        },
        results: { include: { parameter: true } },
        files: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(
    orderId: string,
    dto: UpdateInvestigationStatusDto,
    userId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.investigationOrder.findUnique({
        where: { id: orderId },
      });
      if (!order) throw new NotFoundException('Investigation order not found');

      const updatedOrder = await tx.investigationOrder.update({
        where: { id: orderId },
        data: {
          status: dto.status as any,
          notes: dto.notes
            ? `${order.notes || ''}\n[Status Update]: ${dto.notes}`
            : order.notes,
        },
      });

      await tx.auditLog.create({
        data: {
          userId,
          entityType: 'INVESTIGATION_ORDER',
          entityId: orderId,
          action: 'STATUS_UPDATE',
          details: `Status changed from ${order.status} to ${dto.status}`,
        },
      });

      // Emit event for Doctor
      this.events.emitQueueUpdate({
        type: 'LAB_STATUS_UPDATED',
        caseId: order.caseId,
        message: `Investigation ${orderId} is now ${dto.status}`,
      });

      return updatedOrder;
    });
  }

  async submitResults(
    orderId: string,
    dto: SubmitLabResultsDto,
    userId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.investigationOrder.findUnique({
        where: { id: orderId },
      });
      if (!order) throw new NotFoundException('Investigation order not found');

      // Create results
      for (const res of dto.results) {
        await tx.investigationResult.create({
          data: {
            orderId,
            parameterId: res.parameterId,
            numericValue: res.numericValue,
            textValue: res.textValue,
            isAbnormal: res.isAbnormal || false,
            notes: res.notes,
            enteredById: userId,
          },
        });
      }

      // Automatically move status to RESULT_READY
      const updatedOrder = await tx.investigationOrder.update({
        where: { id: orderId },
        data: { status: 'RESULT_READY' },
      });

      this.events.emitQueueUpdate({
        type: 'LAB_RESULTS_READY',
        caseId: order.caseId,
        message: `Results ready for Investigation ${orderId}`,
      });

      return updatedOrder;
    });
  }

  async getOrderDetails(orderId: string) {
    const order = await this.prisma.investigationOrder.findUnique({
      where: { id: orderId },
      include: {
        patientCase: {
          include: {
            patient: true,
            doctor: true,
          },
        },
        results: { include: { parameter: true } },
        files: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
