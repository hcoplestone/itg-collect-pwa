import apiClient from './client';
import type { LocationSuggestion, DidYouMeanSuggestion } from '@/types';

export const locationSuggestionsApi = {
  getSuggestions(lat: number, lng: number, searchQuery: string = '') {
    return apiClient.post<LocationSuggestion[]>('/location-suggestions', {
      lat,
      lng,
      keyword: searchQuery,
    });
  },

  didYouMean(lat: number, lng: number, searchQuery: string = '') {
    return apiClient.post<DidYouMeanSuggestion[]>('/did-you-mean', {
      lat,
      lng,
      keyword: searchQuery,
    });
  },
};
