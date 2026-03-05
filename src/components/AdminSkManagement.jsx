import React, { useState } from 'react';
import styles from './AdminSkManagement.module.css';
import AddSkModal from './AddSkModal';
import Table from './Table';

function AdminSkManagement() {
  // placeholder list; replace with API data later
  const [search, setSearch] = useState('');
  const [filterBarangay, setFilterBarangay] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [skList, setSkList] = useState([
    {
      id: 1,
      name: 'Juan Dela Cruz',
      position: 'Chairperson',
      barangay: 'Napsan',
      email: 'juan@example.com',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Maria Santos',
      position: 'Secretary',
      barangay: 'Simpokan',
      email: 'maria@example.com',
      status: 'Inactive'
    },
    {
      id: 3,
      name: 'Pedro Pascual',
      position: 'Treasurer',
      barangay: 'Barangay Bayan',
      email: 'pedro@example.com',
      status: 'Active'
    }
    // ... more mock data as needed
  ]);

  const filtered = skList.filter((sk) => {
    const matchesSearch =
      sk.name.toLowerCase().includes(search.toLowerCase()) ||
      sk.email.toLowerCase().includes(search.toLowerCase());
    const matchesBarangay =
      !filterBarangay || sk.barangay === filterBarangay;
    const matchesPosition =
      !filterPosition || sk.position === filterPosition;
    const matchesStatus =
      !filterStatus || sk.status === filterStatus;
    return (
      matchesSearch &&
      matchesBarangay &&
      matchesPosition &&
      matchesStatus
    );
  });

  const handleSearchChange = (e) => setSearch(e.target.value);

  const handleRowClick = (id) => {
    console.log('row clicked', id);
  };

  const handleModalSave = (newSk) => {
    const id = Date.now();
    setSkList((prev) => [...prev, { id, ...newSk, status: 'Active' }]);
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles['sk-management-page']}>
      <div className={styles['page-header']}>
        <div>
          <h1>SK Management</h1>
          <p className={styles.subtitle}>
            Manage barangay SK officials and their details
          </p>
        </div>
        <button className={styles['add-btn']} onClick={() => setIsModalOpen(true)}>
          + Add SK Official
        </button>
      </div>

      <div className={styles['controls-row']}>
        <div className={styles['search-bar']}>
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className={styles.filters}>
          <select
            value={filterBarangay}
            onChange={(e) => setFilterBarangay(e.target.value)}
          >
            <option value="">All Barangays</option>
            <option value="Napsan">Napsan</option>
            <option value="Simpokan">Simpokan</option>
            <option value="Barangay Bayan">Barangay Bayan</option>
          </select>
          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
          >
            <option value="">All Positions</option>
            <option value="Chairperson">Chairperson</option>
            <option value="Secretary">Secretary</option>
            <option value="Treasurer">Treasurer</option>
            {/* add more positions if necessary */}
          </select>
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

      {/* <div className={styles['bulk-actions']}>
        <button className={styles['export-btn']}>Export CSV</button>
        <button className={styles['export-btn']}>Export PDF</button>
        <button className={styles['activate-btn']}>Bulk Activate</button>
        <button className={styles['deactivate-btn']}>Bulk Deactivate</button>
      </div> */}

      <Table
        data={filtered}
        skTable={true}
        handleRowClick={handleRowClick}
        hasActions={true}
      />

      <AddSkModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
      />
    </div>
  );
}

export default AdminSkManagement;