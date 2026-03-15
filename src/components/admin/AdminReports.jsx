import styles from "./AdminReports.module.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

function AdminReports() {
    const summaryData = [
        { number: 210, label: 'Total Registered Youth' },
        { number: 198, label: 'Active Youth Profiles' },
        { number: 4, label: 'Barangays Covered' },
        { number: 6, label: 'SK Officials Active' },
        { number: 110, label: 'Students' },
        { number: 34, label: 'Unemployed Youth' }
    ];

    const ageData = [
        { age: '15–17', count: 42 },
        { age: '18–20', count: 76 },
        { age: '21–23', count: 61 },
        { age: '24–30', count: 31 }
    ];

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

    const youthCountData = [
        { barangay: 'Napsan', count: 87 },
        { barangay: 'Simpokan', count: 63 },
        { barangay: 'Bagong Bayan', count: 45 },
        { barangay: 'San Rafael', count: 15 }
    ];

    

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

    return (
        <div className={styles.reportsContainer}>
            <h1 className={styles.title}>Reports</h1>
            <p className={styles.subtitle}>
                View summaries of youth data
            </p>
            <div className={styles.summarySection}>
                {/* <h2>Summary</h2> */}
                <div className={styles.summaryGrid}>
                    {summaryData.map((item, index) => (
                        <div key={index} className={styles.summaryCard}>
                            <div className={styles.summaryNumber}>{item.number}</div>
                            <div className={styles.summaryLabel}>{item.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.chartsSection}>
                <h2>Distribution Charts</h2>
                <div className={styles.chartsGrid}>
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
                </div>
            </div>

            <div className={styles.comparisonSection}>
                <h2>Barangay Comparison</h2>
                <div className={styles.comparisonContainer}>
                    <div className={styles.chartCard}>
                        <h3 className={styles.chartTitle}>Youth Count per Barangay</h3>
                        <BarChart width={380} height={300} data={youthCountData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="barangay" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#82ca9d" />
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
        </div>
    );
}

export default AdminReports;