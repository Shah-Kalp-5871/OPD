import { useState, useEffect } from 'react';
import { procedureApi, Procedure } from '@/lib/api/procedures';

export function useProcedureSearch(limit = 20) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | undefined>();
  const [results, setResults] = useState<Procedure[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query && !category) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    if (query.trim().length < 2 && !category) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const handler = setTimeout(async () => {
      try {
        const response = await procedureApi.findAll({
          search: query,
          category,
          limit,
        });
        setResults(response.items);
      } catch (error) {
        console.error('Procedure search failed:', error);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [query, category, limit]);

  return {
    query,
    setQuery,
    category,
    setCategory,
    results,
    isLoading,
  };
}
