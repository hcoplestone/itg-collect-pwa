import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useUserStore } from '@/stores';
import { Loader2 } from 'lucide-react';

const Login = observer(function Login() {
  const navigate = useNavigate();
  const userStore = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }

    const success = await userStore.login(email, password);
    if (success) {
      navigate('/home', { replace: true });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="flex flex-col min-h-dvh bg-primary max-w-lg mx-auto w-full">
      <div className="flex justify-center pt-20 pb-5">
        <img
          src="/images/logo-new.png"
          alt="ITG Collect"
          className="h-[70px] object-contain"
        />
      </div>

      <div className="px-6 pt-2">
        <div className="mb-6">
          <label className="block text-base font-medium text-accent mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={userStore.isLoading}
            autoCapitalize="none"
            autoCorrect="off"
            className="w-full bg-secondary border border-accent rounded-lg px-4 py-4 text-base text-accent placeholder:text-text-secondary disabled:opacity-60 outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div className="mb-6">
          <label className="block text-base font-medium text-accent mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={userStore.isLoading}
            className="w-full bg-secondary border border-accent rounded-lg px-4 py-4 text-base text-accent placeholder:text-text-secondary disabled:opacity-60 outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        {userStore.error && (
          <div className="mb-4 p-3 bg-danger/10 border border-danger/30 rounded-lg">
            <p className="text-danger text-sm">{userStore.error}</p>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={userStore.isLoading}
          className="w-full bg-accent text-secondary py-4 rounded-lg text-base font-semibold mt-4 disabled:opacity-60 hover:bg-accent-light transition-colors flex items-center justify-center"
        >
          {userStore.isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Login'
          )}
        </button>

        <button
          onClick={() => navigate('/register')}
          disabled={userStore.isLoading}
          className="w-full bg-secondary text-accent py-4 rounded-lg text-base font-semibold mt-4 hover:bg-secondary-dark transition-colors"
        >
          Don't Have An Account?
        </button>
      </div>
    </div>
  );
});

export default Login;
