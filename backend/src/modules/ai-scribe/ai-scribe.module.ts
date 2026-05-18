import { Module } from '@nestjs/common';
import { AiScribeService } from './ai-scribe.service';
import { AiScribeController } from './ai-scribe.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AiScribeService],
  controllers: [AiScribeController],
  exports: [AiScribeService],
})
export class AiScribeModule {}
