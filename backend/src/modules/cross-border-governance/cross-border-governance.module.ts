import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';
import { RegionalComplianceEngine } from './services/regional-compliance.service';
import { CrossBorderGovernanceController } from './cross-border-governance.controller';

@Module({
  imports: [PrismaModule, TenancyModule],
  providers: [RegionalComplianceEngine],
  controllers: [CrossBorderGovernanceController],
  exports: [RegionalComplianceEngine],
})
export class CrossBorderGovernanceModule {}
