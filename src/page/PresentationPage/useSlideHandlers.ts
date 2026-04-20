import type { Presentation, SlideElement, Background, Slide } from '../../types';
import React from 'react'

interface SlideHandlersProps {
  presentation: Presentation | undefined;
  currentSlideIndex: number;
  setCurrentSlideIndex: React.Dispatch<React.SetStateAction<number>>;
  updatePresentation: (_updated: Presentation) => Promise<void>;
  onError: (_msg: string) => void;
}

// Custom hook that owns all slide-level CRUD operations
export function useSlideHandlers({
  presentation,
  currentSlideIndex,
  setCurrentSlideIndex,
  updatePresentation,
  onError,
}: SlideHandlersProps) {

  const handleAddSlide = async () => {
    if (!presentation) return;
    // New slides use null background so they track the presentation default
    const newSlide = { id: crypto.randomUUID(), elements: [] as SlideElement[], background: null };
    const updated = { ...presentation, slides: [...presentation.slides, newSlide] };
    await updatePresentation(updated);
    // Navigate to the newly created slide immediately
    setCurrentSlideIndex(updated.slides.length - 1);
  };

  const handleDeleteSlide = async () => {
    if (!presentation) return;
    // Prevent deleting the last slide — the whole presentation must be deleted instead
    if (presentation.slides.length === 1) {
      onError('Cannot delete the only slide — delete the presentation instead');
      return;
    }
    try {
      const updatedSlides = presentation.slides.filter(
        (_: Slide, i: number) => i !== currentSlideIndex
      );
      await updatePresentation({ ...presentation, slides: updatedSlides });
      // Move to the previous slide, clamped at 0 to avoid a negative index
      setCurrentSlideIndex(i => Math.max(i - 1, 0));
    } catch {
      onError('Failed to delete slide');
    }
  };

  const handleSaveBackground = async (
    slideBackground: Background | null,
    newDefault: Background | null
  ) => {
    if (!presentation) return;
    const updatedSlides = presentation.slides.map((slide: Slide, i: number) => {
      // Only update the current slide's individual background
      if (i === currentSlideIndex) return { ...slide, background: slideBackground };
      // Other null-background slides continue tracking the default — no change needed
      return slide;
    });
    await updatePresentation({ ...presentation, slides: updatedSlides, defaultBackground: newDefault });
  };

  return { handleAddSlide, handleDeleteSlide, handleSaveBackground };
}