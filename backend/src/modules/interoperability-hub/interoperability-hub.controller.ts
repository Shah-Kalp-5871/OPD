import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { Hl7BridgeService } from './services/hl7-bridge.service';
import { DicomExchangeService } from './services/dicom-exchange.service';
import { ExternalFacilitySyncService } from './services/external-facility-sync.service';

@Controller('interoperability-hub')
@UseGuards(JwtAuthGuard, TenantGuard)
export class InteroperabilityHubController {
  constructor(
    private readonly hl7Service: Hl7BridgeService,
    private readonly dicomService: DicomExchangeService,
    private readonly syncService: ExternalFacilitySyncService,
  ) {}

  @Post('hl7/log')
  async logHl7(@Body() data: any) {
    return this.hl7Service.parseAndLogHl7(data);
  }

  @Get('hl7/logs')
  async getHl7Logs() {
    return this.hl7Service.getLogs();
  }

  @Post('dicom/route')
  async routeDicom(@Body() data: any) {
    return this.dicomService.routeDicomStudy(data);
  }

  @Get('dicom/logs')
  async getDicomLogs() {
    return this.dicomService.getRouteLogs();
  }

  @Post('facilities/connect')
  async connectFacility(@Body() data: any) {
    return this.syncService.createConnection(data);
  }

  @Get('facilities')
  async getFacilities() {
    return this.syncService.getConnections();
  }

  @Post('resources/sync')
  async syncResource(@Body() data: any) {
    return this.syncService.syncResources(data);
  }

  @Get('resources/syncs')
  async getSyncs() {
    return this.syncService.getSyncs();
  }
}
