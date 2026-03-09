import React, { useState, useEffect, useCallback } from 'react';
import styles from './BarangayManagement.module.css';
import AddBarangayModal from './AddBarangayModal';
import EditBarangayModal from './EditBarangayModal';
import ViewSkOfficialsModal from './ViewSkOfficialsModal';
import Table from './Table';
import { apiFetch } from '../api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import PageError from './PageError';
import PageSkeleton from './PageSkeleton';

const MySwal = withReactContent(Swal);

function BarangayManagement() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewSkModalOpen, setIsViewSkModalOpen] = useState(false);
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  const [editingBarangay, setEditingBarangay] = useState(null);
  const [selectedSkOfficials, setSelectedSkOfficials] = useState([])
  const apiUrl = import.meta.env.VITE_API_URL;

  const [barangays, setBarangays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false)
  const [unassignedSkOfficials, setUnassignedSkOfficials] = useState([])


  const fetchData = useCallback(async () => {
      setLoading(true);
      setIsError(false)
      try {
          const res = await apiFetch(`${apiUrl}/api/admin/barangays`);
          const data = await res.json();
          setBarangays(data.barangays);
          setUnassignedSkOfficials(data.unassignedSkOfficials)
      } catch (err) {
          console.error(err.message);
          toast.error(err.message)
          setIsError(true)
          
      } finally {
          setLoading(false);
      }
      }, [apiUrl]);

  useEffect(() => {
      fetchData();
  }, [fetchData]);

    // Show skeleton while loading
  if (loading) return <PageSkeleton />;
  if (isError) return <PageError onRetry={fetchData}/>

  // Filter barangays
  const filtered = barangays.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !filterStatus || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddBarangay = () => {
    setEditingBarangay(null);
    setIsAddModalOpen(true);
  };

  const handleEditBarangay = (barangayOrId) => {
    const barangayId = typeof barangayOrId === 'object' ? barangayOrId?.id : barangayOrId;
    const barangay = barangays.find((b) => b.id === barangayId);
    if (!barangay) {
      toast.error('Barangay not found');
      return;
    }
    setEditingBarangay(barangay);
    setIsEditModalOpen(true);
  };

  const handleAddBarangaySave = async (barangayData) => {
    try {
      const res = await apiFetch(`${apiUrl}/api/admin/barangays`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(barangayData),
      });

      const data = await res.json(); // parse the JSON

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save barangay');
      }

      toast.success(`Barangay "${barangayData.name}" saved successfully!`);
      setIsAddModalOpen(false);

      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const handleEditBarangaySave = async (barangayData) => {
    if (!editingBarangay?.id) {
      toast.error('No barangay selected for editing');
      return;
    }

    try {
      const res = await apiFetch(`${apiUrl}/api/admin/barangays/${editingBarangay.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(barangayData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update barangay');
      }

      toast.success(data.message || `Barangay "${barangayData.name}" updated successfully!`);
      setIsEditModalOpen(false);
      setEditingBarangay(null);

      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const handleRemoveBarangay = async (barangayOrId) => {
    const barangayId = typeof barangayOrId === 'object' ? barangayOrId?.id : barangayOrId;
    const barangayName = typeof barangayOrId === 'object'
      ? barangayOrId?.name
      : barangays.find((b) => b.id === barangayId)?.name;

    const result = await MySwal.fire({
      title: 'Delete barangay?',
      text: barangayName
        ? `This will permanently delete ${barangayName}.`
        : 'This will permanently delete this barangay.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const res = await apiFetch(`${apiUrl}/api/admin/barangays/${barangayId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to remove barangay');
      }

      toast.success(data.message || 'Barangay removed successfully');
      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to remove barangay');
    }
  };

  const handleViewSkOfficials = (skOfficialsIds, barangayId) => {
    const barangay = barangays.find((b) => b.id === barangayId) || null;
    setSelectedBarangay(barangay);
    setSelectedSkOfficials(skOfficialsIds || []);
    setIsViewSkModalOpen(true);
  };

  return (
    <div className={styles.barangayManagementPage}>
      <div className={styles.pageHeader}>
        <div>
          <h1>Barangay Management</h1>
          <p className={styles.subtitle}>Manage barangay information and SK officials</p>
        </div>
        <button
          className={styles.addBtn}
          onClick={handleAddBarangay}
        >
          + Add Barangay
        </button>
      </div>

      <div className={styles.searchFilterSection}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search barangay name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
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

      <Table
        onDelete={handleRemoveBarangay}
        onEdit={handleEditBarangay}
        data={filtered}
        skTable={false}
        handleViewSkOfficials={handleViewSkOfficials}
        />

      
      <AddBarangayModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddBarangaySave}
        allSkOfficials={unassignedSkOfficials}
      />

      <EditBarangayModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingBarangay(null);
        }}
        onSave={handleEditBarangaySave}
        barangay={editingBarangay}
        allSkOfficials={unassignedSkOfficials}
      />

      <ViewSkOfficialsModal
        isOpen={isViewSkModalOpen}
        onClose={() => setIsViewSkModalOpen(false)}
        barangay={selectedBarangay}
        skOfficialsId={selectedSkOfficials}
      />

      
    </div>
  );
}

export default BarangayManagement;
