export interface SmsMessage {
  recipient: string; // Phone number with country code
  content: string;
  templateName?: string;
  templateParams?: Record<string, string>;
  patientId?: string;
  userId?: string;
}

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  templateName?: string;
  patientId?: string;
  userId?: string;
}

export interface CommunicationProvider {
  name: string;
  sendSms(message: SmsMessage): Promise<{ success: boolean; messageId?: string; error?: string }>;
  sendWhatsApp(message: SmsMessage): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

export interface EmailProvider {
  name: string;
  sendEmail(message: EmailMessage): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

export interface UptimeMetrics {
  twilioUptime: number;
  metaUptime: number;
  msg91Uptime: number;
  smtpUptime: number;
  sesUptime: number;
}
