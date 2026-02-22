import { useEffect, useState, useCallback } from 'react';

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
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[1020] flex items-center justify-center px-6 transition-colors duration-300 ${
        visible ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/0'
      }`}
      onClick={handleCancel}
    >
      <div
        className={`w-full max-w-sm bg-secondary rounded-2xl p-6 transition-all duration-300 ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-accent mb-2">{title}</h3>
        <p className="text-sm text-text-secondary mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={handleCancel}
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
      </div>
    </div>
  );
}
