import { Module } from '@nestjs/common';
import { TelemedicineGateway } from './telemedicine.gateway';
import { TelemedicineService } from './telemedicine.service';
import { TelemedicineController } from './telemedicine.controller';

@Module({
  providers: [TelemedicineGateway, TelemedicineService],
  controllers: [TelemedicineController],
  exports: [TelemedicineService],
})
export class TelemedicineModule {}
