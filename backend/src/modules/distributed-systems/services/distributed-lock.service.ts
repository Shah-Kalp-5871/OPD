import { Injectable } from '@nestjs/common';

@Injectable()
export class DistributedLockService {
  async getActiveLocks() {
    return [
      { resource: 'lock:billing-aggregation-tenant-1', holder: 'medflow-api-5dff6-9bc1a', ttlRemainingSec: 18, acquiredAt: new Date() },
      { resource: 'lock:inventory-update-branch-mumbai', holder: 'medflow-api-5dff6-b21a8', ttlRemainingSec: 4, acquiredAt: new Date() },
    ];
  }
}