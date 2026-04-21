/**
 * LastCourseBanner — Banner hero do último curso acessado.
 *
 * Exibe um painel de largura total com:
 *  - Fundo visual tecnológico (gradiente teal/darkblue + ruído)
 *  - Label "Último Curso"
 *  - Título do curso
 *  - Botão "Ver Aula"
 *
 * Props:
 *  - course: { id, title } — curso mais recente
 *  - onViewLesson: () => void — callback do botão
 */
import styles from '../styles/components-styles/LastCourseBanner.module.css';

export default function LastCourseBanner({ course, onViewLesson }) {
  if (!course) return null;

  return (
    <section className={styles.banner} aria-label="Último curso acessado">
      <div className={styles.overlay} />
      <div className={styles.content}>
        <span className={styles.label}>Último Curso</span>
        <h2 className={styles.courseTitle}>{course.title}</h2>
        <button
          className={styles.btn}
          onClick={onViewLesson}
          id="btn-ver-aula"
        >
          Ver Aula
        </button>
      </div>
    </section>
  );
}
