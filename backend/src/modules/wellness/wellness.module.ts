import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';
import { HealthGoalService } from './services/health-goal.service';
import { CarePlanService } from './services/care-plan.service';
import { WellnessTrackingService } from './services/wellness-tracking.service';
import { WellnessController } from './wellness.controller';

@Module({
  imports: [PrismaModule, TenancyModule],
  providers: [HealthGoalService, CarePlanService, WellnessTrackingService],
  controllers: [WellnessController],
  exports: [HealthGoalService, CarePlanService, WellnessTrackingService],
})
export class WellnessModule {}