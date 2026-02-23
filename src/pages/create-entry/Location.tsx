import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useDraftsStore } from '@/stores';
import { useToast } from '@/hooks/useToast';
import { locationSuggestionsApi } from '@/api/location-suggestions';
import { WizardLayout } from '@/components/entries/WizardLayout';
import { ErrorState } from '@/components/ui/ErrorState';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { TAP_SCALE, fadeUpVariants, staggerContainer } from '@/lib/animations';
import type { GooglePlace } from '@/types';

const Location = observer(function Location() {
  const navigate = useNavigate();
  const draftsStore = useDraftsStore();
  const [activeTab, setActiveTab] = useState<'suggestions' | 'manual'>('suggestions');
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GooglePlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState(false);
  const [manualName, setManualName] = useState(draftsStore.name);

  useEffect(() => {
    draftsStore.setCurrentScreen('/create-entry/location');
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async (query = '') => {
    if (!draftsStore.lat || !draftsStore.lng) return;
    setLoading(true);
    setSuggestionsError(false);
    try {
      const response = await locationSuggestionsApi.getSuggestions(
        draftsStore.lat,
        draftsStore.lng,
        query
      );
      const data = response.data;
      setSuggestions(data?.results ?? []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestionsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchSuggestions(searchQuery);
  };

  const handleSelectSuggestion = (place: GooglePlace) => {
    draftsStore.setGooglePlace(place);
    draftsStore.setName(place.name);
    if (place.geometry?.location) {
      draftsStore.setLat(place.geometry.location.lat);
      draftsStore.setLng(place.geometry.location.lng);
    }
    navigate('/create-entry/details', { state: { direction: 1 } });
  };

  const handleNext = () => {
    if (activeTab === 'manual') {
      if (!manualName.trim()) {
        toast.warning('Please enter a name');
        return;
      }
      draftsStore.setName(manualName);
      navigate('/create-entry/did-you-mean', { state: { direction: 1 } });
    }
  };

  return (
    <WizardLayout
      title="Location Name"
      step={2}
      onNext={activeTab === 'manual' ? handleNext : undefined}
      nextDisabled={activeTab === 'manual' && !manualName.trim()}
      onBack={() => navigate(-1)}
    >
      {/* Tabs */}
      <div className="flex gap-1 bg-secondary rounded-lg p-1 mb-4">
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'suggestions'
              ? 'bg-accent text-secondary'
              : 'text-text-secondary'
          }`}
        >
          Suggestions
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'manual'
              ? 'bg-accent text-secondary'
              : 'text-text-secondary'
          }`}
        >
          Manual Entry
        </button>
      </div>

      {activeTab === 'suggestions' && (
        <div>
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Search nearby places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-secondary rounded-lg pl-10 pr-4 py-3 text-sm text-accent placeholder:text-text-secondary outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
            </div>
          ) : suggestionsError ? (
            <ErrorState message="Failed to load suggestions" onRetry={() => fetchSuggestions(searchQuery)} />
          ) : (
            <motion.div
              className="flex flex-col gap-2"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              key={suggestions.length}
            >
              {suggestions.map((place) => (
                <motion.button
                  key={place.place_id}
                  variants={fadeUpVariants}
                  onClick={() => handleSelectSuggestion(place)}
                  whileTap={TAP_SCALE}
                  className="flex items-start gap-3 p-3 bg-secondary rounded-lg text-left hover:bg-secondary-dark transition-colors"
                >
                  <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-accent">{place.name}</p>
                    {place.vicinity && (
                      <p className="text-xs text-text-secondary">{place.vicinity}</p>
                    )}
                  </div>
                </motion.button>
              ))}
              {suggestions.length === 0 && !loading && (
                <p className="text-sm text-text-secondary text-center py-4">
                  No suggestions found. Try searching or use manual entry.
                </p>
              )}
            </motion.div>
          )}
        </div>
      )}

      {activeTab === 'manual' && (
        <div>
          <label className="block text-sm font-medium text-accent mb-2">
            Place Name
          </label>
          <input
            type="text"
            placeholder="Enter the name of the place"
            value={manualName}
            onChange={(e) => setManualName(e.target.value)}
            className="w-full bg-secondary rounded-lg px-4 py-3 text-sm text-accent placeholder:text-text-secondary outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      )}
    </WizardLayout>
  );
});

export default Location;
