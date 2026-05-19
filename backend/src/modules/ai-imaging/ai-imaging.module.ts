import { Module } from '@nestjs/common';
import { AiImagingService } from './ai-imaging.service';
import { AiImagingController } from './ai-imaging.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';

@Module({
  imports: [PrismaModule, TenancyModule],
  providers: [AiImagingService],
  controllers: [AiImagingController],
  exports: [AiImagingService],
})
export class AiImagingModule {}
