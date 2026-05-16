import api from '@/lib/api';

export const analyticsApi = {
  getDashboardStats: () => api.get('/analytics/dashboard/stats'),
  getFinancialAnalytics: (startDate?: string, endDate?: string) => 
    api.get('/analytics/financial', { params: { startDate, endDate } }),
  getClinicalAnalytics: () => api.get('/analytics/clinical'),
  getInventoryAnalytics: () => api.get('/analytics/inventory'),
  getAuditAnalytics: () => api.get('/analytics/audit'),
  exportFinancialReport: (startDate: string, endDate: string) => 
    api.get('/analytics/export/financial', { params: { startDate, endDate } }),
};
