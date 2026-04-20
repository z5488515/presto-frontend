import React, { useState, useRef } from 'react';
import styles from './NewPresentationModal.module.css';

interface Props {
  onClose: () => void;
  onCreate: (_name: string, _description: string, _thumbnail: string | null) => void;
}

function NewPresentationModal({ onClose, onCreate }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setThumbnail(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCreate = () => {
    if (!name.trim()) {
      setError('Presentation name is required');
      return;
    }
    onCreate(name.trim(), description.trim(), thumbnail);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.heading}>New Presentation</h2>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.field}>
          <label className={styles.label}>Name</label>
          <input
            className={styles.input}
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="My presentation"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <input
            className={styles.input}
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Thumbnail</label>
          <div className={styles.fileRow}>
            <button
              type="button"
              className={styles.fileBtn}
              onClick={() => fileInputRef.current?.click()}
            >
              {thumbnail ? 'Change image' : 'Upload image'}
            </button>
            {thumbnail && <span className={styles.fileName}>Image selected</span>}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.hiddenInput}
          />
          {thumbnail && (
            <img src={thumbnail} alt="preview" className={styles.preview} />
          )}
        </div>

        <div className={styles.actions}>
          <button className={styles.createBtn} onClick={handleCreate}>Create</button>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default NewPresentationModal;