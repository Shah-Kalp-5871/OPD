import { Module, Global } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AlertsService } from './alerts.service';
import { NotificationProcessor } from './notification.processor';
import { NotificationsController } from './notifications.controller';
import { BullModule } from '@nestjs/bullmq';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, AlertsService, NotificationProcessor],
  exports: [NotificationsService, AlertsService],
})
export class NotificationsModule {}
