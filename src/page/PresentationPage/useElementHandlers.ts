import type { Presentation, Slide, SlideElement, TextElement, ImageElement, VideoElement, CodeElement } from '../../types';

interface ElementHandlersProps {
  presentation: Presentation | undefined;
  currentSlideIndex: number;
  updatePresentation: (_updated: Presentation) => Promise<void>;
}

// Helper to update only the current slide's elements, leaving other slides unchanged
function updateCurrentSlideElements(
  presentation: Presentation,
  currentSlideIndex: number,
  updater: (_elements: SlideElement[]) => SlideElement[]
): Presentation {
  const updatedSlides = presentation.slides.map((slide: Slide, i: number) =>
    i === currentSlideIndex
      ? { ...slide, elements: updater(slide.elements) }
      : slide
  );
  return { ...presentation, slides: updatedSlides };
}

// Custom hook that owns all element-level CRUD operations
export function useElementHandlers({ presentation, currentSlideIndex, updatePresentation }: ElementHandlersProps) {

  const handleDeleteElement = async (elementId: string) => {
    if (!presentation) return;
    const updated = updateCurrentSlideElements(
      presentation, currentSlideIndex,
      els => els.filter((el: SlideElement) => el.id !== elementId)
    );
    await updatePresentation(updated);
  };

  const handleAddTextElement = async (data: {
    content: string; fontSize: number; colour: string; fontFamily: string; width: number; height: number;
  }) => {
    if (!presentation) return;
    const newElement: TextElement = {
      id: crypto.randomUUID(), type: 'text',
      // Place at top-left by default — user can reposition via edit modal
      x: 0, y: 0,
      width: data.width, height: data.height,
      content: data.content, fontSize: data.fontSize,
      colour: data.colour, fontFamily: data.fontFamily,
    };
    const updated = updateCurrentSlideElements(
      presentation, currentSlideIndex,
      els => [...els, newElement]
    );
    await updatePresentation(updated);
  };

  const handleSaveTextElement = async (updated: TextElement) => {
    if (!presentation) return;
    const updatedPresentation = updateCurrentSlideElements(
      presentation, currentSlideIndex,
      els => els.map((el: SlideElement) => el.id === updated.id ? updated : el)
    );
    await updatePresentation(updatedPresentation);
  };

  const handleAddImageElement = async (data: {
    src: string; alt: string; width: number; height: number;
  }) => {
    if (!presentation) return;
    const newElement: ImageElement = {
      id: crypto.randomUUID(), type: 'image',
      x: 0, y: 0,
      width: data.width, height: data.height,
      src: data.src, alt: data.alt,
    };
    const updated = updateCurrentSlideElements(
      presentation, currentSlideIndex,
      els => [...els, newElement]
    );
    await updatePresentation(updated);
  };

  const handleSaveImageElement = async (updated: ImageElement) => {
    if (!presentation) return;
    const updatedPresentation = updateCurrentSlideElements(
      presentation, currentSlideIndex,
      els => els.map((el: SlideElement) => el.id === updated.id ? updated : el)
    );
    await updatePresentation(updatedPresentation);
  };

  const handleAddVideoElement = async (data: {
    url: string; autoplay: boolean; width: number; height: number;
  }) => {
    if (!presentation) return;
    const newElement: VideoElement = {
      id: crypto.randomUUID(), type: 'video',
      x: 0, y: 0,
      width: data.width, height: data.height,
      // URL is already converted to embed format by AddVideoModal
      url: data.url, autoplay: data.autoplay,
    };
    const updated = updateCurrentSlideElements(
      presentation, currentSlideIndex,
      els => [...els, newElement]
    );
    await updatePresentation(updated);
  };

  const handleSaveVideoElement = async (updated: VideoElement) => {
    if (!presentation) return;
    const updatedPresentation = updateCurrentSlideElements(
      presentation, currentSlideIndex,
      els => els.map((el: SlideElement) => el.id === updated.id ? updated : el)
    );
    await updatePresentation(updatedPresentation);
  };

  const handleAddCodeElement = async (data: {
    content: string; fontSize: number; width: number; height: number;
  }) => {
    if (!presentation) return;
    const newElement: CodeElement = {
      id: crypto.randomUUID(), type: 'code',
      x: 0, y: 0,
      width: data.width, height: data.height,
      content: data.content, fontSize: data.fontSize,
    };
    const updated = updateCurrentSlideElements(
      presentation, currentSlideIndex,
      els => [...els, newElement]
    );
    await updatePresentation(updated);
  };

  const handleSaveCodeElement = async (updated: CodeElement) => {
    if (!presentation) return;
    const updatedPresentation = updateCurrentSlideElements(
      presentation, currentSlideIndex,
      els => els.map((el: SlideElement) => el.id === updated.id ? updated : el)
    );
    await updatePresentation(updatedPresentation);
  };

  return {
    handleDeleteElement,
    handleAddTextElement, handleSaveTextElement,
    handleAddImageElement, handleSaveImageElement,
    handleAddVideoElement, handleSaveVideoElement,
    handleAddCodeElement, handleSaveCodeElement,
  };
}