import styles from '../styles/components-styles/Modal.module.css';

export default function ModalShell({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;
    
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <header className={styles.header}>
                    <h3>{title}</h3>
                    <button onClick={onClose} className={styles.closeBtn}>✕</button>
                </header>
                <div className={styles.body}>
                    {children}
                </div>
            </div>
        </div>
    );
}
