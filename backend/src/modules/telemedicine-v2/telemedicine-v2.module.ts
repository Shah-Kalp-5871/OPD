import { Module } from '@nestjs/common';
import { TelemedicineV2Service } from './telemedicine-v2.service';
import { TelemedicineV2Controller } from './telemedicine-v2.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TelemedicineV2Service],
  controllers: [TelemedicineV2Controller],
  exports: [TelemedicineV2Service],
})
export class TelemedicineV2Module {}
