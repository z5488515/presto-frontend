import { useState } from 'react';
import styles from './AddTextModal.module.css';

interface AddCodeModalProps {
  onClose: () => void;
  onAdd: (_data: {
    content: string;
    fontSize: number;
    width: number;
    height: number;
  }) => void;
}

function AddCodeModal({ onClose, onAdd }: AddCodeModalProps) {
  const [content, setContent] = useState('');
  const [fontSize, setFontSize] = useState(0.8);
  const [width, setWidth] = useState(40);
  const [height, setHeight] = useState(30);
  const [error, setError] = useState('');

  const handleAdd = () => {
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
    onAdd({ content, fontSize, width, height });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.heading}>Add Code Block</h2>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.field}>
          <label className={styles.label}>Code Content</label>
          <textarea
            className={styles.textarea}
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={6}
            placeholder="Paste your code here..."
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

        <div className={styles.actions}>
          <button className={styles.addBtn} onClick={handleAdd}>Add</button>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default AddCodeModal;