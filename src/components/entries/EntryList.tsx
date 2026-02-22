import { EntryCard } from './EntryCard';
import type { Entry } from '@/types';

interface EntryListProps {
  entries: Entry[];
  showDistance?: boolean;
  showThumbnails?: boolean;
  emptyMessage?: string;
}

export function EntryList({ entries, showDistance, showThumbnails, emptyMessage = 'No entries found' }: EntryListProps) {
  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-text-secondary text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} showDistance={showDistance} showThumbnails={showThumbnails} />
      ))}
    </div>
  );
}
