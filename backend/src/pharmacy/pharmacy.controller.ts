import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { DispenseMedicationDto, ReceiveStockDto, AdjustStockDto } from './dto/pharmacy.dto';

@Controller('pharmacy')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'MEDICAL', 'PHARMACY') // Using MEDICAL and PHARMACY roles
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Get('queue')
  async getQueue() {
    return this.pharmacyService.getPharmacyQueue();
  }

  @Post('dispense')
  async dispense(@Body() dto: DispenseMedicationDto, @Request() req) {
    return this.pharmacyService.dispenseMedication(dto, req.user.id);
  }

  @Get('inventory')
  async getInventory() {
    return this.pharmacyService.getInventory();
  }

  @Get('prescriptions/:caseId')
  async getCasePrescriptions(@Param('caseId') caseId: string) {
    return this.pharmacyService.getCasePrescriptions(caseId);
  }

  @Get('inventory/alerts')
  async getAlerts() {
    return this.pharmacyService.getInventoryAlerts();
  }

  @Get('inventory/valuation')
  async getValuation() {
    return this.pharmacyService.getStockValuation();
  }

  @Get('inventory/movements')
  async getMovements(
    @Query('drugId') drugId?: string,
    @Query('batchId') batchId?: string,
  ) {
    return this.pharmacyService.getMovementHistory({ drugId, batchId });
  }

  @Post('inventory/receive')
  async receiveStock(@Body() dto: ReceiveStockDto, @Request() req) {
    return this.pharmacyService.receiveStock(dto, req.user.id);
  }

  @Post('inventory/adjust')
  async adjustStock(@Body() dto: AdjustStockDto, @Request() req) {
    return this.pharmacyService.adjustStock(dto, req.user.id);
  }
}
