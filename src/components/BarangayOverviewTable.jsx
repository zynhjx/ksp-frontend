import './BarangayOverviewTable.css';

function BarangayOverviewTable() {
    // Mock data
    const barangays = [
        {
            id: 1,
            name: "Barangay Napsan",
            totalYouth: 120,
            activeYouth: 110,
            skOfficials: 3
        },
        {
            id: 2,
            name: "Barangay Simpokan",
            totalYouth: 85,
            activeYouth: 80,
            skOfficials: 0
        },
        {
            id: 3,
            name: "Barangay Bagong Bayan",
            totalYouth: 95,
            activeYouth: 88,
            skOfficials: 2
        }
    ];

    const handleRowClick = (barangayId) => {
        console.log(`Clicked on barangay with ID: ${barangayId}`);
    };

    return (
        <div className="barangay-overview-container">
            <h2 className="overview-title">Barangay Overview</h2>
            <div className="table-wrapper">
                <table className="barangay-table">
                    <thead>
                        <tr>
                            <th id='barangay'>Barangay</th>
                            <th>Total Youth</th>
                            <th>Active Youth</th>
                            <th>SK Officials</th>
                        </tr>
                    </thead>
                    <tbody>
                        {barangays.map((barangay) => (
                            <tr
                                key={barangay.id}
                                className={`barangay-row ${barangay.skOfficials === 0 ? 'no-officials' : ''}`}
                                onClick={() => handleRowClick(barangay.id)}
                            >
                                <td className="barangay-name">{barangay.name}</td>
                                <td className="stat-value">{barangay.totalYouth}</td>
                                <td className="stat-value">{barangay.activeYouth}</td>
                                <td className="stat-value">{barangay.skOfficials}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BarangayOverviewTable;
