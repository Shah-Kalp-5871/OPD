import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AnalyticsService } from '../../analytics/analytics.service';
import { RedisCacheService } from '../../common/cache/redis-cache.service';
import { PrismaService } from '../../prisma/prisma.service';

@Processor('reports')
export class ReportsProcessor extends WorkerHost {
  private readonly logger = new Logger(ReportsProcessor.name);

  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly cache: RedisCacheService,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);

    switch (job.name) {
      case 'generate-daily-snapshot':
        return this.handleDailySnapshot(job.data);
      default:
        this.logger.warn(`Unknown job type: ${job.name}`);
    }
  }

  private async handleDailySnapshot(data: any) {
    this.logger.log('Generating daily enterprise snapshot...');
    
    try {
      const branches = await this.prisma.branch.findMany({ where: { isActive: true } });
      
      // Warm up branch-specific caches
      for (const branch of branches) {
        this.logger.log(`Warming up cache for branch ${branch.id}...`);
        
        // This simulates a heavy operation being pre-computed
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        // You could trigger analytics service functions here that populate the cache
        // Currently, our getOrSet logic sets the cache when called. To warm it up, 
        // we can simply call the method.
      }
      
      // Warm up global enterprise cache
      await this.analyticsService.getEnterpriseBranchComparison();
      await this.analyticsService.getInventoryAnalytics();
      
      this.logger.log('Daily snapshot and cache warmup completed successfully');
      return { success: true };
    } catch (error: any) {
      this.logger.error(`Failed to generate daily snapshot: ${error.message}`, error.stack);
      throw error;
    }
  }
}
