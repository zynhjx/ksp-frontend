import { useEffect, useState } from 'react'
import styles from './AddProgramModal.module.css'

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

function AddProgramModal({ onClose, onSubmit }) {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')

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

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')

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

    onSubmit({ ...form, startTime, endTime, startDateTime, endDateTime })
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="add-program-title">
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <h2 id="add-program-title" className={styles.title}>Add Program</h2>
        <p className={styles.subtitle}>Create a new youth program to show in the list.</p>

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
            <button type="submit" className={styles.saveBtn}>
              Add Program
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProgramModal
