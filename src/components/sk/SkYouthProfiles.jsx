import { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import Table from '../common/Table';
import { toast } from 'react-toastify';
import PageError from '../common/PageError';
import ManagementPageLayout from '../common/ManagementPageLayout';
import ManagementPageSkeleton from '../common/ManagementPageSkeleton';
import SkYouthProfileModal from './SkYouthProfileModal';
import { AuthContext } from '../../contexts/AuthContext';
import { apiFetch, apiUrl } from '../../api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const parseJsonSafe = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

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
  const MySwal = withReactContent(Swal);
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [youthList, setYouthList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [selectedYouth, setSelectedYouth] = useState(null);

  const currentBarangay = user?.barangay || user?.barangay_name || user?.barangayName || user?.barangay?.name || 'San Isidro';

  const fetchYouths = useCallback(async () => {
    setLoading(true);
    setIsError(false);

    try {
      const res = await apiFetch(`${apiUrl}/api/sk/youths`);
      if (!res.ok) {
        throw new Error('Failed to fetch youth profiles');
      }
      const data = await res.json();
      const normalizedData = Array.isArray(data)
        ? data.map((youth) => {
            const firstName = youth?.first_name || youth?.firstName || '';
            const lastName = youth?.last_name || youth?.lastName || '';
            const fullName = `${firstName} ${lastName}`.trim();

            return {
              ...youth,
              name: youth?.name || fullName,
              birth_date: youth?.birth_date || youth?.birthDate || youth?.birthdate,
              barangay_name: youth?.barangay_name || youth?.barangayName || youth?.barangay,
              education: youth?.education || youth?.education_level || youth?.educationLevel,
              employmentStatus: youth?.employmentStatus || youth?.employment_status,
            };
          })
        : [];

      setYouthList(normalizedData);
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

  const handleViewData = (youth) => {
    setSelectedYouth(youth);
  };

  const handleEdit = () => {
    toast.info('Editing youth profiles is not available in this view.');
  };

  const handleDelete = async (youth) => {
    const result = await MySwal.fire({
      title: 'Delete youth profile?',
      text: 'This youth profile will be deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await apiFetch(`${apiUrl}/api/sk/youths/${youth.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const resultData = await parseJsonSafe(res);
        throw new Error(resultData?.message || 'Failed to delete youth profile');
      }

      setYouthList((previous) => previous.filter((item) => item.id !== youth.id));
      toast.success('Youth profile deleted successfully');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to delete youth profile');
    }
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
        deleteLabel="Delete"
        permissionLevel={user.permissionLevel}
      />

      {selectedYouth && (
        <SkYouthProfileModal
          youth={selectedYouth}
          onClose={() => setSelectedYouth(null)}
        />
      )}
    </ManagementPageLayout>
  );
}

export default SkYouthProfiles;
