import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseIngestionService } from './warehouse-ingestion.service';

describe('WarehouseIngestionService', () => {
  let service: WarehouseIngestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WarehouseIngestionService],
    }).compile();

    service = module.get<WarehouseIngestionService>(WarehouseIngestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
