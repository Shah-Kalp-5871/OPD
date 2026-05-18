import { Module } from '@nestjs/common';
import { AiImagingService } from './ai-imaging.service';
import { AiImagingController } from './ai-imaging.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AiImagingService],
  controllers: [AiImagingController],
  exports: [AiImagingService],
})
export class AiImagingModule {}
