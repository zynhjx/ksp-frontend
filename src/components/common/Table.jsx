import style from './Table.module.css'

const getFullName = (row) => {
  if (row.name) return row.name;

  const firstName = row.firstName || row.first_name || '';
  const lastName = row.lastName || row.last_name || '';
  return `${firstName} ${lastName}`.trim();
};

const getRegisteredValue = (row) => {
  if (typeof row?.registered === 'boolean') return row.registered;
  if (typeof row?.is_registered === 'boolean') return row.is_registered;
  return null;
};

function DesktopActionButtons({
  row,
  onViewData,
  onEdit,
  onDelete,
  deleteLabel,
  permissionLevel,
  showViewButton = false,
}) {
  return (
    <td className={style.actions}>
      {showViewButton && (
        <button
          className={style.viewBtn}
          onClick={(event) => {
            event.stopPropagation();
            onViewData?.(row);
          }}
        >
          View Profile
        </button>
      )}

      {permissionLevel >= 1 ? (
        <>
          <button
            className={style.editBtn}
            onClick={(event) => {
              event.stopPropagation();
              onEdit?.(row);
            }}
          >
            Edit
          </button>
          <button
            className={style.deleteBtn}
            onClick={(event) => {
              event.stopPropagation();
              onDelete?.(row);
            }}
          >
            {deleteLabel}
          </button>
        </>
      ) : null}
    </td>
  );
}

function CardActionButtons({
  row,
  onViewData,
  onEdit,
  onDelete,
  deleteLabel,
  permissionLevel,
  showViewButton = false,
}) {
  return (
    <div className={style.cardFooter}>
      {showViewButton && (
        <button
          className={style.viewBtn}
          onClick={(event) => {
            event.stopPropagation();
            onViewData?.(row);
          }}
        >
          View Data
        </button>
      )}

      {permissionLevel >= 1 ? (
        <>
          <button
            className={style.editBtn}
            onClick={(event) => {
              event.stopPropagation();
              onEdit?.(row);
            }}
          >
            Edit
          </button>
          <button
            className={style.deleteBtn}
            onClick={(event) => {
              event.stopPropagation();
              onDelete?.(row);
            }}
          >
            {deleteLabel}
          </button>
        </>
      ) : null}
    </div>
  );
}

function StatusCell({ status }) {
  return (
    <td className={`${style.status} ${style.center} ${status === 'Active' ? style.green : style.red}`}>
      {status}
    </td>
  );
}

function SkTableContent(props) {
  const { rows, onEdit, onDelete, deleteLabel, permissionLevel } = props;

  return (
    <>
      <table className={style.table} role="grid">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Barangay</th>
            <th>Email</th>
            <th className={style.center}>Status</th>
            <th className={style.center}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={style.tableRow}>
              <td>{row.name}</td>
              <td>{row.position}</td>
              <td>{row.barangay || '-'}</td>
              <td>{row.email}</td>
              <StatusCell status={row.status} />
              <DesktopActionButtons
                row={row}
                onEdit={onEdit}
                onDelete={onDelete}
                deleteLabel={deleteLabel}
                permissionLevel={permissionLevel}
              />
            </tr>
          ))}
        </tbody>
      </table>

      <div className={style.cardContainer} role="list">
        {rows.map((row) => (
          <article key={row.id} className={style.card} role="listitem">
            <div className={style.cardHeader}>
              <h3 className={style.cardName}>{row.name}</h3>
              <span className={`${style.statusBadge} ${style[row.status?.toLowerCase()]}`}>
                {row.status}
              </span>
            </div>
            <div className={style.cardBody}>
              <div className={style.cardField}>
                <label className={style.fieldLabel}>Position</label>
                <p className={style.fieldValue}>{row.position}</p>
              </div>
              <div className={style.cardField}>
                <label className={style.fieldLabel}>Barangay</label>
                <p className={style.fieldValue}>{row.barangay || 'None'}</p>
              </div>
              <div className={style.cardField}>
                <label className={style.fieldLabel}>Email</label>
                <p className={style.fieldValue}>{row.email}</p>
              </div>
            </div>
            <CardActionButtons
              row={row}
              onEdit={onEdit}
              onDelete={onDelete}
              deleteLabel={deleteLabel}
              permissionLevel={permissionLevel}
            />
          </article>
        ))}
      </div>
    </>
  );
}

function YouthTableContent(props) {
  const {
    rows,
    onViewData,
    onEdit,
    onDelete,
    deleteLabel,
    permissionLevel,
    youthTableOptions,
  } = props;

  const {
    showBarangay = true,
    showRegistered = true,
  } = youthTableOptions || {};

  return (
    <>
      <table className={style.table} role="grid">
        <thead>
          <tr>
            <th>Name</th>
            {showBarangay && <th>Barangay</th>}
            <th>Email</th>
            {showRegistered && <th className={style.center}>Registered</th>}
            <th className={style.center}>Status</th>
            <th className={style.center}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={style.tableRow}>
              <td>{getFullName(row)}</td>
              {showBarangay && <td>{row.barangay || '-'}</td>}
              <td>{row.email || '-'}</td>
              {showRegistered && (
                <td className={`${style.center} ${getRegisteredValue(row) ? style.green : style.red}`}>
                  {getRegisteredValue(row) ? 'Registered' : 'Not Registered'}
                </td>
              )}
              <StatusCell status={row.status} />
              <DesktopActionButtons
                row={row}
                onViewData={onViewData}
                onEdit={onEdit}
                onDelete={onDelete}
                deleteLabel={deleteLabel}
                permissionLevel={permissionLevel}
                showViewButton
              />
            </tr>
          ))}
        </tbody>
      </table>

      <div className={style.cardContainer} role="list">
        {rows.map((row) => (
          <article key={row.id} className={style.card} role="listitem">
            <div className={style.cardHeader}>
              <h3 className={style.cardName}>{getFullName(row)}</h3>
              <span className={`${style.statusBadge} ${style[row.status?.toLowerCase()]}`}>
                {row.status}
              </span>
            </div>
            <div className={style.cardBody}>
              {showBarangay && (
                <div className={style.cardField}>
                  <label className={style.fieldLabel}>Barangay</label>
                  <p className={style.fieldValue}>{row.barangay || 'None'}</p>
                </div>
              )}
              <div className={style.cardField}>
                <label className={style.fieldLabel}>Email</label>
                <p className={style.fieldValue}>{row.email || '-'}</p>
              </div>
              {showRegistered && (
                <div className={style.cardField}>
                  <label className={style.fieldLabel}>Registered</label>
                  <p className={style.fieldValue}>{getRegisteredValue(row) ? 'Registered' : 'Not Registered'}</p>
                </div>
              )}
            </div>
            <CardActionButtons
              row={row}
              onViewData={onViewData}
              onEdit={onEdit}
              onDelete={onDelete}
              deleteLabel={deleteLabel}
              permissionLevel={permissionLevel}
              showViewButton
            />
          </article>
        ))}
      </div>
    </>
  );
}

function BarangayTableContent(props) {
  const { rows, onEdit, onDelete, deleteLabel, permissionLevel } = props;

  return (
    <>
      <table className={style.table} role="grid">
        <thead>
          <tr>
            <th>Barangay Name</th>
            <th className={style.center}>Active Youth</th>
            <th className={style.center}>SK Officials</th>
            <th className={style.center}>Status</th>
            <th className={style.center}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={style.tableRow}>
              <td>{row.name}</td>
              <td className={style.center}>{row.active_youth}</td>
              <td className={style.center}>{`${row.sk_officials?.length || 0}/10`}</td>
              <StatusCell status={row.status} />
              <DesktopActionButtons
                row={row}
                onEdit={onEdit}
                onDelete={onDelete}
                deleteLabel={deleteLabel}
                permissionLevel={permissionLevel}
              />
            </tr>
          ))}
        </tbody>
      </table>

      <div className={style.cardContainer} role="list">
        {rows.map((row) => (
          <article key={row.id} className={style.card} role="listitem">
            <div className={style.cardHeader}>
              <h3 className={style.cardName}>{row.name}</h3>
            </div>
            <div className={style.cardBody}>
              <div className={style.cardField}>
                <label className={style.fieldLabel}>Total Youth</label>
                <p className={style.fieldValue}>{row.total_youth}</p>
              </div>
              <div className={style.cardField}>
                <label className={style.fieldLabel}>Active Youth</label>
                <p className={style.fieldValue}>{row.active_youth}</p>
              </div>
              <div className={style.cardField}>
                <label className={style.fieldLabel}>SK Officials</label>
                <p className={style.fieldValue}>{row.sk_officials?.length || 0}</p>
              </div>
              <div className={style.cardField}>
                <label className={style.fieldLabel}>Status</label>
                <p className={style.fieldValue}>{row.status}</p>
              </div>
            </div>
            <CardActionButtons
              row={row}
              onEdit={onEdit}
              onDelete={onDelete}
              deleteLabel={deleteLabel}
              permissionLevel={permissionLevel}
            />
          </article>
        ))}
      </div>
    </>
  );
}

export default function Table(props) {
  const { data, tableType } = props;
  const rows = Array.isArray(data) ? data : [];

  if (rows.length === 0) {
    return (
      <div className={style.tableWrapper}>
        <p className={style.emptyText}>No items found.</p>
      </div>
    );
  }

  const contentByType = {
    sk: <SkTableContent {...props} rows={rows} />,
    youth: <YouthTableContent {...props} rows={rows} />,
    default: <BarangayTableContent {...props} rows={rows} />,
  };

  return (
    <div className={style.tableWrapper}>
      {contentByType[tableType] || contentByType.default}
    </div>
  );
}