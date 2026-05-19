import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';
import { NpsAnalyticsService } from './services/nps-analytics.service';
import { SentimentAnalysisService } from './services/sentiment-analysis.service';
import { ExperienceController } from './experience.controller';

@Module({
  imports: [PrismaModule, TenancyModule],
  providers: [NpsAnalyticsService, SentimentAnalysisService],
  controllers: [ExperienceController],
  exports: [NpsAnalyticsService, SentimentAnalysisService],
})
export class ExperienceModule {}