import { Module } from '@nestjs/common';
import { WarehouseIngestionService } from './services/warehouse-ingestion/warehouse-ingestion.service';
import { WarehouseAggregationService } from './services/warehouse-aggregation/warehouse-aggregation.service';
import { AnalyticsWarehouseController } from './analytics-warehouse.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';

@Module({
  imports: [PrismaModule, TenancyModule],
  providers: [WarehouseIngestionService, WarehouseAggregationService],
  controllers: [AnalyticsWarehouseController],
  exports: [WarehouseIngestionService, WarehouseAggregationService],
})
export class AnalyticsWarehouseModule {}
