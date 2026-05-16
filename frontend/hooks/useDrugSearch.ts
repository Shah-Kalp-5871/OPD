import { useState, useEffect } from 'react';
import { drugApi, Drug } from '@/lib/api/drugs';

export function useDrugSearch(query: string, limit = 10) {
  const [results, setResults] = useState<Drug[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If query is too short, don't search to save resources
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const handler = setTimeout(async () => {
      try {
        const response = await drugApi.findAll({
          search: query,
          limit,
          isActive: true, // Only active drugs for prescription
        });
        setResults(response.items);
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
