import './AdminDashboard.css';
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
        <div className="admin-dashboard-page">
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <div className="stats-grid">
                {stats.map((s) => (
                    <div key={s.label} className="stat-card">
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