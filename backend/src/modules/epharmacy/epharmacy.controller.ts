import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { EpharmacyService } from './epharmacy.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('api/v2/epharmacy')
@UseGuards(JwtAuthGuard)
export class EpharmacyController {
  constructor(private readonly epharmacyService: EpharmacyService) {}

  @Post(':tenantId/prescriptions')
  createPrescription(
    @Param('tenantId') tenantId: string,
    @Body() body: {
      doctorId: string;
      patientId: string;
      items: any[];
      encounterId?: string;
      refillsAllowed?: number;
      isControlled?: boolean;
      validDays?: number;
    },
  ) {
    return this.epharmacyService.createPrescription(tenantId, body.doctorId, body.patientId, body.items, {
      encounterId: body.encounterId,
      refillsAllowed: body.refillsAllowed,
      isControlled: body.isControlled,
      validDays: body.validDays,
    });
  }

  @Get('verify/:qrCode')
  verifyPrescription(@Param('qrCode') qrCode: string) {
    return this.epharmacyService.verifyPrescription(qrCode);
  }

  @Patch(':tenantId/prescriptions/dispense')
  dispensePrescription(
    @Param('tenantId') tenantId: string,
    @Body() body: { qrCode: string; pharmacistId: string },
  ) {
    return this.epharmacyService.dispensePrescription(tenantId, body.qrCode, body.pharmacistId);
  }

  @Patch(':tenantId/prescriptions/:id/refill')
  requestRefill(@Param('tenantId') tenantId: string, @Param('id') prescriptionId: string) {
    return this.epharmacyService.requestRefill(tenantId, prescriptionId);
  }

  @Get(':tenantId/prescriptions')
  getPrescriptions(@Param('tenantId') tenantId: string, @Query('patientId') patientId?: string) {
    return this.epharmacyService.getPrescriptions(tenantId, patientId);
  }
}
