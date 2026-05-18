import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { RedisCacheService } from '../common/cache/redis-cache.service';
import { BiService } from './bi.service';
import { BiFilterDto } from './dto/bi.dto';

@Injectable()
export class BiDataMartService {
  private readonly logger = new Logger(BiDataMartService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: RedisCacheService,
    private readonly biService: BiService,
  ) {}

  /**
   * Background Materialization Cron Job.
   * Runs daily at midnight to pre-aggregate and freeze daily summaries.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async aggregateDailyDataMart() {
    this.logger.log('Starting daily Analytics Data Mart pre-aggregation...');
    try {
      const branches = await this.prisma.branch.findMany({ where: { isActive: true } });
      const filter = new BiFilterDto();

      // Materialize enterprise-level snapshots
      await this.materializeSnapshot('enterprise_overview', 'global', null, filter);

      // Materialize branch-specific snapshots
      for (const branch of branches) {
        this.logger.log(`Materializing Data Mart snapshot for branch ${branch.name}...`);
        const branchFilter = new BiFilterDto();
        branchFilter.branchId = branch.id;

        await this.materializeSnapshot('branch_overview', branch.id, branch.id, branchFilter);
      }

      this.logger.log('Analytics Data Mart daily snapshot materialization completed.');
    } catch (err: any) {
      this.logger.error(`Failed daily pre-aggregation job: ${err.message}`, err.stack);
    }
  }

  /**
   * Force manual warm-up or re-materialization of snapshots.
   */
  async forceMaterializeAll(): Promise<void> {
    this.logger.log('Manual invocation of Analytics Data Mart materialization...');
    await this.aggregateDailyDataMart();
  }

  /**
   * Helper to compute and write snapshot records to DB & Redis.
   */
  private async materializeSnapshot(
    key: string,
    cacheKeyScope: string,
    branchId: string | null,
    filter: BiFilterDto,
  ) {
    // 1. Calculate the high-fidelity stats
    const overview = await this.biService.getExecutiveOverview(filter, 'SYSTEM_DATA_MART');
    const revenue = await this.biService.getRevenueTrends(filter);
    const forecasting = await this.biService.getForecasting(filter);
    const doctorPerf = await this.biService.getDoctorPerformance(filter);

    const consolidatedData = {
      overview,
      revenue,
      forecasting,
      doctorPerformance: doctorPerf,
      timestamp: new Date().toISOString(),
    };

    // 2. Persist daily snapshot in PostgreSQL table
    await this.prisma.analyticsSnapshot.create({
      data: {
        key,
        branchId,
        data: consolidatedData as any,
        date: new Date(),
      },
    });

    // 3. Inject direct hot-cache key inside Redis
    const redisKey = `datamart:${key}:${branchId || 'enterprise'}`;
    await this.cache.set(redisKey, consolidatedData, 24 * 60 * 60 * 1000); // 24 hours
  }
}
