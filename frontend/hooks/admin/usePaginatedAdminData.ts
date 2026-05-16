import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

export interface UsePaginatedAdminDataProps<T, F> {
  fetchFn: (params: any) => Promise<{ items: T[], total: number, totalPages: number }>;
  initialLimit?: number;
  initialSort?: string;
  defaultFilters?: F;
  fetchOnMount?: boolean;
}

export function usePaginatedAdminData<T, F extends Record<string, any>>({
  fetchFn,
  initialLimit = 20,
  defaultFilters = {} as F,
  fetchOnMount = true
}: UsePaginatedAdminDataProps<T, F>) {
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<F>(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(initialLimit);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchFn({
        search: search || undefined,
        page,
        limit,
        includeInactive: true,
        ...filters,
      });
      setData(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [fetchFn, search, page, limit, filters]);

  useEffect(() => {
    if (fetchOnMount) {
      fetchData();
    }
  }, [fetchData, fetchOnMount]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleFilterChange = (key: keyof F, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return {
    data,
    total,
    page,
    totalPages,
    limit,
    search,
    filters,
    loading,
    setPage,
    setLimit,
    setSearch: handleSearchChange,
    setFilter: handleFilterChange,
    refresh: fetchData,
  };
}
