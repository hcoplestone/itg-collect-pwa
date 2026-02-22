import { GOOGLE_PLACES_CONFIG } from '@/config/googlePlaces';
import type { GooglePlace } from '@/types';

interface PlacesResponse {
  results: GooglePlace[];
  status: string;
  next_page_token?: string;
}

class GooglePlacesService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api/place';

  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || '';

    if (!this.apiKey) {
      console.warn('Google Places API key not found.');
    }
  }

  async getNearbyPlaces(
    lat: number,
    lng: number,
    searchQuery: string = '',
    radius: number = GOOGLE_PLACES_CONFIG.DEFAULT_RADIUS
  ): Promise<GooglePlace[]> {
    if (!GOOGLE_PLACES_CONFIG.USE_REAL_API || !this.apiKey) {
      console.warn('Google Places API not enabled or key not configured, returning mock data');
      return this.getMockPlaces(lat, lng, searchQuery);
    }

    try {
      let url: string;

      if (searchQuery.trim()) {
        url = `${this.baseUrl}/textsearch/json?query=${encodeURIComponent(searchQuery)}&location=${lat},${lng}&radius=${radius}&key=${this.apiKey}`;
      } else {
        url = `${this.baseUrl}/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=establishment&key=${this.apiKey}`;
      }

      const response = await fetch(url);
      const data: PlacesResponse = await response.json();

      if (data.status === 'OK') {
        return data.results;
      } else {
        console.error('Google Places API error:', data.status);
        return this.getMockPlaces(lat, lng, searchQuery);
      }
    } catch (error) {
      console.error('Error fetching Google Places data:', error);
      return this.getMockPlaces(lat, lng, searchQuery);
    }
  }

  async getPlaceDetails(placeId: string): Promise<GooglePlace | null> {
    if (!GOOGLE_PLACES_CONFIG.USE_REAL_API || !this.apiKey) {
      console.warn('Google Places API not enabled or key not configured');
      return null;
    }

    try {
      const url = `${this.baseUrl}/details/json?place_id=${placeId}&fields=place_id,name,vicinity,geometry,rating,user_ratings_total,types,photos&key=${this.apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        return data.result;
      } else {
        console.error('Google Places Details API error:', data.status);
        return null;
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  }

  private getMockPlaces(_lat: number, _lng: number, searchQuery: string): GooglePlace[] {
    const mockPlaces: GooglePlace[] = [
      {
        place_id: '1',
        name: 'Golden Gate Bridge',
        vicinity: 'San Francisco, CA',
        geometry: { location: { lat: 37.8199, lng: -122.4783 } },
        rating: 4.5,
        user_ratings_total: 15000,
        types: ['tourist_attraction', 'point_of_interest'],
      },
      {
        place_id: '2',
        name: 'Union Square',
        vicinity: 'San Francisco, CA',
        geometry: { location: { lat: 37.7879, lng: -122.4075 } },
        rating: 4.2,
        user_ratings_total: 8500,
        types: ['park', 'point_of_interest'],
      },
      {
        place_id: '3',
        name: "Fisherman's Wharf",
        vicinity: 'San Francisco, CA',
        geometry: { location: { lat: 37.8080, lng: -122.4177 } },
        rating: 4.0,
        user_ratings_total: 12000,
        types: ['tourist_attraction', 'point_of_interest'],
      },
      {
        place_id: '4',
        name: 'Lombard Street',
        vicinity: 'San Francisco, CA',
        geometry: { location: { lat: 37.8021, lng: -122.4187 } },
        rating: 4.3,
        user_ratings_total: 6500,
        types: ['tourist_attraction', 'point_of_interest'],
      },
      {
        place_id: '5',
        name: 'Coit Tower',
        vicinity: 'San Francisco, CA',
        geometry: { location: { lat: 37.8024, lng: -122.4058 } },
        rating: 4.1,
        user_ratings_total: 4200,
        types: ['tourist_attraction', 'point_of_interest'],
      },
    ];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return mockPlaces.filter(
        (place) =>
          place.name.toLowerCase().includes(query) ||
          place.vicinity.toLowerCase().includes(query)
      );
    }

    return mockPlaces;
  }

  getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
    if (!GOOGLE_PLACES_CONFIG.USE_REAL_API || !this.apiKey) {
      return '';
    }

    return `${this.baseUrl}/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${this.apiKey}`;
  }
}

export const googlePlacesService = new GooglePlacesService();
export type { GooglePlace } from '@/types';
