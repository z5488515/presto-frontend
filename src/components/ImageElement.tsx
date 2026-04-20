import type { ImageElement as ImageElementType } from '../types';
import styles from './ImageElement.module.css';
import React from 'react'

interface ImageElementProps {
  element: ImageElementType;
  onDoubleClick: (_id: string) => void;
  onRightClick: (_e: React.MouseEvent, _id: string) => void;
  preview?: boolean;
}

function ImageElement({ element, onDoubleClick, onRightClick, preview }: ImageElementProps) {
  return (
    <div
      className={styles.imageElement}
      style={{
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: `${element.width}%`,
        height: `${element.height}%`,
        outline: preview ? 'none' : undefined,
      }}
      onDoubleClick={() => onDoubleClick(element.id)}
      onContextMenu={e => {
        e.preventDefault();
        onRightClick(e, element.id);
      }}
    >
      <img
        src={element.src}
        alt={element.alt}
        className={styles.image}
      />
    </div>
  );
}

export default ImageElement;