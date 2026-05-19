import { Module } from '@nestjs/common';
import { WorkflowAiService } from './workflow-ai.service';
import { WorkflowAiController } from './workflow-ai.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';

@Module({
  imports: [PrismaModule, TenancyModule],
  providers: [WorkflowAiService],
  controllers: [WorkflowAiController],
  exports: [WorkflowAiService],
})
export class WorkflowAiModule {}
