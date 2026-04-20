import { useState } from 'react';
import styles from './AddTextModal.module.css';

interface AddTextModalProps {
  onClose: () => void;
  onAdd: (_data: {
    content: string;
    fontSize: number;
    colour: string;
    fontFamily: string;
    width: number;
    height: number;
  }) => void;
}

function AddTextModal({ onClose, onAdd }: AddTextModalProps) {
  const [content, setContent] = useState('Text block');
  const [fontSize, setFontSize] = useState(1);
  const [colour, setColour] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('sans-serif');
  const [width, setWidth] = useState(30);
  const [height, setHeight] = useState(20);
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!content.trim()) {
      setError('Text content is required');
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
    onAdd({ content, fontSize, colour, fontFamily, width, height });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.heading}>Add Text Block</h2>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.field}>
          <label className={styles.label}>Text Content</label>
          <textarea
            className={styles.textarea}
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={3}
          />
        </div>

        <div className={styles.row}>
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
          <div className={styles.field}>
            <label className={styles.label}>Colour (HEX)</label>
            <div className={styles.colourRow}>
              <input
                className={styles.input}
                type="text"
                value={colour}
                onChange={e => setColour(e.target.value)}
                placeholder="#000000"
              />
              <input
                type="color"
                value={colour}
                onChange={e => setColour(e.target.value)}
                className={styles.colourPicker}
              />
            </div>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Font Family</label>
          <select
            className={styles.input}
            value={fontFamily}
            onChange={e => setFontFamily(e.target.value)}
          >
            <option value="sans-serif">Sans-serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="'Arial', sans-serif">Arial</option>
          </select>
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

export default AddTextModal;