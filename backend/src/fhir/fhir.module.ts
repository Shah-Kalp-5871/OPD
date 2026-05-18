import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FhirController } from './fhir.controller';
import { FhirService } from './fhir.service';
import { FhirMapper } from './fhir.mapper';

@Module({
  imports: [PrismaModule],
  controllers: [FhirController],
  providers: [FhirService, FhirMapper],
  exports: [FhirService, FhirMapper],
})
export class FhirModule {}
