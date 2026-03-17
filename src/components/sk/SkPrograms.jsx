import { useCallback, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ManagementPageLayout from '../common/ManagementPageLayout'
import ProgramCard from '../common/ProgramCard'
import cardStyles from '../common/ProgramCard.module.css'
import { AuthContext } from '../../contexts/AuthContext'
import { apiFetch, apiUrl } from '../../api'
import AddProgramModal from './AddProgramModal'



const MIN_PERMISSION_TO_ADD = 2

const deriveProgramStatus = (startDate, untilDate) => {
  const startTime = new Date(startDate).getTime()
  const endTime = new Date(untilDate).getTime()
  const now = Date.now()

  if (Number.isNaN(startTime) || Number.isNaN(endTime)) return 'Not Started Yet'
  if (now < startTime) return 'Not Started Yet'
  if (now <= endTime) return 'Ongoing'
  return 'Completed'
}

const normalizeProgram = (program, index = 0) => {
  if (!program || typeof program !== 'object') return null

  const startDate = program.start_at ?? ''
  const untilDate = program.end_at ?? ''

  return {
    id: program.id ?? program._id ?? `program-${index}`,
    name: String(program.name ?? 'Untitled Program'),
    category: String(program.category ?? 'Uncategorized'),
    location: String(program.location ?? 'No location'),
    description: String(program.description ?? 'No description provided.'),
    createdAt: program.created_at,
    startDate,
    untilDate,
    participants: Number(program.participants ?? program.participantCount ?? 0),
    status: String(program.status ?? deriveProgramStatus(startDate, untilDate)),
  }
}

const extractPrograms = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.programs)) return payload.programs
  if (Array.isArray(payload?.data)) return payload.data
  if (payload?.program && typeof payload.program === 'object') return [payload.program]
  if (payload?.data && typeof payload.data === 'object') return [payload.data]
  return []
}

function SkPrograms() {
  const { user } = useContext(AuthContext)
  const [programs, setPrograms] = useState([])
  const [now, setNow] = useState(() => Date.now())
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [isAddProgramOpen, setIsAddProgramOpen] = useState(false)
  const permissionLevel = user?.permissionLevel ?? 0

  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(timerId)
  }, [])

  const fetchPrograms = useCallback(async () => {
    try {
      const res = await apiFetch(`${apiUrl}/api/sk/programs`)
      
      if (!res.ok) throw new Error('Failed to fetch programs')

      const payload = await res.json()
      console.log(payload)
      const normalizedPrograms = extractPrograms(payload)
        .map((program, index) => normalizeProgram(program, index))
        .filter(Boolean)

      console.log(normalizedPrograms)
      setPrograms(normalizedPrograms)
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Failed to load programs')
    }
  }, [])

  useEffect(() => {
    fetchPrograms()
  }, [fetchPrograms])

  const categoryOptions = [...new Set(programs.map((program) => program.category))]

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch = program.name.toLowerCase().includes(search.trim().toLowerCase())
    const matchesStatus = !statusFilter || program.status === statusFilter
    const matchesCategory = !categoryFilter || program.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleOpenAddProgram = () => {
    if (permissionLevel < MIN_PERMISSION_TO_ADD) return
    setIsAddProgramOpen(true)
  }

  const handleCloseAddProgram = () => {
    setIsAddProgramOpen(false)
  }

  const handleAddProgram = async (formData) => {
    if (permissionLevel < MIN_PERMISSION_TO_ADD) return

    const { startDateTime, endDateTime, name, category, location, description } = formData

    const payload = {
      name: name.trim(),
      category: category.trim(),
      location: location.trim(),
      description: description.trim(),
      startDate: startDateTime,
      untilDate: endDateTime,
    }

    try {
      const res = await apiFetch(`${apiUrl}/api/sk/programs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.message || 'Failed to add program')
      }

      const createdPayload = await res.json()
      const [createdProgram] = extractPrograms(createdPayload)
      const normalizedCreatedProgram = normalizeProgram(createdProgram)

      if (normalizedCreatedProgram) {
        setPrograms((previous) => [
          normalizedCreatedProgram,
          ...previous.filter((program) => program.id !== normalizedCreatedProgram.id),
        ])
      } else {
        await fetchPrograms()
      }

      setSearch('')
      setStatusFilter('')
      setCategoryFilter('')
      setNow(Date.now())
      handleCloseAddProgram()
      toast.success('Program added successfully')
    } catch (err) {
      console.error(err)
      toast.error(err.message)
    }
  }

  return (
    <ManagementPageLayout
      title="Programs"
      subtitle="View and monitor barangay programs using program cards instead of a table."
      showAddButton={permissionLevel >= MIN_PERMISSION_TO_ADD}
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

      {isAddProgramOpen && (
        <AddProgramModal
          onClose={handleCloseAddProgram}
          onSubmit={handleAddProgram}
        />
      )}
    </ManagementPageLayout>
  )
}

export default SkPrograms