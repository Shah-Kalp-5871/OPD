import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export const usePatientSidePanel = (patientId?: string) => {
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPatient = useCallback(async () => {
    if (!patientId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/patients/${patientId}`);
      setPatient(res.data);
    } catch (err: any) {
      console.error('Error fetching patient data for side panel:', err);
      setError(err);
      toast.error('Failed to load live patient data');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  return {
    patient,
    loading,
    error,
    refresh: fetchPatient
  };
};
