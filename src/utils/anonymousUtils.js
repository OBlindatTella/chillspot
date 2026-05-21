// src/utils/anonymousUtils.js
// Genera nomi e avatar anonimi per gli utenti

const ADJECTIVES = [
  'Quiet', 'Wandering', 'Night', 'Still', 'Lost', 'Drifting', 'Silent',
  'Calm', 'Hidden', 'Distant', 'Sleepy', 'Gentle', 'Wild', 'Lone',
  'Misty', 'Fading', 'Golden', 'Dark', 'Hollow', 'Wander',
];

const NOUNS = [
  'Fox', 'Cloud', 'Sage', 'Echo', 'River', 'Stone', 'Moth', 'Crow',
  'Willow', 'Creek', 'Petal', 'Mist', 'Wave', 'Peak', 'Vale', 'Bloom',
  'Frost', 'Gale', 'Dusk', 'Dawn', 'Pine', 'Reed',
];

const AVATAR_GRADIENTS = [
  ['#5c8a5c', '#2e3d50'],
  ['#476da0', '#283c28'],
  ['#bb9660', '#2e3d50'],
  ['#5c8a5c', '#476da0'],
  ['#a8c4a8', '#2e3d50'],
  ['#6488b2', '#3a593a'],
  ['#7da67d', '#293b5a'],
  ['#c9ad82', '#293b5a'],
  ['#8ca9c8', '#283c28'],
  ['#ccdccc', '#243040'],
];

const AVATAR_EMOJIS = ['🌿', '🌙', '🌊', '🏔️', '🌲', '🌾', '🪨', '🍃', '🌫️', '🌅'];

/**
 * Genera un nome anonimo tipo "QuietFox_482"
 */
export function generateAnonymousName() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 900) + 100;
  return `${adj}${noun}_${num}`;
}

/**
 * Genera uno stile avatar con gradiente ed emoji
 */
export function generateAvatarStyle() {
  const gradient = AVATAR_GRADIENTS[Math.floor(Math.random() * AVATAR_GRADIENTS.length)];
  const emoji = AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)];
  return { gradient, emoji };
}

/**
 * Calcola il Chill Score da 0 a 10
 */
export function calcChillScore(calm, view, safety) {
  if (!calm && !view && !safety) return null;
  const c = calm || 3;
  const v = view || 3;
  const s = safety || 3;
  return ((c * 0.4 + v * 0.35 + s * 0.25) * 2).toFixed(1);
}

/**
 * Assegna badge automatici in base alle proprietà dello spot
 */
export function assignBadges(spot) {
  const badges = [];

  if (spot.likesCount < 10 && spot.savedCount < 5) {
    badges.push({ id: 'hidden-gem', label: 'Hidden Gem', emoji: '💎' });
  }

  const vibe = (spot.vibe || '').toLowerCase();
  const tags = (spot.tags || []).map(t => t.toLowerCase());
  const bestTime = (spot.bestTime || '').toLowerCase();

  if (vibe.includes('tramonto') || tags.includes('tramonto') || bestTime.includes('tramonto') || bestTime.includes('sera')) {
    badges.push({ id: 'sunset', label: 'Sunset Spot', emoji: '🌅' });
  }

  if (vibe.includes('nott') || tags.includes('notte') || bestTime.includes('notte') || bestTime.includes('nott')) {
    badges.push({ id: 'night', label: 'Night Chill', emoji: '🌙' });
  }

  if ((spot.calmRating || 0) >= 4) {
    badges.push({ id: 'peaceful', label: 'Peaceful', emoji: '🌿' });
  }

  if ((spot.category || '').toLowerCase().includes('urban') || tags.includes('urbano') || tags.includes('città')) {
    badges.push({ id: 'urban', label: 'Urban Escape', emoji: '🏙️' });
  }

  return badges;
}

/**
 * Formatta distanza in km o m
 */
export function formatDistance(meters) {
  if (!meters) return null;
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * Calcola distanza in metri tra due coordinate
 */
export function getDistanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
