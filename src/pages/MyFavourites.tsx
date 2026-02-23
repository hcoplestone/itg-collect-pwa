import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useEntriesStore } from '@/stores';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Header } from '@/components/layout/Header';
import { AnimatedPage } from '@/components/layout/AnimatedPage';
import { EntryList } from '@/components/entries/EntryList';
import { ErrorState } from '@/components/ui/ErrorState';
import { LeafletMap } from '@/components/maps/LeafletMap';
import { useNavigate } from 'react-router-dom';
import { List, Map as MapIcon } from 'lucide-react';
import type { Entry } from '@/types';

const MyFavourites = observer(function MyFavourites() {
  const entriesStore = useEntriesStore();
  const navigate = useNavigate();
  const { latitude, longitude } = useGeolocation();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    entriesStore.fetch();
  }, [entriesStore]);

  useEffect(() => {
    if (latitude && longitude) {
      entriesStore.setCurrentLocation({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude, entriesStore]);

  const entries = entriesStore.myFavourites;
  const userLocation = latitude && longitude ? { lat: latitude, lng: longitude } : null;

  const handleEntryClick = (entry: Entry) => {
    navigate(`/entry/${entry.id}`);
  };

  return (
    <AnimatedPage>
    <div className="flex flex-col h-dvh w-full bg-primary">
      <Header title="My Favourites" showBack />

      {/* Segmented tabs */}
      <div className="px-4 pb-3">
        <div className="flex bg-secondary rounded-xl p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-accent text-secondary shadow-sm'
                : 'text-text-secondary'
            }`}
          >
            <List className="w-4 h-4" />
            List
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'map'
                ? 'bg-accent text-secondary shadow-sm'
                : 'text-text-secondary'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            Map
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="flex-1 px-4 py-2 overflow-y-auto w-full">
          {entriesStore.error ? (
            <ErrorState message={entriesStore.error} onRetry={() => entriesStore.fetch(true)} />
          ) : (
            <EntryList entries={entries} isLoading={entriesStore.isLoading} showDistance emptyMessage="No favourites yet" />
          )}
        </div>
      ) : (
        <div className="flex-1">
          <LeafletMap
            entries={entries}
            center={
              latitude && longitude
                ? [latitude, longitude]
                : entries.length > 0
                ? [entries[0].lat, entries[0].lng]
                : [51.505, -0.09]
            }
            zoom={13}
            userLocation={userLocation}
            onEntryClick={handleEntryClick}
          />
        </div>
      )}
    </div>
    </AnimatedPage>
  );
});

export default MyFavourites;
