import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsExportService } from './analytics-export.service';

describe('AnalyticsExportService', () => {
  let service: AnalyticsExportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyticsExportService],
    }).compile();

    service = module.get<AnalyticsExportService>(AnalyticsExportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
