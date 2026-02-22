import { makeAutoObservable, runInAction } from 'mobx';
import type { RootStore } from './RootStore';

export class FeedbackStore {
  rootStore: RootStore;
  description: string = '';
  media: string[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setDescription(description: string) {
    this.description = description;
  }

  addMedia(mediaUrl: string) {
    this.media.push(mediaUrl);
  }

  removeMedia(index: number) {
    this.media = this.media.filter((_, i) => i !== index);
  }

  setMedia(media: string[]) {
    this.media = media;
  }

  reset() {
    runInAction(() => {
      this.description = '';
      this.media = [];
      this.isLoading = false;
      this.error = null;
    });
  }

  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.description.trim().length) {
      errors.push('Please enter some feedback');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  get mediaCountText() {
    const count = this.media.length;
    return count === 1 ? '1 screenshot added' : `${count} screenshots added`;
  }
}
