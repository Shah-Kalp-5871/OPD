import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PharmacyIntelligenceService } from './pharmacy-intelligence.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';

@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('pharmacy-intelligence')
export class PharmacyIntelligenceController {
  constructor(private readonly svc: PharmacyIntelligenceService) {}

  @Get('dashboard')
  getDashboard() { return this.svc.getDashboardData(); }

  @Post('medications')
  addMedication(@Body() body: Parameters<PharmacyIntelligenceService['addMedicationInventory']>[0]) {
    return this.svc.addMedicationInventory(body);
  }

  @Post('batches')
  addBatch(@Body() body: { medicationId: string; batchNumber: string; quantity: number; expiryDate: string; manufacturedBy?: string }) {
    return this.svc.addBatch({ ...body, expiryDate: new Date(body.expiryDate) });
  }

  @Post('dispense')
  recordDispense(@Body() body: Parameters<PharmacyIntelligenceService['recordDispense']>[0]) {
    return this.svc.recordDispense(body);
  }

  @Get('anomalies')
  runAnomalyDetection() { return this.svc.runAnomalyDetection(); }
}
