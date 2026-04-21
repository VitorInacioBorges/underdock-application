import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import { getLesson, listLessons } from '../services/lesson-services/lessonService';
import { listExercises } from '../services/exercise-services/exerciseService';
import { listEnrollments } from '../services/enrollment-services/enrollmentService';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/pages-styles/LessonViewerPage.module.css';

export default function LessonViewerPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [lesson, setLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function init() {
      if (!isAuthenticated) {
        navigate('/login', { state: { from: `/courses/${courseId}/lessons/${lessonId}` } });
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const enrollments = await listEnrollments({ courseId });

        if (!Array.isArray(enrollments) || enrollments.length === 0) {
          setError('Você não está matriculado neste curso.');
          return;
        }

        const [lessonData, lessonsListData, exercisesData] = await Promise.all([
          getLesson(lessonId),
          listLessons(courseId),
          listExercises(lessonId),
        ]);

        setLesson(lessonData);
        setLessons(
          Array.isArray(lessonsListData)
            ? [...lessonsListData].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            : []
        );
        setExercises(Array.isArray(exercisesData) ? exercisesData : []);
      } catch (err) {
        if (err.status === 401) {
          setError('Sua sessão expirou. Faça login novamente.');
        } else if (err.status === 403) {
          setError('Você não tem permissão para acessar esta aula.');
        } else if (err.status === 404) {
          setError('Aula não encontrada.');
        } else {
          setError(err.message || 'Erro ao carregar aula.');
        }
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [courseId, lessonId, isAuthenticated, user, navigate]);

  const handleOpenNotebook = (exerciseId) => {
    navigate(`/courses/${courseId}/lessons/${lessonId}/exercises/${exerciseId}`);
  };

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <span className={styles.spinner}></span>
        <p>Preparando seu ambiente de aprendizado...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorPage}>
        <h2>Acesso Restrito</h2>
        <p>{error}</p>
        <button onClick={() => navigate(`/courses/${courseId}`)}>Voltar ao curso</button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.container}>
        <main className={styles.mainContent}>
          <div className={styles.videoWrapper}>
            <iframe
              src={`https://www.youtube.com/embed/${lesson?.videoId}?autoplay=0&rel=0`}
              title={lesson?.title || 'Aula'}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className={styles.contentBody}>
            <h1 className={styles.lessonTitle}>{lesson?.title}</h1>

            <div className={styles.infoGrid}>
              <section className={styles.summarySection}>
                <h3 className={styles.sectionTitle}>Resumo da aula</h3>
                <p className={styles.summaryText}>
                  {lesson?.summary || 'Nenhum resumo disponível para esta aula.'}
                </p>
              </section>

              <section className={styles.topicsSection}>
                <h3 className={styles.sectionTitle}>Tópicos</h3>

                {Array.isArray(lesson?.topics) && lesson.topics.length > 0 ? (
                  <ul className={styles.topicsList}>
                    {lesson.topics.map((topic, i) => (
                      <li key={i}>{topic}</li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.summaryText}>Nenhum tópico disponível para esta aula.</p>
                )}
              </section>
            </div>
          </div>
        </main>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <h4 className={styles.sidebarHeader}>Lista de aulas</h4>

            <div className={styles.lessonNav}>
              {lessons.map((l) => (
                <Link
                  key={l.id}
                  to={`/courses/${courseId}/lessons/${l.id}`}
                  className={`${styles.navItem} ${String(l.id) === String(lessonId) ? styles.activeNavItem : ''}`}
                >
                  <span className={styles.navOrder}>
                    {String(l.order ?? 0).padStart(2, '0')}
                  </span>
                  <span className={styles.navTitle}>{l.title}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.sidebarSection}>
            <h4 className={styles.sidebarHeader}>Exercícios & Notebooks</h4>

            <div className={styles.exerciseNav}>
              {exercises.length > 0 ? (
                exercises.map((ex) => (
                  <button
                    key={ex.id}
                    className={styles.exerciseBtn}
                    onClick={() => handleOpenNotebook(ex.id)}
                  >
                    <span className={styles.notebookIcon}>📓</span>
                    <div className={styles.exerciseInfo}>
                      <span className={styles.exerciseTitle}>{ex.title}</span>
                      <span className={styles.exerciseAction}>Abrir notebook em nova aba</span>
                    </div>
                  </button>
                ))
              ) : (
                <p className={styles.emptyExercises}>Esta aula não possui exercícios anexados.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}