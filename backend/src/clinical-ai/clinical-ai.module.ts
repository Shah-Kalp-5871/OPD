import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClinicalAiController } from './clinical-ai.controller';
import { ClinicalDecisionSupportService } from './clinical-decision-support.service';
import { ClinicalRiskEngineService } from './clinical-risk-engine.service';
import { InventoryIntelligenceService } from './inventory-intelligence.service';
import { OperationalIntelligenceService } from './operational-intelligence.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClinicalAiController],
  providers: [
    ClinicalDecisionSupportService,
    ClinicalRiskEngineService,
    InventoryIntelligenceService,
    OperationalIntelligenceService,
  ],
  exports: [
    ClinicalDecisionSupportService,
    ClinicalRiskEngineService,
    InventoryIntelligenceService,
    OperationalIntelligenceService,
  ],
})
export class ClinicalAiModule {}
