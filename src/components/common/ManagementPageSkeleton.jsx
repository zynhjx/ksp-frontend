import styles from './ManagementPageSkeleton.module.css';

function ManagementPageSkeleton() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.headerText}>
          <div className={`${styles.skeleton} ${styles.title}`} />
          <div className={`${styles.skeleton} ${styles.subtitle}`} />
        </div>
        <div className={`${styles.skeleton} ${styles.addBtn}`} />
      </div>

      <div className={styles.controlsRow}>
        <div className={`${styles.skeleton} ${styles.searchBar}`} />
        <div className={styles.filters}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`${styles.skeleton} ${styles.filter}`} />
          ))}
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <div className={styles.tableHeader}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`th-${index}`} className={`${styles.skeleton} ${styles.th}`} />
          ))}
        </div>

        {Array.from({ length: 7 }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className={styles.tableRow}>
            {Array.from({ length: 6 }).map((_, colIndex) => (
              <div key={`td-${rowIndex}-${colIndex}`} className={`${styles.skeleton} ${styles.td}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManagementPageSkeleton;
