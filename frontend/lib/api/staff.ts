import { AdminBaseApi } from './admin-base';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  receptionProfile?: {
    salary: number;
    overtimeRate?: number;
  };
  nurseProfile?: {
    salary: number;
    overtimeRate?: number;
  };
  medicalProfile?: {
    salary: number;
    overtimeRate?: number;
  };
}

class StaffApi extends AdminBaseApi<StaffMember> {
  constructor() {
    super('/staff');
  }
}

export const staffApi = new StaffApi();
