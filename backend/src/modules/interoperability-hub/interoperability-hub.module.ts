import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';
import { Hl7BridgeService } from './services/hl7-bridge.service';
import { DicomExchangeService } from './services/dicom-exchange.service';
import { ExternalFacilitySyncService } from './services/external-facility-sync.service';
import { InteroperabilityHubController } from './interoperability-hub.controller';

@Module({
  imports: [PrismaModule, TenancyModule],
  providers: [Hl7BridgeService, DicomExchangeService, ExternalFacilitySyncService],
  controllers: [InteroperabilityHubController],
  exports: [Hl7BridgeService, DicomExchangeService, ExternalFacilitySyncService],
})
export class InteroperabilityHubModule {}
