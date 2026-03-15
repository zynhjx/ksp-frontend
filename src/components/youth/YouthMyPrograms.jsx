import { useEffect, useState } from 'react'
import './YouthPrograms.css'

const mockJoinedPrograms = [
  {
    id: 101,
    name: 'Inter-Barangay Sports Fest',
    category: 'Sports',
    location: 'Municipal Gymnasium',
    description: 'A multi-week sports event promoting teamwork, discipline, and active youth participation.',
    createdAt: '2025-10-20',
    startDate: '2025-11-02T08:00:00',
    untilDate: '2026-01-20',
    participants: 120,
    status: 'Completed',
    joined: true,
  },
  {
    id: 102,
    name: 'Digital Literacy Bootcamp',
    category: 'Technology',
    location: 'Barangay Learning Center',
    description: 'Hands-on sessions for digital productivity, online safety, and practical internet skills.',
    createdAt: '2026-02-15',
    startDate: '2026-03-01T08:00:00',
    untilDate: '2026-06-15',
    participants: 22,
    status: 'Ongoing',
    joined: true,
  },
  {
    id: 103,
    name: 'Youth Leadership Workshop',
    category: 'Education',
    location: 'SK Session Hall',
    description: 'A structured workshop to strengthen communication, facilitation, and project leadership skills.',
    createdAt: '2026-02-01',
    startDate: '2026-04-05T09:00:00',
    untilDate: '2026-05-30',
    participants: 31,
    status: 'Not Started Yet',
    joined: true,
  },
]

const formatDate = (value) => new Date(value).toLocaleDateString('en-PH', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

function YouthMyPrograms() {
  const [now, setNow] = useState(Date.now())
  const [nameFilter, setNameFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')

  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(timerId)
  }, [])

  const getStatusClass = (status) => {
    const normalizedStatus = status.toLowerCase()

    if (normalizedStatus === 'ongoing') return 'is-ongoing'
    if (normalizedStatus === 'not started yet') return 'is-not-started'
    return 'is-completed'
  }

  const formatCountdown = (milliseconds) => {
    if (milliseconds <= 0) {
      return '00d 00h 00m 00s'
    }

    const totalSeconds = Math.floor(milliseconds / 1000)
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
  }

  const getCountdownLabel = (program) => {
    if (program.status === 'Not Started Yet') {
      const startTime = new Date(program.startDate).getTime()
      const remaining = startTime - now
      if (remaining <= 0) return 'Program starts now'
      return `Starts in ${formatCountdown(remaining)}`
    }

    if (program.status === 'Ongoing') {
      const endTime = new Date(program.untilDate).getTime()
      const remaining = endTime - now
      if (remaining <= 0) return 'Program end date reached'
      return `Ends in ${formatCountdown(remaining)}`
    }

    return 'Program completed'
  }

  const categoryOptions = ['All', ...new Set(mockJoinedPrograms.map((program) => program.category))]

  const filteredPrograms = mockJoinedPrograms.filter((program) => {
    const matchesName = program.name.toLowerCase().includes(nameFilter.trim().toLowerCase())
    const matchesStatus = statusFilter === 'All' || program.status === statusFilter
    const matchesCategory = categoryFilter === 'All' || program.category === categoryFilter
    return matchesName && matchesStatus && matchesCategory
  })

  return (
    <div className="youth-programs-page">
      <header className="youth-programs-header">
        <h1>My Programs</h1>
        <p>View all programs you have joined and track their current timeline and status.</p>
      </header>

      <section className="program-filters" aria-label="My programs filters">
        <div className="filter-field filter-name">
          <label htmlFor="my-programs-filter-name">Name</label>
          <input
            id="my-programs-filter-name"
            type="text"
            value={nameFilter}
            onChange={(event) => setNameFilter(event.target.value)}
            placeholder="Search by program name"
          />
        </div>

        <div className="filter-field filter-status">
          <label htmlFor="my-programs-filter-status">Status</label>
          <select
            id="my-programs-filter-status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Not Started Yet">Not Started Yet</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="filter-field filter-category">
          <label htmlFor="my-programs-filter-category">Category</label>
          <select
            id="my-programs-filter-category"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="youth-programs-grid" aria-label="My joined programs list">
        {filteredPrograms.map((program) => (
          <article className="program-card" key={program.id}>
            <div className="program-card-top">
              <h2>{program.name}</h2>
              <span className={`program-status ${getStatusClass(program.status)}`}>{program.status}</span>
            </div>

            <p className="program-description">{program.description}</p>

            <div className="program-meta">
              <p><span>Category</span><strong>{program.category}</strong></p>
              <p><span>Location</span><strong>{program.location}</strong></p>
              <p><span>Created</span><strong>{formatDate(program.createdAt)}</strong></p>
              <p><span>Until</span><strong>{formatDate(program.untilDate)}</strong></p>
              <p><span>Participants</span><strong>{program.participants}</strong></p>
            </div>

            <div className="program-footer">
              <p className={`program-countdown ${getStatusClass(program.status)}`}>
                {getCountdownLabel(program)}
              </p>
              <span className="program-action-joined">Joined</span>
            </div>
          </article>
        ))}

        {filteredPrograms.length === 0 && (
          <p className="empty-filter-state">No joined programs found for the selected filters.</p>
        )}
      </section>
    </div>
  )
}

export default YouthMyPrograms
