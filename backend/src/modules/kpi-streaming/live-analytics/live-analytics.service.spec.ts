import { Test, TestingModule } from '@nestjs/testing';
import { LiveAnalyticsService } from './live-analytics.service';

describe('LiveAnalyticsService', () => {
  let service: LiveAnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveAnalyticsService],
    }).compile();

    service = module.get<LiveAnalyticsService>(LiveAnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
