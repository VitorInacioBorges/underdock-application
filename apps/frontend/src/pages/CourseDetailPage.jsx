import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getCourse } from '../services/course-services/courseService';
import { listLessons } from '../services/lesson-services/lessonService';
import { createEnrollment, listEnrollments } from '../services/enrollment-services/enrollmentService';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/pages-styles/CourseDetailPage.module.css';

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      setLessonsLoading(true);

      try {
        const courseData = await getCourse(id);
        setCourse(courseData);
      } catch (err) {
        console.error('Erro ao buscar curso:', err);
        if (err.status === 404) {
          setError('Curso não encontrado.');
        } else if (err.status === 401 || err.status === 403) {
          setError('Você não tem permissão para acessar este curso.');
        } else {
          setError(err.message || 'Erro ao carregar detalhes do curso.');
        }
        setLoading(false);
        setLessonsLoading(false);
        return;
      }

      try {
        const lessonsData = await listLessons(id);
        setLessons(
          Array.isArray(lessonsData)
            ? [...lessonsData].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            : []
        );
      } catch (err) {
        console.error('Erro ao buscar aulas do curso:', err);
        setLessons([]);
      } finally {
        setLessonsLoading(false);
      }

      if (isAuthenticated && user?.id) {
        try {
          const userEnrollments = await listEnrollments({
            userId: user.id,
            courseId: id,
          });

          if (Array.isArray(userEnrollments) && userEnrollments.length > 0) {
            setEnrollment(userEnrollments[0]);
          } else {
            setEnrollment(null);
          }
        } catch (err) {
          console.error('Erro ao buscar matrícula:', err);
          setEnrollment(null);
        }
      } else {
        setEnrollment(null);
      }

      setLoading(false);
    }

    fetchData();
  }, [id, isAuthenticated, user]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }

    setEnrolling(true);
    try {
      const newEnrollment = await createEnrollment(id);
      setEnrollment(newEnrollment || { courseId: id });
    } catch (err) {
      setError(err.message || 'Erro ao realizar matrícula.');
    } finally {
      setEnrolling(false);
    }
  };

  const goToLesson = (lessonId) => {
    if (!lessonId || !enrollment) return;
    navigate(`/courses/${id}/lessons/${lessonId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) return null;
      return new Intl.DateTimeFormat('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.mainContent}>
          <div className={styles.stateContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Carregando conteúdo exclusivo...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.mainContent}>
          <div className={styles.stateContainer}>
            <h2 className={styles.errorTitle}>Ops!</h2>
            <p className={styles.errorMessage}>{error}</p>
            <button className={styles.actionBtn} onClick={() => navigate('/courses')}>
              Voltar para Cursos
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.mainContent}>
        <button className={styles.backLink} onClick={() => navigate('/courses')}>
          ← Voltar para listagem
        </button>

        {course && (
          <div className={styles.courseGrid}>
            <div className={styles.courseInfo}>
              <header className={styles.courseHeader}>
                <h1 className={styles.courseTitle}>{course.title}</h1>
                <div className={styles.metaInfo}>
                  <div className={styles.dateInfo}>
                    <span> 🗓️ </span>
                    <span> Lançado em {formatDate(course.createdAt) || 'Data indisponível'} </span>
                  </div>
                </div>
              </header>

              <section className={styles.descriptionSection}>
                <h3 className={styles.subTitle}>Sobre o curso</h3>
                <p>{course.description || 'Descrição indisponível.'}</p>
              </section>

              <section className={styles.lessonsSection}>
                <h3 className={styles.subTitle}>Conteúdo Programático</h3>

                {lessonsLoading ? (
                  <p>Carregando aulas...</p>
                ) : lessons.length > 0 ? (
                  <div className={styles.lessonsList}>
                    {lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className={`${styles.lessonItem} ${enrollment ? styles.lessonItemActive : ''}`}
                        onClick={() => goToLesson(lesson.id)}
                      >
                        <span className={styles.lessonOrder}>{String(index + 1).padStart(2, '0')}</span>
                        <span className={styles.lessonTitle}>{lesson.title}</span>
                        {enrollment && <span className={styles.lessonPlay}>▶</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Nenhuma aula cadastrada para este curso no momento.</p>
                )}
              </section>
            </div>

            <aside className={styles.ctaCard}>
              <div className={styles.ctaCardInner}>
                <div className={styles.ctaHeader}>
                  <span className={styles.priceTag}>GRATUITO</span>
                  <p className={styles.ctaSub}>Acesso total à trilha de aprendizado</p>
                </div>

                {enrollment ? (
                  <button
                    className={styles.primaryBtn}
                    onClick={() => goToLesson(lessons[0]?.id)}
                    disabled={!lessons.length}
                  >
                    {lessons.length ? 'CONTINUAR CURSO' : 'SEM AULAS DISPONÍVEIS'}
                  </button>
                ) : (
                  <button
                    className={styles.primaryBtn}
                    onClick={handleEnroll}
                    disabled={enrolling}
                  >
                    {enrolling ? 'MATRICULANDO...' : 'MATRICULAR-SE AGORA'}
                  </button>
                )}
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}