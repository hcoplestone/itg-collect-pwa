import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useDraftsStore } from '@/stores';
import { useGeolocation } from '@/hooks/useGeolocation';
import { InteractiveMap } from '@/components/maps/InteractiveMap';
import { WizardLayout } from '@/components/entries/WizardLayout';
import { Crosshair } from 'lucide-react';

const MapSelect = observer(function MapSelect() {
  const navigate = useNavigate();
  const draftsStore = useDraftsStore();
  const { latitude, longitude } = useGeolocation();

  useEffect(() => {
    if (!draftsStore.currentDraft) {
      draftsStore.resetDraft();
    }
    draftsStore.setCurrentScreen('/create-entry/map-select');
  }, [draftsStore]);

  const handleLocationSelect = (lat: number, lng: number) => {
    draftsStore.setLat(lat);
    draftsStore.setLng(lng);
  };

  const handleUseMyLocation = () => {
    if (latitude && longitude) {
      draftsStore.setLat(latitude);
      draftsStore.setLng(longitude);
    }
  };

  const handleNext = () => {
    if (!draftsStore.lat || !draftsStore.lng) {
      alert('Please select a location on the map');
      return;
    }
    navigate('/create-entry/location');
  };

  const selectedLocation = draftsStore.lat && draftsStore.lng
    ? { lat: draftsStore.lat, lng: draftsStore.lng }
    : null;

  const userLocation = latitude && longitude ? { lat: latitude, lng: longitude } : null;

  return (
    <WizardLayout
      title="Select Location"
      step={1}
      onNext={handleNext}
      nextDisabled={!draftsStore.lat || !draftsStore.lng}
    >
      <div className="flex flex-col gap-3 h-full">
        <p className="text-sm text-text-secondary">
          Tap the map to select the location, or use your current location.
        </p>

        <button
          onClick={handleUseMyLocation}
          disabled={!latitude || !longitude}
          className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg text-sm font-medium text-accent disabled:opacity-50 self-start"
        >
          <Crosshair className="w-4 h-4" />
          Use My Location
        </button>

        <div className="flex-1 min-h-[300px] rounded-lg overflow-hidden">
          <InteractiveMap
            initialCenter={
              latitude && longitude
                ? [latitude, longitude]
                : [51.505, -0.09]
            }
            selectedLocation={selectedLocation}
            userLocation={userLocation}
            onLocationSelect={handleLocationSelect}
          />
        </div>

        {selectedLocation && (
          <p className="text-xs text-text-secondary text-center">
            {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
          </p>
        )}
      </div>
    </WizardLayout>
  );
});

export default MapSelect;
