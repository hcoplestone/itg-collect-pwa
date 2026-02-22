import { authApi } from '@/api/auth';
import { makeAutoObservable, runInAction } from 'mobx';
import type { RootStore } from './RootStore';
import type { User } from '@/types';

export class UserStore {
  rootStore: RootStore;
  user: User | null = null;
  apiToken: string | null = null;
  isAuthenticated = false;
  isLoading = false;
  error: string | null = null;
  favourites: string[] = [];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const userStr = localStorage.getItem('user');
      const apiToken = localStorage.getItem('apiToken');
      const favouritesStr = localStorage.getItem('favourites');

      this.user = userStr ? JSON.parse(userStr) : null;
      this.apiToken = apiToken || null;
      this.favourites = favouritesStr ? JSON.parse(favouritesStr) : [];
      this.isAuthenticated = !!this.apiToken && !!this.user;

      console.log('UserStore: Loaded from storage - user:', !!this.user, 'token:', !!this.apiToken, 'favourites:', this.favourites.length);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  async login(email: string, password: string) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await authApi.login(email, password);
      const { token, user } = response.data;

      localStorage.setItem('apiToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      runInAction(() => {
        this.apiToken = token;
        this.user = user;
        this.isAuthenticated = true;
        this.isLoading = false;
      });

      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error logging in';

      runInAction(() => {
        this.error = message;
        this.isLoading = false;
      });

      return false;
    }
  }

  async register(name: string, email: string, password: string, passwordConfirmation: string) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await authApi.register(name, email, password, passwordConfirmation);
      const { token, user } = response.data;

      localStorage.setItem('apiToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      runInAction(() => {
        this.apiToken = token;
        this.user = user;
        this.isAuthenticated = true;
        this.isLoading = false;
      });

      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error registering';

      runInAction(() => {
        this.error = message;
        this.isLoading = false;
      });

      return false;
    }
  }

  logout() {
    localStorage.removeItem('apiToken');
    localStorage.removeItem('user');

    this.user = null;
    this.apiToken = null;
    this.isAuthenticated = false;
    this.error = null;
  }

  updateProfile(updates: Partial<User>) {
    if (this.user) {
      const updatedUser = { ...this.user, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      this.user = updatedUser;
    }
  }

  toggleFavourite(guid: string) {
    const index = this.favourites.indexOf(guid);
    const newFavourites = index > -1
      ? this.favourites.filter(id => id !== guid)
      : [...this.favourites, guid];

    localStorage.setItem('favourites', JSON.stringify(newFavourites));
    this.favourites = newFavourites;
  }

  reset() {
    this.user = null;
    this.apiToken = null;
    this.isAuthenticated = false;
    this.isLoading = false;
    this.error = null;
    this.favourites = [];
  }

  get displayName() {
    return this.user?.name || 'Guest';
  }

  isFavourite(guid: string) {
    return this.favourites.includes(guid);
  }

  isMyEntry(entry: { user_id?: string; userId?: string }) {
    if (!this.user) return false;
    return entry.user_id === this.user.id || entry.userId === this.user.id;
  }

  get userId() {
    return this.user?.id || null;
  }
}
