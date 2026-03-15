import React, { useEffect, useState, useCallback } from 'react';
import './ViewSkOfficialsModal.css';
import { apiFetch } from '../../api';

function ViewSkOfficialsModal({ isOpen, onClose, barangay, skOfficialsId }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  console.log(skOfficialsId)

  const [skOfficials, setSkOfficials] = useState([]);
  const [loading, setLoading] = useState(true);

  const getOfficials = useCallback(async () => {
    try {
      setLoading(true);

      if (!skOfficialsId || skOfficialsId.length === 0) {
        setSkOfficials([]);
        return;
      }

      const officialsInput = Array.isArray(skOfficialsId) ? skOfficialsId : [skOfficialsId];

      const officialsFromPayload = officialsInput
        .filter((value) => value && typeof value === 'object')
        .map((official) => ({
          id: Number(official.id ?? official.sk_official_id),
          name: official.name || '',
          position: official.position || '',
          status: official.status
        }))
        .filter((official) => Number.isFinite(official.id));

      const officialsIdsToFetch = officialsInput
        .map((value) => {
          if (typeof value === 'number' || typeof value === 'string') {
            return Number(value);
          }
          if (value && typeof value === 'object') {
            return Number(value.id ?? value.sk_official_id);
          }
          return NaN;
        })
        .filter((id) => Number.isFinite(id))
        .filter((id) => !officialsFromPayload.some((official) => official.id === id));

      let fetchedOfficials = [];

      if (officialsIdsToFetch.length > 0) {
        const responses = await Promise.all(
          officialsIdsToFetch.map((id) => apiFetch(`${apiUrl}/api/admin/sk-officials/${id}`))
        );

        const data = await Promise.all(
          responses.map(async (response) => {
            if (!response.ok) {
              return null;
            }
            return response.json();
          })
        );

        fetchedOfficials = data
          .filter(Boolean)
          .flatMap((item) => (Array.isArray(item) ? item : [item]))
          .map((official) => ({
            id: Number(official.id ?? official.sk_official_id),
            name: official.name || '',
            position: official.position || '',
            status: official.status || 'Inactive'
          }))
          .filter((official) => Number.isFinite(official.id));
      }

      const mergedOfficialsMap = new Map();
      [...officialsFromPayload, ...fetchedOfficials].forEach((official) => {
        if (!mergedOfficialsMap.has(official.id)) {
          mergedOfficialsMap.set(official.id, official);
        }
      });

      setSkOfficials(Array.from(mergedOfficialsMap.values()));
    } catch (error) {
      console.error("Failed to fetch officials:", error);
      setSkOfficials([]);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, skOfficialsId]);

  useEffect(() => {
    if (!isOpen) {
      document.body.classList.remove('overflow-hidden');
      return;
    }

    document.body.classList.add('overflow-hidden');
    getOfficials();

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen, getOfficials]);

  if (!isOpen || !barangay) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">
          SK Officials - {barangay.name}
        </h2>

        <div className="officials-content">
          {loading ? (
            <p className="loading-message">Loading SK officials...</p>
          ) : skOfficials.length > 0 ? (
            <table className="officials-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {skOfficials.map((official, index) => (
                  <tr key={index}>
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