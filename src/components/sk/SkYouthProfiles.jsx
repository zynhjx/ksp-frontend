import { useState, useEffect, useMemo, useCallback } from 'react';
import Table from '../common/Table';
import { toast } from 'react-toastify';
import { apiFetch } from '../../api';
import PageError from '../common/PageError';
import ManagementPageLayout from '../common/ManagementPageLayout';
import ManagementPageSkeleton from '../common/ManagementPageSkeleton';

function SkYouthProfiles() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [search, setSearch] = useState('');
  const [filterBarangay, setFilterBarangay] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [youthList, setYouthList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchYouths = useCallback(async () => {
    setLoading(true);
    setIsError(false);

    try {
      const res = await apiFetch(`${apiUrl}/api/sk/youths`);
      if (!res.ok) {
        throw new Error('Failed to fetch youth profiles');
      }

      const data = await res.json();
      setYouthList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setYouthList([]);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchYouths();
  }, [fetchYouths]);

  const barangays = useMemo(
    () =>
      [...new Set(youthList.map((youth) => youth?.barangay).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b)
      ),
    [youthList]
  );

  const filtered = useMemo(
    () =>
      youthList.filter((youth) => {
        const name = youth?.name || '';
        const email = youth?.email || '';

        const matchesSearch =
          name.toLowerCase().includes(search.toLowerCase()) ||
          email.toLowerCase().includes(search.toLowerCase());

        const matchesBarangay =
          !filterBarangay ||
          (filterBarangay === 'null' ? youth.barangay === null : youth.barangay === filterBarangay);

        const matchesStatus = !filterStatus || youth.status === filterStatus;

        return matchesSearch && matchesBarangay && matchesStatus;
      }),
    [youthList, search, filterBarangay, filterStatus]
  );

  const handleSearchChange = (event) => setSearch(event.target.value);

  const handleViewData = () => {
    toast.info('Profile details view will be added soon.');
  };

  const handleEdit = () => {
    toast.info('Editing youth profiles is not available in this view.');
  };

  const handleDelete = () => {
    toast.info('Deleting youth profiles is not available in this view.');
  };

  if (loading) return <ManagementPageSkeleton />;
  if (isError) return <PageError onRetry={fetchYouths} />;

  return (
    <ManagementPageLayout
      title="Youth Profiles"
      subtitle="View and filter youth profiles for your barangay"
      showAddButton={false}
      searchPlaceholder="Search by name or email"
      searchValue={search}
      onSearchChange={handleSearchChange}
      filters={(
        <>
          <select value={filterBarangay} onChange={(event) => setFilterBarangay(event.target.value)}>
            <option value="">All Barangays</option>
            {barangays.map((barangay) => (
              <option key={barangay} value={barangay}>
                {barangay}
              </option>
            ))}
            <option value="null">None</option>
          </select>

          <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </>
      )}
    >
      <Table
        data={filtered}
        tableType="youth"
        onViewData={handleViewData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deleteLabel="Remove"
      />
    </ManagementPageLayout>
  );
}

export default SkYouthProfiles;
