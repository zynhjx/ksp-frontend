import { useState } from 'react';
import ManagementPageLayout from '../common/ManagementPageLayout';
import { suggestionCardsGridClassName } from '../common/suggestionCardClasses';
import cardStyles from '../common/SuggestionCard.module.css';
import styles from './SkSuggestions.module.css';
import { ACTIVE_STATUSES, CATEGORIES, SUGGESTIONS } from './suggestionData';

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

function SkSuggestionCard({ suggestion, isNew, onTogglePin, onArchive, onView }) {
  return (
    <article className={cardStyles.suggestionCard}>
        {isNew && <span className={styles.newBadge}>New</span>}
        <div className={styles.suggestionCardTop}>
          <h2 className={styles.suggestionCardTitle}>{suggestion.title}</h2>
          <span className={`${styles.suggestionCategory} ${getCategoryClass(suggestion.category)}`}>
            {suggestion.category}
          </span>
        </div>

      <div className={styles.suggestionSection}>
        <p className={styles.suggestionSectionLabel}>Description</p>
        <p className={styles.suggestionSectionBody}>{suggestion.description}</p>
      </div>

      <div className={styles.suggestionActions}>
        <button type="button" className={styles.suggestionActionButton} onClick={onTogglePin}>
          {suggestion.pinned ? 'Unpin' : 'Pin'}
        </button>
        <button
          type="button"
          className={styles.suggestionActionButton}
          onClick={onArchive}
          disabled={suggestion.status === 'Archived'}
        >
          {suggestion.status === 'Archived' ? 'Archived' : 'Archive'}
        </button>
        <button type="button" className={styles.suggestionActionButtonPrimary} onClick={onView}>
          View
        </button>
      </div>
    </article>
  );
}

function SkSuggestions() {
  const [suggestions, setSuggestions] = useState(SUGGESTIONS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedSuggestionId, setSelectedSuggestionId] = useState(null);
  const [viewedIds, setViewedIds] = useState(new Set());

  const handleCloseModal = () => {
    if (selectedSuggestionId !== null && !viewedIds.has(selectedSuggestionId)) {
      setSuggestions((prev) =>
        prev.map((suggestion) =>
          suggestion.id === selectedSuggestionId && suggestion.status === 'Pending'
            ? { ...suggestion, status: 'Under Review' }
            : suggestion
        )
      );
      setViewedIds((prev) => new Set([...prev, selectedSuggestionId]));
    }
    setSelectedSuggestionId(null);
  };

  const handleTogglePin = (suggestionId) => {
    setSuggestions((prev) =>
      prev.map((suggestion) =>
        suggestion.id === suggestionId ? { ...suggestion, pinned: !suggestion.pinned } : suggestion
      )
    );
  };

  const handleArchive = (suggestionId) => {
    setSuggestions((prev) =>
      prev.map((suggestion) =>
        suggestion.id === suggestionId ? { ...suggestion, status: 'Archived' } : suggestion
      )
    );
  };

  const handleModalStatusChange = (nextStatus) => {
    if (selectedSuggestionId === null) return;

    setSuggestions((prev) =>
      prev.map((suggestion) =>
        suggestion.id === selectedSuggestionId ? { ...suggestion, status: nextStatus } : suggestion
      )
    );
    setViewedIds((prev) => new Set([...prev, selectedSuggestionId]));
    setSelectedSuggestionId(null);
  };

  const filteredSuggestions = suggestions.filter((suggestion) => {
    const normalizedSearch = search.trim().toLowerCase();
    const matchesSearch =
      !normalizedSearch ||
      suggestion.title.toLowerCase().includes(normalizedSearch) ||
      suggestion.description.toLowerCase().includes(normalizedSearch) ||
      suggestion.location.toLowerCase().includes(normalizedSearch);
    const matchesCategory = !categoryFilter || suggestion.category === categoryFilter;
    const matchesStatus = !statusFilter || suggestion.status === statusFilter;
    const isArchived = suggestion.status === 'Archived';

    return !isArchived && matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => Number(b.pinned) - Number(a.pinned));

  const selectedSuggestion = suggestions.find((suggestion) => suggestion.id === selectedSuggestionId) ?? null;

  return (
    <ManagementPageLayout
      title="Suggestions"
      subtitle="View and manage suggestions submitted by youth in your barangay."
      showAddButton={false}
      searchPlaceholder="Search suggestions"
      searchValue={search}
      onSearchChange={(event) => setSearch(event.target.value)}
      filters={(
        <>
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">All Status</option>
            {ACTIVE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </>
      )}
    >
      {filteredSuggestions.length > 0 ? (
        <section className={suggestionCardsGridClassName} aria-label="Suggestions list">
          {filteredSuggestions.map((suggestion) => (
            <SkSuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              isNew={!viewedIds.has(suggestion.id) && suggestion.status === 'Pending'}
              onView={() => setSelectedSuggestionId(suggestion.id)}
              onTogglePin={() => handleTogglePin(suggestion.id)}
              onArchive={() => handleArchive(suggestion.id)}
            />
          ))}
        </section>
      ) : (
        <p>No suggestions found for the selected search and filters.</p>
      )}

      {selectedSuggestion ? (
        <div
          className={styles.detailsModalOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="sk-suggestion-details-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div className={styles.detailsModal}>
            <div className={styles.detailsModalHeader}>
              <h2 id="sk-suggestion-details-title">Suggestion Details</h2>
              <button
                type="button"
                className={styles.detailsModalCloseButton}
                onClick={handleCloseModal}
                aria-label="Close suggestion details"
              >
                ✕
              </button>
            </div>

            <div className={styles.detailsModalBody}>
              <div className={styles.suggestionCardTop}>
                <h3 className={styles.suggestionCardTitle}>{selectedSuggestion.title}</h3>
                <span className={`${styles.suggestionCategory} ${getCategoryClass(selectedSuggestion.category)}`}>
                  {selectedSuggestion.category}
                </span>
              </div>

              <div className={styles.suggestionSection}>
                <p className={styles.suggestionSectionLabel}>Description</p>
                <p className={styles.suggestionSectionBody}>{selectedSuggestion.description}</p>
              </div>

              <div className={styles.suggestionSection}>
                <p className={styles.suggestionSectionLabel}>Suggested Solution</p>
                <p className={styles.suggestionSectionBody}>{selectedSuggestion.suggestedSolution}</p>
              </div>

              <div className={styles.suggestionMeta}>
                <p>
                  <span>Location</span>
                  <strong>{selectedSuggestion.location}</strong>
                </p>
                <p>
                  <span>Submitted</span>
                  <strong>{formatDate(selectedSuggestion.submittedAt)}</strong>
                </p>
              </div>

              <p className={cardStyles.suggestionCredit}>
                Submitted by <strong>{selectedSuggestion.submittedBy ?? 'Unknown'}</strong>
              </p>

              <div className={styles.detailsModalActions}>
                <button
                  type="button"
                  className={`${styles.detailsModalActionButton} ${styles.detailsModalActionApprove}`}
                  onClick={() => handleModalStatusChange('Accepted')}
                  disabled={selectedSuggestion.status === 'Accepted'}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className={`${styles.detailsModalActionButton} ${styles.detailsModalActionImplement}`}
                  onClick={() => handleModalStatusChange('Implemented')}
                  disabled={selectedSuggestion.status === 'Implemented'}
                >
                  Implement
                </button>
                <button
                  type="button"
                  className={`${styles.detailsModalActionButton} ${styles.detailsModalActionDecline}`}
                  onClick={() => handleModalStatusChange('Declined')}
                  disabled={selectedSuggestion.status === 'Declined'}
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </ManagementPageLayout>
  );
}

export default SkSuggestions;
