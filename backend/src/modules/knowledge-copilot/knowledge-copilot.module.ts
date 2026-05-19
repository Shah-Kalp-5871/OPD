import { Module } from '@nestjs/common';
import { KnowledgeCopilotService } from './knowledge-copilot.service';
import { KnowledgeCopilotController } from './knowledge-copilot.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';

@Module({
  imports: [PrismaModule, TenancyModule],
  providers: [KnowledgeCopilotService],
  controllers: [KnowledgeCopilotController],
  exports: [KnowledgeCopilotService],
})
export class KnowledgeCopilotModule {}
