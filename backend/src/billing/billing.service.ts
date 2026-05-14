import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { PayBillDto } from './dto/pay-bill.dto';

import { EventsService } from '../common/events.service';

@Injectable()
export class BillingService {
  constructor(
    private prisma: PrismaService,
    private events: EventsService
  ) {}

  async createBill(createBillDto: CreateBillDto, createdById: string) {
    const { caseId, patientId, items } = createBillDto;

    // Verify case exists
    const patientCase = await this.prisma.patientCase.findUnique({
      where: { id: caseId },
    });

    if (!patientCase) {
      throw new NotFoundException('Patient case not found');
    }

    // Check if bill already exists for this case
    const existingBill = await this.prisma.bill.findUnique({
      where: { caseId },
    });

    if (existingBill) {
      return existingBill; // Or throw error? Usually return existing
    }

    // Generate Bill Number: RCP-MMDD-NNN
    const billNumber = await this.generateBillNumber();

    // Calculate totals
    let grossAmount = 0;
    let discountTotal = 0;

    const billItemsData = items.map((item) => {
      const itemTotal = item.unitPrice * item.quantity;
      const itemDiscount = (itemTotal * item.discount) / 100;
      const finalPrice = itemTotal - itemDiscount;

      grossAmount += itemTotal;
      discountTotal += itemDiscount;

      return {
        serviceName: item.serviceName,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        totalPrice: finalPrice,
      };
    });

    const netAmount = grossAmount - discountTotal;

    return this.prisma.bill.create({
      data: {
        billNumber,
        caseId,
        patientId,
        grossAmount,
        discountTotal,
        netAmount,
        balanceAmount: netAmount,
        createdById,
        items: {
          create: billItemsData,
        },
      },
      include: {
        items: true,
      },
    });
  }

  async getBillByCaseId(caseId: string) {
    const bill = await this.prisma.bill.findUnique({
      where: { caseId },
      include: {
        items: true,
        patient: {
          select: {
            firstName: true,
            lastName: true,
            mrdNumber: true,
          },
        },
        case: {
          select: {
            caseNumber: true,
          },
        },
      },
    });

    if (!bill) {
      throw new NotFoundException('Bill not found for this case');
    }

    return bill;
  }

  async getPendingBills() {
    return this.prisma.bill.findMany({
      where: {
        paymentStatus: {
          in: ['PENDING', 'PARTIAL']
        }
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            mrdNumber: true,
          }
        },
        case: {
          select: {
            caseNumber: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async payBill(billId: string, payBillDto: PayBillDto, userId: string) {

    const bill = await this.prisma.bill.findUnique({
      where: { id: billId },
    });

    if (!bill) {
      throw new NotFoundException('Bill not found');
    }

    const paidAmount = bill.paidAmount + payBillDto.amountPaid;
    const balanceAmount = bill.netAmount - paidAmount;

    let paymentStatus = 'PARTIAL';
    if (balanceAmount <= 0) {
      paymentStatus = 'PAID';
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedBill = await tx.bill.update({
        where: { id: billId },
        data: {
          paidAmount,
          balanceAmount: Math.max(0, balanceAmount),
          paymentStatus,
          paymentMode: payBillDto.paymentMode,
          transactionId: payBillDto.transactionId,
          paidAt: new Date(),
        },
        include: {
          patient: true,
          case: true,
        }
      });

      if (paymentStatus === 'PAID') {
        // Finalize the visit
        await tx.patientCase.update({
          where: { id: updatedBill.caseId },
          data: { stage: 'COMPLETED', status: 'CLOSED' }
        });

        const entry = await tx.queueEntry.findUnique({ where: { caseId: updatedBill.caseId } });
        if (entry) {
          await tx.queueEntry.update({
            where: { id: entry.id },
            data: { status: 'COMPLETED' }
          });

          await tx.queueHistory.create({
            data: {
              queueEntryId: entry.id,
              action: 'FINAL_PAYMENT_COMPLETED',
              fromStatus: entry.status,
              toStatus: 'COMPLETED',
              performedById: userId,

            },
          });
        }
      }

      // Emit real-time event
      this.events.emitQueueUpdate({
        type: 'PAYMENT_RECEIVED',
        billId: updatedBill.id,
        patientName: `${updatedBill.patient.firstName} ${updatedBill.patient.lastName}`,
        amount: payBillDto.amountPaid,
        status: paymentStatus,
        caseId: updatedBill.caseId
      });

      return updatedBill;
    });
  }

  private async generateBillNumber(): Promise<string> {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const prefix = `RCP-${month}${day}-`;

    const lastBill = await this.prisma.bill.findFirst({
      where: {
        billNumber: {
          startsWith: prefix,
        },
      },
      orderBy: {
        billNumber: 'desc',
      },
    });

    let nextNumber = 1;
    if (lastBill) {
      const parts = lastBill.billNumber.split('-');
      if (parts.length === 3) {
        nextNumber = parseInt(parts[2], 10) + 1;
      }
    }

    return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
  }
}
