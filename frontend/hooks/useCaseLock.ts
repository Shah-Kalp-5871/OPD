import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useQueueSSE } from './useQueueSSE';

import { useAuthStore } from '@/store/authStore';

export const useCaseLock = (caseId: string, role: string) => {
  const router = useRouter();
  const [hasLock, setHasLock] = useState(false);
  const { lastEvent } = useQueueSSE();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!caseId || !user?.id) return;

    let mounted = true;

    const acquireLock = async () => {
      try {
        const res = await api.post(`/consultation/${caseId}/lock`);
        if (mounted) {
          if (res.data.success) {
            setHasLock(true);
          } else {
            toast.error('Another user is currently editing this chart.', { duration: 5000 });
            router.push('/dashboard');
          }
        }
      } catch (err) {
        console.error('Failed to acquire lock:', err);
      }
    };

    acquireLock();

    return () => {
      mounted = false;
      api.post(`/consultation/${caseId}/unlock`).catch(console.error);
    };
  }, [caseId, router, user?.id]);

  useEffect(() => {
    if (lastEvent?.type === 'CASE_LOCKED' && lastEvent.caseId === caseId) {
      if (lastEvent.lockedByUserId !== user?.id) {
         toast.error(`A ${lastEvent.lockedByRole} has opened this chart. You have been redirected.`, {
            duration: 8000,
            icon: '🔒'
         });
         
         if (role === 'NURSING') {
           router.push('/nursing/dashboard');
         } else if (role === 'RECEPTION') {
           router.push('/reception/dashboard');
         } else {
           router.push('/dashboard');
         }
      }
    }
  }, [lastEvent, caseId, router, role, user?.id]);

  return { hasLock };
};
