import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useDraftsStore } from '@/stores';
import { locationSuggestionsApi } from '@/api/location-suggestions';
import { WizardLayout } from '@/components/entries/WizardLayout';
import { Loader2 } from 'lucide-react';
import type { GooglePlace } from '@/types';

const DidYouMean = observer(function DidYouMean() {
  const navigate = useNavigate();
  const draftsStore = useDraftsStore();
  const [suggestions, setSuggestions] = useState<GooglePlace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    draftsStore.setCurrentScreen('/create-entry/did-you-mean');
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    if (!draftsStore.lat || !draftsStore.lng || !draftsStore.name) {
      setLoading(false);
      return;
    }

    try {
      const response = await locationSuggestionsApi.didYouMean(
        draftsStore.lat,
        draftsStore.lng,
        draftsStore.name
      );
      setSuggestions((response.data?.results ?? []).slice(0, 5));
    } catch (error) {
      console.error('Error fetching did-you-mean suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (place: GooglePlace) => {
    draftsStore.setGooglePlace(place);
    draftsStore.setName(place.name);
    navigate('/create-entry/details');
  };

  const handleKeepOriginal = () => {
    navigate('/create-entry/details');
  };

  return (
    <WizardLayout
      title="Did You Mean?"
      step={3}
      onBack={() => navigate(-1)}
    >
      <div className="py-4">
        <p className="text-sm text-text-secondary mb-4">
          You entered: <strong className="text-accent">{draftsStore.name}</strong>
        </p>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
          </div>
        ) : suggestions.length > 0 ? (
          <div className="flex flex-col gap-2 mb-4">
            <p className="text-sm text-text-secondary mb-1">Did you mean one of these?</p>
            {suggestions.map((place) => (
              <button
                key={place.place_id}
                onClick={() => handleSelectSuggestion(place)}
                className="w-full text-left p-4 bg-secondary rounded-lg hover:bg-secondary-dark transition-colors"
              >
                <p className="text-sm font-medium text-accent">{place.name}</p>
                {place.vicinity && (
                  <p className="text-xs text-text-secondary">{place.vicinity}</p>
                )}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-secondary mb-4">
            No alternative suggestions found.
          </p>
        )}

        <button
          onClick={handleKeepOriginal}
          className="w-full bg-accent text-secondary py-4 rounded-lg text-base font-semibold hover:bg-accent-light transition-colors"
        >
          Keep "{draftsStore.name}"
        </button>
      </div>
    </WizardLayout>
  );
});

export default DidYouMean;
