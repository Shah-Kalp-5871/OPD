import { Test, TestingModule } from '@nestjs/testing';
import { RoomStateService } from './room-state.service';
import { RedisRoomRepository } from './redis-room.repository';

describe('RoomStateService Redis Resiliency & Synchronization Tests', () => {
  let service: RoomStateService;
  let redisRoomRepositoryMock: any;
  let redisClientMock: any;
  let pipelineMock: any;

  beforeEach(async () => {
    pipelineMock = {
      hset: jest.fn().mockReturnThis(),
      expire: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      del: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    };

    redisClientMock = {
      hset: jest.fn().mockResolvedValue(1),
      hget: jest.fn(),
      hdel: jest.fn().mockResolvedValue(1),
      hgetall: jest.fn().mockResolvedValue({}),
      get: jest.fn(),
      expire: jest.fn().mockResolvedValue(1),
      pipeline: jest.fn().mockReturnValue(pipelineMock),
    };

    redisRoomRepositoryMock = {
      getClient: jest.fn().mockReturnValue(redisClientMock),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomStateService,
        { provide: RedisRoomRepository, useValue: redisRoomRepositoryMock },
      ],
    }).compile();

    service = module.get<RoomStateService>(RoomStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Participant State Management & TTLs', () => {
    it('should add a participant using Redis hset and pipeline with exact TTL expiration', async () => {
      const roomId = 'room-abc';
      const userId = 'user-patient';
      const role = 'PATIENT';
      const socketId = 'sock-1';

      await service.addParticipant(roomId, userId, role, socketId);

      expect(redisClientMock.pipeline).toHaveBeenCalled();
      expect(pipelineMock.hset).toHaveBeenCalledWith(
        'telemedicine:room:room-abc:participants',
        userId,
        expect.any(String),
      );
      expect(pipelineMock.expire).toHaveBeenCalledWith(
        'telemedicine:room:room-abc:participants',
        14400, // 4 hours in seconds
      );
      expect(pipelineMock.exec).toHaveBeenCalled();
    });

    it('should retrieve parsed participant list cleanly', async () => {
      const roomId = 'room-abc';
      const mockPayload = {
        'user-patient': JSON.stringify({
          userId: 'user-patient',
          role: 'PATIENT',
          socketId: 'sock-1',
          joinedAt: new Date().toISOString(),
        }),
      };
      redisClientMock.hgetall.mockResolvedValue(mockPayload);

      const result = await service.getParticipants(roomId);
      expect(result).toHaveLength(1);
      expect(result[0].userId).toBe('user-patient');
      expect(result[0].role).toBe('PATIENT');
    });

    it('should remove a participant safely via hdel', async () => {
      const roomId = 'room-abc';
      const userId = 'user-patient';

      await service.removeParticipant(roomId, userId);

      expect(redisClientMock.hdel).toHaveBeenCalledWith(
        'telemedicine:room:room-abc:participants',
        userId,
      );
    });
  });

  describe('Outage Resiliency & Recovery Simulations', () => {
    it('should handle temporary Redis timeouts and bubble errors gracefully during write operations', async () => {
      pipelineMock.exec.mockRejectedValue(new Error('Redis connection lost'));

      await expect(
        service.addParticipant('room-abc', 'user-1', 'DOCTOR', 'sock-1'),
      ).rejects.toThrow('Redis connection lost');
    });

    it('should safely return empty list if Redis hgetall returns empty object/outage state', async () => {
      redisClientMock.hgetall.mockResolvedValue(null);

      const result = await service.getParticipants('room-abc');
      expect(result).toEqual([]);
    });

    it('should recover gracefully when metadata parsing encounters corrupted or malformed data', async () => {
      redisClientMock.get.mockResolvedValue('{broken json');

      const result = await service.getRoomMetadata('room-abc');
      expect(result).toBeNull();
    });
  });

  describe('Room Deletion & Session Cleanup', () => {
    it('should purge room metadata and participants keys concurrently via pipeline', async () => {
      const roomId = 'room-abc';

      await service.clearRoom(roomId);

      expect(redisClientMock.pipeline).toHaveBeenCalled();
      expect(pipelineMock.del).toHaveBeenCalledWith('telemedicine:room:room-abc:participants');
      expect(pipelineMock.del).toHaveBeenCalledWith('telemedicine:room:room-abc:meta');
      expect(pipelineMock.exec).toHaveBeenCalled();
    });
  });
});
