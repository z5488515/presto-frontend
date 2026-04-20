export type BackgroundType = 'solid' | 'gradient' | 'image';

export interface SolidBackground {
  type: 'solid';
  colour: string;
}

export interface GradientBackground {
  type: 'gradient';
  from: string;
  to: string;
  direction: 'to right' | 'to bottom' | 'to bottom right';
}

export interface ImageBackground {
  type: 'image';
  src: string;
}

export type Background = SolidBackground | GradientBackground | ImageBackground;

export type ElementType = 'text' | 'image' | 'video' | 'code';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontSize: number;
  colour: string;
  fontFamily: string;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  alt: string;
}

export interface VideoElement extends BaseElement {
  type: 'video';
  url: string;
  autoplay: boolean;
}

export interface CodeElement extends BaseElement {
  type: 'code';
  content: string;
  fontSize: number;
}

export type SlideElement = TextElement | ImageElement | VideoElement | CodeElement;

export interface Slide {
  id: string;
  elements: SlideElement[];
  background: Background | null;
}

export interface Presentation {
  id: string;
  name: string;
  description: string;
  thumbnail: string | null;
  slides: Slide[];
  defaultBackground: Background | null;
}

export interface Store {
  presentations: Presentation[];
}