/**
 * CourseListItem — Linha de um curso na lista "Cursos Recentes".
 *
 * Exibe:
 *  - Ícone de grupo + nome do curso em dourado
 *  - Grid com até 4 aulas (Aula 1: título, Aula 2: título, ...)
 *
 * Props:
 *  - course: { id, title, description }
 *  - lessons: [{ id, title, order }]
 *  - isFirst: boolean — destaca o primeiro item (mais recente)
 */
import styles from '../styles/components-styles/CourseListItem.module.css';

export default function CourseListItem({ course, lessons = [], isFirst = false, onClick }) {

  // Garante no máximo 4 aulas exibidas, ordenadas por 'order'
  const sorted = [...lessons].sort((a, b) => a.order - b.order).slice(0, 4);

  return (
    <div 
      className={`${styles.item} ${isFirst ? styles.first : ''} ${onClick ? styles.clickable : ''}`}
      onClick={onClick}
    >

      <div className={styles.titleRow}>
        <span className={styles.icon}>👥</span>
        <span className={styles.courseTitle}>{course.title}</span>
      </div>
      <div className={styles.lessonsGrid}>
        {sorted.length > 0 ? (
          sorted.map((lesson, idx) => (
            <span key={lesson.id} className={styles.lesson}>
              <strong>Aula {idx + 1}:</strong> {lesson.title}
            </span>
          ))
        ) : (
          // Fallback: exibe placeholders se não houver aulas cadastradas
          Array.from({ length: 4 }, (_, idx) => (
            <span key={idx} className={styles.lesson}>
              <strong>Aula {idx + 1}:</strong>{' '}
              <span className={styles.placeholder}>—</span>
            </span>
          ))
        )}
      </div>
    </div>
  );
}
