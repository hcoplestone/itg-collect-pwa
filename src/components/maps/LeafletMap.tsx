import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Entry } from '@/types';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const userIcon = L.divIcon({
  html: '<div style="width:14px;height:14px;background:#3880ff;border:3px solid white;border-radius:50%;box-shadow:0 0 6px rgba(0,0,0,0.3);"></div>',
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const entryIcon = L.divIcon({
  html: '<div style="width:12px;height:12px;background:#1D2B28;border:2px solid #93C2C3;border-radius:50%;box-shadow:0 0 4px rgba(0,0,0,0.2);"></div>',
  className: '',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

interface MapCenterUpdaterProps {
  center: [number, number];
  zoom?: number;
}

function MapCenterUpdater({ center, zoom }: MapCenterUpdaterProps) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom || map.getZoom());
  }, [center, zoom, map]);
  return null;
}

function MapClickHandler({ onClick }: { onClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick?.(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface LeafletMapProps {
  entries?: Entry[];
  center?: [number, number];
  zoom?: number;
  userLocation?: { lat: number; lng: number } | null;
  onEntryClick?: (entry: Entry) => void;
  onMapClick?: (lat: number, lng: number) => void;
  className?: string;
}

export function LeafletMap({
  entries = [],
  center = [51.505, -0.09],
  zoom = 13,
  userLocation,
  onEntryClick,
  onMapClick,
  className = '',
}: LeafletMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={`w-full h-full ${className}`}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapCenterUpdater center={center} zoom={zoom} />
      {onMapClick && <MapClickHandler onClick={onMapClick} />}

      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>Your location</Popup>
        </Marker>
      )}

      {entries.map((entry) => (
        <Marker
          key={entry.id}
          position={[entry.lat, entry.lng]}
          icon={entryIcon}
          eventHandlers={{
            click: () => onEntryClick?.(entry),
          }}
        >
          <Popup>
            <div className="text-sm">
              <strong>{entry.name}</strong>
              <br />
              <span className="text-gray-500 capitalize">{entry.category}</span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
