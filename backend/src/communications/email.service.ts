import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailMessage, EmailProvider } from './communications.types';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private providers: EmailProvider[] = [];

  constructor(private readonly prisma: PrismaService) {
    this.initializeProviders();
  }

  private initializeProviders() {
    // SMTP Provider
    const smtpProvider: EmailProvider = {
      name: 'SMTP',
      sendEmail: async (msg) => {
        this.logger.log(`[SMTP Email] Sending to ${msg.to}: "${msg.subject}"`);
        if (process.env.SMTP_HOST === 'FAIL') {
          return { success: false, error: 'Connection timed out (Simulated)' };
        }
        return { success: true, messageId: `smtp-${Math.random().toString(36).substring(7)}` };
      },
    };

    // AWS SES Provider
    const sesProvider: EmailProvider = {
      name: 'AWS_SES',
      sendEmail: async (msg) => {
        this.logger.log(`[AWS SES] Sending to ${msg.to}: "${msg.subject}"`);
        if (process.env.AWS_SES_REGION === 'FAIL') {
          return { success: false, error: 'Access denied: signature mismatch (Simulated)' };
        }
        return { success: true, messageId: `ses-${Math.random().toString(36).substring(7)}` };
      },
    };

    // Resend Provider
    const resendProvider: EmailProvider = {
      name: 'Resend',
      sendEmail: async (msg) => {
        this.logger.log(`[Resend Email] Sending to ${msg.to}: "${msg.subject}"`);
        return { success: true, messageId: `resend-${Math.random().toString(36).substring(7)}` };
      },
    };

    // Order: SMTP primary, AWS SES secondary, Resend as tertiary fallback
    this.providers = [smtpProvider, sesProvider, resendProvider];
  }

  /**
   * Generates formatted templates using rich responsive HTML styling.
   */
  renderTemplate(templateName: string, params: Record<string, string>): string {
    const primaryColor = '#1a365d'; // Deep Navy
    const accentColor = '#3182ce';  // MedBlue
    const headerHtml = `
      <div style="background-color: ${primaryColor}; padding: 25px; text-align: center; border-radius: 8px 8px 0 0; color: white;">
        <h1 style="margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 700;">MEDFLOW MEDICAL SYSTEM</h1>
        <p style="margin: 5px 0 0 0; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">Enterprise Healthcare Portal</p>
      </div>
    `;

    const footerHtml = `
      <div style="background-color: #f7fafc; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 11px; color: #a0aec0; border-top: 1px solid #edf2f7;">
        <p style="margin: 0 0 5px 0;">This email is a confidential clinical notification intended solely for the recipient.</p>
        <p style="margin: 0;">&copy; 2026 MedFlow Inc. All rights reserved. Branch operations verified under HIPAA rules.</p>
      </div>
    `;

    let contentHtml = '';

    switch (templateName) {
      case 'appointment_confirmation':
        contentHtml = `
          <h2 style="color: #2d3748; font-size: 18px;">Appointment Confirmed!</h2>
          <p>Dear <strong>${params.patientName || 'Patient'}</strong>,</p>
          <p>Your clinical appointment has been scheduled and confirmed in our system. Here are the clinical details:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #edf2f7; color: #718096; font-size: 13px;">Practitioner:</td>
              <td style="padding: 8px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #2d3748;">Dr. ${params.doctorName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #edf2f7; color: #718096; font-size: 13px;">Date & Time:</td>
              <td style="padding: 8px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #2d3748;">${params.dateTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #edf2f7; color: #718096; font-size: 13px;">Department / Specialty:</td>
              <td style="padding: 8px; border-bottom: 1px solid #edf2f7; color: #2d3748;">${params.department}</td>
            </tr>
          </table>
          <p style="color: #4a5568;">Please arrive 10 minutes prior to your slot time for basic vitals screening at reception.</p>
        `;
        break;

      case 'invoice_email':
        contentHtml = `
          <h2 style="color: #2d3748; font-size: 18px;">Clinical Invoice Receipt</h2>
          <p>Dear <strong>${params.patientName || 'Patient'}</strong>,</p>
          <p>Your billing transaction has been completed. Please find your official payment details below:</p>
          <div style="background-color: #ebf8ff; border-left: 4px solid ${accentColor}; padding: 15px; margin: 15px 0; border-radius: 0 4px 4px 0;">
            <p style="margin: 0; font-size: 13px; color: #2b6cb0;">Invoice Number: <strong>${params.invoiceNumber}</strong></p>
            <h3 style="margin: 5px 0 0 0; color: #2b6cb0; font-size: 22px;">Paid Amount: $${params.amountPaid}</h3>
          </div>
          <p>All laboratory tests, prescriptions, and consulting fees associated with Case Record <strong>${params.caseNumber}</strong> have been settled.</p>
        `;
        break;

      case 'prescription_pdf_ready':
        contentHtml = `
          <h2 style="color: #2d3748; font-size: 18px;">E-Prescription Digitally Signed</h2>
          <p>Dear <strong>${params.patientName || 'Patient'}</strong>,</p>
          <p>Your electronic prescription has been finalized, digitally signed by your consultant, and certified under MedFlow verification framework.</p>
          <p style="margin: 20px 0;">
            <a href="${params.pdfDownloadUrl}" style="background-color: ${accentColor}; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Download Certified PDF
            </a>
          </p>
          <p style="font-size: 12px; color: #718096;">Prescription Cryptographic Hash: <code style="background-color: #f7fafc; padding: 2px 4px; border-radius: 4px;">${params.signedHash}</code></p>
        `;
        break;

      case 'password_reset':
        contentHtml = `
          <h2 style="color: #2d3748; font-size: 18px;">Password Reset Request</h2>
          <p>Dear <strong>${params.userName || 'User'}</strong>,</p>
          <p>A request was made to reset your credential passwords for MedFlow EMR Portal access.</p>
          <p>Click the link below to set up a new password. This link remains valid for only 15 minutes.</p>
          <p style="margin: 20px 0;">
            <a href="${params.resetUrl}" style="background-color: #e53e3e; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Reset Password Account
            </a>
          </p>
          <p style="font-size: 12px; color: #a0aec0;">If you did not make this request, please contact your security branch administrator immediately.</p>
        `;
        break;

      default:
        contentHtml = `
          <h2 style="color: #2d3748; font-size: 18px;">Account Alert</h2>
          <p>${params.message || 'Details updated'}</p>
        `;
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e2e8f0;">
          ${headerHtml}
          <div style="padding: 30px; line-height: 1.6; color: #2d3748; font-size: 15px;">
            ${contentHtml}
          </div>
          ${footerHtml}
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Dispatches a templated HTML email with automated provider fallbacks.
   */
  async sendEmail(
    to: string,
    subject: string,
    templateName: string,
    params: Record<string, string>,
    patientId?: string,
    userId?: string,
  ): Promise<any> {
    const html = this.renderTemplate(templateName, params);
    const message: EmailMessage = { to, subject, html, templateName, patientId, userId };

    let lastError = '';

    for (const provider of this.providers) {
      try {
        const res = await provider.sendEmail(message);
        if (res.success) {
          await this.logEmail(message, 'SENT', provider.name, res.messageId);
          return { success: true, provider: provider.name, messageId: res.messageId };
        }
        lastError = res.error || 'Unknown email gateway issue';
        this.logger.warn(`Email provider ${provider.name} failed: ${lastError}. Trying secondary provider...`);
      } catch (err: any) {
        lastError = err.message;
        this.logger.warn(`Email provider ${provider.name} threw error: ${lastError}. Trying secondary provider...`);
      }
    }

    // All failed
    await this.logEmail(message, 'FAILED', 'NONE', undefined, lastError);
    return { success: false, error: `All email providers failed: ${lastError}` };
  }

  /**
   * Log email transaction inside database logs.
   */
  private async logEmail(
    msg: EmailMessage,
    status: 'SENT' | 'FAILED',
    providerName: string,
    messageId?: string,
    errorMsg?: string,
  ) {
    try {
      await this.prisma.communicationLog.create({
        data: {
          recipient: msg.to,
          channel: 'EMAIL',
          payload: `[Subject: ${msg.subject}] [Template: ${msg.templateName || 'custom'}]`,
          templateName: msg.templateName || 'custom_email',
          status,
          errorMessage: errorMsg,
          patientId: msg.patientId,
          userId: msg.userId,
          metadata: {
            provider: providerName,
            messageId,
          },
        },
      });
    } catch (dbError) {
      this.logger.error('Failed to log email communication event to database', dbError);
    }
  }
}
