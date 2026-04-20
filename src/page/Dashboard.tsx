//Dashboard.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStore, putStore } from '../api';
import type { Presentation, Store } from '../types';
import NewPresentationModal from '../components/NewPresentationModal';
import styles from './Dashboard.module.css';

interface DashboardProps {
  token: string;
  onError: (_msg: string) => void;
}

function Dashboard({ token, onError }: DashboardProps) {
  const [store, setStore] = useState<Store>({ presentations: [] });
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    const fetchStore = async () => {
      try {
        const data = await getStore(token);
        setStore({
          presentations: Array.isArray(data?.presentations) ? data.presentations : [],
        });
      } catch {
        onError('Failed to load presentations');
      }
    };
    fetchStore();
  }, [token]);
  //TODO: FIX STYLING FOR NEW PRES and EDIT NAME
  const handleCreate = async (name: string, description: string, thumbnail: string | null) => {
    const newPresentation: Presentation = {
      id: crypto.randomUUID(),
      name,
      description,
      thumbnail,
      slides: [{ id: crypto.randomUUID(), elements: [], background: null }],
      defaultBackground: null
    };
    const updatedStore = {
      ...store,
      presentations: [...store.presentations, newPresentation],
    };
    try {
      await putStore(token, updatedStore);
      setStore(updatedStore);
      setShowModal(false);
    } catch {
      onError('Failed to create presentation');
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Dashboard</h1>
        <button className={styles.newBtn} onClick={() => setShowModal(true)}>+ New Presentation</button>
      </div>
      <div className={styles.grid}>
        {store.presentations.map(p => (
          <div
            key={p.id}
            className={styles.card}
            onClick={() => navigate(`/presentation/${p.id}`)}
          >
            <div className={styles.thumbnail}>
              {p.thumbnail
                ? <img src={p.thumbnail} alt={p.name} />
                : <div className={styles.thumbnailPlaceholder} />}
            </div>
            <div className={styles.cardInfo}>
              <p className={styles.cardName}>{p.name}</p>
              {p.description && <p className={styles.cardDesc}>{p.description}</p>}
              <p className={styles.cardSlides}>{p.slides.length} slide{p.slides.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <NewPresentationModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}

export default Dashboard;