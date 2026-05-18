import { Module } from '@nestjs/common';
import { FinancialIntelligenceService } from './financial-intelligence.service';
import { FinancialIntelligenceController } from './financial-intelligence.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [FinancialIntelligenceService],
  controllers: [FinancialIntelligenceController],
  exports: [FinancialIntelligenceService],
})
export class FinancialIntelligenceModule {}
