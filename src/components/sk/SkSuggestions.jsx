import { useContext, useState } from 'react';
import ManagementPageLayout from '../common/ManagementPageLayout';
import { suggestionCardsGridClassName } from '../common/suggestionCardClasses';
import cardStyles from '../common/SuggestionCard.module.css';
function SkSuggestionCard({ suggestion, isNew, onTogglePin, onArchive, onToggleLike, onOpenDetails, permissionLevel }) {
  return (
    <article
      className={cardStyles.suggestionCard}
      role="button"
      tabIndex={0}
      onClick={onOpenDetails}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpenDetails();
        }
      }}
    >
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
        <button
          type="button"
          className={`${styles.suggestionActionButton} ${styles.likeActionButton}`}
          onClick={(event) => {
            event.stopPropagation();
            onToggleLike();
          }}
        >
          {suggestion.likedByCurrentOfficial ? 'Unlike' : 'Like'} ({suggestion.likesCount || 0})
        </button>

        {permissionLevel >= 2 ? (
          <>
            <button
              type="button"
              className={styles.suggestionActionButton}
              onClick={(event) => {
                event.stopPropagation();
                onTogglePin();
              }}
            >
              {suggestion.pinned ? 'Unpin' : 'Pin'}
            </button>
            <button
              type="button"
              className={styles.suggestionActionButton}
              onClick={(event) => {
                event.stopPropagation();
                onArchive();
              }}
              disabled={suggestion.status === 'Archived'}
            >
              {suggestion.status === 'Archived' ? 'Archived' : 'Archive'}
            </button>
          </>
        ) : null}
      </div>
    </article>
  );
}
import styles from './SkSuggestions.module.css';
import { ACTIVE_STATUSES, CATEGORIES } from './suggestionData';
import { useEffect } from 'react';
import { apiUrl, apiFetch } from '../../api';
import { AuthContext } from '../../contexts/AuthContext';
import EmptyState from '../common/EmptyState'
import { toast } from 'react-toastify';

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



function SkSuggestions() {
  const { user } = useContext(AuthContext);
  const [suggestions, setSuggestions] = useState([]);

  // Normalize backend or mock data to frontend shape (always camelCase for UI)
  const normalizeSuggestion = (s) => ({
    id: s.id,
    title: s.title,
    category: s.category,
    description: s.description,
    suggestedSolution: s.suggested_solution ?? s.suggestedSolution ?? '',
    location: s.location,
    status: s.status,
    pinned: s.pinned ?? s.is_pinned ?? false,
    createdAt: s.created_at ?? s.createdAt ?? '',
    updatedAt: s.updated_at ?? s.updatedAt ?? '',
    submittedAt: s.submitted_at ?? s.submittedAt ?? '',
    submittedBy: s.submitted_by ?? s.submittedBy ?? '',
    likesCount: s.likes_count ?? s.likesCount ?? 0,
    likedByCurrentOfficial: s.liked_by_current_official ?? s.likedByCurrentOfficial ?? false,
  });

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await apiFetch(`${apiUrl}/api/sk/suggestions`);
        if (!res.ok) throw new Error('Failed to fetch suggestions');
        const data = await res.json();
        setSuggestions(Array.isArray(data) ? data.map(normalizeSuggestion) : []);
      } catch (err) {
        toast.error(err.message)
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, []);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedSuggestionId, setSelectedSuggestionId] = useState(null);
  const [viewedIds, setViewedIds] = useState(new Set());
  const permissionLevel = user?.permissionLevel ?? 0;

  const handleCloseModal = () => {
    setSelectedSuggestionId(null);
  };

  const handleOpenSuggestionDetails = (suggestionId) => {
    setSelectedSuggestionId(suggestionId);

    if (viewedIds.has(suggestionId)) return;

    setSuggestions((prev) =>
      prev.map((suggestion) =>
        suggestion.id === suggestionId && suggestion.status === 'Pending'
          ? { ...suggestion, status: 'Under Review' }
          : suggestion
      )
    );
    setViewedIds((prev) => new Set([...prev, suggestionId]));
  };

  const handleTogglePin = (suggestionId) => {
    if (permissionLevel < 2) return;
    setSuggestions((prev) =>
      prev.map((suggestion) =>
        suggestion.id === suggestionId ? { ...suggestion, pinned: !suggestion.pinned } : suggestion
      )
    );
  };

  const handleArchive = (suggestionId) => {
    if (permissionLevel < 2) return;
    setSuggestions((prev) =>
      prev.map((suggestion) =>
        suggestion.id === suggestionId ? { ...suggestion, status: 'Archived' } : suggestion
      )
    );
  };

  const handleToggleLike = (suggestionId) => {
    setSuggestions((prev) =>
      prev.map((suggestion) => {
        if (suggestion.id !== suggestionId) return suggestion;

        const isCurrentlyLiked = Boolean(suggestion.likedByCurrentOfficial);
        const currentLikesCount = Number(suggestion.likesCount || 0);
        const nextLikesCount = isCurrentlyLiked
          ? Math.max(0, currentLikesCount - 1)
          : currentLikesCount + 1;

        return {
          ...suggestion,
          likedByCurrentOfficial: !isCurrentlyLiked,
          likesCount: nextLikesCount,
        };
      })
    );
  };

  const handleModalStatusChange = (nextStatus) => {
    if (permissionLevel < 3 || selectedSuggestionId === null) return;

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
              permissionLevel={permissionLevel}
              isNew={!viewedIds.has(suggestion.id) && suggestion.status === 'Pending'}
              onOpenDetails={() => handleOpenSuggestionDetails(suggestion.id)}
              onToggleLike={() => handleToggleLike(suggestion.id)}
              onTogglePin={() => handleTogglePin(suggestion.id)}
              onArchive={() => handleArchive(suggestion.id)}
            />
          ))}
        </section>
      ) : (
        <EmptyState />
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

              <div
                className={`${styles.detailsModalActionsRow} ${
                  permissionLevel >= 3 ? '' : styles.detailsModalActionsRowOnlyLike
                }`}
              >
                <button
                  type="button"
                  className={`${styles.detailsModalActionButton} ${styles.detailsModalActionLike}`}
                  onClick={() => handleToggleLike(selectedSuggestion.id)}
                >
                  {selectedSuggestion.likedByCurrentOfficial ? 'Unlike' : 'Like'} ({selectedSuggestion.likesCount || 0})
                </button>

                {permissionLevel >= 3 ? (
                  <div className={styles.detailsModalStatusActions}>
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
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </ManagementPageLayout>
  );
}

export default SkSuggestions;
