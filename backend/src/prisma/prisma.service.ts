import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { tenancyStore } from '../modules/tenancy/tenancy.context';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readReplicaClient: PrismaClient | null = null;
  private readonly modelsWithTenantId = new Set<string>();
  private readonly modelsWithBranchId = new Set<string>();
  private readonly modelsWithDeletedAt = new Set<string>();

  constructor() {
    super();
    this.introspectSchema();
  }

  /**
   * Statically inspects the Prisma DMMF models at startup to locate multi-tenant, 
   * branch-scoped, and soft-delete supported structures.
   */
  private introspectSchema() {
    const models = (Prisma as any).dmmf?.datamodel?.models || [];
    models.forEach((model: any) => {
      model.fields?.forEach((field: any) => {
        if (field.name === 'tenantId') {
          this.modelsWithTenantId.add(model.name);
        }
        if (field.name === 'branchId') {
          this.modelsWithBranchId.add(model.name);
        }
        if (field.name === 'deletedAt') {
          this.modelsWithDeletedAt.add(model.name);
        }
      });
    });

    // Fallback static configuration if DMMF is empty/omitted in runtime bundle
    if (this.modelsWithTenantId.size === 0) {
      const tenantScopedModels = [
        'TenantUser', 'TenantSubscription', 'TenantBranding', 'TenantDomain', 
        'TenantInvite', 'TenantAuditLog', 'BillingInvoice', 'BillingTransaction', 
        'SubscriptionUsage', 'FeatureUsageLog', 'Clinic', 'ApiClient'
      ];
      tenantScopedModels.forEach(m => this.modelsWithTenantId.add(m));
      this.modelsWithDeletedAt.add('Tenant');
    }
  }

  async onModuleInit() {
    await this.$connect();

    // Hook dynamic tenant and branch isolation middleware
    (this as any).$use(async (params: any, next: any) => {
      const store = tenancyStore.getStore();
      
      // Bypass query isolation if there is no active tenancy session
      if (!store || !params.model) {
        return next(params);
      }

      const modelName = params.model;
      params.args = params.args || {};
      params.args.where = params.args.where || {};

      // 1. Inject Tenant Isolation
      if (store.tenantId && this.modelsWithTenantId.has(modelName)) {
        if (params.args.where.tenantId === undefined) {
          params.args.where.tenantId = store.tenantId;
        }
      }

      // 2. Inject Branch-level Isolation
      if (store.branchId && this.modelsWithBranchId.has(modelName)) {
        if (params.args.where.branchId === undefined) {
          params.args.where.branchId = store.branchId;
        }
      }

      // 3. Inject Soft Delete Filtration
      if (this.modelsWithDeletedAt.has(modelName)) {
        if (params.args.where.deletedAt === undefined) {
          params.args.where.deletedAt = null;
        }
      }

      return next(params);
    });

    const readReplicaUrl = process.env.DB_READ_REPLICA_URL;
    if (readReplicaUrl) {
      this.readReplicaClient = new PrismaClient({
        datasources: {
          db: {
            url: readReplicaUrl,
          },
        },
      });
      await this.readReplicaClient.$connect();
    }
  }

  async onModuleDestroy() {
    await Promise.all([
      this.$disconnect(),
      this.readReplicaClient ? this.readReplicaClient.$disconnect() : Promise.resolve(),
    ]);
  }

  /**
   * Exposes the read replica client for reading split queries.
   * Falls back gracefully to the primary write client if no replica is configured.
   */
  get read(): PrismaClient {
    return this.readReplicaClient || this;
  }

  /**
   * Phase 26 public API usage models.
   * Explicit getters ensure delegates resolve on PrismaService (requires `npx prisma generate`).
   */
  get apiUsageRecord(): PrismaClient['apiUsageRecord'] {
    return (this as PrismaClient).apiUsageRecord;
  }

  get apiUsageMonthlySummary(): PrismaClient['apiUsageMonthlySummary'] {
    return (this as PrismaClient).apiUsageMonthlySummary;
  }
}

