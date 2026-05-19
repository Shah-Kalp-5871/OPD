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

  private extendedClient: any;

  constructor() {
    super();
    this.introspectSchema();

    const self = this;
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (self.extendedClient && prop in self.extendedClient) {
          return Reflect.get(self.extendedClient, prop, receiver);
        }
        return Reflect.get(target, prop, receiver);
      }
    });
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

  private extend(client: PrismaClient) {
    const self = this;
    return client.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            const store = tenancyStore.getStore();
            if (!store) {
              return query(args);
            }

            const anyArgs = (args || {}) as any;

            if ([
              'findFirst', 'findMany', 'findUnique', 'findUniqueOrThrow', 
              'count', 'aggregate', 'groupBy',
              'update', 'updateMany', 'delete', 'deleteMany'
            ].includes(operation)) {
              anyArgs.where = anyArgs.where || {};

              // 1. Tenant Isolation
              if (store.tenantId && self.modelsWithTenantId.has(model)) {
                if (anyArgs.where.tenantId === undefined) {
                  anyArgs.where.tenantId = store.tenantId;
                }
              }

              // 2. Branch Isolation
              if (store.branchId && self.modelsWithBranchId.has(model)) {
                if (anyArgs.where.branchId === undefined) {
                  anyArgs.where.branchId = store.branchId;
                }
              }

              // 3. Soft Delete Filtration
              if (self.modelsWithDeletedAt.has(model)) {
                if (anyArgs.where.deletedAt === undefined) {
                  anyArgs.where.deletedAt = null;
                }
              }
            }

            if (['create', 'createMany'].includes(operation)) {
              if (operation === 'create') {
                anyArgs.data = anyArgs.data || {};
                if (store.tenantId && self.modelsWithTenantId.has(model) && anyArgs.data.tenantId === undefined) {
                  anyArgs.data.tenantId = store.tenantId;
                }
                if (store.branchId && self.modelsWithBranchId.has(model) && anyArgs.data.branchId === undefined) {
                  anyArgs.data.branchId = store.branchId;
                }
              } else if (operation === 'createMany') {
                anyArgs.data = anyArgs.data || [];
                if (Array.isArray(anyArgs.data)) {
                  anyArgs.data.forEach((item: any) => {
                    if (store.tenantId && self.modelsWithTenantId.has(model) && item.tenantId === undefined) {
                      item.tenantId = store.tenantId;
                    }
                    if (store.branchId && self.modelsWithBranchId.has(model) && item.branchId === undefined) {
                      item.branchId = store.branchId;
                    }
                  });
                }
              }
            }

            return query(anyArgs);
          }
        }
      }
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.extendedClient = this.extend(this);

    const readReplicaUrl = process.env.DB_READ_REPLICA_URL;
    if (readReplicaUrl) {
      const baseReplica = new PrismaClient({
        datasources: {
          db: {
            url: readReplicaUrl,
          },
        },
      });
      await baseReplica.$connect();
      this.readReplicaClient = this.extend(baseReplica) as any;
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

