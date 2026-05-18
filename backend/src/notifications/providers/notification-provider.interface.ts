export interface SendNotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface NotificationProvider {
  send(
    recipient: string,
    title: string,
    body: string,
    metadata?: Record<string, any>,
  ): Promise<SendNotificationResult>;
}
