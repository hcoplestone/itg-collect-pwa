import { Header } from '@/components/layout/Header';
import { useNavigate } from 'react-router-dom';
import { useDraftsStore } from '@/stores';
import { observer } from 'mobx-react-lite';

interface WizardLayoutProps {
  title: string;
  step: number;
  totalSteps?: number;
  children: React.ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showSaveDraft?: boolean;
}

export const WizardLayout = observer(function WizardLayout({
  title,
  step,
  totalSteps = 7,
  children,
  onNext,
  onBack,
  nextLabel = 'Next',
  nextDisabled = false,
  showSaveDraft = true,
}: WizardLayoutProps) {
  const navigate = useNavigate();
  const draftsStore = useDraftsStore();

  const handleSaveDraft = () => {
    draftsStore.saveCurrentDraftLocally();
    navigate('/home');
  };

  return (
    <div className="flex flex-col h-dvh w-full bg-primary">
      <Header title={title} showBack onBack={onBack} />

      {/* Progress Bar */}
      <div className="px-4 pb-3 shrink-0 w-full">
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-colors ${
                i < step ? 'bg-accent' : 'bg-accent/20'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-text-secondary mt-1">
          Step {step} of {totalSteps}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 w-full">
        {children}
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 pt-2 shrink-0 flex flex-col gap-2 w-full">
        {onNext && (
          <button
            onClick={onNext}
            disabled={nextDisabled}
            className="w-full bg-accent text-secondary py-4 rounded-lg text-base font-semibold disabled:opacity-40 hover:bg-accent-light transition-colors"
          >
            {nextLabel}
          </button>
        )}
        {showSaveDraft && (
          <button
            onClick={handleSaveDraft}
            className="w-full bg-secondary text-accent py-3 rounded-lg text-sm font-medium hover:bg-secondary-dark transition-colors"
          >
            Save Draft & Exit
          </button>
        )}
      </div>
    </div>
  );
});
