import { useState } from 'react';
import type { VideoElement } from '../types';
import styles from './AddTextModal.module.css';

interface EditVideoModalProps {
  element: VideoElement;
  onClose: () => void;
  onSave: (_updated: VideoElement) => void;
}

function EditVideoModal({ element, onClose, onSave }: EditVideoModalProps) {
  const [url, setUrl] = useState(element.url);
  const [autoplay, setAutoplay] = useState(element.autoplay);
  const [width, setWidth] = useState(element.width);
  const [height, setHeight] = useState(element.height);
  const [x, setX] = useState(element.x);
  const [y, setY] = useState(element.y);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!url.trim()) {
      setError('YouTube embed URL is required');
      return;
    }
    if (width <= 0 || width > 100 || height <= 0 || height > 100) {
      setError('Width and height must be between 1 and 100');
      return;
    }
    if (x < 0 || x > 100 || y < 0 || y > 100) {
      setError('Position must be between 0 and 100');
      return;
    }
    onSave({ ...element, url, autoplay, width, height, x, y });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.heading}>Edit Video</h2>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.field}>
          <label className={styles.label}>YouTube Embed URL</label>
          <input
            className={styles.input}
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/embed/..."
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

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>X Position (%)</label>
            <input
              className={styles.input}
              type="number"
              min="0"
              max="100"
              value={x}
              onChange={e => setX(parseFloat(e.target.value))}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Y Position (%)</label>
            <input
              className={styles.input}
              type="number"
              min="0"
              max="100"
              value={y}
              onChange={e => setY(parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.addBtn} onClick={handleSave}>Save</button>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EditVideoModal;