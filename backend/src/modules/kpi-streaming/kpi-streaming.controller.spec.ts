import { Test, TestingModule } from '@nestjs/testing';
import { KpiStreamingController } from './kpi-streaming.controller';

describe('KpiStreamingController', () => {
  let controller: KpiStreamingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KpiStreamingController],
    }).compile();

    controller = module.get<KpiStreamingController>(KpiStreamingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
