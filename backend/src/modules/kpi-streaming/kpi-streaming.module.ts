import { Module } from '@nestjs/common';
import { LiveAnalyticsService } from './live-analytics/live-analytics.service';
import { RealtimeMetricsGateway } from './realtime-metrics/realtime-metrics.gateway';
import { KpiStreamingController } from './kpi-streaming.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';

@Module({
  imports: [PrismaModule, TenancyModule],
  providers: [LiveAnalyticsService, RealtimeMetricsGateway],
  controllers: [KpiStreamingController],
  exports: [LiveAnalyticsService, RealtimeMetricsGateway],
})
export class KpiStreamingModule {}
