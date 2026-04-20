import { useEffect, useState } from 'react';
import { getStore, putStore } from '../../api';
import type { Store, Presentation } from '../../types';

// Custom hook that owns all store fetching and persistence logic
export function usePresentationStore(token: string, id: string | undefined, onError: (_msg: string) => void) {
  const [store, setStore] = useState<Store | null>(null);

  useEffect(() => {
    // Guard against empty token — occurs briefly during logout transition
    if (!token) return;
    const fetchStore = async () => {
      try {
        const data = await getStore(token);
        // Safely handle brand new accounts where store returns {} with no presentations key
        setStore({
          presentations: Array.isArray(data?.presentations) ? data.presentations : [],
        });
      } catch {
        onError('Failed to load presentation');
      }
    };
    fetchStore();
  }, [token]);

  // Derive the current presentation from the store rather than storing it separately
  const presentation: Presentation | undefined = store?.presentations.find(
    (p: Presentation) => p.id === id
  );

  // Central helper — maps an updated presentation into the store and saves
  const updatePresentation = async (updated: Presentation) => {
    if (!store) return;
    const updatedStore: Store = {
      ...store,
      presentations: store.presentations.map(
        (p: Presentation) => p.id === id ? updated : p
      ),
    };
    try {
      await putStore(token, updatedStore);
      setStore(updatedStore);
    } catch {
      onError('Failed to save changes');
    }
  };

  return { store, setStore, presentation, updatePresentation };
}