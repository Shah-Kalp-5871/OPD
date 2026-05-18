const DB_NAME = 'medflow-offline-db';
const DB_VERSION = 1;

export interface OfflineDraft {
  id: string; // Unique draft UID (local UUID)
  type: 'PATIENT_REGISTRATION' | 'APPOINTMENT_CREATE' | 'CONSULTATION_SUBMIT';
  data: any; // Raw JSON payload
  createdAt: number;
  synced: boolean;
  syncAttempts: number;
  lastError?: string;
}

export class OfflineDb {
  private static openDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('IndexedDB is only available in the browser'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains('drafts')) {
          const store = db.createObjectStore('drafts', { keyPath: 'id' });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('synced', 'synced', { unique: false });
        }
      };
    });
  }

  // Save or update draft
  public static async saveDraft(draft: OfflineDraft): Promise<void> {
    const db = await this.openDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('drafts', 'readwrite');
      const store = transaction.objectStore('drafts');
      const request = store.put(draft);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Retrieve draft by ID
  public static async getDraft(id: string): Promise<OfflineDraft | null> {
    const db = await this.openDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('drafts', 'readonly');
      const store = transaction.objectStore('drafts');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Retrieve all unsynced drafts
  public static async getUnsyncedDrafts(): Promise<OfflineDraft[]> {
    const db = await this.openDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('drafts', 'readonly');
      const store = transaction.objectStore('drafts');
      const index = store.index('synced');
      const request = index.getAll(0); // 0 or false depending on how it's saved. We store boolean, but indexedDB index keys are numeric/string usually. Let's filter on the cursor to be safe!
      
      const unsynced: OfflineDraft[] = [];
      const cursorRequest = store.openCursor();
      
      cursorRequest.onsuccess = (event: any) => {
        const cursor = event.target.result;
        if (cursor) {
          if (!cursor.value.synced) {
            unsynced.push(cursor.value);
          }
          cursor.continue();
        } else {
          resolve(unsynced);
        }
      };
      
      cursorRequest.onerror = () => reject(cursorRequest.error);
    });
  }

  // Delete draft upon successful synchronization
  public static async deleteDraft(id: string): Promise<void> {
    const db = await this.openDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('drafts', 'readwrite');
      const store = transaction.objectStore('drafts');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Mark draft as synced
  public static async markAsSynced(id: string): Promise<void> {
    const draft = await this.getDraft(id);
    if (draft) {
      draft.synced = true;
      await this.saveDraft(draft);
    }
  }

  // Log a sync failure attempt
  public static async recordSyncFailure(id: string, error: string): Promise<void> {
    const draft = await this.getDraft(id);
    if (draft) {
      draft.syncAttempts += 1;
      draft.lastError = error;
      await this.saveDraft(draft);
    }
  }
}
