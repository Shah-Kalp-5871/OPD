import { Test, TestingModule } from '@nestjs/testing';
import { TelemedicineService } from './telemedicine.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TelemedicineService TURN & Session Logging Tests', () => {
  let service: TelemedicineService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      telemedicineSessionLog: {
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelemedicineService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<TelemedicineService>(TelemedicineService);
  });

  describe('generateTurnCredentials', () => {
    it('should generate transient iceServers configuration with correct credentials structure', async () => {
      const roomId = 'room_999';
      const userId = 'user_888';

      const result = await service.generateTurnCredentials(roomId, userId);

      expect(result).toBeDefined();
      expect(result.iceServers).toBeInstanceOf(Array);
      expect(result.iceServers.length).toBeGreaterThan(0);

      // Verify stun entry
      const stunServer = result.iceServers.find(s => s.urls.startsWith('stun:'));
      expect(stunServer).toBeDefined();

      // Verify turn entry structure
      const turnServer = result.iceServers.find(s => s.urls.startsWith('turn:'));
      expect(turnServer).toBeDefined();
      expect(turnServer?.username).toContain(roomId);
      expect(turnServer?.credential).toBeDefined();
    });
  });

  describe('logSessionEnd', () => {
    it('should successfully update log entry with session info', async () => {
      prismaMock.telemedicineSessionLog.update.mockResolvedValue({ id: 'log_1' });

      await service.logSessionEnd('session_123', 300, { bitrate: 120000 });

      expect(prismaMock.telemedicineSessionLog.update).toHaveBeenCalledWith({
        where: { sessionId: 'session_123' },
        data: {
          endTime: expect.any(Date),
          durationSeconds: 300,
          qualityMetrics: { bitrate: 120000 },
        },
      });
    });

    it('should handle repository errors gracefully without throwing', async () => {
      prismaMock.telemedicineSessionLog.update.mockRejectedValue(new Error('Prisma disconnect'));

      // This should run without throwing
      await expect(service.logSessionEnd('session_123', 300, {})).resolves.not.toThrow();
    });
  });
});
