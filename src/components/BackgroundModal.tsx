import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { Background, BackgroundType } from '../types';
import styles from './BackgroundModal.module.css';

interface BackgroundModalProps {
  currentBackground: Background | null;
  defaultBackground: Background | null;
  onClose: () => void;
  onSave: (_slideBackground: Background | null, _newDefault: Background | null) => void;
}

function BackgroundModal({ currentBackground, defaultBackground, onClose, onSave }: BackgroundModalProps) {
  const [tab, setTab] = useState<'slide' | 'default'>('slide');

  // Slide background state
  const [slideType, setSlideType] = useState<BackgroundType | 'default'>(
    currentBackground ? currentBackground.type : 'default'
  );
  const [slideSolid, setSlideSolid] = useState(
    currentBackground?.type === 'solid' ? currentBackground.colour : '#ffffff'
  );
  const [slideGradFrom, setSlideGradFrom] = useState(
    currentBackground?.type === 'gradient' ? currentBackground.from : '#ffffff'
  );
  const [slideGradTo, setSlideGradTo] = useState(
    currentBackground?.type === 'gradient' ? currentBackground.to : '#000000'
  );
  const [slideGradDir, setSlideGradDir] = useState<'to right' | 'to bottom' | 'to bottom right'>(
    currentBackground?.type === 'gradient' ? currentBackground.direction : 'to right'
  );
  const [slideImageSrc, setSlideImageSrc] = useState(
    currentBackground?.type === 'image' ? currentBackground.src : ''
  );

  // Default background state
  const [defaultType, setDefaultType] = useState<BackgroundType>(
    defaultBackground ? defaultBackground.type : 'solid'
  );
  const [defaultSolid, setDefaultSolid] = useState(
    defaultBackground?.type === 'solid' ? defaultBackground.colour : '#ffffff'
  );
  const [defaultGradFrom, setDefaultGradFrom] = useState(
    defaultBackground?.type === 'gradient' ? defaultBackground.from : '#ffffff'
  );
  const [defaultGradTo, setDefaultGradTo] = useState(
    defaultBackground?.type === 'gradient' ? defaultBackground.to : '#000000'
  );
  const [defaultGradDir, setDefaultGradDir] = useState<'to right' | 'to bottom' | 'to bottom right'>(
    defaultBackground?.type === 'gradient' ? defaultBackground.direction : 'to right'
  );
  const [defaultImageSrc, setDefaultImageSrc] = useState(
    defaultBackground?.type === 'image' ? defaultBackground.src : ''
  );

  const handleImageUpload = (
    e: ChangeEvent<HTMLInputElement>,
    setter: (_src: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  };

  const buildBackground = (
    type: BackgroundType,
    solid: string,
    gradFrom: string,
    gradTo: string,
    gradDir: 'to right' | 'to bottom' | 'to bottom right',
    imageSrc: string
  ): Background => {
    switch (type) {
    case 'solid': return { type: 'solid', colour: solid };
    case 'gradient': return { type: 'gradient', from: gradFrom, to: gradTo, direction: gradDir };
    case 'image': return { type: 'image', src: imageSrc };
    }
  };

  const handleSave = () => {
    const slideBackground = slideType === 'default'
      ? null
      : buildBackground(slideType, slideSolid, slideGradFrom, slideGradTo, slideGradDir, slideImageSrc);

    const newDefault = buildBackground(defaultType, defaultSolid, defaultGradFrom, defaultGradTo, defaultGradDir, defaultImageSrc);

    onSave(slideBackground, newDefault);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.heading}>Background Settings</h2>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'slide' ? styles.tabActive : ''}`}
            onClick={() => setTab('slide')}
          >
            This Slide
          </button>
          <button
            className={`${styles.tab} ${tab === 'default' ? styles.tabActive : ''}`}
            onClick={() => setTab('default')}
          >
            Default
          </button>
        </div>

        {tab === 'slide' && (
          <div className={styles.section}>
            <div className={styles.field}>
              <label className={styles.label}>Slide Background</label>
              <select
                className={styles.input}
                value={slideType}
                onChange={e => setSlideType(e.target.value as BackgroundType | 'default')}
              >
                <option value="default">Use default</option>
                <option value="solid">Solid colour</option>
                <option value="gradient">Gradient</option>
                <option value="image">Image</option>
              </select>
            </div>

            {slideType === 'solid' && (
              <div className={styles.field}>
                <label className={styles.label}>Colour</label>
                <div className={styles.colourRow}>
                  <input className={styles.input} type="text" value={slideSolid} onChange={e => setSlideSolid(e.target.value)} />
                  <input type="color" value={slideSolid} onChange={e => setSlideSolid(e.target.value)} className={styles.colourPicker} />
                </div>
              </div>
            )}

            {slideType === 'gradient' && (
              <>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>From</label>
                    <div className={styles.colourRow}>
                      <input className={styles.input} type="text" value={slideGradFrom} onChange={e => setSlideGradFrom(e.target.value)} />
                      <input type="color" value={slideGradFrom} onChange={e => setSlideGradFrom(e.target.value)} className={styles.colourPicker} />
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>To</label>
                    <div className={styles.colourRow}>
                      <input className={styles.input} type="text" value={slideGradTo} onChange={e => setSlideGradTo(e.target.value)} />
                      <input type="color" value={slideGradTo} onChange={e => setSlideGradTo(e.target.value)} className={styles.colourPicker} />
                    </div>
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Direction</label>
                  <select className={styles.input} value={slideGradDir} onChange={e => setSlideGradDir(e.target.value as typeof slideGradDir)}>
                    <option value="to right">Left to Right</option>
                    <option value="to bottom">Top to Bottom</option>
                    <option value="to bottom right">Diagonal</option>
                  </select>
                </div>
              </>
            )}

            {slideType === 'image' && (
              <div className={styles.field}>
                <label className={styles.label}>Upload Image</label>
                <input type="file" accept="image/*" className={styles.input} onChange={e => handleImageUpload(e, setSlideImageSrc)} />
                {slideImageSrc && (
                  <img src={slideImageSrc} alt="preview" className={styles.preview} />
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'default' && (
          <div className={styles.section}>
            <p className={styles.hint}>This applies to all new slides and any slide using the default background.</p>
            <div className={styles.field}>
              <label className={styles.label}>Default Background Type</label>
              <select
                className={styles.input}
                value={defaultType}
                onChange={e => setDefaultType(e.target.value as BackgroundType)}
              >
                <option value="solid">Solid colour</option>
                <option value="gradient">Gradient</option>
                <option value="image">Image</option>
              </select>
            </div>

            {defaultType === 'solid' && (
              <div className={styles.field}>
                <label className={styles.label}>Colour</label>
                <div className={styles.colourRow}>
                  <input className={styles.input} type="text" value={defaultSolid} onChange={e => setDefaultSolid(e.target.value)} />
                  <input type="color" value={defaultSolid} onChange={e => setDefaultSolid(e.target.value)} className={styles.colourPicker} />
                </div>
              </div>
            )}

            {defaultType === 'gradient' && (
              <>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>From</label>
                    <div className={styles.colourRow}>
                      <input className={styles.input} type="text" value={defaultGradFrom} onChange={e => setDefaultGradFrom(e.target.value)} />
                      <input type="color" value={defaultGradFrom} onChange={e => setDefaultGradFrom(e.target.value)} className={styles.colourPicker} />
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>To</label>
                    <div className={styles.colourRow}>
                      <input className={styles.input} type="text" value={defaultGradTo} onChange={e => setDefaultGradTo(e.target.value)} />
                      <input type="color" value={defaultGradTo} onChange={e => setDefaultGradTo(e.target.value)} className={styles.colourPicker} />
                    </div>
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Direction</label>
                  <select className={styles.input} value={defaultGradDir} onChange={e => setDefaultGradDir(e.target.value as typeof defaultGradDir)}>
                    <option value="to right">Left to Right</option>
                    <option value="to bottom">Top to Bottom</option>
                    <option value="to bottom right">Diagonal</option>
                  </select>
                </div>
              </>
            )}

            {defaultType === 'image' && (
              <div className={styles.field}>
                <label className={styles.label}>Upload Image</label>
                <input type="file" accept="image/*" className={styles.input} onChange={e => handleImageUpload(e, setDefaultImageSrc)} />
                {defaultImageSrc && (
                  <img src={defaultImageSrc} alt="preview" className={styles.preview} />
                )}
              </div>
            )}
          </div>
        )}

        <div className={styles.actions}>
          <button className={styles.saveBtn} onClick={handleSave}>Save</button>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default BackgroundModal;