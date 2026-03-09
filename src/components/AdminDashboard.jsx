import styles from './AdminDashboard.module.css';
import BarangayOverviewTable from './BarangayOverviewTable';
import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import PageSkeleton from './PageSkeleton'
import { toast } from 'react-toastify';
import PageError from './PageError';
import { apiFetch } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const RESIZE_DEBOUNCE_MS = 120;
const LARGE_DATA_THRESHOLD = 80;
const MAX_AGE_POINTS = 120;
const BAR_MARGIN = { top: 8, right: 8, left: 0, bottom: 8 };
const AXIS_TICK = { fontSize: 12 };
const EMPTY_CARD_MESSAGE = 'No data available yet.';

const hasItems = (data) => Array.isArray(data) && data.length > 0;

const EmptyChartCard = memo(function EmptyChartCard({ title }) {
    return (
        <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>{title}</h3>
            <div className={styles.emptyChartBody}>
                <p>{EMPTY_CARD_MESSAGE}</p>
            </div>
        </div>
    );
});

const PieChartCard = memo(function PieChartCard({ title, data, innerRadius, outerRadius }) {
    if (!hasItems(data)) {
        console.log("hahah")
        return <EmptyChartCard title={title} />;
        
    }

    const shouldAnimate = data.length < LARGE_DATA_THRESHOLD;
    return (
        <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>{title}</h3>
            <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height="100%" debounce={RESIZE_DEBOUNCE_MS}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={innerRadius}
                            outerRadius={outerRadius}
                            fill="#8884d8"
                            dataKey="value"
                            label
                            isAnimationActive={shouldAnimate}
                            animationDuration={350}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
});

const BarChartCard = memo(function BarChartCard({ title, data, xDataKey, barDataKey, barColor, xAxisProps = {} }) {
    if (!hasItems(data)) {
        return <EmptyChartCard title={title} />;
    }

    const shouldAnimate = data.length < LARGE_DATA_THRESHOLD;
    return (
        <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>{title}</h3>
            <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height="100%" debounce={RESIZE_DEBOUNCE_MS}>
                    <BarChart data={data} margin={BAR_MARGIN}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={xDataKey} tick={AXIS_TICK} {...xAxisProps} />
                        <YAxis tick={AXIS_TICK} />
                        <Tooltip />
                        <Bar
                            dataKey={barDataKey}
                            fill={barColor}
                            isAnimationActive={shouldAnimate}
                            animationDuration={350}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
});

function AdminDashboard() {
    const [stats, setStats] = useState([]);
    const [barangays, setBarangays] = useState([])
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false)
    const [ageData, setAgeData] = useState([]);
    const [educationData, setEducationData] = useState([]);
    const [employmentData, setEmploymentData] = useState([]);
    const [activeYouthData, setActiveYoutData] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchAgeData = useCallback(async () => {
        try {
            const res = await apiFetch(`${apiUrl}/api/admin/age-distribution`);
            
            if (!res.ok) throw new Error('Failed to fetch age distribution');
            const data = await res.json();
            setAgeData(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch age distribution");
        }
    }, [apiUrl]);

    const fetchEducationData = useCallback(async () => {
        try {
            const res = await apiFetch(`${apiUrl}/api/admin/education-distribution`);
            if (!res.ok) throw new Error('Failed to fetch education distribution');
            const data = await res.json();
            setEducationData(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch education distribution");
        }
    }, [apiUrl]);

    const fetchEmploymentData = useCallback(async () => {
        try {
            const res = await apiFetch(`${apiUrl}/api/admin/employment-distribution`);
            if (!res.ok) throw new Error('Failed to fetch employment distribution');
            const data = await res.json();
            setEmploymentData(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch employment distribution");
        }
    }, [apiUrl]);

    const fetchActiveYouthData = useCallback(async () => {
        try {
            const res = await apiFetch(`${apiUrl}/api/admin/active-distribution`);
            if (!res.ok) throw new Error('Failed to fetch active youth distribution');
            const data = await res.json();
            setActiveYoutData(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch active youth distribution");
        }
    }, [apiUrl]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setIsError(false)
        try {
            const res = await apiFetch(`${apiUrl}/api/admin/dashboard`);
            if (!res.ok) throw new Error('Failed to fetch dashboard data');
            const data = await res.json();
            setStats(Array.isArray(data?.stats) ? data.stats : []);
            setBarangays(Array.isArray(data?.barangayOverview) ? data.barangayOverview : []);
        } catch (err) {
            console.error(err.message);
            setIsError(true);
            toast.error(err.message || 'Failed to fetch dashboard data');
            
        } finally {
            setLoading(false);
        }
    }, [apiUrl]);

    const optimizedAgeData = useMemo(() => {
        if (!Array.isArray(ageData) || ageData.length <= MAX_AGE_POINTS) {
            return ageData;
        }

        const step = Math.ceil(ageData.length / MAX_AGE_POINTS);
        return ageData.filter((_, index) => index % step === 0);
    }, [ageData]);

    useEffect(() => {
        fetchData();
        fetchAgeData();
        fetchEducationData()
        fetchEmploymentData()
        fetchActiveYouthData()
    }, [fetchData, fetchAgeData, fetchEducationData, fetchEmploymentData, fetchActiveYouthData]);

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
                <PieChartCard
                    title="Employment Status"
                    data={employmentData}
                    outerRadius="72%"
                />
                <PieChartCard
                    title="Education Level Distribution"
                    data={educationData}
                    innerRadius="42%"
                    outerRadius="72%"
                />
                <BarChartCard
                    title="Age Distribution"
                    data={optimizedAgeData}
                    xDataKey="age"
                    barDataKey="count"
                    barColor="#8884d8"
                />
                <BarChartCard
                    title="Active Youth per Barangay"
                    data={activeYouthData}
                    xDataKey="barangay"
                    barDataKey="count"
                    barColor="#ffc658"
                    xAxisProps={{ interval: 0, angle: -15, textAnchor: 'end', height: 55 }}
                />
            </div>
            
        </div>
    );
}

export default AdminDashboard;