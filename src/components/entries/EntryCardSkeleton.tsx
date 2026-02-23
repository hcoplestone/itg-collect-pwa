export function EntryCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg">
      <div className="w-10 h-10 rounded-lg animate-shimmer shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="h-4 w-3/4 rounded animate-shimmer mb-1.5" />
        <div className="h-3 w-1/2 rounded animate-shimmer" />
      </div>
      <div className="h-3 w-12 rounded animate-shimmer shrink-0" />
    </div>
  );
}
