import { makeAutoObservable } from 'mobx';
import type { RootStore } from './RootStore';
import type { Draft } from '@/types';

const DRAFT_TEMPLATE: Omit<Draft, 'draftId' | 'createdAt'> = {
  guid: null,
  lat: 0,
  lng: 0,
  googlePlace: null,
  name: '',
  description: '',
  category: '',
  categories: [],
  tags: [],
  media: [],
  mediaCaptions: [],
  rating: 0,
  review: '',
  comments: '',
  price: null,
  currentScreen: '/create-entry/map-select',
};

export class DraftsStore {
  rootStore: RootStore;
  drafts: Draft[] = [];
  currentDraft: Draft | null = null;
  isLoading = false;
  error: string | null = null;

  private readonly STORAGE_KEY = '@itg_collect_drafts';

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    this.loadDrafts();
  }

  loadDrafts() {
    this.isLoading = true;
    this.error = null;

    try {
      const storedDrafts = localStorage.getItem(this.STORAGE_KEY);
      if (storedDrafts) {
        this.drafts = JSON.parse(storedDrafts);
      } else {
        this.drafts = [];
      }
      this.isLoading = false;
    } catch (error) {
      console.error('Error loading drafts:', error);
      this.error = 'Failed to load drafts';
      this.isLoading = false;
    }
  }

  private saveDrafts() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.drafts));
    } catch (error) {
      console.error('Error saving drafts:', error);
    }
  }

  resetDraft() {
    const newDraft: Draft = {
      ...DRAFT_TEMPLATE,
      draftId: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    this.currentDraft = newDraft;
    this.saveCurrentDraftLocally();
  }

  loadDraft(draftId: string) {
    const draft = this.drafts.find(d => d.draftId === draftId);
    if (draft) {
      this.currentDraft = { ...draft };
      this.ensureMediaCaptionsEqualMedia();
    }
  }

  saveCurrentDraftLocally() {
    if (!this.currentDraft) return;

    const draft = { ...this.currentDraft };
    const index = this.drafts.findIndex(d => d.draftId === draft.draftId);

    if (index > -1) {
      this.drafts[index] = draft;
    } else {
      this.drafts.push(draft);
    }

    this.saveDrafts();
  }

  deleteDraft(draftId: string) {
    const index = this.drafts.findIndex(d => d.draftId === draftId);
    if (index > -1) {
      this.drafts.splice(index, 1);
      this.saveDrafts();

      if (this.currentDraft?.draftId === draftId) {
        this.currentDraft = null;
      }
    }
  }

  removeCurrentDraft() {
    if (this.currentDraft) {
      this.deleteDraft(this.currentDraft.draftId);
      this.currentDraft = null;
    }
  }

  private ensureMediaCaptionsEqualMedia() {
    if (!this.currentDraft) return;

    let hasChanged = false;

    if (!this.currentDraft.mediaCaptions) {
      this.currentDraft.mediaCaptions = [];
      hasChanged = true;
    }

    if (this.currentDraft.mediaCaptions.length === 0 && this.currentDraft.media.length > 0) {
      this.currentDraft.mediaCaptions = new Array(this.currentDraft.media.length).fill('');
      hasChanged = true;
    }

    if (this.currentDraft.mediaCaptions.length < this.currentDraft.media.length) {
      const diff = this.currentDraft.media.length - this.currentDraft.mediaCaptions.length;
      this.currentDraft.mediaCaptions = this.currentDraft.mediaCaptions.concat(new Array(diff).fill(''));
      hasChanged = true;
    }

    if (this.currentDraft.mediaCaptions.length > this.currentDraft.media.length) {
      this.currentDraft.mediaCaptions = this.currentDraft.mediaCaptions.slice(0, this.currentDraft.media.length);
      hasChanged = true;
    }

    if (hasChanged) {
      this.saveCurrentDraftLocally();
    }
  }

  // Getters
  get draftId(): string | null {
    return this.currentDraft?.draftId || null;
  }

  get lat(): number {
    return this.currentDraft?.lat || 0;
  }

  get lng(): number {
    return this.currentDraft?.lng || 0;
  }

  get name(): string {
    return this.currentDraft?.name || '';
  }

  get description(): string {
    return this.currentDraft?.description || '';
  }

  get category(): string {
    return this.currentDraft?.category || '';
  }

  get categories(): string[] {
    return this.currentDraft?.categories || [];
  }

  get tags(): string[] {
    return this.currentDraft?.tags || [];
  }

  get media(): string[] {
    return this.currentDraft?.media || [];
  }

  get mediaCaptions(): string[] {
    return this.currentDraft?.mediaCaptions || [];
  }

  get rating(): number {
    return this.currentDraft?.rating || 0;
  }

  get review(): string {
    return this.currentDraft?.review || '';
  }

  get comments(): string {
    return this.currentDraft?.comments || '';
  }

  get price(): number | null {
    return this.currentDraft?.price || null;
  }

  get createdAt(): string | null {
    return this.currentDraft?.createdAt || null;
  }

  get currentScreen(): string {
    return this.currentDraft?.currentScreen || '/create-entry/map-select';
  }

  // Setters
  setLat(lat: number) {
    if (this.currentDraft) {
      this.currentDraft.lat = lat;
      this.saveCurrentDraftLocally();
    }
  }

  setLng(lng: number) {
    if (this.currentDraft) {
      this.currentDraft.lng = lng;
      this.saveCurrentDraftLocally();
    }
  }

  setName(name: string) {
    if (this.currentDraft) {
      this.currentDraft.name = name;
      this.saveCurrentDraftLocally();
    }
  }

  setDescription(description: string) {
    if (this.currentDraft) {
      this.currentDraft.description = description;
      this.saveCurrentDraftLocally();
    }
  }

  setCategory(category: string) {
    if (this.currentDraft) {
      this.currentDraft.category = category;
      this.saveCurrentDraftLocally();
    }
  }

  setCategories(categories: string[]) {
    if (this.currentDraft) {
      this.currentDraft.categories = categories;
      this.saveCurrentDraftLocally();
    }
  }

  setTags(tags: string[]) {
    if (this.currentDraft) {
      this.currentDraft.tags = tags;
      this.saveCurrentDraftLocally();
    }
  }

  setMedia(media: string[]) {
    if (this.currentDraft) {
      this.currentDraft.media = media;
      this.ensureMediaCaptionsEqualMedia();
    }
  }

  setMediaCaptions(mediaCaptions: string[]) {
    if (this.currentDraft) {
      this.currentDraft.mediaCaptions = mediaCaptions;
      this.saveCurrentDraftLocally();
    }
  }

  setRating(rating: number) {
    if (this.currentDraft) {
      this.currentDraft.rating = rating;
      this.saveCurrentDraftLocally();
    }
  }

  setReview(review: string) {
    if (this.currentDraft) {
      this.currentDraft.review = review;
      this.saveCurrentDraftLocally();
    }
  }

  setComments(comments: string) {
    if (this.currentDraft) {
      this.currentDraft.comments = comments;
      this.saveCurrentDraftLocally();
    }
  }

  setPrice(price: number | null) {
    if (this.currentDraft) {
      this.currentDraft.price = price;
      this.saveCurrentDraftLocally();
    }
  }

  setCurrentScreen(screen: string) {
    if (this.currentDraft) {
      this.currentDraft.currentScreen = screen;
      this.saveCurrentDraftLocally();
    }
  }

  reset() {
    this.drafts = [];
    this.currentDraft = null;
    this.isLoading = false;
    this.error = null;
  }
}
