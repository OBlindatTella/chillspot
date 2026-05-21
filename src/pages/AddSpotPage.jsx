// src/pages/AddSpotPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createSpot } from '../utils/firestoreUtils';
import { uploadImages } from '../utils/imageUtils';
import ImageUploader from '../components/ImageUploader';
import SpotMap from '../components/SpotMap';
import { RatingInput } from '../components/RatingBadge';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'panoramico', label: 'Panoramico', emoji: '🏔️' },
  { id: 'silenzioso', label: 'Silenzioso', emoji: '🤫' },
  { id: 'urbano', label: 'Urbano', emoji: '🏙️' },
  { id: 'natura', label: 'Natura', emoji: '🌿' },
  { id: 'notturno', label: 'Notturno', emoji: '🌙' },
  { id: 'tramonto', label: 'Tramonto', emoji: '🌅' },
  { id: 'mare', label: 'Mare', emoji: '🌊' },
  { id: 'collina', label: 'Collina', emoji: '⛰️' },
  { id: 'chill', label: 'Ammacchiato ma chill', emoji: '😌' },
];

const VIBES = [
  'Silenzio assoluto', 'Vento e cielo', 'Vista oceano', 'Tramonto infinito',
  'Bosco silenzioso', 'Cielo stellato', 'Alba da soli', 'Urban solitude',
  'Aura di pace', 'Confine del mondo',
];

const BEST_TIMES = [
  'Alba', 'Mattina presto', 'Mezzogiorno', 'Pomeriggio', 'Tramonto', 'Sera', 'Notte', 'Sempre',
];

const ACCESSIBILITY = [
  { id: 'facile', label: 'Facile', emoji: '🟢' },
  { id: 'media', label: 'Media', emoji: '🟡' },
  { id: 'difficile', label: 'Difficile', emoji: '🔴' },
];

export default function AddSpotPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    vibe: '',
    tags: '',
    bestTime: '',
    accessibility: 'facile',
    calmRating: 3,
    viewRating: 3,
    safetyRating: 3,
    hideExact: false,
  });

  const [files, setFiles] = useState([]);
  const [location, setLocation] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1=info, 2=media, 3=location

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    if (!form.title.trim()) return 'Inserisci un titolo.';
    if (form.title.length > 80) return 'Titolo troppo lungo (max 80 caratteri).';
    if (!form.description.trim()) return 'Inserisci una descrizione.';
    if (!form.category) return 'Scegli una categoria.';
    if (!location) return 'Seleziona la posizione sulla mappa.';
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { toast.error(err); return; }

    setSubmitting(true);
    const tmpId = `${user.uid}_${Date.now()}`;

    try {
      let imageUrls = [];
if (files.length) {
  try {
    toast('Caricamento foto in corso...', { icon: '📷' });
    imageUrls = await uploadImages(files, user.uid, tmpId);
  } catch (uploadErr) {
    console.warn('Upload foto fallito, pubblico senza immagini:', uploadErr);
    toast('Foto non caricate, spot pubblicato senza immagini.', { icon: '⚠️' });
  }
}

      const tags = form.tags
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(Boolean);

      await createSpot(
        {
          title: form.title.trim(),
          description: form.description.trim(),
          category: form.category,
          vibe: form.vibe,
          tags,
          imageUrls,
          location: {
            lat: location.lat,
            lng: location.lng,
            isApproximate: form.hideExact,
            radius: form.hideExact ? 500 : 0,
          },
          calmRating: form.calmRating,
          viewRating: form.viewRating,
          safetyRating: form.safetyRating,
          bestTime: form.bestTime,
          accessibility: form.accessibility,
        },
        user.uid,
        profile.anonymousName
      );

      toast.success('Spot pubblicato! Grazie per aver arricchito la community. 🌿');
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
      toast.error('Errore durante la pubblicazione. Riprova.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-300 text-sm mb-4 flex items-center gap-1">
            ← Indietro
          </button>
          <h1 className="font-display text-3xl text-white">Aggiungi uno spot</h1>
          <p className="text-gray-500 text-sm mt-1">Condividi un luogo accessibile e sicuro.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map(n => (
            <div key={n} className="flex items-center gap-2">
              <button
                onClick={() => setStep(n)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-all duration-200 ${
                  step === n ? 'bg-sage-500 text-white' :
                  step > n ? 'bg-sage-800 text-sage-400' :
                  'bg-dark-700 text-gray-500'
                }`}
              >
                {step > n ? '✓' : n}
              </button>
              {n < 3 && <div className={`flex-1 h-px w-12 ${step > n ? 'bg-sage-700' : 'bg-dark-700'}`} />}
            </div>
          ))}
          <div className="ml-2 text-xs text-gray-500">
            {step === 1 ? 'Informazioni' : step === 2 ? 'Foto' : 'Posizione'}
          </div>
        </div>

        {/* ── Step 1: Informazioni ──────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-5 animate-slide-up">
            {/* Titolo */}
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Titolo *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => update('title', e.target.value)}
                placeholder="Un posto che hai trovato per caso..."
                maxLength={80}
                className="input-field"
              />
              <p className="text-right text-xs text-gray-600 mt-1">{form.title.length}/80</p>
            </div>

            {/* Descrizione */}
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Descrizione *</label>
              <textarea
                value={form.description}
                onChange={e => update('description', e.target.value)}
                placeholder="Descrivi l'atmosfera, come ci si arriva, cosa si vede..."
                maxLength={500}
                rows={4}
                className="input-field resize-none"
              />
              <p className="text-right text-xs text-gray-600 mt-1">{form.description.length}/500</p>
            </div>

            {/* Categoria */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Categoria *</label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => update('category', c.id)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-2xl border text-xs font-medium transition-all duration-200 ${
                      form.category === c.id
                        ? 'border-sage-500 bg-sage-500/15 text-sage-300'
                        : 'border-white/8 hover:border-white/20 text-gray-400'
                    }`}
                  >
                    <span className="text-xl">{c.emoji}</span>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Vibe */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Vibe</label>
              <div className="flex flex-wrap gap-2">
                {VIBES.map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => update('vibe', form.vibe === v ? '' : v)}
                    className={`badge border transition-all duration-200 ${
                      form.vibe === v
                        ? 'bg-night-800/50 text-night-300 border-night-600'
                        : 'border-white/8 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Tags (separati da virgola)</label>
              <input
                type="text"
                value={form.tags}
                onChange={e => update('tags', e.target.value)}
                placeholder="tramonto, silenzio, vista, nascosto..."
                className="input-field"
              />
            </div>

            {/* Rating */}
            <div className="glass rounded-2xl p-4 space-y-4">
              <h3 className="text-sm text-gray-300 font-medium">Rating del posto</h3>
              <RatingInput label="Tranquillità" emoji="🤫" value={form.calmRating} onChange={v => update('calmRating', v)} />
              <RatingInput label="Panorama" emoji="🏔️" value={form.viewRating} onChange={v => update('viewRating', v)} />
              <RatingInput label="Sicurezza" emoji="🛡️" value={form.safetyRating} onChange={v => update('safetyRating', v)} />
            </div>

            {/* Best time + accessibility */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Orario migliore</label>
                <select
                  value={form.bestTime}
                  onChange={e => update('bestTime', e.target.value)}
                  className="input-field"
                >
                  <option value="">Qualsiasi</option>
                  {BEST_TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Accessibilità</label>
                <div className="flex gap-2">
                  {ACCESSIBILITY.map(a => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => update('accessibility', a.id)}
                      className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border text-xs transition-all ${
                        form.accessibility === a.id
                          ? 'border-sage-500 bg-sage-500/10 text-sage-300'
                          : 'border-white/8 text-gray-500 hover:border-white/20'
                      }`}
                    >
                      <span>{a.emoji}</span>
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="glass-light rounded-2xl p-4 border border-warm-700/15">
              <p className="text-xs text-gray-500 leading-relaxed">
                🛡️ <strong className="text-gray-400">Condividi solo luoghi accessibili legalmente e in sicurezza.</strong>{' '}
                Non pubblicare luoghi su proprietà private, aree con divieto d'accesso o posti pericolosi.
                I contenuti inappropriati verranno rimossi.
              </p>
            </div>

            <button onClick={() => setStep(2)} className="btn-primary w-full justify-center flex">
              Avanti: Foto →
            </button>
          </div>
        )}

        {/* ── Step 2: Foto ─────────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-5 animate-slide-up">
            <ImageUploader files={files} onChange={setFiles} />
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center flex">
                ← Indietro
              </button>
              <button onClick={() => setStep(3)} className="btn-primary flex-1 justify-center flex">
                Avanti: Posizione →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Posizione ─────────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-5 animate-slide-up">
            <div>
              <p className="text-sm text-gray-400 mb-3">
                Clicca sulla mappa per selezionare la posizione dello spot.
              </p>
              <SpotMap
                spots={[]}
                center={[41.9, 12.5]}
                zoom={6}
                height="350px"
                onMapClick={setLocation}
                selectedPos={location}
              />
              {location && (
                <p className="text-xs text-sage-400 mt-2 flex items-center gap-1.5">
                  ✓ Posizione selezionata: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              )}
            </div>

            {/* Toggle privacy */}
            <button
              type="button"
              onClick={() => update('hideExact', !form.hideExact)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                form.hideExact ? 'border-sage-500/40 bg-sage-500/10' : 'border-white/8 hover:border-white/15'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🌫️</span>
                <div className="text-left">
                  <p className="text-sm text-white font-medium">Nascondi posizione precisa</p>
                  <p className="text-xs text-gray-500">La posizione sarà approssimata a ~500m</p>
                </div>
              </div>
              <div className={`w-10 h-6 rounded-full transition-all duration-200 relative ${
                form.hideExact ? 'bg-sage-500' : 'bg-dark-600'
              }`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${
                  form.hideExact ? 'left-5' : 'left-1'
                }`} />
              </div>
            </button>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-secondary flex-1 justify-center flex">
                ← Indietro
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !location}
                className="btn-primary flex-1 justify-center flex items-center gap-2 disabled:opacity-50"
              >
                {submitting && (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Pubblica spot 🌿
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
