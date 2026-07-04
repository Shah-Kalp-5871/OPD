import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

export const useBillingSummary = (caseId?: string) => {
  const [bill, setBill] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchBill = useCallback(async () => {
    if (!caseId) return;
    try {
      setLoading(true);
      const res = await api.get(`/billing/${caseId}`);
      setBill(res.data);
    } catch (error) {
      console.error('Failed to fetch billing data', error);
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    fetchBill();
    // Poll every 15 seconds to keep billing live during the session
    const interval = setInterval(fetchBill, 15000);
    return () => clearInterval(interval);
  }, [fetchBill]);

  return { bill, loading, refreshBill: fetchBill };
};
