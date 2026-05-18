import { Module } from '@nestjs/common';
import { BiController } from './bi.controller';
import { BiService } from './bi.service';
import { BiDataMartService } from './bi-data-mart.service';
import { BiExportService } from './bi-export.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BiController],
  providers: [BiService, BiDataMartService, BiExportService],
  exports: [BiService, BiDataMartService, BiExportService],
})
export class BiModule {}
