import api from '@/lib/api';

export interface AdminPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  includeInactive?: boolean;
  [key: string]: any;
}

export class AdminBaseApi<T> {
  protected basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  async findAll(params: AdminQueryParams): Promise<AdminPaginatedResponse<T>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const res = await api.get(`${this.basePath}?${searchParams.toString()}`);
    // Support both standardized format and legacy format where API might return { data: [], meta: {} }
    if ((res as any).data && (res as any).meta) {
      return {
        items: (res as any).data,
        total: (res as any).meta.total,
        page: (res as any).meta.currentPage,
        limit: (res as any).meta.itemsPerPage,
        totalPages: (res as any).meta.lastPage,
      };
    }
    // New standardized format handles { items, total, ... } inside data
    const data = (res as any).data || res;
    return {
      items: data.items || [],
      total: data.total || 0,
      page: data.page || params.page || 1,
      limit: data.limit || params.limit || 20,
      totalPages: data.totalPages || Math.ceil((data.total || 0) / (data.limit || 20)),
    };
  }

  async findById(id: string): Promise<T> {
    const res = await api.get(`${this.basePath}/${id}`);
    return (res as any).data || res;
  }

  async create(payload: Partial<T>): Promise<T> {
    const res = await api.post(this.basePath, payload);
    return (res as any).data || res;
  }

  async update(id: string, payload: Partial<T>): Promise<T> {
    const res = await api.patch(`${this.basePath}/${id}`, payload);
    return (res as any).data || res;
  }

  async toggleActive(id: string, currentStatus: boolean): Promise<T> {
    const payload = { isActive: !currentStatus } as any;
    const res = await api.patch(`${this.basePath}/${id}`, payload);
    return (res as any).data || res;
  }

  async archive(id: string): Promise<void> {
    await api.delete(`${this.basePath}/${id}`);
  }
}
