import styles from './AdminDashboard.module.css';
import BarangayOverviewTable from './BarangayOverviewTable';
import { useState, useEffect } from 'react';
import PageSkeleton from './PageSkeleton'
import { toast } from 'react-toastify';
import PageError from './PageError';

function AdminDashboard() {
    // placeholder values; real data should come from API calls

    // const stats = [
    //     { label: 'Total Youth', value: 1024 },
    //     { label: 'Total Active Youth', value: 680 },
    //     { label: 'Total SK Officials', value: 123 },
    //     { label: 'Barangays', value: 3 },
    //     { label: 'Pending Accounts', value: 7 }
        
    // ];

    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false)

    async function fetchData() {
        setLoading(true);
        setIsError(false)
        try {
            const res = await fetch('/api/admin-dashboard');
            const data = await res.json();
            setStats(data.stats);
        } catch (err) {
            console.error(err.message);
            toast.error(err.message)
            setIsError(true)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    // Show skeleton while loading
    if (loading) return <PageSkeleton />;
    if (isError) return <PageError onRetry={fetchData}/>

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