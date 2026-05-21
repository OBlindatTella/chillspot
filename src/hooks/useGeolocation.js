// src/hooks/useGeolocation.js
// Hook per la geolocalizzazione con rispetto della privacy

import { useState, useCallback } from 'react';

export function useGeolocation() {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocalizzazione non supportata dal browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setLoading(false);
      },
      (err) => {
        const msg = {
          1: 'Permesso negato. Abilita la geolocalizzazione nelle impostazioni del browser.',
          2: 'Posizione non disponibile.',
          3: 'Timeout. Riprova.',
        }[err.code] || 'Errore di geolocalizzazione.';
        setError(msg);
        setLoading(false);
      },
      {
        enableHighAccuracy: false,  // false per rispettare la privacy
        timeout: 8000,
        maximumAge: 60000,          // cache 1 minuto
      }
    );
  }, []);

  const clear = useCallback(() => {
    setPosition(null);
    setError(null);
  }, []);

  return { position, error, loading, getPosition, clear };
}
