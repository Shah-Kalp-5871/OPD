import { Module } from '@nestjs/common';
import { VirtualHospitalService } from './virtual-hospital.service';
import { VirtualHospitalController } from './virtual-hospital.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [VirtualHospitalService],
  controllers: [VirtualHospitalController],
  exports: [VirtualHospitalService],
})
export class VirtualHospitalModule {}
