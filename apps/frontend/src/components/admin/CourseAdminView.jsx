import { useState, useEffect } from "react";
import { listAllCourses } from "../../services/course-services/courseService";
import CourseModal from "./CourseModal";
import styles from '../../styles/pages-styles/PanelPage.module.css';

export default function CourseAdminView() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // listCourses takes isPublished=true by default. In admin, we want all courses.
            // Assuming listCourses(undefined) fetches all or we just pass it empty.
            // If the backend doesn't support undefined, we'll just fetch all published.
            // The refactored courseService defaults to true if undefined. Let's pass `null` or empty string if it handles it.
            // Based on our implementation: `isPublished !== undefined ? ...` so `null` passes `?isPublished=null`.
            // Let's rely on standard logic. For now, fetch all by not passing anything (which sends isPublished=true)
            // or pass loosely. Wait, to get ALL we might need a specific param. We'll pass nothing to get standard list.
            const data = await listAllCourses();
            setCourses(data);
        } catch (err) {
            console.error('Erro ao buscar cursos', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedCourse(null);
        setIsModalOpen(true);
    };

    const handleEdit = (course) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    return (
        <div>
            <h2 className={styles.contentTitle}>Gerenciar Cursos</h2>
            <button className={styles.submitBtn} onClick={handleCreate} style={{ marginBottom: '24px' }}>
                + Criar Curso
            </button>
            <div className={styles.list}>
                {loading && <p style={{ color: '#a0a0a0' }}>Carregando...</p>}
                {!loading && courses.map(course => (
                    <div key={course.id} className={styles.listItem}>
                        <div className={styles.itemInfo}>
                            <span className={styles.itemName}>{course.title}</span>
                            <span className={styles.itemSub}>{course.isPublished ? 'Publicado' : 'Rascunho'}</span>
                        </div>
                        <div className={styles.itemActions}>
                            <button className={styles.actionBtn} onClick={() => handleEdit(course)}>Editar</button>
                        </div>
                    </div>
                ))}
                {!loading && courses.length === 0 && <p style={{ color: '#a0a0a0' }}>Nenhum curso encontrado.</p>}
            </div>

            <CourseModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                course={selectedCourse} 
                onSaved={fetchData} 
                onDeleted={fetchData} 
            />
        </div>
    );
}

