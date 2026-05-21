// src/components/FilterBar.jsx
import { useState } from 'react';

const FILTERS = [
  { id: 'all', label: 'Tutti', emoji: '✦' },
  { id: 'panoramico', label: 'Panoramico', emoji: '🏔️' },
  { id: 'silenzioso', label: 'Silenzioso', emoji: '🤫' },
  { id: 'urbano', label: 'Urbano', emoji: '🏙️' },
  { id: 'natura', label: 'Natura', emoji: '🌿' },
  { id: 'notturno', label: 'Notturno', emoji: '🌙' },
  { id: 'tramonto', label: 'Tramonto', emoji: '🌅' },
  { id: 'mare', label: 'Mare', emoji: '🌊' },
  { id: 'collina', label: 'Collina', emoji: '⛰️' },
  { id: 'chill', label: 'Chill', emoji: '😌' },
];

const SORT_OPTIONS = [
  { id: 'createdAt', label: 'Recenti' },
  { id: 'likesCount', label: 'Più amati' },
  { id: 'savedCount', label: 'Più salvati' },
  { id: 'calmRating', label: 'Più tranquilli' },
];

export default function FilterBar({ onFilterChange, onSortChange, onSearch }) {
  const [active, setActive] = useState('all');
  const [sort, setSort] = useState('createdAt');
  const [search, setSearch] = useState('');

  const handleFilter = (id) => {
    setActive(id);
    onFilterChange?.(id === 'all' ? null : id);
  };

  const handleSort = (e) => {
    setSort(e.target.value);
    onSortChange?.(e.target.value);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <div className="space-y-3">
      {/* Search + Sort */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Cerca uno spot..."
            className="input-field pl-9 py-2.5 text-sm"
          />
        </div>
        <select
          value={sort}
          onChange={handleSort}
          className="input-field py-2.5 text-sm w-36 cursor-pointer"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => handleFilter(f.id)}
            className={`flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
              active === f.id
                ? 'bg-sage-500 text-white shadow-glow-sage'
                : 'glass text-gray-400 hover:text-white hover:border-white/15'
            }`}
          >
            <span>{f.emoji}</span>
            <span>{f.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
