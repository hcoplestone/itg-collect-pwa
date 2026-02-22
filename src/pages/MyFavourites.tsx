import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useEntriesStore } from '@/stores';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Header } from '@/components/layout/Header';
import { EntryList } from '@/components/entries/EntryList';
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
    <div className="flex flex-col h-dvh w-full bg-primary">
      <Header
        title="My Favourites"
        showBack
        rightAction={
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
            className="p-2"
          >
            {viewMode === 'list' ? (
              <MapIcon className="w-5 h-5 text-accent" />
            ) : (
              <List className="w-5 h-5 text-accent" />
            )}
          </button>
        }
      />

      {viewMode === 'list' ? (
        <div className="flex-1 px-4 py-4 overflow-y-auto w-full">
          <EntryList entries={entries} showDistance emptyMessage="No favourites yet" />
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
  );
});

export default MyFavourites;
