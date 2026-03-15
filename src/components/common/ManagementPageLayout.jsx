import styles from './ManagementPageLayout.module.css';

function ManagementPageLayout({
  title,
  subtitle,
  addButtonLabel,
  onAddButtonClick,
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  filters,
  children,
  showAddButton = true,
  showSearch = true,
}) {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1>{title}</h1>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        </div>

        {showAddButton ? (
          <button className={styles.addBtn} onClick={onAddButtonClick}>
            {addButtonLabel}
          </button>
        ) : null}
      </div>

      {(showSearch || filters) ? (
        <div className={styles.controlsRow}>
          {showSearch ? (
            <div className={styles.searchBar}>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={onSearchChange}
              />
            </div>
          ) : null}

          {filters ? <div className={styles.filters}>{filters}</div> : null}
        </div>
      ) : null}

      {children}
    </div>
  );
}

export default ManagementPageLayout;
