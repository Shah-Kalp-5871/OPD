import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SmsMessage, CommunicationProvider } from './communications.types';

@Injectable()
export class SmsWhatsappService {
  private readonly logger = new Logger(SmsWhatsappService.name);
  private providers: CommunicationProvider[] = [];
  
  // Rate limiting cache: recipient -> timestamps of sent messages
  private rateLimitCache = new Map<string, number[]>();

  constructor(private readonly prisma: PrismaService) {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Twilio Provider
    const twilioProvider: CommunicationProvider = {
      name: 'Twilio',
      sendSms: async (msg) => {
        this.logger.log(`[Twilio SMS] Sending to ${msg.recipient}: "${msg.content.substring(0, 30)}..."`);
        // In a real-world setting, this makes an API request to Twilio.
        // We will simulate the request and handle potential connection issues or credentials check.
        if (process.env.TWILIO_AUTH_TOKEN === 'FAIL') {
          return { success: false, error: 'Authentication failed (Simulated)' };
        }
        return { success: true, messageId: `tw-sms-${Math.random().toString(36).substring(7)}` };
      },
      sendWhatsApp: async (msg) => {
        this.logger.log(`[Twilio WhatsApp] Sending to ${msg.recipient}: "${msg.content.substring(0, 30)}..."`);
        return { success: true, messageId: `tw-wa-${Math.random().toString(36).substring(7)}` };
      },
    };

    // Meta WhatsApp Cloud API Provider
    const metaProvider: CommunicationProvider = {
      name: 'MetaCloud',
      sendSms: async () => ({ success: false, error: 'SMS not supported by Meta WhatsApp Cloud Provider' }),
      sendWhatsApp: async (msg) => {
        this.logger.log(`[Meta WhatsApp] Sending to ${msg.recipient}: "${msg.content.substring(0, 30)}..."`);
        if (process.env.META_ACCESS_TOKEN === 'FAIL') {
          return { success: false, error: 'Invalid API authorization header (Simulated)' };
        }
        return { success: true, messageId: `meta-wa-${Math.random().toString(36).substring(7)}` };
      },
    };

    // MSG91 Provider
    const msg91Provider: CommunicationProvider = {
      name: 'MSG91',
      sendSms: async (msg) => {
        this.logger.log(`[MSG91 SMS] Sending to ${msg.recipient}: "${msg.content.substring(0, 30)}..."`);
        return { success: true, messageId: `msg91-sms-${Math.random().toString(36).substring(7)}` };
      },
      sendWhatsApp: async (msg) => {
        this.logger.log(`[MSG91 WhatsApp] Sending to ${msg.recipient}: "${msg.content.substring(0, 30)}..."`);
        return { success: true, messageId: `msg91-wa-${Math.random().toString(36).substring(7)}` };
      },
    };

    // Twilio as primary, MSG91 as fallback for SMS. Meta as primary, Twilio as fallback for WhatsApp.
    this.providers = [twilioProvider, metaProvider, msg91Provider];
  }

  /**
   * Enforce rate limiting of 5 messages per minute per recipient.
   */
  private checkRateLimit(recipient: string): boolean {
    const now = Date.now();
    const timestamps = this.rateLimitCache.get(recipient) || [];
    
    // Filter timestamps in the last 60 seconds
    const recentSends = timestamps.filter((time) => now - time < 60000);
    
    if (recentSends.length >= 5) {
      this.logger.warn(`Rate limit triggered for recipient ${recipient}`);
      return false;
    }

    recentSends.push(now);
    this.rateLimitCache.set(recipient, recentSends);
    return true;
  }

  /**
   * Send SMS with automated fallback redundancy and retry processing.
   */
  async sendSms(message: SmsMessage): Promise<any> {
    if (!this.checkRateLimit(message.recipient)) {
      throw new BadRequestException('Rate limit exceeded. Too many messages to this recipient.');
    }

    // Try primary SMS provider (Twilio), fall back to MSG91 if failure occurs
    const smsProviders = this.providers.filter((p) => p.name === 'Twilio' || p.name === 'MSG91');
    let lastError = '';
    
    for (const provider of smsProviders) {
      try {
        const res = await provider.sendSms(message);
        if (res.success) {
          await this.logCommunication(message, 'SMS', 'SENT', provider.name, res.messageId);
          return { success: true, provider: provider.name, messageId: res.messageId };
        }
        lastError = res.error || 'Unknown provider error';
        this.logger.warn(`SMS Provider ${provider.name} failed: ${lastError}. Trying fallback...`);
      } catch (err: any) {
        lastError = err.message;
        this.logger.warn(`SMS Provider ${provider.name} threw error: ${lastError}. Trying fallback...`);
      }
    }

    // All failed
    await this.logCommunication(message, 'SMS', 'FAILED', 'NONE', undefined, lastError);
    return { success: false, error: `All SMS providers failed: ${lastError}` };
  }

  /**
   * Send WhatsApp with automated fallback redundancy (Meta Cloud -> Twilio -> MSG91).
   */
  async sendWhatsApp(message: SmsMessage): Promise<any> {
    if (!this.checkRateLimit(message.recipient)) {
      throw new BadRequestException('Rate limit exceeded. Too many messages to this recipient.');
    }

    const waProviders = [
      this.providers.find((p) => p.name === 'MetaCloud'),
      this.providers.find((p) => p.name === 'Twilio'),
      this.providers.find((p) => p.name === 'MSG91'),
    ].filter(Boolean) as CommunicationProvider[];

    let lastError = '';

    for (const provider of waProviders) {
      try {
        const res = await provider.sendWhatsApp(message);
        if (res.success) {
          await this.logCommunication(message, 'WHATSAPP', 'SENT', provider.name, res.messageId);
          return { success: true, provider: provider.name, messageId: res.messageId };
        }
        lastError = res.error || 'Unknown provider error';
        this.logger.warn(`WhatsApp Provider ${provider.name} failed: ${lastError}. Trying fallback...`);
      } catch (err: any) {
        lastError = err.message;
        this.logger.warn(`WhatsApp Provider ${provider.name} threw error: ${lastError}. Trying fallback...`);
      }
    }

    // All failed
    await this.logCommunication(message, 'WHATSAPP', 'FAILED', 'NONE', undefined, lastError);
    return { success: false, error: `All WhatsApp providers failed: ${lastError}` };
  }

  /**
   * Log communication transaction securely in database.
   */
  private async logCommunication(
    msg: SmsMessage,
    channel: 'SMS' | 'WHATSAPP',
    status: 'SENT' | 'FAILED',
    providerName: string,
    messageId?: string,
    errorMsg?: string,
  ) {
    try {
      await this.prisma.communicationLog.create({
        data: {
          recipient: msg.recipient,
          channel,
          payload: msg.content,
          templateName: msg.templateName || 'custom_text',
          status,
          errorMessage: errorMsg,
          patientId: msg.patientId,
          userId: msg.userId,
          metadata: {
            provider: providerName,
            messageId,
            params: msg.templateParams,
          },
        },
      });
    } catch (dbError) {
      this.logger.error('Failed to log SMS/WhatsApp communication event to database', dbError);
    }
  }
}
