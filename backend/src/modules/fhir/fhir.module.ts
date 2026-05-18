import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '../../prisma/prisma.module';
import { FhirController } from './fhir.controller';
import { FhirService } from './fhir.service';
import { FhirMapper } from './mappers/fhir.mapper';
import { FhirExportProcessor } from './processors/fhir-export.processor';
import { ExternalEmrService } from './services/external-emr.service';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'fhir-export',
    }),
  ],
  controllers: [FhirController],
  providers: [
    FhirService,
    FhirMapper,
    FhirExportProcessor,
    ExternalEmrService,
  ],
  exports: [FhirService, FhirMapper, ExternalEmrService],
})
export class FhirModule {}
