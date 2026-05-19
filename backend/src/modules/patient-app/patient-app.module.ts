import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';
import { PatientProfileService } from './services/patient-profile.service';
import { PatientPreferencesService } from './services/patient-preferences.service';
import { PatientSessionService } from './services/patient-session.service';
import { PatientAppController } from './patient-app.controller';

@Module({
  imports: [PrismaModule, TenancyModule],
  providers: [PatientProfileService, PatientPreferencesService, PatientSessionService],
  controllers: [PatientAppController],
  exports: [PatientProfileService, PatientPreferencesService, PatientSessionService],
})
export class PatientAppModule {}