import api from '../api';

export const securityApi = {
  // 1. Zero-Trust Security
  getZeroTrustPolicy: () => api.get('/security/zero-trust/policy'),
  updateZeroTrustPolicy: (data: any) => api.put('/security/zero-trust/policy', data),
  getZeroTrustDevices: () => api.get('/security/zero-trust/devices'),
  registerZeroTrustDevice: (data: any) => api.post('/security/zero-trust/device', data),
  getIpPolicies: () => api.get('/security/zero-trust/ip-policies'),
  addIpPolicy: (data: any) => api.post('/security/zero-trust/ip-policies', data),
  getGeoRules: () => api.get('/security/zero-trust/geo-rules'),
  addGeoRule: (data: any) => api.post('/security/zero-trust/geo-rules', data),
  getRiskScores: () => api.get('/security/zero-trust/risk/scores'),

  // 2. SIEM & Audit Correlation (SOC)
  getSiemEvents: (limit?: number) => api.get(`/security/siem/events?limit=${limit || 100}`),
  getSiemAlerts: () => api.get('/security/siem/alerts'),
  updateAlertStatus: (id: string, status: string, assignedTo?: string) => 
    api.put(`/security/siem/alerts/${id}`, { status, assignedTo }),
  getIncidents: () => api.get('/security/siem/incidents'),
  createIncident: (data: any) => api.post('/security/siem/incidents', data),
  updateIncident: (id: string, data: any) => api.put(`/security/siem/incidents/${id}`, data),
  getIncidentTimeline: (id: string) => api.get(`/security/siem/incidents/${id}/timeline`),
  runAuditCorrelations: () => api.post('/security/siem/correlate'),

  // 3. Threat Intelligence
  getThreatFeeds: () => api.get('/security/threat-intel/feeds'),
  syncThreatFeeds: () => api.post('/security/threat-intel/feeds/sync'),
  getCompromisedCredentials: () => api.get('/security/threat-intel/compromised-credentials'),
  addCompromisedCredential: (email: string, source?: string) => 
    api.post('/security/threat-intel/compromised-credentials', { email, source }),
  getMaliciousIps: () => api.get('/security/threat-intel/malicious-ips'),
  getMalwareSignatures: () => api.get('/security/threat-intel/malware-signatures'),
  inspectIp: (ipAddress: string) => api.post('/security/threat-intel/inspect/ip', { ipAddress }),
  inspectFileHash: (fileHash: string) => api.post('/security/threat-intel/inspect/hash', { fileHash }),

  // 4. Backup & Disaster Recovery
  getDrSnapshots: () => api.get('/security/dr/snapshots'),
  createDrSnapshot: (data: any) => api.post('/security/dr/snapshots', data),
  getDrPlans: () => api.get('/security/dr/plans'),
  getFailoverRegions: () => api.get('/security/dr/failover-regions'),
  getDrDrillExecutions: () => api.get('/security/dr/executions'),
  triggerDrill: (planId: string, userId: string) => 
    api.post(`/security/dr/executions/${planId}/drill`, { userId }),
  getIntegrityChecks: () => api.get('/security/dr/integrity-checks'),

  // 5. Incident Response Automation
  getPlaybooks: () => api.get('/security/incident-response/playbooks'),
  triggerPlaybook: (playbookId: string, incidentId: string) => 
    api.post(`/security/incident-response/playbooks/${playbookId}/trigger`, { incidentId }),
  getPlaybookTasks: (incidentId: string) => api.get(`/security/incident-response/tasks/${incidentId}`),
  updatePlaybookTask: (taskId: string, status: string, assignee?: string) => 
    api.put(`/security/incident-response/tasks/${taskId}`, { status, assignee }),
  getEscalations: (incidentId: string) => api.get(`/security/incident-response/escalations/${incidentId}`),
  triggerEscalation: (incidentId: string, data: any) => 
    api.post(`/security/incident-response/escalations/${incidentId}`, data),
  getForensicArtifacts: (incidentId: string) => api.get(`/security/incident-response/artifacts/${incidentId}`),
  uploadForensicArtifact: (incidentId: string, data: any) => 
    api.post(`/security/incident-response/artifacts/${incidentId}`, data),

  // 6. Key Vault & Secrets Management
  getSecrets: () => api.get('/security/vault/secrets'),
  storeSecret: (data: { secretName: string; secretValue: string; secretType: string; rotationDays?: number }) => 
    api.post('/security/vault/secrets', data),
  revealSecret: (secretId: string, userId: string) => 
    api.post(`/security/vault/secrets/${secretId}/reveal`, { userId }),
  deleteSecret: (secretId: string, userId: string) => 
    api.delete(`/security/vault/secrets/${secretId}`, { data: { userId } }),
  getKeys: () => api.get('/security/vault/keys'),
  getSecretAccessLogs: () => api.get('/security/vault/access-logs'),

  // 7. Device & Endpoint Security
  getEndpoints: () => api.get('/security/devices/endpoints'),
  reportDeviceCompliance: (deviceId: string, data: any) => 
    api.post(`/security/devices/endpoints/${deviceId}/compliance`, data),
  getBiomedicalDevices: () => api.get('/security/devices/biomedical'),
  updateBiomedicalFirmware: (assetId: string, data: any) => 
    api.put(`/security/devices/biomedical/${assetId}/firmware`, data),

  // 8. Security Governance & Compliance
  getFrameworks: () => api.get('/security/governance/frameworks'),
  getControls: (frameworkId: string) => api.get(`/security/governance/frameworks/${frameworkId}/controls`),
  updateControlStatus: (controlId: string, data: { status: string; evidenceUrl?: string }) => 
    api.put(`/security/governance/controls/${controlId}`, data),
  getVulnerabilityScans: () => api.get('/security/governance/vulnerability-scans'),
  getPenetrationTests: () => api.get('/security/governance/penetration-tests'),
};
