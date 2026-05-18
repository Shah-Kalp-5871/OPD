import { Module } from '@nestjs/common';
import { ErpIntelligenceService } from './erp-intelligence.service';
import { ErpIntelligenceController } from './erp-intelligence.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';

@Module({
  imports: [PrismaModule, TenancyModule],
  controllers: [ErpIntelligenceController],
  providers: [ErpIntelligenceService],
  exports: [ErpIntelligenceService],
})
export class ErpIntelligenceModule {}
