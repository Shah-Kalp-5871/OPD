import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
