import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useAppStore } from '@/stores';
import type { Toast } from '@/stores/AppStore';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: 'bg-success text-white',
  error: 'bg-danger text-white',
  warning: 'bg-warning text-accent',
  info: 'bg-info text-white',
};

export const ToastContainer = observer(function ToastContainer() {
  const appStore = useAppStore();

  return (
    <div className="fixed bottom-20 left-0 right-0 z-[9999] flex flex-col items-center gap-2 px-4 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {appStore.toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <ToastItem
              key={toast.id}
              id={toast.id}
              type={toast.type}
              message={toast.message}
              duration={toast.duration}
              Icon={Icon}
              colorClass={colors[toast.type]}
              onDismiss={() => appStore.dismissToast(toast.id)}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
});

function ToastItem({
  id,
  message,
  duration,
  Icon,
  colorClass,
  onDismiss,
}: {
  id: string;
  type: Toast['type'];
  message: string;
  duration: number;
  Icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg max-w-sm w-full ${colorClass}`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={onDismiss} className="shrink-0 opacity-70 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
