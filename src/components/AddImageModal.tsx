import React, { useState } from 'react';
import styles from './AddTextModal.module.css';

interface AddImageModalProps {
  onClose: () => void;
  onAdd: (_data: {
    src: string;
    alt: string;
    width: number;
    height: number;
  }) => void;
}

function AddImageModal({ onClose, onAdd }: AddImageModalProps) {
  const [src, setSrc] = useState('');
  const [alt, setAlt] = useState('');
  const [width, setWidth] = useState(30);
  const [height, setHeight] = useState(20);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    if (!src.trim()) {
      setError('Image URL or file is required');
      return;
    }
    if (width <= 0 || width > 100 || height <= 0 || height > 100) {
      setError('Width and height must be between 1 and 100');
      return;
    }
    onAdd({ src, alt, width, height });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.heading}>Add Image</h2>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.field}>
          <label className={styles.label}>Image URL</label>
          <input
            className={styles.input}
            type="text"
            value={src}
            onChange={e => setSrc(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Or upload a file</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.input}
          />
        </div>

        {src && (
          <div className={styles.field}>
            <img
              src={src}
              alt="preview"
              style={{ width: '100%', aspectRatio: '2/1', objectFit: 'contain', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label}>Alt Text</label>
          <input
            className={styles.input}
            type="text"
            value={alt}
            onChange={e => setAlt(e.target.value)}
            placeholder="Describe the image"
          />
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

export default AddImageModal;