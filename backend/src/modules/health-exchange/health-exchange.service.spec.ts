import { Test, TestingModule } from '@nestjs/testing';
import { HealthExchangeService } from './health-exchange.service';

describe('HealthExchangeService', () => {
  let service: HealthExchangeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthExchangeService],
    }).compile();

    service = module.get<HealthExchangeService>(HealthExchangeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
