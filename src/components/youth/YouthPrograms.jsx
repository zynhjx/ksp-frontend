import { useEffect, useState } from 'react'
import ProgramCard from '../common/ProgramCard'
import cardStyles from '../common/ProgramCard.module.css'
import './YouthPrograms.css'

const mockPrograms = [
  {
    id: 1,
    name: 'Community Clean-Up Drive',
    category: 'Environment',
    location: 'Barangay San Isidro Court',
    description: 'A barangay-wide clean-up activity focused on waste segregation and neighborhood sanitation.',
    createdAt: '2026-01-10',
    startDate: '2026-03-05T08:00:00',
    untilDate: '2026-04-15',
    participants: 48,
    status: 'Ongoing',
    joined: false,
  },
  {
    id: 2,
    name: 'Youth Leadership Workshop',
    category: 'Education',
    location: 'SK Session Hall',
    description: 'A skills workshop covering communication, project planning, and leadership fundamentals.',
    createdAt: '2026-02-01',
    startDate: '2026-04-05T09:00:00',
    untilDate: '2026-05-30',
    participants: 30,
    status: 'Not Started Yet',
    joined: false,
  },
  {
    id: 3,
    name: 'Inter-Barangay Sports Fest',
    category: 'Sports',
    location: 'Municipal Gymnasium',
    description: 'A multi-week sports event to promote health, teamwork, and friendly competition among youth.',
    createdAt: '2025-10-20',
    startDate: '2025-11-02T08:00:00',
    untilDate: '2026-01-20',
    participants: 120,
    status: 'Completed',
    joined: true,
  },
  {
    id: 4,
    name: 'Digital Literacy Bootcamp',
    category: 'Technology',
    location: 'Barangay Learning Center',
    description: 'Hands-on sessions on productivity tools, online safety, and basic web literacy for youth.',
    createdAt: '2026-02-15',
    startDate: '2026-03-01T08:00:00',
    untilDate: '2026-06-15',
    participants: 22,
    status: 'Ongoing',
    joined: true,
  },
]

function YouthPrograms() {
  const [programs, setPrograms] = useState(mockPrograms)
  const [now, setNow] = useState(() => Date.now())
  const [nameFilter, setNameFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [joinedFilter, setJoinedFilter] = useState('All')

  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(timerId)
  }, [])

  const handleJoin = (programId) => {
    setPrograms((currentPrograms) =>
      currentPrograms.map((program) => {
        if (program.id !== programId) return program

        return {
          ...program,
          joined: true,
          participants: program.participants + 1,
        }
      })
    )
  }

  const categoryOptions = ['All', ...new Set(programs.map((program) => program.category))]

  const filteredPrograms = programs.filter((program) => {
    const matchesName = program.name.toLowerCase().includes(nameFilter.trim().toLowerCase())
    const matchesStatus = statusFilter === 'All' || program.status === statusFilter
    const matchesCategory = categoryFilter === 'All' || program.category === categoryFilter
    const matchesJoined = joinedFilter === 'All'
      || (joinedFilter === 'Joined' && program.joined)
      || (joinedFilter === 'Not Joined' && !program.joined)

    return matchesName && matchesStatus && matchesCategory && matchesJoined
  })

  return (
    <div className="youth-programs-page">
      <header className="youth-programs-header">
        <h1>Programs</h1>
        <p>Browse available youth programs and join activities that match your interests.</p>
      </header>

      <section className="program-filters" aria-label="Program filters">
        <div className="filter-field filter-name">
          <label htmlFor="filter-name">Name</label>
          <input
            id="filter-name"
            type="text"
            value={nameFilter}
            onChange={(event) => setNameFilter(event.target.value)}
            placeholder="Search by program name"
          />
        </div>

        <div className="filter-field filter-status">
          <label htmlFor="filter-status">Status</label>
          <select
            id="filter-status"
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
          <label htmlFor="filter-category">Category</label>
          <select
            id="filter-category"
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

        <div className="filter-field filter-joined">
          <label htmlFor="filter-joined">Joined</label>
          <select
            id="filter-joined"
            value={joinedFilter}
            onChange={(event) => setJoinedFilter(event.target.value)}
          >
            <option value="All">All</option>
            <option value="Joined">Joined</option>
            <option value="Not Joined">Not Joined</option>
          </select>
        </div>
      </section>

      {filteredPrograms.length ? (
        <section className={cardStyles.cardsGrid} aria-label="Programs list">
          {filteredPrograms.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              now={now}
              allowJoin
              onJoin={handleJoin}
            />
          ))}
        </section>
      ) : (
        <p className={cardStyles.emptyState}>No programs found for the selected filters.</p>
      )}
    </div>
  )
}

export default YouthPrograms
