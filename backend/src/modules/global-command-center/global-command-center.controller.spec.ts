import { Test, TestingModule } from '@nestjs/testing';
import { GlobalCommandCenterController } from './global-command-center.controller';
import { GlobalTelemetryService } from './services/global-telemetry.service';
import { SystemOrchestrationService } from './services/system-orchestration.service';
import { ExecutiveCommandService } from './services/executive-command.service';
import { RegionalOperationsService } from './services/regional-operations.service';
import { CrossModuleCoordinatorService } from './services/cross-module-coordinator.service';
import { QuantumOptimizationService } from './services/quantum-optimization.service';

describe('GlobalCommandCenterController', () => {
  let controller: GlobalCommandCenterController;
  let telemetryService: GlobalTelemetryService;
  let orchestrationService: SystemOrchestrationService;
  let executiveService: ExecutiveCommandService;
  let regionalService: RegionalOperationsService;
  let coordinatorService: CrossModuleCoordinatorService;
  let quantumService: QuantumOptimizationService;

  const mockTelemetryService = {
    getTelemetrySnapshot: jest.fn().mockResolvedValue({
      id: 'telemetry-id-1',
      platformHealth: 'HEALTHY',
      activeIncidents: 0,
      throughputRate: 5.82,
      revenueSummary: 15420.5,
      securityAlerts: 0,
      interopTraffic: 24,
      cpuUsage: 45.2,
      memoryUsage: 72.1,
    }),
    getTelemetryHistory: jest.fn().mockResolvedValue([]),
  };

  const mockOrchestrationService = {
    getInfrastructureStatus: jest.fn().mockResolvedValue({
      nodes: [],
      activeDirectives: [],
      failoverStatus: {
        activeReplica: 'EU-WEST-SECONDARY',
        failoverTriggered: false,
        lastHealthCheck: new Date(),
      },
    }),
    triggerEmergencyFailover: jest.fn().mockResolvedValue({
      success: true,
      message: 'Emergency failover initiated. Router rules shifted.',
    }),
  };

  const mockExecutiveService = {
    getExecutiveOverview: jest.fn().mockResolvedValue({
      incidents: [],
      pendingDecisions: [],
      npsAverage: 8.8,
      platformRiskLevel: 'LOW',
    }),
    resolveIncident: jest.fn().mockResolvedValue({
      success: true,
      message: 'Incident marked as resolved.',
    }),
  };

  const mockRegionalService = {
    getRegionalThroughput: jest.fn().mockResolvedValue({
      branchMetrics: [],
      residencyAudits: [],
    }),
  };

  const mockCoordinatorService = {
    getIntegratedInsights: jest.fn().mockResolvedValue({
      interoperabilityTraffic: { hl7MessagesProcessed: 142, fhirResourcesSynced: 389, dicomTransfersActive: 8 },
      patientEngagement: { npsTrend: 'UPWARD', activeSurveysCount: 2, wearableMetricsAggregated: 1024 },
      artificialIntelligence: { swarmOptimizationCount: 4, activeOperationalDirectives: 3 },
    }),
    createIntegratedTimelineEvent: jest.fn().mockResolvedValue({
      id: 'event-1',
      eventType: 'AI_ESCALATION',
      severity: 'INFO',
      message: 'Test event',
      regionName: 'GLOBAL',
      createdAt: new Date(),
    }),
    getTimelineEvents: jest.fn().mockResolvedValue([]),
  };

  const mockQuantumService = {
    runOptimizationEngine: jest.fn().mockResolvedValue([]),
    getActiveRecommendations: jest.fn().mockResolvedValue([]),
    applyRecommendation: jest.fn().mockResolvedValue({
      success: true,
      message: 'Optimization parameter successfully applied.',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GlobalCommandCenterController],
      providers: [
        { provide: GlobalTelemetryService, useValue: mockTelemetryService },
        { provide: SystemOrchestrationService, useValue: mockOrchestrationService },
        { provide: ExecutiveCommandService, useValue: mockExecutiveService },
        { provide: RegionalOperationsService, useValue: mockRegionalService },
        { provide: CrossModuleCoordinatorService, useValue: mockCoordinatorService },
        { provide: QuantumOptimizationService, useValue: mockQuantumService },
      ],
    }).compile();

    controller = module.get<GlobalCommandCenterController>(GlobalCommandCenterController);
    telemetryService = module.get<GlobalTelemetryService>(GlobalTelemetryService);
    orchestrationService = module.get<SystemOrchestrationService>(SystemOrchestrationService);
    executiveService = module.get<ExecutiveCommandService>(ExecutiveCommandService);
    regionalService = module.get<RegionalOperationsService>(RegionalOperationsService);
    coordinatorService = module.get<CrossModuleCoordinatorService>(CrossModuleCoordinatorService);
    quantumService = module.get<QuantumOptimizationService>(QuantumOptimizationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('telemetry', () => {
    it('should return telemetry snapshot', async () => {
      const result = await controller.getTelemetrySnapshot('branch-1');
      expect(telemetryService.getTelemetrySnapshot).toHaveBeenCalledWith('branch-1');
      expect(result).toBeDefined();
      expect(result.platformHealth).toBe('HEALTHY');
    });

    it('should return telemetry history', async () => {
      const result = await controller.getTelemetryHistory();
      expect(telemetryService.getTelemetryHistory).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('infrastructure', () => {
    it('should return status', async () => {
      const result = await controller.getInfrastructureStatus();
      expect(orchestrationService.getInfrastructureStatus).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should trigger emergency failover', async () => {
      const result = await controller.triggerFailover('node-1');
      expect(orchestrationService.triggerEmergencyFailover).toHaveBeenCalledWith('node-1');
      expect(result.success).toBe(true);
    });
  });

  describe('executive override', () => {
    it('should return executive overview', async () => {
      const result = await controller.getExecutiveOverview();
      expect(executiveService.getExecutiveOverview).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should resolve live incident', async () => {
      const result = await controller.resolveIncident('incident-1', { resolution: 'Fixed node' });
      expect(executiveService.resolveIncident).toHaveBeenCalledWith('incident-1', 'Fixed node');
      expect(result.success).toBe(true);
    });
  });

  describe('quantum optimization', () => {
    it('should run optimization engine', async () => {
      const result = await controller.triggerQuantumOptimization('true');
      expect(quantumService.runOptimizationEngine).toHaveBeenCalledWith(true);
      expect(result).toBeDefined();
    });

    it('should get active recommendations', async () => {
      const result = await controller.getQuantumRecommendations();
      expect(quantumService.getActiveRecommendations).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should apply recommendation parameters', async () => {
      const result = await controller.applyQuantumRecommendation('rec-1');
      expect(quantumService.applyRecommendation).toHaveBeenCalledWith('rec-1');
      expect(result.success).toBe(true);
    });
  });
});
