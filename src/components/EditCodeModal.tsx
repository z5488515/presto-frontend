import { useState } from 'react';
import type { CodeElement } from '../types';
import styles from './AddTextModal.module.css';

interface EditCodeModalProps {
  element: CodeElement;
  onClose: () => void;
  onSave: (_updated: CodeElement) => void;
}

function EditCodeModal({ element, onClose, onSave }: EditCodeModalProps) {
  const [content, setContent] = useState(element.content);
  const [fontSize, setFontSize] = useState(element.fontSize);
  const [width, setWidth] = useState(element.width);
  const [height, setHeight] = useState(element.height);
  const [x, setX] = useState(element.x);
  const [y, setY] = useState(element.y);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!content.trim()) {
      setError('Code content is required');
      return;
    }
    if (fontSize <= 0) {
      setError('Font size must be greater than 0');
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
    onSave({ ...element, content, fontSize, width, height, x, y });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.heading}>Edit Code Block</h2>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.field}>
          <label className={styles.label}>Code Content</label>
          <textarea
            className={styles.textarea}
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={6}
            spellCheck={false}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Font Size (em)</label>
          <input
            className={styles.input}
            type="number"
            min="0.1"
            step="0.1"
            value={fontSize}
            onChange={e => setFontSize(parseFloat(e.target.value))}
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

export default EditCodeModal;