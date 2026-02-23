import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { MapPin } from 'lucide-react';
import { useEntriesStore } from '@/stores';

interface EntryThumbnailProps {
  entryId: string;
  size?: string;
  className?: string;
}

export const EntryThumbnail = observer(function EntryThumbnail({
  entryId,
  size = 'w-16 h-16',
  className = '',
}: EntryThumbnailProps) {
  const entriesStore = useEntriesStore();
  const media = entriesStore.getMedia(entryId);

  useEffect(() => {
    entriesStore.fetchMediaForEntry(entryId);
  }, [entryId, entriesStore]);

  const firstPhoto = media?.[0];

  // Still loading
  if (media === undefined) {
    return (
      <div className={`${size} rounded-md bg-primary-light shrink-0 animate-shimmer ${className}`} />
    );
  }

  // Has image
  if (firstPhoto) {
    const src = firstPhoto.startsWith('data:')
      ? firstPhoto
      : `data:image/jpeg;base64,${firstPhoto}`;

    return (
      <img
        src={src}
        alt=""
        className={`${size} rounded-md object-cover shrink-0 ${className}`}
      />
    );
  }

  // No image
  return (
    <div className={`${size} rounded-md bg-primary-light flex items-center justify-center shrink-0 ${className}`}>
      <MapPin className="w-6 h-6 text-text-secondary" />
    </div>
  );
});
