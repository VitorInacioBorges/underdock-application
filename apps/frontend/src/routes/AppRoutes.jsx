import { Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import CoursesPage from '../pages/CoursesPage';
import PanelPage from '../pages/PanelPage';
import LoginPage from '../pages/LoginPage';
import CourseDetailPage from '../pages/CourseDetailPage';
import LessonViewerPage from '../pages/LessonViewerPage';
import ExerciseNotebookViewerPage from '../pages/ExerciseNotebookViewerPage';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({ children }) {
  const { isAuthenticated, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando sessão...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/courses/:id" element={<CourseDetailPage />} />
      <Route
        path="/courses/:courseId/lessons/:lessonId"
        element={
          <PrivateRoute>
            <LessonViewerPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/painel"
        element={
          <PrivateRoute>
            <PanelPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/courses/:courseId/lessons/:lessonId/exercises/:exerciseId"
        element={
          <PrivateRoute>
            <ExerciseNotebookViewerPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}