import type { Background } from '../types';
import type React from 'react'

export const getBackgroundStyle = (bg: Background | null): React.CSSProperties => {
  if (!bg) return { background: 'white' };

  switch (bg.type) {
  case 'solid':
    return { background: bg.colour };
  case 'gradient':
    return { background: `linear-gradient(${bg.direction}, ${bg.from}, ${bg.to})` };
  case 'image':
    return {
      backgroundImage: `url(${bg.src})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  default:
    return { background: 'white' };
  }
};