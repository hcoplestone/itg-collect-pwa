import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { EntryThumbnail } from './EntryThumbnail';
import { EntryCategoryIcon } from './EntryCategoryIcon';
import { getRelativeTime } from '@/utils/time';
import type { Entry } from '@/types';

interface EntryCardProps {
  entry: Entry;
  showDistance?: boolean;
  showThumbnails?: boolean;
}

export const EntryCard = observer(function EntryCard({ entry, showDistance, showThumbnails = true }: EntryCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/entry/${entry.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-3 p-3 bg-transparent rounded-lg cursor-pointer hover:bg-secondary-dark/30 transition-colors"
    >
      {showThumbnails ? (
        <EntryThumbnail entryId={entry.id} />
      ) : (
        <EntryCategoryIcon category={entry.category} />
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-accent truncate">{entry.name}</h3>
        <p className="text-xs text-text-secondary capitalize">{entry.category}</p>
        {showDistance && entry.distance !== undefined && (
          <p className="text-xs text-text-secondary mt-0.5">
            {entry.distance < 1
              ? `${Math.round(entry.distance * 1000)}m away`
              : `${entry.distance.toFixed(1)}km away`}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {entry.createdAt && (
          <span className="text-xs text-text-secondary">{getRelativeTime(entry.createdAt)}</span>
        )}
        <ChevronRight className="w-4 h-4 text-text-secondary" />
      </div>
    </div>
  );
});
