import { useContext, useEffect, useState } from 'react'
import ManagementPageLayout from '../common/ManagementPageLayout'
import ProgramCard from '../common/ProgramCard'
import cardStyles from '../common/ProgramCard.module.css'
import styles from './SkPrograms.module.css'
import { AuthContext } from '../../contexts/AuthContext'

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

const initialProgramForm = {
  name: '',
  category: '',
  location: '',
  description: '',
  startDate: '',
  startTime: '',
  untilDate: '',
  untilTime: '',
}

const getProgramStatus = (startDateTime, untilDateTime) => {
  const now = Date.now()
  const startTime = new Date(startDateTime).getTime()
  const untilTime = new Date(untilDateTime).getTime()

  if (now < startTime) return 'Not Started Yet'
  if (now <= untilTime) return 'Ongoing'
  return 'Completed'
}

function SkPrograms() {
  const { user } = useContext(AuthContext)
  const [programs, setPrograms] = useState(skPrograms)
  const [now, setNow] = useState(() => Date.now())
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [isAddProgramOpen, setIsAddProgramOpen] = useState(false)
  const [programForm, setProgramForm] = useState(initialProgramForm)
  const permissionLevel = user?.permissionLevel ?? 0

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

  const handleOpenAddProgram = () => {
    if (permissionLevel <= 3) return
    setProgramForm(initialProgramForm)
    setIsAddProgramOpen(true)
  }

  const handleCloseAddProgram = () => {
    setIsAddProgramOpen(false)
    setProgramForm(initialProgramForm)
  }

  const handleProgramFormChange = (event) => {
    const { name, value } = event.target
    setProgramForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleAddProgram = (event) => {
    event.preventDefault()
    if (permissionLevel <= 3) return

    const startDateTime = `${programForm.startDate}T${programForm.startTime}:00`
    const untilDateTime = `${programForm.untilDate}T${programForm.untilTime}:00`
    const startTime = new Date(startDateTime).getTime()
    const untilTime = new Date(untilDateTime).getTime()

    if (Number.isNaN(startTime) || Number.isNaN(untilTime) || untilTime < startTime) {
      return
    }

    const nextId = programs.length ? Math.max(...programs.map((program) => program.id)) + 1 : 1
    const createdAt = new Date().toISOString().slice(0, 10)
    const status = getProgramStatus(startDateTime, untilDateTime)

    const newProgram = {
      id: nextId,
      name: programForm.name.trim(),
      category: programForm.category.trim(),
      location: programForm.location.trim(),
      description: programForm.description.trim(),
      createdAt,
      startDate: startDateTime,
      untilDate: untilDateTime,
      participants: 0,
      status,
      joined: false,
    }

    setPrograms((previous) => [newProgram, ...previous])
    setSearch('')
    setStatusFilter('')
    setCategoryFilter('')
    setNow(Date.now())
    handleCloseAddProgram()
  }

  return (
    <ManagementPageLayout
      title="Programs"
      subtitle="View and monitor barangay programs using program cards instead of a table."
      showAddButton={permissionLevel > 3}
      addButtonLabel="+ Add Program"
      onAddButtonClick={handleOpenAddProgram}
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

      {isAddProgramOpen ? (
        <div className={styles.modalOverlay} onClick={handleCloseAddProgram}>
          <div className={styles.modalContainer} onClick={(event) => event.stopPropagation()}>
            <h2>Add Program</h2>
            <p className={styles.modalSubtitle}>Create a new youth program to show in this list.</p>

            <form className={styles.modalForm} onSubmit={handleAddProgram}>
              <div className={styles.fieldGroup}>
                <label htmlFor="program-name">Program Name</label>
                <input
                  id="program-name"
                  name="name"
                  type="text"
                  placeholder="Enter program name"
                  value={programForm.name}
                  onChange={handleProgramFormChange}
                  required
                />
              </div>

              <div className={styles.twoColumn}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="program-category">Category</label>
                  <input
                    id="program-category"
                    name="category"
                    type="text"
                    placeholder="e.g. Education"
                    value={programForm.category}
                    onChange={handleProgramFormChange}
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="program-location">Location</label>
                  <input
                    id="program-location"
                    name="location"
                    type="text"
                    placeholder="Enter venue or location"
                    value={programForm.location}
                    onChange={handleProgramFormChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="program-description">Description</label>
                <textarea
                  id="program-description"
                  name="description"
                  rows={4}
                  placeholder="Write a short description of the program"
                  value={programForm.description}
                  onChange={handleProgramFormChange}
                  required
                />
              </div>

              <div className={styles.twoColumn}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="program-start-date">Start Date</label>
                  <input
                    id="program-start-date"
                    name="startDate"
                    type="date"
                    value={programForm.startDate}
                    onChange={handleProgramFormChange}
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="program-start-time">Start Time</label>
                  <input
                    id="program-start-time"
                    name="startTime"
                    type="time"
                    value={programForm.startTime}
                    onChange={handleProgramFormChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.twoColumn}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="program-until-date">Until Date</label>
                  <input
                    id="program-until-date"
                    name="untilDate"
                    type="date"
                    value={programForm.untilDate}
                    onChange={handleProgramFormChange}
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="program-until-time">Until Time</label>
                  <input
                    id="program-until-time"
                    name="untilTime"
                    type="time"
                    value={programForm.untilTime}
                    onChange={handleProgramFormChange}
                    required
                  />
                </div>
              </div>

              <p className={styles.modalHint}>Status is set automatically based on start and until date/time.</p>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={handleCloseAddProgram}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn}>
                  Add Program
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </ManagementPageLayout>
  )
}

export default SkPrograms