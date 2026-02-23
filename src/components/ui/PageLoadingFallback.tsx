import { Loader2 } from 'lucide-react';

export function PageLoadingFallback() {
  return (
    <div className="flex items-center justify-center h-dvh w-full bg-primary">
      <Loader2 className="w-8 h-8 animate-spin text-accent" />
    </div>
  );
}
