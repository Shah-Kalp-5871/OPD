import { Controller, Post, UseGuards, Body, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { WarehouseAggregationService } from './services/warehouse-aggregation/warehouse-aggregation.service';
import { WarehouseIngestionService } from './services/warehouse-ingestion/warehouse-ingestion.service';

@Controller('analytics-warehouse')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AnalyticsWarehouseController {
  constructor(
    private readonly aggregationService: WarehouseAggregationService,
    private readonly ingestionService: WarehouseIngestionService,
  ) {}

  @Post('rebuild')
  async rebuildWarehouse() {
    await this.aggregationService.rebuildWarehouse();
    return { success: true, message: 'Warehouse rebuild initiated' };
  }

  @Post('snapshot')
  async takeSnapshot() {
    await this.aggregationService.takeSnapshot();
    return { success: true, message: 'Snapshot completed successfully' };
  }

  @Post('ingest/appointment/:id')
  async ingestAppointment(@Param('id') appointmentId: string) {
    await this.ingestionService.ingestAppointment(appointmentId);
    return { success: true };
  }

  @Post('ingest/revenue/:id')
  async ingestRevenue(@Param('id') invoiceId: string) {
    await this.ingestionService.ingestRevenue(invoiceId);
    return { success: true };
  }
}
