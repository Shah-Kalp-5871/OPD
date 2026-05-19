import { Test, TestingModule } from '@nestjs/testing';
import { DashboardTemplateService } from './dashboard-template.service';

describe('DashboardTemplateService', () => {
  let service: DashboardTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DashboardTemplateService],
    }).compile();

    service = module.get<DashboardTemplateService>(DashboardTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
