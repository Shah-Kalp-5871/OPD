import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';
import { GlobalTelemetryService } from './services/global-telemetry.service';
import { SystemOrchestrationService } from './services/system-orchestration.service';
import { ExecutiveCommandService } from './services/executive-command.service';
import { RegionalOperationsService } from './services/regional-operations.service';
import { CrossModuleCoordinatorService } from './services/cross-module-coordinator.service';
import { QuantumOptimizationService } from './services/quantum-optimization.service';
import { GlobalCommandCenterController } from './global-command-center.controller';

@Module({
  imports: [PrismaModule, TenancyModule],
  providers: [
    GlobalTelemetryService,
    SystemOrchestrationService,
    ExecutiveCommandService,
    RegionalOperationsService,
    CrossModuleCoordinatorService,
    QuantumOptimizationService,
  ],
  controllers: [GlobalCommandCenterController],
  exports: [
    GlobalTelemetryService,
    SystemOrchestrationService,
    ExecutiveCommandService,
    RegionalOperationsService,
    CrossModuleCoordinatorService,
    QuantumOptimizationService,
  ],
})
export class GlobalCommandCenterModule {}
