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
import { FollowupsModule } from './followups/followups.module';
import { ConsentModule } from './consent/consent.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';
import { LaboratoryModule } from './laboratory/laboratory.module';
import { DrugsModule } from './admin/drugs/drugs.module';
import { LabMasterModule } from './admin/lab/lab.module';
import { ProcedureMasterModule } from './admin/procedures/procedures.module';
import { PaymentSettingsModule } from './admin/payment-settings/payment-settings.module';
import { TelemedicineModule } from './telemedicine/telemedicine.module';
import { PaymentModule } from './payment/payment.module';
import { PublicApiModule } from './public-api/public-api.module';

import { envValidationSchema } from './common/config/env.validation';
import { HealthModule } from './health/health.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { JobsModule } from './jobs/jobs.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MedicalRepresentativesModule } from './medical-representatives/medical-representatives.module';
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
import { AnalyticsWarehouseModule } from './modules/analytics-warehouse/analytics-warehouse.module';
import { KpiStreamingModule } from './modules/kpi-streaming/kpi-streaming.module';
import { BiAnalyticsModule } from './modules/bi-analytics/bi-analytics.module';
import { ExecutiveAiModule } from './modules/executive-ai/executive-ai.module';
import { AnalyticsGovernanceModule } from './modules/analytics-governance/analytics-governance.module';
import { SecurityResilienceModule } from './modules/security-resilience/security-resilience.module';
import { InfrastructureControlPlaneModule } from './modules/infrastructure-control-plane/infrastructure-control-plane.module';
import { CloudOrchestrationModule } from './modules/cloud-orchestration/cloud-orchestration.module';
import { GlobalEdgeModule } from './modules/global-edge/global-edge.module';
import { DistributedSystemsModule } from './modules/distributed-systems/distributed-systems.module';
import { ReleaseEngineeringModule } from './modules/release-engineering/release-engineering.module';
import { ObservabilityModule } from './modules/observability/observability.module';
import { AutonomousOpsModule } from './modules/autonomous-ops/autonomous-ops.module';
import { PatientAppModule } from './modules/patient-app/patient-app.module';
import { ConsumerCommunicationModule } from './modules/consumer-communication/consumer-communication.module';
import { SelfServiceModule } from './modules/self-service/self-service.module';
import { WellnessModule } from './modules/wellness/wellness.module';
import { PatientCommerceModule } from './modules/patient-commerce/patient-commerce.module';
import { ConsumerAiModule } from './modules/consumer-ai/consumer-ai.module';
import { ExperienceModule } from './modules/experience/experience.module';
import { InsuranceClearinghouseModule } from './modules/insurance-clearinghouse/insurance-clearinghouse.module';
import { InteroperabilityHubModule } from './modules/interoperability-hub/interoperability-hub.module';
import { NationalRegistryModule } from './modules/national-registry/national-registry.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { ReferralExchangeModule } from './modules/referral-exchange/referral-exchange.module';
import { CrossBorderGovernanceModule } from './modules/cross-border-governance/cross-border-governance.module';
import { DigitalTwinModule } from './modules/digital-twin/digital-twin.module';
import { ClinicalNavigationModule } from './modules/clinical-navigation/clinical-navigation.module';
import { KnowledgeMeshModule } from './modules/knowledge-mesh/knowledge-mesh.module';
import { GlobalCommandCenterModule } from './modules/global-command-center/global-command-center.module';
import { ChatModule } from './chat/chat.module';


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
    FollowupsModule,
    ConsentModule,
    PharmacyModule,
    LaboratoryModule,
    DrugsModule,
    LabMasterModule,
    ProcedureMasterModule,
    PaymentSettingsModule,
    HealthModule,
    AnalyticsModule,
    JobsModule,
    NotificationsModule,
    MedicalRepresentativesModule,
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
    AnalyticsWarehouseModule,
    KpiStreamingModule,
    BiAnalyticsModule,
    ExecutiveAiModule,
    AnalyticsGovernanceModule,
    SecurityResilienceModule,
    InfrastructureControlPlaneModule,
    CloudOrchestrationModule,
    GlobalEdgeModule,
    DistributedSystemsModule,
    ReleaseEngineeringModule,
    ObservabilityModule,
    AutonomousOpsModule,
    PatientAppModule,
    ConsumerCommunicationModule,
    SelfServiceModule,
    WellnessModule,
    PatientCommerceModule,
    ConsumerAiModule,
    ExperienceModule,
    InsuranceClearinghouseModule,
    InteroperabilityHubModule,
    NationalRegistryModule,
    MarketplaceModule,
    ReferralExchangeModule,
    CrossBorderGovernanceModule,
    DigitalTwinModule,
    ClinicalNavigationModule,
    KnowledgeMeshModule,
    GlobalCommandCenterModule,
    ChatModule,
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
