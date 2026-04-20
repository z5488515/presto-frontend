import type { TextElement as TextElementType } from '../types';
import styles from './TextElement.module.css';
import React from 'react'

interface TextElementProps {
  element: TextElementType;
  onDoubleClick: (_id: string) => void;
  onRightClick: (_e: React.MouseEvent, _id: string) => void;
  preview?: boolean;
}

function TextElement({ element, onDoubleClick, onRightClick, preview }: TextElementProps) {
  return (
    <div
      className={styles.textElement}
      style={{
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: `${element.width}%`,
        height: `${element.height}%`,
        fontSize: `${element.fontSize}em`,
        color: element.colour,
        fontFamily: element.fontFamily,
        border: preview ? 'none' : '1px solid #e0e0e0',
      }}
      onDoubleClick={() => onDoubleClick(element.id)}
      onContextMenu={e => {
        e.preventDefault();
        onRightClick(e, element.id);
      }}
    >
      {element.content}
    </div>
  );
}

export default TextElement;