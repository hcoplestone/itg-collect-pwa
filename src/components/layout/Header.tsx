import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TAP_SCALE } from '@/lib/animations';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showLogo?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export function Header({ title, showBack = false, showLogo = false, onBack, rightAction }: HeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="bg-primary shrink-0">
      {showLogo && (
        <div className="flex justify-center pt-3 pb-2">
          <img src="/images/logo-new.png" className="h-[42px] object-contain" alt="Inside Travel" />
        </div>
      )}
      <div className="flex items-center px-4 pb-2 pt-3">
        <div className="w-10">
          {showBack && (
            <motion.button
              onClick={handleBack}
              whileTap={TAP_SCALE}
              aria-label="Go back"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary shadow-sm hover:bg-secondary-dark transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-accent" />
            </motion.button>
          )}
        </div>
        <h1 className="flex-1 text-center text-lg font-semibold text-accent truncate">
          {title}
        </h1>
        <div className="w-10 flex justify-end">{rightAction}</div>
      </div>
    </header>
  );
}
