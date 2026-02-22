import { entriesApi } from '@/api/entries';
import { makeAutoObservable, runInAction } from 'mobx';
import type { RootStore } from './RootStore';
import type { Entry } from '@/types';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class EntriesStore {
  rootStore: RootStore;
  entries: Entry[] = [];
  isLoading = false;
  error: string | null = null;
  recentlyAddedUpdateKey = 0;

  // Search and filtering state
  searchQuery = '';
  onlyShowMyEntries = false;
  categoryFilter: string | null = null;
  addedWithinDays: number | null = null;
  tagFilters: string[] = [];

  // Sorting state
  sortBy: 'name' | 'distance' | 'date' = 'distance';
  currentLocation: { lat: number; lng: number } | null = null;

  // Cache for entries with 5-minute TTL
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCachedData<T>(key: string, data: T, ttl: number = this.CACHE_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > cached.ttl) {
        this.cache.delete(key);
      }
    }
  }

  private parseMediaBase64(media_base64: string[] | string | undefined): string[] {
    if (!media_base64) {
      return [];
    }

    if (typeof media_base64 === 'string') {
      try {
        const parsed = JSON.parse(media_base64);
        return parsed;
      } catch (error) {
        console.warn('parseMediaBase64: Failed to parse media_base64 JSON:', error);
        return [];
      }
    }

    return media_base64;
  }

  async fetch(forceRefresh: boolean = false) {
    this.clearExpiredCache();

    if (!forceRefresh) {
      const cachedEntries = this.getCachedData<Entry[]>('entries');
      if (cachedEntries) {
        runInAction(() => {
          this.entries = cachedEntries;
          this.isLoading = false;
          this.error = null;
          this.recentlyAddedUpdateKey++;
        });
        return;
      }
    }

    this.isLoading = true;
    this.error = null;

    try {
      const response = await entriesApi.getEntries();

      runInAction(() => {
        this.entries = response.data.map((entry) => {
          const parsedMedia = this.parseMediaBase64(entry.media_base64);

          return {
            ...entry,
            media_base64: parsedMedia,
            createdAt: entry.created_at || entry.createdAt,
            updatedAt: entry.updated_at || entry.updatedAt,
            userId: entry.user_id || entry.userId,
            googlePlaceId: entry.google_place_id || entry.googlePlaceId,
            isDraft: entry.draft === 1 || entry.isDraft === true,
            lat: typeof entry.lat === 'string' ? parseFloat(entry.lat) : entry.lat,
            lng: typeof entry.lng === 'string' ? parseFloat(entry.lng) : entry.lng,
          };
        });
        this.isLoading = false;
        this.recentlyAddedUpdateKey++;
      });

      this.setCachedData('entries', this.entries);
    } catch (error) {
      console.error('EntriesStore: Error fetching entries:', error);
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to fetch entries';
        this.isLoading = false;
      });
    }
  }

  async fetchRecent(forceRefresh: boolean = false) {
    return this.fetch(forceRefresh);
  }

  getEntriesByCategory(category: string): Entry[] {
    if (category === 'all') {
      return this.entries;
    }
    return this.entries.filter((entry) => entry.category === category);
  }

  get recentlyAdded(): Entry[] {
    return [...this.entries]
      .filter(entry => entry.createdAt)
      .sort((a, b) => {
        const dateA = new Date(a.createdAt!).getTime();
        const dateB = new Date(b.createdAt!).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);
  }

  getRecentlyAddedByCategory(category: string): Entry[] {
    const filteredEntries = category === 'all'
      ? this.entries
      : this.entries.filter(entry => entry.category === category);

    return filteredEntries
      .filter(entry => entry.createdAt)
      .sort((a, b) => {
        const dateA = new Date(a.createdAt!).getTime();
        const dateB = new Date(b.createdAt!).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);
  }

  get myEntries(): Entry[] {
    if (!this.rootStore.userStore.user) {
      return [];
    }

    const userId = this.rootStore.userStore.user.id;
    return this.entries.filter(entry => {
      return entry.user_id === userId || entry.userId === userId;
    });
  }

  get myFavourites(): Entry[] {
    if (!this.rootStore.userStore.favourites.length) {
      return [];
    }

    return this.entries.filter(entry => {
      return this.rootStore.userStore.favourites.includes(entry.id);
    });
  }

  async forceRefresh() {
    await this.fetch(true);
  }

  removeEntry(entryId: string) {
    runInAction(() => {
      this.entries = this.entries.filter(entry => entry.id !== entryId);
    });
  }

  clearCache() {
    this.cache.clear();
  }

  setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  setCurrentLocation(location: { lat: number; lng: number } | null) {
    this.currentLocation = location;
  }

  setSortBy(sortBy: 'name' | 'distance' | 'date') {
    this.sortBy = sortBy;
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private getEntryCompletenessScore(entry: Entry): number {
    let score = 0;
    if (entry.name) score += 1;
    if (entry.category) score += 1;
    if (entry.lat && entry.lng) score += 1;
    if (entry.description) score += 1;
    if (entry.address) score += 1;
    if (entry.googlePlaceId || entry.google_place_id) score += 2;
    if (entry.media_base64 && Array.isArray(entry.media_base64) && entry.media_base64.length > 0) score += 1;
    if (entry.createdAt) score += 1;
    return score;
  }

  private shouldReplaceEntry(existing: Entry, newEntry: Entry): boolean {
    const existingGooglePlaceId = existing.googlePlaceId || existing.google_place_id;
    const newGooglePlaceId = newEntry.googlePlaceId || newEntry.google_place_id;

    if (newGooglePlaceId && !existingGooglePlaceId) {
      return true;
    }

    if (existingGooglePlaceId && newGooglePlaceId) {
      return false;
    }

    const existingCompleteness = this.getEntryCompletenessScore(existing);
    const newCompleteness = this.getEntryCompletenessScore(newEntry);

    if (newCompleteness > existingCompleteness + 2) {
      return true;
    }

    if (Math.abs(newCompleteness - existingCompleteness) <= 2) {
      const existingDate = new Date(existing.createdAt || 0).getTime();
      const newDate = new Date(newEntry.createdAt || 0).getTime();
      return newDate > existingDate;
    }

    return false;
  }

  toggleOnlyShowMyEntries() {
    this.onlyShowMyEntries = !this.onlyShowMyEntries;
  }

  setCategoryFilter(category: string | null) {
    this.categoryFilter = category;
  }

  setAddedWithinDays(days: number | null) {
    this.addedWithinDays = days;
  }

  toggleTagFilter(tag: string) {
    const index = this.tagFilters.indexOf(tag);
    if (index > -1) {
      this.tagFilters.splice(index, 1);
    } else {
      this.tagFilters.push(tag);
    }
  }

  get filteredEntries(): Entry[] {
    let filtered = [...this.entries];

    if (this.searchQuery) {
      filtered = filtered.filter(entry =>
        entry.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (entry.description && entry.description.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    }

    if (this.onlyShowMyEntries) {
      const userId = this.rootStore.userStore.user?.id;
      if (userId) {
        filtered = filtered.filter(entry =>
          entry.user_id === userId || entry.userId === userId
        );
      }
    }

    if (this.categoryFilter) {
      filtered = filtered.filter(entry => entry.category === this.categoryFilter);
    }

    if (this.addedWithinDays) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.addedWithinDays);

      filtered = filtered.filter(entry => {
        if (!entry.createdAt) return false;
        const entryDate = new Date(entry.createdAt);
        return entryDate >= cutoffDate;
      });
    }

    filtered = filtered.filter(entry => entry.lat && entry.lng);

    // Deduplication
    const seenEntries = new Map<string, Entry>();
    const deduplicatedEntries: Entry[] = [];

    for (const entry of filtered) {
      const latRounded = Math.round(entry.lat * 1000000) / 1000000;
      const lngRounded = Math.round(entry.lng * 1000000) / 1000000;
      const locationKey = `${latRounded},${lngRounded}`;

      const googlePlaceId = entry.googlePlaceId || entry.google_place_id;
      const dedupeKey = googlePlaceId ? `place_${googlePlaceId}` : `location_${locationKey}`;

      if (!seenEntries.has(dedupeKey)) {
        seenEntries.set(dedupeKey, entry);
        deduplicatedEntries.push(entry);
      } else {
        const existingEntry = seenEntries.get(dedupeKey)!;
        if (this.shouldReplaceEntry(existingEntry, entry)) {
          const index = deduplicatedEntries.findIndex(e => e.id === existingEntry.id);
          if (index !== -1) {
            deduplicatedEntries[index] = entry;
            seenEntries.set(dedupeKey, entry);
          }
        }
      }
    }

    filtered = deduplicatedEntries;

    // Add distance information if current location is available
    if (this.currentLocation) {
      filtered = filtered.map(entry => ({
        ...entry,
        distance: this.calculateDistance(
          this.currentLocation!.lat,
          this.currentLocation!.lng,
          entry.lat,
          entry.lng
        )
      }));
    }

    // Sort entries
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'distance':
          if (!this.currentLocation) return 0;
          return (a.distance || 0) - (b.distance || 0);

        case 'date': {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        }

        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }

  get allCategories(): string[] {
    const categories = new Set<string>();
    this.entries.forEach(entry => {
      if (entry.category) {
        categories.add(entry.category);
      }
    });
    return Array.from(categories).sort();
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.onlyShowMyEntries) count++;
    if (this.categoryFilter) count++;
    if (this.addedWithinDays) count++;
    if (this.tagFilters.length > 0) count++;
    return count;
  }

  clearFilters() {
    this.searchQuery = '';
    this.onlyShowMyEntries = false;
    this.categoryFilter = null;
    this.addedWithinDays = null;
    this.tagFilters = [];
    this.sortBy = 'distance';
  }

  reset() {
    this.entries = [];
    this.isLoading = false;
    this.error = null;
    this.recentlyAddedUpdateKey = 0;
    this.clearFilters();
    this.clearCache();
  }
}
