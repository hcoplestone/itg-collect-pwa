import apiClient from './client';
import type { GooglePlace } from '@/types';

export const locationSuggestionsApi = {
  getSuggestions(lat: number, lng: number, searchQuery: string = '') {
    return apiClient.post<{ results: GooglePlace[] }>('/location-suggestions', {
      lat,
      lng,
      keyword: searchQuery,
    });
  },

  didYouMean(lat: number, lng: number, searchQuery: string = '') {
    return apiClient.post<{ results: GooglePlace[] }>('/did-you-mean', {
      lat,
      lng,
      keyword: searchQuery,
    });
  },
};
