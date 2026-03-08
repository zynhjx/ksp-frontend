import React, { useState, useEffect, useCallback } from 'react';
import styles from './AdminSkManagement.module.css';
import AddSkModal from './AddSkModal';
import EditSkModal from './EditSkModal';
import Table from './Table';
import { toast } from 'react-toastify';
import { apiFetch } from '../api';
import PageSkeleton from './PageSkeleton';
import PageError from './PageError';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const parseJsonSafe = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

function AdminSkManagement() {
  const MySwal = withReactContent(Swal);
  // placeholder list; replace with API data later
  const [search, setSearch] = useState('');
  const [filterBarangay, setFilterBarangay] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSk, setSelectedSk] = useState(null);
  const [barangays, setBarangays] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;


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

  const deleteSkOfficial = async (officialId) => {
    try {
      const res = await apiFetch(`${apiUrl}/api/admin/sk-officials/${officialId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const result = await parseJsonSafe(res);
        throw new Error(result?.message || 'Failed to delete SK official');
      }

      // Return true if deletion succeeded
      return true;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateSkOfficial = async (officialId, officialPayload) => {
    try {
      const res = await apiFetch(`${apiUrl}/api/admin/sk-management/${officialId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(officialPayload)
      });

      if (!res.ok) {
        const result = await parseJsonSafe(res);
        throw new Error(result?.message || 'Failed to update SK official');
      }

      const updated = await parseJsonSafe(res);
      return updated;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };


  const fetchData = useCallback(async () => {
      setLoading(true);
      setIsError(false)
      try {
          const res = await apiFetch(`${apiUrl}/api/admin/sk-officials`);
          const data = await res.json();
          setSkList(data);
      } catch (err) {
          console.error(err.message);
          setIsError(true)
          
      } finally {
          setLoading(false);
      }
  }, [apiUrl]);

  const fetchBarangays = useCallback(async () => {
    try {
      const res = await apiFetch(`${apiUrl}/api/admin/barangays`);

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
  }, [apiUrl]);

  useEffect(() => {
      fetchData();
      fetchBarangays();
  }, [fetchData, fetchBarangays]);

    // Show skeleton while loading
  if (loading) return <PageSkeleton />;
  if (isError) return <PageError onRetry={fetchData}/>

  const filtered = skList.filter((sk) => {
    const name = sk?.name || '';
    const email = sk?.email || '';

    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase());
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

  const handleEditClick = (official) => {
    setSelectedSk(official);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (official) => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: 'This SK official will be deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await deleteSkOfficial(official.id);
      setSkList((prev) => prev.filter((item) => item.id !== official.id));
      toast.success('SK official deleted successfully');
    } catch (err) {
      console.error(err);
      const message = err?.message || 'Failed to delete SK official';
      toast.error(message);
      MySwal.fire({
        title: 'Delete failed',
        text: message,
        icon: 'error'
      });
    }
  };

  const handleEditModalSave = async (updatedFields) => {
    try {
      if (!selectedSk) {
        throw new Error('No SK official selected for editing');
      }

      await updateSkOfficial(selectedSk.id, updatedFields);
      await fetchData();
      toast.success('SK official updated successfully');

      setIsEditModalOpen(false);
      setSelectedSk(null);

    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const handleAddModalSave = async (newSk) => {
    try {
      const res = await apiFetch(`${apiUrl}/api/admin/sk-management`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSk)
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message);
      }

      const created = await res.json();

      setSkList((prev) => [...prev, created]);
      toast.success('SK official added successfully');
      setIsAddModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedSk(null);
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
        <button
          className={styles['add-btn']}
          onClick={() => {
            setIsAddModalOpen(true);
          }}
        >
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
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        deleteLabel="Delete"
      />

      <AddSkModal
        isOpen={isAddModalOpen}
        onClose={handleAddModalClose}
        onSave={handleAddModalSave}
      />

      <EditSkModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSave={handleEditModalSave}
        initialData={selectedSk}
      />
    </div>
  );
}

export default AdminSkManagement;