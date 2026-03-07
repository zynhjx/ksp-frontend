import styles from './AdminDashboard.module.css';
import BarangayOverviewTable from './BarangayOverviewTable';
import { useState, useEffect } from 'react';
import PageSkeleton from './PageSkeleton'
import { toast } from 'react-toastify';
import PageError from './PageError';
import { apiFetch } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

function AdminDashboard() {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const [stats, setStats] = useState([]);
    const [barangays, setBarangays] = useState([])
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false)
    const [ageData, setAgeData] = useState([]);

    async function fetchAgeData() {
        try {
            const res = await apiFetch('http://localhost:5000/api/admin/age-distribution');
            const data = await res.json();
            setAgeData(data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch age distribution");
        }
    }
    
    const educationData = [
        { name: 'Junior High', value: 35 },
        { name: 'Senior High', value: 88 },
        { name: 'College', value: 67 },
        { name: 'Graduate', value: 20 }
    ];

    const employmentData = [
        { name: 'Student', value: 110 },
        { name: 'Employed', value: 52 },
        { name: 'Unemployed', value: 34 },
        { name: 'Self-employed', value: 14 }
    ];

    const activeYouthData = [
        { barangay: 'Napsan', count: 80 },
        { barangay: 'Simpokan', count: 59 },
        { barangay: 'Bagong Bayan', count: 42 },
        { barangay: 'San Rafael', count: 17 }
    ];

    async function fetchData() {
        setLoading(true);
        setIsError(false)
        try {
            const res = await apiFetch('http://localhost:5000/api/admin/dashboard');
            const data = await res.json();
            setStats(data.stats);
            setBarangays(data.barangayOverview)
        } catch (err) {
            console.error(err.message);
            toast.error(err.message)
            
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
        fetchAgeData();
    }, []);

    // Show skeleton while loading
    if (loading) return <PageSkeleton />;
    if (isError) return <PageError onRetry={fetchData}/>

    return (
        <div className={styles.adminDashboardPage}>
            <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>
            <div className={styles.statsGrid}>
                {stats.length === 0 
                    ? <p>No data available.</p>
                    : stats.map((s) => (
                        <div key={s.label} className={styles.statCard}>
                            <h2>{s.value}</h2>
                            <p>{s.label}</p>
                        </div>
                ))}
            </div>
            <div className={styles.gridContainer}>
                <BarangayOverviewTable barangays={barangays}/>
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Employment Status</h3>
                    <PieChart width={380} height={300}>
                        <Pie
                            data={employmentData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label
                        >
                            {employmentData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </div>
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Education Level Distribution</h3>
                    <PieChart width={380} height={300}>
                        <Pie
                            data={educationData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label
                        >
                            {educationData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </div>
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Age Distribution</h3>
                    <BarChart width={380} height={300} data={ageData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="age" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                </div>
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Active Youth per Barangay</h3>
                    <BarChart width={380} height={300} data={activeYouthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="barangay" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#ffc658" />
                    </BarChart>
                </div>
            </div>
            
        </div>
    );
}

export default AdminDashboard;