import styles from './SlidePanel.module.css';
import type { Slide } from '../types';

interface SlidePanelProps {
  slides: Slide[];
  currentSlideIndex: number;
  onNavigate: (_index: number) => void;
  onClose: () => void;
}

function SlidePanel({ slides, currentSlideIndex, onNavigate, onClose }: SlidePanelProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Slides</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.slideList}>
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`${styles.slideItem} ${index === currentSlideIndex ? styles.slideItemActive : ''}`}
              onClick={() => { onNavigate(index); onClose(); }}
            >
              <div className={styles.slideThumbnail}>
                <span className={styles.slideLabel}>Slide {index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SlidePanel;