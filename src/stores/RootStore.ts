import { makeAutoObservable } from 'mobx';
import { AppStore } from './AppStore';
import { DraftsStore } from './DraftsStore';
import { EntriesStore } from './EntriesStore';
import { FeedbackStore } from './FeedbackStore';
import { UserStore } from './UserStore';

export class RootStore {
  userStore: UserStore;
  appStore: AppStore;
  draftsStore: DraftsStore;
  entriesStore: EntriesStore;
  feedbackStore: FeedbackStore;

  constructor() {
    this.userStore = new UserStore(this);
    this.appStore = new AppStore(this);
    this.draftsStore = new DraftsStore(this);
    this.entriesStore = new EntriesStore(this);
    this.feedbackStore = new FeedbackStore(this);

    makeAutoObservable(this);
  }

  reset() {
    this.userStore.reset();
    this.appStore.reset();
    this.draftsStore.reset();
    this.entriesStore.reset();
    this.feedbackStore.reset();
  }
}
