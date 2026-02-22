export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Entry {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  description?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  user_id?: string;
  googlePlaceId?: string;
  google_place_id?: string;
  isDraft?: boolean;
  is_my_entry?: boolean;
  media_base64?: string[] | string;
  distance?: number;
}

export interface EntryData {
  id: string;
  name: string;
  category: string;
  lat: number | string;
  lng: number | string;
  description?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  googlePlaceId?: string;
  isDraft?: boolean;
  media_base64?: string[] | string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  google_place_id?: string;
  draft?: number;
  tags?: string[];
  rating?: number;
  review?: string;
}

export interface Draft {
  draftId: string;
  guid?: string | null;
  lat: number;
  lng: number;
  googlePlace?: any;
  name: string;
  description: string;
  category: string;
  categories: string[];
  tags: string[];
  media: string[];
  mediaCaptions: string[];
  createdAt: string;
  rating: number;
  review: string;
  comments: string;
  price?: number | null;
  currentScreen?: string;
}

export interface LocationSuggestion {
  id: string;
  name: string;
  description?: string;
  lat: number;
  lng: number;
  address?: string;
  category?: string;
  google_place_id?: string;
  rating?: number;
  price_level?: number;
  photo_reference?: string;
}

export interface DidYouMeanSuggestion {
  suggestion: string;
  confidence: number;
}

export interface GooglePlace {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  icon_background_color?: string;
  icon_mask_base_uri?: string;
  rating?: number;
  user_ratings_total?: number;
  types?: string[];
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
}
