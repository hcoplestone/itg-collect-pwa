import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useDraftsStore } from '@/stores';
import { useToast } from '@/hooks/useToast';
import { useGeolocation } from '@/hooks/useGeolocation';
import { InteractiveMap } from '@/components/maps/InteractiveMap';
import { WizardLayout } from '@/components/entries/WizardLayout';
import { Crosshair } from 'lucide-react';

const MapSelect = observer(function MapSelect() {
  const navigate = useNavigate();
  const draftsStore = useDraftsStore();
  const toast = useToast();
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
      toast.warning('Please select a location on the map');
      return;
    }
    navigate('/create-entry/location', { state: { direction: 1 } });
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
      nextLabel="Select Location →"
      nextDisabled={!draftsStore.lat || !draftsStore.lng}
      fullBleed
    >
      <div className="flex flex-col h-full relative">
        <div className="flex-1 overflow-hidden">
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

        <button
          onClick={handleUseMyLocation}
          disabled={!latitude || !longitude}
          className="absolute bottom-4 right-4 z-10 flex items-center gap-2 px-4 py-2 bg-secondary rounded-full shadow-md text-sm font-medium text-accent disabled:opacity-50"
        >
          <Crosshair className="w-4 h-4" />
          Use My Location
        </button>
      </div>
    </WizardLayout>
  );
});

export default MapSelect;
