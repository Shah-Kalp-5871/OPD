export interface PaymentIntentResult {
  clientSecret: string;
  providerId: string;
}

export interface PaymentProvider {
  createIntent(amount: number, currency: string, metadata: any): Promise<PaymentIntentResult>;
  verifyWebhookSignature(payload: any, signature: string): boolean;
}
