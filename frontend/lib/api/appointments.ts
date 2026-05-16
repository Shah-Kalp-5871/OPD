import api from '@/lib/api';
import { AdminBaseApi } from './admin-base';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  purpose: string;
  status: string;
  cancelReason?: string;
  remarks?: string;
  caseId?: string;
  patient: {
    firstName: string;
    lastName: string;
    mobile: string;
  };
  doctor: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
  patientCase?: {
    caseNumber: string;
  };
}

export interface AppointmentStats {
  total: number;
  scheduled: number;
  confirmed: number;
  checkedIn: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

class AppointmentApi extends AdminBaseApi<Appointment> {
  constructor() {
    super('/appointments');
  }

  async getStats(date?: string): Promise<AppointmentStats> {
    const res = await api.get(`${this.basePath}/admin/stats`, { params: { date } });
    return (res as any).data;
  }

  async reschedule(id: string, data: { newDate: string; newTime: string; remarks: string }) {
    return api.patch(`${this.basePath}/${id}/reschedule`, data);
  }

  async cancel(id: string, data: { reason: string }) {
    return api.patch(`${this.basePath}/${id}/cancel`, data);
  }

  async getSlots(doctorId: string, date: string) {
    const res = await api.get(`${this.basePath}/slots`, { params: { doctorId, date } });
    return (res as any).data;
  }
}

export const appointmentApi = new AppointmentApi();
