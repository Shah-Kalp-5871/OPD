import { Module } from '@nestjs/common';
import { SavedReportService } from './saved-report/saved-report.service';
import { DashboardTemplateService } from './dashboard-template/dashboard-template.service';
import { BiAnalyticsController } from './bi-analytics.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';

@Module({
  imports: [PrismaModule, TenancyModule],
  providers: [SavedReportService, DashboardTemplateService],
  controllers: [BiAnalyticsController],
  exports: [SavedReportService, DashboardTemplateService],
})
export class BiAnalyticsModule {}
