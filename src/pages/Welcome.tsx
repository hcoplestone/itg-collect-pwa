import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useUserStore } from '@/stores';

const Welcome = observer(function Welcome() {
  const navigate = useNavigate();
  const userStore = useUserStore();

  useEffect(() => {
    if (userStore.isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [userStore.isAuthenticated, navigate]);

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
        className="bg-accent text-secondary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent-light transition-colors"
      >
        Let's Go &rarr;
      </button>
    </div>
  );
});

export default Welcome;
