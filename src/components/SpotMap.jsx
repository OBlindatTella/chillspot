// src/components/SpotMap.jsx
// Mappa interattiva con React Leaflet + OpenStreetMap

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { useMemo } from 'react';

// Fix icone leaflet con vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const CATEGORY_COLORS = {
  panoramico: '#5c8a5c',
  silenzioso: '#476da0',
  urbano:     '#bb9660',
  natura:     '#5c8a5c',
  notturno:   '#293b5a',
  tramonto:   '#c9ad82',
  mare:       '#6488b2',
  collina:    '#7da67d',
  chill:      '#8ca9c8',
  default:    '#5c8a5c',
};

const CATEGORY_EMOJI = {
  panoramico: '🏔️', silenzioso: '🤫', urbano: '🏙️',
  natura: '🌿', notturno: '🌙', tramonto: '🌅',
  mare: '🌊', collina: '⛰️', chill: '😌', default: '📍',
};

function createPin(category) {
  const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.default;
  const emoji = CATEGORY_EMOJI[category] || CATEGORY_EMOJI.default;
  const svg = `
    <div style="
      width:36px; height:36px; border-radius:50% 50% 50% 0;
      transform:rotate(-45deg); background:${color};
      display:flex; align-items:center; justify-content:center;
      box-shadow:0 4px 12px rgba(0,0,0,0.5);
      border:2px solid rgba(255,255,255,0.2);
    ">
      <span style="transform:rotate(45deg); font-size:16px; line-height:1;">${emoji}</span>
    </div>
  `;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

// Componente per click sulla mappa (selezione posizione)
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick?.({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

/**
 * Mappa principale con spot
 */
export default function SpotMap({
  spots = [],
  center = [41.9, 12.5],
  zoom = 6,
  height = '400px',
  onMapClick,
  selectedPos,
  mini = false,
}) {
  const markers = useMemo(() =>
    spots.filter(s => s.location?.lat && s.location?.lng),
  [spots]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height, width: '100%', borderRadius: mini ? '12px' : '20px', zIndex: 0 }}
      zoomControl={!mini}
      scrollWheelZoom={!mini}
      dragging={!mini}
      className="leaflet-dark"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {onMapClick && <MapClickHandler onMapClick={onMapClick} />}

      {/* Marker posizione selezionata */}
      {selectedPos && (
        <Marker position={[selectedPos.lat, selectedPos.lng]} icon={createPin('chill')}>
          <Popup>
            <div className="text-sm text-gray-200">
              <strong>Posizione selezionata</strong>
              <br />
              <span className="text-gray-400 text-xs">
                {selectedPos.lat.toFixed(4)}, {selectedPos.lng.toFixed(4)}
              </span>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Spot markers */}
      {markers.map(spot => (
        <Marker
          key={spot.id}
          position={[spot.location.lat, spot.location.lng]}
          icon={createPin(spot.category)}
        >
          <Popup>
            <div style={{ minWidth: '160px' }}>
              <p style={{ fontWeight: 600, marginBottom: 4, color: '#e6ede6' }}>
                {spot.title}
              </p>
              {spot.imageUrls?.[0] && (
                <img
                  src={spot.imageUrls[0]}
                  alt={spot.title}
                  style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }}
                />
              )}
              <p style={{ fontSize: 12, color: '#8ca9c8', marginBottom: 8 }}>
                {spot.description?.slice(0, 60)}...
              </p>
              <a
                href={`/spot/${spot.id}`}
                style={{
                  display: 'inline-block',
                  background: '#5c8a5c',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  textDecoration: 'none',
                }}
              >
                Vedi spot →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
