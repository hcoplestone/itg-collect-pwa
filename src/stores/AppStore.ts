import { makeAutoObservable } from 'mobx';
import type { RootStore } from './RootStore';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

export class AppStore {
  rootStore: RootStore;
  theme: 'light' | 'dark' = 'light';
  isOnline = true;
  notifications: string[] = [];
  toasts: Toast[] = [];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  showToast(message: string, type: Toast['type'] = 'info', duration = 3000) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    this.toasts.push({ id, message, type, duration });
  }

  dismissToast(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
  }

  setTheme(theme: 'light' | 'dark') {
    this.theme = theme;
  }

  setOnlineStatus(status: boolean) {
    this.isOnline = status;
  }

  addNotification(message: string) {
    this.notifications.push(message);
  }

  removeNotification(index: number) {
    this.notifications.splice(index, 1);
  }

  clearNotifications() {
    this.notifications = [];
  }

  reset() {
    this.theme = 'light';
    this.isOnline = true;
    this.notifications = [];
    this.toasts = [];
  }

  get notificationCount() {
    return this.notifications.length;
  }

  get hasNotifications() {
    return this.notifications.length > 0;
  }
}
