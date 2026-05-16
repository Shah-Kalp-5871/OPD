import { AdminBaseApi } from './admin-base';
import api from '@/lib/api';

export interface Patient {
  id: string;
  mrdNumber: string;
  firstName: string;
  lastName: string;
  mobile: string;
  gender: string;
  isActive: boolean;
  createdAt: string;
  profileCompletionStatus: number;
  profile?: {
    age?: number;
    dob?: string;
    bloodGroup?: string;
    address?: string;
    city?: string;
    state?: string;
  };
  cases?: any[];
}

export class PatientApi extends AdminBaseApi<Patient> {
  constructor() {
    super('/patients');
  }

  async getHistory(id: string) {
    const res = await api.get(`${this.basePath}/${id}/history`);
    return (res as any).data || res;
  }

  async getBilling(id: string) {
    const res = await api.get(`${this.basePath}/${id}/billing`);
    return (res as any).data || res;
  }

  async getAppointments(id: string) {
    const res = await api.get(`${this.basePath}/${id}/appointments`);
    return (res as any).data || res;
  }
}

export const patientApi = new PatientApi();
