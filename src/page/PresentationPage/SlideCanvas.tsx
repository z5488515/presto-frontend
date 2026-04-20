import type { SlideElement, TextElement as TextElementType, ImageElement as ImageElementType, VideoElement as VideoElementType, CodeElement as CodeElementType } from '../../types';
import TextElement from '../../components/TextElement';
import ImageElement from '../../components/ImageElement';
import VideoElement from '../../components/VideoElement';
import CodeElement from '../../components/CodeElement';
import styles from './PresentationPage.module.css';
import React from 'react'

interface SlideCanvasProps {
  elements: SlideElement[];
  currentSlideIndex: number;
  slideStyle: React.CSSProperties;
  onEditText: (_el: TextElementType) => void;
  onEditImage: (_el: ImageElementType) => void;
  onEditVideo: (_el: VideoElementType) => void;
  onEditCode: (_el: CodeElementType) => void;
  onDeleteElement: (_id: string) => void;
}

// Pure presentational component — renders all elements on the current slide
function SlideCanvas({
  elements,
  slideStyle,
  onEditText,
  onEditImage,
  onEditVideo,
  onEditCode,
  onDeleteElement,
}: SlideCanvasProps) {
  return (
    // data-slide-canvas used by drag handlers to calculate percentage-based positions
    <div className={styles.slideCanvas} data-slide-canvas style={slideStyle}>
      {elements.map((el: SlideElement) => {
        if (el.type === 'text') {
          return (
            <TextElement
              key={el.id}
              element={el}
              onDoubleClick={(id) => {
                const found = elements.find((elem: SlideElement) => elem.id === id);
                if (found?.type === 'text') onEditText(found);
              }}
              onRightClick={(_e, id) => onDeleteElement(id)}
            />
          );
        }
        if (el.type === 'image') {
          return (
            <ImageElement
              key={el.id}
              element={el}
              onDoubleClick={(id) => {
                const found = elements.find((elem: SlideElement) => elem.id === id);
                if (found?.type === 'image') onEditImage(found);
              }}
              onRightClick={(_e, id) => onDeleteElement(id)}
            />
          );
        }
        if (el.type === 'video') {
          return (
            <VideoElement
              key={el.id}
              element={el}
              onDoubleClick={(id) => {
                const found = elements.find((elem: SlideElement) => elem.id === id);
                if (found?.type === 'video') onEditVideo(found);
              }}
              onRightClick={(_e, id) => onDeleteElement(id)}
            />
          );
        }
        if (el.type === 'code') {
          return (
            <CodeElement
              key={el.id}
              element={el}
              onDoubleClick={(id) => {
                const found = elements.find((elem: SlideElement) => elem.id === id);
                if (found?.type === 'code') onEditCode(found);
              }}
              onRightClick={(_e, id) => onDeleteElement(id)}
            />
          );
        }
        return null;
      })}
    </div>
  );
}

export default SlideCanvas;