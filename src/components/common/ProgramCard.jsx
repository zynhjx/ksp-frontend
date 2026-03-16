import styles from './ProgramCard.module.css'

const formatDate = (value) => new Date(value).toLocaleDateString('en-PH', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

const getStatusClass = (status) => {
  const normalizedStatus = status.toLowerCase()

  if (normalizedStatus === 'ongoing') return 'ongoing'
  if (normalizedStatus === 'not started yet') return 'notStarted'
  return 'completed'
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

const getCountdownLabel = (program, now) => {
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

function ProgramCard({
  program,
  now,
  allowJoin = false,
  onJoin,
}) {
  const statusClass = getStatusClass(program.status)

  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <h2>{program.name}</h2>
        <span className={`${styles.status} ${styles[statusClass]}`}>{program.status}</span>
      </div>

      <p className={styles.description}>{program.description}</p>

      <div className={styles.meta}>
        <p><span>Category</span><strong>{program.category}</strong></p>
        <p><span>Location</span><strong>{program.location}</strong></p>
        <p><span>Created</span><strong>{formatDate(program.createdAt)}</strong></p>
        <p><span>Participants</span><strong>{program.participants}</strong></p>
        <p><span>Start</span><strong>{formatDate(program.startDate)}</strong></p>
        <p><span>Until</span><strong>{formatDate(program.untilDate)}</strong></p>
      </div>

      <div className={styles.footer}>
        <p className={`${styles.countdown} ${styles[`countdown${statusClass[0].toUpperCase()}${statusClass.slice(1)}`]}`}>
          {getCountdownLabel(program, now)}
        </p>

        {allowJoin ? (
          !program.joined ? (
            <button
              type="button"
              className={styles.actionButton}
              onClick={() => onJoin?.(program.id)}
            >
              Join
            </button>
          ) : (
            <span className={styles.actionJoined}>Joined</span>
          )
        ) : null}
      </div>
    </article>
  )
}

export default ProgramCard