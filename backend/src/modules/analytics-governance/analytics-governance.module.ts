import { Module } from '@nestjs/common';
import { AnalyticsExportService } from './analytics-export/analytics-export.service';
import { AnalyticsGovernanceService } from './analytics-governance/analytics-governance.service';
import { AnalyticsGovernanceController } from './analytics-governance.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';

@Module({
  imports: [PrismaModule, TenancyModule],
  providers: [AnalyticsExportService, AnalyticsGovernanceService],
  controllers: [AnalyticsGovernanceController],
  exports: [AnalyticsExportService, AnalyticsGovernanceService],
})
export class AnalyticsGovernanceModule {}
