import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisCacheService } from '../common/cache/redis-cache.service';

@Injectable()
export class InventoryIntelligenceService {
  private readonly logger = new Logger(InventoryIntelligenceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: RedisCacheService,
  ) {}

  async getStockForecast(branchId: string, daysAhead = 30) {
    return this.cache.getOrSetBranchScoped(branchId, `inv-forecast-${daysAhead}`, null, 60 * 60 * 1000, async () => {
      const lookbackDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      const consumptionData = await this.prisma.stockMovement.groupBy({
        by: ['drugId'],
        where: { branchId, movementType: 'OUT', createdAt: { gte: lookbackDate } },
        _sum: { quantity: true },
      });

      if (!consumptionData.length) return { forecasts: [], generatedAt: new Date().toISOString() };

      const inventories = await this.prisma.drugInventory.findMany({
        where: { branchId, drugId: { in: consumptionData.map((c) => c.drugId) } },
        include: { drug: { select: { drugName: true, genericName: true, formulation: true } } },
      });
      const invMap = new Map(inventories.map((i) => [i.drugId, i]));

      const forecasts = consumptionData.map((c) => {
        const inv = invMap.get(c.drugId);
        if (!inv) return null;
        const dailyRate = Number(c._sum.quantity || 0) / 90;
        const daysUntilExhaustion = dailyRate > 0 ? Math.round(inv.totalStock / dailyRate) : 9999;
        const risk = daysUntilExhaustion <= 7 ? 'CRITICAL' : daysUntilExhaustion <= 14 ? 'HIGH' : daysUntilExhaustion <= 30 ? 'MEDIUM' : 'LOW';
        return {
          drugId: c.drugId,
          drugName: inv.drug.drugName,
          currentStock: inv.totalStock,
          reorderLevel: inv.reorderLevel,
          dailyConsumptionRate: Math.round(dailyRate * 10) / 10,
          daysUntilExhaustion,
          exhaustionRisk: risk,
          recommendedReorderQty: Math.max(0, Math.round(dailyRate * 30) - inv.totalStock + inv.reorderLevel),
        };
      }).filter(Boolean).sort((a, b) => (a!.daysUntilExhaustion) - (b!.daysUntilExhaustion));

      return {
        branchId, forecastDays: daysAhead,
        criticalCount: forecasts.filter((f) => f?.exhaustionRisk === 'CRITICAL').length,
        highRiskCount: forecasts.filter((f) => f?.exhaustionRisk === 'HIGH').length,
        forecasts, generatedAt: new Date().toISOString(),
      };
    });
  }

  async getExpiryRiskReport(branchId: string) {
    return this.cache.getOrSetBranchScoped(branchId, 'expiry-risk', null, 30 * 60 * 1000, async () => {
      const now = new Date();
      const in30 = new Date(now.getTime() + 30 * 86400000);
      const in90 = new Date(now.getTime() + 90 * 86400000);

      const [critical, warning] = await Promise.all([
        this.prisma.drugBatch.findMany({
          where: { isExpired: false, isActive: true, stockQuantity: { gt: 0 }, inventory: { branchId }, expiryDate: { lte: in30 } },
          include: { inventory: { include: { drug: { select: { drugName: true } } } } },
          orderBy: { expiryDate: 'asc' },
        }),
        this.prisma.drugBatch.findMany({
          where: { isExpired: false, isActive: true, stockQuantity: { gt: 0 }, inventory: { branchId }, expiryDate: { gt: in30, lte: in90 } },
          include: { inventory: { include: { drug: { select: { drugName: true } } } } },
          orderBy: { expiryDate: 'asc' }, take: 50,
        }),
      ]);

      const toItem = (b: typeof critical[0]) => ({
        batchNumber: b.batchNumber, drugName: b.inventory.drug.drugName,
        stockQuantity: b.stockQuantity, expiryDate: b.expiryDate,
        daysUntilExpiry: Math.ceil((b.expiryDate.getTime() - now.getTime()) / 86400000),
      });

      return {
        branchId,
        summary: { criticalExpiry30Days: critical.length, warningExpiry90Days: warning.length },
        criticalBatches: critical.map(toItem),
        warningBatches: warning.map(toItem),
        generatedAt: now.toISOString(),
      };
    });
  }

  async getSlowMovingInventory(branchId: string, thresholdDays = 90) {
    const lookbackDate = new Date(Date.now() - thresholdDays * 86400000);
    const inventory = await this.prisma.drugInventory.findMany({
      where: { branchId, totalStock: { gt: 0 } },
      include: {
        drug: { select: { drugName: true, drugCategory: true } },
        movements: { where: { movementType: 'OUT', createdAt: { gte: lookbackDate } }, select: { quantity: true } },
      },
    });

    const slowMoving = inventory
      .map((inv) => {
        const totalOut = inv.movements.reduce((s, m) => s + m.quantity, 0);
        return { drugId: inv.drugId, drugName: inv.drug.drugName, currentStock: inv.totalStock,
          consumedInPeriod: totalOut, dailyRate: Math.round((totalOut / thresholdDays) * 100) / 100 };
      })
      .filter((item) => item.dailyRate < 0.1)
      .sort((a, b) => a.dailyRate - b.dailyRate);

    return { branchId, thresholdDays, slowMovingCount: slowMoving.length, items: slowMoving, generatedAt: new Date().toISOString() };
  }

  async getReorderRecommendations(branchId: string) {
    const inventory = await this.prisma.drugInventory.findMany({
      where: { branchId, OR: [{ status: 'LOW_STOCK' }, { status: 'OUT_OF_STOCK' }] },
      include: { drug: { select: { drugName: true, genericName: true, formulation: true, unitPrice: true } } },
      orderBy: { totalStock: 'asc' },
    });

    return {
      branchId, reorderCount: inventory.length,
      recommendations: inventory.map((inv) => ({
        drugId: inv.drugId, drugName: inv.drug.drugName, genericName: inv.drug.genericName,
        currentStock: inv.totalStock, reorderLevel: inv.reorderLevel, status: inv.status,
        suggestedOrderQty: Math.max(inv.reorderLevel * 3, 50),
        estimatedCost: Number(inv.drug.unitPrice) * Math.max(inv.reorderLevel * 3, 50),
      })),
      generatedAt: new Date().toISOString(),
    };
  }
}
