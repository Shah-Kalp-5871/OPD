import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TenantContextService } from '../tenant-context.service';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly contextService: TenantContextService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // 1. Check if route is marked as public or bypasses tenancy checks
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // 2. Ensure tenant resolution was completed by middleware
    const tenantId = this.contextService.getTenantId();
    if (!tenantId) {
      throw new UnauthorizedException('Multi-tenant context is required for this endpoint');
    }

    if (request.user && request.user.id) {
      this.contextService.setUser(request.user.id, request.user.role || 'USER');
    }

    // 3. Subscription status enforcement
    const tenant = request.tenant;
    if (tenant && tenant.subscription) {
      const { status, plan, trialEndsAt, endsAt } = tenant.subscription;

      // Validate trial or active subscription status
      const now = new Date();
      if (status === 'TRIAL') {
        if (trialEndsAt && new Date(trialEndsAt) < now) {
          throw new ForbiddenException('Tenant trial period has expired');
        }
      } else if (status === 'PAST_DUE') {
        // We might allow a grace period or warning, but restrict key operations
      } else if (status === 'CANCELED' || status === 'UNPAID') {
        if (endsAt && new Date(endsAt) < now) {
          throw new ForbiddenException('Tenant subscription is inactive or suspended due to billing');
        }
      }
    }

    // 4. Require specific plan tiers if decorated
    const requiredPlans = this.reflector.getAllAndOverride<string[]>('requiredPlans', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredPlans && requiredPlans.length > 0) {
      const activePlan = this.contextService.getPlan();
      if (!activePlan || !requiredPlans.includes(activePlan)) {
        throw new ForbiddenException(
          `This feature requires one of the following subscription tiers: ${requiredPlans.join(', ')}`
        );
      }
    }

    return true;
  }
}
