// src/components/InstallPWA.jsx
// Banner per installare ChillSpot come app sul dispositivo

import { useState, useEffect } from 'react';

export default function InstallPWA() {
  const [prompt, setPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Controlla se già installata
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }

    // Intercetta l'evento beforeinstallprompt
    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
      // Mostra il banner dopo 3 secondi
      setTimeout(() => setVisible(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setVisible(false);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') {
      setVisible(false);
      setPrompt(null);
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    // Non mostrare di nuovo per 7 giorni
    localStorage.setItem('pwa-dismissed', Date.now().toString());
  };

  // Controlla se dismissed di recente
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-dismissed');
    if (dismissed) {
      const days = (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60 * 24);
      if (days < 7) setVisible(false);
    }
  }, []);

  if (installed || !visible) return null;

  return (
    <div className="fixed bottom-24 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-50 animate-slide-up">
      <div className="glass rounded-3xl p-4 border border-sage-500/20 shadow-soft-lg">
        <div className="flex items-start gap-3">
          {/* Icona */}
          <div className="w-12 h-12 rounded-2xl bg-dark-700 flex items-center justify-center flex-none">
            <span className="text-2xl">🌿</span>
          </div>

          {/* Testo */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm">Installa ChillSpot</p>
            <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">
              Aggiungila alla schermata home per usarla come un'app vera.
            </p>
          </div>

          {/* Chiudi */}
          <button
            onClick={handleDismiss}
            className="text-gray-600 hover:text-gray-400 text-lg leading-none flex-none -mt-1"
          >
            ×
          </button>
        </div>

        {/* Bottoni */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleDismiss}
            className="flex-1 py-2 rounded-xl text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Non ora
          </button>
          <button
            onClick={handleInstall}
            className="flex-1 py-2 rounded-xl bg-sage-500 hover:bg-sage-400 text-white text-xs font-medium transition-colors"
          >
            Installa →
          </button>
        </div>
      </div>
    </div>
  );
}
