import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import * as net from 'net';

async function checkRedisAlive(host: string, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    socket.setTimeout(400);
    socket.on('connect', () => {
      socket.end();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
  });
}

class MemoryRateLimiter {
  private readonly store = new Map<string, number[]>();

  async checkRateLimit(
    identifier: string,
    limit: number,
    windowSeconds = 60
  ): Promise<{ allowed: boolean; limit: number; remaining: number; resetTime: number }> {
    const key = `ratelimit:${identifier}`;
    const nowMs = Date.now();
    const clearBefore = nowMs - windowSeconds * 1000;

    if (!this.store.has(key)) {
      this.store.set(key, []);
    }

    let timestamps = this.store.get(key)!;
    // delete older than window
    timestamps = timestamps.filter(ts => ts > clearBefore);
    timestamps.push(nowMs);
    this.store.set(key, timestamps);

    const currentCount = timestamps.length;
    const allowed = currentCount <= limit;
    const remaining = Math.max(0, limit - currentCount);
    const resetTime = nowMs + windowSeconds * 1000;

    return {
      allowed,
      limit,
      remaining,
      resetTime,
    };
  }
}

@Injectable()
export class RateLimitService {
  private redis: any = null;
  private memoryLimiter: MemoryRateLimiter | null = null;
  private readonly logger = new Logger('RateLimitService');
  private initPromise: Promise<void>;

  constructor(private readonly configService: ConfigService) {
    this.initPromise = this.init();
  }

  private async init() {
    const host = this.configService.get<string>('REDIS_HOST') || 'localhost';
    const port = this.configService.get<number>('REDIS_PORT') || 6379;
    const password = this.configService.get<string>('REDIS_PASSWORD');
    const isSentinel = this.configService.get<string>('REDIS_SENTINEL_ENABLED') === 'true';
    const sentinelMaster = this.configService.get<string>('REDIS_SENTINEL_MASTER') || 'mymaster';
    const sentinelNodesStr = this.configService.get<string>('REDIS_SENTINEL_NODES') || '';

    let redisAvailable = false;
    if (isSentinel && sentinelNodesStr) {
      const nodes = sentinelNodesStr.split(',');
      for (const node of nodes) {
        const [shost, sport] = node.trim().split(':');
        const alive = await checkRedisAlive(shost, parseInt(sport, 10));
        if (alive) {
          redisAvailable = true;
          break;
        }
      }
    } else {
      redisAvailable = await checkRedisAlive(host, port);
    }

    if (!redisAvailable) {
      this.logger.warn(`Redis is not reachable at ${host}:${port}. Falling back gracefully to IN-MEMORY rate limiter.`);
      this.memoryLimiter = new MemoryRateLimiter();
      return;
    }

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
        maxRetriesPerRequest: null,
      });
    } else {
      this.logger.log(`Initializing RateLimit Redis connection to ${host}:${port}...`);
      this.redis = new Redis({
        host,
        port,
        password: password || undefined,
        maxRetriesPerRequest: null,
      });
    }

    this.redis.on('error', (err: any) => {
      this.logger.warn(`RateLimitService Redis error: ${err.message}`);
    });
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
    await this.initPromise;

    if (this.memoryLimiter) {
      return this.memoryLimiter.checkRateLimit(identifier, limit, windowSeconds);
    }

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
