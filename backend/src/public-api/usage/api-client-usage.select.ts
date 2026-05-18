import { Prisma } from '@prisma/client';

/** Phase 26 metering fields on ApiClient (see prisma/schema.prisma). */
export interface ApiClientUsageQuota {
  monthlyQuota: number;
  monthlyUsageCount: number;
  usageResetAt: Date | null;
}

export interface ApiClientTenantUsageRow {
  clientId: string;
  name: string;
  monthlyUsageCount: number;
  monthlyQuota: number;
  lastUsedAt: Date | null;
}

export interface ApiClientUsageSummaryScalars {
  clientId: string;
  name: string;
  environment: string;
  scopes: string[];
  monthlyQuota: number;
  monthlyUsageCount: number;
  rateLimitPerMinute: number;
  lastUsedAt: Date | null;
  isActive: boolean;
  apiKeyActive: boolean;
}

export const API_CLIENT_QUOTA_SELECT = {
  monthlyQuota: true,
  monthlyUsageCount: true,
  usageResetAt: true,
} as const;

export const API_CLIENT_QUOTA_REFRESH_SELECT = {
  monthlyQuota: true,
  monthlyUsageCount: true,
} as const;

export const API_CLIENT_TENANT_USAGE_SELECT = {
  clientId: true,
  name: true,
  monthlyUsageCount: true,
  monthlyQuota: true,
  lastUsedAt: true,
} as const;

export const API_CLIENT_SUMMARY_SELECT = {
  clientId: true,
  name: true,
  environment: true,
  scopes: true,
  monthlyQuota: true,
  monthlyUsageCount: true,
  rateLimitPerMinute: true,
  lastUsedAt: true,
  isActive: true,
  apiKeyActive: true,
  _count: {
    select: {
      webhooks: true,
      auditLogs: true,
      usageRecords: true,
    },
  },
} as const;

/** Cast at query site — Prisma select typing; result mapped via helpers below. */
export function asApiClientSelect<T extends Record<string, unknown>>(select: T): Prisma.ApiClientSelect {
  return select as Prisma.ApiClientSelect;
}

export function toApiClientUsageQuota(row: unknown): ApiClientUsageQuota | null {
  if (!row || typeof row !== 'object') return null;
  const r = row as Record<string, unknown>;
  return {
    monthlyQuota: Number(r.monthlyQuota ?? 100_000),
    monthlyUsageCount: Number(r.monthlyUsageCount ?? 0),
    usageResetAt: r.usageResetAt instanceof Date ? r.usageResetAt : null,
  };
}

export function toApiClientTenantUsageRow(row: unknown): ApiClientTenantUsageRow {
  const r = (row && typeof row === 'object' ? row : {}) as Record<string, unknown>;
  return {
    clientId: String(r.clientId ?? ''),
    name: String(r.name ?? ''),
    monthlyUsageCount: Number(r.monthlyUsageCount ?? 0),
    monthlyQuota: Number(r.monthlyQuota ?? 100_000),
    lastUsedAt: r.lastUsedAt instanceof Date ? r.lastUsedAt : null,
  };
}

export function toApiClientUsageSummary(
  row: unknown,
): (ApiClientUsageSummaryScalars & {
  _count: { webhooks: number; auditLogs: number; usageRecords: number };
}) | null {
  if (!row || typeof row !== 'object') return null;
  const r = row as Record<string, unknown>;
  const count = (r._count && typeof r._count === 'object' ? r._count : {}) as Record<
    string,
    unknown
  >;
  return {
    clientId: String(r.clientId ?? ''),
    name: String(r.name ?? ''),
    environment: String(r.environment ?? ''),
    scopes: Array.isArray(r.scopes) ? (r.scopes as string[]) : [],
    monthlyQuota: Number(r.monthlyQuota ?? 100_000),
    monthlyUsageCount: Number(r.monthlyUsageCount ?? 0),
    rateLimitPerMinute: Number(r.rateLimitPerMinute ?? 100),
    lastUsedAt: r.lastUsedAt instanceof Date ? r.lastUsedAt : null,
    isActive: Boolean(r.isActive ?? true),
    apiKeyActive: Boolean(r.apiKeyActive ?? true),
    _count: {
      webhooks: Number(count.webhooks ?? 0),
      auditLogs: Number(count.auditLogs ?? 0),
      usageRecords: Number(count.usageRecords ?? 0),
    },
  };
}

export const API_CLIENT_USAGE_UPDATE_DATA = {
  lastUsedAt: new Date(),
  monthlyUsageCount: { increment: 1 },
} as Prisma.ApiClientUpdateInput;

export const API_CLIENT_MONTHLY_RESET_DATA = (startOfMonth: Date): Prisma.ApiClientUpdateInput =>
  ({
    monthlyUsageCount: 0,
    usageResetAt: startOfMonth,
  }) as Prisma.ApiClientUpdateInput;
