import { AdminBaseApi } from './admin-base';

export interface Doctor {
  id: string; // User ID
  name: string;
  email: string;
  doctorProfile: {
    id: string;
    specialization: string;
    licenseNumber: string;
    morningStart?: string;
    morningEnd?: string;
    eveningStart?: string;
    eveningEnd?: string;
    slotDuration?: number;
  };
}

class DoctorsApi extends AdminBaseApi<Doctor> {
  constructor() {
    super('/doctors');
  }
}

export const doctorsApi = new DoctorsApi();
