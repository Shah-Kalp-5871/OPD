import api from '../api';

export const billingApi = {
  createBill: (data: any) => api.post('/billing', data),
  getBillByCaseId: (caseId: string) => api.get(`/billing/${caseId}`),
  getPendingBills: () => api.get('/billing/list/pending'),
  payBill: (id: string, data: any, idempotencyKey?: string) => 
    api.post(`/billing/${id}/pay`, data, {
      headers: idempotencyKey ? { 'idempotency-key': idempotencyKey } : {}
    }),
  finalizeBill: (id: string) => api.post(`/billing/${id}/finalize`),
  refundBill: (id: string, data: { amount: number; reason: string }) => 
    api.post(`/billing/${id}/refund`, data),
  getBillById: (id: string) => api.get(`/billing/details/${id}`),
};
