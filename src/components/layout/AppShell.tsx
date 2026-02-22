import { Outlet } from 'react-router-dom';
import { TabBar } from './TabBar';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { useServiceWorkerUpdate } from '@/hooks/useServiceWorkerUpdate';
import { useAppStore } from '@/stores';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

export const AppShell = observer(function AppShell() {
  const appStore = useAppStore();
  const isOnline = useOnlineStatus();
  const { isInstallable, promptInstall } = useInstallPrompt();
  const { needRefresh, updating, triggerUpdate } = useServiceWorkerUpdate();
  const [installDismissed, setInstallDismissed] = useState(false);

  useEffect(() => {
    appStore.setOnlineStatus(isOnline);
  }, [isOnline, appStore]);

  if (updating) {
    return (
      <div className="flex flex-col items-center justify-center h-dvh w-full bg-primary px-8">
        <img
          src="/images/pin.png"
          alt="ITG Collect"
          className="w-[40%] max-w-[160px] mb-8"
        />
        <p className="text-lg font-semibold text-accent mb-6">Updating...</p>
        <div className="w-48 h-1.5 bg-accent/20 rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full animate-[indeterminate_1.5s_ease-in-out_infinite]" />
        </div>
        <style>{`
          @keyframes indeterminate {
            0% { width: 0%; margin-left: 0%; }
            50% { width: 60%; margin-left: 20%; }
            100% { width: 0%; margin-left: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh w-full bg-primary relative">
      {!isOnline && (
        <div className="bg-danger text-white text-center py-1 text-sm font-medium shrink-0">
          You are offline
        </div>
      )}
      {needRefresh && (
        <div className="bg-accent/10 text-accent text-sm font-medium px-4 py-2 flex items-center justify-between shrink-0">
          <span>A new version is available</span>
          <button
            onClick={triggerUpdate}
            className="bg-accent text-secondary px-3 py-1 rounded-md text-xs font-semibold hover:bg-accent-light transition-colors ml-4 shrink-0"
          >
            Update
          </button>
        </div>
      )}
      {isInstallable && !installDismissed && (
        <div className="bg-accent/10 text-accent text-sm font-medium px-4 py-2 flex items-center justify-between shrink-0">
          <span>Install ITG Collect for a better experience</span>
          <div className="flex items-center gap-2 ml-4 shrink-0">
            <button
              onClick={promptInstall}
              className="bg-accent text-secondary px-3 py-1 rounded-md text-xs font-semibold hover:bg-accent-light transition-colors"
            >
              Install
            </button>
            <button
              onClick={() => setInstallDismissed(true)}
              className="text-accent/60 hover:text-accent p-1 transition-colors"
              aria-label="Dismiss"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </main>
      <TabBar />
    </div>
  );
});
