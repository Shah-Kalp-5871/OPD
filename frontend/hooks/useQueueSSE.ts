import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface QueueSSEOptions {
  doctorId?: string;
}

import { getApiUrl } from '@/lib/path-utils';

export const useQueueSSE = (options: QueueSSEOptions = {}) => {
  const [entries, setEntries] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [lastEvent, setLastEvent] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Queue SSE disabled: missing auth token');
      return;
    }

    const eventSource = new EventSource(getApiUrl(`/events/queue?token=${encodeURIComponent(token)}`));

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastEvent(data);
        
        // Refresh entries and stats on any relevant event
        refreshData();

        // Show toast for important events
        if (data.type === 'STATUS_CHANGED' && data.status === 'CALLING') {
          toast.info(`Calling Patient: ${data.patientName} (${data.token})`, {
            icon: '🔔',
            duration: 8000,
          });
          
          try {
            const audio = new Audio('/sounds/bell.mp3');
            audio.play().catch(e => console.warn('Audio play blocked by browser:', e));
          } catch (e) {
            console.warn('Audio creation failed', e);
          }
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
        console.log(`Fetching queue from: ${url}`);
        
        const [queueRes, statsRes] = await Promise.all([
          api.get(url),
          api.get('/queue/stats')
        ]);
        
        console.log('Queue API Response:', queueRes);
        
        // Handle both wrapped and unwrapped responses
        const queueData = queueRes.data || (Array.isArray(queueRes) ? queueRes : []);
        const statsData = statsRes.data || statsRes;

        setEntries(queueData);
        setStats(statsData);
        
        console.log('Resolved Queue Entries:', queueData.length);
      } catch (error: any) {
        console.error('Failed to refresh data:', error);
        if (error.response) {
          console.error('Response Error Data:', error.response.data);
        }
      }
    };

    // Initial fetch
    refreshData();

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
