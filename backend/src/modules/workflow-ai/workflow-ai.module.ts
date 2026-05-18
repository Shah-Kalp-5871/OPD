import { Module } from '@nestjs/common';
import { WorkflowAiService } from './workflow-ai.service';
import { WorkflowAiController } from './workflow-ai.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { CommunicationsModule } from '../../communications/communications.module';

@Module({
  imports: [PrismaModule, CommunicationsModule],
  providers: [WorkflowAiService],
  controllers: [WorkflowAiController],
  exports: [WorkflowAiService],
})
export class WorkflowAiModule {}
