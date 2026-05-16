import { Module } from '@nestjs/common';
import { LaboratoryService } from './laboratory.service';
import { LaboratoryController } from './laboratory.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [PrismaModule, CommonModule],
  controllers: [LaboratoryController],
  providers: [LaboratoryService],
  exports: [LaboratoryService],
})
export class LaboratoryModule {}
