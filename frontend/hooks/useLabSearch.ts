import { useState, useEffect, useCallback } from 'react';
import { labApi, LabParameter } from '@/lib/api/lab';

export function useLabSearch(limit = 20) {
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [results, setResults] = useState<LabParameter[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Remove arbitrary block so it loads all tests initially
    // if (!query && !categoryId) {
    //   setResults([]);
    //   setIsLoading(false);
    //   return;
    // }

    // Small query (1 char) only if no category is selected
    if (query && query.trim().length < 2 && !categoryId) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const handler = setTimeout(async () => {
      try {
        const response = await labApi.getParameters({
          search: query,
          categoryId: categoryId,
          // If a category is selected, fetch a high number so we don't truncate results
          limit: categoryId ? 500 : limit,
        });
        setResults(response.items);
      } catch (error) {
        console.error('Lab search failed:', error);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [query, categoryId, limit]);

  return {
    query,
    setQuery,
    categoryId,
    setCategoryId,
    results,
    isLoading,
  };
}
