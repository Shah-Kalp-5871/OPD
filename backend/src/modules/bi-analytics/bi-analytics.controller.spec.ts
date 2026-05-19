import { Test, TestingModule } from '@nestjs/testing';
import { BiAnalyticsController } from './bi-analytics.controller';

describe('BiAnalyticsController', () => {
  let controller: BiAnalyticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BiAnalyticsController],
    }).compile();

    controller = module.get<BiAnalyticsController>(BiAnalyticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
