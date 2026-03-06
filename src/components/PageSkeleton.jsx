import styles from "./PageSkeleton.module.css";

export default function PageSkeleton({ cards = 4, rows = 6 }) {
  return (
    <div className={styles.wrapper}>
      
      {/* Page Title */}
      <div className={`${styles.skeleton} ${styles.title}`} />

      {/* Cards */}
      <div className={styles.cardGrid}>
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className={`${styles.skeleton} ${styles.card}`} />
        ))}
      </div>

      {/* Table Section */}
      <div className={styles.tableWrapper}>
        
        {/* Table Header */}
        <div className={styles.tableHeader}>
          <div className={`${styles.skeleton} ${styles.th}`} />
          <div className={`${styles.skeleton} ${styles.th}`} />
          <div className={`${styles.skeleton} ${styles.th}`} />
          <div className={`${styles.skeleton} ${styles.th}`} />
        </div>

        {/* Table Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className={styles.tableRow}>
            <div className={`${styles.skeleton} ${styles.td}`} />
            <div className={`${styles.skeleton} ${styles.td}`} />
            <div className={`${styles.skeleton} ${styles.td}`} />
            <div className={`${styles.skeleton} ${styles.td}`} />
          </div>
        ))}
      </div>

    </div>
  );
}