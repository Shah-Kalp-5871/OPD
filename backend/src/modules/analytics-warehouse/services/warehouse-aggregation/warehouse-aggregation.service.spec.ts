import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseAggregationService } from './warehouse-aggregation.service';

describe('WarehouseAggregationService', () => {
  let service: WarehouseAggregationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WarehouseAggregationService],
    }).compile();

    service = module.get<WarehouseAggregationService>(WarehouseAggregationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
