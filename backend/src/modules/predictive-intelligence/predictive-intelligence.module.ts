import { Module } from '@nestjs/common';
import { PredictiveIntelligenceService } from './predictive-intelligence.service';
import { PredictiveIntelligenceController } from './predictive-intelligence.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { CommunicationHubModule } from '../communication-hub/communication-hub.module';
import { TenancyModule } from '../tenancy/tenancy.module';

@Module({
  imports: [PrismaModule, CommunicationHubModule, TenancyModule],
  providers: [PredictiveIntelligenceService],
  controllers: [PredictiveIntelligenceController],
  exports: [PredictiveIntelligenceService],
})
export class PredictiveIntelligenceModule {}
