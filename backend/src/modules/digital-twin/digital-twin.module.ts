import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';
import { SimulationEngineService } from './services/simulation-engine.service';
import { CapacityForecastService } from './services/capacity-forecast.service';
import { PatientFlowSimulationService } from './services/patient-flow-simulation.service';
import { DigitalTwinController } from './digital-twin.controller';

@Module({
  imports: [PrismaModule, TenancyModule],
  providers: [SimulationEngineService, CapacityForecastService, PatientFlowSimulationService],
  controllers: [DigitalTwinController],
  exports: [SimulationEngineService, CapacityForecastService, PatientFlowSimulationService],
})
export class DigitalTwinModule {}
