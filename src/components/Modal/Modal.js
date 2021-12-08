import styles from "./Modal.module.css";

export function Modal({ title, footer, show, onClose, children }) {
  if (!show) {
    return null;
  }

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <h1>{title}</h1>
          <button className={styles["close-btn"]} onClick={onClose}>
            &times;
          </button>
        </header>
        <section className={styles.body}>{children}</section>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>
  );
}
