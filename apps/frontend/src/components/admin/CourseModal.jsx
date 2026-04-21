import { useState, useEffect } from 'react';
import ModalShell from '../ModalShell';
import { createCourse, updateCourse, deleteCourse } from '../../services/course-services/courseService';
import styles from '../../styles/components-styles/Modal.module.css';

export default function CourseModal({ isOpen, onClose, course, onSaved, onDeleted }) {
    const [form, setForm] = useState({ title: '', description: '', isPublished: false });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });
    const isEdit = !!course;

    useEffect(() => {
        if (course) {
            setForm({
                title: course.title || '',
                description: course.description || '',
                isPublished: course.isPublished === true,
            });
        } else {
            setForm({ title: '', description: '', isPublished: false });
        }
        setMsg({ type: '', text: '' });
    }, [course, isOpen]);

    async function handleSubmit(e) {
        e.preventDefault();
        setMsg({ type: '', text: '' });
        if (!form.title || !form.description) return setMsg({ type: 'error', text: 'Preencha os campos obrigatórios.' });
        
        setLoading(true);
        try {
            const payload = {
                title: form.title,
                description: form.description,
                isPublished: form.isPublished,
            };

            if (isEdit) {
                await updateCourse(course.id, payload);
                setMsg({ type: 'success', text: 'Curso atualizado!' });
            } else {
                await createCourse(payload);
                setMsg({ type: 'success', text: 'Curso criado!' });
            }
            setTimeout(() => {
                onSaved();
                onClose();
            }, 1000);
        } catch (err) {
            setMsg({ type: 'error', text: err.message || 'Erro ao processar curso.' });
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!confirm('Tem certeza que deseja excluir o curso?')) return;
        setLoading(true);
        try {
            await deleteCourse(course.id);
            setMsg({ type: 'success', text: 'Curso excluído!' });
            setTimeout(() => {
                onDeleted();
                onClose();
            }, 1000);
        } catch (err) {
            setMsg({ type: 'error', text: err.message || 'Erro ao excluir' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <ModalShell isOpen={isOpen} onClose={onClose} title={isEdit ? 'Editar Curso' : 'Criar Curso'}>
            {msg.text && <div className={`${styles.msg} ${styles[msg.type]}`}>{msg.text}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Título do Curso</label>
                    <input className={styles.input} type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} disabled={loading} required spellCheck={false}/>
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Descrição</label>
                    <textarea className={styles.textarea} value={form.description} onChange={e => setForm({...form, description: e.target.value})} disabled={loading} required/>
                </div>
                <div className={styles.formGroup} style={{ paddingTop: '4px' }}>
                    <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                        <input
                            type="checkbox"
                            checked={form.isPublished}
                            onChange={e => setForm({...form, isPublished: e.target.checked})}
                            disabled={loading}
                        />
                        Publicado
                    </label>
                </div>
                
                <div className={styles.actions}>
                    {isEdit && (
                        <button type="button" onClick={handleDelete} className={styles.dangerBtn} disabled={loading} style={{ marginRight: 'auto' }}>
                            Excluir Curso
                        </button>
                    )}
                    <button type="button" onClick={onClose} className={styles.submitBtn} style={{ background: '#333' }} disabled={loading}>Cancelar</button>
                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Processando...' : 'Salvar'}
                    </button>
                </div>
            </form>
        </ModalShell>
    );
}
