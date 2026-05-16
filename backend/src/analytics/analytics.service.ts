import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import { BillStatus, QueueStatus, ConsultationStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      revenueToday,
      patientsToday,
      activeQueue,
      completedConsultations,
      pendingBills,
      lowStockCount,
      nearExpiryCount,
    ] = await Promise.all([
      // Revenue Today
      this.prisma.billPayment.aggregate({
        where: {
          paymentDate: { gte: today },
          status: 'SUCCESS',
        },
        _sum: { amount: true },
      }),
      // Patients Registered Today
      this.prisma.patient.count({
        where: { createdAt: { gte: today } },
      }),
      // Active Queue Count
      this.prisma.queueEntry.count({
        where: {
          status: { in: [QueueStatus.WAITING, QueueStatus.CALLING, QueueStatus.IN_SESSION] },
        },
      }),
      // Completed Consultations Today
      this.prisma.consultationRecord.count({
        where: {
          finalizedAt: { gte: today },
          isFinalized: true,
        },
      }),
      // Pending Bills
      this.prisma.bill.count({
        where: { paymentStatusEnum: BillStatus.PENDING },
      }),
      // Low Stock Alerts
      this.prisma.drugInventory.count({
        where: {
          totalStock: { lte: this.prisma.drugInventory.fields.reorderLevel as any },
        },
      }),
      // Near Expiry (90 days)
      this.prisma.drugBatch.count({
        where: {
          expiryDate: {
            lte: new Date(new Date().setDate(new Date().getDate() + 90)),
          },
          isExpired: false,
          stockQuantity: { gt: 0 },
        },
      }),
    ]);

    return {
      revenueToday: Number(revenueToday._sum.amount || 0),
      patientsToday,
      activeQueue,
      completedConsultations,
      pendingBills,
      lowStockCount,
      nearExpiryCount,
    };
  }

  async getFinancialAnalytics(startDate?: Date, endDate?: Date) {
    const start = startDate || new Date(new Date().setDate(new Date().getDate() - 30));
    const end = endDate || new Date();

    const [revenueByDay, paymentModeBreakdown, topRevenueDoctors, totalOutstanding] =
      await Promise.all([
        this.prisma.billPayment.groupBy({
          by: ['paymentDate'],
          where: {
            paymentDate: { gte: start, lte: end },
            status: 'SUCCESS',
          },
          _sum: { amount: true },
          orderBy: { paymentDate: 'asc' },
        }),
        this.prisma.billPayment.groupBy({
          by: ['paymentMode'],
          where: {
            paymentDate: { gte: start, lte: end },
            status: 'SUCCESS',
          },
          _sum: { amount: true },
        }),
        this.prisma.billItem.groupBy({
          by: ['serviceName'],
          _sum: { totalPrice: true },
          orderBy: { _sum: { totalPrice: 'desc' } },
          take: 5,
        }),
        this.prisma.bill.aggregate({
          where: { paymentStatusEnum: { in: [BillStatus.PENDING, BillStatus.PARTIAL] } },
          _sum: { balanceAmount: true },
        }),
      ]);

    return {
      revenueByDay,
      paymentModeBreakdown,
      topRevenueDoctors,
      totalOutstanding: Number(totalOutstanding._sum.balanceAmount || 0),
    };
  }

  async getClinicalAnalytics() {
    const [diagnosisStats, visitTypeStats, patientGenderStats] = await Promise.all([
      this.prisma.consultationRecord.groupBy({
        by: ['provisionalDiagnosis'],
        _count: { _all: true },
        where: { provisionalDiagnosis: { not: null } },
        orderBy: { _count: { provisionalDiagnosis: 'desc' } },
        take: 10,
      }),
      this.prisma.patientCase.groupBy({
        by: ['visitType'],
        _count: { _all: true },
      }),
      this.prisma.patient.groupBy({
        by: ['gender'],
        _count: { _all: true },
      }),
    ]);

    return {
      diagnosisStats,
      visitTypeStats,
      patientGenderStats,
    };
  }

  async getInventoryAnalytics() {
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);

    const [stockValuation, topMovingDrugs, nearExpiryBatches] = await Promise.all([
      this.prisma.$queryRaw`SELECT SUM("stockQuantity" * "purchasePrice") as valuation FROM "DrugBatch" WHERE "isExpired" = false AND "isActive" = true`,
      this.prisma.stockMovement.groupBy({
        by: ['inventoryId'],
        _sum: { quantity: true },
        where: { movementType: 'OUT' },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 10,
      }),
      this.prisma.drugBatch.findMany({
        where: {
          expiryDate: { lte: ninetyDaysFromNow },
          isExpired: false,
          stockQuantity: { gt: 0 },
        },
        include: { 
          inventory: {
            include: { drug: true }
          }
        },
        orderBy: { expiryDate: 'asc' },
        take: 20,
      }),
    ]);

    return {
      stockValuation: Number((stockValuation as any)[0]?.valuation || 0),
      topMovingDrugs,
      nearExpiryBatches: nearExpiryBatches.map(b => ({
        ...b,
        drug: b.inventory.drug
      })),
    };
  }

  async getAuditAnalytics() {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { user: { select: { name: true, role: true } } },
    });
  }

  async exportFinancialReport(startDate: Date, endDate: Date) {
    const payments = await this.prisma.billPayment.findMany({
      where: {
        paymentDate: { gte: startDate, lte: endDate },
        status: 'SUCCESS',
      },
      include: {
        bill: {
          include: {
            patient: true,
          },
        },
        collectedBy: true,
      },
      orderBy: { paymentDate: 'desc' },
    });

    const headers = [
      'Date',
      'Bill Number',
      'Patient Name',
      'Payment Mode',
      'Amount',
      'Transaction ID',
      'Collected By',
    ];

    const rows = payments.map((p) => [
      p.paymentDate.toISOString(),
      p.bill.billNumber,
      `${p.bill.patient.firstName} ${p.bill.patient.lastName}`,
      p.paymentMode,
      p.amount.toString(),
      p.transactionId || '',
      p.collectedBy?.name || 'N/A',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    return csvContent;
  }
}
