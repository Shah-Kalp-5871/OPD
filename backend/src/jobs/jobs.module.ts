import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CronService } from './cron.service';
import { ReportsProcessor } from './processors/reports.processor';
import { AnalyticsModule } from '../analytics/analytics.module';
import { PublicApiModule } from '../public-api/public-api.module';
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
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('REDIS_HOST') || 'localhost';
        const port = Number(configService.get('REDIS_PORT')) || 6379;
        const password = configService.get<string>('REDIS_PASSWORD');
        const isSentinel = configService.get<string>('REDIS_SENTINEL_ENABLED') === 'true';
        const sentinelMaster = configService.get<string>('REDIS_SENTINEL_MASTER') || 'mymaster';
        const sentinelNodesStr = configService.get<string>('REDIS_SENTINEL_NODES') || '';

        let redisAvailable = false;
        try {
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
        } catch {
          redisAvailable = false;
        }

        if (!redisAvailable) {
          return {
            connection: {
              host,
              port,
              password: password || undefined,
              retryStrategy: () => null,
              maxRetriesPerRequest: 0,
            },
          };
        }

        if (isSentinel && sentinelNodesStr) {
          return {
            connection: {
              sentinels: sentinelNodesStr.split(',').map((node) => {
                const [shost, sport] = node.trim().split(':');
                return { host: shost, port: parseInt(sport, 10) };
              }),
              name: sentinelMaster,
              password: password || undefined,
              sentinelPassword: password || undefined,
              retryStrategy: (times: number) => Math.min(times * 150, 5000),
              reconnectOnError: (err: Error) => err.message.includes('READONLY') || err.message.includes('LOADING'),
              maxRetriesPerRequest: null,
            },
          };
        }

        return {
          connection: {
            host,
            port,
            password: password || undefined,
            retryStrategy: (times: number) => Math.min(times * 150, 5000),
            reconnectOnError: (err: Error) => err.message.includes('READONLY') || err.message.includes('LOADING'),
            maxRetriesPerRequest: null,
          },
        };
      },
    }),
    BullModule.registerQueue({
      name: 'notifications',
    }),
    BullModule.registerQueue({
      name: 'appointments',
    }),
    BullModule.registerQueue({
      name: 'reports',
    }),
    AnalyticsModule,
    PublicApiModule,
  ],
  providers: [CronService, ReportsProcessor],
  exports: [BullModule, CronService],
})
export class JobsModule {}
