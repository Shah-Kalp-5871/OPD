import { Module } from '@nestjs/common';
import { MedicalRepresentativesController } from './medical-representatives.controller';
import { MedicalRepresentativesService } from './medical-representatives.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MedicalRepresentativesController],
  providers: [MedicalRepresentativesService],
})
export class MedicalRepresentativesModule {}
