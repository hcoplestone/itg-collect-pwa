import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/stores';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

const Welcome = observer(function Welcome() {
  const navigate = useNavigate();
  const userStore = useUserStore();
  const { isInstallable, isIOSSafari, promptInstall } = useInstallPrompt();
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    if (userStore.isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [userStore.isAuthenticated, navigate]);

  const handleInstallClick = () => {
    if (isIOSSafari) {
      setShowIOSInstructions(true);
    } else {
      promptInstall();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-primary px-8 max-w-lg mx-auto w-full">
      <img
        src="/images/pin.png"
        alt="ITG Collect"
        className="w-[60%] max-w-[240px] mb-12"
      />
      <h1 className="text-[40px] font-bold text-accent text-center mb-4">
        Welcome to ITG Collect!
      </h1>
      <p className="text-lg text-accent text-center mb-12 leading-relaxed">
        The place to share new discoveries and find nearby recommendations on-the-go.
      </p>
      <button
        onClick={() => navigate('/login')}
        className="w-full bg-accent text-secondary py-4 rounded-lg text-lg font-semibold hover:bg-accent-light transition-colors"
      >
        Let's Go &rarr;
      </button>
      {isInstallable && (
        <>
          <button
            onClick={handleInstallClick}
            className="w-full mt-4 border border-accent text-accent py-4 rounded-lg text-lg font-semibold hover:bg-accent/10 transition-colors"
          >
            Install App
          </button>
          {showIOSInstructions && (
            <div className="w-full mt-3 bg-accent/10 rounded-lg p-4 text-accent text-sm leading-relaxed">
              <p className="font-semibold mb-2">To install this app:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Tap the <strong>Share</strong> button <span className="inline-block align-middle text-base">&#xFEFF;□&#x2191;</span> in the toolbar</li>
                <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                <li>Tap <strong>"Add"</strong> to confirm</li>
              </ol>
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="mt-3 text-accent/60 hover:text-accent text-xs transition-colors"
              >
                Dismiss
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
});

export default Welcome;
