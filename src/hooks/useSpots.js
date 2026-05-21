// src/hooks/useSpots.js
// Hook custom per gestire il caricamento e il filtraggio degli spot

import { useState, useEffect, useCallback } from 'react';
import { getSpots } from '../utils/firestoreUtils';

export function useSpots({ category, orderField = 'createdAt' } = {}) {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSpots({ category, orderField });
      setSpots(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [category, orderField]);

  useEffect(() => { load(); }, [load]);

  return { spots, loading, error, reload: load };
}
