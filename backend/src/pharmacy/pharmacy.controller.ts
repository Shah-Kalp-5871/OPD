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
import {
  DispenseMedicationDto,
  ReceiveStockDto,
  AdjustStockDto,
} from './dto/pharmacy.dto';

import { BranchId } from '../common/decorators/branch-id.decorator';
import { BranchGuard } from '../common/guards/branch.guard';

@Controller('pharmacy')
@UseGuards(JwtAuthGuard, RolesGuard, BranchGuard)
@Roles('ADMIN', 'MEDICAL', 'PHARMACY')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Get('queue')
  async getQueue(@BranchId() branchId: string) {
    return this.pharmacyService.getPharmacyQueue(branchId);
  }

  @Get('drugs/search')
  @Roles('ADMIN', 'MEDICAL', 'PHARMACY', 'DOCTOR')
  async searchDrugs(
    @Query('search') search?: string,
    @Query('limit') limit?: string
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 20;
    const items = await this.pharmacyService.searchUnifiedDrugs(search || '', parsedLimit);
    return {
      items,
      total: items.length,
      page: 1,
      limit: parsedLimit,
      totalPages: 1
    };
  }

  @Post('dispense')
  async dispense(
    @Body() dto: DispenseMedicationDto,
    @Request() req,
    @BranchId() branchId: string,
  ) {
    return this.pharmacyService.dispenseMedication(dto, req.user.id, branchId);
  }

  @Get('inventory')
  async getInventory(@BranchId() branchId: string) {
    return this.pharmacyService.getInventory(branchId);
  }

  @Get('prescriptions/:caseId')
  async getCasePrescriptions(@Param('caseId') caseId: string) {
    return this.pharmacyService.getCasePrescriptions(caseId);
  }

  @Get('inventory/alerts')
  async getAlerts(@BranchId() branchId: string) {
    return this.pharmacyService.getInventoryAlerts(branchId);
  }

  @Get('inventory/valuation')
  async getValuation(@BranchId() branchId: string) {
    return this.pharmacyService.getStockValuation(branchId);
  }

  @Get('inventory/movements')
  async getMovements(
    @Query('drugId') drugId: string,
    @Query('batchId') batchId: string,
    @BranchId() branchId: string,
  ) {
    return this.pharmacyService.getMovementHistory(
      { drugId, batchId },
      branchId,
    );
  }

  @Post('inventory/receive')
  async receiveStock(
    @Body() dto: ReceiveStockDto,
    @Request() req,
    @BranchId() branchId: string,
  ) {
    return this.pharmacyService.receiveStock(dto, req.user.id, branchId);
  }

  @Post('inventory/adjust')
  async adjustStock(
    @Body() dto: AdjustStockDto,
    @Request() req,
    @BranchId() branchId: string,
  ) {
    return this.pharmacyService.adjustStock(dto, req.user.id, branchId);
  }

  @Post('return')
  async returnMedication(
    @Body()
    dto: {
      caseId: string;
      drugId: string;
      batchId: string;
      quantity: number;
      reason: string;
    },
    @Request() req,
    @BranchId() branchId: string,
  ) {
    return this.pharmacyService.returnMedication(
      dto.caseId,
      dto.drugId,
      dto.batchId,
      dto.quantity,
      req.user.id,
      dto.reason,
      branchId,
    );
  }
}
