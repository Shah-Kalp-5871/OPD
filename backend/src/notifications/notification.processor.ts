import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

@Processor('notifications')
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { logId, recipient, type, subject, body } = job.data;

    try {
      this.logger.log(
        `Processing job ${job.id}: Sending ${type} to ${recipient}`,
      );

      // Simulate sending via external provider
      await this.simulateSending(type, recipient, subject, body);

      // Update log to SENT/DELIVERED
      await this.prisma.communicationLog.update({
        where: { id: logId },
        data: {
          status: 'SENT',
          deliveredAt: new Date(),
        },
      });

      return { success: true };
    } catch (error) {
      this.logger.error(`Job ${job.id} failed: ${error.message}`);

      // Update log to FAILED
      await this.prisma.communicationLog.update({
        where: { id: logId },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
        },
      });

      throw error; // Let BullMQ handle retries
    }
  }

  private async simulateSending(
    type: NotificationType,
    recipient: string,
    subject: string,
    body: string,
  ) {
    // Mock network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate random failure (10% chance)
    if (Math.random() < 0.1) {
      throw new Error(`Provider for ${type} is temporarily unavailable`);
    }

    this.logger.log(
      `[MOCK ${type}] To: ${recipient} | Subject: ${subject} | Body: ${body}`,
    );
  }
}
