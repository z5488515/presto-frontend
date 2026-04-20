import { useState } from 'react';
import styles from './AddTextModal.module.css';

interface AddVideoModalProps {
  onClose: () => void;
  onAdd: (_data: {
    url: string;
    autoplay: boolean;
    width: number;
    height: number;
  }) => void;
}

function AddVideoModal({ onClose, onAdd }: AddVideoModalProps) {
  const [url, setUrl] = useState('');
  const [autoplay, setAutoplay] = useState(false);
  const [width, setWidth] = useState(50);
  const [height, setHeight] = useState(30);
  const [error, setError] = useState('');

  const getEmbedUrl = (input: string): string | null => {
    try {
      const urlObj = new URL(input);
      if (urlObj.hostname.includes('youtube.com')) {
        const videoId = urlObj.searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }
      if (urlObj.hostname.includes('youtu.be')) {
        const videoId = urlObj.pathname.slice(1);
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleAdd = () => {
    if (!url.trim()) {
      setError('YouTube URL is required');
      return;
    }
    const embedUrl = getEmbedUrl(url);
    if (!embedUrl) {
      setError('Please enter a valid YouTube URL');
      return;
    }
    if (width <= 0 || width > 100 || height <= 0 || height > 100) {
      setError('Width and height must be between 1 and 100');
      return;
    }
    onAdd({ url: embedUrl, autoplay, width, height });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.heading}>Add Video</h2>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.field}>
          <label className={styles.label}>YouTube URL</label>
          <input
            className={styles.input}
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={autoplay}
              onChange={e => setAutoplay(e.target.checked)}
            />
            {' '}Autoplay
          </label>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Width (%)</label>
            <input
              className={styles.input}
              type="number"
              min="1"
              max="100"
              value={width}
              onChange={e => setWidth(parseFloat(e.target.value))}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Height (%)</label>
            <input
              className={styles.input}
              type="number"
              min="1"
              max="100"
              value={height}
              onChange={e => setHeight(parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.addBtn} onClick={handleAdd}>Add</button>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default AddVideoModal;