import { useNavigate } from 'react-router-dom';
import styles from './Landing.module.css';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Presto</h1>
        <p className={styles.subtitle}>
          Create, present, and share beautiful slide decks in your own browser.
        </p>
        <div className={styles.actions}>
          <button className={styles.primaryBtn} onClick={() => navigate('/register')}>
            Get started free
          </button>
          <button className={styles.secondaryBtn} onClick={() => navigate('/login')}>
            Sign in
          </button>
        </div>
      </div>

      <div className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>⚡</div>
          <h3 className={styles.featureTitle}>Fast & Simple</h3>
          <p className={styles.featureDesc}>Build slides in seconds with an intuitive editor.</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>🎨</div>
          <h3 className={styles.featureTitle}>Customisable</h3>
          <p className={styles.featureDesc}>Add text, images, video and code to any slide.</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>📽️</div>
          <h3 className={styles.featureTitle}>Present anywhere</h3>
          <p className={styles.featureDesc}>Full-screen preview mode works on any device.</p>
        </div>
      </div>
    </div>
  );
}

export default Landing;