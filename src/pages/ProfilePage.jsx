// src/pages/ProfilePage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserSpots, getSavedSpots } from '../utils/firestoreUtils';
import SpotCard, { SpotCardSkeleton } from '../components/SpotCard';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

const TABS = ['I miei spot', 'Salvati'];

export default function ProfilePage() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState(0);
  const [mySpots, setMySpots] = useState([]);
  const [savedSpots, setSavedSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const [mine, saved] = await Promise.all([
          getUserSpots(user.uid),
          getSavedSpots(profile?.savedSpots || []),
        ]);
        setMySpots(mine);
        setSavedSpots(saved);
      } catch {
        toast.error('Errore nel caricamento del profilo.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, profile]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast('Arrivederci. Torna a respirare presto. 🌿');
  };

  const displayed = tab === 0 ? mySpots : savedSpots;
  const gradient = profile?.avatarStyle?.gradient || ['#5c8a5c', '#293b5a'];
  const emoji = profile?.avatarStyle?.emoji || '🌿';

  const joined = profile?.createdAt?.toDate
    ? formatDistanceToNow(profile.createdAt.toDate(), { addSuffix: true, locale: it })
    : 'recentemente';

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* ── Header profilo ────────────────────────────────────────── */}
        <div className="glass rounded-3xl p-6 flex items-start gap-5">
          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl flex-none shadow-soft"
            style={{ background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)` }}
          >
            {emoji}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl text-white truncate">
              {profile?.anonymousName}
            </h1>
            <p className="text-gray-500 text-xs mt-0.5">Membro {joined}</p>

            <div className="flex gap-4 mt-4">
              <Stat label="Spot" value={profile?.totalSpots || 0} />
              <Stat label="Salvati" value={profile?.savedSpots?.length || 0} />
              <Stat label="Reputazione" value={profile?.reputationScore || 0} emoji="⭐" />
            </div>
          </div>
        </div>

        {/* ── Messaggio benvenuto ───────────────────────────────────── */}
        <div className="glass-light rounded-2xl p-4 border border-sage-700/15">
          <p className="text-sm text-gray-400 leading-relaxed">
            🌿 <span className="text-sage-400">{profile?.anonymousName?.split('_')[0]}</span>,
            il tuo profilo è completamente anonimo. Nessun dato personale è visibile agli altri utenti.
          </p>
        </div>

        {/* ── Tabs ─────────────────────────────────────────────────── */}
        <div className="glass rounded-2xl p-1 flex">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                tab === i ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {t} {i === 0 ? `(${mySpots.length})` : `(${savedSpots.length})`}
            </button>
          ))}
        </div>

        {/* ── Contenuto tab ─────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <SpotCardSkeleton key={i} />)}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-4xl block mb-3 animate-float">
              {tab === 0 ? '🌱' : '🔖'}
            </span>
            <p className="text-gray-500 text-sm">
              {tab === 0
                ? 'Non hai ancora pubblicato spot. Condividi il tuo primo posto!'
                : 'Non hai ancora salvato nessuno spot. Esplora la mappa!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayed.map(spot => (
              <SpotCard key={spot.id} spot={spot} compact />
            ))}
          </div>
        )}

        {/* ── Logout ───────────────────────────────────────────────── */}
        <div className="pt-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-2xl border border-red-900/30 text-red-400/70 hover:text-red-400
                       hover:border-red-900/50 hover:bg-red-500/5 transition-all duration-200 text-sm"
          >
            Esci da ChillSpot
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, emoji }) {
  return (
    <div className="text-center">
      <p className="text-lg font-medium text-white">
        {emoji && <span className="mr-1">{emoji}</span>}{value}
      </p>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  );
}
