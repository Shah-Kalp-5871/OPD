import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsWarehouseController } from './analytics-warehouse.controller';

describe('AnalyticsWarehouseController', () => {
  let controller: AnalyticsWarehouseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsWarehouseController],
    }).compile();

    controller = module.get<AnalyticsWarehouseController>(AnalyticsWarehouseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
