import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useEntriesStore } from '@/stores';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useDebounce } from '@/hooks/useDebounce';
import { EntryList } from '@/components/entries/EntryList';
import { ErrorState } from '@/components/ui/ErrorState';
import { Header } from '@/components/layout/Header';
import { AnimatedPage } from '@/components/layout/AnimatedPage';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TAP_SCALE, overlayVariants, bottomSheetVariants, DURATION } from '@/lib/animations';

const sortOptions = [
  { value: 'distance' as const, label: 'Nearest' },
  { value: 'date' as const, label: 'Most Recent' },
  { value: 'name' as const, label: 'A-Z' },
];

const Explore = observer(function Explore() {
  const entriesStore = useEntriesStore();
  const { latitude, longitude } = useGeolocation();
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(entriesStore.searchQuery);
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    entriesStore.fetch();
  }, [entriesStore]);

  useEffect(() => {
    if (latitude && longitude) {
      entriesStore.setCurrentLocation({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude, entriesStore]);

  useEffect(() => {
    entriesStore.setSearchQuery(debouncedSearch);
  }, [debouncedSearch, entriesStore]);

  useEffect(() => {
    if (!sortOpen && !filterOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSortOpen(false);
        setFilterOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sortOpen, filterOpen]);

  return (
    <AnimatedPage>
      <div className="flex flex-col h-full">
        <Header title="Explore" showLogo />

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-secondary rounded-lg pl-10 pr-4 py-3 text-sm text-accent placeholder:text-text-secondary outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
        </div>

        {/* Filter/Sort Bar */}
        <div className="flex gap-2 px-4 pb-3">
          <motion.button
            onClick={() => setSortOpen(true)}
            whileTap={TAP_SCALE}
            className="flex items-center gap-1.5 px-3 py-2 bg-secondary rounded-lg text-xs font-medium text-accent"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortOptions.find(s => s.value === entriesStore.sortBy)?.label}
          </motion.button>
          <motion.button
            onClick={() => setFilterOpen(true)}
            whileTap={TAP_SCALE}
            className="flex items-center gap-1.5 px-3 py-2 bg-secondary rounded-lg text-xs font-medium text-accent relative"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            {entriesStore.activeFilterCount > 0 && (
              <span className="ml-1 bg-accent text-secondary w-4 h-4 rounded-full text-[10px] flex items-center justify-center">
                {entriesStore.activeFilterCount}
              </span>
            )}
          </motion.button>
          {entriesStore.activeFilterCount > 0 && (
            <motion.button
              onClick={() => entriesStore.clearFilters()}
              whileTap={TAP_SCALE}
              className="flex items-center gap-1 px-3 py-2 bg-danger/10 rounded-lg text-xs font-medium text-danger"
            >
              <X className="w-3 h-3" /> Clear
            </motion.button>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 px-4 pb-4 overflow-y-auto">
          {entriesStore.error ? (
            <ErrorState message={entriesStore.error} onRetry={() => entriesStore.fetch(true)} />
          ) : (
            <>
              <p className="text-xs text-text-secondary mb-2" aria-live="polite">
                {entriesStore.filteredEntries.length} entries found
                {entriesStore.isStale && <span className="text-warning ml-2">(cached)</span>}
              </p>
              <EntryList
                entries={entriesStore.filteredEntries}
                isLoading={entriesStore.isLoading}
                showDistance={!!latitude}
                showThumbnails={false}
                emptyMessage="No entries match your search"
              />
            </>
          )}
        </div>

        {/* Sort Modal */}
        <AnimatePresence>
          {sortOpen && (
            <motion.div
              className="fixed inset-0 z-[1010] flex items-end justify-center"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: DURATION.normal }}
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
              onClick={() => setSortOpen(false)}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="sort-modal-heading"
                className="w-full max-w-3xl bg-secondary rounded-t-2xl p-4 pb-20"
                variants={bottomSheetVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: DURATION.normal, ease: 'easeOut' }}
                onClick={e => e.stopPropagation()}
              >
                <h3 id="sort-modal-heading" className="text-base font-semibold text-accent mb-4">Sort By</h3>
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      entriesStore.setSortBy(option.value);
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg mb-1 text-sm ${
                      entriesStore.sortBy === option.value
                        ? 'bg-accent text-secondary font-semibold'
                        : 'text-accent hover:bg-primary-light'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Modal */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              className="fixed inset-0 z-[1010] flex items-end justify-center"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: DURATION.normal }}
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
              onClick={() => setFilterOpen(false)}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="filter-modal-heading"
                className="w-full max-w-3xl bg-secondary rounded-t-2xl p-4 pb-20 max-h-[70vh] overflow-y-auto"
                variants={bottomSheetVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: DURATION.normal, ease: 'easeOut' }}
                onClick={e => e.stopPropagation()}
              >
                <h3 id="filter-modal-heading" className="text-base font-semibold text-accent mb-4">Filters</h3>

                {/* My Entries Toggle */}
                <label
                  onClick={() => entriesStore.toggleOnlyShowMyEntries()}
                  className="flex items-center gap-3 py-3 rounded-lg mb-3 cursor-pointer text-sm text-accent"
                >
                  <span
                    className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-colors ${
                      entriesStore.onlyShowMyEntries
                        ? 'bg-accent border-accent'
                        : 'border-accent/40 bg-transparent'
                    }`}
                  >
                    {entriesStore.onlyShowMyEntries && (
                      <svg className="w-3 h-3 text-secondary" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 6l3 3 5-5" />
                      </svg>
                    )}
                  </span>
                  Only show my entries
                </label>

                {/* Category Filter */}
                <h4 className="text-sm font-medium text-accent mb-2">Category</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => entriesStore.setCategoryFilter(null)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      !entriesStore.categoryFilter
                        ? 'bg-accent text-secondary'
                        : 'bg-primary-light text-accent'
                    }`}
                  >
                    All
                  </button>
                  {entriesStore.allCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => entriesStore.setCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${
                        entriesStore.categoryFilter === cat
                          ? 'bg-accent text-secondary'
                          : 'bg-primary-light text-accent'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Added Within */}
                <h4 className="text-sm font-medium text-accent mb-2">Added Within</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {[null, 7, 30, 90].map((days) => (
                    <button
                      key={days ?? 'all'}
                      onClick={() => entriesStore.setAddedWithinDays(days)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        entriesStore.addedWithinDays === days
                          ? 'bg-accent text-secondary'
                          : 'bg-primary-light text-accent'
                      }`}
                    >
                      {days === null ? 'Any time' : `${days} days`}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setFilterOpen(false)}
                  className="w-full bg-accent text-secondary py-3 rounded-lg text-sm font-semibold mt-2"
                >
                  Apply Filters
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedPage>
  );
});

export default Explore;
