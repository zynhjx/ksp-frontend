import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './AddEditBarangayModal.css';

function EditBarangayModal({ isOpen, onClose, onSave, barangay, allSkOfficials = [] }) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Active');
  const [selectedOfficials, setSelectedOfficials] = useState([]);
  const [isSaving, setIsSaving] = useState('');

  useEffect(() => {
    if (barangay) {
      setName(barangay.name);
      setStatus(barangay.status);
      setSelectedOfficials(barangay.sk_officials || barangay.skOfficials || []);
    } else {
      setName('');
      setStatus('Active');
      setSelectedOfficials([]);
    }
  }, [barangay, isOpen]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const initialFormValues = {
      name: barangay?.name || '',
      status: barangay?.status || 'Active',
    };

    const currentFormValues = {
      name,
      status,
    };

    const changedFields = Object.entries(currentFormValues).reduce((acc, [key, value]) => {
      if (value !== initialFormValues[key]) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const initialOfficials = (barangay?.sk_officials || barangay?.skOfficials || [])
      .map(Number)
      .sort((a, b) => a - b);
    const currentOfficials = selectedOfficials
      .map(Number)
      .sort((a, b) => a - b);

    const officialsChanged =
      initialOfficials.length !== currentOfficials.length ||
      initialOfficials.some((id, index) => id !== currentOfficials[index]);

    if (officialsChanged) {
      changedFields.skOfficials = selectedOfficials;
    }

    if (Object.keys(changedFields).length === 0) {
      toast.info('No changes detected');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(changedFields);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOfficialToggle = (id) => {
    setSelectedOfficials((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  if (!isOpen || !barangay) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Edit Barangay</h2>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Barangay Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Status *</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="form-group">
            <label>SK Officials (Optional)</label>
            <div className="officials-list">
              {allSkOfficials.length > 0 ? (
                allSkOfficials.map((official) => (
                  <div key={official.id} className="official-checkbox">
                    <input
                      type="checkbox"
                      id={`official-${official.id}`}
                      checked={selectedOfficials.includes(official.id)}
                      onChange={() => handleOfficialToggle(official.id)}
                    />
                    <label htmlFor={`official-${official.id}`}>
                      {official.name} ({official.position})
                    </label>
                  </div>
                ))
              ) : (
                <p className="no-officials-message">No SK officials available</p>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBarangayModal;
