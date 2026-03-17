import { useEffect } from 'react'
import styles from './SkYouthProfileModal.module.css'

const getValue = (record, keys) => {
  for (const key of keys) {
    const value = record?.[key]
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return String(value)
    }
  }
  return '—'
}

const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function SkYouthProfileModal({ youth, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const firstName = getValue(youth, ['first_name', 'firstName'])
  const lastName = getValue(youth, ['last_name', 'lastName'])
  const fullName = `${firstName === '—' ? '' : firstName} ${lastName === '—' ? '' : lastName}`.trim() || getValue(youth, ['name'])

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="view-youth-profile-title">
      <div className={styles.container} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="view-youth-profile-title" className={styles.title}>Youth Profile</h2>
          <p className={styles.name}>{fullName}</p>
        </div>

        <section className={styles.section}>
          <p className={styles.sectionTitle}>Personal Information</p>
          <div className={styles.grid}>
            <div className={styles.field}>
              <span>Email</span>
              <strong>{getValue(youth, ['email'])}</strong>
            </div>

            <div className={styles.field}>
              <span>Birthdate</span>
              <strong>{formatDate(youth?.birth_date ?? youth?.birthDate ?? youth?.birthdate ?? youth?.bdate)}</strong>
            </div>

            <div className={styles.field}>
              <span>Status</span>
              <strong>{getValue(youth, ['status'])}</strong>
            </div>

            <div className={styles.field}>
              <span>Contact Number</span>
              <strong>{getValue(youth, ['contact_number', 'contactNumber', 'phone_number', 'phoneNumber'])}</strong>
            </div>

            <div className={styles.field}>
              <span>Barangay Name</span>
              <strong>{getValue(youth, ['barangay_name', 'barangayName', 'barangay'])}</strong>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <p className={styles.sectionTitle}>Education and Employment</p>
          <div className={styles.grid}>
            <div className={styles.field}>
              <span>School</span>
              <strong>{getValue(youth, ['school', 'school_name', 'schoolName'])}</strong>
            </div>

            <div className={styles.field}>
              <span>Education</span>
              <strong>{getValue(youth, ['education', 'education_level', 'educationLevel'])}</strong>
            </div>

            <div className={styles.field}>
              <span>Employment Status</span>
              <strong>{getValue(youth, ['employment_status', 'employmentStatus'])}</strong>
            </div>
          </div>
        </section>

        <div className={styles.actions}>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default SkYouthProfileModal
