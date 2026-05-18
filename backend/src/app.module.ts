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
import { PublicApiModule } from './public-api/public-api.module';

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
import { FhirModule } from './modules/fhir/fhir.module';
import { InsuranceModule } from './insurance/insurance.module';
import { CommunicationsModule } from './communications/communications.module';
import { ExternalLabsModule } from './external-labs/external-labs.module';
import { BiModule } from './bi/bi.module';
import { MetricsModule } from './metrics/metrics.module';
import { LoggingModule } from './common/logging/logging.module';
import { ShutdownModule } from './common/shutdown/shutdown.module';
import { TenancyModule } from './modules/tenancy/tenancy.module';
import { SaasBillingModule } from './modules/saas-billing/saas-billing.module';
import { Hl7Module } from './modules/hl7/hl7.module';
import { SmartFhirModule } from './modules/smart-fhir/smart-fhir.module';
import { CdsModule } from './modules/cds/cds.module';
import { HealthExchangeModule } from './modules/health-exchange/health-exchange.module';
import { GovernanceModule } from './modules/governance/governance.module';
import { TelemedicineV2Module } from './modules/telemedicine-v2/telemedicine-v2.module';
import { RpmModule } from './modules/rpm/rpm.module';
import { AiScribeModule } from './modules/ai-scribe/ai-scribe.module';
import { EpharmacyModule } from './modules/epharmacy/epharmacy.module';
import { VirtualHospitalModule } from './modules/virtual-hospital/virtual-hospital.module';
import { CommunicationHubModule } from './modules/communication-hub/communication-hub.module';
import { RegionalizationModule } from './modules/regionalization/regionalization.module';
import { PredictiveIntelligenceModule } from './modules/predictive-intelligence/predictive-intelligence.module';
import { WorkflowAiModule } from './modules/workflow-ai/workflow-ai.module';
import { AiImagingModule } from './modules/ai-imaging/ai-imaging.module';
import { FinancialIntelligenceModule } from './modules/financial-intelligence/financial-intelligence.module';
import { PopulationHealthModule } from './modules/population-health/population-health.module';
import { KnowledgeCopilotModule } from './modules/knowledge-copilot/knowledge-copilot.module';
import { MlopsModule } from './modules/mlops/mlops.module';
import { HrmsModule } from './modules/hrms/hrms.module';
import { WorkforceModule } from './modules/workforce/workforce.module';
import { PayrollModule } from './modules/payroll/payroll.module';
import { ProcurementModule } from './modules/procurement/procurement.module';
import { PharmacyIntelligenceModule } from './modules/pharmacy-intelligence/pharmacy-intelligence.module';
import { BiomedicalModule } from './modules/biomedical/biomedical.module';
import { FacilityOpsModule } from './modules/facility-ops/facility-ops.module';
import { ErpIntelligenceModule } from './modules/erp-intelligence/erp-intelligence.module';

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
    Hl7Module,
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
    PublicApiModule,
    TenancyModule,
    SaasBillingModule,
    SmartFhirModule,
    CdsModule,
    HealthExchangeModule,
    GovernanceModule,
    TelemedicineV2Module,
    RpmModule,
    AiScribeModule,
    EpharmacyModule,
    VirtualHospitalModule,
    CommunicationHubModule,
    RegionalizationModule,
    PredictiveIntelligenceModule,
    WorkflowAiModule,
    AiImagingModule,
    FinancialIntelligenceModule,
    PopulationHealthModule,
    KnowledgeCopilotModule,
    MlopsModule,
    HrmsModule,
    WorkforceModule,
    PayrollModule,
    ProcurementModule,
    PharmacyIntelligenceModule,
    BiomedicalModule,
    FacilityOpsModule,
    ErpIntelligenceModule,
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
