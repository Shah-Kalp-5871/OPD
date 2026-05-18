import { Test, TestingModule } from '@nestjs/testing';
import { RedisPubSubService } from './redis-pubsub.service';
import { AppGateway } from './app.gateway';
import { ConfigService } from '@nestjs/config';

// Mock Redis client
class MockRedis {
  publish = jest.fn().mockResolvedValue(1);
  subscribe = jest.fn().mockResolvedValue('OK');
  on = jest.fn();
  duplicate = jest.fn().mockReturnValue(this);
}

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => new MockRedis());
});

describe('RedisPubSubService Unit Tests', () => {
  let service: RedisPubSubService;
  let appGateway: AppGateway;

  const mockAppGateway = {
    broadcastQueueUpdate: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'REDIS_HOST') return 'localhost';
      if (key === 'REDIS_PORT') return 6379;
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisPubSubService,
        { provide: AppGateway, useValue: mockAppGateway },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<RedisPubSubService>(RedisPubSubService);
    appGateway = module.get<AppGateway>(AppGateway);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should publish queue updates to Redis cluster', async () => {
    const payload = {
      queueId: 'q-456',
      branchId: 'b-999',
      activePatientCount: 14,
      nextPatientId: 'p-111',
    };

    // Initialize mock clients manually for testing
    (service as any).pubClient = new MockRedis();
    (service as any).subClient = new MockRedis();

    await service.publish('QUEUE_ORDER_SYNC', payload);

    // Verify it published to pubClient
    const pubClient = (service as any).pubClient;
    expect(pubClient.publish).toHaveBeenCalledWith(
      'opd:queue:sync',
      expect.stringContaining('QUEUE_ORDER_SYNC'),
    );
  });
});
