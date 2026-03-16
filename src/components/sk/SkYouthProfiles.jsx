import { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import Table from '../common/Table';
import { toast } from 'react-toastify';
import PageError from '../common/PageError';
import ManagementPageLayout from '../common/ManagementPageLayout';
import ManagementPageSkeleton from '../common/ManagementPageSkeleton';
import { AuthContext } from '../../contexts/AuthContext';

const MOCK_YOUTH_PROFILES = [
  {
    id: 1,
    name: 'Alyssa Mae Santos',
    barangay: 'San Isidro',
    email: 'alyssa.santos@example.com',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Renz Carl Dela Cruz',
    barangay: 'San Isidro',
    email: 'renz.delacruz@example.com',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Mikaela Joy Reyes',
    barangay: 'San Isidro',
    email: 'mikaela.reyes@example.com',
    status: 'Inactive',
  },
  {
    id: 4,
    name: 'Joshua Paolo Garcia',
    barangay: 'San Isidro',
    email: 'joshua.garcia@example.com',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Trisha Anne Villanueva',
    barangay: 'San Isidro',
    email: 'trisha.villanueva@example.com',
    status: 'Inactive',
  },
];

function SkYouthProfiles() {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [youthList, setYouthList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const currentBarangay = user?.barangay || user?.barangay_name || user?.barangayName || user?.barangay?.name || 'San Isidro';

  const fetchYouths = useCallback(async () => {
    setLoading(true);
    setIsError(false);

    try {
      // const res = await apiFetch(`${apiUrl}/api/sk/youths`);
      // if (!res.ok) {
      //   throw new Error('Failed to fetch youth profiles');
      // }
      // const data = await res.json();
      // setYouthList(Array.isArray(data) ? data : []);
      setYouthList(MOCK_YOUTH_PROFILES);
    } catch (err) {
      console.error(err);
      setYouthList([]);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchYouths();
  }, [fetchYouths]);

  const filtered = useMemo(
    () =>
      youthList.filter((youth) => {
        const name = youth?.name || '';
        const email = youth?.email || '';

        const matchesSearch =
          name.toLowerCase().includes(search.toLowerCase()) ||
          email.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = !filterStatus || youth.status === filterStatus;

        return matchesSearch && matchesStatus;
      }),
    [youthList, search, filterStatus]
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
      subtitle={`View registered youth profiles for ${currentBarangay}`}
      showAddButton={false}
      searchPlaceholder="Search by name or email"
      searchValue={search}
      onSearchChange={handleSearchChange}
      filters={(
        <>
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
        youthTableOptions={{
          showBarangay: false,
          showRegistered: false,
        }}
        onViewData={handleViewData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deleteLabel="Remove"
        permissionLevel={user.permissionLevel}
      />
    </ManagementPageLayout>
  );
}

export default SkYouthProfiles;
