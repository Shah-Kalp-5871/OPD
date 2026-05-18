import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisCacheService } from '../common/cache/redis-cache.service';
import { BillStatus } from '@prisma/client';

@Injectable()
export class OperationalIntelligenceService {
  private readonly logger = new Logger(OperationalIntelligenceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: RedisCacheService,
  ) {}

  // ─── Run Full Anomaly Scan for a Branch ──────────────────────────────────

  async runAnomalyScan(branchId: string): Promise<{ anomaliesFound: number; critical: number }> {
    const [billingAnomalies, refundAnomalies, stockAnomalies] = await Promise.all([
      this.detectSuspiciousBilling(branchId),
      this.detectUnusualRefunds(branchId),
      this.detectAbnormalStockAdjustments(branchId),
    ]);

    const all = [...billingAnomalies, ...refundAnomalies, ...stockAnomalies];
    let anomaliesCreated = 0;

    for (const anomaly of all) {
      // Skip if identical anomaly already open in last 7 days
      const existing = await this.prisma.operationalAnomaly.findFirst({
        where: { branchId, anomalyType: anomaly.anomalyType, status: 'OPEN',
          createdAt: { gte: new Date(Date.now() - 7 * 86400000) } },
      });
      if (!existing) {
        await this.prisma.operationalAnomaly.create({ data: { branchId, ...anomaly } });
        anomaliesCreated++;
      }
    }

    const critical = all.filter((a) => a.anomalyScore >= 75).length;
    if (anomaliesCreated > 0) {
      this.logger.warn(`Branch ${branchId}: ${anomaliesCreated} operational anomaly/anomalies detected`);
    }

    return { anomaliesFound: anomaliesCreated, critical };
  }

  // ─── Get Open Anomalies for Branch ──────────────────────────────────────

  async getAnomalies(branchId: string, status = 'OPEN', page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const where = { branchId, ...(status !== 'ALL' ? { status } : {}) };
    const [total, data] = await Promise.all([
      this.prisma.operationalAnomaly.count({ where }),
      this.prisma.operationalAnomaly.findMany({
        where, orderBy: [{ anomalyScore: 'desc' }, { createdAt: 'desc' }], skip, take: limit,
      }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  // ─── Acknowledge Anomaly ─────────────────────────────────────────────────

  async updateAnomalyStatus(id: string, status: string, userId: string, notes?: string) {
    return this.prisma.operationalAnomaly.update({
      where: { id },
      data: { status, reviewedById: userId, reviewedAt: new Date(), reviewNotes: notes },
    });
  }

  // ─── Appointment Intelligence ────────────────────────────────────────────

  async getAppointmentIntelligence(branchId: string) {
    return this.cache.getOrSetBranchScoped(branchId, 'appt-intelligence', null, 30 * 60 * 1000, async () => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);

      const [noShowData, completedData, queueStats] = await Promise.all([
        // Raw SQL avoids Prisma groupBy _count type issues
        this.prisma.$queryRaw<{ doctorId: string; count: bigint }[]>`
          SELECT "doctorId", COUNT(*) as count
          FROM "Appointment"
          WHERE "branchId" = ${branchId}
            AND "appointmentDate" >= ${thirtyDaysAgo}
            AND "status" = 'NO_SHOW'
          GROUP BY "doctorId"
          ORDER BY count DESC
          LIMIT 5
        `,
        this.prisma.$queryRaw<{ doctorId: string; count: bigint }[]>`
          SELECT "doctorId", COUNT(*) as count
          FROM "Appointment"
          WHERE "branchId" = ${branchId}
            AND "appointmentDate" >= ${thirtyDaysAgo}
            AND "status" = 'COMPLETED'
          GROUP BY "doctorId"
        `,
        this.prisma.queueEntry.findMany({
          where: { branchId, status: 'COMPLETED', checkInTime: { gte: thirtyDaysAgo } },
          select: { checkInTime: true, updatedAt: true },
          take: 500,
        }),
      ]);

      // Average wait time in minutes
      const waitTimes = queueStats
        .map((q) => (q.updatedAt.getTime() - q.checkInTime.getTime()) / 60000)
        .filter((t) => t > 0 && t < 300);
      const avgWaitTime = waitTimes.length > 0
        ? Math.round(waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length)
        : null;

      // No-show rate by doctor
      const completedMap = new Map(completedData.map((d) => [d.doctorId, Number(d.count)]));
      const noShowRates = noShowData.map((ns) => {
        const noShowCount = Number(ns.count);
        const completed = completedMap.get(ns.doctorId) || 0;
        const total = noShowCount + completed;
        return {
          doctorId: ns.doctorId,
          noShowCount,
          completedCount: completed,
          noShowRate: total > 0 ? Math.round((noShowCount / total) * 100) : 0,
          risk: noShowCount >= 5 ? 'HIGH' : noShowCount >= 3 ? 'MEDIUM' : 'LOW',
        };
      });

      return {
        branchId,
        averageWaitTimeMinutes: avgWaitTime,
        noShowAnalysis: { byDoctor: noShowRates },
        analysisGeneratedAt: new Date().toISOString(),
      };
    });
  }

  // ─── Revenue Forecasting ─────────────────────────────────────────────────

  async getRevenueForecast(branchId?: string) {
    const cacheKey = `revenue-forecast-${branchId || 'global'}`;
    return this.cache.getOrSetBranchScoped(branchId || 'global', cacheKey, null, 60 * 60 * 1000, async () => {
      const ninetyDaysAgo = new Date(Date.now() - 90 * 86400000);
      const where: any = { paymentDate: { gte: ninetyDaysAgo }, status: 'SUCCESS' };
      if (branchId) where.branchId = branchId;

      const revenueByDay = await this.prisma.billPayment.groupBy({
        by: ['paymentDate'],
        where,
        _sum: { amount: true },
        orderBy: { paymentDate: 'asc' },
      });

      if (!revenueByDay.length) {
        return { dailyAverage: 0, projectedMonthlyRevenue: 0, trend: 'INSUFFICIENT_DATA', generatedAt: new Date().toISOString() };
      }

      const revenues = revenueByDay.map((r) => Number(r._sum.amount || 0));
      const dailyAvg = revenues.reduce((a, b) => a + b, 0) / revenues.length;

      // Simple linear trend: compare last 30d vs previous 30d
      const mid = Math.floor(revenues.length / 2);
      const firstHalfAvg = revenues.slice(0, mid).reduce((a, b) => a + b, 0) / mid;
      const secondHalfAvg = revenues.slice(mid).reduce((a, b) => a + b, 0) / (revenues.length - mid);
      const trendPct = firstHalfAvg > 0 ? Math.round(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100) : 0;
      const trend = trendPct > 5 ? 'GROWING' : trendPct < -5 ? 'DECLINING' : 'STABLE';

      // Project next 30 days using current avg + trend
      const projectedDailyAvg = dailyAvg * (1 + trendPct / 100);

      return {
        branchId: branchId || 'all',
        historicalDays: revenueByDay.length,
        dailyAverage: Math.round(dailyAvg),
        projectedDailyAverage: Math.round(projectedDailyAvg),
        projectedMonthlyRevenue: Math.round(projectedDailyAvg * 30),
        revenueGrowthPercent: trendPct,
        trend,
        last7DaysRevenue: revenues.slice(-7).reduce((a, b) => a + b, 0),
        last30DaysRevenue: revenues.slice(-30).reduce((a, b) => a + b, 0),
        generatedAt: new Date().toISOString(),
      };
    });
  }

  // ─── Internal: Suspicious Billing Detection ──────────────────────────────

  private async detectSuspiciousBilling(branchId: string) {
    const anomalies: { anomalyType: string; anomalyScore: number; description: string; evidence: object }[] = [];
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);

    // Excessive FOC (Free Of Charge) cases
    const [focCount, totalBills] = await Promise.all([
      this.prisma.bill.count({ where: { branchId, paymentStatusEnum: BillStatus.FOC, billingDate: { gte: sevenDaysAgo } } }),
      this.prisma.bill.count({ where: { branchId, billingDate: { gte: sevenDaysAgo } } }),
    ]);

    if (totalBills > 10 && focCount / totalBills > 0.15) {
      anomalies.push({
        anomalyType: 'HIGH_FOC',
        anomalyScore: Math.min(90, Math.round((focCount / totalBills) * 100) + 50),
        description: `${focCount} of ${totalBills} bills (${Math.round((focCount / totalBills) * 100)}%) marked as FOC in last 7 days`,
        evidence: { focCount, totalBills, focalRate: focCount / totalBills },
      });
    }

    // High discount variance
    const discountStats = await this.prisma.bill.aggregate({
      where: { branchId, billingDate: { gte: sevenDaysAgo }, discountTotal: { gt: 0 } },
      _avg: { discountTotal: true }, _max: { discountTotal: true }, _count: { _all: true },
    });

    const avgDiscount = Number(discountStats._avg.discountTotal || 0);
    const maxDiscount = Number(discountStats._max.discountTotal || 0);
    if (avgDiscount > 0 && maxDiscount > avgDiscount * 5) {
      anomalies.push({
        anomalyType: 'SUSPICIOUS_BILLING',
        anomalyScore: 65,
        description: `Maximum discount (₹${maxDiscount.toFixed(0)}) is >5x the average (₹${avgDiscount.toFixed(0)}) in last 7 days`,
        evidence: { avgDiscount, maxDiscount, billsWithDiscount: discountStats._count._all },
      });
    }

    return anomalies;
  }

  private async detectUnusualRefunds(branchId: string) {
    const anomalies: { anomalyType: string; anomalyScore: number; description: string; evidence: object }[] = [];
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);

    const [refundStats, revenueStats] = await Promise.all([
      this.prisma.billRefund.aggregate({
        where: { branchId, refundDate: { gte: sevenDaysAgo } },
        _sum: { amount: true }, _count: { _all: true },
      }),
      this.prisma.billPayment.aggregate({
        where: { branchId, paymentDate: { gte: sevenDaysAgo }, status: 'SUCCESS' },
        _sum: { amount: true },
      }),
    ]);

    const refundTotal = Number(refundStats._sum.amount || 0);
    const revenueTotal = Number(revenueStats._sum.amount || 0);

    if (revenueTotal > 0 && refundTotal / revenueTotal > 0.10) {
      anomalies.push({
        anomalyType: 'UNUSUAL_REFUND',
        anomalyScore: 70,
        description: `Refunds (₹${refundTotal.toFixed(0)}) = ${Math.round((refundTotal / revenueTotal) * 100)}% of revenue in last 7 days`,
        evidence: { refundTotal, revenueTotal, refundRate: refundTotal / revenueTotal, refundCount: refundStats._count._all },
      });
    }

    return anomalies;
  }

  private async detectAbnormalStockAdjustments(branchId: string) {
    const anomalies: { anomalyType: string; anomalyScore: number; description: string; evidence: object }[] = [];
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);

    const adjustments = await this.prisma.stockMovement.aggregate({
      where: { branchId, movementType: 'ADJUSTMENT', createdAt: { gte: sevenDaysAgo }, quantity: { lt: 0 } },
      _sum: { quantity: true }, _count: { _all: true },
    });

    if (adjustments._count._all >= 5) {
      anomalies.push({
        anomalyType: 'STOCK_ADJUSTMENT',
        anomalyScore: 60,
        description: `${adjustments._count._all} negative stock adjustments in last 7 days (total qty: ${Math.abs(Number(adjustments._sum.quantity || 0))})`,
        evidence: { adjustmentCount: adjustments._count._all, totalQtyReduced: Math.abs(Number(adjustments._sum.quantity || 0)) },
      });
    }

    return anomalies;
  }
}
