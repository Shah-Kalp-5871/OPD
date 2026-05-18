import { Injectable, Logger } from '@nestjs/common';
import { NotificationProvider, SendNotificationResult } from './notification-provider.interface';

@Injectable()
export class EmailProvider implements NotificationProvider {
  private readonly logger = new Logger(EmailProvider.name);

  async send(
    recipient: string,
    title: string,
    body: string,
    metadata?: Record<string, any>,
  ): Promise<SendNotificationResult> {
    this.logger.log(`[Email] Dispatching email to: ${recipient}`);

    // Simulate SMTP network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!recipient) {
      return { success: false, error: 'Recipient email address is empty' };
    }

    const messageId = `email_msg_${Math.random().toString(36).substr(2, 9)}`;
    this.logger.log(`[Email] Email successfully dispatched. ID: ${messageId}`);
    return { success: true, messageId };
  }
}
