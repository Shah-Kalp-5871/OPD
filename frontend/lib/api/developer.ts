import api from '@/lib/api';

export const developerApi = {
  listApiClients: () => api.get('/admin/api-clients'),
  getApiClient: (clientId: string) => api.get(`/admin/api-clients/${clientId}`),
  createApiClient: (body: {
    name: string;
    scopes: string[];
    environment?: 'production' | 'sandbox';
    branchId?: string;
    rateLimitPerMinute?: number;
    monthlyQuota?: number;
  }) => api.post('/admin/api-clients', body),
  updateApiClient: (clientId: string, body: Record<string, unknown>) =>
    api.patch(`/admin/api-clients/${clientId}`, body),
  rotateKey: (clientId: string) => api.post(`/admin/api-clients/${clientId}/rotate-key`),
  revokeKey: (clientId: string) => api.post(`/admin/api-clients/${clientId}/revoke-key`),
  getUsageAnalytics: () => api.get('/admin/api-usage/analytics'),
  getClientUsage: (clientId: string) => api.get(`/admin/api-usage/clients/${clientId}`),
  getWebhookCatalog: () => api.get('/admin/webhooks/catalog'),
  getPublicDocs: () => api.get('/api/v2/docs/onboarding'),
  getOpenApi: () => api.get('/api/v2/docs/openapi'),
};
