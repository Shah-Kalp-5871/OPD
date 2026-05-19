import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsGovernanceService } from './analytics-governance.service';

describe('AnalyticsGovernanceService', () => {
  let service: AnalyticsGovernanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyticsGovernanceService],
    }).compile();

    service = module.get<AnalyticsGovernanceService>(AnalyticsGovernanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
