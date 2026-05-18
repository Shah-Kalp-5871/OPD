import { Module } from '@nestjs/common';
import { PharmacyIntelligenceService } from './pharmacy-intelligence.service';
import { PharmacyIntelligenceController } from './pharmacy-intelligence.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';

@Module({
  imports: [PrismaModule, TenancyModule],
  controllers: [PharmacyIntelligenceController],
  providers: [PharmacyIntelligenceService],
  exports: [PharmacyIntelligenceService],
})
export class PharmacyIntelligenceModule {}
