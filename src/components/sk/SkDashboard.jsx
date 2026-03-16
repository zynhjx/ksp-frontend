import dashboardStyles from '../common/DashboardDataView.module.css';
import BarangayOverviewTable from '../common/BarangayOverviewTable';
import { useState, useEffect, useMemo, useCallback, memo, useContext, useRef } from 'react';
import DashboardLayout from '../common/DashboardLayout';
import DashboardSkeleton from '../common/DashboardSkeleton';
import { toast } from 'react-toastify';
import PageError from '../common/PageError';
import { apiFetch } from '../../api';
import { AuthContext } from '../../contexts/AuthContext';
import { SidebarContext } from '../../contexts/SidebarContext';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    LineChart,
    Line,
} from 'recharts';

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
const RESIZE_DEBOUNCE_MS = 24;
const RESIZE_ANIMATION_LOCK_MS = 160;
const SIDEBAR_TOGGLE_ANIMATION_LOCK_MS = 180;
const LARGE_DATA_THRESHOLD = 80;
const CHART_ANIMATION_EASING = 'ease-out';
const PIE_ANIMATION_DURATION_MS = 320;
const BAR_ANIMATION_DURATION_MS = 260;
const LINE_ANIMATION_DURATION_MS = 340;
const MAX_AGE_POINTS = 120;
const BAR_MARGIN = { top: 8, right: 8, left: 0, bottom: 8 };
const AXIS_TICK = { fontSize: 12 };
const EMPTY_CARD_MESSAGE = 'No data available yet.';
const USE_MOCK_FALLBACK = true;
const MAX_PROGRAM_LABEL_LENGTH = 16;

const MOCK_STATS = [
    { label: 'Total Youth Members', value: 328 },
    { label: 'Ongoing Programs', value: 7 },
    { label: 'Average Participants', value: 94 },
    { label: 'Pending Suggestions', value: 5 },
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

const MOCK_WEEKLY_SUGGESTIONS_DATA = [
    { week: 'Week 1', count: 4 },
    { week: 'Week 2', count: 7 },
    { week: 'Week 3', count: 5 },
    { week: 'Week 4', count: 9 },
    { week: 'Week 5', count: 6 },
    { week: 'Week 6', count: 10 },
    { week: 'Week 7', count: 8 },
    { week: 'Week 8', count: 11 },
];

const MOCK_PROGRAMS = [
    {
        id: 1,
        name: 'Community Clean-Up Drive',
        participants: 48,
        status: 'Ongoing',
    },
    {
        id: 2,
        name: 'Youth Leadership Workshop',
        participants: 30,
        status: 'Not Started Yet',
    },
    {
        id: 3,
        name: 'Inter-Barangay Sports Fest',
        participants: 120,
        status: 'Completed',
    },
    {
        id: 4,
        name: 'Digital Literacy Bootcamp',
        participants: 22,
        status: 'Ongoing',
    },
];

const toOngoingProgramParticipants = (programs) =>
    (Array.isArray(programs) ? programs : [])
        .filter((program) => program?.status === 'Ongoing')
        .map((program, index) => ({
            id: program?.id ?? `${program?.name ?? 'program'}-${index}`,
            name: program?.name ?? 'Untitled Program',
            participants: Number(program?.participants ?? 0),
        }));

const truncateLabel = (value, maxLength) => {
    const text = String(value ?? '');

    if (text.length <= maxLength) {
        return text;
    }

    return `${text.slice(0, maxLength).trimEnd()}...`;
};

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

const PieChartCard = memo(function PieChartCard({ title, data, innerRadius, outerRadius, isResizing = false, isSidebarToggling = false, animationBegin = 0 }) {
    if (!hasItems(data)) {
        return <EmptyChartCard title={title} />;
    }

    const shouldAnimate = !isResizing && !isSidebarToggling && data.length < LARGE_DATA_THRESHOLD;
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
                            animationDuration={PIE_ANIMATION_DURATION_MS}
                            animationEasing={CHART_ANIMATION_EASING}
                            animationBegin={animationBegin}
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

const BarChartCard = memo(function BarChartCard({ title, data, xDataKey, barDataKey, barColor, xAxisProps = {}, isResizing = false, isSidebarToggling = false, animationBegin = 0 }) {
    if (!hasItems(data)) {
        return <EmptyChartCard title={title} />;
    }

    const shouldAnimate = !isResizing && !isSidebarToggling && data.length < LARGE_DATA_THRESHOLD;
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
                            animationDuration={BAR_ANIMATION_DURATION_MS}
                            animationEasing={CHART_ANIMATION_EASING}
                            animationBegin={animationBegin}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
});

const LineChartCard = memo(function LineChartCard({ title, data, xDataKey, lineDataKey, lineColor, isResizing = false, isSidebarToggling = false, animationBegin = 0 }) {
    if (!hasItems(data)) {
        return <EmptyChartCard title={title} />;
    }

    const shouldAnimate = !isResizing && !isSidebarToggling && data.length < LARGE_DATA_THRESHOLD;
    return (
        <div className={dashboardStyles.dashboardChartCard}>
            <h3 className={dashboardStyles.dashboardChartTitle}>{title}</h3>
            <div className={dashboardStyles.dashboardChartWrapper}>
                <ResponsiveContainer width="100%" height="100%" debounce={RESIZE_DEBOUNCE_MS}>
                    <LineChart data={data} margin={BAR_MARGIN}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={xDataKey} tick={AXIS_TICK} />
                        <YAxis tick={AXIS_TICK} allowDecimals={false} />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey={lineDataKey}
                            stroke={lineColor}
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            isAnimationActive={shouldAnimate}
                            animationDuration={LINE_ANIMATION_DURATION_MS}
                            animationEasing={CHART_ANIMATION_EASING}
                            animationBegin={animationBegin}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
});

function SkDashboard() {
    const { user } = useContext(AuthContext);
    const { sidebarOpen } = useContext(SidebarContext);
    const [stats, setStats] = useState([]);
    const [_barangays, setBarangays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [ageData, setAgeData] = useState([]);
    const [educationData, setEducationData] = useState([]);
    const [employmentData, setEmploymentData] = useState([]);
    const [_activeYouthData, setActiveYoutData] = useState([]);
    const [ongoingProgramsData, setOngoingProgramsData] = useState([]);
    const [weeklySuggestionsData, setWeeklySuggestionsData] = useState([]);
    const [isResizing, setIsResizing] = useState(false);
    const [isSidebarToggling, setIsSidebarToggling] = useState(false);
    const resizeTimeoutRef = useRef(null);
    const sidebarToggleTimeoutRef = useRef(null);
    const apiUrl = import.meta.env.VITE_API_URL;
    const displayName = user?.first_name || 'SK Officer';

    const applyMockData = useCallback(() => {
        setStats(MOCK_STATS);
        setBarangays(MOCK_BARANGAYS);
        setAgeData(MOCK_AGE_DATA);
        setEducationData(MOCK_EDUCATION_DATA);
        setEmploymentData(MOCK_EMPLOYMENT_DATA);
        setActiveYoutData(MOCK_ACTIVE_YOUTH_DATA);
        setOngoingProgramsData(toOngoingProgramParticipants(MOCK_PROGRAMS));
        setWeeklySuggestionsData(MOCK_WEEKLY_SUGGESTIONS_DATA);
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

    const fetchOngoingProgramsData = useCallback(async () => {
        try {
            const res = await apiFetch(`${apiUrl}/api/sk/programs`);
            if (!res.ok) throw new Error('Failed to fetch programs data');

            const data = await res.json();
            const ongoingPrograms = toOngoingProgramParticipants(data);
            setOngoingProgramsData(
                ongoingPrograms.length > 0
                    ? ongoingPrograms
                    : toOngoingProgramParticipants(MOCK_PROGRAMS)
            );
        } catch (err) {
            console.error(err);
            setOngoingProgramsData(toOngoingProgramParticipants(MOCK_PROGRAMS));
            if (!USE_MOCK_FALLBACK) {
                toast.error('Failed to fetch ongoing programs data');
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
            setWeeklySuggestionsData(MOCK_WEEKLY_SUGGESTIONS_DATA);
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
        fetchOngoingProgramsData();
    }, [fetchData, fetchAgeData, fetchEducationData, fetchEmploymentData, fetchActiveYouthData, fetchOngoingProgramsData]);

    useEffect(() => {
        const handleResize = () => {
            setIsResizing(true);

            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }

            resizeTimeoutRef.current = setTimeout(() => {
                setIsResizing(false);
            }, RESIZE_ANIMATION_LOCK_MS);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        setIsSidebarToggling(true);

        if (sidebarToggleTimeoutRef.current) {
            clearTimeout(sidebarToggleTimeoutRef.current);
        }

        sidebarToggleTimeoutRef.current = setTimeout(() => {
            setIsSidebarToggling(false);
        }, SIDEBAR_TOGGLE_ANIMATION_LOCK_MS);

        return () => {
            if (sidebarToggleTimeoutRef.current) {
                clearTimeout(sidebarToggleTimeoutRef.current);
            }
        };
    }, [sidebarOpen]);

    if (loading) return <DashboardSkeleton />;
    if (isError) return <PageError onRetry={fetchData} />;

    return (
        <DashboardLayout
            userFirstName={displayName}
            greetingAsTitle
            statsClassName={dashboardStyles.dashboardStatsGrid}
            contentClassName={dashboardStyles.dashboardGridContainer}
            stats={stats.length === 0 ? (
                <p>No data available.</p>
            ) : (
                stats.map((s) => (
                    <div key={s.label} className={dashboardStyles.dashboardStatCard}>
                        <h2>{s.value}</h2>
                        <p>{s.label}</p>
                    </div>
                ))
            )}
        >
            <PieChartCard
                title="Employment Status"
                data={employmentData}
                outerRadius="72%"
                isResizing={isResizing}
                isSidebarToggling={isSidebarToggling}
                animationBegin={0}
            />
            <PieChartCard
                title="Education Level Distribution"
                data={educationData}
                innerRadius="42%"
                outerRadius="72%"
                isResizing={isResizing}
                isSidebarToggling={isSidebarToggling}
                animationBegin={0}
            />
            <BarChartCard
                title="Age Distribution"
                data={optimizedAgeData}
                xDataKey="age"
                barDataKey="count"
                barColor="#8884d8"
                isResizing={isResizing}
                isSidebarToggling={isSidebarToggling}
                animationBegin={0}
            />
            <BarChartCard
                title="Ongoing Programs Participants"
                data={ongoingProgramsData}
                xDataKey="name"
                barDataKey="participants"
                barColor="#22c55e"
                isResizing={isResizing}
                isSidebarToggling={isSidebarToggling}
                animationBegin={0}
                xAxisProps={{
                    interval: 0,
                    angle: -18,
                    textAnchor: 'end',
                    height: 62,
                    tickFormatter: (value) => truncateLabel(value, MAX_PROGRAM_LABEL_LENGTH),
                }}
            />
            <LineChartCard
                title="Weekly Suggestions Count"
                data={weeklySuggestionsData}
                xDataKey="week"
                lineDataKey="count"
                lineColor="#ff8042"
                isResizing={isResizing}
                isSidebarToggling={isSidebarToggling}
                animationBegin={0}
            />
        </DashboardLayout>
    );
}

export default SkDashboard;
