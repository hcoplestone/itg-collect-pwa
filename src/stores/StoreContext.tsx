import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { RootStore } from './RootStore';

const rootStore = new RootStore();

const StoreContext = createContext<RootStore | null>(null);

interface StoreProviderProps {
  children: ReactNode;
  store?: RootStore;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({
  children,
  store = rootStore
}) => {
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStores = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStores must be used within a StoreProvider');
  }
  return context;
};

export const useUserStore = () => {
  const { userStore } = useStores();
  return userStore;
};

export const useAppStore = () => {
  const { appStore } = useStores();
  return appStore;
};

export const useEntriesStore = () => {
  const { entriesStore } = useStores();
  return entriesStore;
};

export const useDraftsStore = () => {
  const { draftsStore } = useStores();
  return draftsStore;
};

export const useFeedbackStore = () => {
  const { feedbackStore } = useStores();
  return feedbackStore;
};
