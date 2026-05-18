import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ProcurementService } from './procurement.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';

@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('procurement')
export class ProcurementController {
  constructor(private readonly procurement: ProcurementService) {}

  @Get('dashboard')
  getDashboard() { return this.procurement.getDashboardData(); }

  @Post('vendors')
  createVendor(@Body() body: Parameters<ProcurementService['createVendor']>[0]) {
    return this.procurement.createVendor(body);
  }

  @Post('purchase-orders')
  createPO(@Body() body: Parameters<ProcurementService['createPurchaseOrder']>[0]) {
    return this.procurement.createPurchaseOrder(body);
  }

  @Post('purchase-orders/:poId/receive')
  receiveGoods(@Param('poId') poId: string, @Body() body: { grnNumber: string; receivedBy?: string }) {
    return this.procurement.receiveGoods(poId, body.grnNumber, body.receivedBy);
  }
}
