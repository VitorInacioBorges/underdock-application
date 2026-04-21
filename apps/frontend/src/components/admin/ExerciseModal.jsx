import { useState, useEffect, useRef } from 'react';
import ModalShell from '../ModalShell';
import { createExercise, updateExercise, deleteExercise } from '../../services/exercise-services/exerciseService';
import styles from '../../styles/components-styles/Modal.module.css';

export default function ExerciseModal({ isOpen, onClose, exercise, lessonId, onSaved, onDeleted }) {
    const [form, setForm] = useState({ title: '', description: '' });
    const [notebookFile, setNotebookFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });
    const fileInputRef = useRef(null);
    const isEdit = !!exercise;

    useEffect(() => {
        if (exercise) {
            setForm({ 
                title: exercise.title || '', 
                description: exercise.description || ''
            });
        } else {
            setForm({ title: '', description: '' });
        }
        setNotebookFile(null);
        setMsg({ type: '', text: '' });
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [exercise, isOpen]);

    function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.ipynb')) {
            setMsg({ type: 'error', text: 'Apenas arquivos .ipynb são aceitos.' });
            e.target.value = '';
            setNotebookFile(null);
            return;
        }
        setMsg({ type: '', text: '' });
        setNotebookFile(file);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMsg({ type: '', text: '' });
        
        if (!form.title || !form.description || (!lessonId && !isEdit)) {
            return setMsg({ type: 'error', text: 'Preencha os dados e certifique-se que uma lição base foi selecionada.' });
        }
        
        setLoading(true);
        try {
            const payload = {
                title: form.title,
                description: form.description
            };

            if (isEdit) {
                await updateExercise(exercise.id, payload, notebookFile || undefined);
                setMsg({ type: 'success', text: 'Exercício atualizado!' });
            } else {
                payload.lessonId = lessonId;
                await createExercise(payload, notebookFile || undefined);
                setMsg({ type: 'success', text: 'Exercício criado!' });
            }
            setTimeout(() => {
                onSaved();
                onClose();
            }, 1000);
        } catch (err) {
            setMsg({ type: 'error', text: err.message || 'Erro ao processar exercício.' });
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!confirm('Tem certeza que deseja excluir este exercício?')) return;
        setLoading(true);
        try {
            await deleteExercise(exercise.id);
            setMsg({ type: 'success', text: 'Exercício excluído!' });
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
        <ModalShell isOpen={isOpen} onClose={onClose} title={isEdit ? 'Editar Exercício' : 'Criar Exercício'}>
            {msg.text && <div className={`${styles.msg} ${styles[msg.type]}`}>{msg.text}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Título do Exercício</label>
                    <input className={styles.input} type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} disabled={loading} required spellCheck={false}/>
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Enunciado (Descrição / Pergunta)</label>
                    <textarea className={styles.textarea} value={form.description} onChange={e => setForm({...form, description: e.target.value})} disabled={loading} required/>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Notebook (.ipynb)</label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".ipynb"
                        onChange={handleFileChange}
                        disabled={loading}
                        className={styles.input}
                        style={{ paddingTop: '8px' }}
                    />
                    {notebookFile && (
                        <span style={{ fontSize: '12px', color: '#aaa', marginTop: '4px', display: 'block' }}>
                            Selecionado: {notebookFile.name} ({(notebookFile.size / 1024).toFixed(1)} KB)
                        </span>
                    )}
                    {isEdit && exercise?.notebookFileName && !notebookFile && (
                        <span style={{ fontSize: '12px', color: '#8bc34a', marginTop: '4px', display: 'block' }}>
                            📎 Notebook atual: {exercise.notebookFileName}
                        </span>
                    )}
                </div>
                
                <div className={styles.actions}>
                    {isEdit && (
                        <button type="button" onClick={handleDelete} className={styles.dangerBtn} disabled={loading} style={{ marginRight: 'auto' }}>
                            Excluir Exercício
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
