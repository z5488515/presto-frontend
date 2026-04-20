import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { CodeElement as CodeElementType } from '../types';
import { detectLanguage } from '../utils/detectLanguage';
import styles from './CodeElement.module.css';
import React from 'react';

interface CodeElementProps {
  element: CodeElementType;
  onDoubleClick: (_id: string) => void;
  onRightClick: (_e: React.MouseEvent, _id: string) => void;
  preview?: boolean;
}

function CodeElement({ element, onDoubleClick, onRightClick, preview }: CodeElementProps) {
  const language = detectLanguage(element.content);

  return (
    <div
      className={styles.codeElement}
      style={{
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: `${element.width}%`,
        height: `${element.height}%`,
        fontSize: `${element.fontSize}em`,
        border: preview ? 'none' : '1px solid #444',
      }}
      onDoubleClick={() => onDoubleClick(element.id)}
      onContextMenu={e => {
        e.preventDefault();
        onRightClick(e, element.id);
      }}
    >
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '8px',
          height: '100%',
          width: '100%',
          fontSize: 'inherit',
          boxSizing: 'border-box',
          overflow: 'auto',
        }}
        codeTagProps={{
          style: { fontFamily: 'monospace', whiteSpace: 'pre' }
        }}
      >
        {element.content}
      </SyntaxHighlighter>
    </div>
  );
}

export default CodeElement;