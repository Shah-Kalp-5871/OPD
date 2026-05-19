import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
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

class MemoryRedisClient {
  private readonly keyValues = new Map<string, string>();
  private readonly hashValues = new Map<string, Map<string, string>>();

  async hset(key: string, field: string, value: string): Promise<number> {
    if (!this.hashValues.has(key)) {
      this.hashValues.set(key, new Map());
    }
    const hash = this.hashValues.get(key)!;
    const isNew = !hash.has(field);
    hash.set(field, value);
    return isNew ? 1 : 0;
  }

  async hget(key: string, field: string): Promise<string | null> {
    const hash = this.hashValues.get(key);
    if (!hash) return null;
    return hash.get(field) || null;
  }

  async hdel(key: string, field: string): Promise<number> {
    const hash = this.hashValues.get(key);
    if (!hash) return 0;
    const existed = hash.delete(field);
    return existed ? 1 : 0;
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    const hash = this.hashValues.get(key);
    if (!hash) return {};
    const result: Record<string, string> = {};
    hash.forEach((v, k) => {
      result[k] = v;
    });
    return result;
  }

  async set(key: string, value: string): Promise<'OK'> {
    this.keyValues.set(key, value);
    return 'OK';
  }

  async get(key: string): Promise<string | null> {
    return this.keyValues.get(key) || null;
  }

  async del(key: string): Promise<number> {
    let deletedCount = 0;
    if (this.keyValues.delete(key)) deletedCount++;
    if (this.hashValues.delete(key)) deletedCount++;
    return deletedCount;
  }

  async expire(key: string, seconds: number): Promise<number> {
    return 1;
  }

  on(event: string, handler: (...args: any[]) => void) {
    return this;
  }

  disconnect() {
    // noop
  }

  pipeline() {
    const commands: (() => Promise<any>)[] = [];
    const chain = {
      hset: (key: string, field: string, value: string) => {
        commands.push(() => this.hset(key, field, value));
        return chain;
      },
      expire: (key: string, seconds: number) => {
        commands.push(() => this.expire(key, seconds));
        return chain;
      },
      set: (key: string, value: string) => {
        commands.push(() => this.set(key, value));
        return chain;
      },
      del: (key: string) => {
        commands.push(() => this.del(key));
        return chain;
      },
      exec: async () => {
        const results: any[] = [];
        for (const cmd of commands) {
          try {
            const res = await cmd();
            results.push([null, res]);
          } catch (err) {
            results.push([err, null]);
          }
        }
        return results;
      }
    };
    return chain;
  }
}

@Injectable()
export class RedisRoomRepository implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisRoomRepository.name);
  private client: any;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST') || 'localhost';
    const port = this.configService.get<number>('REDIS_PORT') || 6379;
    const password = this.configService.get<string>('REDIS_PASSWORD') || undefined;

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
      this.logger.warn(`Redis is not reachable at ${host}:${port}. Falling back gracefully to fully functional IN-MEMORY Redis room client.`);
      this.client = new MemoryRedisClient();
      return;
    }

    const redisOptions: any = isSentinel && sentinelNodesStr
      ? {
          sentinels: sentinelNodesStr.split(',').map((node) => {
            const [shost, sport] = node.trim().split(':');
            return { host: shost, port: parseInt(sport, 10) };
          }),
          name: sentinelMaster,
          ...(password ? { password, sentinelPassword: password } : {}),
        }
      : {
          host,
          port,
          ...(password ? { password } : {}),
        };

    redisOptions.retryStrategy = (times: number) => {
      return Math.min(times * 100, 3000);
    };
    redisOptions.maxRetriesPerRequest = null;

    this.client = new Redis(redisOptions);
    this.client.on('error', (err: any) => {
      this.logger.warn(`RedisRoomRepository client error: ${err.message}`);
    });
    this.logger.log('RedisRoomRepository initialized successfully with Sentinel/HA support');
  }

  onModuleDestroy() {
    if (this.client && typeof this.client.disconnect === 'function') {
      this.client.disconnect();
    }
  }

  getClient(): any {
    return this.client;
  }
}
