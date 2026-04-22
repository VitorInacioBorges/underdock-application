import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { listCourses } from '../services/course-services/courseService';
import styles from '../styles/pages-styles/CoursesPage.module.css';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listCourses();
      setCourses(data);
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao buscar os cursos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      return new Intl.DateTimeFormat('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch {
      return null;
    }
  };

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.mainContent}>
        <h1 className={styles.heroText}>
          Disseminando conhecimento para todos os cantos do Brasil. Cursos prontos para todos e acessível a todos.
        </h1>

        <h2 className={styles.sectionTitle}>Cursos Disponíveis</h2>

        {loading ? (
          <div className={styles.stateContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Carregando cursos de excelência...</p>
          </div>
        ) : error ? (
          <div className={styles.stateContainer}>
            <p className={styles.errorText}>❌ {error}</p>
            <button className={styles.retryBtn} onClick={fetchCourses}>Tentar novamente</button>
          </div>
        ) : courses.length === 0 ? (
          <div className={styles.stateContainer}>
            <h3 className={styles.emptyTitle}>Nenhum curso disponível</h3>
            <p>No momento não há cursos publicados. Volte em breve!</p>
          </div>
        ) : (
          <div className={styles.coursesList}>
            {courses.map(course => (
              <article
                key={course.id}
                className={styles.card}
                onClick={() => navigate(`/courses/${course.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.headerIcon}>☰</span>
                  <span className={styles.cardTitle}>{course.title}</span>
                </div>

                <div className={styles.cardBody}>
                  <p className={styles.cardDescription}>
                    {course.description}
                    {course.createdAt && formatDate(course.createdAt) && (
                      <span className={styles.cardDate}>Lançado em {formatDate(course.createdAt)}</span>
                    )}
                  </p>
                </div>

                <div className={styles.detailsLink}>
                  <span>VER DETALHES</span>
                  <span>➜</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

