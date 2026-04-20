import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import type { Presentation, SlideElement } from '../types';
import { getBackgroundStyle } from '../utils/backgroundStyle';
import TextElement from '../components/TextElement';
import ImageElement from '../components/ImageElement';
import VideoElement from '../components/VideoElement';
import CodeElement from '../components/CodeElement';
import styles from './PreviewPage.module.css';

function PreviewPage() {
  const { id, slideIndex } = useParams<{ id: string; slideIndex: string }>();
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(parseInt(slideIndex ?? '0', 10));

  useEffect(() => {
    const loadPresentation = () => {
      const raw = sessionStorage.getItem('previewPresentation');
      if (!raw) return;
      const data: Presentation = JSON.parse(raw);
      if (data.id === id) setPresentation(data);
    };
    loadPresentation();
  }, [id]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!presentation) return;
    if (e.key === 'ArrowRight') {
      setCurrentSlideIndex(i => Math.min(i + 1, presentation.slides.length - 1));
    } else if (e.key === 'ArrowLeft') {
      setCurrentSlideIndex(i => Math.max(i - 1, 0));
    }
  }, [presentation]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    window.history.replaceState(null, '', `/preview/${id}/${currentSlideIndex}`);
  }, [currentSlideIndex, id]);

  if (!presentation) return <p style={{ color: 'white', padding: '24px' }}>Loading preview...</p>;

  const totalSlides = presentation.slides.length;
  const isFirst = currentSlideIndex === 0;
  const isLast = currentSlideIndex === totalSlides - 1;
  const currentSlide = presentation.slides[currentSlideIndex];
  const effectiveBackground = currentSlide?.background ?? presentation.defaultBackground ?? null;

  return (
    <div className={styles.page}>
      <div
        className={styles.slideCanvas}
        style={getBackgroundStyle(effectiveBackground)}
      >
        {currentSlide?.elements.map((el: SlideElement) => {
          if (el.type === 'text') {
            return (
              <TextElement
                key={el.id}
                element={el}
                onDoubleClick={() => {}}
                onRightClick={() => {}}
                preview
              />
            );
          }
          if (el.type === 'image') {
            return (
              <ImageElement
                key={el.id}
                element={el}
                onDoubleClick={() => {}}
                onRightClick={() => {}}
                preview
              />
            );
          }
          if (el.type === 'video') {
            return (
              <VideoElement
                key={el.id}
                element={el}
                onDoubleClick={() => {}}
                onRightClick={() => {}}
                preview
              />
            );
          }
          if (el.type === 'code') {
            return (
              <CodeElement
                key={el.id}
                element={el}
                onDoubleClick={() => {}}
                onRightClick={() => {}}
                preview
              />
            );
          }
          return null;
        })}

        <span className={styles.slideNumber}>{currentSlideIndex + 1} / {totalSlides}</span>

        {totalSlides > 1 && (
          <>
            <button
              className={`${styles.arrowBtn} ${styles.arrowLeft} ${isFirst ? styles.arrowDisabled : ''}`}
              onClick={() => !isFirst && setCurrentSlideIndex(i => i - 1)}
              disabled={isFirst}
            >
              &#8592;
            </button>
            <button
              className={`${styles.arrowBtn} ${styles.arrowRight} ${isLast ? styles.arrowDisabled : ''}`}
              onClick={() => !isLast && setCurrentSlideIndex(i => i + 1)}
              disabled={isLast}
            >
              &#8594;
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PreviewPage;