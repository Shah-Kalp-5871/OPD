import { AsyncLocalStorage } from 'async_hooks';

export interface TenancyStore {
  tenantId: string | null;
  branchId?: string | null;
  userId?: string | null;
  role?: string | null;
  plan?: string | null;
}

export const tenancyStore = new AsyncLocalStorage<TenancyStore>();
