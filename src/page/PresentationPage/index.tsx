import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { TextElement as TextElementType, ImageElement as ImageElementType, VideoElement as VideoElementType, CodeElement as CodeElementType } from '../../types';
import { usePresentationStore } from './usePresentationStore';
import { useSlideHandlers } from './useSlideHandlers';
import { useElementHandlers } from './useElementHandlers';
import SlideCanvas from './SlideCanvas';
import { getBackgroundStyle } from '../../utils/backgroundStyle';
import ConfirmModal from '../../components/ConfirmModal';
import EditTitleModal from '../../components/EditTitleModal';
import BackgroundModal from '../../components/BackgroundModal';
import SlidePanel from '../../components/SlidePanel';
import Toolbar from '../../components/Toolbar';
import AddTextModal from '../../components/AddTextModal';
import EditTextModal from '../../components/EditTextModal';
import AddImageModal from '../../components/AddImageModal';
import EditImageModal from '../../components/EditImageModal';
import AddVideoModal from '../../components/AddVideoModal';
import EditVideoModal from '../../components/EditVideoModal';
import AddCodeModal from '../../components/AddCodeModal';
import EditCodeModal from '../../components/EditCodeModal';
import styles from './PresentationPage.module.css';

interface PresentationPageProps {
  token: string;
  onError: (_msg: string) => void;
}

function PresentationPage({ token, onError }: PresentationPageProps) {
  const { id, slideIndex } = useParams<{ id: string; slideIndex?: string }>();
  const navigate = useNavigate();

  // ── Slide navigation state ──────────────────────────────────────────────
  // Initialise from URL param so refreshing the page restores the correct slide
  const [currentSlideIndex, setCurrentSlideIndex] = useState(parseInt(slideIndex ?? '0', 10));

  // ── Modal visibility state ──────────────────────────────────────────────
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditTitle, setShowEditTitle] = useState(false);
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);
  const [showSlidePanel, setShowSlidePanel] = useState(false);
  const [activeModal, setActiveModal] = useState<'text' | 'image' | 'video' | 'code' | null>(null);

  // ── Element editing state ───────────────────────────────────────────────
  const [editingElement, setEditingElement] = useState<TextElementType | null>(null);
  const [editingImage, setEditingImage] = useState<ImageElementType | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoElementType | null>(null);
  const [editingCode, setEditingCode] = useState<CodeElementType | null>(null);

  // ── Custom hooks ────────────────────────────────────────────────────────
  const { store, setStore, presentation, updatePresentation } = usePresentationStore(token, id, onError);
  const { handleAddSlide, handleDeleteSlide, handleSaveBackground } = useSlideHandlers({
    presentation, currentSlideIndex, setCurrentSlideIndex, updatePresentation, onError,
  });
  const {
    handleDeleteElement,
    handleAddTextElement, handleSaveTextElement,
    handleAddImageElement, handleSaveImageElement,
    handleAddVideoElement, handleSaveVideoElement,
    handleAddCodeElement, handleSaveCodeElement,
  } = useElementHandlers({ presentation, currentSlideIndex, updatePresentation });

  // ── Keyboard navigation ─────────────────────────────────────────────────
  // useCallback prevents unnecessary re-registration of the event listener
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

  // ── URL sync ────────────────────────────────────────────────────────────
  // replaceState keeps the URL in sync without adding browser history entries
  useEffect(() => {
    window.history.replaceState(null, '', `/presentation/${id}/${currentSlideIndex}`);
  }, [currentSlideIndex, id]);

  // ── Presentation-level handlers ─────────────────────────────────────────
  const handleDelete = async () => {
    if (!store) return;
    try {
      const updatedStore = {
        ...store,
        presentations: store.presentations.filter(p => p.id !== id),
      };
      await import('../../api').then(({ putStore }) => putStore(token, updatedStore));
      setStore(updatedStore);
      navigate('/dashboard');
    } catch {
      onError('Failed to delete presentation');
    }
  };

  const handleSaveTitle = async (newTitle: string) => {
    if (!presentation) return;
    await updatePresentation({ ...presentation, name: newTitle });
    setShowEditTitle(false);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !presentation) return;
    // Convert to base64 so thumbnails can be stored without a separate file server
    const reader = new FileReader();
    reader.onload = async () => {
      await updatePresentation({ ...presentation, thumbnail: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handlePreview = () => {
    // Pass data via sessionStorage since preview opens in a new tab
    // and cannot share React state across browser contexts
    sessionStorage.setItem('previewPresentation', JSON.stringify(presentation));
    window.open(`/preview/${id}/${currentSlideIndex}`, '_blank');
  };

  // ── Render guards ───────────────────────────────────────────────────────
  if (!store) return <p>Loading...</p>;
  if (!presentation) return <p>Presentation not found.</p>;

  const totalSlides = presentation.slides.length;
  const isFirst = currentSlideIndex === 0;
  const isLast = currentSlideIndex === totalSlides - 1;
  const currentSlide = presentation.slides[currentSlideIndex];
  // Slide-level background overrides the presentation default if explicitly set
  const effectiveBackground = currentSlide?.background ?? presentation.defaultBackground ?? null;

  return (
    <div className={styles.page}>

      {/* ── Top Bar ───────────────────────────────────────────────────── */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
            &#8592; Back
          </button>
          <div className={styles.titleArea}>
            <h2>{presentation.name}</h2>
            <button className={styles.editTitleBtn} onClick={() => setShowEditTitle(true)}>
              Edit
            </button>
          </div>
        </div>
        <div className={styles.topBarRight}>
          <button className={styles.bgBtn} onClick={handlePreview}>Preview</button>
          <button className={styles.bgBtn} onClick={() => setShowSlidePanel(true)}>Slides</button>
          <button className={styles.bgBtn} onClick={() => setShowBackgroundModal(true)}>Background</button>
          <label htmlFor="thumbnailUpload" className={styles.thumbnailBtn}>
            {presentation.thumbnail
              ? <img src={presentation.thumbnail} alt="thumbnail" className={styles.thumbnailPreview} />
              : <div className={styles.thumbnailPlaceholder} />
            }
            <span className={styles.thumbnailBtnText}>Update Thumbnail</span>
          </label>
          {/* Hidden input triggered by label above for custom styled file upload */}
          <input
            id="thumbnailUpload"
            type="file"
            accept="image/*"
            className={styles.hiddenInput}
            onChange={handleThumbnailChange}
          />
          <button className={styles.deleteBtn} onClick={() => setShowDeleteModal(true)}>
            Delete Presentation
          </button>
        </div>
      </div>

      {/* ── Editor Body ───────────────────────────────────────────────── */}
      <div className={styles.body}>
        <Toolbar onAddElement={(type) => setActiveModal(type)} />

        <div className={styles.slideArea}>
          <div className={styles.slideWrapper}>
            <SlideCanvas
              elements={currentSlide?.elements ?? []}
              currentSlideIndex={currentSlideIndex}
              slideStyle={getBackgroundStyle(effectiveBackground)}
              onEditText={setEditingElement}
              onEditImage={setEditingImage}
              onEditVideo={setEditingVideo}
              onEditCode={setEditingCode}
              onDeleteElement={handleDeleteElement}
            />

            {/* Arrows only render when 2+ slides exist */}
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

          <div className={styles.slideControls}>
            <button className={styles.controlBtn} onClick={handleAddSlide}>+ Add Slide</button>
            <button className={styles.controlBtnDanger} onClick={handleDeleteSlide}>Delete Slide</button>
          </div>
        </div>
      </div>

      {/* ── Modals ────────────────────────────────────────────────────── */}
      {showDeleteModal && (
        <ConfirmModal message="Are you sure?" onConfirm={handleDelete} onCancel={() => setShowDeleteModal(false)} />
      )}
      {showEditTitle && (
        <EditTitleModal currentTitle={presentation.name} onClose={() => setShowEditTitle(false)} onSave={handleSaveTitle} />
      )}
      {showBackgroundModal && (
        <BackgroundModal
          currentBackground={currentSlide?.background ?? null}
          defaultBackground={presentation.defaultBackground ?? null}
          onClose={() => setShowBackgroundModal(false)}
          onSave={async (bg, def) => { await handleSaveBackground(bg, def); setShowBackgroundModal(false); }}
        />
      )}
      {showSlidePanel && (
        <SlidePanel slides={presentation.slides} currentSlideIndex={currentSlideIndex} onNavigate={setCurrentSlideIndex} onClose={() => setShowSlidePanel(false)} />
      )}
      {activeModal === 'text' && (
        <AddTextModal onClose={() => setActiveModal(null)} onAdd={async (d) => { await handleAddTextElement(d); setActiveModal(null); }} />
      )}
      {editingElement && (
        <EditTextModal element={editingElement} onClose={() => setEditingElement(null)} onSave={async (u) => { await handleSaveTextElement(u); setEditingElement(null); }} />
      )}
      {activeModal === 'image' && (
        <AddImageModal onClose={() => setActiveModal(null)} onAdd={async (d) => { await handleAddImageElement(d); setActiveModal(null); }} />
      )}
      {editingImage && (
        <EditImageModal element={editingImage} onClose={() => setEditingImage(null)} onSave={async (u) => { await handleSaveImageElement(u); setEditingImage(null); }} />
      )}
      {activeModal === 'video' && (
        <AddVideoModal onClose={() => setActiveModal(null)} onAdd={async (d) => { await handleAddVideoElement(d); setActiveModal(null); }} />
      )}
      {editingVideo && (
        <EditVideoModal element={editingVideo} onClose={() => setEditingVideo(null)} onSave={async (u) => { await handleSaveVideoElement(u); setEditingVideo(null); }} />
      )}
      {activeModal === 'code' && (
        <AddCodeModal onClose={() => setActiveModal(null)} onAdd={async (d) => { await handleAddCodeElement(d); setActiveModal(null); }} />
      )}
      {editingCode && (
        <EditCodeModal element={editingCode} onClose={() => setEditingCode(null)} onSave={async (u) => { await handleSaveCodeElement(u); setEditingCode(null); }} />
      )}
    </div>
  );
}

export default PresentationPage;