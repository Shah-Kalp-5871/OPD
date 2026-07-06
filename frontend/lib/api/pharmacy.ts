import api from '@/lib/api';
import { Drug } from './drugs';

export interface SimpleDrug {
  id: string;
  drugName: string;
  category?: string;
  unitPrice: number;
  stockQuantity: number;
  lowStockLimit: number;
  stockTracked: boolean;
  isActive: boolean;
}

class PharmacyAdminApi {
  // Normal Drugs
  async getNormalDrugs(): Promise<Drug[]> {
    const res = await api.get<Drug[]>('/admin/pharmacy/drugs/normal');
    return (res as any).data || res;
  }

  async createNormalDrug(data: Partial<Drug>): Promise<Drug> {
    const res = await api.post<Drug>('/admin/pharmacy/drugs/normal', data);
    return (res as any).data || res;
  }

  async updateNormalDrug(id: string, data: Partial<Drug>): Promise<Drug> {
    const res = await api.put<Drug>(`/admin/pharmacy/drugs/normal/${id}`, data);
    return (res as any).data || res;
  }

  async deleteNormalDrug(id: string): Promise<void> {
    await api.delete(`/admin/pharmacy/drugs/normal/${id}`);
  }

  // Simple Drugs
  async getSimpleDrugs(): Promise<SimpleDrug[]> {
    const res = await api.get<SimpleDrug[]>('/admin/pharmacy/drugs/simple');
    return (res as any).data || res;
  }

  async createSimpleDrug(data: Partial<SimpleDrug>): Promise<SimpleDrug> {
    const res = await api.post<SimpleDrug>('/admin/pharmacy/drugs/simple', data);
    return (res as any).data || res;
  }

  async updateSimpleDrug(id: string, data: Partial<SimpleDrug>): Promise<SimpleDrug> {
    const res = await api.put<SimpleDrug>(`/admin/pharmacy/drugs/simple/${id}`, data);
    return (res as any).data || res;
  }

  async deleteSimpleDrug(id: string): Promise<void> {
    await api.delete(`/admin/pharmacy/drugs/simple/${id}`);
  }
}

export const pharmacyAdminApi = new PharmacyAdminApi();
