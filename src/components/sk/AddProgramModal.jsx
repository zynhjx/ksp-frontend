import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import styles from './AddProgramModal.module.css'

const MySwal = withReactContent(Swal)

const CATEGORY_OPTIONS = [
  'Arts & Culture',
  'Education',
  'Environment',
  'Health',
  'Livelihood',
  'Sports',
  'Technology',
  'Others',
]

const initialForm = {
  name: '',
  category: '',
  location: '',
  description: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
}

const toInputDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const toInputTime = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

const buildFormFromInitialValues = (initialValues) => {
  if (!initialValues) return initialForm

  return {
    name: String(initialValues.name ?? ''),
    category: String(initialValues.category ?? ''),
    location: String(initialValues.location ?? ''),
    description: String(initialValues.description ?? ''),
    startDate: toInputDate(initialValues.startDate),
    startTime: toInputTime(initialValues.startDate),
    endDate: toInputDate(initialValues.untilDate),
    endTime: toInputTime(initialValues.untilDate),
  }
}

const normalizeComparableForm = (value) => ({
  name: (value.name || '').trim(),
  category: (value.category || '').trim(),
  location: (value.location || '').trim(),
  description: (value.description || '').trim(),
  startDate: value.startDate || '',
  startTime: value.startTime || '',
  endDate: value.endDate || '',
  endTime: value.endTime || '',
})

function AddProgramModal({ onClose, onSubmit, mode = 'add', initialValues = null }) {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')

  const isEditMode = mode === 'edit'
  const hasChanges = useMemo(() => {
    if (!isEditMode) return true

    const initialFormValues = buildFormFromInitialValues(initialValues)
    const currentComparable = normalizeComparableForm(form)
    const initialComparable = normalizeComparableForm(initialFormValues)

    return JSON.stringify(currentComparable) !== JSON.stringify(initialComparable)
  }, [form, initialValues, isEditMode])

  useEffect(() => {
    setForm(buildFormFromInitialValues(initialValues))
  }, [initialValues])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (isEditMode) {
      if (!hasChanges) {
        toast.info('No changes detected.')
        return
      }
    }

    const startTime = form.startTime || '00:00'
    const endTime = form.endTime || '00:00'
    const startDateTime = `${form.startDate}T${startTime}:00`
    const endDateTime = `${form.endDate}T${endTime}:00`
    const startMs = new Date(startDateTime).getTime()
    const endMs = new Date(endDateTime).getTime()

    if (Number.isNaN(startMs) || Number.isNaN(endMs)) {
      setError('Please provide valid start and end dates/times.')
      return
    }

    if (endMs < startMs) {
      setError('End date/time must be after start date/time.')
      return
    }

    if (isEditMode) {
      const confirmResult = await MySwal.fire({
        title: 'Save changes?',
        text: 'Are you sure you want to update this program?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, save changes',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
        didOpen: () => {
          const swalContainer = Swal.getContainer()
          if (swalContainer) swalContainer.style.zIndex = '1300'
        },
      })

      if (!confirmResult.isConfirmed) return
    }

    onSubmit({ ...form, startTime, endTime, startDateTime, endDateTime })
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="program-modal-title">
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <h2 id="program-modal-title" className={styles.title}>{isEditMode ? 'Edit Program' : 'Add Program'}</h2>
        <p className={styles.subtitle}>
          {isEditMode
            ? 'Update the program details.'
            : 'Create a new youth program to show in the list.'}
        </p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Program Name */}
          <div className={styles.fieldGroup}>
            <label htmlFor="ap-name">Program Name</label>
            <input
              id="ap-name"
              name="name"
              type="text"
              placeholder="Enter program name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category & Location */}
          <div className={styles.twoCol}>
            <div className={styles.fieldGroup}>
              <label htmlFor="ap-category">Category</label>
              <select
                id="ap-category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select a category</option>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="ap-location">Location</label>
              <input
                id="ap-location"
                name="location"
                type="text"
                placeholder="Enter venue or location"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className={styles.fieldGroup}>
            <label htmlFor="ap-description">Description</label>
            <textarea
              id="ap-description"
              name="description"
              rows={4}
              placeholder="Write a short description of the program"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Start Date & Start Time */}
          <div className={styles.twoCol}>
            <div className={styles.fieldGroup}>
              <label htmlFor="ap-start-date">Start Date</label>
              <input
                id="ap-start-date"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="ap-start-time">Start Time</label>
              <input
                id="ap-start-time"
                name="startTime"
                type="time"
                value={form.startTime}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* End Date & End Time */}
          <div className={styles.twoCol}>
            <div className={styles.fieldGroup}>
              <label htmlFor="ap-end-date">End Date</label>
              <input
                id="ap-end-date"
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="ap-end-time">End Time</label>
              <input
                id="ap-end-time"
                name="endTime"
                type="time"
                value={form.endTime}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <p className={styles.errorMsg} role="alert">{error}</p>}

          <p className={styles.hint}>Program status is set automatically based on the start and end date/time.</p>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={isEditMode && !hasChanges}
            >
              {isEditMode ? 'Save Changes' : 'Add Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProgramModal
