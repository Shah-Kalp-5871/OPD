import { useState, useEffect } from 'react';
import api from '@/lib/api';

export function useDrugSearch(query: string, limit = 10) {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const handler = setTimeout(async () => {
      try {
        const searchParams = new URLSearchParams();
        if (query && query.trim()) {
          searchParams.append('search', query.trim());
        }
        searchParams.append('limit', limit.toString());
        
        const response = await api.get(`/pharmacy/drugs/search?${searchParams.toString()}`);
        const data = (response as any).data || response;
        setResults(data.items || []);
      } catch (error) {
        console.error('Drug search failed:', error);
      } finally {
        setIsLoading(false);
      }
    }, 400); // 400ms debounce for hospital usage

    return () => clearTimeout(handler);
  }, [query, limit]);

  return { results, isLoading };
}
