import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AlertsService } from '../notifications/alerts.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ReminderScheduleService } from '../notifications/reminder-schedule.service';
import { ApiUsageService } from '../public-api/usage/api-usage.service';

import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly alertsService: AlertsService,
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly reminderScheduleService: ReminderScheduleService,
    private readonly apiUsageService: ApiUsageService,
    @InjectQueue('reports') private readonly reportsQueue: Queue,
  ) {}

  /**
   * Run daily stock and expiry checks at 8:00 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async handleDailyChecks() {
    this.logger.log('Running daily stock and expiry checks...');
    await this.alertsService.checkLowStock();
    await this.alertsService.checkNearExpiry();
  }

  /**
   * Run heavy analytics caching at 2:00 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleAnalyticsWarmup() {
    this.logger.log('Dispatching background job to warm up analytics cache...');
    await this.reportsQueue.add('generate-daily-snapshot', {
      timestamp: new Date(),
    });
  }

  /**
   * Check for upcoming appointments every 4 hours and send reminders
   */
  @Cron(CronExpression.EVERY_4_HOURS)
  async handleAppointmentReminders() {
    this.logger.log('Checking for upcoming appointments to send reminders...');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const upcomingAppointments = await this.prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: tomorrow,
          lt: dayAfterTomorrow,
        },
        status: 'SCHEDULED',
      },
      include: { patient: true, doctor: { include: { user: true } } },
    });

    for (const appointment of upcomingAppointments) {
      if (!appointment.patient.mobile) continue;

      await this.notificationsService.sendNotification({
        recipient: appointment.patient.mobile,
        type: 'SMS',
        templateName: 'APPOINTMENT_REMINDER',
        data: {
          patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
          doctorName: appointment.doctor.user.name,
          appointmentTime: appointment.appointmentDate.toLocaleString(),
        },
        patientId: appointment.patient.id,
      });
    }
  }

  /**
   * Run every 5 minutes to trigger pending clinical reminders
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleScheduledReminders() {
    this.logger.log('Executing sweep of scheduled reminders...');
    await this.reminderScheduleService.triggerPendingReminders();
  }

  /** Aggregate public API usage into monthly summaries (1st of month, 3 AM). */
  @Cron('0 3 1 * *')
  async handleApiUsageAggregation() {
    this.logger.log('Aggregating monthly API usage summaries...');
    const count = await this.apiUsageService.aggregateMonthlySummaries();
    this.logger.log(`API usage aggregation complete: ${count} clients processed`);
  }
}
