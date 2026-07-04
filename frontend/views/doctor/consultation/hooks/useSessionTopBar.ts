import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export const useSessionTopBar = (doctorId?: string) => {
  const [nextPatient, setNextPatient] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchQueue = useCallback(async () => {
    if (!doctorId) return;
    try {
      setLoading(true);
      const res = await api.get('/queue/live', {
        params: { doctorId }
      });
      
      const queue = res.data?.items || res.data || [];
      // Assuming 'WAITING' status means they are next in line.
      // And they should be sorted by priority or time.
      const waitingPatients = queue
        .filter((q: any) => q.status === 'WAITING' || q.status === 'VITALS_DONE')
        .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      
      if (waitingPatients.length > 0) {
        setNextPatient(waitingPatients[0]);
      } else {
        setNextPatient(null);
      }
    } catch (error) {
      console.error('Failed to fetch live queue for top bar', error);
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchQueue();
    // In a real production scenario, this would be a WebSocket or interval polling.
    // For Phase 3, we'll poll every 30 seconds to keep the queue relatively live.
    const interval = setInterval(fetchQueue, 30000);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  return { nextPatient, loading, refreshQueue: fetchQueue };
};
