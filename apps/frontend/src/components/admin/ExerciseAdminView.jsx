import { useState, useEffect } from "react";
import { listAllCourses } from "../../services/course-services/courseService";
import { listLessons } from "../../services/lesson-services/lessonService";
import { listExercises } from "../../services/exercise-services/exerciseService";
import ExerciseModal from "./ExerciseModal";
import styles from '../../styles/pages-styles/PanelPage.module.css';

export default function ExerciseAdminView() {
    const [courses, setCourses] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [selectedLessonId, setSelectedLessonId] = useState('');
    const [loadingLessons, setLoadingLessons] = useState(false);
    const [loadingExercises, setLoadingExercises] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        listAllCourses().then(setCourses).catch(console.error);
    }, []);

    useEffect(() => {
        setSelectedLessonId('');
        setLessons([]);
        setExercises([]);
        if (!selectedCourseId) return;
        setLoadingLessons(true);
        listLessons(selectedCourseId)
            .then(setLessons)
            .catch(console.error)
            .finally(() => setLoadingLessons(false));
    }, [selectedCourseId]);

    useEffect(() => {
        setExercises([]);
        if (!selectedLessonId) return;
        fetchExercises();
    }, [selectedLessonId]);

    const fetchExercises = async () => {
        setLoadingExercises(true);
        try {
            const data = await listExercises(selectedLessonId);
            setExercises(data);
        } catch (err) {
            console.error('Erro ao buscar exercícios', err);
            setExercises([]);
        } finally {
            setLoadingExercises(false);
        }
    };

    const handleCreate = () => {
        setSelectedExercise(null);
        setIsModalOpen(true);
    };

    const handleEdit = (exercise) => {
        setSelectedExercise(exercise);
        setIsModalOpen(true);
    };

    return (
        <div>
            <h2 className={styles.contentTitle}>Gerenciar Exercícios</h2>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div className={styles.formGroup} style={{ flex: 1, minWidth: '200px' }}>
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
                    <div className={styles.formGroup} style={{ flex: 1, minWidth: '200px' }}>
                        <label className={styles.label}>Selecione a Lição</label>
                        <select
                            className={styles.input}
                            value={selectedLessonId}
                            onChange={e => setSelectedLessonId(e.target.value)}
                            disabled={loadingLessons}
                        >
                            <option value="">-- Selecione uma lição --</option>
                            {lessons.map(l => (
                                <option key={l.id} value={l.id}>{l.title}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {selectedLessonId && (
                <>
                    <button
                        className={styles.submitBtn}
                        onClick={handleCreate}
                        style={{ marginBottom: '24px' }}
                    >
                        + Criar Exercício
                    </button>

                    <div className={styles.list}>
                        {loadingExercises && <p style={{ color: '#a0a0a0' }}>Carregando...</p>}
                        {!loadingExercises && exercises.map(exercise => (
                            <div key={exercise.id} className={styles.listItem}>
                                <div className={styles.itemInfo}>
                                    <span className={styles.itemName}>{exercise.title}</span>
                                    <span className={styles.itemSub} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                                        {exercise.description}
                                    </span>
                                </div>
                                <div className={styles.itemActions}>
                                    <button className={styles.actionBtn} onClick={() => handleEdit(exercise)}>Editar</button>
                                </div>
                            </div>
                        ))}
                        {!loadingExercises && exercises.length === 0 && (
                            <p style={{ color: '#a0a0a0' }}>Nenhum exercício nesta lição.</p>
                        )}
                    </div>
                </>
            )}

            {!selectedLessonId && (
                <p style={{ color: '#666', fontStyle: 'italic' }}>
                    {!selectedCourseId
                        ? 'Selecione um curso e depois uma lição para gerenciar exercícios.'
                        : 'Selecione uma lição para visualizar e gerenciar exercícios.'}
                </p>
            )}

            <ExerciseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                exercise={selectedExercise}
                lessonId={selectedLessonId}
                onSaved={fetchExercises}
                onDeleted={fetchExercises}
            />
        </div>
    );
}
