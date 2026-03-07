import React, { useState, useEffect } from 'react';
import styles from './AdminSkManagement.module.css';
import AddSkModal from './AddSkModal';
import Table from './Table';
import { toast } from 'react-toastify';
import { apiFetch } from '../api';
import PageSkeleton from './PageSkeleton';
import PageError from './PageError';

function AdminSkManagement() {
  // placeholder list; replace with API data later
  const [search, setSearch] = useState('');
  const [filterBarangay, setFilterBarangay] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [barangays, setBarangays] = useState([]);


  // {
  //   id: 1,
  //   name: 'Juan Dela Cruz',
  //   position: 'Chairperson',
  //   barangay: 'Napsan',
  //   email: 'juan@example.com',
  //   status: 'Active'
  // },
  // {
  //   id: 2,
  //   name: 'Maria Santos',
  //   position: 'Secretary',
  //   barangay: 'Simpokan',
  //   email: 'maria@example.com',
  //   status: 'Inactive'
  // },
  // {
  //   id: 3,
  //   name: 'Pedro Pascual',
  //   position: 'Treasurer',
  //   barangay: 'Barangay Bayan',
  //   email: 'pedro@example.com',
  //   status: 'Active'
  // }


  

  const [skList, setSkList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false)


  async function fetchData() {
      setLoading(true);
      setIsError(false)
      try {
          const res = await apiFetch('http://localhost:5000/api/admin/sk-officials');
          const data = await res.json();
          setSkList(data);
      } catch (err) {
          console.error(err.message);
          toast.error(err.message)
          setIsError(true)
          
      } finally {
          setLoading(false);
      }
  }

  async function fetchBarangays() {
    try {
      const res = await apiFetch("http://localhost:5000/api/admin/barangays");

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message);
      }

      const data = await res.json();
      setBarangays(data.barangays); // or data depending on your API
    } catch (err) {
      console.error(err);
      toast.error("Failed to load barangays");
    }
  }

  useEffect(() => {
      fetchData();
      fetchBarangays();
  }, []);

    // Show skeleton while loading
  if (loading) return <PageSkeleton />;
  if (isError) return <PageError onRetry={fetchData}/>

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

  const handleModalSave = async (newSk) => {
    try {
      const res = await apiFetch("http://localhost:5000/api/admin/sk-management", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newSk)
      });

      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.message);
        
      }

      const created = await res.json();

      // update UI immediately
      setSkList((prev) => [...prev, created]);

      toast.success("SK official added successfully");
      setIsModalOpen(false);

    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
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
            {barangays.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))}
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
            <option value="Pending">Pending</option>
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