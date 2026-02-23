import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { overlayVariants, dialogVariants, DURATION } from '@/lib/animations';

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  variant?: 'danger' | 'confirm';
}

export function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title = 'Delete',
  message = 'Are you sure? This action cannot be undone.',
  confirmLabel = 'Delete',
  variant = 'danger',
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => cancelRef.current?.focus(), 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancelRef.current();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1020] flex items-center justify-center px-6"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: DURATION.normal }}
          style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={onCancel}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-message"
            className="w-full max-w-sm bg-secondary rounded-2xl p-6"
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: DURATION.normal }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="confirm-dialog-title" className="text-lg font-bold text-accent mb-2">{title}</h3>
            <p id="confirm-dialog-message" className="text-sm text-text-secondary mb-6">{message}</p>

            <div className="flex gap-3">
              <button
                ref={cancelRef}
                onClick={onCancel}
                className="flex-1 px-4 py-3 rounded-xl border border-accent/20 text-accent text-sm font-medium transition-colors active:bg-accent/5"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  variant === 'confirm'
                    ? 'bg-accent text-secondary active:bg-accent/90'
                    : 'bg-danger text-white active:bg-danger/90'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
