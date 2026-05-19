import { Test, TestingModule } from '@nestjs/testing';
import { SavedReportService } from './saved-report.service';

describe('SavedReportService', () => {
  let service: SavedReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SavedReportService],
    }).compile();

    service = module.get<SavedReportService>(SavedReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
