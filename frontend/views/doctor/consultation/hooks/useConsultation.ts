import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export const useConsultation = (caseId: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const [dirty, setDirty] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/consultation/${caseId}`);
      setData(res.data);
    } catch (error) {
      console.error('Failed to fetch consultation', error);
      toast.error('Failed to load clinical workspace');
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    if (caseId) fetchData();
  }, [fetchData]);

  // Simple debounce implementation
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const performSave = useCallback(async (updatedData: any) => {
    setSaving(true);
    try {
      await api.post(`/consultation/${caseId}/save`, updatedData);
      setLastSaved(new Date());
      setDirty(false);
    } catch (error) {
      console.error('Autosave failed', error);
      // Don't show toast for every autosave failure to avoid spam
    } finally {
      setSaving(false);
    }
  }, [caseId]);

  const updateComplaint = (field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      complaint: { ...prev.complaint, [field]: value }
    }));
    setDirty(true);
  };

  const updateHistory = (field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      history: { ...prev.history, [field]: value }
    }));
    setDirty(true);
  };

  useEffect(() => {
    if (dirty && data) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      
      saveTimeoutRef.current = setTimeout(() => {
        const payload = {
          complaint: data.complaint,
          history: data.history
        };
        performSave(payload);
      }, 2000);
    }
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [data, dirty, performSave]);

  return {
    data,
    loading,
    saving,
    lastSaved,
    updateComplaint,
    updateHistory,
    refresh: fetchData
  };
};
