import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

import Header from '../components/Header';
import { getExerciseNotebookContent } from '../services/exercise-services/exerciseService';
import styles from '../styles/pages-styles/ExerciseNotebookViewerPage.module.css';

function sourceToText(source) {
    if (Array.isArray(source)) return source.join('');
    return source || '';
}

function outputToText(output) {
    if (!output) return '';

    if (output.output_type === 'stream') {
        return sourceToText(output.text);
    }

    if (output.output_type === 'error') {
        return Array.isArray(output.traceback)
            ? output.traceback.join('\n')
            : output.evalue || 'Erro no output';
    }

    if (output.data?.['text/plain']) {
        return sourceToText(output.data['text/plain']);
    }

    return '';
}

function renderOutput(output, idx) {
    const imageBase64 = output?.data?.['image/png'];
    const htmlOutput = output?.data?.['text/html'];
    const text = outputToText(output);

    return (
        <div key={idx} className={styles.outputBlock}>
            {imageBase64 && (
                <img
                    src={`data:image/png;base64,${imageBase64}`}
                    alt="Output"
                    className={styles.outputImage}
                />
            )}

            {htmlOutput && (
                <div className={styles.htmlOutput}>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    >
                        {Array.isArray(htmlOutput) ? htmlOutput.join('') : htmlOutput}
                    </ReactMarkdown>
                </div>
            )}

            {text && (
                <pre className={styles.outputText}>
                    <code>{text}</code>
                </pre>
            )}
        </div>
    );
}

export default function ExerciseNotebookViewerPage() {
    const navigate = useNavigate();
    const { courseId, lessonId, exerciseId } = useParams();

    const [notebook, setNotebook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadNotebook() {
            setLoading(true);
            setError('');

            try {
                const data = await getExerciseNotebookContent(exerciseId);
                setNotebook(data);
            } catch (err) {
                if (err.status === 401) {
                    setError('Sua sessão expirou. Faça login novamente.');
                } else if (err.status === 403) {
                    setError('Você não tem permissão para acessar este notebook.');
                } else if (err.status === 404) {
                    setError('Notebook não encontrado.');
                } else {
                    setError(err.message || 'Erro ao carregar notebook.');
                }
            } finally {
                setLoading(false);
            }
        }

        loadNotebook();
    }, [exerciseId]);

    const cells = useMemo(() => {
        if (!notebook?.cells || !Array.isArray(notebook.cells)) return [];
        return notebook.cells;
    }, [notebook]);

    if (loading) {
        return (
            <div className={styles.page}>
                <Header />
                <main className={styles.main}>
                    <div className={styles.stateBox}>
                        <div className={styles.spinner}></div>
                        <p>Carregando notebook...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.page}>
                <Header />
                <main className={styles.main}>
                    <div className={styles.stateBox}>
                        <h2>Ops!</h2>
                        <p>{error}</p>
                        <button
                            className={styles.backBtn}
                            onClick={() => navigate(`/courses/${courseId}/lessons/${lessonId}`)}
                        >
                            Voltar para a aula
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <Header />

            <main className={styles.main}>
                <div className={styles.topbar}>
                    <button
                        className={styles.backBtn}
                        onClick={() => navigate(`/courses/${courseId}/lessons/${lessonId}`)}
                    >
                        ← Voltar para a aula
                    </button>

                    <div className={styles.meta}>
                        <span className={styles.badge}>Notebook</span>
                        <span className={styles.badge}>Exercício {exerciseId?.slice(0, 8)}</span>
                    </div>
                </div>

                <section className={styles.notebookShell}>
                    {cells.length === 0 ? (
                        <div className={styles.emptyBox}>
                            Este notebook não possui células renderizáveis.
                        </div>
                    ) : (
                        <div className={styles.notebookDocument}>
                            {cells.map((cell, index) => {
                                const sourceText = sourceToText(cell.source);

                                if (cell.cell_type === 'markdown') {
                                    return (
                                        <section key={index} className={styles.notebookSection}>
                                            <div className={styles.markdownCell}>
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                                                >
                                                    {sourceText}
                                                </ReactMarkdown>
                                            </div>
                                        </section>
                                    );
                                }

                                if (cell.cell_type === 'code') {
                                    return (
                                        <section key={index} className={styles.notebookSection}>
                                            <div className={styles.codeBlockWrap}>
                                                <div className={styles.codeLabel}>Código</div>

                                                <pre className={styles.codeCell}>
                                                    <code>{sourceText}</code>
                                                </pre>

                                                {Array.isArray(cell.outputs) && cell.outputs.length > 0 && (
                                                    <div className={styles.outputsWrap}>
                                                        {cell.outputs.map((output, idx) => renderOutput(output, idx))}
                                                    </div>
                                                )}
                                            </div>
                                        </section>
                                    );
                                }

                                return (
                                    <section key={index} className={styles.notebookSection}>
                                        <pre className={styles.codeCell}>
                                            <code>{sourceText}</code>
                                        </pre>
                                    </section>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}