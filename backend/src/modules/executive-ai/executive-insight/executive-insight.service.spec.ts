import { Test, TestingModule } from '@nestjs/testing';
import { ExecutiveInsightService } from './executive-insight.service';

describe('ExecutiveInsightService', () => {
  let service: ExecutiveInsightService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExecutiveInsightService],
    }).compile();

    service = module.get<ExecutiveInsightService>(ExecutiveInsightService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
