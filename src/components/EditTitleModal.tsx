import { useState } from 'react';
import styles from './EditTitleModal.module.css';

interface EditTitleModalProps {
  currentTitle: string;
  onClose: () => void;
  onSave: (_newTitle: string) => void;
}

function EditTitleModal({ currentTitle, onClose, onSave }: EditTitleModalProps) {
  const [title, setTitle] = useState(currentTitle);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!title.trim()) {
      setError('Title cannot be empty');
      return;
    }
    onSave(title.trim());
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.heading}>Edit Title</h2>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.field}>
          <label className={styles.label}>Presentation Title</label>
          <input
            className={styles.input}
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder="Enter title"
          />
        </div>
        <div className={styles.actions}>
          <button className={styles.saveBtn} onClick={handleSave}>Save</button>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EditTitleModal;