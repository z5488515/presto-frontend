import { useState } from 'react';
import styles from './Toolbar.module.css';

interface ToolbarProps {
  onAddElement: (_type: 'text' | 'image' | 'video' | 'code') => void;
}

function Toolbar({ onAddElement }: ToolbarProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className={`${styles.toolbar} ${open ? styles.toolbarOpen : styles.toolbarClosed}`}>
      <button className={styles.toggleBtn} onClick={() => setOpen(o => !o)}>
        {open ? '◀' : '▶'}
      </button>

      {open && (
        <div className={styles.items}>
          <p className={styles.sectionLabel}>Insert</p>
          <button className={styles.toolBtn} onClick={() => onAddElement('text')}>
            <span className={styles.toolIcon}>T</span>
            <span className={styles.toolLabel}>Text</span>
          </button>
          <button className={styles.toolBtn} onClick={() => onAddElement('image')}>
            <span className={styles.toolIcon}>🖼</span>
            <span className={styles.toolLabel}>Image</span>
          </button>
          <button className={styles.toolBtn} onClick={() => onAddElement('video')}>
            <span className={styles.toolIcon}>▶</span>
            <span className={styles.toolLabel}>Video</span>
          </button>
          <button className={styles.toolBtn} onClick={() => onAddElement('code')}>
            <span className={styles.toolIcon}>{'</>'}</span>
            <span className={styles.toolLabel}>Code</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default Toolbar;