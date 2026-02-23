import { makeAutoObservable, runInAction } from 'mobx';
import { entriesApi } from '@/api/entries';
import type { RootStore } from './RootStore';

interface PendingSubmission {
  id: string;
  payload: {
    lat: number;
    lng: number;
    name: string;
    description?: string;
    rating?: number;
    review?: string;
    tags?: string[];
    media_base64?: string[];
  };
  createdAt: number;
}

const STORAGE_KEY = 'itg-collect-pending-submissions';

export class SyncStore {
  rootStore: RootStore;
  pendingSubmissions: PendingSubmission[] = [];
  isSyncing = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.pendingSubmissions = JSON.parse(stored);
      }
    } catch {
      this.pendingSubmissions = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.pendingSubmissions));
    } catch (error) {
      console.warn('SyncStore: Failed to save to localStorage:', error);
    }
  }

  queueSubmission(payload: PendingSubmission['payload']) {
    const submission: PendingSubmission = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      payload,
      createdAt: Date.now(),
    };
    this.pendingSubmissions.push(submission);
    this.saveToStorage();
  }

  async processPendingSubmissions() {
    if (this.isSyncing || this.pendingSubmissions.length === 0) return;

    this.isSyncing = true;
    try {
      const succeeded: string[] = [];

      for (const submission of this.pendingSubmissions) {
        try {
          await entriesApi.createEntry(submission.payload);
          succeeded.push(submission.id);
        } catch (error) {
          console.warn('SyncStore: Failed to sync submission:', submission.id, error);
          // Stop processing on first failure — likely still offline
          break;
        }
      }

      runInAction(() => {
        if (succeeded.length > 0) {
          this.pendingSubmissions = this.pendingSubmissions.filter(
            (s) => !succeeded.includes(s.id)
          );
          this.saveToStorage();

          this.rootStore.appStore.showToast(
            `${succeeded.length} ${succeeded.length === 1 ? 'entry' : 'entries'} synced successfully`,
            'success'
          );
          this.rootStore.entriesStore.forceRefresh();
        }
      });
    } finally {
      runInAction(() => { this.isSyncing = false; });
    }
  }

  get pendingCount() {
    return this.pendingSubmissions.length;
  }

  reset() {
    this.pendingSubmissions = [];
    this.isSyncing = false;
    localStorage.removeItem(STORAGE_KEY);
  }
}
