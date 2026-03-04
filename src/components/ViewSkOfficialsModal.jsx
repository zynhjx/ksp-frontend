import React, { useEffect } from 'react';
import './ViewSkOfficialsModal.css';

function ViewSkOfficialsModal({ isOpen, onClose, barangay, skOfficials }) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  if (!isOpen || !barangay) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">
          SK Officials - {barangay.name}
        </h2>

        <div className="officials-content">
          {skOfficials.length > 0 ? (
            <table className="officials-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {skOfficials.map((official) => (
                  <tr key={official.id}>
                    <td className="official-name">{official.name}</td>
                    <td className="official-position">{official.position}</td>
                    <td className="official-status">
                      <span className={`status-badge ${official.status.toLowerCase()}`}>
                        {official.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-officials-message">
              No SK officials assigned to {barangay.name} yet.
            </p>
          )}
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn-close">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewSkOfficialsModal;
