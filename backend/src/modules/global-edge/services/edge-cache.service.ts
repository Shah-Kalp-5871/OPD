import { Injectable } from '@nestjs/common';

@Injectable()
export class EdgeCacheService {
  async getCachePerformance() {
    return {
      cacheHitRatio: 0.942,
      bytesServedFromEdge: 4891230489,
      purgedUrlsToday: 14,
      staticAssetsCached: 182,
    };
  }
}