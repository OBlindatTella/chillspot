// src/components/RatingBadge.jsx

const RATINGS = {
  calm:   { label: 'Tranquillità', emoji: '🤫', color: 'text-sage-400' },
  view:   { label: 'Panorama',     emoji: '🏔️', color: 'text-night-400' },
  safety: { label: 'Sicurezza',    emoji: '🛡️', color: 'text-warm-400' },
};

function StarRow({ value, max = 5, color }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`text-xs transition-opacity ${
            i < value ? `${color} opacity-100` : 'opacity-20 text-gray-500'
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function RatingBadge({ type, value }) {
  const r = RATINGS[type];
  if (!r || !value) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{r.emoji}</span>
      <div>
        <p className="text-xs text-gray-500 leading-none mb-0.5">{r.label}</p>
        <StarRow value={value} color={r.color} />
      </div>
    </div>
  );
}

// Rating input interattivo
export function RatingInput({ label, emoji, value, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span>{emoji}</span>
        <span className="text-sm text-gray-300">{label}</span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`text-xl transition-all duration-150 hover:scale-110 ${
              n <= value ? 'text-sage-400' : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}
