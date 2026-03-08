
import style from './Table.module.css'

export default function Table({ data, handleRowClick, hasActions, skTable, handleViewSkOfficials, onEdit, onDelete, deleteLabel = 'Remove' }) {

    return (
        <div className={style.tableWrapper}>
          {/* Desktop: Table View */}
          <table className={style.table} role="grid">
            <thead>
              {skTable ?
                  <tr>
                      <th>Name</th>
                      <th>Position</th>
                      <th>Barangay</th>
                      <th>Email</th>
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
              </tr>}
              
            </thead>
            <tbody>
              {data.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => handleRowClick(row.id)}
                  className={style.tableRow}
                >
                  {skTable ?
                  <>
                      <td>{row.name}</td>
                      <td>{row.position}</td>
                      <td>{row.barangay}</td>
                      <td>{row.email}</td>
                      <td className={style.center}>{row.status}</td>
                  </>
                  :
                  <>
                      <td>{row.name}</td>
                      <td className={style.center}>{row.active_youth}</td>
                      <td className={style.center}>
                          <button
                              className={`${style.skCountBtn} ${style.center}`}
                              onClick={() => handleViewSkOfficials(row.id)}
                              title="Click to view SK officials"
                          >
                              {(row.sk_officials || []).length}
                          </button>
                      </td>
                      <td className={`${style.status} ${style.center}`}>
                          {row.status}
                      </td>
                      
                  </>
              }
                  

                  {hasActions &&
                      <td className={style.actions}>
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
                  }
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile: Card View */}
          <div className={style.cardContainer} role="list">
            {data.map((row) => (
              <article 
                key={row.id} 
                className={style.card} 
                role="listitem"
                onClick={() => handleRowClick(row.id)}
              >
                {skTable ? (
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
                        <p className={style.fieldValue}>{row.barangay}</p>
                      </div>
                      <div className={style.cardField}>
                        <label className={style.fieldLabel}>Email</label>
                        <p className={style.fieldValue}>{row.email}</p>
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
                          <button
                            className={style.skCountBtn}
                            onClick={() => handleViewSkOfficials(row.id)}
                            title="Click to view SK officials"
                          >
                            {(row.skOfficials || []).length}
                          </button>
                        </p>
                      </div>
                      <div className={style.cardField}>
                        <label className={style.fieldLabel}>Status</label>
                        <p className={style.fieldValue}>{row.status}</p>
                      </div>
                    </div>
                  </>
                )}
                
                {hasActions && (
                  <div className={style.cardFooter}>
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
                )}
              </article>
            ))}
          </div>
        </div>
    )
}