import { Test, TestingModule } from '@nestjs/testing';
import { TenantOnboardingService } from './tenant-onboarding.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { RedisCacheService } from '../../../common/cache/redis-cache.service';
import { TenantAuditService } from './tenant-audit.service';
import { getQueueToken } from '@nestjs/bullmq';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('TenantOnboardingService', () => {
  let service: TenantOnboardingService;
  let prisma: jest.Mocked<PrismaService>;
  let redis: jest.Mocked<RedisCacheService>;
  let audit: jest.Mocked<TenantAuditService>;
  let queue: any;

  const mockPrisma = {
    tenant: {
      findUnique: jest.fn(),
    },
    tenantSubscription: {
      create: jest.fn(),
    },
    tenantBranding: {
      create: jest.fn(),
      upsert: jest.fn(),
    },
    tenantDomain: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    tenantUser: {
      create: jest.fn(),
    },
    $transaction: jest.fn((cb) => cb(mockPrisma)),
  };

  const mockRedis = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  const mockAudit = {
    log: jest.fn(),
  };

  const mockQueue = {
    add: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantOnboardingService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisCacheService, useValue: mockRedis },
        { provide: TenantAuditService, useValue: mockAudit },
        { provide: getQueueToken('tenant-onboarding'), useValue: mockQueue },
      ],
    }).compile();

    service = module.get<TenantOnboardingService>(TenantOnboardingService);
    prisma = module.get(PrismaService);
    redis = module.get(RedisCacheService);
    audit = module.get(TenantAuditService);
    queue = module.get(getQueueToken('tenant-onboarding'));

    jest.clearAllMocks();
  });

  describe('registerTenant', () => {
    it('should throw BadRequestException if slug is already taken', async () => {
      mockPrisma.tenant.findUnique.mockResolvedValueOnce({ id: 'existing-tenant-id' });

      await expect(
        service.registerTenant({
          name: 'Clinic X',
          slug: 'clinicx',
          adminName: 'Admin',
          adminEmail: 'admin@clinicx.com',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should register tenant and queue onboarding job successfully', async () => {
      mockPrisma.tenant.findUnique.mockResolvedValueOnce(null);
      mockPrisma.tenant.findUnique.mockResolvedValueOnce({ id: 'tenant-id', slug: 'clinicx' }); // for audit check if needed
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      // Setup tx returns
      const tenantRecord = { id: 'new-tenant-id', name: 'Clinic X', slug: 'clinicx', isActive: true };
      const userRecord = { id: 'new-user-id', email: 'admin@clinicx.com', name: 'Admin' };
      
      mockPrisma.tenant.findUnique.mockImplementation(async (query: any) => {
        if (query.where.slug === 'clinicx') return null;
        return tenantRecord;
      });

      mockPrisma.$transaction.mockImplementation(async (cb: any) => {
        return {
          tenant: tenantRecord,
          user: userRecord,
        };
      });

      const response = await service.registerTenant({
        name: 'Clinic X',
        slug: 'clinicx',
        adminName: 'Admin',
        adminEmail: 'admin@clinicx.com',
        password: 'Password123!',
      });

      expect(response).toEqual({
        message: 'Tenant registration successfully initiated. Workspace is provisioning in the background.',
        tenantId: 'new-tenant-id',
        slug: 'clinicx',
      });
      expect(queue.add).toHaveBeenCalledWith('provision', expect.any(Object), expect.any(Object));
      expect(audit.log).toHaveBeenCalledWith({
        tenantId: 'new-tenant-id',
        userId: 'new-user-id',
        action: 'TENANT_REGISTER',
        details: expect.any(Object),
      });
    });
  });

  describe('updateTenantBranding', () => {
    it('should upsert tenant branding and invalidate related Redis keys', async () => {
      const mockBranding = { id: 'branding-id', tenantId: 'tenant-id', companyName: 'Clinic X' };
      mockPrisma.tenantBranding.upsert.mockResolvedValueOnce(mockBranding);
      mockPrisma.tenant.findUnique.mockResolvedValueOnce({ id: 'tenant-id', slug: 'clinicx' });

      const result = await service.updateTenantBranding('tenant-id', 'user-id', { companyName: 'Clinic X' });

      expect(result).toEqual(mockBranding);
      expect(redis.del).toHaveBeenCalledWith('tenant:id:tenant-id');
      expect(redis.del).toHaveBeenCalledWith('tenant:slug:clinicx');
      expect(audit.log).toHaveBeenCalledWith({
        tenantId: 'tenant-id',
        userId: 'user-id',
        action: 'BRANDING_UPDATE',
        details: { companyName: 'Clinic X' },
      });
    });
  });

  describe('addCustomDomain', () => {
    it('should register a custom domain with a DNS verification token', async () => {
      mockPrisma.tenantDomain.findUnique.mockResolvedValueOnce(null);
      const mockDomainMapping = { id: 'domain-mapping-id', tenantId: 'tenant-id', domain: 'clinicx.com', isVerified: false };
      mockPrisma.tenantDomain.create.mockResolvedValueOnce(mockDomainMapping);

      const result = await service.addCustomDomain('tenant-id', 'user-id', 'clinicx.com');

      expect(result).toEqual(mockDomainMapping);
      expect(audit.log).toHaveBeenCalledWith({
        tenantId: 'tenant-id',
        userId: 'user-id',
        action: 'DOMAIN_ADD',
        details: { domain: 'clinicx.com' },
      });
    });

    it('should throw BadRequestException if domain is already mapped', async () => {
      mockPrisma.tenantDomain.findUnique.mockResolvedValueOnce({ id: 'other-mapping-id' });

      await expect(service.addCustomDomain('tenant-id', 'user-id', 'clinicx.com')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('verifyCustomDomain', () => {
    it('should verify a custom domain successfully and invalidate cache', async () => {
      const domainMapping = { id: 'domain-mapping-id', tenantId: 'tenant-id', domain: 'clinicx.com', isVerified: false };
      mockPrisma.tenantDomain.findFirst.mockResolvedValueOnce(domainMapping);
      mockPrisma.tenantDomain.update.mockResolvedValueOnce({ ...domainMapping, isVerified: true });

      const result = await service.verifyCustomDomain('tenant-id', 'user-id', 'domain-mapping-id');

      expect(result.isVerified).toBe(true);
      expect(redis.del).toHaveBeenCalledWith('tenant:domain:clinicx.com');
      expect(audit.log).toHaveBeenCalledWith({
        tenantId: 'tenant-id',
        userId: 'user-id',
        action: 'DOMAIN_VERIFY',
        details: { domain: 'clinicx.com' },
      });
    });

    it('should throw NotFoundException if domain mapping is not found', async () => {
      mockPrisma.tenantDomain.findFirst.mockResolvedValueOnce(null);

      await expect(service.verifyCustomDomain('tenant-id', 'user-id', 'invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
