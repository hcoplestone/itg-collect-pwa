import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { WizardStepTransition } from '@/components/entries/WizardStepTransition';
import { useNavigate } from 'react-router-dom';
import { useDraftsStore } from '@/stores';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import { TAP_SCALE } from '@/lib/animations';

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
  fullBleed?: boolean;
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
  fullBleed = false,
}: WizardLayoutProps) {
  const navigate = useNavigate();
  const draftsStore = useDraftsStore();
  const [showSaveDraftConfirm, setShowSaveDraftConfirm] = useState(false);

  const handleSaveDraft = () => {
    draftsStore.saveCurrentDraftLocally();
    navigate('/drafts');
  };

  return (
    <div className="flex flex-col h-dvh w-full bg-primary">
      <Header title={title} showBack onBack={onBack} />

      {/* Progress Bar */}
      <div className="px-4 pb-3 shrink-0 w-full">
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full bg-accent/20 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-accent"
                initial={false}
                animate={{ width: i < step ? '100%' : '0%' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto w-full ${fullBleed ? '' : 'px-4'}`}>
        <WizardStepTransition>
          {children}
        </WizardStepTransition>
      </div>

      {/* Actions */}
      <div className="bg-secondary rounded-t-2xl shadow-[0_-4px_8px_rgba(0,0,0,0.08)] px-4 pb-6 pt-4 shrink-0 flex flex-col gap-2 w-full">
        {onNext && (
          <motion.button
            onClick={onNext}
            disabled={nextDisabled}
            whileTap={TAP_SCALE}
            className="w-full bg-accent text-secondary py-3 rounded-2xl text-base font-bold disabled:opacity-40 hover:bg-accent-light transition-colors"
          >
            {nextLabel}
          </motion.button>
        )}
        {showSaveDraft && (
          <motion.button
            onClick={() => setShowSaveDraftConfirm(true)}
            whileTap={TAP_SCALE}
            className="w-full py-3 text-base font-medium text-text-secondary border border-accent/20 rounded-2xl hover:text-accent transition-colors"
          >
            Save Draft & Exit
          </motion.button>
        )}
      </div>

      <ConfirmDialog
        open={showSaveDraftConfirm}
        onConfirm={handleSaveDraft}
        onCancel={() => setShowSaveDraftConfirm(false)}
        title="Save Draft"
        message="Save your progress and exit?"
        confirmLabel="Save & Exit"
        variant="confirm"
      />
    </div>
  );
});
