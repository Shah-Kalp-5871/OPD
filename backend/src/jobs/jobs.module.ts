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
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
      }),
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
