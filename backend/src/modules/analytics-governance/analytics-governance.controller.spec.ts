import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsGovernanceController } from './analytics-governance.controller';

describe('AnalyticsGovernanceController', () => {
  let controller: AnalyticsGovernanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsGovernanceController],
    }).compile();

    controller = module.get<AnalyticsGovernanceController>(AnalyticsGovernanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
