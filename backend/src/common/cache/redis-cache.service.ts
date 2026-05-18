import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  /**
   * Retrieves an item from the cache.
   */
  async get<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key);
  }

  /**
   * Sets an item in the cache. TTL is in milliseconds.
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  /**
   * Deletes an item from the cache.
   */
  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  /**
   * Generates a branch-scoped cache key.
   */
  generateBranchKey(branchId: string, resource: string, identifier?: string): string {
    const base = `branch:${branchId}:${resource}`;
    return identifier ? `${base}:${identifier}` : base;
  }

  /**
   * Wrap an asynchronous operation with branch-scoped caching.
   */
  async getOrSetBranchScoped<T>(
    branchId: string,
    resource: string,
    identifier: string | null,
    ttlMs: number,
    fetcher: () => Promise<T>
  ): Promise<T> {
    const key = this.generateBranchKey(branchId, resource, identifier || undefined);
    const cached = await this.get<T>(key);
    
    if (cached !== undefined && cached !== null) {
      return cached;
    }

    const data = await fetcher();
    await this.set(key, data, ttlMs);
    return data;
  }
}
