import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType, NotificationStatus } from '@prisma/client';
import { compileTemplate } from './templates/template.registry';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectQueue('notifications') private readonly notificationQueue: Queue,
    private readonly prisma: PrismaService,
  ) {}

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

      // 1. Create Communication Log (PENDING)
      const log = await this.prisma.communicationLog.create({
        data: {
          recipient,
          channel: type,
          payload: body,
          templateName,
          status: 'PENDING',
          patientId,
          metadata: { subject, ...data },
        },
      });

      // 2. Add to BullMQ Queue
      await this.notificationQueue.add(
        'send-message',
        {
          logId: log.id,
          recipient,
          type,
          subject,
          body,
        },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 5000,
          },
        },
      );

      return log;
    } catch (error) {
      this.logger.error(
        `Failed to queue notification ${templateName}: ${error.message}`,
      );
      throw error;
    }
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
