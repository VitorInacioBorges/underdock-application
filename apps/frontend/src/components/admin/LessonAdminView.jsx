import { useState, useEffect } from "react";
import { listAllCourses } from "../../services/course-services/courseService";
import { listLessons } from "../../services/lesson-services/lessonService";
import LessonModal from "./LessonModal";
import styles from '../../styles/pages-styles/PanelPage.module.css';

export default function LessonAdminView() {
    const [courses, setCourses] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        listAllCourses().then(setCourses).catch(console.error);
    }, []);

    useEffect(() => {
        if (!selectedCourseId) {
            setLessons([]);
            return;
        }
        fetchLessons();
    }, [selectedCourseId]);

    const fetchLessons = async () => {
        setLoading(true);
        try {
            const data = await listLessons(selectedCourseId);
            setLessons(data);
        } catch (err) {
            console.error('Erro ao buscar lições', err);
            setLessons([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedLesson(null);
        setIsModalOpen(true);
    };

    const handleEdit = (lesson) => {
        setSelectedLesson(lesson);
        setIsModalOpen(true);
    };

    return (
        <div>
            <h2 className={styles.contentTitle}>Gerenciar Lições</h2>

            <div className={styles.formGroup} style={{ marginBottom: '24px', maxWidth: '360px' }}>
                <label className={styles.label}>Selecione o Curso</label>
                <select
                    className={styles.input}
                    value={selectedCourseId}
                    onChange={e => setSelectedCourseId(e.target.value)}
                >
                    <option value="">-- Selecione um curso --</option>
                    {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                </select>
            </div>

            {selectedCourseId && (
                <>
                    <button
                        className={styles.submitBtn}
                        onClick={handleCreate}
                        style={{ marginBottom: '24px' }}
                    >
                        + Criar Lição
                    </button>

                    <div className={styles.list}>
                        {loading && <p style={{ color: '#a0a0a0' }}>Carregando...</p>}
                        {!loading && lessons.map(lesson => (
                            <div key={lesson.id} className={styles.listItem}>
                                <div className={styles.itemInfo}>
                                    <span className={styles.itemName}>{lesson.title}</span>
                                    <span className={styles.itemSub}>Ordem: {lesson.order} · {lesson.isPublished ? 'Publicado' : 'Rascunho'}</span>
                                </div>
                                <div className={styles.itemActions}>
                                    <button className={styles.actionBtn} onClick={() => handleEdit(lesson)}>Editar</button>
                                </div>
                            </div>
                        ))}
                        {!loading && lessons.length === 0 && (
                            <p style={{ color: '#a0a0a0' }}>Nenhuma lição encontrada para este curso.</p>
                        )}
                    </div>
                </>
            )}

            {!selectedCourseId && (
                <p style={{ color: '#666', fontStyle: 'italic' }}>Selecione um curso para visualizar e gerenciar suas lições.</p>
            )}

            <LessonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                lesson={selectedLesson}
                courseId={selectedCourseId}
                onSaved={fetchLessons}
                onDeleted={fetchLessons}
            />
        </div>
    );
}
