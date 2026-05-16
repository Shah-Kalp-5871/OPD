import { Module } from '@nestjs/common';
import { LabMasterController } from './lab.controller';
import { LabMasterService } from './lab.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LabMasterController],
  providers: [LabMasterService],
  exports: [LabMasterService],
})
export class LabMasterModule {}
