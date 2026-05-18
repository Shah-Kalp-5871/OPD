import {
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RequestApiClientContext } from '../context/request-api-client.context';
import {
  API_CLIENT_MONTHLY_RESET_DATA,
  API_CLIENT_QUOTA_REFRESH_SELECT,
  API_CLIENT_QUOTA_SELECT,
  API_CLIENT_SUMMARY_SELECT,
  API_CLIENT_TENANT_USAGE_SELECT,
  API_CLIENT_USAGE_UPDATE_DATA,
  asApiClientSelect,
  toApiClientTenantUsageRow,
  toApiClientUsageQuota,
  toApiClientUsageSummary,
} from './api-client-usage.select';

export interface RecordUsageParams {
  ctx: RequestApiClientContext;
  endpoint: string;
  method: string;
  statusCode: number;
  durationMs: number;
  responseBytes?: number;
}

@Injectable()
export class ApiUsageService {
  private readonly logger = new Logger(ApiUsageService.name);

  constructor(private readonly prisma: PrismaService) {}

  async assertQuotaAvailable(ctx: RequestApiClientContext): Promise<void> {
    const client = toApiClientUsageQuota(
      await this.prisma.apiClient.findUnique({
        where: { clientId: ctx.clientId },
        select: asApiClientSelect(API_CLIENT_QUOTA_SELECT),
      }),
    );

    if (!client) {
      throw new ForbiddenException('API client not found');
    }

    await this.maybeResetMonthlyUsage(ctx.clientId, client.usageResetAt);

    const refreshed = toApiClientUsageQuota(
      await this.prisma.apiClient.findUnique({
        where: { clientId: ctx.clientId },
        select: asApiClientSelect(API_CLIENT_QUOTA_REFRESH_SELECT),
      }),
    );

    if (
      refreshed &&
      refreshed.monthlyUsageCount >= refreshed.monthlyQuota
    ) {
      throw new ForbiddenException('Monthly API quota exceeded');
    }
  }

  async recordUsage(params: RecordUsageParams): Promise<void> {
    const { ctx, endpoint, method, statusCode, durationMs, responseBytes = 0 } = params;

    try {
      await this.prisma.$transaction([
        this.prisma.apiUsageRecord.create({
          data: {
            clientId: ctx.clientId,
            tenantId: ctx.tenantId,
            endpoint,
            method,
            statusCode,
            durationMs,
            responseBytes,
          },
        }),
        this.prisma.apiClient.update({
          where: { clientId: ctx.clientId },
          data: API_CLIENT_USAGE_UPDATE_DATA,
        }),
      ]);

      if (ctx.tenantId) {
        await this.incrementTenantMetric(ctx.tenantId, 1);
        await this.prisma.featureUsageLog.create({
          data: {
            tenantId: ctx.tenantId,
            featureKey: 'PUBLIC_API',
            actionCost: 1,
          },
        });
      }
    } catch (error) {
      this.logger.warn(`Usage record failed: ${(error as Error).message}`);
    }
  }

  async getClientUsageSummary(clientId: string) {
    const client = toApiClientUsageSummary(
      await this.prisma.apiClient.findUnique({
        where: { clientId },
        select: asApiClientSelect(API_CLIENT_SUMMARY_SELECT),
      }),
    );

    if (!client) return null;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [topEndpoints, recentAudit, webhookDeliveries] = await Promise.all([
      this.prisma.apiUsageRecord.groupBy({
        by: ['endpoint'],
        where: { clientId, createdAt: { gte: monthStart } },
        _count: { endpoint: true },
        _avg: { durationMs: true },
        orderBy: { _count: { endpoint: 'desc' } },
        take: 10,
      }),
      this.prisma.apiAuditLog.findMany({
        where: { clientId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      this.prisma.apiWebhookDelivery.findMany({
        where: { subscription: { clientId } },
        orderBy: { createdAt: 'desc' },
        take: 25,
        include: { subscription: { select: { url: true } } },
      }),
    ]);

    const { _count, ...clientSummary } = client;

    return {
      client: clientSummary,
      counts: _count,
      topEndpoints: topEndpoints.map((e) => ({
        endpoint: e.endpoint,
        count: e._count.endpoint,
        avgDurationMs: Math.round(e._avg.durationMs ?? 0),
      })),
      recentAudit,
      webhookDeliveries,
    };
  }

  async getTenantUsageAnalytics(tenantId: string) {
    const rows = await this.prisma.apiClient.findMany({
      where: { tenantId },
      select: asApiClientSelect(API_CLIENT_TENANT_USAGE_SELECT),
    });
    const clients = rows.map((row) => toApiClientTenantUsageRow(row));

    const usage = await this.prisma.subscriptionUsage.findUnique({
      where: {
        tenantId_metricName: { tenantId, metricName: 'API_CALLS' },
      },
    });

    const daily = await this.prisma.apiUsageRecord.groupBy({
      by: ['endpoint'],
      where: {
        tenantId,
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
      _count: { endpoint: true },
      orderBy: { _count: { endpoint: 'desc' } },
      take: 15,
    });

    return {
      clients,
      subscriptionUsage: usage,
      topEndpoints: daily.map((d) => ({
        endpoint: d.endpoint,
        count: d._count.endpoint,
      })),
    };
  }

  async aggregateMonthlySummaries(): Promise<number> {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 1);

    const clients = await this.prisma.apiClient.findMany({
      where: { isActive: true },
      select: { clientId: true, tenantId: true },
    });

    let processed = 0;
    for (const client of clients) {
      const records = await this.prisma.apiUsageRecord.findMany({
        where: {
          clientId: client.clientId,
          createdAt: { gte: monthStart, lt: monthEnd },
        },
      });

      if (records.length === 0) continue;

      const totalRequests = records.length;
      const totalBytes = records.reduce((s, r) => s + r.responseBytes, 0);
      const avgDurationMs =
        records.reduce((s, r) => s + r.durationMs, 0) / totalRequests;

      const endpointStats: Record<string, number> = {};
      for (const r of records) {
        endpointStats[r.endpoint] = (endpointStats[r.endpoint] ?? 0) + 1;
      }

      await this.prisma.apiUsageMonthlySummary.upsert({
        where: {
          clientId_year_month: {
            clientId: client.clientId,
            year,
            month,
          },
        },
        create: {
          clientId: client.clientId,
          tenantId: client.tenantId,
          year,
          month,
          totalRequests,
          totalBytes: BigInt(totalBytes),
          avgDurationMs,
          endpointStats,
        },
        update: {
          totalRequests,
          totalBytes: BigInt(totalBytes),
          avgDurationMs,
          endpointStats,
        },
      });
      processed += 1;
    }

    return processed;
  }

  private async maybeResetMonthlyUsage(clientId: string, usageResetAt: Date | null) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    if (!usageResetAt || usageResetAt < startOfMonth) {
      await this.prisma.apiClient.update({
        where: { clientId },
        data: API_CLIENT_MONTHLY_RESET_DATA(startOfMonth),
      });
    }
  }

  private async incrementTenantMetric(tenantId: string, delta: number) {
    const resetAt = new Date();
    resetAt.setMonth(resetAt.getMonth() + 1, 1);
    resetAt.setHours(0, 0, 0, 0);

    await this.prisma.subscriptionUsage.upsert({
      where: {
        tenantId_metricName: { tenantId, metricName: 'API_CALLS' },
      },
      create: {
        tenantId,
        metricName: 'API_CALLS',
        currentUsage: delta,
        limitMax: 500000,
        resetAt,
      },
      update: {
        currentUsage: { increment: delta },
      },
    });
  }
}
