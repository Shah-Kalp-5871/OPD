import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';
import { CareJourneyService } from './services/care-journey.service';
import { RiskNavigationEngineService } from './services/risk-navigation-engine.service';
import { ClinicalPathwayOptimizerService } from './services/clinical-pathway-optimizer.service';
import { ClinicalNavigationController } from './clinical-navigation.controller';

@Module({
  imports: [PrismaModule, TenancyModule],
  providers: [CareJourneyService, RiskNavigationEngineService, ClinicalPathwayOptimizerService],
  controllers: [ClinicalNavigationController],
  exports: [CareJourneyService, RiskNavigationEngineService, ClinicalPathwayOptimizerService],
})
export class ClinicalNavigationModule {}
