import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class FailoverManagerService {
  private readonly logger = new Logger(FailoverManagerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async getFailoverEvents() {
    const tenantId = this.getTenantId();
    let events = await this.prisma.failoverEvent.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    if (events.length === 0) {
      // Seed an initial complete failover event
      await this.prisma.failoverEvent.create({
        data: {
          tenantId,
          sourceRegion: 'eu-west-1',
          targetRegion: 'us-east-1',
          triggerReason: 'Replication lag exceeded 5000ms thresholds',
          status: 'COMPLETED',
          durationSeconds: 42,
          initiatedBy: 'AUTONOMOUS_ORCHESTRATOR',
        },
      });

      events = await this.prisma.failoverEvent.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
      });
    }

    return events;
  }

  async triggerFailover(source: string, target: string, reason: string) {
    const tenantId = this.getTenantId();
    this.logger.warn(`FAILOVER PROCESS TRIGGERED: ${source} -> ${target}`);
    
    // Create direct record
    const event = await this.prisma.failoverEvent.create({
      data: {
        tenantId,
        sourceRegion: source,
        targetRegion: target,
        triggerReason: reason,
        status: 'IN_PROGRESS',
        initiatedBy: 'ADMIN_MANUAL_BYPASS',
      },
    });

    // Update cloud region health state
    await this.prisma.cloudRegion.updateMany({
      where: { tenantId, regionCode: source },
      data: { status: 'DEGRADED' },
    });

    await this.prisma.cloudRegion.updateMany({
      where: { tenantId, regionCode: target },
      data: { status: 'HEALTHY' },
    });

    // Simulate complete process duration
    setTimeout(async () => {
      try {
        await this.prisma.failoverEvent.update({
          where: { id: event.id },
          data: { status: 'COMPLETED', durationSeconds: 15 },
        });
      } catch (err) {
        this.logger.error('Failed to complete background failover record update', err);
      }
    }, 2000);

    return event;
  }
}