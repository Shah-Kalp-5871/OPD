import { Module } from '@nestjs/common';
import { PredictiveIntelligenceService } from './predictive-intelligence.service';
import { PredictiveIntelligenceController } from './predictive-intelligence.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { CommunicationsModule } from '../../communications/communications.module';

@Module({
  imports: [PrismaModule, CommunicationsModule],
  providers: [PredictiveIntelligenceService],
  controllers: [PredictiveIntelligenceController],
  exports: [PredictiveIntelligenceService],
})
export class PredictiveIntelligenceModule {}
