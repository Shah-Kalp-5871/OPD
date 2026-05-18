import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisCacheService } from '../../common/cache/redis-cache.service';
import { TenantContextService } from './tenant-context.service';
import { tenancyStore } from './tenancy.context';

@Injectable()
export class TenantResolverMiddleware implements NestMiddleware {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisCacheService,
    private readonly contextService: TenantContextService,
  ) {}

  private parseCachedValue(cached: any): any {
    if (!cached) return null;
    return typeof cached === 'string' ? JSON.parse(cached) : cached;
  }

  async use(req: any, res: Response, next: NextFunction) {
    const host = req.headers.host || '';
    
    let resolvedSlug: string | null = null;
    let resolvedDomain: string | null = null;

    // 1. Resolve via Custom Tenant Header (explicit override for integrations/API clients)
    const headerSlug = req.headers['x-tenant-slug'];
    const headerTenantId = req.headers['x-tenant-id'];

    let tenantInfo: any = null;

    if (headerSlug && typeof headerSlug === 'string') {
      resolvedSlug = headerSlug;
    } else if (headerTenantId && typeof headerTenantId === 'string') {
      const cached = await this.redis.get<any>(`tenant:id:${headerTenantId}`);
      if (cached) {
        tenantInfo = this.parseCachedValue(cached);
        resolvedSlug = tenantInfo?.slug || null;
      } else {
        const tenant = await this.prisma.tenant.findUnique({
          where: { id: headerTenantId },
          include: { subscription: true },
        });
        if (tenant && !tenant.deletedAt) {
          tenantInfo = tenant;
          resolvedSlug = tenant.slug;
          await this.redis.set(`tenant:id:${tenant.id}`, tenant, 3600 * 1000);
          await this.redis.set(`tenant:slug:${tenant.slug}`, tenant, 3600 * 1000);
        }
      }
    }

    // 2. Resolve via Domain name
    if (!resolvedSlug && !tenantInfo && host) {
      const hostname = host.split(':')[0];

      // Check if it is a subdomain
      if (hostname.endsWith('.medflow.com') || (process.env.NODE_ENV !== 'production' && hostname.endsWith('.localhost'))) {
        const parts = hostname.split('.');
        if (parts.length > 2) {
          resolvedSlug = parts[0];
        }
      } else {
        // Custom domain resolution
        resolvedDomain = hostname;
      }
    }

    // 3. Query Redis or DB to validate and resolve the Tenant Metadata
    if (!tenantInfo) {
      if (resolvedSlug) {
        const cacheKey = `tenant:slug:${resolvedSlug}`;
        const cached = await this.redis.get<any>(cacheKey);
        if (cached) {
          tenantInfo = this.parseCachedValue(cached);
        } else {
          tenantInfo = await this.prisma.tenant.findUnique({
            where: { slug: resolvedSlug },
            include: {
              subscription: true,
            },
          });
          if (tenantInfo && !tenantInfo.deletedAt) {
            await this.redis.set(cacheKey, tenantInfo, 3600 * 1000);
          }
        }
      } else if (resolvedDomain) {
        const cacheKey = `tenant:domain:${resolvedDomain}`;
        const cached = await this.redis.get<any>(cacheKey);
        if (cached) {
          tenantInfo = this.parseCachedValue(cached);
        } else {
          const domainMapping = await this.prisma.tenantDomain.findUnique({
            where: { domain: resolvedDomain },
            include: {
              tenant: {
                include: {
                  subscription: true,
                },
              },
            },
          });
          if (domainMapping && domainMapping.isVerified && !domainMapping.tenant.deletedAt) {
            tenantInfo = domainMapping.tenant;
            await this.redis.set(cacheKey, tenantInfo, 3600 * 1000);
          }
        }
      }
    }

    // 4. Fallback/Default System Sandbox/Admin Tenant (if no slug/domain matched but requested public/admin routes)
    if (!tenantInfo) {
      return next();
    }

    if (!tenantInfo.isActive) {
      throw new UnauthorizedException('Tenant account is suspended or inactive');
    }

    // 5. Populate Request & Request-Scoped Context Provider to establish boundaries
    req.tenant = tenantInfo;
    req.tenantId = tenantInfo.id;
    req.tenantSlug = tenantInfo.slug;

    this.contextService.setTenant(tenantInfo.id, tenantInfo.slug);
    if (tenantInfo.subscription) {
      this.contextService.setPlan(tenantInfo.subscription.plan);
    }

    const branchHeader = req.headers['x-branch-id'];
    const resolvedBranchId = typeof branchHeader === 'string' ? branchHeader : null;
    if (resolvedBranchId) {
      this.contextService.setBranchId(resolvedBranchId);
    }

    // Wrap executing thread context in AsyncLocalStorage
    tenancyStore.run(
      {
        tenantId: tenantInfo.id,
        branchId: resolvedBranchId,
        userId: null,
        role: null,
        plan: tenantInfo.subscription?.plan || null,
      },
      () => {
        next();
      },
    );
  }
}
