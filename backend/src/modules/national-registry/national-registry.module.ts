import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';
import { HealthIdVerificationService } from './services/health-id-verification.service';
import { RegistrySyncService } from './services/registry-sync.service';
import { NationalRegistryController } from './national-registry.controller';

@Module({
  imports: [PrismaModule, TenancyModule],
  providers: [HealthIdVerificationService, RegistrySyncService],
  controllers: [NationalRegistryController],
  exports: [HealthIdVerificationService, RegistrySyncService],
})
export class NationalRegistryModule {}
