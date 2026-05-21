// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const FEATURES = [
  {
    emoji: '🗺️',
    title: 'Scopri sulla mappa',
    desc: 'Una mappa interattiva con centinaia di angoli nascosti, panoramici e tranquilli.',
  },
  {
    emoji: '🌿',
    title: 'Condividi in anonimato',
    desc: 'Nessuna email visibile, nessun nome reale. Solo il tuo nickname generato e la tua vibe.',
  },
  {
    emoji: '💎',
    title: 'Trova le gemme nascoste',
    desc: 'Luoghi lontani dal rumore dei social. Posti che si scoprono, non si vendono.',
  },
  {
    emoji: '🛡️',
    title: 'Community responsabile',
    desc: 'Solo luoghi accessibili legalmente. Sistema di report e moderazione automatica.',
  },
];

const SPOT_PREVIEWS = [
  { title: 'Terrazza sul nulla', category: 'panoramico', img: null, score: '9.2', emoji: '🏔️' },
  { title: 'Spiaggia al crepuscolo', category: 'tramonto', img: null, score: '8.8', emoji: '🌅' },
  { title: 'Tetto urbano segreto', category: 'urbano', img: null, score: '7.5', emoji: '🏙️' },
  { title: 'Lago nel bosco', category: 'natura', img: null, score: '9.6', emoji: '🌿' },
  { title: 'Osservatorio di notte', category: 'notturno', img: null, score: '9.0', emoji: '🌙' },
  { title: 'Collina dei venti', category: 'collina', img: null, score: '8.3', emoji: '⛰️' },
];

const BG_GRADIENTS = [
  'from-dark-900 via-[#1a2a1a] to-dark-900',
  'from-[#0d1a2a] via-dark-900 to-[#0d1a2a]',
];

export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handler = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <div className="min-h-screen bg-dark-900 overflow-x-hidden">

      {/* ── Navbar landing ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌿</span>
          <span className="font-display text-white font-medium">ChillSpot</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-gray-400 hover:text-white text-sm transition-colors">
            Accedi
          </Link>
          <Link to="/login" className="btn-primary text-sm py-2 px-5">
            Unisciti
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Sfondo con parallax leggero */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(ellipse at ${mousePos.x}% ${mousePos.y}%, #1a3a1a 0%, transparent 60%),
                         radial-gradient(ellipse at ${100 - mousePos.x}% ${100 - mousePos.y}%, #0d1a2a 0%, transparent 60%)`,
            transition: 'background 0.3s ease',
          }}
        />

        {/* Dots decorativi */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #5c8a5c 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Orb flottanti */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-sage-700/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-night-700/10 blur-3xl animate-float animation-delay-500" />

        {/* Contenuto */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <span className="badge bg-sage-500/15 text-sage-400 border border-sage-500/20 mb-6 inline-flex">
              ✦ Community anonima · Privacy first
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium text-white leading-[0.95] tracking-tight animate-slide-up animation-delay-100">
            Find places
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage-400 to-night-400">
              to breathe.
            </span>
          </h1>

          <p className="mt-8 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
            ChillSpot è la mappa segreta dei luoghi tranquilli.
            Panorami nascosti, angoli di pace, posti dove stare un po' in silenzio.
            Condivisi da una community anonima che sa dove andare.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap animate-slide-up animation-delay-300">
            <Link to="/login" className="btn-primary text-base py-3.5 px-8">
              Esplora gli spot →
            </Link>
            <Link to="/login" className="btn-secondary text-base py-3.5 px-8">
              Unisciti alla community
            </Link>
          </div>

          <p className="mt-6 text-xs text-gray-600 animate-fade-in animation-delay-500">
            Gratuito · Anonimo · Nessuno spam · Solo luoghi sicuri e legali
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-white/50" />
          </div>
        </div>
      </section>

      {/* ── Spot preview ───────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-white mb-4">
              Spot popolari in questo momento
            </h2>
            <p className="text-gray-500">Luoghi reali condivisi dalla community anonima</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {SPOT_PREVIEWS.map((spot, i) => (
              <Link
                key={i}
                to="/login"
                className={`card relative overflow-hidden group ${i === 0 ? 'md:col-span-2 h-64' : 'h-48'}`}
              >
                <div
                  className="absolute inset-0 flex items-center justify-center text-5xl md:text-7xl"
                  style={{
                    background: `linear-gradient(135deg, #1c2633 0%, #243040 100%)`,
                  }}
                >
                  <span className="opacity-40">{spot.emoji}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 to-transparent" />
                <div className="absolute bottom-0 p-4">
                  <p className="text-xs text-gray-500 capitalize mb-1">{spot.category}</p>
                  <p className="font-display text-white font-medium">{spot.title}</p>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="text-sage-400 text-xs font-bold">{spot.score}</span>
                    <span className="text-gray-600 text-xs">/10 chill score</span>
                  </div>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white/70 text-sm glass px-4 py-2 rounded-xl">
                    Accedi per vedere →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Come funziona ──────────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-16">
            Come funziona
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Accedi in anonimato', desc: 'Crea un account con email o Google. Ottieni un nickname generato automaticamente. Nessun dato personale visibile.' },
              { step: '02', title: 'Esplora la mappa', desc: 'Sfoglia spot in mappa o in griglia. Filtra per vibe, categoria, distanza. Trova il tuo prossimo posto speciale.' },
              { step: '03', title: 'Condividi il tuo spot', desc: 'Pubblica luoghi accessibili e sicuri. Aggiungi foto, descrizione e rating. La community ti ringrazia.' },
            ].map(item => (
              <div key={item.step} className="glass rounded-3xl p-6 space-y-3">
                <span className="font-mono text-4xl text-sage-600 font-bold">{item.step}</span>
                <h3 className="font-display text-lg text-white">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="glass rounded-3xl p-6 flex gap-4">
                <span className="text-2xl flex-none">{f.emoji}</span>
                <div>
                  <h3 className="text-white font-medium mb-1">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Disclaimer ─────────────────────────────────────────────────── */}
      <section className="py-12 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass rounded-2xl p-6 border border-warm-700/20">
            <span className="text-2xl">🛡️</span>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              <strong className="text-gray-300">Responsabilità condivisa.</strong>{' '}
              ChillSpot incoraggia la condivisione di luoghi accessibili legalmente e in sicurezza.
              Non pubblicare posti su proprietà private, aree di trespassing o luoghi pericolosi.
              Rispetta la natura e le comunità locali.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA finale ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="font-display text-5xl md:text-6xl text-white mb-6 leading-tight">
            Il tuo posto segreto<br />
            <span className="text-sage-400">ti aspetta.</span>
          </div>
          <p className="text-gray-500 mb-10">Unisciti alla community di esploratori tranquilli.</p>
          <Link to="/login" className="btn-primary text-lg py-4 px-10">
            Inizia ad esplorare →
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span>🌿</span>
          <span className="font-display text-white">ChillSpot</span>
        </div>
        <p className="text-gray-600 text-xs">
          Fatto con calma · {new Date().getFullYear()} · Solo luoghi legali e sicuri
        </p>
      </footer>
    </div>
  );
}
