import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Failed to load data', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="w-12 h-12 bg-danger/10 rounded-full flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6 text-danger" />
      </div>
      <p className="text-sm text-text-secondary text-center mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-secondary rounded-lg text-sm font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  );
}
