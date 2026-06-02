[opd_deploy@srv1558204 backend]$ nano .env
[opd_deploy@srv1558204 backend]$ pm2 restart opd-backend
pm2 logs opd-backend --lines 15
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [opd-backend](ids: [ 0 ])
[PM2] [opd-backend](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ opd-backend        │ fork     │ 1    │ online    │ 0%       │ 14.1mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[TAILING] Tailing last 15 lines for [opd-backend] process (change the value with --lines option)
/home/opd_deploy/.pm2/logs/opd-backend-error.log last 15 lines:
0|opd-back |     at Server.setupListenHandle [as _listen2] (node:net:1908:16)
0|opd-back |     at listenInCluster (node:net:1965:12)
0|opd-back |     at Server.listen (node:net:2067:7)
0|opd-back |     at ExpressAdapter.listen (/home/opd_deploy/opd-system/backend/node_modules/@nestjs/platform-express/adapters/express-adapter.js:115:32)
0|opd-back |     at /home/opd_deploy/opd-system/backend/node_modules/@nestjs/core/nest-application.js:188:30
0|opd-back |     at new Promise (<anonymous>)
0|opd-back |     at NestApplication.listen (/home/opd_deploy/opd-system/backend/node_modules/@nestjs/core/nest-application.js:178:16)
0|opd-back |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
0|opd-back |     at async bootstrap (/home/opd_deploy/opd-system/backend/src/main.ts:152:3) {
0|opd-back |   code: 'EADDRINUSE',
0|opd-back |   errno: -98,
0|opd-back |   syscall: 'listen',
0|opd-back |   address: '::',
0|opd-back |   port: 3001
0|opd-back | }

/home/opd_deploy/.pm2/logs/opd-backend-out.log last 15 lines:
0|opd-back | solver","message":"ChatController {/api/chat}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-back | {"timestamp":"2026-06-02T06:12:13.188Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/chat, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-back | {"timestamp":"2026-06-02T06:12:13.188Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/chat, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-back | {"timestamp":"2026-06-02T06:12:13.285Z","severity":"info","module":"RedisPubSubService","message":"Initializing Redis Pub/Sub connections...","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-back | {"timestamp":"2026-06-02T06:12:13.288Z","severity":"warn","module":"RedisPubSubService","message":"Redis is not reachable at localhost:6379. Falling back gracefully to LOCAL Pub/Sub mode.","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-back | {"timestamp":"2026-06-02T06:12:13.295Z","severity":"warn","module":"RedisRoomRepository","message":"Redis is not reachable at localhost:6379. Falling back gracefully to fully functional IN-MEMORY Redis room client.","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-back | {"timestamp":"2026-06-02T06:12:13.308Z","severity":"info","module":"NestApplication","message":"Nest application successfully started","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-back | {"timestamp":"2026-06-02T06:12:13.308Z","severity":"error","module":"NestApplication","message":"Error: listen EADDRINUSE: address already in use :::3001","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-back | {"timestamp":"2026-06-02T06:15:00.004Z","severity":"info","module":"CronService","message":"Executing sweep of scheduled reminders...","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-back | {"timestamp":"2026-06-02T06:15:00.004Z","severity":"info","module":"ReminderScheduleService","message":"Scanning for pending reminders due before 2026-06-02T06:15:00.004Z","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-back | {"timestamp":"2026-06-02T06:16:30.282Z","severity":"info","module":"RedisPubSubService","message":"Closing Redis Pub/Sub connections...","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-back | {"timestamp":"2026-06-02T06:16:30.287Z","severity":"info","module":"GracefulShutdownService","message":"[GracefulShutdown] SIGTERM/SIGINT signal received (SIGINT). Initiating connection draining...","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-back | {"timestamp":"2026-06-02T06:16:30.287Z","severity":"info","module":"GracefulShutdownService","message":"[GracefulShutdown] Allowing 10 seconds for active connections to drain...","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}

0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.802Z","severity":"info","module":"NestFactory","message":"Starting Nest application...","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.841Z","severity":"info","module":"InstanceLoader","message":"PrismaModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.842Z","severity":"info","module":"InstanceLoader","message":"PassportModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.844Z","severity":"info","module":"InstanceLoader","message":"ConfigHostModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.844Z","severity":"info","module":"InstanceLoader","message":"ThrottlerModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.844Z","severity":"info","module":"InstanceLoader","message":"JwtModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.845Z","severity":"info","module":"InstanceLoader","message":"DiscoveryModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.845Z","severity":"info","module":"InstanceLoader","message":"ShutdownModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.857Z","severity":"info","module":"InstanceLoader","message":"ConfigModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.857Z","severity":"info","module":"InstanceLoader","message":"ConfigModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.861Z","severity":"info","module":"InstanceLoader","message":"ScheduleModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.862Z","severity":"info","module":"InstanceLoader","message":"LoggingModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.864Z","severity":"info","module":"InstanceLoader","message":"MetricsModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.864Z","severity":"info","module":"InstanceLoader","message":"GlobalCommandCenterModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.864Z","severity":"info","module":"InstanceLoader","message":"SocketModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.864Z","severity":"info","module":"InstanceLoader","message":"BullModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.865Z","severity":"info","module":"InstanceLoader","message":"TerminusModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.865Z","severity":"info","module":"InstanceLoader","message":"JwtModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.866Z","severity":"info","module":"InstanceLoader","message":"JwtModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.866Z","severity":"info","module":"InstanceLoader","message":"JwtModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.869Z","severity":"info","module":"InstanceLoader","message":"WsAuthModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.871Z","severity":"info","module":"InstanceLoader","message":"FileStorageModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.871Z","severity":"info","module":"InstanceLoader","message":"GlobalEdgeModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.871Z","severity":"info","module":"InstanceLoader","message":"DistributedSystemsModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.871Z","severity":"info","module":"InstanceLoader","message":"ObservabilityModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.871Z","severity":"info","module":"InstanceLoader","message":"CommonModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.871Z","severity":"info","module":"InstanceLoader","message":"FollowupsModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.871Z","severity":"info","module":"InstanceLoader","message":"DrugsModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.871Z","severity":"info","module":"InstanceLoader","message":"LabMasterModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.871Z","severity":"info","module":"InstanceLoader","message":"ProcedureMasterModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.871Z","severity":"info","module":"InstanceLoader","message":"PaymentSettingsModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.871Z","severity":"info","module":"InstanceLoader","message":"InsuranceModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.871Z","severity":"info","module":"InstanceLoader","message":"PrescriptionSignatureModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.871Z","severity":"info","module":"InstanceLoader","message":"ExternalLabsModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.871Z","severity":"info","module":"InstanceLoader","message":"TelemedicineV2Module dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.871Z","severity":"info","module":"InstanceLoader","message":"RpmModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.871Z","severity":"info","module":"InstanceLoader","message":"AiScribeModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.871Z","severity":"info","module":"InstanceLoader","message":"EpharmacyModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"VirtualHospitalModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"CommunicationHubModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"RegionalizationModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"LaboratoryModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"WorkflowAiModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"AiImagingModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"FinancialIntelligenceModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"PopulationHealthModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"KnowledgeCopilotModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"MlopsModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"HrmsModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"WorkforceModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"PayrollModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"ProcurementModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"PharmacyIntelligenceModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"BiomedicalModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"FacilityOpsModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"ErpIntelligenceModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"AnalyticsWarehouseModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"BiAnalyticsModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"ExecutiveAiModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"AnalyticsGovernanceModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"SecurityResilienceModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"AutonomousOpsModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"PatientAppModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"ConsumerCommunicationModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"SelfServiceModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"WellnessModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"PatientCommerceModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"ConsumerAiModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"ExperienceModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"InsuranceClearinghouseModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"InteroperabilityHubModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"NationalRegistryModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"MarketplaceModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"ReferralExchangeModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"CrossBorderGovernanceModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"DigitalTwinModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"ClinicalNavigationModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"KnowledgeMeshModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"AuditModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.872Z","severity":"info","module":"InstanceLoader","message":"KpiStreamingModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.873Z","severity":"info","module":"InstanceLoader","message":"PredictiveIntelligenceModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.873Z","severity":"info","module":"InstanceLoader","message":"CommunicationsModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.873Z","severity":"info","module":"InstanceLoader","message":"PatientsModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.873Z","severity":"info","module":"InstanceLoader","message":"QueueModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.873Z","severity":"info","module":"InstanceLoader","message":"UsersModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.873Z","severity":"info","module":"InstanceLoader","message":"DoctorsModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.873Z","severity":"info","module":"InstanceLoader","message":"StaffModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.873Z","severity":"info","module":"InstanceLoader","message":"ConsentModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.873Z","severity":"info","module":"InstanceLoader","message":"StockTransferModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.873Z","severity":"info","module":"InstanceLoader","message":"SmartFhirModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.873Z","severity":"info","module":"InstanceLoader","message":"CdsModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.873Z","severity":"info","module":"InstanceLoader","message":"HealthExchangeModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.873Z","severity":"info","module":"InstanceLoader","message":"GovernanceModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.873Z","severity":"info","module":"InstanceLoader","message":"ChatModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.873Z","severity":"info","module":"InstanceLoader","message":"InfrastructureControlPlaneModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.873Z","severity":"info","module":"InstanceLoader","message":"CloudOrchestrationModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.873Z","severity":"info","module":"InstanceLoader","message":"ReleaseEngineeringModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.873Z","severity":"info","module":"InstanceLoader","message":"PaymentModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.873Z","severity":"info","module":"InstanceLoader","message":"BillingModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.873Z","severity":"info","module":"InstanceLoader","message":"AppModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.873Z","severity":"info","module":"InstanceLoader","message":"ConsultationModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.873Z","severity":"info","module":"InstanceLoader","message":"PharmacyModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.873Z","severity":"info","module":"InstanceLoader","message":"AuthModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.873Z","severity":"info","module":"InstanceLoader","message":"TelemedicineModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | [RedisCacheModule] Redis is not reachable at localhost:6379. Falling back gracefully to IN-MEMORY cache store.
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.877Z","severity":"info","module":"InstanceLoader","message":"CacheModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.877Z","severity":"info","module":"InstanceLoader","message":"RedisCacheModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.879Z","severity":"info","module":"InstanceLoader","message":"ClinicalAiModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.879Z","severity":"info","module":"InstanceLoader","message":"SaasBillingModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.879Z","severity":"info","module":"InstanceLoader","message":"BiModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.879Z","severity":"info","module":"InstanceLoader","message":"AnalyticsModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.880Z","severity":"info","module":"InstanceLoader","message":"BullModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.883Z","severity":"info","module":"InstanceLoader","message":"BullModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.883Z","severity":"info","module":"InstanceLoader","message":"BullModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.883Z","severity":"info","module":"InstanceLoader","message":"BullModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.883Z","severity":"info","module":"InstanceLoader","message":"BullModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.883Z","severity":"info","module":"InstanceLoader","message":"BullModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.883Z","severity":"info","module":"InstanceLoader","message":"BullModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.883Z","severity":"info","module":"InstanceLoader","message":"BullModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.883Z","severity":"info","module":"InstanceLoader","message":"BullModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.883Z","severity":"info","module":"InstanceLoader","message":"HealthModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.884Z","severity":"info","module":"InstanceLoader","message":"JobsModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.887Z","severity":"info","module":"InstanceLoader","message":"TenancyModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.887Z","severity":"info","module":"InstanceLoader","message":"FhirModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.887Z","severity":"info","module":"InstanceLoader","message":"NotificationsModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.887Z","severity":"info","module":"InstanceLoader","message":"PatientPortalModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.887Z","severity":"info","module":"InstanceLoader","message":"Hl7Module dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.887Z","severity":"info","module":"InstanceLoader","message":"AppointmentsModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.887Z","severity":"info","module":"InstanceLoader","message":"PublicApiModule dependencies initialized","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.892Z","severity":"warn","module":"RateLimitService","message":"Redis is not reachable at localhost:6379. Falling back gracefully to IN-MEMORY rate limiter.","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.899Z","severity":"warn","module":"Application","message":"Redis is not reachable at localhost:6379. Falling back gracefully to NestJS standard in-memory WebSocket adapter.","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.905Z","severity":"info","module":"WebSocketsController","message":"AppGateway subscribed to the \"authenticate\" message","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.905Z","severity":"info","module":"WebSocketsController","message":"AppGateway subscribed to the \"join-room\" message","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.907Z","severity":"info","module":"WebSocketsController","message":"TelemedicineGateway subscribed to the \"join-room\" message","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.907Z","severity":"info","module":"WebSocketsController","message":"TelemedicineGateway subscribed to the \"offer\" message","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.907Z","severity":"info","module":"WebSocketsController","message":"TelemedicineGateway subscribed to the \"answer\" message","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.907Z","severity":"info","module":"WebSocketsController","message":"TelemedicineGateway subscribed to the \"ice-candidate\" message","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.907Z","severity":"info","module":"WebSocketsController","message":"TelemedicineGateway subscribed to the \"leave-room\" message","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.907Z","severity":"info","module":"WebSocketsController","message":"RealtimeMetricsGateway subscribed to the \"join_room\" message","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.911Z","severity":"warn","module":"LegacyRouteConverter","message":"Unsupported route path: \"/api/*\". In previous versions, the symbols ?, *, and + were used to denote optional or repeating path parameters. The latest version of \"path-to-regexp\" now requires the use of named parameters. For example, instead of using a route like /users/* to capture all routes starting with \"/users\", you should use /users/*path. For more details, refer to the migration guide. Attempting to auto-convert...","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.912Z","severity":"warn","module":"LegacyRouteConverter","message":"Unsupported route path: \"/api/*\". In previous versions, the symbols ?, *, and + were used to denote optional or repeating path parameters. The latest version of \"path-to-regexp\" now requires the use of named parameters. For example, instead of using a route like /users/* to capture all routes starting with \"/users\", you should use /users/*path. For more details, refer to the migration guide. Attempting to auto-convert...","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.912Z","severity":"info","module":"RoutesResolver","message":"AppController {/api}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.914Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.914Z","severity":"info","module":"RoutesResolver","message":"AuthController {/api/auth}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.914Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/auth/login, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.914Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/auth/mfa/setup, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.915Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/auth/mfa/enable, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.915Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/auth/mfa/verify, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.915Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/auth/mfa/disable, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.915Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/auth/permissions/override, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.915Z","severity":"info","module":"RoutesResolver","message":"SsoController {/api/auth/sso}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.916Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/auth/sso/login, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.916Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/auth/sso/callback, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.916Z","severity":"info","module":"RoutesResolver","message":"UsersController {/api/users}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.916Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/users/me, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.916Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/users/me, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.916Z","severity":"info","module":"RoutesResolver","message":"DoctorsController {/api/doctors}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.917Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/doctors, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.917Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/doctors, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.917Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/doctors/:id, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.917Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/doctors/:id, PUT} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.917Z","severity":"info","module":"RoutesResolver","message":"StaffController {/api/staff}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.918Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/staff, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.918Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/staff, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.918Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/staff/:id, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.918Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/staff/:id, PUT} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.918Z","severity":"info","module":"RoutesResolver","message":"PatientsController {/api/patients}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.918Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patients, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.918Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patients/:id, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.918Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patients/next-mrd, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.918Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patients, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.919Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patients/search, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.919Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patients/:id, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.919Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patients/mrd/:mrd, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.919Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patients/:id/profile, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.919Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patients/:id/vitals, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.919Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patients/:id/vitals-history, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.920Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patients/:id/history, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.920Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patients/:id/billing, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.920Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patients/:id/appointments, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.921Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patients/:id/cases, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.921Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patients/:id/documents, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.921Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patients/:id/documents/:docId, DELETE} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.921Z","severity":"info","module":"RoutesResolver","message":"QueueController {/api/queue}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.921Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/queue/check-in, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.922Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/queue/:id/status, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.922Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/queue/case/:caseId/stage, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.922Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/queue/session/start, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.922Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/queue/session/end, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.922Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/queue/live, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.922Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/queue/stats, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.922Z","severity":"info","module":"RoutesResolver","message":"BillingController {/api/billing}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.922Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/billing, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.922Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/billing/details/:id, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.923Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/billing/:caseId, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.923Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/billing/list/pending, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.923Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/billing/list/all, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.923Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/billing/list/history, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.923Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/billing/:id/pay, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.923Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/billing/:id/finalize, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.923Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/billing/:id/refund, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.923Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/billing/:id/pay-razorpay, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.924Z","severity":"info","module":"RoutesResolver","message":"PaymentController {/api/api/v2/payments}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.924Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/payments/checkout, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.924Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/payments/link, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.924Z","severity":"info","module":"RoutesResolver","message":"WebhookController {/api/api/v2/webhooks}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.924Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/webhooks/stripe, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.924Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/webhooks/razorpay, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.924Z","severity":"info","module":"RoutesResolver","message":"CommunicationsController {/api/communications}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.924Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/communications/test/sms, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.924Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/communications/test/whatsapp, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.924Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/communications/test/email, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.925Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/communications/dashboard, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.925Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/communications/dlq/retry/:id, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.925Z","severity":"info","module":"RoutesResolver","message":"EventsController {/api/events}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.925Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/events/queue, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.925Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/events/clinical, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.925Z","severity":"info","module":"RoutesResolver","message":"FileStorageController {/api/files}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.925Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/files/:folder, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.926Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/files/:folder/:filename, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.926Z","severity":"info","module":"RoutesResolver","message":"ConsultationController {/api/consultation}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.926Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/consultation/lab/masters, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.926Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/consultation/pharmacy/drugs, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.926Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/consultation/clinical/procedures, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.926Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/consultation/:caseId, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.926Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/consultation/:caseId/save, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.926Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/consultation/:caseId/investigations, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.926Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/consultation/:caseId/prescriptions, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.927Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/consultation/:caseId/procedures, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.927Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/consultation/:caseId/images, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.927Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/consultation/:caseId/images, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.927Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/consultation/:caseId/finalize, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.928Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/consultation/:caseId/investigations, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.928Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/consultation/investigations/:orderId, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.928Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/consultation/investigations/:orderId/upload, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.928Z","severity":"info","module":"RoutesResolver","message":"AppointmentsController {/api/appointments}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.928Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/appointments, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.928Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/appointments, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.929Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/appointments/admin/stats, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.929Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/appointments/slots, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.929Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/appointments/:id, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.929Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/appointments/:id/status, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.929Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/appointments/:id/reschedule, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.929Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/appointments/:id/cancel, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.929Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/appointments/bulk-cancel, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.929Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/appointments/check-in, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.929Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/appointments/missed-action, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.929Z","severity":"info","module":"RoutesResolver","message":"FollowupsController {/api/followups}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.930Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/followups, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.930Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/followups, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.931Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/followups/pending, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.931Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/followups/:id/status, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.931Z","severity":"info","module":"RoutesResolver","message":"ConsentController {/api/consent}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.932Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/consent/templates, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.932Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/consent/case/:caseId, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.932Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/consent/case/:caseId, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.932Z","severity":"info","module":"RoutesResolver","message":"PharmacyController {/api/pharmacy}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.932Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/pharmacy/queue, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.932Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/pharmacy/dispense, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.932Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/pharmacy/inventory, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.932Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/pharmacy/prescriptions/:caseId, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.932Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/pharmacy/inventory/alerts, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.932Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/pharmacy/inventory/valuation, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.932Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/pharmacy/inventory/movements, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.932Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/pharmacy/inventory/receive, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.932Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/pharmacy/inventory/adjust, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.932Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/pharmacy/return, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.932Z","severity":"info","module":"RoutesResolver","message":"LaboratoryController {/api/laboratory}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.932Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/laboratory/pending, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.932Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/laboratory/order/:id, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.932Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/laboratory/order/:id/status, PUT} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.933Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/laboratory/order/:id/results, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.933Z","severity":"info","module":"RoutesResolver","message":"DrugsController {/api/admin/drugs}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.933Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/drugs, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.933Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/drugs/masters/categories, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.933Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/drugs/masters/formulations, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.933Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/drugs, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.933Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/drugs/:id, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.933Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/drugs/:id, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.933Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/drugs/:id, DELETE} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.933Z","severity":"info","module":"RoutesResolver","message":"LabMasterController {/api/admin/lab}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.934Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/lab/categories, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.934Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/lab/categories, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.935Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/lab/categories/:id, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.935Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/lab/categories/:id, DELETE} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.935Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/lab/parameters, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.936Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/lab/parameters, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.936Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/lab/parameters/:id, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.936Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/lab/parameters/:id, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.937Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/lab/parameters/:id, DELETE} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.937Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/lab/masters/units, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.937Z","severity":"info","module":"RoutesResolver","message":"ProcedureMasterController {/api/admin/procedures}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.937Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/procedures, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.937Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/procedures, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.937Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/procedures/masters/categories, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.937Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/procedures/:id, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.937Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/procedures/:id, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.938Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/procedures/:id, DELETE} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.938Z","severity":"info","module":"RoutesResolver","message":"PaymentSettingsController {/api/admin/payment-settings}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.938Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/payment-settings, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.938Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/payment-settings, PUT} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.938Z","severity":"info","module":"RoutesResolver","message":"HealthController {/api/health}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.938Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/health, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.938Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/health/live, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.938Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/health/ready, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.939Z","severity":"info","module":"RoutesResolver","message":"AnalyticsController {/api/analytics}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.939Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/analytics/interop-telemetry, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.939Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/analytics/dashboard/stats, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.939Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/analytics/enterprise/branch-comparison, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.939Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/analytics/financial, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.939Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/analytics/clinical, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.939Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/analytics/inventory, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.939Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/analytics/audit, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.939Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/analytics/export/financial, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.939Z","severity":"info","module":"RoutesResolver","message":"OAuthController {/api/api/v2/oauth}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.939Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/oauth/register, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.939Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/oauth/authorize, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.939Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/oauth/token, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.939Z","severity":"info","module":"RoutesResolver","message":"PublicWebhookController {/api/api/v2/webhooks}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.939Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/webhooks/subscriptions, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.939Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/webhooks/subscriptions, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.939Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/webhooks/subscriptions/:id, DELETE} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.939Z","severity":"info","module":"RoutesResolver","message":"WebhookRegistryController {/api/api/v2/webhooks/registry}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.940Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/webhooks/registry/events, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.940Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/webhooks/registry/deliveries, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.940Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/webhooks/registry/dead-letter, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.940Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/webhooks/registry/deliveries/:id/replay, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.940Z","severity":"info","module":"RoutesResolver","message":"WebhookAdminController {/api/admin/webhooks}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.941Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/webhooks/catalog, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.941Z","severity":"info","module":"RoutesResolver","message":"PublicAppointmentsController {/api/api/v2/appointments}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.942Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/appointments, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.943Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/appointments, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.943Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/appointments/:id/cancel, PUT} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.944Z","severity":"info","module":"RoutesResolver","message":"PublicPatientsController {/api/api/v2/patients}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.944Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/patients, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.944Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/patients/:id, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.944Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/patients, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.944Z","severity":"info","module":"RoutesResolver","message":"ApiClientAdminController {/api/admin/api-clients}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.944Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/api-clients, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.945Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/api-clients/:clientId, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.945Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/api-clients, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.945Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/api-clients/:clientId, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.945Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/api-clients/:clientId/rotate-key, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.945Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/api-clients/:clientId/revoke-key, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.945Z","severity":"info","module":"RoutesResolver","message":"ApiUsageController {/api/admin/api-usage}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.945Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/api-usage/analytics, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.945Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/admin/api-usage/clients/:clientId, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.945Z","severity":"info","module":"RoutesResolver","message":"PublicApiDocsController {/api/api/v2/docs}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.945Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/docs/openapi, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.946Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/docs/onboarding, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.946Z","severity":"info","module":"RoutesResolver","message":"MetricsController {/api/metrics}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.946Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/metrics, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.946Z","severity":"info","module":"RoutesResolver","message":"TenantController {/api/v2/tenants}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.946Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/v2/tenants/onboarding, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.946Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/v2/tenants/branding/resolve, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.946Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/v2/tenants/me, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.946Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/v2/tenants/branding, PUT} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.946Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/v2/tenants/domains, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.946Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/v2/tenants/domains/:domainId/verify, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.946Z","severity":"info","module":"RoutesResolver","message":"NotificationsController {/api/notifications}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.947Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/notifications/in-app, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.947Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/notifications/in-app/:id/read, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.947Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/notifications/in-app/read-all, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.947Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/notifications/device-token, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.947Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/notifications/preferences, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.947Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/notifications/preferences, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.947Z","severity":"info","module":"RoutesResolver","message":"PatientPortalController {/api/patient-portal}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.948Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patient-portal/request-otp, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.948Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patient-portal/verify-otp, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.948Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patient-portal/profile, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.948Z","severity":"info","module":"RoutesResolver","message":"StockTransferController {/api/inventory/stock-transfers}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.948Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/inventory/stock-transfers, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.948Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/inventory/stock-transfers, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.948Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/inventory/stock-transfers/:id, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.948Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/inventory/stock-transfers/:id/approve, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.948Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/inventory/stock-transfers/:id/dispatch, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.948Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/inventory/stock-transfers/:id/receive, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.949Z","severity":"info","module":"RoutesResolver","message":"ClinicalAiController {/api/ai}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.949Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/ai/clinical/suggest, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.949Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/ai/clinical/outcome, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.949Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/ai/audit/logs, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.949Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/ai/risk/evaluate, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.949Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/ai/risk/patient/:patientId, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.949Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/ai/risk/flag/:flagId/acknowledge, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.949Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/ai/risk/branch/:branchId/summary, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.950Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/ai/inventory/forecast, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.950Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/ai/inventory/expiry-risk, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.950Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/ai/inventory/slow-moving, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.950Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/ai/inventory/reorder, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.950Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/ai/ops/scan, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.950Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/ai/ops/anomalies, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.950Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/ai/ops/anomalies/:id, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.950Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/ai/ops/appointments, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.950Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/ai/ops/revenue-forecast, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.950Z","severity":"info","module":"RoutesResolver","message":"FhirController {/api}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.950Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/fhir/metadata, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.951Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/fhir/Patient/:id, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.951Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/fhir/Patient, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.951Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/fhir/Patient, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.951Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/fhir/Patient/:id, PUT} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.951Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/fhir/Observation, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.951Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/fhir/Observation, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.951Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/fhir/Encounter/:id, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.951Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/fhir/MedicationRequest, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.951Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/fhir/Appointment/:id, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.951Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/terminology/search, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.951Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/terminology/icd10/:code, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.952Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/fhir/consent, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.952Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/fhir/consent/grant, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.952Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/fhir/consent/revoke/:id, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.952Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/fhir/\\$export, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.953Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/fhir/\\$export/status/:id, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.953Z","severity":"info","module":"RoutesResolver","message":"Hl7Controller {/api/api/v2/hl7}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.953Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/hl7/ingest, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.953Z","severity":"info","module":"RoutesResolver","message":"InsuranceController {/api/insurance}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.954Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/insurance/pre-auth/request, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.954Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/insurance/pre-auth/review, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.954Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/insurance/pre-auth/:id, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.954Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/insurance/split-bill/:billId/:policyId, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.954Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/insurance/claims/generate, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.954Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/insurance/claims/:id, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.954Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/insurance/claims/patient/:patientId, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.954Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/insurance/tpa/logs, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.954Z","severity":"info","module":"RoutesResolver","message":"PrescriptionSignatureController {/api/prescription-signature}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.954Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/prescription-signature/sign/:id, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.954Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/prescription-signature/verify/:id, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.954Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/prescription-signature/pdf/:id, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.954Z","severity":"info","module":"RoutesResolver","message":"AuditController {/api/audit}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.954Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/audit/consent/record, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.955Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/audit/consent/withdraw/:id, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.955Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/audit/consent/patient/:patientId, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.955Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/audit/admin/logs, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.955Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/audit/admin/suspicious, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.955Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/audit/admin/failed-logins, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.955Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/audit/admin/cross-branch, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.955Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/audit/admin/high-risk, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.955Z","severity":"info","module":"RoutesResolver","message":"ExternalLabsController {/api/external-labs}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.955Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/external-labs/webhooks/register, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.955Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/external-labs/webhooks, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.955Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/external-labs/inbound/:provider, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.955Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/external-labs/webhooks/trigger/:regId, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.955Z","severity":"info","module":"RoutesResolver","message":"BiController {/api/bi}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.955Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/bi/executive-overview, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.955Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/bi/revenue, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.955Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/bi/forecasting, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.955Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/bi/doctor-performance, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.955Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/bi/branch-comparison, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.955Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/bi/patient-trends, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.956Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/bi/operational-monitoring, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.956Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/bi/datamart/materialize, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.956Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/bi/export, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.956Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/bi/export/download/:fileName, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.956Z","severity":"info","module":"RoutesResolver","message":"TelemedicineController {/api/api/v2/telemedicine}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.956Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/telemedicine/token, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.956Z","severity":"info","module":"RoutesResolver","message":"SaasBillingController {/api/api/v2/saas-billing}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.956Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/saas-billing/checkout, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.956Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/saas-billing/portal, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.956Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/saas-billing/webhook, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.956Z","severity":"info","module":"RoutesResolver","message":"SmartFhirController {/api/api/v2/smart-fhir}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.956Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/smart-fhir/:tenantId/register, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.956Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/smart-fhir/:tenantId/apps, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.957Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/smart-fhir/:tenantId/launch, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.957Z","severity":"info","module":"RoutesResolver","message":"CdsController {/api/api/v2/cds}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.957Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/cds/:tenantId/rules, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.957Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/cds/:tenantId/rules, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.957Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/cds/:tenantId/evaluate, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.957Z","severity":"info","module":"RoutesResolver","message":"HealthExchangeController {/api/api/v2/health-exchange}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.957Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/health-exchange/:tenantId/connectors, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.957Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/health-exchange/:tenantId/connectors, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.957Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/health-exchange/:tenantId/logs, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.957Z","severity":"info","module":"RoutesResolver","message":"GovernanceController {/api/api/v2/governance}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.957Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/governance/:tenantId/phi-access, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.957Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/governance/:tenantId/phi-access, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.957Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/governance/:tenantId/retention-policies, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.957Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/governance/:tenantId/retention-policies, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.957Z","severity":"info","module":"RoutesResolver","message":"TelemedicineV2Controller {/api/api/v2/telemedicine}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.957Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/telemedicine/:tenantId/sessions, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.958Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/telemedicine/:tenantId/sessions/:sessionId/start, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.958Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/telemedicine/:tenantId/sessions/:sessionId/end, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.958Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/telemedicine/:tenantId/sessions/:sessionId/join, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.958Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/telemedicine/:tenantId/sessions/:sessionId/leave, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.958Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/telemedicine/:tenantId/sessions/:sessionId, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.958Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/telemedicine/:tenantId/sessions, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.958Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/telemedicine/turn-credentials, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.958Z","severity":"info","module":"RoutesResolver","message":"RpmController {/api/api/v2/rpm}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.958Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/rpm/:tenantId/devices, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.958Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/rpm/:tenantId/devices, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.958Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/rpm/:tenantId/devices/:deviceId, DELETE} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.958Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/rpm/:tenantId/readings, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.958Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/rpm/:tenantId/alerts, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.958Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/rpm/:tenantId/alerts/:alertId/acknowledge, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.958Z","severity":"info","module":"RoutesResolver","message":"AiScribeController {/api/api/v2/ai-scribe}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.958Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/ai-scribe/:tenantId/sessions, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.958Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/ai-scribe/:tenantId/sessions/:sessionId/segments, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.959Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/ai-scribe/:tenantId/sessions/:sessionId/process, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.959Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/ai-scribe/:tenantId/sessions/:sessionId/approve, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.959Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/ai-scribe/:tenantId/sessions/:sessionId, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.959Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/ai-scribe/:tenantId/sessions, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.959Z","severity":"info","module":"RoutesResolver","message":"EpharmacyController {/api/api/v2/epharmacy}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.959Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/epharmacy/:tenantId/prescriptions, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.959Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/epharmacy/verify/:qrCode, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.959Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/epharmacy/:tenantId/prescriptions/dispense, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.959Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/epharmacy/:tenantId/prescriptions/:id/refill, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.959Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/epharmacy/:tenantId/prescriptions, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.959Z","severity":"info","module":"RoutesResolver","message":"VirtualHospitalController {/api/api/v2/virtual-hospital}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.959Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/virtual-hospital/:tenantId/admissions, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.959Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/virtual-hospital/:tenantId/admissions/:admissionId/discharge, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.959Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/virtual-hospital/:tenantId/admissions/:admissionId/escalate, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.959Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/virtual-hospital/:tenantId/tasks, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.959Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/virtual-hospital/:tenantId/tasks/:taskId/complete, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.959Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/virtual-hospital/:tenantId/admissions, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.959Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/virtual-hospital/:tenantId/tasks/missed, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.960Z","severity":"info","module":"RoutesResolver","message":"CommunicationHubController {/api/api/v2/communication-hub}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.960Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/communication-hub/:tenantId/messages, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.960Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/communication-hub/:tenantId/messages, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.960Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/communication-hub/:tenantId/messages/:messageId/read, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.960Z","severity":"info","module":"RoutesResolver","message":"RegionalizationController {/api/api/v2/regionalization}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.960Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/regionalization/:tenantId/policies, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.960Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/regionalization/:tenantId/policies, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.960Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/regionalization/:tenantId/policies/:policyId/deactivate, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.960Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/regionalization/:tenantId/consent, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.960Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/api/v2/regionalization/:tenantId/consent/:patientId, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.960Z","severity":"info","module":"RoutesResolver","message":"PredictiveIntelligenceController {/api/predictive-intelligence}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.960Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/predictive-intelligence/patients/:patientId/calculate, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.960Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/predictive-intelligence/patients/:patientId, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.960Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/predictive-intelligence/alerts/:alertId/resolve, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.960Z","severity":"info","module":"RoutesResolver","message":"WorkflowAiController {/api/workflow-ai}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.960Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/workflow-ai/trigger, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.960Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/workflow-ai/tasks, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.960Z","severity":"info","module":"RoutesResolver","message":"AiImagingController {/api/ai-imaging}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.960Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/ai-imaging/upload, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.960Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/ai-imaging/patients/:patientId, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.960Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/ai-imaging/:imageId/process, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.960Z","severity":"info","module":"RoutesResolver","message":"FinancialIntelligenceController {/api/financial-intelligence}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/financial-intelligence/forecast/:month, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/financial-intelligence/fraud/sweep, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/financial-intelligence/dashboard, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RoutesResolver","message":"PopulationHealthController {/api/population-health}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/population-health/hotspots/scan/:region, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/population-health/cohort/analyze/:cohort, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/population-health/dashboard, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RoutesResolver","message":"KnowledgeCopilotController {/api/knowledge-copilot}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/knowledge-copilot/ask, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/knowledge-copilot/documents, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/knowledge-copilot/dashboard, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RoutesResolver","message":"MlopsController {/api/mlops}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/mlops/drift/evaluate/:modelName, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/mlops/dashboard, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RoutesResolver","message":"HrmsController {/api/hrms}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/hrms/dashboard, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/hrms/employees, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/hrms/employees, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/hrms/attendance, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/hrms/departments, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/hrms/departments, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RoutesResolver","message":"WorkforceController {/api/workforce}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/workforce/dashboard, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/workforce/shifts, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/workforce/shifts/assign, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/workforce/leaves, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/workforce/leaves/:id/approve, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/workforce/forecast, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RoutesResolver","message":"PayrollController {/api/payroll}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/payroll/dashboard, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/payroll/cycles/:month/initiate, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/payroll/cycles/:month/process, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.961Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/payroll/reimbursements, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RoutesResolver","message":"ProcurementController {/api/procurement}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/procurement/dashboard, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/procurement/vendors, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/procurement/purchase-orders, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/procurement/purchase-orders/:poId/receive, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RoutesResolver","message":"PharmacyIntelligenceController {/api/pharmacy-intelligence}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/pharmacy-intelligence/dashboard, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/pharmacy-intelligence/medications, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/pharmacy-intelligence/batches, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/pharmacy-intelligence/dispense, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/pharmacy-intelligence/anomalies, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RoutesResolver","message":"BiomedicalController {/api/biomedical}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/biomedical/dashboard, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/biomedical/assets, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/biomedical/maintenance, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/biomedical/downtime, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RoutesResolver","message":"FacilityOpsController {/api/facility-ops}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/facility-ops/dashboard, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/facility-ops/facilities, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/facility-ops/tickets, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/facility-ops/tickets/:id/resolve, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/facility-ops/energy, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/facility-ops/incidents, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RoutesResolver","message":"ErpIntelligenceController {/api/erp-intelligence}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/erp-intelligence/dashboard, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/erp-intelligence/summary, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RoutesResolver","message":"AnalyticsWarehouseController {/api/analytics-warehouse}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/analytics-warehouse/rebuild, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/analytics-warehouse/snapshot, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/analytics-warehouse/ingest/appointment/:id, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/analytics-warehouse/ingest/revenue/:id, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RoutesResolver","message":"KpiStreamingController {/api/analytics/live}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/analytics/live/kpis, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RoutesResolver","message":"BiAnalyticsController {/api/bi-analytics}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/bi-analytics/reports, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/bi-analytics/reports, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.962Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/bi-analytics/reports/:id/execute, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/bi-analytics/reports/:id/schedule, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/bi-analytics/dashboards, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/bi-analytics/dashboards, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/bi-analytics/dashboards/:id, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RoutesResolver","message":"ExecutiveAiController {/api/executive-ai}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/executive-ai/insights, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RoutesResolver","message":"AnalyticsGovernanceController {/api}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/observability/analytics/reconciliation, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/observability/analytics/performance, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/analytics/governance/exports, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/analytics/governance/exports/audit, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/analytics/governance/exports/:id/approve, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RoutesResolver","message":"SecurityResilienceController {/api/security}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/zero-trust/policy, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/zero-trust/policy, PUT} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/zero-trust/device, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/zero-trust/devices, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/zero-trust/ip-policies, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/zero-trust/ip-policies, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/zero-trust/geo-rules, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/zero-trust/geo-rules, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/zero-trust/risk/evaluate, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/zero-trust/risk/scores, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/siem/events, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/siem/events, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/siem/alerts, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/siem/alerts/:id, PUT} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.963Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/siem/incidents, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.964Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/siem/incidents, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.964Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/siem/incidents/:id, PUT} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.964Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/siem/incidents/:id/timeline, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.964Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/siem/incidents/:id/timeline, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.964Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/siem/correlate, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.964Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/siem/correlations, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.964Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/threat-intel/feeds, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.964Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/threat-intel/feeds/sync, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.964Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/threat-intel/compromised-credentials, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.964Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/threat-intel/compromised-credentials, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.964Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/threat-intel/malicious-ips, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.964Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/threat-intel/malware-signatures, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.965Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/threat-intel/inspect/ip, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.965Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/threat-intel/inspect/hash, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.965Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/threat-intel/matches, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.965Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/dr/snapshots, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.965Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/dr/snapshots, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.965Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/dr/plans, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.965Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/dr/plans, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.965Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/dr/failover-regions, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.965Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/dr/executions, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.965Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/dr/executions/:planId/drill, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.965Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/dr/integrity-checks, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.965Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/incident-response/playbooks, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.965Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/incident-response/playbooks/:playbookId/trigger, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.965Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/incident-response/tasks/:incidentId, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.965Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/incident-response/tasks/:taskId, PUT} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.967Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/incident-response/escalations/:incidentId, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.967Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/incident-response/escalations/:incidentId, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.967Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/incident-response/artifacts/:incidentId, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.967Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/incident-response/artifacts/:incidentId, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.967Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/vault/secrets, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.967Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/vault/secrets, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.967Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/vault/secrets/:secretId/reveal, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.967Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/vault/secrets/:secretId, DELETE} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.967Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/vault/keys, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.967Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/vault/access-logs, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.967Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/devices/endpoints, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.967Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/devices/endpoints/:deviceId/compliance, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.967Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/devices/endpoints/:deviceId/compliances, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.967Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/devices/incidents, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.968Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/devices/incidents/:deviceId, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.968Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/devices/biomedical, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.968Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/devices/biomedical/:assetId/firmware, PUT} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.968Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/governance/frameworks, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.968Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/governance/frameworks/:frameworkId/controls, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.968Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/governance/controls/:controlId, PUT} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.968Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/governance/assessments, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.968Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/governance/vulnerability-scans, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.968Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/security/governance/penetration-tests, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.968Z","severity":"info","module":"RoutesResolver","message":"InfrastructureControlPlaneController {/api/infrastructure-control-plane}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.968Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/infrastructure-control-plane/regions, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.968Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/infrastructure-control-plane/regions/:id/status, PUT} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.968Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/infrastructure-control-plane/failovers, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.968Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/infrastructure-control-plane/failovers/trigger, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.968Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/infrastructure-control-plane/health/metrics, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.969Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/infrastructure-control-plane/health/incidents, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.970Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/infrastructure-control-plane/health/incidents, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.970Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/infrastructure-control-plane/policies, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.970Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/infrastructure-control-plane/policies/:id, PUT} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.970Z","severity":"info","module":"RoutesResolver","message":"CloudOrchestrationController {/api/cloud-orchestration}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.970Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/cloud-orchestration/nodes, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.970Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/cloud-orchestration/mesh/security, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.970Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/cloud-orchestration/pods, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.970Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/cloud-orchestration/autoscaling, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.970Z","severity":"info","module":"RoutesResolver","message":"GlobalEdgeController {/api/global-edge}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.970Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/global-edge/heatmap, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.970Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/global-edge/dns, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/global-edge/waf, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/global-edge/cache, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RoutesResolver","message":"DistributedSystemsController {/api/distributed-systems}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/distributed-systems/redis, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/distributed-systems/kafka, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/distributed-systems/kafka/replay, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/distributed-systems/locks, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RoutesResolver","message":"ReleaseEngineeringController {/api/release-engineering}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/release-engineering/gitops, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/release-engineering/deployments, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/release-engineering/canary, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/release-engineering/canary/weight, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/release-engineering/emergency-rollback, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RoutesResolver","message":"ObservabilityController {/api/observability}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/observability/metrics/percentiles, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/observability/traces, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/observability/golden-signals, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/observability/error-budget, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RoutesResolver","message":"AutonomousOpsController {/api/autonomous-ops}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/autonomous-ops/healing, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/autonomous-ops/ai-insights, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/autonomous-ops/capacity, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/autonomous-ops/anomalies, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/autonomous-ops/policies, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/autonomous-ops/policies/:id, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/autonomous-ops/workflows, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/autonomous-ops/workflows/trigger, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/autonomous-ops/decisions, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/autonomous-ops/decisions, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/autonomous-ops/decisions/:id/decide, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/autonomous-ops/directives, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/autonomous-ops/escalations, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/autonomous-ops/escalations, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/autonomous-ops/escalations/:id/resolve, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RoutesResolver","message":"PatientAppController {/api/patient-app}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patient-app/profile, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patient-app/profile, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patient-app/preferences, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.971Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patient-app/preferences, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.972Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patient-app/devices, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.972Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patient-app/devices/register, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.972Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patient-app/sessions/track, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.972Z","severity":"info","module":"RoutesResolver","message":"ConsumerCommunicationController {/api/consumer-communication}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.972Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/consumer-communication/inbox, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.972Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/consumer-communication/inbox/:id/read, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.972Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/consumer-communication/send, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.972Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/consumer-communication/campaigns, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.972Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/consumer-communication/campaigns/trigger, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.972Z","severity":"info","module":"RoutesResolver","message":"SelfServiceController {/api/self-service}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.972Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/self-service/book, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.972Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/self-service/queue/token, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.972Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/self-service/queue/status, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.972Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/self-service/checkin, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.972Z","severity":"info","module":"RoutesResolver","message":"WellnessController {/api/wellness}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.972Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/wellness/goals, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.972Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/wellness/goals/progress, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.972Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/wellness/care-plans, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.975Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/wellness/metrics, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.976Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/wellness/metrics, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.976Z","severity":"info","module":"RoutesResolver","message":"PatientCommerceController {/api/patient-commerce}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.976Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patient-commerce/invoices, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.976Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patient-commerce/wallet, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.976Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/patient-commerce/wallet/pay, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.977Z","severity":"info","module":"RoutesResolver","message":"ConsumerAiController {/api/consumer-ai}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.977Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/consumer-ai/chat, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.977Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/consumer-ai/triage, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.977Z","severity":"info","module":"RoutesResolver","message":"ExperienceController {/api/experience}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.977Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/experience/nps, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.977Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/experience/nps, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.977Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/experience/incidents, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.977Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/experience/incidents, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.977Z","severity":"info","module":"RoutesResolver","message":"InsuranceClearinghouseController {/api/insurance-clearinghouse}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.978Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/insurance-clearinghouse/claims/submit, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.978Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/insurance-clearinghouse/claims, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.978Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/insurance-clearinghouse/claims/:id/process, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.978Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/insurance-clearinghouse/eligibility/verify, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/insurance-clearinghouse/eligibility/checks, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/insurance-clearinghouse/prior-authorizations/request, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/insurance-clearinghouse/prior-authorizations, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/insurance-clearinghouse/prior-authorizations/:id/decide, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RoutesResolver","message":"InteroperabilityHubController {/api/interoperability-hub}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/interoperability-hub/hl7/log, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/interoperability-hub/hl7/logs, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/interoperability-hub/dicom/route, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/interoperability-hub/dicom/logs, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/interoperability-hub/facilities/connect, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/interoperability-hub/facilities, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/interoperability-hub/resources/sync, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/interoperability-hub/resources/syncs, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RoutesResolver","message":"NationalRegistryController {/api/national-registry}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/national-registry/verify, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/national-registry/verifications, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/national-registry/sync, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/national-registry/syncs, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RoutesResolver","message":"MarketplaceController {/api/marketplace}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/marketplace/apps, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/marketplace/apps/installed, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/marketplace/apps/install, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/marketplace/billing/invoices, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/marketplace/billing/invoices, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/marketplace/billing/invoices/:id/pay, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/marketplace/reviews, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RoutesResolver","message":"ReferralExchangeController {/api/referral-exchange}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/referral-exchange/referrals, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/referral-exchange/referrals, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/referral-exchange/referrals/:id/status, PUT} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.983Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/referral-exchange/specialists, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.984Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/referral-exchange/specialists, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.984Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/referral-exchange/shared-care, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.984Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/referral-exchange/shared-care, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.984Z","severity":"info","module":"RoutesResolver","message":"CrossBorderGovernanceController {/api/cross-border-governance}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.984Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/cross-border-governance/consent, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.984Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/cross-border-governance/consents, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.984Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/cross-border-governance/audits/residency, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.984Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/cross-border-governance/audits/residency, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.984Z","severity":"info","module":"RoutesResolver","message":"DigitalTwinController {/api/digital-twin}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.984Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/digital-twin/scenarios, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.984Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/digital-twin/scenarios, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.984Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/digital-twin/scenarios/:id/run, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.984Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/digital-twin/runs, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.984Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/digital-twin/forecasts/generate, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.984Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/digital-twin/forecasts, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.984Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/digital-twin/capacity-simulations, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.984Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/digital-twin/events, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.984Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/digital-twin/recommendations, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.984Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/digital-twin/recommendations/:id/apply, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.984Z","severity":"info","module":"RoutesResolver","message":"ClinicalNavigationController {/api/clinical-navigation}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.985Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/clinical-navigation/journeys, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/clinical-navigation/journeys, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/clinical-navigation/journeys/:id/stage, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/clinical-navigation/milestones/:id/complete, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/clinical-navigation/signals, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/clinical-navigation/signals/:id/address, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/clinical-navigation/recommendations, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/clinical-navigation/recommendations/:id/dismiss, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RoutesResolver","message":"KnowledgeMeshController {/api/knowledge-mesh}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/knowledge-mesh/ontologies, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/knowledge-mesh/ontologies/:id/toggle, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/knowledge-mesh/inference, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/knowledge-mesh/inference/graphs, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/knowledge-mesh/inference/recommendations, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/knowledge-mesh/graph, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/knowledge-mesh/nodes, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/knowledge-mesh/relations, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RoutesResolver","message":"GlobalCommandCenterController {/api/global-command-center}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/global-command-center/telemetry/snapshot, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/global-command-center/telemetry/history, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/global-command-center/infrastructure/status, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/global-command-center/infrastructure/failover/:nodeId, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/global-command-center/executive/overview, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/global-command-center/incidents/:id/resolve, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/global-command-center/regional/throughput, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/global-command-center/integrated/insights, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/global-command-center/timeline, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/global-command-center/timeline/event, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/global-command-center/quantum/optimize, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.986Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/global-command-center/quantum/recommendations, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.987Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/global-command-center/quantum/recommendations/:id/apply, PATCH} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.987Z","severity":"info","module":"RoutesResolver","message":"ChatController {/api/chat}:","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.987Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/chat, POST} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:32.987Z","severity":"info","module":"RouterExplorer","message":"Mapped {/api/chat, GET} route","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | {"timestamp":"2026-06-02T06:16:33.078Z","severity":"info","module":"RedisPubSubService","message":"Initializing Redis Pub/Sub connections...","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:33.081Z","severity":"warn","module":"RedisPubSubService","message":"Redis is not reachable at localhost:6379. Falling back gracefully to LOCAL Pub/Sub mode.","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | AggregateError [ECONNREFUSED]:
0|opd-backend  |     at internalConnectMultiple (node:net:1122:18)
0|opd-backend  |     at afterConnectMultiple (node:net:1689:7) {
0|opd-backend  |   code: 'ECONNREFUSED',
0|opd-backend  |   [errors]: [
0|opd-backend  |     Error: connect ECONNREFUSED ::1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '::1',
0|opd-backend  |       port: 6379
0|opd-backend  |     },
0|opd-backend  |     Error: connect ECONNREFUSED 127.0.0.1:6379
0|opd-backend  |         at createConnectionError (node:net:1652:14)
0|opd-backend  |         at afterConnectMultiple (node:net:1682:16) {
0|opd-backend  |       errno: -111,
0|opd-backend  |       code: 'ECONNREFUSED',
0|opd-backend  |       syscall: 'connect',
0|opd-backend  |       address: '127.0.0.1',
0|opd-backend  |       port: 6379
0|opd-backend  |     }
0|opd-backend  |   ]
0|opd-backend  | }
0|opd-backend  | {"timestamp":"2026-06-02T06:16:33.088Z","severity":"warn","module":"RedisRoomRepository","message":"Redis is not reachable at localhost:6379. Falling back gracefully to fully functional IN-MEMORY Redis room client.","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:33.101Z","severity":"info","module":"NestApplication","message":"Nest application successfully started","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:33.103Z","severity":"info","module":"Application","message":"MedFlow API running on port: 5005 [development]","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
0|opd-backend  | {"timestamp":"2026-06-02T06:16:33.103Z","severity":"info","module":"Application","message":"CORS allowed for: http://localhost:3000","requestId":"system-bootstrap","userId":"anonymous","branchId":"system-global"}
