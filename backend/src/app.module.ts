import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { DoctorsModule } from './doctors/doctors.module';
import { StaffModule } from './staff/staff.module';
import { PatientsModule } from './patients/patients.module';
import { QueueModule } from './queue/queue.module';
import { BillingModule } from './billing/billing.module';
import { CommonModule } from './common/common.module';
import { ConsultationModule } from './consultation/consultation.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ConsentModule } from './consent/consent.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';
import { LaboratoryModule } from './laboratory/laboratory.module';
import { DrugsModule } from './admin/drugs/drugs.module';
import { LabMasterModule } from './admin/lab/lab.module';
import { ProcedureMasterModule } from './admin/procedures/procedures.module';

import { envValidationSchema } from './common/config/env.validation';
import { HealthModule } from './health/health.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { JobsModule } from './jobs/jobs.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SocketModule } from './socket/socket.module';
import { PatientPortalModule } from './patient-portal/patient-portal.module';
import { StockTransferModule } from './inventory/stock-transfer/stock-transfer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    DoctorsModule,
    StaffModule,
    PatientsModule,
    QueueModule,
    BillingModule,
    CommonModule,
    ConsultationModule,
    AppointmentsModule,
    ConsentModule,
    PharmacyModule,
    LaboratoryModule,
    DrugsModule,
    LabMasterModule,
    ProcedureMasterModule,
    HealthModule,
    AnalyticsModule,
    JobsModule,
    NotificationsModule,
    SocketModule,
    PatientPortalModule,
    StockTransferModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
