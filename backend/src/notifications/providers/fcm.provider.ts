import { Injectable, Logger } from '@nestjs/common';
import { NotificationProvider, SendNotificationResult } from './notification-provider.interface';

@Injectable()
export class FCMProvider implements NotificationProvider {
  private readonly logger = new Logger(FCMProvider.name);

  async send(
    recipient: string,
    title: string,
    body: string,
    metadata?: Record<string, any>,
  ): Promise<SendNotificationResult> {
    this.logger.log(`[FCM] Sending push notification to token: ${recipient.slice(0, 10)}...`);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Simulate FCM service integration
    if (!recipient) {
      return { success: false, error: 'Recipient token is empty' };
    }

    const messageId = `fcm_msg_${Math.random().toString(36).substr(2, 9)}`;
    this.logger.log(`[FCM] Successfully delivered push notification. ID: ${messageId}`);
    return { success: true, messageId };
  }
}
