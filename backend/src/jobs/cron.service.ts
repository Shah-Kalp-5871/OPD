import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AlertsService } from '../notifications/alerts.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly alertsService: AlertsService,
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
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
}
