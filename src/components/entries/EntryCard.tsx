import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useUserStore } from '@/stores';
import { EntryThumbnail } from './EntryThumbnail';
import { EntryCategoryIcon } from './EntryCategoryIcon';
import type { Entry } from '@/types';

interface EntryCardProps {
  entry: Entry;
  showDistance?: boolean;
  showThumbnails?: boolean;
}

export const EntryCard = observer(function EntryCard({ entry, showDistance, showThumbnails = true }: EntryCardProps) {
  const navigate = useNavigate();
  const userStore = useUserStore();
  const isFav = userStore.isFavourite(entry.id);

  const handleClick = () => {
    navigate(`/entry/${entry.id}`);
  };

  const handleFavourite = (e: React.MouseEvent) => {
    e.stopPropagation();
    userStore.toggleFavourite(entry.id);
  };

  return (
    <div
      onClick={handleClick}
      className="flex gap-3 p-3 bg-transparent rounded-lg cursor-pointer hover:bg-secondary-dark/30 transition-colors"
    >
      {showThumbnails ? (
        <EntryThumbnail entryId={entry.id} />
      ) : (
        <EntryCategoryIcon category={entry.category} />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm text-accent truncate">{entry.name}</h3>
          <button
            onClick={handleFavourite}
            className="shrink-0 p-1"
          >
            <Heart
              className={`w-4 h-4 ${isFav ? 'fill-danger text-danger' : 'text-text-secondary'}`}
            />
          </button>
        </div>
        <p className="text-xs text-text-secondary capitalize">{entry.category}</p>
        {showDistance && entry.distance !== undefined && (
          <p className="text-xs text-text-secondary mt-0.5">
            {entry.distance < 1
              ? `${Math.round(entry.distance * 1000)}m away`
              : `${entry.distance.toFixed(1)}km away`}
          </p>
        )}
        {entry.description && (
          <p className="text-xs text-text-secondary mt-1 line-clamp-1">
            {entry.description}
          </p>
        )}
      </div>
    </div>
  );
});
