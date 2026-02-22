import { Outlet } from 'react-router-dom';
import { TabBar } from './TabBar';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useAppStore } from '@/stores';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

export const AppShell = observer(function AppShell() {
  const appStore = useAppStore();
  const isOnline = useOnlineStatus();

  useEffect(() => {
    appStore.setOnlineStatus(isOnline);
  }, [isOnline, appStore]);

  return (
    <div className="flex flex-col h-dvh w-full bg-primary relative">
      {!isOnline && (
        <div className="bg-danger text-white text-center py-1 text-sm font-medium shrink-0">
          You are offline
        </div>
      )}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </main>
      <TabBar />
    </div>
  );
});
