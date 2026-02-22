import { useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function useServiceWorkerUpdate() {
  const [updating, setUpdating] = useState(false);

  const {
    needRefresh: [needRefresh],
    offlineReady: [offlineReady],
    updateServiceWorker,
  } = useRegisterSW();

  const triggerUpdate = async () => {
    setUpdating(true);
    await updateServiceWorker(true);
  };

  return { needRefresh, offlineReady, updating, triggerUpdate };
}
