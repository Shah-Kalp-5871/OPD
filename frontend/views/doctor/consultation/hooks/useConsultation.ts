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
      if (fetchedData?.case?.visitComplaint) {
        if (!fetchedData.history?.pastHistory && !fetchedData.history?.allergies) {
           fetchedData.history = {
             ...fetchedData.history,
             pastHistory: fetchedData.case.visitComplaint.pastMedical || '',
             personalHistory: fetchedData.case.visitComplaint.personalHistory || '',
             surgicalHistory: fetchedData.case.visitComplaint.pastSurgical || '',
             obstetricHistory: fetchedData.case.visitComplaint.obstetricHistory || '',
             allergies: fetchedData.case.visitComplaint.allergies || '',
           };
        }
        
        // Nursing notes and patient feedback are saved in visitComplaint in the DB, not clinicalHistory
        fetchedData.history = {
          ...fetchedData.history,
          nursingNotes: fetchedData.case.visitComplaint.nursingNotes || '',
          patientFeedback: fetchedData.case.visitComplaint.patientFeedback || '',
        };
      }

      // Merge vitals - Vitals live on patient, not case
      if (!fetchedData.vitals && fetchedData?.case?.patient?.vitals?.[0]) {
        fetchedData.vitals = { ...fetchedData.case.patient.vitals[0] };
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

  const updateVitals = (field: string, value: any) => {
    setData((prev: any) => {
      const newVitals = { ...prev.vitals, [field]: value };
      
      // Auto-calculate BMI
      if ((field === 'height' || field === 'weight') && newVitals.height && newVitals.weight) {
        const heightInMeters = Number(newVitals.height) / 100;
        const weight = Number(newVitals.weight);
        if (heightInMeters > 0 && weight > 0) {
          newVitals.bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
        }
      }

      return {
        ...prev,
        vitals: newVitals
      };
    });
    setDirty(true);
  };

  const cleanObject = (obj: any) => {
    if (!obj) return undefined;
    const cleaned: any = {};
    const blockedKeys = ['id', 'consultationId', 'createdAt', 'updatedAt', 'patientId', 'caseId', 'takenById', 'takenAt', 'branchId'];
    for (const key in obj) {
      if (!blockedKeys.includes(key) && obj[key] !== null) {
        // Ensure numeric fields are actually parsed if they are strings
        if (['height', 'weight', 'bmi', 'pulse', 'temperature', 'spo2'].includes(key) && typeof obj[key] === 'string') {
           const num = parseFloat(obj[key]);
           cleaned[key] = isNaN(num) ? undefined : num;
        } else {
           cleaned[key] = obj[key];
        }
      }
    }
    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  };

  const buildPayload = (currentData: any) => {
    return {
      complaint: currentData.complaint ? cleanObject({
        ...currentData.complaint,
        duration: currentData.complaint.duration ? parseInt(currentData.complaint.duration) : undefined
      }) : undefined,
      history: cleanObject(currentData.history),
      vitals: cleanObject(currentData.vitals),
      provisionalDiagnosis: currentData.consultation?.provisionalDiagnosis || undefined,
      finalDiagnosis: currentData.consultation?.finalDiagnosis || undefined,
      treatmentPlan: currentData.consultation?.treatmentPlan || undefined,
      advice: currentData.consultation?.advice || undefined,
    };
  };

  const saveManually = async () => {
    if (!data) return;
    const payload = buildPayload(data);
    await performSave(payload);
    toast.success('Clinical data synchronized');
  };

  useEffect(() => {
    if (dirty && data) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      
      saveTimeoutRef.current = setTimeout(() => {
        const payload = buildPayload(data);
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
    updateVitals,
    saveManually,
    refresh: fetchData
  };
};
