import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisCacheService } from './redis-cache.service';
import * as redisStore from 'cache-manager-redis-store';
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

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const password = configService.get<string>('REDIS_PASSWORD');
        const isSentinel = configService.get<string>('REDIS_SENTINEL_ENABLED') === 'true';
        const sentinelMaster = configService.get<string>('REDIS_SENTINEL_MASTER') || 'mymaster';
        const sentinelNodesStr = configService.get<string>('REDIS_SENTINEL_NODES') || '';

        const host = configService.get<string>('REDIS_HOST') || 'localhost';
        const port = configService.get<number>('REDIS_PORT') || 6379;

        let redisAvailable = false;
        if (isSentinel && sentinelNodesStr) {
          // Check if at least one sentinel is alive
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
          console.warn(`[RedisCacheModule] Redis is not reachable at ${host}:${port}. Falling back gracefully to IN-MEMORY cache store.`);
          return {
            store: 'memory',
            ttl: 60 * 1000,
          };
        }

        if (isSentinel && sentinelNodesStr) {
          return {
            store: redisStore,
            sentinels: sentinelNodesStr.split(',').map((node) => {
              const [shost, sport] = node.trim().split(':');
              return { host: shost, port: parseInt(sport, 10) };
            }),
            name: sentinelMaster,
            ...(password ? { auth_pass: password, sentinelPassword: password } : {}),
            ttl: 60 * 1000,
          } as any;
        }

        return {
          store: redisStore,
          host,
          port,
          ...(password ? { auth_pass: password } : {}),
          ttl: 60 * 1000, // default 60 seconds in ms
        };
      },
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService, CacheModule],
})
export class RedisCacheModule {}
