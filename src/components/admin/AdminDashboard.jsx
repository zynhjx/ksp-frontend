import dashboardStyles from '../common/DashboardDataView.module.css';
import BarangayOverviewTable from '../common/BarangayOverviewTable';
import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import DashboardLayout from '../common/DashboardLayout';
import DashboardSkeleton from '../common/DashboardSkeleton'
import { toast } from 'react-toastify';
import PageError from '../common/PageError';
import { apiFetch } from '../../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#AF19FF',
    '#FF4560',
    '#775DD0',
    '#3F51B5',
    '#546E7A',
    '#26A69A',
    '#D10CE8',
    '#F86624',
];
const RESIZE_DEBOUNCE_MS = 120;
const LARGE_DATA_THRESHOLD = 80;
const MAX_AGE_POINTS = 120;
const BAR_MARGIN = { top: 8, right: 8, left: 0, bottom: 8 };
const AXIS_TICK = { fontSize: 12 };
const EMPTY_CARD_MESSAGE = 'No data available yet.';

const hasItems = (data) => Array.isArray(data) && data.length > 0;

const EmptyChartCard = memo(function EmptyChartCard({ title }) {
    return (
        <div className={dashboardStyles.dashboardChartCard}>
            <h3 className={dashboardStyles.dashboardChartTitle}>{title}</h3>
            <div className={dashboardStyles.dashboardEmptyChartBody}>
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
        <div className={dashboardStyles.dashboardChartCard}>
            <h3 className={dashboardStyles.dashboardChartTitle}>{title}</h3>
            <div className={dashboardStyles.dashboardChartWrapper}>
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
        <div className={dashboardStyles.dashboardChartCard}>
            <h3 className={dashboardStyles.dashboardChartTitle}>{title}</h3>
            <div className={dashboardStyles.dashboardChartWrapper}>
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

const MOCK_TOTAL_YOUTH = [
    { barangay: 'Bagong Silang', count: 312 },
    { barangay: 'Dela Paz', count: 278 },
    { barangay: 'Handang Tumulong', count: 195 },
];

function AdminDashboard() {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false)
    const [ageData, setAgeData] = useState([]);
    const [educationData, setEducationData] = useState([]);
    const [employmentData, setEmploymentData] = useState([]);
    const [activeYouthData, setActiveYoutData] = useState([]);
    const [totalYouthData, setTotalYouthData] = useState([]);
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

    const fetchTotalYouthData = useCallback(async () => {
        try {
            const res = await apiFetch(`${apiUrl}/api/admin/total-youth-distribution`);
            if (!res.ok) throw new Error('No total youth endpoint');
            const data = await res.json();
            setTotalYouthData(Array.isArray(data) ? data : MOCK_TOTAL_YOUTH);
        } catch {
            setTotalYouthData(MOCK_TOTAL_YOUTH);
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
        fetchTotalYouthData()
    }, [fetchData, fetchAgeData, fetchEducationData, fetchEmploymentData, fetchActiveYouthData, fetchTotalYouthData]);

    // Show skeleton while loading
    if (loading) return <DashboardSkeleton />;
    if (isError) return <PageError onRetry={fetchData}/>

    return (
        <DashboardLayout
            title="Admin Dashboard"
            centered
            statsClassName={dashboardStyles.dashboardStatsGrid}
            contentClassName={dashboardStyles.dashboardGridContainer}
            stats={stats.length === 0 
                ? <p>No data available.</p>
                : stats.map((s) => (
                    <div key={s.label} className={dashboardStyles.dashboardStatCard}>
                        <h2>{s.value}</h2>
                        <p>{s.label}</p>
                    </div>
                ))}
        >
            
            
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
                title="Total Youth Member"
                data={totalYouthData}
                xDataKey="barangay"
                barDataKey="count"
                barColor="#f97316"
                xAxisProps={{ interval: 0, angle: -15, textAnchor: 'end', height: 55 }}
            />
            <BarChartCard
                title="Registered Youth Member"
                data={activeYouthData}
                xDataKey="barangay"
                barDataKey="count"
                barColor="#3b82f6"
                xAxisProps={{ interval: 0, angle: -15, textAnchor: 'end', height: 55 }}
            />


            
            
            
        </DashboardLayout>
    );
}

export default AdminDashboard;