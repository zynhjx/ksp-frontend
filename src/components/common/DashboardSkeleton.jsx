import styles from './DashboardSkeleton.module.css';

function DashboardSkeleton() {
  return (
    <div className={styles.dashboardPage}>
      <div className={`${styles.skeleton} ${styles.dashboardTitle}`} />

      <div className={styles.statsGrid}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={styles.statCard}>
            <div className={`${styles.skeleton} ${styles.statValue}`} />
            <div className={`${styles.skeleton} ${styles.statLabel}`} />
          </div>
        ))}
      </div>

      <div className={styles.gridContainer}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className={styles.chartCard}>
            <div className={`${styles.skeleton} ${styles.chartTitle}`} />
            <div className={`${styles.skeleton} ${styles.chartBody}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardSkeleton;
