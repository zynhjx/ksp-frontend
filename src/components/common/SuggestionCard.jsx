import styles from './SuggestionCard.module.css';

const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const getCategoryClass = (category) => {
  if (category === 'Education') return styles.catEducation;
  if (category === 'Employment') return styles.catEmployment;
  if (category === 'Health') return styles.catHealth;
  if (category === 'Sports') return styles.catSports;
  if (category === 'Environment') return styles.catEnvironment;
  if (category === 'Community / Social') return styles.catCommunity;

  return styles.catOther;
};

function SuggestionCard({ suggestion }) {
  return (
    <article className={styles.suggestionCard}>
      <div className={styles.suggestionCardTop}>
        <h2>{suggestion.title}</h2>
        <span className={`${styles.suggestionCategory} ${getCategoryClass(suggestion.category)}`}>
          {suggestion.category}
        </span>
      </div>

      <div className={styles.suggestionSection}>
        <p className={styles.suggestionSectionLabel}>Description</p>
        <p className={styles.suggestionSectionBody}>{suggestion.description}</p>
      </div>

      <div className={styles.suggestionSection}>
        <p className={styles.suggestionSectionLabel}>Suggested Solution</p>
        <p className={styles.suggestionSectionBody}>{suggestion.suggestedSolution}</p>
      </div>

      <div className={styles.suggestionMeta}>
        <p>
          <span>Location</span>
          <strong>{suggestion.location}</strong>
        </p>
        <p>
          <span>Submitted</span>
          <strong>{formatDate(suggestion.submittedAt)}</strong>
        </p>
      </div>

      <p className={styles.suggestionCredit}>
        Submitted by <strong>{suggestion.submittedBy ?? 'Unknown'}</strong>
      </p>
    </article>
  );
}

export default SuggestionCard;
