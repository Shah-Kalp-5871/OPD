import { AsyncLocalStorage } from 'async_hooks';

export interface LoggingStore {
  correlationId: string;
  userId?: string;
  branchId?: string;
}

export const loggingStore = new AsyncLocalStorage<LoggingStore>();
