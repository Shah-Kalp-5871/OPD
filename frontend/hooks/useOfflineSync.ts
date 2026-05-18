import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { OfflineDb, OfflineDraft } from '@/lib/offlineDb';
import api from '@/lib/api';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingDraftsCount, setPendingDraftsCount] = useState<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(window.navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Internet connection restored. Synchronizing clinical drafts...');
      syncDrafts();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('Network connection dropped. Running in secure offline draft mode.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check for pending drafts
    updateDraftsCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateDraftsCount = async () => {
    try {
      const drafts = await OfflineDb.getUnsyncedDrafts();
      setPendingDraftsCount(drafts.length);
    } catch (err) {
      console.error('Failed to count drafts:', err);
    }
  };

  const createOfflineDraft = async (
    type: OfflineDraft['type'],
    data: any
  ): Promise<string> => {
    const localId = `draft-${Math.random().toString(36).substring(2, 15)}`;
    const draft: OfflineDraft = {
      id: localId,
      type,
      data,
      createdAt: Date.now(),
      synced: false,
      syncAttempts: 0,
    };
    await OfflineDb.saveDraft(draft);
    await updateDraftsCount();
    toast.info('Draft successfully saved locally to browser persistence.');
    return localId;
  };

  // Main background synchronization replay loops
  const syncDrafts = async () => {
    try {
      const drafts = await OfflineDb.getUnsyncedDrafts();
      if (drafts.length === 0) return;

      console.log(`[OfflineSync] Found ${drafts.length} unsynced drafts.`);
      
      let successCount = 0;
      let failureCount = 0;

      for (const draft of drafts) {
        try {
          if (draft.type === 'PATIENT_REGISTRATION') {
            await api.post('/patients', draft.data);
          } else if (draft.type === 'APPOINTMENT_CREATE') {
            await api.post('/appointments', draft.data);
          } else if (draft.type === 'CONSULTATION_SUBMIT') {
            await api.post('/consultations', draft.data);
          }

          // Mark as successfully synced
          await OfflineDb.markAsSynced(draft.id);
          // Delete to clean up IndexedDB
          await OfflineDb.deleteDraft(draft.id);
          successCount++;
        } catch (error: any) {
          console.error(`Failed to sync draft ID ${draft.id}:`, error);
          const errorMsg = error.response?.data?.message || error.message || 'Unknown network error';
          await OfflineDb.recordSyncFailure(draft.id, errorMsg);
          failureCount++;
        }
      }

      await updateDraftsCount();

      if (successCount > 0) {
        toast.success(`Successfully synchronized ${successCount} clinical draft(s) with the backend server.`);
      }
      if (failureCount > 0) {
        toast.error(`Failed to sync ${failureCount} draft(s). Will retry upon next connection cycle.`);
      }
    } catch (err) {
      console.error('Error during drafts sync cycle:', err);
    }
  };

  return {
    isOnline,
    pendingDraftsCount,
    createOfflineDraft,
    syncDrafts,
    updateDraftsCount,
  };
};
