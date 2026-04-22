import styles from '../styles/components-styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          ©2026 Vitor Inacio • v0.1 •
        </div>
        <div className={styles.links}>
          <a href="/docs" className={styles.link}>Docs / Glossário</a>
          <a href="/privacy" className={styles.link}>Privacidade</a>
        </div>
      </div>
    </footer>
  );
}
