import { useAppStore } from '@/stores';
import { useCallback } from 'react';

export function useToast() {
  const appStore = useAppStore();

  const success = useCallback((message: string) => appStore.showToast(message, 'success'), [appStore]);
  const error = useCallback((message: string) => appStore.showToast(message, 'error'), [appStore]);
  const warning = useCallback((message: string) => appStore.showToast(message, 'warning'), [appStore]);
  const info = useCallback((message: string) => appStore.showToast(message, 'info'), [appStore]);

  return { success, error, warning, info };
}
