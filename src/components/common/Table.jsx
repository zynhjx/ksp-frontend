
import style from './Table.module.css'

export default function Table({
  data,
  tableType,
  onViewData,
  onEdit,
  onDelete,
  deleteLabel = 'Remove'
}) {

  const resolvedType = tableType
  const isSkTable = resolvedType === 'sk';
  const isYouthTable = resolvedType === 'youth';
  const rows = Array.isArray(data) ? data : [];

  const getFullName = (row) => {
    if (row.name) return row.name;
    const firstName = row.firstName || row.first_name || '';
    const lastName = row.lastName || row.last_name || '';
    return `${firstName} ${lastName}`.trim();
  };

    return (
        <div className={style.tableWrapper}>
          {rows.length === 0 ? (
            <p className={style.emptyText}>No items found.</p>
          ) : (
            <>
          {/* Desktop: Table View */}
          <table className={style.table} role="grid">
            <thead>
        {isSkTable ?
                <tr>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Barangay</th>
                    <th>Email</th>
                    <th className={style.center}>Status</th>
                    <th className={style.center}>Actions</th>
                </tr>
          : isYouthTable ?
              <tr>
                <th>Name</th>
                <th>Barangay</th>
                <th>Email</th>
                <th className={style.center}>Registered{}</th>
                <th className={style.center}>Status</th>
                <th className={style.center}>Actions</th>
              </tr>
          : 
                  <tr>
                      <th>Barangay Name</th>
                      <th className={style.center}>Active Youth</th>
                      <th className={style.center}>SK Officials</th>
                      <th className={style.center}>Status</th>
                      <th className={style.center}>Actions</th>
                  </tr>
                }
              
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className={style.tableRow}
                >
                  {isSkTable ?
                    <>
                        <td>{row.name}</td>
                        <td>{row.position}</td>
                        <td>{row.barangay || "-"}</td>
                        <td>{row.email}</td>
                    </>
                    : isYouthTable ?
                    <>
                        <td>{getFullName(row)}</td>
                        <td>{row.barangay || "-"}</td>
                        <td>{row.email || '-'}</td>
                        <td className={`${style.center} ${row.registered ? style.green : style.red }`}>{row.registered ? "Registered" : "Not Registered"}</td>
                    </>
                    :
                    <>
                        <td>{row.name}</td>
                        <td className={style.center}>{row.active_youth}</td>
                        <td className={style.center}>{`${row.sk_officials?.length || 0}/10` }</td>
                        
                    </>
                  }
                  <td className={`${style.status} ${style.center} ${row.status === "Active" ? style.green : style.red}`}>
                      {row.status}
                  </td>
                  <td className={style.actions}>
                      {isYouthTable && (
                        <button
                          className={style.viewBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewData?.(row);
                          }}
                        >
                          View Profile
                        </button>
                      )}

                      
                      <button
                        className={style.editBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit?.(row);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className={style.deleteBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete?.(row);
                        }}
                      >
                        {deleteLabel}
                      </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile: Card View */}
          <div className={style.cardContainer} role="list">
            {rows.map((row) => (
              <article 
                key={row.id} 
                className={style.card} 
                role="listitem"
              >
                {isSkTable ? (
                  <>
                    <div className={style.cardHeader}>
                      <h3 className={style.cardName}>{row.name}</h3>
                      <span className={`${style.statusBadge} ${style[row.status.toLowerCase()]}`}>
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
                        <p className={style.fieldValue}>{row.barangay || "None"}</p>
                      </div>
                      <div className={style.cardField}>
                        <label className={style.fieldLabel}>Email</label>
                        <p className={style.fieldValue}>{row.email}</p>
                      </div>
                    </div>
                  </>
                ) : isYouthTable ? (
                  <>
                    <div className={style.cardHeader}>
                      <h3 className={style.cardName}>{getFullName(row)}</h3>
                      <span className={`${style.statusBadge} ${style[row.status?.toLowerCase()]}`}>
                        {row.status}
                      </span>
                    </div>
                    <div className={style.cardBody}>
                      <div className={style.cardField}>
                        <label className={style.fieldLabel}>Barangay</label>
                        <p className={style.fieldValue}>{row.barangay || "None"}</p>
                      </div>
                      <div className={style.cardField}>
                        <label className={style.fieldLabel}>Email</label>
                        <p className={style.fieldValue}>{row.email || '-'}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
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
                        <p className={style.fieldValue}>
                        
                            {row.sk_officials?.length || 0}
                        </p>
                      </div>
                      <div className={style.cardField}>
                        <label className={style.fieldLabel}>Status</label>
                        <p className={style.fieldValue}>{row.status}</p>
                      </div>
                    </div>
                  </>
                )}
                
                  <div className={style.cardFooter}>
                    {isYouthTable && (
                      <button
                        className={style.viewBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewData?.(row);
                        }}
                      >
                        View Data
                      </button>
                    )}
                    <button
                      className={style.editBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(row);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className={style.deleteBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(row);
                      }}
                    >
                      {deleteLabel}
                    </button>
                  </div>
              </article>
            ))}
          </div>
            </>
          )}
        </div>
    )
}