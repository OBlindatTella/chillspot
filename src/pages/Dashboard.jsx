// src/pages/Dashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SpotCard, { SpotCardSkeleton } from '../components/SpotCard';
import FilterBar from '../components/FilterBar';
import SpotMap from '../components/SpotMap';
import { getSpots, getRandomSpot } from '../utils/firestoreUtils';
import { getDistanceMeters } from '../utils/anonymousUtils';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const VIEWS = ['grid', 'map'];

export default function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [filter, setFilter] = useState(null);
  const [sort, setSort] = useState('createdAt');
  const [search, setSearch] = useState('');
  const [userPos, setUserPos] = useState(null);

  const loadSpots = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSpots({ category: filter || undefined, orderField: sort });
      setSpots(data);
    } catch (err) {
      toast.error('Errore nel caricamento degli spot.');
    } finally {
      setLoading(false);
    }
  }, [filter, sort]);

  useEffect(() => { loadSpots(); }, [loadSpots]);

  // Filtro ricerca lato client
  const displayed = spots.filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.title?.toLowerCase().includes(q) ||
      s.description?.toLowerCase().includes(q) ||
      s.tags?.some(t => t.toLowerCase().includes(q)) ||
      s.vibe?.toLowerCase().includes(q)
    );
  });

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalizzazione non supportata.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        toast.success('Posizione ottenuta. Spot ordinati per distanza.');
      },
      () => toast.error('Non riesco a ottenere la posizione.')
    );
  };

  const handleRandom = async () => {
    const spot = await getRandomSpot();
    if (spot) {
      toast('Questo posto sembra perfetto per respirare un attimo. 🌿', { icon: '✦' });
      navigate(`/spot/${spot.id}`);
    } else {
      toast.error('Nessuno spot trovato. Sii il primo ad aggiungerne uno!');
    }
  };

  // Ordina per distanza se "near me" attivo
  const sortedByDistance = userPos
    ? [...displayed].sort((a, b) => {
        const da = a.location?.lat
          ? getDistanceMeters(userPos.lat, userPos.lng, a.location.lat, a.location.lng)
          : Infinity;
        const db_ = b.location?.lat
          ? getDistanceMeters(userPos.lat, userPos.lng, b.location.lat, b.location.lng)
          : Infinity;
        return da - db_;
      })
    : displayed;

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* ── Benvenuto ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-white">
              Ciao, <span className="text-sage-400">{profile?.anonymousName?.split('_')[0]}</span>
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">Dove vuoi respirare oggi?</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRandom}
              className="btn-ghost text-sm flex items-center gap-1.5"
              title="Spot casuale"
            >
              <span>🎲</span>
              <span className="hidden md:inline">Random</span>
            </button>
            <button
              onClick={handleNearMe}
              className={`btn-ghost text-sm flex items-center gap-1.5 ${userPos ? 'text-sage-400' : ''}`}
            >
              <span>📍</span>
              <span className="hidden md:inline">Vicino a me</span>
            </button>
            {/* Toggle view */}
            <div className="glass rounded-xl flex p-0.5">
              {[{ id: 'grid', icon: '⊞' }, { id: 'map', icon: '🗺️' }].map(v => (
                <button
                  key={v.id}
                  onClick={() => setView(v.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                    view === v.id ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {v.icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Filtri ──────────────────────────────────────────────────── */}
        <FilterBar
          onFilterChange={setFilter}
          onSortChange={setSort}
          onSearch={setSearch}
        />

        {/* ── Mappa ───────────────────────────────────────────────────── */}
        {view === 'map' && (
          <div className="animate-fade-in rounded-3xl overflow-hidden">
            <SpotMap
              spots={sortedByDistance}
              center={userPos ? [userPos.lat, userPos.lng] : [41.9, 12.5]}
              zoom={userPos ? 12 : 6}
              height="500px"
            />
          </div>
        )}

        {/* ── Grid spot ───────────────────────────────────────────────── */}
        {view === 'grid' && (
          <div className="animate-fade-in">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <SpotCardSkeleton key={i} />)}
              </div>
            ) : sortedByDistance.length === 0 ? (
              <EmptyState search={search} filter={filter} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedByDistance.map(spot => (
                  <div key={spot.id} className="animate-slide-up">
                    <SpotCard spot={spot} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── FAB mobile ──────────────────────────────────────────────── */}
        <Link
          to="/add"
          className="fixed bottom-24 right-4 md:hidden w-14 h-14 bg-sage-500 rounded-full
                     flex items-center justify-center text-white text-2xl shadow-glow-sage
                     transition-transform active:scale-90 z-40"
        >
          +
        </Link>
      </div>
    </div>
  );
}

function EmptyState({ search, filter }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-5xl mb-4 animate-float">🌫️</span>
      <h3 className="font-display text-xl text-white mb-2">
        {search ? `Nessuno spot per "${search}"` : 'Nessuno spot trovato'}
      </h3>
      <p className="text-gray-500 text-sm max-w-sm">
        {filter
          ? `Non ci sono ancora spot nella categoria "${filter}". Sii il primo a condividerne uno!`
          : 'La community non ha ancora condiviso spot. Inizia tu!'}
      </p>
      <Link to="/add" className="btn-primary mt-6 text-sm">
        + Aggiungi il primo spot
      </Link>
    </div>
  );
}
