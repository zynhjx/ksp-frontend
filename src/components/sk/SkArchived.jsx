import { useMemo, useState } from 'react';
import ManagementPageLayout from '../common/ManagementPageLayout';
import SuggestionCard from '../common/SuggestionCard';
import { suggestionCardsGridClassName } from '../common/suggestionCardClasses';
import { CATEGORIES, SUGGESTIONS } from './suggestionData';

function SkArchived() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filteredArchivedSuggestions = useMemo(
    () =>
      SUGGESTIONS.filter((suggestion) => {
        const normalizedSearch = search.trim().toLowerCase();
        const matchesSearch =
          !normalizedSearch ||
          suggestion.title.toLowerCase().includes(normalizedSearch) ||
          suggestion.description.toLowerCase().includes(normalizedSearch) ||
          suggestion.location.toLowerCase().includes(normalizedSearch);
        const matchesCategory = !categoryFilter || suggestion.category === categoryFilter;

        return suggestion.status === 'Archived' && matchesSearch && matchesCategory;
      }),
    [search, categoryFilter]
  );

  return (
    <ManagementPageLayout
      title="Archived Suggestions"
      subtitle="View archived suggestions submitted by youth in your barangay."
      showAddButton={false}
      searchPlaceholder="Search archived suggestions"
      searchValue={search}
      onSearchChange={(event) => setSearch(event.target.value)}
      filters={(
        <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      )}
    >
      {filteredArchivedSuggestions.length > 0 ? (
        <section className={suggestionCardsGridClassName} aria-label="Archived suggestions list">
          {filteredArchivedSuggestions.map((suggestion) => (
            <SuggestionCard key={suggestion.id} suggestion={suggestion} />
          ))}
        </section>
      ) : (
        <p>No archived suggestions found for the selected search and filters.</p>
      )}
    </ManagementPageLayout>
  );
}

export default SkArchived;
