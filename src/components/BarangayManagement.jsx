import React, { useState } from 'react';
import './BarangayManagement.css';
import AddEditBarangayModal from './AddEditBarangayModal';
import ViewSkOfficialsModal from './ViewSkOfficialsModal';

function BarangayManagement() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isViewSkModalOpen, setIsViewSkModalOpen] = useState(false);
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  const [editingBarangay, setEditingBarangay] = useState(null);

  // Mock SK Officials data
  const skOfficialsList = [
    { id: 1, name: 'Juan Dela Cruz', position: 'Chairperson', barangay: 'Napsan', status: 'Active' },
    { id: 2, name: 'Maria Santos', position: 'Secretary', barangay: 'Napsan', status: 'Active' },
    { id: 3, name: 'Pedro Pascual', position: 'Treasurer', barangay: 'Simpokan', status: 'Active' },
    { id: 4, name: 'Ana García', position: 'Auditor', barangay: 'Bagong Bayan', status: 'Inactive' }
  ];

  const [barangays, setBarangays] = useState([
    {
      id: 1,
      name: 'Napsan',
      status: 'Active',
      skOfficials: [1, 2]
    },
    {
      id: 2,
      name: 'Simpokan',
      status: 'Active',
      skOfficials: [3]
    },
    {
      id: 3,
      name: 'Bagong Bayan',
      status: 'Inactive',
      skOfficials: [4]
    }
  ]);

  // Filter barangays
  const filtered = barangays.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !filterStatus || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddBarangay = () => {
    setEditingBarangay(null);
    setIsAddEditModalOpen(true);
  };

  const handleEditBarangay = (id) => {
    const barangay = barangays.find((b) => b.id === id);
    setEditingBarangay(barangay);
    setIsAddEditModalOpen(true);
  };

  const handleSaveBarangay = (barangayData) => {
    if (editingBarangay) {
      // Update existing
      setBarangays((prev) =>
        prev.map((b) =>
          b.id === editingBarangay.id
            ? { ...b, ...barangayData }
            : b
        )
      );
    } else {
      // Add new
      const newBarangay = {
        id: Date.now(),
        ...barangayData,
        skOfficials: barangayData.skOfficials || []
      };
      setBarangays((prev) => [...prev, newBarangay]);
    }
    setIsAddEditModalOpen(false);
  };

  const handleRemoveBarangay = (id) => {
    console.log('Removing barangay with ID:', id);
    setBarangays((prev) => prev.filter((b) => b.id !== id));
  };

  const handleViewSkOfficials = (barangayId) => {
    const barangay = barangays.find((b) => b.id === barangayId);
    setSelectedBarangay(barangay);
    setIsViewSkModalOpen(true);
  };

  const getSkOfficialsForBarangay = (barangayId) => {
    const barangay = barangays.find((b) => b.id === barangayId);
    if (!barangay) return [];
    return skOfficialsList.filter((sk) =>
      barangay.skOfficials.includes(sk.id)
    );
  };

  return (
    <div className="barangay-management-page">
      <div className="page-header">
        <div>
          <h1>Barangay Management</h1>
          <p className="subtitle">Manage barangay information and SK officials</p>
        </div>
        <button
          className="add-btn"
          onClick={handleAddBarangay}
        >
          + Add Barangay
        </button>
      </div>

      <div className="search-filter-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search barangay name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filters">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="barangay-table">
          <thead>
            <tr>
              <th id='name'>Barangay Name</th>
              <th>SK Officials</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((barangay) => (
              <tr key={barangay.id} className={barangay.status === 'Inactive' ? 'inactive-row' : ''}>
                <td className="barangay-name">{barangay.name}</td>
                <td className="sk-officials-count">
                  <button
                    className="sk-count-btn"
                    onClick={() => handleViewSkOfficials(barangay.id)}
                    title="Click to view SK officials"
                  >
                    {barangay.skOfficials.length}
                  </button>
                </td>
                <td className="status">
                  <span className={`badge ${barangay.status.toLowerCase()}`}>
                    {barangay.status}
                  </span>
                </td>
                <td className="actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEditBarangay(barangay.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveBarangay(barangay.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddEditBarangayModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSaveBarangay}
        barangay={editingBarangay}
        allSkOfficials={skOfficialsList}
      />

      <ViewSkOfficialsModal
        isOpen={isViewSkModalOpen}
        onClose={() => setIsViewSkModalOpen(false)}
        barangay={selectedBarangay}
        skOfficials={selectedBarangay ? getSkOfficialsForBarangay(selectedBarangay.id) : []}
      />
    </div>
  );
}

export default BarangayManagement;
