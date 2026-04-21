import { useState, useEffect } from 'react';
import ModalShell from '../ModalShell';
import { createLesson, updateLesson, deleteLesson } from '../../services/lesson-services/lessonService';
import styles from '../../styles/components-styles/Modal.module.css';

export default function LessonModal({ isOpen, onClose, lesson, courseId, onSaved, onDeleted }) {
    const [form, setForm] = useState({ title: '', videoId: '', order: 1, isPublished: true });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });
    const isEdit = !!lesson;

    useEffect(() => {
        if (lesson) {
            setForm({ 
                title: lesson.title || '', 
                videoId: lesson.videoId || '',
                order: lesson.order || 1,
                isPublished: lesson.isPublished !== undefined ? lesson.isPublished : true 
            });
        } else {
            setForm({ title: '', videoId: '', order: 1, isPublished: true });
        }
        setMsg({ type: '', text: '' });
    }, [lesson, isOpen]);

    async function handleSubmit(e) {
        e.preventDefault();
        setMsg({ type: '', text: '' });
        
        if (!form.title || !form.videoId || !courseId) {
            return setMsg({ type: 'error', text: 'Preencha título, ID de Vídeo e garanta que o Curso está selecionado.' });
        }
        
        setLoading(true);
        try {
            const payload = {
                title: form.title,
                videoId: form.videoId,
                order: parseInt(form.order, 10),
                isPublished: form.isPublished
            };

            if (isEdit) {
                await updateLesson(lesson.id, payload);
                setMsg({ type: 'success', text: 'Lição atualizada!' });
            } else {
                payload.courseId = courseId;
                await createLesson(payload);
                setMsg({ type: 'success', text: 'Lição criada!' });
            }
            setTimeout(() => {
                onSaved();
                onClose();
            }, 1000);
        } catch (err) {
            setMsg({ type: 'error', text: err.message || 'Erro ao processar lição.' });
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!confirm('Tem certeza que deseja excluir esta lição?')) return;
        setLoading(true);
        try {
            await deleteLesson(lesson.id);
            setMsg({ type: 'success', text: 'Lição excluída!' });
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
        <ModalShell isOpen={isOpen} onClose={onClose} title={isEdit ? 'Editar Lição' : 'Criar Nova Lição'}>
            {msg.text && <div className={`${styles.msg} ${styles[msg.type]}`}>{msg.text}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Título da Lição</label>
                    <input className={styles.input} type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} disabled={loading} required spellCheck={false}/>
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Video ID (Ex: dQw4w9WgXcQ)</label>
                    <input className={styles.input} type="text" value={form.videoId} onChange={e => setForm({...form, videoId: e.target.value})} disabled={loading} required spellCheck={false}/>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label className={styles.label}>Demanda Posição (Ordem)</label>
                        <input className={styles.input} type="number" min="1" value={form.order} onChange={e => setForm({...form, order: e.target.value})} disabled={loading} required />
                    </div>
                    <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '20px' }}>
                        <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                            <input type="checkbox" checked={form.isPublished} onChange={e => setForm({...form, isPublished: e.target.checked})} disabled={loading} />
                            Publicado
                        </label>
                    </div>
                </div>
                
                <div className={styles.actions}>
                    {isEdit && (
                        <button type="button" onClick={handleDelete} className={styles.dangerBtn} disabled={loading} style={{ marginRight: 'auto' }}>
                            Excluir Lição
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

