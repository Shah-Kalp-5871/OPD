import { Module, Global } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AlertsService } from './alerts.service';
import { NotificationProcessor } from './notification.processor';
import { NotificationsController } from './notifications.controller';
import { ReminderScheduleService } from './reminder-schedule.service';
import { BullModule } from '@nestjs/bullmq';

// Providers
import { FCMProvider } from './providers/fcm.provider';
import { APNSProvider } from './providers/apns.provider';
import { SMSProvider } from './providers/sms.provider';
import { EmailProvider } from './providers/email.provider';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    AlertsService,
    NotificationProcessor,
    ReminderScheduleService,
    FCMProvider,
    APNSProvider,
    SMSProvider,
    EmailProvider,
  ],
  exports: [
    NotificationsService,
    AlertsService,
    ReminderScheduleService,
    FCMProvider,
    APNSProvider,
    SMSProvider,
    EmailProvider,
  ],
})
export class NotificationsModule {}
