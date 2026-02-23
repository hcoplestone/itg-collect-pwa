import { motion } from 'framer-motion';
import { EntryCard } from './EntryCard';
import { EntryCardSkeleton } from './EntryCardSkeleton';
import { staggerContainer } from '@/lib/animations';
import type { Entry } from '@/types';

interface EntryListProps {
  entries: Entry[];
  showDistance?: boolean;
  showThumbnails?: boolean;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function EntryList({ entries, showDistance, showThumbnails, emptyMessage = 'No entries found', isLoading }: EntryListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map((i) => (
          <EntryCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-text-secondary text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col gap-2"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} showDistance={showDistance} showThumbnails={showThumbnails} />
      ))}
    </motion.div>
  );
}
