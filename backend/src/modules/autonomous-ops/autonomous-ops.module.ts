import { Module } from '@nestjs/common';
import { AutonomousOpsController } from './autonomous-ops.controller';
import { SelfHealingService } from './services/self-healing.service';
import { InfrastructureAiService } from './services/infrastructure-ai.service';
import { CapacityForecastService } from './services/capacity-forecast.service';
import { AnomalyDetectionService } from './services/anomaly-detection.service';
import { OperationalOptimizationService } from './services/operational-optimization.service';
import { AiDecisionService } from './services/ai-decision.service';
import { AutonomousEscalationService } from './services/autonomous-escalation.service';
import { TenancyModule } from '../tenancy/tenancy.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule, TenancyModule],
  controllers: [AutonomousOpsController],
  providers: [
    SelfHealingService,
    InfrastructureAiService,
    CapacityForecastService,
    AnomalyDetectionService,
    OperationalOptimizationService,
    AiDecisionService,
    AutonomousEscalationService,
  ],
  exports: [
    SelfHealingService,
    InfrastructureAiService,
    CapacityForecastService,
    AnomalyDetectionService,
    OperationalOptimizationService,
    AiDecisionService,
    AutonomousEscalationService,
  ],
})
export class AutonomousOpsModule {}