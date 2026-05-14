import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface QueueSSEOptions {
  doctorId?: string;
}

export const useQueueSSE = (options: QueueSSEOptions = {}) => {
  const [entries, setEntries] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [lastEvent, setLastEvent] = useState<any>(null);

  useEffect(() => {
    const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/events/queue`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastEvent(data);
        
        // Refresh entries and stats on any relevant event
        refreshData();

        // Show toast for important events
        if (data.type === 'STATUS_CHANGED' && data.status === 'CALLING') {
          toast.info(`Calling Patient: ${data.patientName} (${data.token})`);
        }
        if (data.type === 'SESSION_STARTED') {
          toast.success(`Session Started: ${data.patientName}`);
        }
        if (data.type === 'PAYMENT_RECEIVED' && data.status === 'PAID') {
          toast.success(`Payment Completed for ${data.patientName}`);
        }
      } catch (error) {
        console.error('Error parsing SSE data', error);
      }
    };

    const refreshData = async () => {
      try {
        const url = options.doctorId ? `/queue/live?doctorId=${options.doctorId}` : '/queue/live';
        const [queueRes, statsRes] = await Promise.all([
          api.get(url),
          api.get('/queue/stats')
        ]);
        setEntries(queueRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Failed to refresh data via SSE trigger', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [options.doctorId]);

  return { entries, stats, lastEvent };
};
