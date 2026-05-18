import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
import { decryptText } from '../common/crypto.utils';
import { FCMProvider } from './providers/fcm.provider';
import { APNSProvider } from './providers/apns.provider';
import { SMSProvider } from './providers/sms.provider';
import { EmailProvider } from './providers/email.provider';
import { SendNotificationResult } from './providers/notification-provider.interface';

@Processor('notifications')
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly fcmProvider: FCMProvider,
    private readonly apnsProvider: APNSProvider,
    private readonly smsProvider: SMSProvider,
    private readonly emailProvider: EmailProvider,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { logId, notificationLogId, recipient, type, subject, body, userId } = job.data;
    const currentAttempt = job.attemptsMade + 1;

    try {
      this.logger.log(
        `Processing job ${job.id} (Attempt ${currentAttempt}): Dispatching ${type} to recipient`,
      );

      let deliveryResult: SendNotificationResult = { success: false, messageId: '', error: '' };

      if (type === 'PUSH') {
        if (!userId) {
          throw new Error('Push notifications require a valid userId');
        }

        // Fetch active device tokens for the user
        const activeTokens = await this.prisma.deviceToken.findMany({
          where: { userId, isActive: true },
        });

        if (activeTokens.length === 0) {
          this.logger.warn(`No active device tokens found for user ${userId}. Push skipped.`);
          deliveryResult = { success: false, error: 'No active device tokens registered' };
        } else {
          // Send to all registered devices
          const results = await Promise.all(
            activeTokens.map(async (device) => {
              const decryptedToken = decryptText(device.token);
              if (device.platform === 'ANDROID') {
                return this.fcmProvider.send(decryptedToken, subject, body);
              } else if (device.platform === 'IOS') {
                return this.apnsProvider.send(decryptedToken, subject, body);
              } else {
                return this.fcmProvider.send(decryptedToken, subject, body); // Web uses FCM as default
              }
            }),
          );

          const anySuccess = results.some((r) => r.success);
          const errors = results.filter((r) => !r.success).map((r) => r.error);
          
          deliveryResult = {
            success: anySuccess,
            messageId: results.find((r) => r.success)?.messageId || '',
            error: errors.join('; '),
          };
        }
      } else if (type === 'SMS' || type === 'WHATSAPP') {
        deliveryResult = await this.smsProvider.send(recipient, subject, body);
      } else if (type === 'EMAIL') {
        deliveryResult = await this.emailProvider.send(recipient, subject, body);
      } else {
        // Fallback or In-App
        deliveryResult = { success: true, messageId: 'in_app_delivery' };
      }

      if (!deliveryResult.success && deliveryResult.error) {
        throw new Error(deliveryResult.error);
      }

      // Update standard Communication Log to SENT/DELIVERED
      await this.prisma.communicationLog.update({
        where: { id: logId },
        data: {
          status: 'SENT',
          deliveredAt: new Date(),
        },
      });

      // Update Audit Log
      await this.prisma.notificationLog.update({
        where: { id: notificationLogId },
        data: {
          status: 'DELIVERED',
          deliveredAt: new Date(),
          retryCount: currentAttempt,
        },
      });

      return { success: true };
    } catch (error) {
      this.logger.error(`Job ${job.id} failed: ${error.message}`);

      // Increment attempt counter and record error on detailed Audit Log
      await this.prisma.notificationLog.update({
        where: { id: notificationLogId },
        data: {
          status: 'FAILED',
          retryCount: currentAttempt,
          errorReason: error.message,
        },
      });

      // Update standard Communication Log to FAILED
      await this.prisma.communicationLog.update({
        where: { id: logId },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
        },
      });

      throw error; // Let BullMQ handle retries
    }
  }
}
