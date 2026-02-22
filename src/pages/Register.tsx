import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useUserStore } from '@/stores';
import { Loader2 } from 'lucide-react';

const Register = observer(function Register() {
  const navigate = useNavigate();
  const userStore = useUserStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleRegister = async () => {
    setValidationError('');

    if (!name || !email || !password || !passwordConfirmation) {
      setValidationError('Please fill in all fields');
      return;
    }

    if (password !== passwordConfirmation) {
      setValidationError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters');
      return;
    }

    const success = await userStore.register(name, email, password, passwordConfirmation);
    if (success) {
      navigate('/home', { replace: true });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

  const error = validationError || userStore.error;

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
        <div className="mb-5">
          <label className="block text-base font-medium text-accent mb-2">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={userStore.isLoading}
            className="w-full bg-secondary border border-accent rounded-lg px-4 py-4 text-base text-accent placeholder:text-text-secondary disabled:opacity-60 outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div className="mb-5">
          <label className="block text-base font-medium text-accent mb-2">Email</label>
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

        <div className="mb-5">
          <label className="block text-base font-medium text-accent mb-2">Password</label>
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

        <div className="mb-5">
          <label className="block text-base font-medium text-accent mb-2">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={userStore.isLoading}
            className="w-full bg-secondary border border-accent rounded-lg px-4 py-4 text-base text-accent placeholder:text-text-secondary disabled:opacity-60 outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-danger/10 border border-danger/30 rounded-lg">
            <p className="text-danger text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleRegister}
          disabled={userStore.isLoading}
          className="w-full bg-accent text-secondary py-4 rounded-lg text-base font-semibold mt-2 disabled:opacity-60 hover:bg-accent-light transition-colors flex items-center justify-center"
        >
          {userStore.isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Register'
          )}
        </button>

        <button
          onClick={() => navigate('/login')}
          disabled={userStore.isLoading}
          className="w-full bg-secondary text-accent py-4 rounded-lg text-base font-semibold mt-4 hover:bg-secondary-dark transition-colors"
        >
          Already Have An Account?
        </button>
      </div>
    </div>
  );
});

export default Register;
