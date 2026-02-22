import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useEntriesStore } from '@/stores';
import { useGeolocation } from '@/hooks/useGeolocation';
import { EntryList } from '@/components/entries/EntryList';
import { Header } from '@/components/layout/Header';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';

const sortOptions = [
  { value: 'distance' as const, label: 'Nearest' },
  { value: 'date' as const, label: 'Most Recent' },
  { value: 'name' as const, label: 'A-Z' },
];

const Explore = observer(function Explore() {
  const entriesStore = useEntriesStore();
  const { latitude, longitude } = useGeolocation();
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  useEffect(() => {
    entriesStore.fetch();
  }, [entriesStore]);

  useEffect(() => {
    if (latitude && longitude) {
      entriesStore.setCurrentLocation({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude, entriesStore]);

  const handleSearch = (value: string) => {
    entriesStore.setSearchQuery(value);
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Explore" />

      {/* Search Bar */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search entries..."
            value={entriesStore.searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-secondary rounded-lg pl-10 pr-4 py-3 text-sm text-accent placeholder:text-text-secondary outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      {/* Filter/Sort Bar */}
      <div className="flex gap-2 px-4 pb-3">
        <button
          onClick={() => setShowSortModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-secondary rounded-lg text-xs font-medium text-accent"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          {sortOptions.find(s => s.value === entriesStore.sortBy)?.label}
        </button>
        <button
          onClick={() => setShowFilterModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-secondary rounded-lg text-xs font-medium text-accent relative"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {entriesStore.activeFilterCount > 0 && (
            <span className="ml-1 bg-accent text-secondary w-4 h-4 rounded-full text-[10px] flex items-center justify-center">
              {entriesStore.activeFilterCount}
            </span>
          )}
        </button>
        {entriesStore.activeFilterCount > 0 && (
          <button
            onClick={() => entriesStore.clearFilters()}
            className="flex items-center gap-1 px-3 py-2 bg-danger/10 rounded-lg text-xs font-medium text-danger"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 px-4 pb-4 overflow-y-auto">
        <p className="text-xs text-text-secondary mb-2">
          {entriesStore.filteredEntries.length} entries found
        </p>
        <EntryList
          entries={entriesStore.filteredEntries}
          showDistance={!!latitude}
          emptyMessage="No entries match your search"
        />
      </div>

      {/* Sort Modal */}
      {showSortModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={() => setShowSortModal(false)}>
          <div className="w-full max-w-3xl bg-secondary rounded-t-2xl p-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-accent mb-4">Sort By</h3>
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  entriesStore.setSortBy(option.value);
                  setShowSortModal(false);
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
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={() => setShowFilterModal(false)}>
          <div className="w-full max-w-3xl bg-secondary rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-accent mb-4">Filters</h3>

            {/* My Entries Toggle */}
            <button
              onClick={() => entriesStore.toggleOnlyShowMyEntries()}
              className={`w-full text-left px-4 py-3 rounded-lg mb-3 text-sm ${
                entriesStore.onlyShowMyEntries
                  ? 'bg-accent text-secondary'
                  : 'bg-primary-light text-accent'
              }`}
            >
              Only show my entries
            </button>

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
              onClick={() => setShowFilterModal(false)}
              className="w-full bg-accent text-secondary py-3 rounded-lg text-sm font-semibold mt-2"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default Explore;
