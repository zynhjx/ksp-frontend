import React, { useState, useEffect } from 'react';
import styles from './BarangayManagement.module.css';
import AddEditBarangayModal from './AddEditBarangayModal';
import ViewSkOfficialsModal from './ViewSkOfficialsModal';
import Table from './Table';
import { apiFetch } from '../api';
import { toast } from 'react-toastify';
import PageError from './PageError';
import PageSkeleton from './PageSkeleton';

function BarangayManagement() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isViewSkModalOpen, setIsViewSkModalOpen] = useState(false);
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  const [editingBarangay, setEditingBarangay] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Mock SK Officials data
  // const skOfficialsList = [
  //   { id: 1, name: 'Juan Dela Cruz', position: 'Chairperson', barangay: 'Napsan', status: 'Active' },
  //   { id: 2, name: 'Maria Santos', position: 'Secretary', barangay: 'Napsan', status: 'Active' },
  //   { id: 3, name: 'Pedro Pascual', position: 'Treasurer', barangay: 'Simpokan', status: 'Active' },
  //   { id: 4, name: 'Ana García', position: 'Auditor', barangay: 'Bagong Bayan', status: 'Inactive' }
  // ];

  // {
  //     id: 1,
  //     name: 'Napsan',
  //     total_youth: 15,
  //     active_youth: 12, 
  //     status: 'Active',
  //     skOfficials: [1, 2]
  //   },
  //   {
  //     id: 2,
  //     name: 'Simpokan',
  //     total_youth: 14,
  //     active_youth: 12, 
  //     status: 'Active',
  //     skOfficials: [3]
  //   },
  //   {
  //     id: 3,
  //     name: 'Bagong Bayan',
  //     total_youth: 15,
  //     active_youth: 8, 
  //     status: 'Inactive',
  //     skOfficials: [4]
  //   }

  const [barangays, setBarangays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false)
  const [unassignedSkOfficials, setUnassignedSkOfficials] = useState([])


  async function fetchData() {
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
  }

  useEffect(() => {
      fetchData();
  }, []);

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
    setIsAddEditModalOpen(true);
  };

  const handleEditBarangay = (id) => {
    const barangay = barangays.find((b) => b.id === id);
    setEditingBarangay(barangay);
    setIsAddEditModalOpen(true);
  };

  const handleSaveBarangay = async (barangayData) => {
    
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

      // Successfully saved
      toast.success(`Barangay "${barangayData.name}" saved successfully!`);
      setIsAddEditModalOpen(false);

      // Refresh the list
      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
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
    return unassignedSkOfficials.filter((sk) =>
      barangay.skOfficials.includes(sk.id)
    );
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
        data={filtered}
        hasActions={true}
        skTable={false}
        handleViewSkOfficials={handleViewSkOfficials}
        />

      

      <AddEditBarangayModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSaveBarangay}
        barangay={editingBarangay}
        allSkOfficials={unassignedSkOfficials}
        
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
