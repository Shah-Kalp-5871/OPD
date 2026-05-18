import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrescriptionSignatureModule } from './prescription-signature/prescription-signature.module';
import { AuditModule } from './audit/audit.module';
import { HipaaAuditInterceptor } from './audit/hipaa-audit.interceptor';

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
import { TelemedicineModule } from './telemedicine/telemedicine.module';
import { PaymentModule } from './payment/payment.module';

import { envValidationSchema } from './common/config/env.validation';
import { HealthModule } from './health/health.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { JobsModule } from './jobs/jobs.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SocketModule } from './socket/socket.module';
import { PatientPortalModule } from './patient-portal/patient-portal.module';
import { StockTransferModule } from './inventory/stock-transfer/stock-transfer.module';
import { RedisCacheModule } from './common/cache/redis-cache.module';
import { ClinicalAiModule } from './clinical-ai/clinical-ai.module';
import { FhirModule } from './fhir/fhir.module';
import { InsuranceModule } from './insurance/insurance.module';
import { CommunicationsModule } from './communications/communications.module';
import { ExternalLabsModule } from './external-labs/external-labs.module';
import { BiModule } from './bi/bi.module';
import { MetricsModule } from './metrics/metrics.module';
import { LoggingModule } from './common/logging/logging.module';
import { ShutdownModule } from './common/shutdown/shutdown.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    RedisCacheModule,
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
    ClinicalAiModule,
    FhirModule,
    InsuranceModule,
    PrescriptionSignatureModule,
    AuditModule,
    CommunicationsModule,
    ExternalLabsModule,
    BiModule,
    MetricsModule,
    LoggingModule,
    ShutdownModule,
    TelemedicineModule,
    PaymentModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HipaaAuditInterceptor,
    },
  ],
})
export class AppModule {}
