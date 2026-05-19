'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ClinicalEvent {
  type: 'VITALS_SAVED' | 'CASE_UPDATED' | 'STAGE_TRANSITION';
  patientId: string;
  caseId: string;
  patientName: string;
  vitals?: any;
}

import { getApiUrl } from '@/lib/path-utils';

export const useClinicalSSE = () => {
  const [lastEvent, setLastEvent] = useState<ClinicalEvent | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Clinical SSE disabled: missing auth token');
      return;
    }

    const eventSource = new EventSource(getApiUrl(`/events/clinical?token=${encodeURIComponent(token)}`));

    eventSource.onmessage = (event) => {
      try {
        const data: ClinicalEvent = JSON.parse(event.data);
        setLastEvent(data);

        if (data.type === 'VITALS_SAVED') {
          toast.success(`Vitals captured for ${data.patientName}`, {
            description: 'Patient is now ready for consultation.',
            duration: 5000,
          });
        }
      } catch (error) {
        console.error('Error parsing clinical SSE event:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('Clinical SSE Error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return { lastEvent };
};
