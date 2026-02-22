import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const selectedIcon = L.divIcon({
  html: '<div style="width:20px;height:20px;background:#1D2B28;border:3px solid #93C2C3;border-radius:50%;box-shadow:0 0 8px rgba(0,0,0,0.3);"></div>',
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const userIcon = L.divIcon({
  html: '<div style="width:14px;height:14px;background:#3880ff;border:3px solid white;border-radius:50%;box-shadow:0 0 6px rgba(0,0,0,0.3);"></div>',
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

interface MapClickHandlerProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

function MapClickHandler({ onLocationSelect }: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface MapCenterUpdaterProps {
  center: [number, number];
}

function MapCenterUpdater({ center }: MapCenterUpdaterProps) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface InteractiveMapProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  selectedLocation?: { lat: number; lng: number } | null;
  userLocation?: { lat: number; lng: number } | null;
  onLocationSelect: (lat: number, lng: number) => void;
  className?: string;
}

export function InteractiveMap({
  initialCenter = [51.505, -0.09],
  initialZoom = 15,
  selectedLocation,
  userLocation,
  onLocationSelect,
  className = '',
}: InteractiveMapProps) {
  const [center, setCenter] = useState(initialCenter);

  useEffect(() => {
    if (userLocation && !selectedLocation) {
      setCenter([userLocation.lat, userLocation.lng]);
    }
  }, [userLocation, selectedLocation]);

  useEffect(() => {
    if (selectedLocation) {
      setCenter([selectedLocation.lat, selectedLocation.lng]);
    }
  }, [selectedLocation]);

  return (
    <MapContainer
      center={center}
      zoom={initialZoom}
      className={`w-full h-full ${className}`}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClickHandler onLocationSelect={onLocationSelect} />
      <MapCenterUpdater center={center} />

      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />
      )}

      {selectedLocation && (
        <Marker
          position={[selectedLocation.lat, selectedLocation.lng]}
          icon={selectedIcon}
          draggable={true}
          eventHandlers={{
            dragend(e) {
              const marker = e.target;
              const pos = marker.getLatLng();
              onLocationSelect(pos.lat, pos.lng);
            },
          }}
        />
      )}
    </MapContainer>
  );
}
