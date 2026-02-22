import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useEntriesStore } from '@/stores';
import { useGeolocation } from '@/hooks/useGeolocation';
import { LeafletMap } from '@/components/maps/LeafletMap';
import { EntryCard } from '@/components/entries/EntryCard';
import { CategoryPill } from '@/components/entries/CategoryPill';
import { Search, Loader2 } from 'lucide-react';
import type { Entry } from '@/types';

const Home = observer(function Home() {
  const navigate = useNavigate();
  const entriesStore = useEntriesStore();
  const { latitude, longitude } = useGeolocation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    entriesStore.fetch();
  }, [entriesStore]);

  useEffect(() => {
    if (latitude && longitude) {
      entriesStore.setCurrentLocation({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude, entriesStore]);

  const mapCenter: [number, number] = latitude && longitude
    ? [latitude, longitude]
    : [51.505, -0.09];

  const userLocation = latitude && longitude
    ? { lat: latitude, lng: longitude }
    : null;

  const categories = ['all', ...entriesStore.allCategories];
  const recentEntries = entriesStore.getRecentlyAddedByCategory(selectedCategory);

  const handleEntryClick = (entry: Entry) => {
    navigate(`/entry/${entry.id}`);
  };

  const countLabel = `${recentEntries.length} ${recentEntries.length === 1 ? 'place' : 'places'}${selectedCategory !== 'all' ? ` in ${selectedCategory}` : ''}`;

  return (
    <div className="flex flex-col h-full relative">
      {/* Map */}
      <div className="flex-1 relative">
        <LeafletMap
          entries={entriesStore.entries}
          center={mapCenter}
          zoom={14}
          userLocation={userLocation}
          onEntryClick={handleEntryClick}
        />

        {/* Logo Header Overlay */}
        <div className="absolute top-0 left-0 right-0 z-[1000] bg-primary shadow-md">
          {/* Logo */}
          <div className="flex justify-center pt-3 pb-2">
            <img src="/images/logo-new.png" className="h-[52px] object-contain" alt="Inside Travel" />
          </div>
          {/* Category Pills */}
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide items-center">
            <button
              onClick={() => navigate('/explore')}
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-transparent text-accent shrink-0"
            >
              <Search className="w-5 h-5" />
            </button>
            {categories.map((cat) => (
              <CategoryPill
                key={cat}
                category={cat}
                isActive={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
              />
            ))}
          </div>
        </div>

        {entriesStore.isLoading && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-full px-4 py-2 shadow-md flex items-center gap-2 z-[1001]">
            <Loader2 className="w-4 h-4 animate-spin text-accent" />
            <span className="text-sm text-accent">Loading...</span>
          </div>
        )}
      </div>

      {/* Bottom Panel */}
      <div
        className={`bg-secondary rounded-t-2xl transition-all duration-300 shadow-[0_-4px_8px_rgba(0,0,0,0.08)] z-[1000] ${
          panelOpen ? 'max-h-[60%]' : 'max-h-[220px]'
        }`}
      >
        {/* Drag Handle */}
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className="w-full flex justify-center py-2"
        >
          <div className="w-10 h-1.5 bg-accent rounded-full mt-3 mb-1" />
        </button>

        {/* Title & Count */}
        <div className="px-4 pb-3">
          <h3 className="text-2xl font-bold text-accent text-center">Recently Added</h3>
          <p className="text-sm text-text-secondary text-center mt-0.5">{countLabel}</p>
        </div>

        {/* Entry List */}
        <div className="px-4 pb-4 overflow-y-auto" style={{ maxHeight: panelOpen ? 'calc(60vh - 140px)' : '80px' }}>
          {recentEntries.length === 0 ? (
            <p className="text-xs text-text-secondary text-center">No entries yet</p>
          ) : (
            <div className="flex flex-col gap-2">
              {recentEntries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} showDistance />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default Home;
