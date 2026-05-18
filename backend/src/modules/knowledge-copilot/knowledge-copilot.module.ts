import { Module } from '@nestjs/common';
import { KnowledgeCopilotService } from './knowledge-copilot.service';
import { KnowledgeCopilotController } from './knowledge-copilot.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [KnowledgeCopilotService],
  controllers: [KnowledgeCopilotController],
  exports: [KnowledgeCopilotService],
})
export class KnowledgeCopilotModule {}
