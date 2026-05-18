import { Injectable, Logger } from '@nestjs/common';
import { NotificationProvider, SendNotificationResult } from './notification-provider.interface';

@Injectable()
export class APNSProvider implements NotificationProvider {
  private readonly logger = new Logger(APNSProvider.name);

  async send(
    recipient: string,
    title: string,
    body: string,
    metadata?: Record<string, any>,
  ): Promise<SendNotificationResult> {
    this.logger.log(`[APNS] Sending Apple Push Notification to token: ${recipient.slice(0, 10)}...`);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 250));

    if (!recipient) {
      return { success: false, error: 'APNS device token is empty' };
    }

    const messageId = `apns_msg_${Math.random().toString(36).substr(2, 9)}`;
    this.logger.log(`[APNS] Successfully delivered Apple Push Notification. ID: ${messageId}`);
    return { success: true, messageId };
  }
}
