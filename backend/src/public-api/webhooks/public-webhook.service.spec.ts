import { Test, TestingModule } from '@nestjs/testing';
import { PublicWebhookService } from './public-webhook.service';
import { PrismaService } from '../../prisma/prisma.service';
import { getQueueToken } from '@nestjs/bullmq';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { WebhookCatalogService } from './webhook-catalog.service';

describe('PublicWebhookService', () => {
  let service: PublicWebhookService;
  let prisma: PrismaService;
  let queue: any;

  const mockPrisma = {
    apiWebhookSubscription: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
    apiWebhookDelivery: {
      create: jest.fn(),
    },
  };

  const mockQueue = {
    add: jest.fn(),
  };

  const mockCatalog = {
    validateEvents: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicWebhookService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: getQueueToken('webhooks'), useValue: mockQueue },
        { provide: WebhookCatalogService, useValue: mockCatalog },
      ],
    }).compile();

    service = module.get<PublicWebhookService>(PublicWebhookService);
    prisma = module.get<PrismaService>(PrismaService);
    queue = module.get(getQueueToken('webhooks'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSubscription', () => {
    it('should throw BadRequestException if clinical event list contains invalid events', async () => {
      mockCatalog.validateEvents.mockImplementation((events: string[]) => {
        if (events.includes('invalid.event')) {
          throw new BadRequestException('Unknown webhook events');
        }
      });
      await expect(
        service.createSubscription({
          clientId: 'cli_123',
          url: 'https://example.com/callback',
          events: ['appointment.created', 'invalid.event'],
        })
      ).rejects.toThrow(BadRequestException);
    });

    it('should register subscription successfully for valid clinical events', async () => {
      mockCatalog.validateEvents.mockImplementation(() => undefined);
      const mockResult = { id: 'sub_123', url: 'https://example.com/callback' };
      mockPrisma.apiWebhookSubscription.create.mockResolvedValue(mockResult);

      const result = await service.createSubscription({
        clientId: 'cli_123',
        url: 'https://example.com/callback',
        events: ['appointment.created', 'appointment.cancelled'],
      });

      expect(result).toEqual(mockResult);
      expect(prisma.apiWebhookSubscription.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          clientId: 'cli_123',
          url: 'https://example.com/callback',
          events: ['appointment.created', 'appointment.cancelled'],
          secret: expect.stringMatching(/^whsec_/),
          isActive: true,
        }),
      });
    });
  });

  describe('deleteSubscription', () => {
    it('should throw NotFoundException if subscription to delete does not exist for the client', async () => {
      mockPrisma.apiWebhookSubscription.findFirst.mockResolvedValue(null);

      await expect(
        service.deleteSubscription('sub_not_found', 'cli_123')
      ).rejects.toThrow(NotFoundException);
    });

    it('should delete subscription successfully', async () => {
      const mockSub = { id: 'sub_123', clientId: 'cli_123' };
      mockPrisma.apiWebhookSubscription.findFirst.mockResolvedValue(mockSub);
      mockPrisma.apiWebhookSubscription.delete.mockResolvedValue(mockSub);

      const result = await service.deleteSubscription('sub_123', 'cli_123');
      expect(result).toEqual(mockSub);
      expect(prisma.apiWebhookSubscription.delete).toHaveBeenCalledWith({
        where: { id: 'sub_123' },
      });
    });
  });

  describe('triggerWebhook', () => {
    it('should query active subscriptions and queue delivery jobs with exponential backoffs', async () => {
      const mockSubs = [
        {
          id: 'sub_1',
          url: 'https://client1.com/webhook',
          secret: 'whsec_abc',
          events: ['appointment.created'],
        },
      ];

      mockPrisma.apiWebhookSubscription.findMany.mockResolvedValue(mockSubs);
      mockPrisma.apiWebhookDelivery.create.mockResolvedValue({ id: 'del_999' });

      const payload = { test: 'data' };
      await service.triggerWebhook('appointment.created', payload, 'branch_abc');

      expect(prisma.apiWebhookSubscription.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isActive: true,
            events: { has: 'appointment.created' },
            client: expect.objectContaining({
              isActive: true,
              OR: [{ tenantId: 'branch_abc' }, { tenantId: null }],
            }),
          }),
        })
      );

      expect(prisma.apiWebhookDelivery.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          subscriptionId: 'sub_1',
          eventType: 'appointment.created',
          payload,
          status: 'PENDING',
          retryCount: 0,
        }),
      });

      expect(queue.add).toHaveBeenCalledWith(
        'webhook-delivery',
        expect.objectContaining({
          deliveryId: 'del_999',
          subscriptionId: 'sub_1',
          url: 'https://client1.com/webhook',
          secret: 'whsec_abc',
          eventType: 'appointment.created',
          payload,
        }),
        expect.objectContaining({
          attempts: 5,
          backoff: {
            type: 'exponential',
            delay: 10000,
          },
        })
      );
    });
  });
});
