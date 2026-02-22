import apiClient from './client';
import type { EntryData } from '@/types';

export const entriesApi = {
  getEntries() {
    return apiClient.get<EntryData[]>('/entries');
  },

  getRecent() {
    return apiClient.get<EntryData[]>('/entries/recent');
  },

  getMyDrafts() {
    return apiClient.get<EntryData[]>('/entries/my-drafts');
  },

  getEntry(id: string) {
    return apiClient.get<EntryData>(`/entries/${id}`);
  },

  createEntry(entry: Partial<EntryData>) {
    return apiClient.post<EntryData>('/entries', entry);
  },

  updateEntry(id: string, entry: Partial<EntryData>) {
    return apiClient.put<EntryData>(`/entries/${id}`, entry);
  },

  deleteEntry(id: string) {
    return apiClient.delete(`/entries/${id}`);
  },

  getGooglePlaceDetails(id: string) {
    return apiClient.get(`/entries/${id}/google-place`);
  },

  countInRadius(lat: number, lng: number, radius: number) {
    return apiClient.post('/entries/count-in-radius', {
      lat,
      lng,
      radius,
    });
  },
};
