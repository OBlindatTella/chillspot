// src/components/SpotCard.jsx
import { Link } from 'react-router-dom';
import { calcChillScore, assignBadges } from '../utils/anonymousUtils';

const CATEGORY_EMOJI = {
  panoramico: '🏔️',
  silenzioso: '🤫',
  urbano: '🏙️',
  natura: '🌿',
  notturno: '🌙',
  tramonto: '🌅',
  mare: '🌊',
  collina: '⛰️',
  chill: '😌',
};

export default function SpotCard({ spot, compact = false }) {
  const chillScore = calcChillScore(spot.calmRating, spot.viewRating, spot.safetyRating);
  const badges = assignBadges(spot);
  const emoji = CATEGORY_EMOJI[spot.category] || '📍';
  const mainImg = spot.imageUrls?.[0];

  return (
    <Link to={`/spot/${spot.id}`} className="block group">
      <article className={`card ${compact ? 'h-48' : 'h-64 md:h-72'} relative overflow-hidden`}>
        {/* Immagine di sfondo */}
        {mainImg ? (
          <img
            src={mainImg}
            alt={spot.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-5xl"
            style={{
              background: `linear-gradient(135deg, #1c2633 0%, #243040 100%)`,
            }}
          >
            {emoji}
          </div>
        )}

        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/95 via-dark-900/30 to-transparent" />

        {/* Contenuto */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          {/* Top: badge */}
          <div className="flex items-start justify-between">
            <div className="flex flex-wrap gap-1">
              {badges.slice(0, 2).map(b => (
                <span
                  key={b.id}
                  className="badge bg-dark-800/80 text-gray-300 backdrop-blur-sm"
                >
                  {b.emoji} {b.label}
                </span>
              ))}
            </div>
            {chillScore && (
              <div className="glass rounded-xl px-2.5 py-1 flex items-center gap-1">
                <span className="text-sage-400 text-xs font-bold">{chillScore}</span>
                <span className="text-gray-500 text-xs">/10</span>
              </div>
            )}
          </div>

          {/* Bottom: info */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{emoji}</span>
              {spot.category && (
                <span className="text-xs text-gray-400 capitalize">{spot.category}</span>
              )}
            </div>
            <h3 className="font-display text-white font-medium text-lg leading-tight line-clamp-2 mb-2">
              {spot.title}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{spot.createdByName || 'Wanderer'}</span>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>♥ {spot.likesCount || 0}</span>
                <span>🔖 {spot.savedCount || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

// Skeleton loading card
export function SpotCardSkeleton() {
  return (
    <div className="card h-64 md:h-72 overflow-hidden">
      <div className="skeleton w-full h-full" />
    </div>
  );
}
