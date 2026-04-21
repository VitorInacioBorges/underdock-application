import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { updateUser, deleteMyAccount } from "../services/user-services/userService";
import { listEnrollments } from "../services/enrollment-services/enrollmentService";
import { getCourse } from "../services/course-services/courseService";
import { listLessons } from "../services/lesson-services/lessonService";
import { useAuth } from "../contexts/AuthContext";
import CourseAdminView from "../components/admin/CourseAdminView";
import LessonAdminView from "../components/admin/LessonAdminView";
import ExerciseAdminView from "../components/admin/ExerciseAdminView";
import styles from '../styles/pages-styles/PanelPage.module.css';

export default function PanelPage() {
    const navigate = useNavigate();
    const { user, logout, forceRelogin, refreshCurrentUser } = useAuth();

    const [activeTab, setActiveTab] = useState('profile');
    const [message, setMessage] = useState({ type: '', text: '' });

    const [editName, setEditName] = useState(user?.name || '');
    const [editPassword, setEditPassword] = useState('');

    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [enrolledCoursesLoading, setEnrolledCoursesLoading] = useState(false);
    const [enrolledCoursesError, setEnrolledCoursesError] = useState('');

    useEffect(() => {
        if (!user) return;
        setEditName(user.name || '');
    }, [user]);

    useEffect(() => {
        if (!user) return;
        if (activeTab !== 'courses') return;

        async function fetchEnrolledCourses() {
            setEnrolledCoursesLoading(true);
            setEnrolledCoursesError('');

            try {
                const enrollments = await listEnrollments({ userId: user.id });

                if (!Array.isArray(enrollments) || enrollments.length === 0) {
                    setEnrolledCourses([]);
                    return;
                }

                const enriched = await Promise.all(
                    enrollments.map(async (enrollment) => {
                        const [course, lessons] = await Promise.all([
                            getCourse(enrollment.courseId).catch(() => null),
                            listLessons(enrollment.courseId).catch(() => []),
                        ]);

                        return {
                            enrollment,
                            course,
                            lessons: Array.isArray(lessons) ? lessons : [],
                        };
                    })
                );

                const valid = enriched.filter((item) => item.course);

                valid.sort((a, b) => {
                    const dateA = new Date(a.enrollment.createdAt || a.enrollment.enrolledAt || 0);
                    const dateB = new Date(b.enrollment.createdAt || b.enrollment.enrolledAt || 0);
                    return dateB - dateA;
                });

                setEnrolledCourses(valid);
            } catch (err) {
                setEnrolledCoursesError(err.message || 'Erro ao carregar cursos matriculados.');
                setEnrolledCourses([]);
            } finally {
                setEnrolledCoursesLoading(false);
            }
        }

        fetchEnrolledCourses();
    }, [user, activeTab]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        try {
            await updateUser({
                email: user.email,
                name: editName,
                password: editPassword,
                role: user.role,
            });

            if (editPassword) {
                setMessage({
                    type: 'success',
                    text: 'Senha atualizada! Por favor, faça login novamente...',
                });
                setTimeout(() => forceRelogin(), 2000);
            } else {
                await refreshCurrentUser();
                setMessage({
                    type: 'success',
                    text: 'Perfil atualizado com sucesso!',
                });
            }
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.message || 'Erro ao atualizar',
            });
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm('Tem certeza que deseja deletar sua conta? Esta ação é irreversível.')) return;

        try {
            await deleteMyAccount();
            logout();
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.message || 'Erro ao deletar conta',
            });
        }
    };

    const handleContinueCourse = (courseId, lessons) => {
        const sortedLessons = [...(lessons || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        const firstLessonId = sortedLessons[0]?.id;

        if (firstLessonId) {
            navigate(`/courses/${courseId}/lessons/${firstLessonId}`);
            return;
        }

        navigate(`/courses/${courseId}`);
    };

    if (!user) return null;

    return (
        <div className={styles.page}>
            <Header />

            <div className={styles.container}>
                <aside className={styles.sidebar}>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'profile' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Meu Perfil
                    </button>

                    <button
                        className={`${styles.tabBtn} ${activeTab === 'courses' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('courses')}
                    >
                        Cursos Matriculados
                    </button>

                    {user.role === 'admin' && (
                        <div className={styles.adminGroup}>
                            <span className={styles.adminTitle}>Administração</span>

                            <button
                                className={`${styles.tabBtn} ${activeTab === 'admin-courses' ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab('admin-courses')}
                            >
                                Gerenciar Cursos
                            </button>

                            <button
                                className={`${styles.tabBtn} ${activeTab === 'admin-lessons' ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab('admin-lessons')}
                            >
                                Gerenciar Lições
                            </button>

                            <button
                                className={`${styles.tabBtn} ${activeTab === 'admin-exercises' ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab('admin-exercises')}
                            >
                                Gerenciar Exercícios
                            </button>
                        </div>
                    )}
                </aside>

                <main className={styles.content}>
                    {message.text && (
                        <div
                            className={`${styles.message} ${styles[message.type]}`}
                            style={{ marginBottom: '24px' }}
                        >
                            {message.text}
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div>
                            <h2 className={styles.contentTitle}>Meu Perfil</h2>

                            <form className={styles.form} onSubmit={handleUpdateProfile}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Email (apenas leitura)</label>
                                    <input className={styles.input} type="email" value={user.email} disabled />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Nome</label>
                                    <input
                                        className={styles.input}
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Nova Senha</label>
                                    <input
                                        className={styles.input}
                                        type="password"
                                        placeholder="Deixe em branco para manter"
                                        value={editPassword}
                                        onChange={(e) => setEditPassword(e.target.value)}
                                    />
                                </div>

                                <button type="submit" className={styles.submitBtn}>
                                    Salvar Alterações
                                </button>
                            </form>

                            <button onClick={handleDeleteAccount} className={styles.dangerBtn}>
                                Deletar Minha Conta
                            </button>
                        </div>
                    )}

                    {activeTab === 'courses' && (
                        <div>
                            <h2 className={styles.contentTitle}>Cursos Matriculados</h2>

                            <div className={styles.list}>
                                {enrolledCoursesLoading && (
                                    <p style={{ color: '#a0a0a0' }}>Carregando seus cursos...</p>
                                )}

                                {!enrolledCoursesLoading && enrolledCoursesError && (
                                    <p style={{ color: '#ff6b6b' }}>{enrolledCoursesError}</p>
                                )}

                                {!enrolledCoursesLoading && !enrolledCoursesError && enrolledCourses.length > 0 ? (
                                    enrolledCourses.map(({ enrollment, course, lessons }) => (
                                        <div key={enrollment.id} className={styles.listItem}>
                                            <div className={styles.itemInfo}>
                                                <span className={styles.itemName}>{course.title}</span>
                                                <span className={styles.itemSub}>
                                                    Matriculado em:{' '}
                                                    {new Date(
                                                        enrollment.createdAt || enrollment.enrolledAt
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <div className={styles.itemActions}>
                                                <button
                                                    className={styles.actionBtn}
                                                    onClick={() => handleContinueCourse(course.id, lessons)}
                                                >
                                                    Continuar
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : null}

                                {!enrolledCoursesLoading &&
                                    !enrolledCoursesError &&
                                    enrolledCourses.length === 0 && (
                                        <p style={{ color: '#a0a0a0' }}>
                                            Você ainda não está matriculado em nenhum curso.
                                        </p>
                                    )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'admin-courses' && <CourseAdminView />}
                    {activeTab === 'admin-lessons' && <LessonAdminView />}
                    {activeTab === 'admin-exercises' && <ExerciseAdminView />}
                </main>
            </div>

            <Footer />
        </div>
    );
}