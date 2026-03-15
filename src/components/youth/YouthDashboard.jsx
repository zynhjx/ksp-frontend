import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import DashboardLayout from '../common/DashboardLayout'
import dashboardStyles from '../common/DashboardDataView.module.css'
import './YouthDashboard.css'

const dashboardPrograms = [
    {
        id: 1,
        name: 'Community Clean-Up Drive',
        startDate: '2026-03-05T08:00:00',
        untilDate: '2026-04-15',
        status: 'Ongoing',
        joined: false,
    },
    {
        id: 2,
        name: 'Youth Leadership Workshop',
        startDate: '2026-04-05T09:00:00',
        untilDate: '2026-05-30',
        status: 'Not Started Yet',
        joined: false,
    },
    {
        id: 3,
        name: 'Inter-Barangay Sports Fest',
        startDate: '2025-11-02T08:00:00',
        untilDate: '2026-01-20',
        status: 'Completed',
        joined: true,
    },
    {
        id: 4,
        name: 'Digital Literacy Bootcamp',
        startDate: '2026-03-01T08:00:00',
        untilDate: '2026-06-15',
        status: 'Ongoing',
        joined: true,
    },
]

const dashboardSuggestions = [
    {
        id: 1,
        title: 'Free Coding Workshops for Youth',
        status: 'Under Review',
        submittedAt: '2026-02-18',
    },
    {
        id: 2,
        title: 'Install More Street Lights Along Rizal St.',
        status: 'Pending',
        submittedAt: '2026-03-01',
    },
    {
        id: 3,
        title: 'Regular Barangay Vaccination Drive',
        status: 'Acknowledged',
        submittedAt: '2026-01-25',
    },
]

const formatDate = (value) =>
    new Date(value).toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })

const getDaysRemaining = (value) => {
    const endDate = new Date(value).getTime()
    const today = Date.now()
    const millisecondsPerDay = 1000 * 60 * 60 * 24
    return Math.ceil((endDate - today) / millisecondsPerDay)
}

function YouthDashboard() {
    const { user } = useContext(AuthContext)

    const displayName = user?.first_name || 'Youth'
    const joinedPrograms = dashboardPrograms.filter((program) => program.joined)
    const activePrograms = dashboardPrograms.filter((program) => program.status === 'Ongoing')
    const upcomingPrograms = dashboardPrograms.filter((program) => program.status === 'Not Started Yet')
    const pendingSuggestions = dashboardSuggestions.filter((suggestion) => suggestion.status === 'Pending')
    const recentSuggestions = [...dashboardSuggestions]
        .sort((first, second) => new Date(second.submittedAt) - new Date(first.submittedAt))
        .slice(0, 3)

    return (
        <DashboardLayout
            userFirstName={displayName}
            greetingAsTitle
            statsClassName={dashboardStyles.dashboardStatsGrid}
            contentClassName={dashboardStyles.dashboardGridContainer}
            stats={
                <>
                    <article className={dashboardStyles.dashboardStatCard}>
                        <p>Total Programs</p>
                        <h2>{dashboardPrograms.length}</h2>
                        <span>{joinedPrograms.length} joined</span>
                    </article>

                    <article className={dashboardStyles.dashboardStatCard}>
                        <p>Active Programs</p>
                        <h2>{activePrograms.length}</h2>
                        <span>{upcomingPrograms.length} upcoming</span>
                    </article>

                    <article className={dashboardStyles.dashboardStatCard}>
                        <p>My Suggestions</p>
                        <h2>{dashboardSuggestions.length}</h2>
                        <span>{pendingSuggestions.length} pending</span>
                    </article>
                </>
            }
        >
            <article className="dashboard-panel">
                    <div className="dashboard-panel-head">
                        <h3>Programs Snapshot</h3>
                        <Link to="/youth/programs">Open Programs</Link>
                    </div>

                    <ul className="dashboard-list">
                        {joinedPrograms.length === 0 ? (
                            <li className="dashboard-empty">You haven&apos;t joined any programs yet.</li>
                        ) : (
                            joinedPrograms.map((program) => {
                                const daysRemaining = getDaysRemaining(program.untilDate)
                                const timelineLabel =
                                    program.status === 'Completed'
                                        ? 'Completed'
                                        : daysRemaining > 0
                                            ? `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} left`
                                            : 'End date reached'

                                return (
                                    <li key={program.id} className="dashboard-list-item">
                                        <div>
                                            <p>{program.name}</p>
                                            <span>{program.status}</span>
                                        </div>
                                        <strong>{timelineLabel}</strong>
                                    </li>
                                )
                            })
                        )}
                    </ul>
                </article>

                <article className="dashboard-panel">
                    <div className="dashboard-panel-head">
                        <h3>Recent Suggestions</h3>
                        <Link to="/youth/suggestions">Open Suggestions</Link>
                    </div>

                    <ul className="dashboard-list">
                        {recentSuggestions.map((suggestion) => (
                            <li key={suggestion.id} className="dashboard-list-item">
                                <div>
                                    <p>{suggestion.title}</p>
                                    <span>{formatDate(suggestion.submittedAt)}</span>
                                </div>
                                <strong>{suggestion.status}</strong>
                            </li>
                        ))}
                    </ul>
                </article>

                <article className="dashboard-panel dashboard-profile-panel">
                    <div className="dashboard-panel-head">
                        <h3>My Profile</h3>
                        <Link to="/youth/my-profile">Open Profile</Link>
                    </div>

                    <dl className="dashboard-profile-details">
                        <div>
                            <dt>Name</dt>
                            <dd>{displayName}</dd>
                        </div>
                        <div>
                            <dt>Role</dt>
                            <dd>{user?.role || 'Youth'}</dd>
                        </div>
                        <div>
                            <dt>Email</dt>
                            <dd>{user?.email || 'No email available'}</dd>
                        </div>
                    </dl>
                </article>
        </DashboardLayout>
    )
}

export default YouthDashboard
