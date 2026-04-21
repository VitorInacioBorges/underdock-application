import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import LastCourseBanner from '../components/LastCourseBanner';
import CourseListItem from '../components/CourseListItem';
import { listEnrollments } from '../services/enrollment-services/enrollmentService';
import { getCourse } from '../services/course-services/courseService';
import { listLessons } from '../services/lesson-services/lessonService';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/pages-styles/DashboardPage.module.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    async function fetchDashboardData() {
      setLoading(true);
      setError('');

      try {
        const enrollments = await listEnrollments();

        if (!enrollments || enrollments.length === 0) {
          setCourses([]);
          return;
        }

        const courseData = await Promise.all(
          enrollments.map(async (enrollment) => {
            const [course, lessons] = await Promise.all([
              getCourse(enrollment.courseId).catch(() => null),
              listLessons(enrollment.courseId).catch(() => []),
            ]);

            return {
              course,
              lessons: lessons || [],
              enrolledAt: enrollment.enrolledAt || enrollment.createdAt,
            };
          })
        );

        const valid = courseData.filter((d) => d.course !== null);

        valid.sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt));

        setCourses(valid);
      } catch (err) {
        setError(err.message || 'Erro ao carregar seus cursos.');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const firstName = user?.name?.split(' ')[0] ?? '';
  const lastCourse = courses[0]?.course ?? null;
  const lastLessons = courses[0]?.lessons ?? [];

  return (
    <div className={styles.page}>
      <Header />

      <section className={styles.welcome}>
        <div className={styles.welcomeInner}>
          <h1 className={styles.greeting}>Bem-vindo, {firstName}.</h1>
          <p className={styles.greetingSub}>
            Gerencie seus exercícios, continue de onde parou ou descubra novas trilhas de aprendizado
          </p>

          <div className={styles.actions}>
            <button
              id="btn-explore-courses"
              className={styles.btnPrimary}
              onClick={() => navigate('/courses')}
            >
              Explorar Cursos
            </button>

            {user?.role === 'admin' && (
              <button
                id="btn-painel"
                className={styles.btnGhost}
                onClick={() => navigate('/painel')}
              >
                Painel Administrativo
              </button>
            )}
          </div>
        </div>
      </section>

      {lastCourse && (
        <LastCourseBanner
          course={lastCourse}
          onViewLesson={() => {
            if (lastLessons[0]?.id) {
              navigate(`/courses/${lastCourse.id}/lessons/${lastLessons[0].id}`);
            } else {
              navigate(`/courses/${lastCourse.id}`);
            }
          }}
        />
      )}

      <section className={styles.recent}>
        <div className={styles.recentInner}>
          <h2 className={styles.sectionTitle}>Cursos recentes</h2>
          <p className={styles.sectionSub}>Acesse seu histórico e acompanhe mudanças</p>

          <div className={styles.courseList} id="course-list">
            {loading && (
              <p className={styles.stateMsg} id="loading-msg">Carregando cursos...</p>
            )}

            {!loading && error && (
              <p className={styles.errorMsg} id="error-msg">{error}</p>
            )}

            {!loading && !error && courses.length === 0 && (
              <p className={styles.stateMsg} id="empty-msg">
                Você ainda não está matriculado em nenhum curso.
              </p>
            )}

            {!loading && !error && courses.map(({ course, lessons }, idx) => (
              <CourseListItem
                key={course.id}
                course={course}
                lessons={lessons}
                isFirst={idx === 0}
                onClick={() => {
                  if (lessons[0]?.id) {
                    navigate(`/courses/${course.id}/lessons/${lessons[0].id}`);
                  } else {
                    navigate(`/courses/${course.id}`);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>©2025 FE.dev • v0.1 •</span>
          <div className={styles.footerLinks}>
            <a href="#" id="link-docs">Docs / Glossário</a>
            <a href="#" id="link-privacy">Privacidade</a>
          </div>
        </div>
      </footer>

      <button
        id="btn-logout"
        className={styles.logoutBtn}
        onClick={handleLogout}
        title="Sair"
      >
        Sair
      </button>
    </div>
  );
}