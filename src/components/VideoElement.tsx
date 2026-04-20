import type { VideoElement as VideoElementType } from '../types';
import styles from './VideoElement.module.css';
import React from 'react'

interface VideoElementProps {
  element: VideoElementType;
  onDoubleClick: (_id: string) => void;
  onRightClick: (_e: React.MouseEvent, _id: string) => void;
  preview?: boolean;
}

function VideoElement({ element, onDoubleClick, onRightClick, preview }: VideoElementProps) {
  const src = element.autoplay
    ? `${element.url}?autoplay=1&mute=1`
    : element.url;

  const handleDoubleClick = () => onDoubleClick(element.id);
  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onRightClick(e, element.id);
  };

  return (
    <div
      className={styles.videoElement}
      style={{
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: `${element.width}%`,
        height: `${element.height}%`,
        outline: preview ? 'none' : undefined,
      }}
    >
      <iframe
        className={styles.iframe}
        src={src}
        title="video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      {/* Four border strips — each catches events on one edge only */}
      <div className={`${styles.border} ${styles.borderTop}`}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleRightClick}
      />
      <div className={`${styles.border} ${styles.borderBottom}`}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleRightClick}
      />
      <div className={`${styles.border} ${styles.borderLeft}`}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleRightClick}
      />
      <div className={`${styles.border} ${styles.borderRight}`}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleRightClick}
      />
    </div>
  );
}

export default VideoElement;