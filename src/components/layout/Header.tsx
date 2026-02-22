import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export function Header({ title, showBack = false, onBack, rightAction }: HeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="flex items-center h-[60px] px-4 bg-primary shrink-0 shadow-sm">
      <div className="w-10">
        {showBack && (
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary shadow-sm hover:bg-secondary-dark transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-accent" />
          </button>
        )}
      </div>
      <h1 className="flex-1 text-center text-lg font-semibold text-accent truncate">
        {title}
      </h1>
      <div className="w-10 flex justify-end">{rightAction}</div>
    </header>
  );
}
