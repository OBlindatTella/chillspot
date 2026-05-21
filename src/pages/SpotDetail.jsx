// src/pages/SpotDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getSpot,
  toggleLike,
  toggleSave,
  reportSpot,
  addComment,
  getComments,
} from '../utils/firestoreUtils';
import { calcChillScore, assignBadges } from '../utils/anonymousUtils';
import SpotMap from '../components/SpotMap';
import RatingBadge from '../components/RatingBadge';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

export default function SpotDetail() {
  const { id } = useParams();
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [sendingComment, setSendingComment] = useState(false);

  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSpot(id);
        if (!data) { navigate('/dashboard'); return; }
        setSpot(data);
        setLikeCount(data.likesCount || 0);
        setIsLiked(data.likedBy?.includes(user?.uid));
        setIsSaved(profile?.savedSpots?.includes(id));
        const c = await getComments(id);
        setComments(c);
      } catch (e) {
        toast.error('Errore nel caricamento dello spot.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user, profile]);

  const handleLike = async () => {
    if (!user) return;
    const next = !isLiked;
    setIsLiked(next);
    setLikeCount(c => c + (next ? 1 : -1));
    await toggleLike(id, user.uid, isLiked);
  };

  const handleSave = async () => {
    if (!user) return;
    const next = !isSaved;
    setIsSaved(next);
    await toggleSave(id, user.uid, isSaved);
    await refreshProfile();
    toast(next ? 'Spot salvato nella tua mappa segreta. 🔖' : 'Spot rimosso dai salvati.', {
      icon: next ? '🔖' : '✕',
    });
  };

  const handleReport = async () => {
    if (!reportReason) { toast.error('Scegli un motivo.'); return; }
    await reportSpot(id, user.uid, reportReason);
    toast('Grazie per mantenere ChillSpot sicuro. 🛡️');
    setShowReport(false);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (commentText.length > 300) { toast.error('Commento troppo lungo.'); return; }
    setSendingComment(true);
    try {
      await addComment(id, user.uid, profile.anonymousName, commentText.trim());
      const fresh = await getComments(id);
      setComments(fresh);
      setCommentText('');
    } catch {
      toast.error('Errore nell\'invio del commento.');
    } finally {
      setSendingComment(false);
    }
  };

  if (loading) return <DetailSkeleton />;
  if (!spot) return null;

  const chillScore = calcChillScore(spot.calmRating, spot.viewRating, spot.safetyRating);
  const badges = assignBadges(spot);
  const images = spot.imageUrls || [];
  const hasMap = spot.location?.lat && spot.location?.lng;

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-3xl mx-auto">
        {/* ── Immagine principale ───────────────────────────────────── */}
        <div className="relative h-64 md:h-96 bg-dark-800 overflow-hidden">
          {images.length > 0 ? (
            <>
              <img
                src={images[imgIdx]}
                alt={spot.title}
                className="w-full h-full object-cover animate-fade-in"
                key={imgIdx}
              />
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                        i === imgIdx ? 'bg-white w-4' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-dark-800 to-dark-700">
              🌿
            </div>
          )}
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 to-transparent pointer-events-none" />

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 glass rounded-full w-9 h-9 flex items-center justify-center text-white text-sm hover:bg-white/10 transition-all"
          >
            ←
          </button>

          {/* Chill Score badge */}
          {chillScore && (
            <div className="absolute top-4 right-4 glass rounded-xl px-3 py-1.5 flex items-center gap-1.5">
              <span className="text-sage-400 font-bold text-sm">{chillScore}</span>
              <span className="text-gray-500 text-xs">/10</span>
            </div>
          )}
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* ── Badges ───────────────────────────────────────────────── */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {badges.map(b => (
                <span key={b.id} className="badge bg-dark-700 text-gray-300 border border-white/8">
                  {b.emoji} {b.label}
                </span>
              ))}
            </div>
          )}

          {/* ── Titolo e meta ─────────────────────────────────────────── */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {spot.category && (
                <span className="badge bg-sage-500/15 text-sage-400 text-xs capitalize">
                  {spot.category}
                </span>
              )}
              {spot.vibe && (
                <span className="text-xs text-gray-500">{spot.vibe}</span>
              )}
            </div>
            <h1 className="font-display text-2xl md:text-3xl text-white leading-tight">
              {spot.title}
            </h1>
            <p className="text-xs text-gray-600 mt-2">
              Pubblicato da <span className="text-gray-500">{spot.createdByName}</span>
              {spot.createdAt?.toDate && ` · ${formatDistanceToNow(spot.createdAt.toDate(), { addSuffix: true, locale: it })}`}
            </p>
          </div>

          {/* ── Descrizione ───────────────────────────────────────────── */}
          <p className="text-gray-300 leading-relaxed">
            {spot.description}
          </p>

          {/* ── Actions ──────────────────────────────────────────────── */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all duration-200 active:scale-95 ${
                isLiked
                  ? 'bg-red-500/15 border-red-500/40 text-red-400'
                  : 'glass text-gray-400 hover:text-white hover:border-white/20'
              }`}
            >
              <span>{isLiked ? '♥' : '♡'}</span>
              <span className="text-sm">{likeCount}</span>
            </button>

            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all duration-200 active:scale-95 ${
                isSaved
                  ? 'bg-sage-500/15 border-sage-500/40 text-sage-400'
                  : 'glass text-gray-400 hover:text-white hover:border-white/20'
              }`}
            >
              <span>{isSaved ? '🔖' : '🏷️'}</span>
              <span className="text-sm">{isSaved ? 'Salvato' : 'Salva'}</span>
            </button>

            <button
              onClick={() => setShowReport(!showReport)}
              className="ml-auto text-gray-600 hover:text-gray-400 text-sm transition-colors flex items-center gap-1"
            >
              ⚑ Segnala
            </button>
          </div>

          {/* Report form */}
          {showReport && (
            <div className="glass rounded-2xl p-4 space-y-3 animate-slide-down">
              <p className="text-sm text-gray-300 font-medium">Motivo della segnalazione</p>
              <select
                value={reportReason}
                onChange={e => setReportReason(e.target.value)}
                className="input-field text-sm"
              >
                <option value="">Scegli...</option>
                <option value="pericoloso">Luogo pericoloso</option>
                <option value="privato">Proprietà privata</option>
                <option value="falso">Informazioni false</option>
                <option value="inappropriato">Contenuto inappropriato</option>
                <option value="spam">Spam</option>
              </select>
              <button onClick={handleReport} className="btn-primary text-sm py-2">
                Invia segnalazione
              </button>
            </div>
          )}

          {/* ── Info spot ────────────────────────────────────────────── */}
          <div className="glass rounded-3xl p-5 space-y-3">
            <h3 className="text-sm text-gray-400 font-medium mb-4">Info spot</h3>
            <div className="grid grid-cols-2 gap-4">
              <RatingBadge type="calm" value={spot.calmRating} />
              <RatingBadge type="view" value={spot.viewRating} />
              <RatingBadge type="safety" value={spot.safetyRating} />
              {spot.bestTime && (
                <div className="flex items-center gap-2">
                  <span className="text-sm">⏰</span>
                  <div>
                    <p className="text-xs text-gray-500 leading-none mb-0.5">Orario</p>
                    <p className="text-sm text-gray-300">{spot.bestTime}</p>
                  </div>
                </div>
              )}
              {spot.accessibility && (
                <div className="flex items-center gap-2">
                  <span className="text-sm">🥾</span>
                  <div>
                    <p className="text-xs text-gray-500 leading-none mb-0.5">Accessibilità</p>
                    <p className="text-sm text-gray-300 capitalize">{spot.accessibility}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Tags ─────────────────────────────────────────────────── */}
          {spot.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {spot.tags.map(t => (
                <span key={t} className="badge bg-dark-700 text-gray-500 border border-white/5 text-xs">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* ── Mappa ─────────────────────────────────────────────────── */}
          {hasMap && (
            <div>
              <h3 className="text-sm text-gray-400 font-medium mb-3">
                Posizione
                {spot.location.isApproximate && (
                  <span className="ml-2 badge bg-dark-700 text-gray-500 text-xs">
                    🌫️ Approssimata
                  </span>
                )}
              </h3>
              <SpotMap
                spots={[spot]}
                center={[spot.location.lat, spot.location.lng]}
                zoom={13}
                height="220px"
                mini
              />
            </div>
          )}

          {/* ── Commenti ─────────────────────────────────────────────── */}
          <div className="space-y-4">
            <h3 className="text-sm text-gray-400 font-medium">
              Commenti {comments.length > 0 && `(${comments.length})`}
            </h3>

            {comments.length === 0 && (
              <p className="text-gray-600 text-sm">Nessun commento ancora. Sii il primo.</p>
            )}

            {comments.map(c => (
              <div key={c.id} className="glass-light rounded-2xl p-3">
                <p className="text-xs text-gray-500 mb-1">{c.anonymousName}</p>
                <p className="text-sm text-gray-300">{c.text}</p>
              </div>
            ))}

            {/* Aggiungi commento */}
            <form onSubmit={handleComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Aggiungi un commento anonimo..."
                maxLength={300}
                className="input-field text-sm flex-1 py-2.5"
              />
              <button
                type="submit"
                disabled={sendingComment || !commentText.trim()}
                className="btn-primary text-sm py-2.5 px-4 disabled:opacity-40"
              >
                →
              </button>
            </form>
          </div>

          {/* Disclaimer */}
          <div className="glass-light rounded-2xl p-4 border border-white/4">
            <p className="text-xs text-gray-600 leading-relaxed">
              🛡️ Questo luogo è stato condiviso dalla community in buona fede.
              Verifica sempre le condizioni di accesso prima di visitarlo.
              Rispetta la natura e le comunità locali.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-dark-900 max-w-3xl mx-auto">
      <div className="skeleton h-64 md:h-96 w-full" />
      <div className="px-4 py-6 space-y-4">
        <div className="skeleton h-4 w-24 rounded-full" />
        <div className="skeleton h-8 w-3/4 rounded-xl" />
        <div className="skeleton h-4 w-full rounded-xl" />
        <div className="skeleton h-4 w-5/6 rounded-xl" />
      </div>
    </div>
  );
}
