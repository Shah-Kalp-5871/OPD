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
    if (!caseId) return;
    try {
      setLoading(true);
      const res = await api.get(`/consultation/${caseId}`);
      const fetchedData = res.data;
      
      // Merge Reception Complaint into Doctor's Complaint if Doctor hasn't written anything
      if (fetchedData?.case?.visitComplaint && !fetchedData.complaint?.chiefComplaint) {
        fetchedData.complaint = {
          ...fetchedData.complaint,
          chiefComplaint: fetchedData.case.visitComplaint.presentComplaint || '',
          duration: fetchedData.case.visitComplaint.durationDays || fetchedData.case.visitComplaint.durationMonths || fetchedData.case.visitComplaint.durationYears || '',
          durationType: fetchedData.case.visitComplaint.durationDays ? 'DAYS' : fetchedData.case.visitComplaint.durationMonths ? 'MONTHS' : fetchedData.case.visitComplaint.durationYears ? 'YEARS' : 'DAYS',
          severity: fetchedData.case.visitComplaint.severity || 'MODERATE',
          onset: fetchedData.case.visitComplaint.onset?.toUpperCase() || 'GRADUAL',
          aggravatingFactors: fetchedData.case.visitComplaint.aggravatingFactors || '',
          relievingFactors: fetchedData.case.visitComplaint.relievingFactors || '',
        };
      }
      
      // Also merge history
      if (fetchedData?.case?.visitComplaint && !fetchedData.history?.pastHistory && !fetchedData.history?.allergies) {
         fetchedData.history = {
           ...fetchedData.history,
           pastHistory: fetchedData.case.visitComplaint.pastMedical || '',
           personalHistory: fetchedData.case.visitComplaint.personalHistory || '',
           surgicalHistory: fetchedData.case.visitComplaint.pastSurgical || '',
           obstetricHistory: fetchedData.case.visitComplaint.obstetricHistory || '',
           allergies: fetchedData.case.visitComplaint.allergies || '',
         };
      }

      setData(fetchedData);
    } catch (error) {
      console.error('Failed to fetch consultation', error);
      toast.error('Failed to load clinical workspace');
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Simple debounce implementation
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const performSave = useCallback(async (updatedData: any) => {
    if (!caseId) return;
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

  const updateConsultation = (field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      consultation: { ...prev.consultation, [field]: value }
    }));
    setDirty(true);
  };

  const saveManually = async () => {
    if (!data) return;
    const payload = {
      complaint: data.complaint ? {
        ...data.complaint,
        duration: data.complaint.duration ? parseInt(data.complaint.duration) : null
      } : undefined,
      history: data.history,
      provisionalDiagnosis: data.consultation?.provisionalDiagnosis,
      finalDiagnosis: data.consultation?.finalDiagnosis,
      treatmentPlan: data.consultation?.treatmentPlan,
      advice: data.consultation?.advice,
    };
    await performSave(payload);
    toast.success('Clinical data synchronized');
  };

  useEffect(() => {
    if (dirty && data) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      
      saveTimeoutRef.current = setTimeout(() => {
        const payload = {
          complaint: data.complaint ? {
            ...data.complaint,
            duration: data.complaint.duration ? parseInt(data.complaint.duration) : null
          } : undefined,
          history: data.history,
          provisionalDiagnosis: data.consultation?.provisionalDiagnosis,
          finalDiagnosis: data.consultation?.finalDiagnosis,
          treatmentPlan: data.consultation?.treatmentPlan,
          advice: data.consultation?.advice
        };
        performSave(payload);
      }, 3000);
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
    updateConsultation,
    saveManually,
    refresh: fetchData
  };
};
