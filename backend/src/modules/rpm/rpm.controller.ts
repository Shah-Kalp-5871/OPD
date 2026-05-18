import { Controller, Post, Get, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { RpmService } from './rpm.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('api/v2/rpm')
@UseGuards(JwtAuthGuard)
export class RpmController {
  constructor(private readonly rpmService: RpmService) {}

  @Post(':tenantId/devices')
  enrollDevice(
    @Param('tenantId') tenantId: string,
    @Body() body: { patientId: string; deviceType: string; serialNumber: string; firmwareVersion?: string },
  ) {
    return this.rpmService.enrollDevice(tenantId, body.patientId, body.deviceType, body.serialNumber, body.firmwareVersion);
  }

  @Get(':tenantId/devices')
  getDevices(@Param('tenantId') tenantId: string, @Query('patientId') patientId?: string) {
    return this.rpmService.getDevices(tenantId, patientId);
  }

  @Delete(':tenantId/devices/:deviceId')
  revokeDevice(@Param('tenantId') tenantId: string, @Param('deviceId') deviceId: string) {
    return this.rpmService.revokeDevice(tenantId, deviceId);
  }

  @Post(':tenantId/readings')
  ingestReading(
    @Param('tenantId') tenantId: string,
    @Body() body: { pairingToken: string; type: string; value: any; unit?: string },
  ) {
    return this.rpmService.ingestReading(tenantId, body.pairingToken, body.type, body.value, body.unit);
  }

  @Get(':tenantId/alerts')
  getAlerts(@Param('tenantId') tenantId: string, @Query('patientId') patientId?: string) {
    return this.rpmService.getAlerts(tenantId, patientId);
  }

  @Patch(':tenantId/alerts/:alertId/acknowledge')
  acknowledgeAlert(
    @Param('tenantId') tenantId: string,
    @Param('alertId') alertId: string,
    @Body() body: { userId: string },
  ) {
    return this.rpmService.acknowledgeAlert(tenantId, alertId, body.userId);
  }
}
