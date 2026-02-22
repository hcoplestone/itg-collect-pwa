import { makeAutoObservable } from 'mobx';
import type { RootStore } from './RootStore';

export class AppStore {
  rootStore: RootStore;
  theme: 'light' | 'dark' = 'light';
  isOnline = true;
  notifications: string[] = [];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
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
  }

  get notificationCount() {
    return this.notifications.length;
  }

  get hasNotifications() {
    return this.notifications.length > 0;
  }
}
