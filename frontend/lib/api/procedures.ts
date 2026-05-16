import api from '@/lib/api';
import { AdminBaseApi } from './admin-base';

export interface ProcedureConsumable {
  id: string;
  procedureId: string;
  itemName: string;
  defaultQuantity: number;
  isOptional: boolean;
  unit?: string;
}

export interface Procedure {
  id: string;
  name: string;
  code?: string;
  description?: string;
  basePrice: number;
  estimatedDuration: number;
  isActive: boolean;
  archivedAt?: string;
  category?: string;
  displayOrder: number;
  requiresConsent: boolean;
  requiresNursing: boolean;
  requiresRoom: boolean;
  preInstructions?: string;
  postInstructions?: string;
  consumableTemplates?: ProcedureConsumable[];
}

class ProcedureApi extends AdminBaseApi<Procedure> {
  constructor() {
    super('/admin/procedures');
  }

  async getCategories(): Promise<string[]> {
    const res = await api.get<string[]>('/admin/procedures/masters/categories');
    return (res as any).data || res;
  }
}

export const procedureApi = new ProcedureApi();
