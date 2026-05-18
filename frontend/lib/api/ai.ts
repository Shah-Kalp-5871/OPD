import api from '@/lib/api';

export interface CdsRequest {
  caseId: string;
  patientId: string;
  branchId: string;
  chiefComplaint?: string;
  provisionalDiagnosis?: string;
  prescribedDrugs?: string[];
}

export interface AiOutcome {
  logId: string;
  outcome: 'ACCEPTED' | 'MODIFIED' | 'REJECTED' | 'IGNORED';
  reviewNotes?: string;
}

export const aiApi = {
  // Clinical Decision Support
  getClinicalSuggestions: (data: CdsRequest) => 
    api.post('/ai/clinical/suggest', data),
  
  recordSuggestionOutcome: (data: AiOutcome) => 
    api.patch('/ai/clinical/outcome', data),
  
  getAiAuditLogs: (params: { branchId?: string; page?: number; limit?: number }) => 
    api.get('/ai/audit/logs', { params }),

  // Clinical Risk Engine
  evaluatePatientRisk: (data: { patientId: string; branchId: string; caseId?: string }) => 
    api.post('/ai/risk/evaluate', data),
  
  getPatientRiskFlags: (patientId: string) => 
    api.get(`/ai/risk/patient/${patientId}`),
  
  acknowledgeRiskFlag: (flagId: string) => 
    api.patch(`/ai/risk/flag/${flagId}/acknowledge`),
  
  getBranchRiskSummary: (branchId: string) => 
    api.get(`/ai/risk/branch/${branchId}/summary`),

  // Inventory Intelligence
  getStockForecast: (params: { branchId: string; daysAhead?: number }) => 
    api.get('/ai/inventory/forecast', { params }),
  
  getExpiryRisk: (branchId: string) => 
    api.get('/ai/inventory/expiry-risk', { params: { branchId } }),
  
  getSlowMoving: (params: { branchId: string; thresholdDays?: number }) => 
    api.get('/ai/inventory/slow-moving', { params }),
  
  getReorderRecommendations: (branchId: string) => 
    api.get('/ai/inventory/reorder', { params: { branchId } }),

  // Operational Intelligence
  runAnomalyScan: (branchId: string) => 
    api.post('/ai/ops/scan', { branchId }),
  
  getAnomalies: (params: { branchId: string; status?: string; page?: number; limit?: number }) => 
    api.get('/ai/ops/anomalies', { params }),
  
  updateAnomalyStatus: (id: string, data: { status: string; notes?: string }) => 
    api.patch(`/ai/ops/anomalies/${id}`, data),
  
  getAppointmentIntelligence: (branchId: string) => 
    api.get('/ai/ops/appointments', { params: { branchId } }),
  
  getRevenueForecast: (branchId?: string) => 
    api.get('/ai/ops/revenue-forecast', { params: { branchId } }),
};
