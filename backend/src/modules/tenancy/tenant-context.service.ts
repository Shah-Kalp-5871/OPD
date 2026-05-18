import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class TenantContextService {
  private tenantId: string | null = null;
  private slug: string | null = null;
  private userId: string | null = null;
  private role: string | null = null;
  private plan: string | null = null;
  private branchId: string | null = null;

  setTenant(tenantId: string, slug: string) {
    this.tenantId = tenantId;
    this.slug = slug;
  }

  getTenantId(): string | null {
    return this.tenantId;
  }

  getSlug(): string | null {
    return this.slug;
  }

  setUser(userId: string, role: string) {
    this.userId = userId;
    this.role = role;
  }

  getUserId(): string | null {
    return this.userId;
  }

  getRole(): string | null {
    return this.role;
  }

  setPlan(plan: string) {
    this.plan = plan;
  }

  getPlan(): string | null {
    return this.plan;
  }

  setBranchId(branchId: string | null) {
    this.branchId = branchId;
  }

  getBranchId(): string | null {
    return this.branchId;
  }

  clear() {
    this.tenantId = null;
    this.slug = null;
    this.userId = null;
    this.role = null;
    this.plan = null;
    this.branchId = null;
  }
}
