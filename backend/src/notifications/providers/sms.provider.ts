import { Injectable, Logger } from '@nestjs/common';
import { NotificationProvider, SendNotificationResult } from './notification-provider.interface';

@Injectable()
export class SMSProvider implements NotificationProvider {
  private readonly logger = new Logger(SMSProvider.name);

  async send(
    recipient: string,
    title: string,
    body: string,
    metadata?: Record<string, any>,
  ): Promise<SendNotificationResult> {
    this.logger.log(`[SMS] Sending text message to mobile number: ${recipient}`);

    // Simulate SMS gateway network delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (!recipient) {
      return { success: false, error: 'Recipient phone number is empty' };
    }

    const messageId = `sms_msg_${Math.random().toString(36).substr(2, 9)}`;
    this.logger.log(`[SMS] Text message successfully sent. ID: ${messageId}`);
    return { success: true, messageId };
  }
}
