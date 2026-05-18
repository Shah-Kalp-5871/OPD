import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { PublicApiScopeService } from './public-api-scope.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RequestApiClientContext } from '../context/request-api-client.context';

describe('PublicApiScopeService', () => {
  let service: PublicApiScopeService;
  const prisma = {
    branch: { findMany: jest.fn(), findFirst: jest.fn() },
    appointment: { findFirst: jest.fn() },
    patient: { findFirst: jest.fn() },
  };

  const baseClient = {
    id: '1',
    clientId: 'cli_test',
    tenantId: 'tenant-a',
    branchId: null,
    scopes: [],
    environment: 'sandbox',
    isActive: true,
    apiKeyActive: true,
    name: 'Test',
    clientSecret: 'hash',
    apiKey: 'hash',
    apiKeyPrefix: 'mf_test_',
    rateLimitPerMinute: 100,
    monthlyQuota: 1000,
    monthlyUsageCount: 0,
    usageResetAt: null,
    lastUsedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const ctx: RequestApiClientContext = {
    client: baseClient as never,
    clientId: 'cli_test',
    tenantId: 'tenant-a',
    branchId: null,
    scopes: ['patients:read'],
    userId: null,
    correlationId: 'corr-1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicApiScopeService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get(PublicApiScopeService);
    jest.clearAllMocks();
  });

  it('rejects clients without tenant or branch binding', async () => {
    await expect(
      service.resolveBranchIds({
        ...ctx,
        tenantId: null,
        branchId: null,
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('returns single branch when branchId is set', async () => {
    prisma.branch.findFirst.mockResolvedValue({ id: 'branch-1' });
    const ids = await service.resolveBranchIds({
      ...ctx,
      branchId: 'branch-1',
    });
    expect(ids).toEqual(['branch-1']);
  });

  it('resolves all tenant branches when only tenantId is set', async () => {
    prisma.branch.findMany.mockResolvedValue([{ id: 'b1' }, { id: 'b2' }]);
    const ids = await service.resolveBranchIds(ctx);
    expect(ids).toEqual(['b1', 'b2']);
    expect(prisma.branch.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          clinic: { tenantId: 'tenant-a' },
        }),
      }),
    );
  });

  it('denies cross-tenant appointment access', async () => {
    prisma.branch.findMany.mockResolvedValue([{ id: 'b1' }]);
    prisma.appointment.findFirst.mockResolvedValue(null);

    await expect(
      service.assertAppointmentAccess(ctx, 'appt-other-tenant'),
    ).rejects.toThrow('not found');
  });
});
