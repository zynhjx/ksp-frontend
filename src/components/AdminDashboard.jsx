import styles from './AdminDashboard.module.css';
import BarangayOverviewTable from './BarangayOverviewTable';

function AdminDashboard() {
    // placeholder values; real data should come from API calls
    const stats = [
        { label: 'Total Youth', value: 1024 },
        { label: 'Total Active Youth', value: 680 },
        { label: 'Total SK Officials', value: 123 },
        { label: 'Barangays', value: 3 },
        { label: 'Pending Accounts', value: 7 }
        
    ];

    return (
        <div className={styles.adminDashboardPage}>
            <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>
            <div className={styles.statsGrid}>
                {stats.map((s) => (
                    <div key={s.label} className={styles.statCard}>
                        <h2>{s.value}</h2>
                        <p>{s.label}</p>
                    </div>
                ))}
            </div>
            <BarangayOverviewTable />
        </div>
    );
}

export default AdminDashboard;