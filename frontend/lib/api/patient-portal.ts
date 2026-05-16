import api from '@/lib/api';

export const patientPortalApi = {
  requestOtp: (mobile: string) => api.post('/patient-portal/request-otp', { mobile }),
  verifyOtp: (mobile: string, otp: string) => api.post('/patient-portal/verify-otp', { mobile, otp }),
  getProfile: () => api.get('/patient-portal/profile'),
};
