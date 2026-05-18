import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from './notifications.service';

@Injectable()
export class ReminderScheduleService {
  private readonly logger = new Logger(ReminderScheduleService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Schedule a new reminder in the database
   */
  async scheduleReminder(params: {
    targetId: string;
    targetType: string; // APPOINTMENT, MEDICINE, FOLLOWUP, BILLING
    reminderTime: Date;
    timeOffset: string; // 24H, 1H, MISSED
    metadata?: Record<string, any>;
  }) {
    const { targetId, targetType, reminderTime, timeOffset, metadata } = params;

    this.logger.log(
      `Scheduling reminder for ${targetType} (ID: ${targetId}) at ${reminderTime} [${timeOffset}]`,
    );

    return this.prisma.reminderSchedule.create({
      data: {
        targetId,
        targetType,
        reminderTime,
        timeOffset,
        metadata: metadata || {},
        status: 'PENDING',
      },
    });
  }

  /**
   * Cancel pending reminders for a given target
   */
  async cancelReminders(targetId: string, targetType: string) {
    this.logger.log(`Cancelling pending reminders for ${targetType} (ID: ${targetId})`);

    return this.prisma.reminderSchedule.updateMany({
      where: {
        targetId,
        targetType,
        status: 'PENDING',
      },
      data: {
        status: 'CANCELLED',
      },
    });
  }

  /**
   * Trigger pending reminders that are due
   * This is called regularly by a cron worker
   */
  async triggerPendingReminders() {
    const now = new Date();
    this.logger.log(`Scanning for pending reminders due before ${now.toISOString()}`);

    // Lock and query pending reminders due
    const pendingReminders = await this.prisma.reminderSchedule.findMany({
      where: {
        status: 'PENDING',
        reminderTime: {
          lte: now,
        },
      },
      take: 50, // Process in batches
    });

    if (pendingReminders.length === 0) {
      return;
    }

    this.logger.log(`Found ${pendingReminders.length} pending reminders to trigger.`);

    for (const reminder of pendingReminders) {
      try {
        // Mark as IN_PROGRESS to prevent double triggering (stateless scaling safety)
        await this.prisma.reminderSchedule.update({
          where: { id: reminder.id },
          data: { status: 'IN_PROGRESS' },
        });

        await this.dispatchReminder(reminder);

        await this.prisma.reminderSchedule.update({
          where: { id: reminder.id },
          data: { status: 'SENT' },
        });
      } catch (error) {
        this.logger.error(`Failed to trigger reminder ${reminder.id}: ${error.message}`);
        await this.prisma.reminderSchedule.update({
          where: { id: reminder.id },
          data: { status: 'FAILED' },
        });
      }
    }
  }

  /**
   * Dispatch specific reminder type after applying HIPAA and opt-out preferences
   */
  private async dispatchReminder(reminder: any) {
    const metadata = (reminder.metadata as Record<string, any>) || {};
    const patientId = metadata.patientId;
    const userId = metadata.userId;

    if (!patientId && !userId) {
      throw new Error('Reminder metadata does not contain patientId or userId');
    }

    // 1. Check patient notification preferences for HIPAA opt-out compliance
    if (userId) {
      const preferences = await this.prisma.notificationPreference.findUnique({
        where: { userId },
      });

      if (preferences && !preferences.reminders) {
        this.logger.log(`User ${userId} opted out of reminders. Skipping.`);
        return;
      }
    }

    // 2. Fetch target recipient information
    let recipientMobile = '';
    let patientName = '';

    if (patientId) {
      const patient = await this.prisma.patient.findUnique({
        where: { id: patientId },
      });
      if (!patient) {
        throw new Error(`Patient ${patientId} not found for reminder`);
      }
      recipientMobile = patient.mobile;
      patientName = `${patient.firstName} ${patient.lastName}`;
    }

    if (!recipientMobile && userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new Error(`User ${userId} not found for reminder`);
      }
      recipientMobile = user.mobile || '';
      patientName = user.name;
    }

    if (!recipientMobile) {
      throw new Error(`No mobile number available for reminder recipient`);
    }

    // 3. Dispatch the appropriate notification based on target type
    if (reminder.targetType === 'APPOINTMENT') {
      const appointment = await this.prisma.appointment.findUnique({
        where: { id: reminder.targetId },
        include: { doctor: { include: { user: true } } },
      });

      if (!appointment || appointment.status === 'CANCELLED') {
        this.logger.log(`Appointment ${reminder.targetId} is cancelled or not found. Skipping.`);
        return;
      }

      await this.notificationsService.sendNotification({
        recipient: recipientMobile,
        type: 'SMS',
        templateName: reminder.timeOffset === '24H' ? 'APPOINTMENT_REMINDER' : 'QUEUE_TOKEN_READY',
        data: {
          patientName,
          doctorName: appointment.doctor.user.name,
          appointmentTime: appointment.appointmentDate.toLocaleString(),
          tokenNumber: (appointment as any).tokenNumber || 'TBD',
        },
        patientId,
        userId,
      });
    } else {
      // General fallbacks for medicine / follow-up / billing reminders
      await this.notificationsService.sendNotification({
        recipient: recipientMobile,
        type: 'SMS',
        templateName: 'APPOINTMENT_REMINDER',
        data: {
          patientName,
          doctorName: 'MedFlow Clinic',
          appointmentTime: reminder.reminderTime.toLocaleString(),
        },
        patientId,
        userId,
      });
    }
  }
}
