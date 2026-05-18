import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { PayBillDto } from './dto/pay-bill.dto';
import { RefundBillDto } from './dto/refund-bill.dto';
import {
  BillStatus,
  CaseStage,
  PaymentMode,
  PaymentStatus,
  Prisma,
  QueueStatus,
} from '@prisma/client';
import { EventsService } from '../common/events.service';
import { Decimal } from 'decimal.js';

@Injectable()
export class BillingService {
  private readonly paymentIdempotencyCache = new Map<string, Promise<any>>();

  constructor(
    private prisma: PrismaService,
    private events: EventsService,
  ) {}

  async createBill(
    createBillDto: CreateBillDto,
    createdById: string,
    branchId: string,
    requestIp?: string,
  ) {
    const {
      caseId,
      items: manualItems,
      autoPopulateFromConsultation,
    } = createBillDto;

    try {
      return await this.prisma.$transaction(
        async (tx) => {
          await this.lockTransactionKey(tx, `bill-create-${caseId}`);

          const existingBill = await tx.bill.findFirst({
            where: { caseId, branchId },
            include: { items: true },
          });

          if (existingBill) {
            return existingBill;
          }

          const patientCase = await tx.patientCase.findFirst({
            where: { id: caseId, branchId },
            include: {
              doctor: {
                include: {
                  doctorProfile: true,
                },
              },
              procedureSessions: {
                include: {
                  procedure: true,
                },
              },
            },
          });

          if (!patientCase) {
            throw new NotFoundException('Patient case not found');
          }

          if (
            createBillDto.patientId &&
            createBillDto.patientId !== patientCase.patientId
          ) {
            throw new BadRequestException(
              'Patient does not match the selected case',
            );
          }

          const finalItems = this.buildBillItems(
            patientCase,
            manualItems,
            autoPopulateFromConsultation,
          );

          if (finalItems.length === 0) {
            throw new BadRequestException(
              'Cannot create empty bill. Provide items or enable auto-population.',
            );
          }

          const billNumber = await this.generateBillNumber(tx, branchId);
          const { grossAmount, discountTotal, netAmount } =
            this.calculateTotals(finalItems);

          const bill = await tx.bill.create({
            data: {
              billNumber,
              caseId,
              patientId: patientCase.patientId,
              branchId,
              grossAmount,
              discountTotal,
              netAmount,
              balanceAmount: netAmount,
              createdById,
              paymentStatus: 'PENDING',
              paymentStatusEnum: BillStatus.PENDING,
              items: {
                create: finalItems,
              },
            },
            include: {
              items: true,
            },
          });

          await tx.auditLog.create({
            data: {
              userId: createdById,
              entityType: 'BILL',
              entityId: bill.id,
              action: 'BILL_CREATED',
              ipAddress: requestIp,
              details: JSON.stringify({
                billNumber: bill.billNumber,
                caseId,
                grossAmount: grossAmount.toString(),
                discountTotal: discountTotal.toString(),
                netAmount: netAmount.toString(),
              }),
            },
          });

          return bill;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        return this.getBillByCaseId(caseId, branchId);
      }

      throw error;
    }
  }

  async ensureActiveBill(
    caseId: string,
    patientId: string,
    createdById: string,
    branchId: string,
    txClient?: Prisma.TransactionClient,
  ) {
    const execute = async (tx: Prisma.TransactionClient) => {
      await this.lockTransactionKey(tx, `bill-create-${caseId}`);

      const existingBill = await tx.bill.findFirst({
        where: { caseId, branchId },
      });

      if (existingBill) {
        return existingBill;
      }

      const billNumber = await this.generateBillNumber(tx, branchId);
      return tx.bill.create({
        data: {
          billNumber,
          caseId,
          patientId,
          branchId,
          grossAmount: 0,
          discountTotal: 0,
          netAmount: 0,
          balanceAmount: 0,
          createdById,
          paymentStatus: 'PENDING',
          paymentStatusEnum: BillStatus.PENDING,
        },
      });
    };

    try {
      if (txClient) {
        return await execute(txClient);
      }
      return await this.prisma.$transaction(execute, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        return this.prisma.bill.findFirstOrThrow({
          where: { caseId, branchId },
        });
      }

      throw error;
    }
  }

  async addItemsToBill(
    billId: string,
    items: {
      serviceName: string;
      description?: string;
      quantity: number;
      unitPrice: number | any;
      discount: number;
      itemType: string;
      referenceId?: string;
      procedureSessionId?: string;
    }[],
    branchId: string,
    txClient?: Prisma.TransactionClient,
  ) {
    const execute = async (tx: Prisma.TransactionClient) => {
      await this.lockTransactionKey(tx, `bill-update-${billId}`);

      const bill = await tx.bill.findUnique({
        where: { id: billId },
      });

      if (!bill) throw new NotFoundException('Bill not found');
      if (bill.isFinalized) {
        throw new BadRequestException('Cannot add items to a finalized bill');
      }

      const billItems = await Promise.all(
        items.map((item) => {
          const price = new Decimal(item.unitPrice.toString());
          const qty = new Decimal(item.quantity);
          const disc = new Decimal(item.discount || 0);

          const itemTotal = price.mul(qty);
          const itemDiscount = itemTotal.mul(disc).div(100);
          const finalPrice = itemTotal.sub(itemDiscount);

          return tx.billItem.create({
            data: {
              billId,
              serviceName: item.serviceName,
              description: item.description,
              quantity: item.quantity,
              unitPrice: price.toNumber(),
              discount: item.discount,
              totalPrice: finalPrice.toNumber(),
              itemType: item.itemType,
              referenceId: item.referenceId,
              procedureSessionId: item.procedureSessionId,
              branchId,
            },
          });
        }),
      );

      // Recalculate bill totals
      const allItems = await tx.billItem.findMany({ where: { billId } });
      let grossAmount = new Decimal(0);
      let discountTotal = new Decimal(0);

      allItems.forEach((i) => {
        const price = new Decimal(i.unitPrice.toString());
        const qty = new Decimal(i.quantity);
        const disc = new Decimal(i.discount.toString());

        const lineGross = price.mul(qty);
        const lineDisc = lineGross.mul(disc).div(100);

        grossAmount = grossAmount.add(lineGross);
        discountTotal = discountTotal.add(lineDisc);
      });

      const netAmount = grossAmount.sub(discountTotal);

      await tx.bill.update({
        where: { id: billId },
        data: {
          grossAmount: grossAmount.toNumber(),
          discountTotal: discountTotal.toNumber(),
          netAmount: netAmount.toNumber(),
          balanceAmount: netAmount
            .sub(new Decimal(bill.paidAmount.toString()))
            .toNumber(),
        },
      });

      return billItems;
    };

    if (txClient) {
      return await execute(txClient);
    }
    return await this.prisma.$transaction(execute, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });
  }

  async getBillById(id: string, branchId: string) {
    const bill = await this.prisma.bill.findFirst({
      where: { id, branchId },
      include: {
        items: true,
        payments: true,
        refunds: true,
        patient: {
          include: {
            profile: true,
          },
        },
        case: {
          include: {
            doctor: true,
          },
        },
      },
    });

    if (!bill) throw new NotFoundException('Bill not found');
    return bill;
  }

  async getBillByCaseId(caseId: string, branchId: string) {
    const bill = await this.prisma.bill.findFirst({
      where: { caseId, branchId },
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
            stage: true,
            status: true,
          },
        },
        payments: {
          include: {
            collectedBy: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!bill) {
      throw new NotFoundException('Bill not found for this case');
    }

    return bill;
  }

  async finalizeBill(
    id: string,
    userId: string,
    branchId: string,
    requestIp?: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const bill = await tx.bill.findFirst({
        where: { id, branchId },
        include: { items: true },
      });

      if (!bill) throw new NotFoundException('Bill not found');
      if (bill.isFinalized)
        throw new BadRequestException('Bill is already finalized');
      if (bill.items.length === 0)
        throw new BadRequestException('Cannot finalize an empty bill');

      await this.lockTransactionKey(tx, `bill-finalize-${bill.id}`);

      const updatedBill = await tx.bill.update({
        where: { id: bill.id },
        data: {
          isFinalized: true,
          finalizedAt: new Date(),
          finalizedById: userId,
        },
      });

      await tx.auditLog.create({
        data: {
          action: 'BILL_FINALIZED',
          entityType: 'BILL',
          entityId: bill.id,
          userId,
          ipAddress: requestIp,
          details: JSON.stringify({
            billNumber: bill.billNumber,
            netAmount: bill.netAmount.toString(),
          }),
        },
      });

      return updatedBill;
    });
  }

  async getPendingBills(branchId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const where = {
      paymentStatusEnum: {
        in: [BillStatus.PENDING, BillStatus.PARTIAL],
      },
      branchId,
    };

    const [total, data] = await Promise.all([
      this.prisma.bill.count({ where }),
      this.prisma.bill.findMany({
        where,
        skip,
        take: limit,
        include: {
          patient: {
            select: { firstName: true, lastName: true, mrdNumber: true },
          },
          case: { select: { caseNumber: true } },
        },
        orderBy: { createdAt: 'desc' },
      })
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
  }

  async getAllBills(branchId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const where = { branchId };

    const [total, data] = await Promise.all([
      this.prisma.bill.count({ where }),
      this.prisma.bill.findMany({
        where,
        skip,
        take: limit,
        include: {
          patient: {
            select: { firstName: true, lastName: true, mrdNumber: true },
          },
          case: { select: { caseNumber: true } },
        },
        orderBy: { createdAt: 'desc' },
      })
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
  }

  async payBill(
    id: string,
    payBillDto: PayBillDto,
    userId: string,
    branchId: string,
    requestIp?: string,
    idempotencyKey?: string,
  ) {
    const cacheKey = idempotencyKey
      ? `${id}:${userId}:${idempotencyKey}`
      : null;

    if (cacheKey) {
      const existingRequest = this.paymentIdempotencyCache.get(cacheKey);
      if (existingRequest) {
        return existingRequest;
      }

      const request = this.processPayment(
        id,
        payBillDto,
        userId,
        branchId,
        requestIp,
        idempotencyKey,
      ).catch((error) => {
        this.paymentIdempotencyCache.delete(cacheKey);
        throw error;
      });

      this.paymentIdempotencyCache.set(cacheKey, request);
      setTimeout(
        () => this.paymentIdempotencyCache.delete(cacheKey),
        15 * 60 * 1000,
      );
      return request;
    }

    return this.processPayment(id, payBillDto, userId, branchId, requestIp);
  }

  private async processPayment(
    id: string,
    payBillDto: PayBillDto,
    userId: string,
    branchId: string,
    requestIp?: string,
    idempotencyKey?: string,
  ) {
    return this.prisma.$transaction(
      async (tx) => {
        const bill = await tx.bill.findFirst({
          where: { id, branchId },
          include: { patient: true, case: true },
        });

        if (!bill) {
          throw new NotFoundException('Bill not found');
        }

        await this.lockTransactionKey(tx, `bill-payment-${bill.id}`);

        if (
          bill.paymentStatusEnum === BillStatus.PAID ||
          bill.paymentStatus === 'PAID'
        ) {
          throw new ConflictException('Bill is already fully paid');
        }

        const splits = this.normalizePaymentSplits(payBillDto);
        let currentDiscount = new Decimal(bill.discountTotal.toString());
        let currentNet = new Decimal(bill.netAmount.toString());
        let transactionPaidAmount = new Decimal(0);

        if (payBillDto.isFoc) {
          if (!payBillDto.focReason?.trim()) {
            throw new BadRequestException('FOC reason is required');
          }

          currentDiscount = new Decimal(bill.grossAmount.toString());
          currentNet = new Decimal(0);
        } else {
          transactionPaidAmount = splits.reduce(
            (sum, split) => sum.plus(new Decimal(split.amount.toString())),
            new Decimal(0),
          );

          if (transactionPaidAmount.lte(0)) {
            throw new BadRequestException(
              'Payment amount must be greater than zero',
            );
          }

          if (
            transactionPaidAmount.gt(new Decimal(bill.balanceAmount.toString()))
          ) {
            throw new BadRequestException(
              'Payment amount cannot exceed remaining balance',
            );
          }

          for (const split of splits) {
            await tx.billPayment.create({
              data: {
                billId: bill.id,
                amount: split.amount,
                paymentMode: split.paymentMode,
                status: PaymentStatus.SUCCESS,
                transactionId: split.transactionId,
                collectedById: userId,
                branchId,
              },
            });
          }
        }

        const totalPaidAmount = new Decimal(bill.paidAmount.toString()).plus(
          transactionPaidAmount,
        );
        const newBalance = payBillDto.isFoc
          ? new Decimal(0)
          : currentNet.minus(totalPaidAmount);

        let newPaymentStatus = 'PARTIAL';
        let newPaymentStatusEnum: BillStatus = BillStatus.PARTIAL;

        if (newBalance.isZero() || payBillDto.isFoc) {
          newPaymentStatus = 'PAID';
          newPaymentStatusEnum = BillStatus.PAID;
        }

        const finalPaymentMode = payBillDto.isFoc
          ? 'FOC'
          : splits.length > 1
            ? 'MIXED'
            : splits[0]?.paymentMode || bill.paymentMode || PaymentMode.CASH;
        const finalTransactionId =
          splits.length > 1
            ? 'MULTIPLE'
            : splits[0]?.transactionId || bill.transactionId || '';

        const updatedBill = await tx.bill.update({
          where: { id: bill.id },
          data: {
            paidAmount: totalPaidAmount,
            balanceAmount: newBalance,
            discountTotal: currentDiscount,
            netAmount: currentNet,
            paymentStatus: newPaymentStatus,
            paymentStatusEnum: newPaymentStatusEnum,
            paymentMode: finalPaymentMode,
            transactionId: finalTransactionId,
            paidAt: newPaymentStatus === 'PAID' ? new Date() : null,
          },
          include: {
            patient: true,
            case: true,
            payments: true,
          },
        });

        await tx.auditLog.create({
          data: {
            action: payBillDto.isFoc
              ? 'BILL_FOC_APPLIED'
              : 'BILL_PAYMENT_RECEIVED',
            entityType: 'BILL',
            entityId: bill.id,
            details: JSON.stringify({
              billNumber: bill.billNumber,
              amount: transactionPaidAmount.toString(),
              paymentMode: finalPaymentMode,
              splits: splits.map((split) => ({
                amount: split.amount.toString(),
                paymentMode: split.paymentMode,
                transactionId: split.transactionId,
              })),
              focReason: payBillDto.focReason,
              idempotencyKey,
            }),
            userId,
            ipAddress: requestIp,
          },
        });

        if (newPaymentStatus === 'PAID') {
          await tx.patientCase.update({
            where: { id: updatedBill.caseId },
            data: { stage: CaseStage.COMPLETED, status: 'CLOSED' },
          });

          const entry = await tx.queueEntry.findUnique({
            where: { caseId: updatedBill.caseId },
          });
          if (entry) {
            await tx.queueEntry.update({
              where: { id: entry.id },
              data: { status: QueueStatus.COMPLETED },
            });

            await tx.queueHistory.create({
              data: {
                queueEntryId: entry.id,
                action: 'FINAL_PAYMENT_COMPLETED',
                fromStatus: entry.status,
                toStatus: QueueStatus.COMPLETED,
                performedById: userId,
              },
            });
          }
        }

        this.events.emitQueueUpdate({
          type: 'PAYMENT_RECEIVED',
          billId: updatedBill.id,
          patientName:
            `${updatedBill.patient.firstName || ''} ${updatedBill.patient.lastName || ''}`.trim(),
          amount: transactionPaidAmount,
          status: newPaymentStatus,
          caseId: updatedBill.caseId,
        });

        return updatedBill;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  }

  async processRefund(
    id: string,
    refundDto: RefundBillDto,
    userId: string,
    branchId: string,
    requestIp?: string,
    txClient?: Prisma.TransactionClient,
  ) {
    const execute = async (tx: Prisma.TransactionClient) => {
      const bill = await tx.bill.findFirst({
        where: { id, branchId },
        include: { payments: true },
      });

      if (!bill) throw new NotFoundException('Bill not found');

      await this.lockTransactionKey(tx, `bill-refund-${bill.id}`);

      const refundAmount = new Decimal(refundDto.amount.toString());
      const paidAmount = new Decimal(bill.paidAmount.toString());

      if (refundAmount.gt(paidAmount)) {
        throw new BadRequestException(
          'Refund amount cannot exceed total paid amount',
        );
      }

      const refund = await tx.billRefund.create({
        data: {
          billId: bill.id,
          amount: refundAmount.toNumber(),
          reason: refundDto.reason,
          processedById: userId,
          branchId,
        },
      });

      const newPaidAmount = paidAmount.sub(refundAmount);
      const newBalance = new Decimal(bill.netAmount.toString()).sub(
        newPaidAmount,
      );

      await tx.bill.update({
        where: { id: bill.id },
        data: {
          paidAmount: newPaidAmount.toNumber(),
          balanceAmount: newBalance.toNumber(),
          paymentStatusEnum: newPaidAmount.eq(0)
            ? BillStatus.PENDING
            : BillStatus.PARTIAL,
        },
      });

      await tx.auditLog.create({
        data: {
          action: 'BILL_REFUND_PROCESSED',
          entityType: 'BILL',
          entityId: bill.id,
          userId,
          ipAddress: requestIp,
          details: JSON.stringify({
            billNumber: bill.billNumber,
            refundAmount: refundAmount.toString(),
            reason: refundDto.reason,
          }),
        },
      });

      return refund;
    };

    if (txClient) {
      return await execute(txClient);
    }
    return this.prisma.$transaction(execute, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });
  }

  private buildBillItems(
    patientCase: any,
    manualItems: any[] | undefined,
    autoPopulateFromConsultation?: boolean,
  ) {
    const finalItems: any[] = [];

    if (autoPopulateFromConsultation) {
      if (patientCase.doctor?.doctorProfile) {
        finalItems.push({
          serviceName: 'Consultation Fee',
          description: `Dr. ${patientCase.doctor.firstName || patientCase.doctor.name}`,
          quantity: 1,
          unitPrice: patientCase.doctor.doctorProfile.consultationFee,
          discount: 0,
          totalPrice: patientCase.doctor.doctorProfile.consultationFee,
          itemType: 'CONSULTATION',
          referenceId: patientCase.doctorId,
        });
      }

      if (
        patientCase.procedureSessions &&
        patientCase.procedureSessions.length > 0
      ) {
        for (const session of patientCase.procedureSessions) {
          finalItems.push({
            serviceName: session.procedure.name,
            description: session.procedure.description,
            quantity: 1,
            unitPrice: session.procedure.basePrice,
            discount: 0,
            totalPrice: session.procedure.basePrice,
            itemType: 'PROCEDURE',
            referenceId: session.procedure.id,
            procedureSessionId: session.id,
          });
        }
      }
    }

    if (manualItems && manualItems.length > 0) {
      manualItems.forEach((item) => {
        const price = new Decimal(item.unitPrice || 0);
        const qty = new Decimal(item.quantity || 0);
        const disc = new Decimal(item.discount || 0);

        const itemTotal = price.mul(qty);
        const itemDiscount = itemTotal.mul(disc).div(100);

        finalItems.push({
          serviceName: item.serviceName,
          description: item.description,
          quantity: item.quantity,
          unitPrice: price.toNumber(),
          discount: item.discount,
          totalPrice: itemTotal.sub(itemDiscount).toNumber(),
          itemType: 'OTHER',
        });
      });
    }

    return finalItems;
  }

  private calculateTotals(items: any[]) {
    let grossAmount = new Decimal(0);
    let discountTotal = new Decimal(0);

    items.forEach((item) => {
      const price = new Decimal(item.unitPrice.toString());
      const qty = new Decimal(item.quantity);
      const disc = new Decimal(item.discount || 0);

      const lineGross = price.mul(qty);
      const lineDisc = lineGross.mul(disc).div(100);

      grossAmount = grossAmount.add(lineGross);
      discountTotal = discountTotal.add(lineDisc);
    });

    return {
      grossAmount,
      discountTotal,
      netAmount: grossAmount.sub(discountTotal),
    };
  }

  private normalizePaymentSplits(payBillDto: PayBillDto) {
    if (payBillDto.isFoc) {
      return [];
    }

    const splits = [...(payBillDto.splits || [])];
    if (splits.length === 0 && payBillDto.amountPaid) {
      splits.push({
        amount: payBillDto.amountPaid,
        paymentMode: payBillDto.paymentMode || PaymentMode.CASH,
        transactionId: payBillDto.transactionId,
      });
    }

    if (splits.length === 0) {
      throw new BadRequestException('At least one payment split is required');
    }

    for (const split of splits) {
      if (split.amount <= 0) {
        throw new BadRequestException(
          'Payment amount must be greater than zero',
        );
      }

      if (!Object.values(PaymentMode).includes(split.paymentMode)) {
        throw new BadRequestException('Invalid payment mode');
      }
    }

    return splits;
  }

  private async lockTransactionKey(tx: Prisma.TransactionClient, key: string) {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${key}))`;
  }

  private isUniqueConstraintError(error: unknown) {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    );
  }

  async generateBillNumber(
    tx: Prisma.TransactionClient,
    branchId: string,
  ): Promise<string> {
    const today = new Date();
    const dateStr =
      today.getFullYear().toString().slice(-2) +
      (today.getMonth() + 1).toString().padStart(2, '0') +
      today.getDate().toString().padStart(2, '0');

    const prefix = `BILL${dateStr}`;
    await this.lockTransactionKey(tx, `bill-number-${dateStr}-${branchId}`);

    const lastBill = await tx.bill.findFirst({
      where: {
        billNumber: {
          startsWith: prefix,
        },
        branchId,
      },
      orderBy: { billNumber: 'desc' },
      select: { billNumber: true },
    });

    let nextNumber = 1;
    if (lastBill) {
      const parts = lastBill.billNumber.split('-');
      nextNumber = parseInt(parts[2], 10) + 1;
    }

    return `${prefix}-${dateStr}-${nextNumber.toString().padStart(4, '0')}`;
  }

  private formatDate(date: Date, fmt: string) {
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    return fmt
      .replace('yyyy', yyyy.toString())
      .replace('MM', mm)
      .replace('dd', dd);
  }
}
