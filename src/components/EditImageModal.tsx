import React, { useState } from 'react';
import type { ImageElement } from '../types';
import styles from './AddTextModal.module.css';

interface EditImageModalProps {
  element: ImageElement;
  onClose: () => void;
  onSave: (_updated: ImageElement) => void;
}

function EditImageModal({ element, onClose, onSave }: EditImageModalProps) {
  const [src, setSrc] = useState(element.src);
  const [alt, setAlt] = useState(element.alt);
  const [width, setWidth] = useState(element.width);
  const [height, setHeight] = useState(element.height);
  const [x, setX] = useState(element.x);
  const [y, setY] = useState(element.y);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!src.trim()) {
      setError('Image URL or file is required');
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
    onSave({ ...element, src, alt, width, height, x, y });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.heading}>Edit Image</h2>
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

export default EditImageModal;