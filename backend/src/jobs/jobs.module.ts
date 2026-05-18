import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CronService } from './cron.service';
import { ReportsProcessor } from './processors/reports.processor';
import { AnalyticsModule } from '../analytics/analytics.module';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const password = configService.get<string>('REDIS_PASSWORD');
        const isSentinel = configService.get<string>('REDIS_SENTINEL_ENABLED') === 'true';
        const sentinelMaster = configService.get<string>('REDIS_SENTINEL_MASTER') || 'mymaster';
        const sentinelNodesStr = configService.get<string>('REDIS_SENTINEL_NODES') || '';

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
            },
          };
        }

        return {
          connection: {
            host: configService.get<string>('REDIS_HOST') || 'localhost',
            port: configService.get<number>('REDIS_PORT') || 6379,
            password: password || undefined,
            retryStrategy: (times: number) => Math.min(times * 150, 5000),
            reconnectOnError: (err: Error) => err.message.includes('READONLY') || err.message.includes('LOADING'),
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
  ],
  providers: [CronService, ReportsProcessor],
  exports: [BullModule, CronService],
})
export class JobsModule {}
