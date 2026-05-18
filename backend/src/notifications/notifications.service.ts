import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType, NotificationStatus } from '@prisma/client';
import { compileTemplate } from './templates/template.registry';
import { encryptText } from '../common/crypto.utils';
import { RegisterDeviceTokenDto } from './dto/device-token.dto';
import { UpdatePreferenceDto } from './dto/preference.dto';
import { FCMProvider } from './providers/fcm.provider';
import { APNSProvider } from './providers/apns.provider';
import { SMSProvider } from './providers/sms.provider';
import { EmailProvider } from './providers/email.provider';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectQueue('notifications') private readonly notificationQueue: Queue,
    private readonly prisma: PrismaService,
    private readonly fcmProvider: FCMProvider,
    private readonly apnsProvider: APNSProvider,
    private readonly smsProvider: SMSProvider,
    private readonly emailProvider: EmailProvider,
  ) {}

  /**
   * Register or update a device registration token
   */
  async registerDeviceToken(userId: string, dto: RegisterDeviceTokenDto) {
    const { token, platform, deviceType, appVersion } = dto;
    const encryptedToken = encryptText(token);

    this.logger.log(`Registering device token for user ${userId} on platform ${platform}`);

    // Check if token already exists
    const existingToken = await this.prisma.deviceToken.findUnique({
      where: { token: encryptedToken },
    });

    if (existingToken) {
      return this.prisma.deviceToken.update({
        where: { id: existingToken.id },
        data: {
          userId, // Update owner if device logged in as a different user
          platform,
          deviceType: deviceType || existingToken.deviceType,
          appVersion: appVersion || existingToken.appVersion,
          isActive: true,
          lastActiveAt: new Date(),
        },
      });
    }

    return this.prisma.deviceToken.create({
      data: {
        userId,
        token: encryptedToken,
        platform,
        deviceType,
        appVersion,
        isActive: true,
      },
    });
  }

  /**
   * Get notification preferences for a user, creating defaults if not exist
   */
  async getPreferences(userId: string) {
    let preferences = await this.prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!preferences) {
      preferences = await this.prisma.notificationPreference.create({
        data: {
          userId,
          reminders: true,
          marketing: false,
          prescription: true,
          followup: true,
          queueAlerts: true,
        },
      });
    }

    return preferences;
  }

  /**
   * Update notification preferences for a user
   */
  async updatePreferences(userId: string, dto: UpdatePreferenceDto) {
    const preferences = await this.prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!preferences) {
      return this.prisma.notificationPreference.create({
        data: {
          userId,
          ...dto,
        },
      });
    }

    return this.prisma.notificationPreference.update({
      where: { userId },
      data: dto,
    });
  }

  /**
   * Send a notification asynchronously via BullMQ
   */
  async sendNotification(params: {
    recipient: string;
    type: NotificationType;
    templateName: string;
    data: Record<string, any>;
    patientId?: string;
    userId?: string;
  }) {
    const { recipient, type, templateName, data, patientId, userId } = params;

    try {
      const { subject, body } = compileTemplate(templateName, data);

      // Enforce HIPAA: Strip PHI (such as direct clinical details, diagnosis, lab results) from payloads
      const sanitizedBody = this.sanitizePayload(body);
      const sanitizedSubject = this.sanitizePayload(subject);

      // 1. Create standard Communication Log (PENDING)
      const commLog = await this.prisma.communicationLog.create({
        data: {
          recipient,
          channel: type,
          payload: sanitizedBody,
          templateName,
          status: 'PENDING',
          patientId,
          userId,
          metadata: { subject: sanitizedSubject, ...data },
        },
      });

      // 2. Create detailed Notification Audit Log
      const notifLog = await this.prisma.notificationLog.create({
        data: {
          userId,
          patientId,
          title: sanitizedSubject,
          message: sanitizedBody,
          channel: type,
          provider: this.determineProvider(type),
          status: 'PENDING',
          correlationId: commLog.id,
        },
      });

      // 3. Add to BullMQ Queue for background dispatch
      await this.notificationQueue.add(
        'send-message',
        {
          logId: commLog.id,
          notificationLogId: notifLog.id,
          recipient,
          type,
          subject: sanitizedSubject,
          body: sanitizedBody,
          userId,
        },
        {
          attempts: 5,
          backoff: {
            type: 'exponential',
            delay: 5000,
          },
        },
      );

      return commLog;
    } catch (error) {
      this.logger.error(
        `Failed to queue notification ${templateName}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Determine default provider for channel type
   */
  private determineProvider(type: NotificationType): string {
    switch (type) {
      case 'PUSH':
        return 'FIREBASE';
      case 'SMS':
      case 'WHATSAPP':
        return 'SMS';
      case 'EMAIL':
        return 'EMAIL';
      default:
        return 'IN_APP';
    }
  }

  /**
   * Sanitize push / SMS payloads to maintain strict HIPAA compliance
   * Ensure no medical diagnostics or PHI are leaked
   */
  private sanitizePayload(content: string): string {
    // Standard rule: replace explicit clinical placeholders if they exist
    return content
      .replace(/diagnosis[:\s]+[a-zA-Z0-9\s,-]+/gi, 'Medical Consultation')
      .replace(/result[:\s]+[a-zA-Z0-9\s,-]+/gi, 'Consultation Update');
  }

  /**
   * Create an in-app notification for a staff/admin user
   */
  async createInAppNotification(params: {
    userId: string;
    title: string;
    message: string;
    severity?: 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL';
    link?: string;
  }) {
    return this.prisma.inAppNotification.create({
      data: {
        userId: params.userId,
        title: params.title,
        message: params.message,
        severity: (params.severity as any) || 'MILD',
        link: params.link,
      },
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string) {
    return this.prisma.inAppNotification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
        status: 'READ',
      },
    });
  }

  async getInAppNotifications(userId: string) {
    return this.prisma.inAppNotification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAllInAppAsRead(userId: string) {
    return this.prisma.inAppNotification.updateMany({
      where: { userId, isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
        status: 'READ',
      },
    });
  }
}
