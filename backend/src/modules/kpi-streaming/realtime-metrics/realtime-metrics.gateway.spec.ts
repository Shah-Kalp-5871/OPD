import { Test, TestingModule } from '@nestjs/testing';
import { RealtimeMetricsGateway } from './realtime-metrics.gateway';

describe('RealtimeMetricsGateway', () => {
  let gateway: RealtimeMetricsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RealtimeMetricsGateway],
    }).compile();

    gateway = module.get<RealtimeMetricsGateway>(RealtimeMetricsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
