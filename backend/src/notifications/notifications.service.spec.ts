import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { FCMProvider } from './providers/fcm.provider';
import { APNSProvider } from './providers/apns.provider';
import { SMSProvider } from './providers/sms.provider';
import { EmailProvider } from './providers/email.provider';
import { Queue } from 'bullmq';
import { encryptText, decryptText } from '../common/crypto.utils';

describe('NotificationsService Unit Tests', () => {
  let service: NotificationsService;
  let prisma: PrismaService;

  const mockQueue = {
    add: jest.fn().mockResolvedValue({ id: 'job_123' }),
  };

  const mockPrisma = {
    deviceToken: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    notificationPreference: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    communicationLog: {
      create: jest.fn(),
    },
    notificationLog: {
      create: jest.fn(),
    },
  };

  const mockFCMProvider = { send: jest.fn() };
  const mockAPNSProvider = { send: jest.fn() };
  const mockSMSProvider = { send: jest.fn() };
  const mockEmailProvider = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: 'BullQueue_notifications', useValue: mockQueue },
        { provide: PrismaService, useValue: mockPrisma },
        { provide: FCMProvider, useValue: mockFCMProvider },
        { provide: APNSProvider, useValue: mockAPNSProvider },
        { provide: SMSProvider, useValue: mockSMSProvider },
        { provide: EmailProvider, useValue: mockEmailProvider },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('HIPAA Compliance & Encryption', () => {
    it('should securely encrypt and decrypt device tokens', () => {
      const plainToken = 'fcm_device_token_xyz_12345';
      const encrypted = encryptText(plainToken);
      
      expect(encrypted).not.toBe(plainToken);
      expect(encrypted.includes(':')).toBe(true);

      const decrypted = decryptText(encrypted);
      expect(decrypted).toBe(plainToken);
    });

    it('should register and encrypt device tokens in the database', async () => {
      const dto = {
        token: 'raw_token_value',
        platform: 'ANDROID',
        deviceType: 'Pixel 6',
        appVersion: '1.0.0',
      };
      
      mockPrisma.deviceToken.findUnique.mockResolvedValue(null);
      mockPrisma.deviceToken.create.mockImplementation((args) => args.data);

      await service.registerDeviceToken('user-123', dto);

      expect(mockPrisma.deviceToken.findUnique).toHaveBeenCalled();
      expect(mockPrisma.deviceToken.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user-123',
            platform: 'ANDROID',
            deviceType: 'Pixel 6',
            appVersion: '1.0.0',
          }),
        }),
      );
      
      // Token stored should be encrypted, not plain text
      const createdCall = mockPrisma.deviceToken.create.mock.calls[0][0].data;
      expect(createdCall.token).not.toBe('raw_token_value');
      expect(decryptText(createdCall.token)).toBe('raw_token_value');
    });
  });

  describe('Notification Preferences', () => {
    it('should fetch user preferences or create defaults if missing', async () => {
      mockPrisma.notificationPreference.findUnique.mockResolvedValue(null);
      mockPrisma.notificationPreference.create.mockImplementation((args) => args.data);

      const prefs = await service.getPreferences('user-123');

      expect(mockPrisma.notificationPreference.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
      });
      expect(mockPrisma.notificationPreference.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-123',
          reminders: true,
          marketing: false,
          prescription: true,
          followup: true,
          queueAlerts: true,
        },
      });
      expect(prefs.reminders).toBe(true);
      expect(prefs.marketing).toBe(false);
    });
  });
});
