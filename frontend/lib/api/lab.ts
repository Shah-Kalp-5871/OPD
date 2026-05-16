import api from '@/lib/api';
import { AdminBaseApi } from './admin-base';

export interface LabCategory {
  id: string;
  name: string;
  code?: string;
  description?: string;
  isActive: boolean;
  displayOrder: number;
}

export interface LabReferenceRange {
  id: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  minAge?: number;
  maxAge?: number;
  minValue?: number;
  maxValue?: number;
  interpretation?: string;
  condition?: string;
}

export interface LabParameter {
  id: string;
  categoryId: string;
  category?: LabCategory;
  name: string;
  code?: string;
  unit?: string;
  isActive: boolean;
  basePrice: number;
  criticalLow?: number;
  criticalHigh?: number;
  displayOrder: number;
  referenceRanges?: LabReferenceRange[];
}

class LabApi extends AdminBaseApi<LabParameter> {
  constructor() {
    super('/admin/lab/parameters');
  }

  // Backwards compatibility for exact naming
  getParameters = this.findAll.bind(this);
  getParameterById = this.findById.bind(this);
  createParameter = this.create.bind(this);
  updateParameter = this.update.bind(this);
  deleteParameter = this.archive.bind(this);

  // Categories
  async getCategories(includeInactive = false): Promise<{ data: LabCategory[] }> {
    const res = await api.get<LabCategory[]>(`/admin/lab/categories?includeInactive=${includeInactive}`);
    return { data: (res as any).data || res };
  }
  
  async createCategory(data: Partial<LabCategory>) {
    const res = await api.post<LabCategory>('/admin/lab/categories', data);
    return res;
  }
  
  async updateCategory(id: string, data: Partial<LabCategory>) {
    const res = await api.patch<LabCategory>(`/admin/lab/categories/${id}`, data);
    return res;
  }
  
  async deleteCategory(id: string) {
    const res = await api.delete(`/admin/lab/categories/${id}`);
    return res;
  }

  // Masters
  async getUnits() {
    const res = await api.get<string[]>('/admin/lab/masters/units');
    return res;
  }
}

export const labApi = new LabApi();
