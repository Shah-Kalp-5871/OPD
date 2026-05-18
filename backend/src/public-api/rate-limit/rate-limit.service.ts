import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RateLimitService {
  private readonly redis: Redis;
  private readonly logger = new Logger('RateLimitService');

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('REDIS_HOST') || 'localhost';
    const port = this.configService.get<number>('REDIS_PORT') || 6379;
    const password = this.configService.get<string>('REDIS_PASSWORD');
    const isSentinel = this.configService.get<string>('REDIS_SENTINEL_ENABLED') === 'true';
    const sentinelMaster = this.configService.get<string>('REDIS_SENTINEL_MASTER') || 'mymaster';
    const sentinelNodesStr = this.configService.get<string>('REDIS_SENTINEL_NODES') || '';

    if (isSentinel && sentinelNodesStr) {
      this.logger.log('Initializing RateLimit Redis connection in Sentinel mode...');
      const sentinels = sentinelNodesStr.split(',').map((node) => {
        const [shost, sport] = node.trim().split(':');
        return { host: shost, port: parseInt(sport, 10) };
      });
      this.redis = new Redis({
        sentinels,
        name: sentinelMaster,
        password: password || undefined,
        sentinelPassword: password || undefined,
      });
    } else {
      this.logger.log(`Initializing RateLimit Redis connection to ${host}:${port}...`);
      this.redis = new Redis({
        host,
        port,
        password: password || undefined,
      });
    }
  }

  /**
   * Evaluates rate limiting under a sliding window algorithm using Redis pipelines.
   * Window size is in seconds (default: 60 seconds).
   */
  async checkRateLimit(
    identifier: string,
    limit: number,
    windowSeconds = 60
  ): Promise<{ allowed: boolean; limit: number; remaining: number; resetTime: number }> {
    const key = `ratelimit:${identifier}`;
    const nowMs = Date.now();
    const clearBefore = nowMs - windowSeconds * 1000;
    const member = `${nowMs}:${Math.random().toString(36).substring(2, 8)}`; // ensure uniqueness in sorted set

    try {
      // Redis pipeline transactional sequence
      const pipeline = this.redis.multi();
      pipeline.zremrangebyscore(key, 0, clearBefore); // delete older than window
      pipeline.zadd(key, nowMs, member);              // add current request timestamp
      pipeline.zcard(key);                             // count items inside window
      pipeline.expire(key, windowSeconds);             // keep memory tidy

      const results = await pipeline.exec();
      if (!results) {
        throw new Error('Pipeline execution returned null');
      }

      // results structure: [[null, removedCount], [null, addedCount], [null, countInsideWindow], [null, expireSuccess]]
      const currentCount = (results[2][1] as number) || 1;
      const allowed = currentCount <= limit;
      const remaining = Math.max(0, limit - currentCount);
      const resetTime = nowMs + windowSeconds * 1000;

      return {
        allowed,
        limit,
        remaining,
        resetTime,
      };
    } catch (error) {
      this.logger.error(`Rate limit evaluation failed for ${identifier}: ${error.message}`);
      // Fail-open strategy to avoid blocking clinic operations if Redis goes down, with logged alert
      return {
        allowed: true,
        limit,
        remaining: 9999,
        resetTime: nowMs + windowSeconds * 1000,
      };
    }
  }
}
