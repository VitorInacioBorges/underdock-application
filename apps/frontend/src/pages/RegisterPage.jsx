/**
 * RegisterPage — Página de cadastro de novos usuários.
 *
 * Fluxo:
 *  1. Usuário preenche nome, e-mail, senha e confirmação de senha
 *  2. Validação client-side: campos obrigatórios, senha ≥ 6 chars, confirmação
 *  3. POST / → createUser() — backend valida e persiste
 *  4. Resposta (UserResponseDto) é salva em localStorage['fedev_user']
 *  5. Redirecionamento para /dashboard
 *
 * Erros tratados:
 *  - 409 Conflict → e-mail já cadastrado
 *  - Qualquer outra falha de rede/servidor
 *
 * O campo 'role' é fixo como 'user' (padrão de aluno).
 * Administradores são criados via painel administrativo.
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUser } from '../services/user-services/userService';
import styles from '../styles/pages-styles/RegisterPage.module.css';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    // ─── Client-side validation ───────────────────────────────
    if (!form.name.trim()) return setError('O nome é obrigatório.');
    if (!form.email.trim()) return setError('O e-mail é obrigatório.');
    if (form.password.length < 6)
      return setError('A senha deve ter no mínimo 6 caracteres.');
    if (form.password !== form.confirmPassword)
      return setError('As senhas não coincidem.');

    setLoading(true);
    try {
      await createUser({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: 'user', // padrão: aluno
      });

      // Redireciona para o login após cadastro bem-sucedido
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      {/* ─── Logo ─────────────────────────────────────── */}
      <div className={styles.logoArea}>
        <span className={styles.logoImg} aria-label="CourseManager">
          <img src="/icons/logo.png" alt="CourseManager" />
        </span>
      </div>

      {/* ─── Card do formulário ────────────────────────── */}
      <div className={styles.card}>
        <h1 className={styles.title}>Criar conta</h1>
        <p className={styles.subtitle}>
          Comece sua jornada de aprendizado gratuitamente.
        </p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate id="register-form">
          <div className={styles.field}>
            <label htmlFor="reg-name" className={styles.label}>Nome completo</label>
            <input
              id="reg-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="João Silva"
              value={form.name}
              onChange={handleChange}
              className={styles.input}
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="reg-email" className={styles.label}>E-mail</label>
            <input
              id="reg-email"
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
            <label htmlFor="reg-password" className={styles.label}>Senha</label>
            <input
              id="reg-password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChange={handleChange}
              className={styles.input}
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="reg-confirm" className={styles.label}>Confirmar senha</label>
            <input
              id="reg-confirm"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Repita a senha"
              value={form.confirmPassword}
              onChange={handleChange}
              className={styles.input}
              disabled={loading}
            />
          </div>

          {/* ─── Mensagem de erro inline ──────────────── */}
          {error && (
            <p className={styles.errorMsg} role="alert" aria-live="polite">
              {error}
            </p>
          )}

          <button
            id="btn-cadastrar"
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className={styles.loginHint}>
          Já tem uma conta?{' '}
          <Link to="/" className={styles.loginLink}>
            Fazer login
          </Link>
        </p>
      </div>

      {/* ─── Footer ───────────────────────────────────── */}
      <footer className={styles.footer}>
        ©2025 Vitor Inacio • v0.1
      </footer>
    </div>
  );
}
