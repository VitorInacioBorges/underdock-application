import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/components-styles/Header.module.css';

export default function Header() {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logoArea}>
          <img src="/icons/logo.svg" alt="CourseManager" className={styles.logoImg} />
          <span className={styles.logoText}></span>
        </Link>

        <nav className={styles.nav}>
          <Link className={styles.navLink} to="/about">Sobre</Link>
          <Link className={styles.navLink} to="/courses">Cursos</Link>
          <Link className={styles.navLink} to="/community">Comunidade</Link>
        </nav>

        {isAuthenticated ? (
          <Link
            to="/painel"
            className={styles.accountBtn}
            aria-label={`Ir para o painel de ${user?.name || 'usuário'}`}
            title="Meu painel"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className={styles.accountIcon}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 21C20 17.6863 16.4183 15 12 15C7.58172 15 4 17.6863 4 21"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle
                cx="12"
                cy="8"
                r="4"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
          </Link>
        ) : (
          <Link to="/login" className={styles.loginBtn}>
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}