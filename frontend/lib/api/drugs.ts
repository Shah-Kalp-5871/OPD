import api from '@/lib/api';
import { AdminBaseApi } from './admin-base';

export interface Drug {
  id: string;
  drugName: string;
  genericName?: string;
  manufacturer?: string;
  drugCategory: string;
  formulation: string;
  strength?: string;
  unitOfMeasure: string;
  unitPrice: number;
  taxable: boolean;
  stockTracked: boolean;
  schedule?: string;
  isActive: boolean;
  archivedAt?: Date;
  inventory?: {
    totalStock: number;
    minStockLevel: number;
    location?: string;
  } | null;
}

class DrugApi extends AdminBaseApi<Drug> {
  constructor() {
    super('/admin/drugs');
  }

  async getMasterCategories(): Promise<string[]> {
    const res = await api.get<string[]>('/admin/drugs/masters/categories');
    return (res as any).data || res;
  }

  async getMasterFormulations(): Promise<string[]> {
    const res = await api.get<string[]>('/admin/drugs/masters/formulations');
    return (res as any).data || res;
  }
}

export const drugApi = new DrugApi();
