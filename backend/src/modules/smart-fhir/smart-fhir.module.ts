import { Module } from '@nestjs/common';
import { SmartFhirService } from './smart-fhir.service';
import { SmartFhirController } from './smart-fhir.controller';

@Module({
  providers: [SmartFhirService],
  controllers: [SmartFhirController]
})
export class SmartFhirModule {}
