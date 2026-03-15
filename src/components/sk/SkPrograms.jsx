import { useEffect, useState } from 'react'
import ManagementPageLayout from '../common/ManagementPageLayout'
import ProgramCard from '../common/ProgramCard'
import cardStyles from '../common/ProgramCard.module.css'

const skPrograms = [
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

function SkPrograms() {
  const [programs] = useState(skPrograms)
  const [now, setNow] = useState(() => Date.now())
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(timerId)
  }, [])

  const categoryOptions = [...new Set(programs.map((program) => program.category))]

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch = program.name.toLowerCase().includes(search.trim().toLowerCase())
    const matchesStatus = !statusFilter || program.status === statusFilter
    const matchesCategory = !categoryFilter || program.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  return (
    <ManagementPageLayout
      title="Programs"
      subtitle="View and monitor barangay programs using program cards instead of a table."
      showAddButton
      addButtonLabel="+ Add Program"
      searchPlaceholder="Search by program name"
      searchValue={search}
      onSearchChange={(event) => setSearch(event.target.value)}
      filters={(
        <>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">All Status</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Not Started Yet">Not Started Yet</option>
            <option value="Completed">Completed</option>
          </select>

          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="">All Categories</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </>
      )}
    >
      {filteredPrograms.length ? (
        <section className={cardStyles.cardsGrid} aria-label="Programs list">
          {filteredPrograms.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              now={now}
            />
          ))}
        </section>
      ) : (
        <p className={cardStyles.emptyState}>No programs found for the selected filters.</p>
      )}
    </ManagementPageLayout>
  )
}

export default SkPrograms