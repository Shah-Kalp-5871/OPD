import { Module } from '@nestjs/common';
import { ExecutiveInsightService } from './executive-insight/executive-insight.service';
import { ExecutiveAiController } from './executive-ai.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';

@Module({
  imports: [PrismaModule, TenancyModule],
  providers: [ExecutiveInsightService],
  controllers: [ExecutiveAiController],
  exports: [ExecutiveInsightService],
})
export class ExecutiveAiModule {}
