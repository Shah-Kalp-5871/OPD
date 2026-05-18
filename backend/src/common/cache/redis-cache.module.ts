import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisCacheService } from './redis-cache.service';
import * as redisStore from 'cache-manager-redis-store';

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
          host: configService.get<string>('REDIS_HOST') || 'localhost',
          port: configService.get<number>('REDIS_PORT') || 6379,
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
