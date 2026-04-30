import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { loginUser } from '../services/user-services/userService';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/pages-styles/RegisterPage.module.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.email.trim()) return setError('O e-mail é obrigatório.');
    if (!form.password) return setError('A senha é obrigatória.');

    setLoading(true);
    try {
      const sessionData = await loginUser({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      login(sessionData);

      const redirectTo = location.state?.from || '/painel';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Email ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.logoArea}>
        <span className={styles.logoImg} aria-label="UnderDock">
          <img src="/icons/logo.svg" alt="UnderDock" />
        </span>
      </div>

      <div className={styles.card}>
        <h1 className={styles.title}>Fazer Login</h1>
        <p className={styles.subtitle}>
          Bem-vindo de volta! Acesse sua conta.
        </p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate id="login-form">
          <div className={styles.field}>
            <label htmlFor="log-email" className={styles.label}>E-mail</label>
            <input
              id="log-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="joao@exemplo.com"
              value={form.email}
              onChange={handleChange}
              className={styles.input}
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="log-password" className={styles.label}>Senha</label>
            <input
              id="log-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Sua senha secreta"
              value={form.password}
              onChange={handleChange}
              className={styles.input}
              disabled={loading}
            />
          </div>

          {error && (
            <p className={styles.errorMsg} role="alert" aria-live="polite">
              {error}
            </p>
          )}

          <button
            id="btn-entrar"
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className={styles.loginHint}>
          Não possui uma conta?{' '}
          <Link to="/register" className={styles.loginLink}>
            Cadastrar
          </Link>
        </p>
      </div>

      <footer className={styles.footer}>
        ©2025 Vitor Inacio • v0.1
      </footer>
    </div>
  );
}