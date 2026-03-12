import styles from './SkDashboard.module.css';
import BarangayOverviewTable from './BarangayOverviewTable';
import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import PageSkeleton from './PageSkeleton';
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
const USE_MOCK_FALLBACK = true;

const MOCK_STATS = [
    { label: 'Total Youth Profiles', value: 328 },
    { label: 'Active Programs', value: 7 },
    { label: 'Registered Volunteers', value: 94 },
    { label: 'Upcoming Events', value: 5 },
];

const MOCK_BARANGAYS = [
    { id: 1, name: 'Barangay San Isidro', youthCount: 82, status: 'Active' },
    { id: 2, name: 'Barangay San Roque', youthCount: 67, status: 'Active' },
    { id: 3, name: 'Barangay Mabini', youthCount: 74, status: 'Active' },
    { id: 4, name: 'Barangay Rizal', youthCount: 55, status: 'Active' },
];

const MOCK_AGE_DATA = [
    { age: '15-17', count: 58 },
    { age: '18-20', count: 104 },
    { age: '21-24', count: 113 },
    { age: '25-30', count: 53 },
];

const MOCK_EDUCATION_DATA = [
    { name: 'High School', value: 124 },
    { name: 'College', value: 136 },
    { name: 'Vocational', value: 38 },
    { name: 'Graduate', value: 30 },
];

const MOCK_EMPLOYMENT_DATA = [
    { name: 'Employed', value: 139 },
    { name: 'Unemployed', value: 111 },
    { name: 'Student', value: 78 },
];

const MOCK_ACTIVE_YOUTH_DATA = [
    { barangay: 'San Isidro', count: 44 },
    { barangay: 'San Roque', count: 35 },
    { barangay: 'Mabini', count: 41 },
    { barangay: 'Rizal', count: 29 },
];

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

function SkDashboard() {
    const [stats, setStats] = useState([]);
    const [barangays, setBarangays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [ageData, setAgeData] = useState([]);
    const [educationData, setEducationData] = useState([]);
    const [employmentData, setEmploymentData] = useState([]);
    const [activeYouthData, setActiveYoutData] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;

    const applyMockData = useCallback(() => {
        setStats(MOCK_STATS);
        setBarangays(MOCK_BARANGAYS);
        setAgeData(MOCK_AGE_DATA);
        setEducationData(MOCK_EDUCATION_DATA);
        setEmploymentData(MOCK_EMPLOYMENT_DATA);
        setActiveYoutData(MOCK_ACTIVE_YOUTH_DATA);
    }, []);

    const fetchAgeData = useCallback(async () => {
        try {
            const res = await apiFetch(`${apiUrl}/api/sk/age-distribution`);
            if (!res.ok) throw new Error('Failed to fetch age distribution');
            const data = await res.json();
            setAgeData(Array.isArray(data) && data.length > 0 ? data : MOCK_AGE_DATA);
        } catch (err) {
            console.error(err);
            setAgeData(MOCK_AGE_DATA);
            if (!USE_MOCK_FALLBACK) {
                toast.error('Failed to fetch age distribution');
            }
        }
    }, [apiUrl]);

    const fetchEducationData = useCallback(async () => {
        try {
            const res = await apiFetch(`${apiUrl}/api/sk/education-distribution`);
            if (!res.ok) throw new Error('Failed to fetch education distribution');
            const data = await res.json();
            setEducationData(Array.isArray(data) && data.length > 0 ? data : MOCK_EDUCATION_DATA);
        } catch (err) {
            console.error(err);
            setEducationData(MOCK_EDUCATION_DATA);
            if (!USE_MOCK_FALLBACK) {
                toast.error('Failed to fetch education distribution');
            }
        }
    }, [apiUrl]);

    const fetchEmploymentData = useCallback(async () => {
        try {
            const res = await apiFetch(`${apiUrl}/api/sk/employment-distribution`);
            if (!res.ok) throw new Error('Failed to fetch employment distribution');
            const data = await res.json();
            setEmploymentData(Array.isArray(data) && data.length > 0 ? data : MOCK_EMPLOYMENT_DATA);
        } catch (err) {
            console.error(err);
            setEmploymentData(MOCK_EMPLOYMENT_DATA);
            if (!USE_MOCK_FALLBACK) {
                toast.error('Failed to fetch employment distribution');
            }
        }
    }, [apiUrl]);

    const fetchActiveYouthData = useCallback(async () => {
        try {
            const res = await apiFetch(`${apiUrl}/api/sk/active-distribution`);
            if (!res.ok) throw new Error('Failed to fetch active youth distribution');
            const data = await res.json();
            setActiveYoutData(Array.isArray(data) && data.length > 0 ? data : MOCK_ACTIVE_YOUTH_DATA);
        } catch (err) {
            console.error(err);
            setActiveYoutData(MOCK_ACTIVE_YOUTH_DATA);
            if (!USE_MOCK_FALLBACK) {
                toast.error('Failed to fetch active youth distribution');
            }
        }
    }, [apiUrl]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setIsError(false);
        try {
            const res = await apiFetch(`${apiUrl}/api/sk/dashboard`);
            if (!res.ok) throw new Error('Failed to fetch dashboard data');
            const data = await res.json();
            setStats(Array.isArray(data?.stats) && data.stats.length > 0 ? data.stats : MOCK_STATS);
            setBarangays(
                Array.isArray(data?.barangayOverview) && data.barangayOverview.length > 0
                    ? data.barangayOverview
                    : MOCK_BARANGAYS
            );
        } catch (err) {
            console.error(err.message);
            if (USE_MOCK_FALLBACK) {
                applyMockData();
                setIsError(false);
            } else {
                setIsError(true);
                toast.error(err.message || 'Failed to fetch dashboard data');
            }
        } finally {
            setLoading(false);
        }
    }, [apiUrl, applyMockData]);

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
        fetchEducationData();
        fetchEmploymentData();
        fetchActiveYouthData();
    }, [fetchData, fetchAgeData, fetchEducationData, fetchEmploymentData, fetchActiveYouthData]);

    if (loading) return <PageSkeleton />;
    if (isError) return <PageError onRetry={fetchData} />;

    return (
        <div className={styles.skDashboardPage}>
            <h1 className={styles.dashboardTitle}>SK Dashboard</h1>
            <div className={styles.statsGrid}>
                {stats.length === 0 ? (
                    <p>No data available.</p>
                ) : (
                    stats.map((s) => (
                        <div key={s.label} className={styles.statCard}>
                            <h2>{s.value}</h2>
                            <p>{s.label}</p>
                        </div>
                    ))
                )}
            </div>
            <div className={styles.gridContainer}>
                <BarangayOverviewTable barangays={barangays} />
                <PieChartCard title="Employment Status" data={employmentData} outerRadius="72%" />
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
            </div>
        </div>
    );
}

export default SkDashboard;
