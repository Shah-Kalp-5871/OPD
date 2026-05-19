import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';
import { SecurityResilienceController } from './security-resilience.controller';
import { ZeroTrustService } from './services/zero-trust.service';
import { SecurityAnalyticsService } from './services/security-analytics.service';
import { ThreatIntelligenceService } from './services/threat-intelligence.service';
import { DisasterRecoveryService } from './services/disaster-recovery.service';
import { IncidentResponseService } from './services/incident-response.service';
import { SecurityVaultService } from './services/security-vault.service';
import { DeviceSecurityService } from './services/device-security.service';
import { SecurityGovernanceService } from './services/security-governance.service';

@Module({
  imports: [PrismaModule, TenancyModule],
  controllers: [SecurityResilienceController],
  providers: [
    ZeroTrustService,
    SecurityAnalyticsService,
    ThreatIntelligenceService,
    DisasterRecoveryService,
    IncidentResponseService,
    SecurityVaultService,
    DeviceSecurityService,
    SecurityGovernanceService,
  ],
  exports: [
    ZeroTrustService,
    SecurityAnalyticsService,
    ThreatIntelligenceService,
    DisasterRecoveryService,
    IncidentResponseService,
    SecurityVaultService,
    DeviceSecurityService,
    SecurityGovernanceService,
  ],
})
export class SecurityResilienceModule {}
