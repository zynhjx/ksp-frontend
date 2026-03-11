import React, { useState, useEffect, useCallback } from 'react';
import styles from './AdminYouthManagement.module.css';
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

function AdminYouthManagement() {
	const MySwal = withReactContent(Swal);
	const [search, setSearch] = useState('');
	const [filterBarangay, setFilterBarangay] = useState('');
	const [filterStatus, setFilterStatus] = useState('');
	const [barangays, setBarangays] = useState([]);
	const apiUrl = import.meta.env.VITE_API_URL;
	const [loading, setLoading] = useState(true);
	const [isError, setIsError] = useState(false);
    const [youthList, setYouthList] = useState([])

	const deleteYouth = async (youthId) => {
		try {
			const res = await apiFetch(`${apiUrl}/api/admin/youth/${youthId}`, {
				method: 'DELETE'
			});

			if (!res.ok) {
				const result = await parseJsonSafe(res);
				throw new Error(result?.message || 'Failed to delete youth member');
			}

			return true;
		} catch (err) {
			console.error(err);
			throw err;
		}
	};


	const fetchYouths = useCallback(async () => {
		setLoading(true);
		setIsError(false);
		try {
			const res = await apiFetch(`${apiUrl}/api/admin/youths`);
			const data = await res.json();

			setYouthList(data);
		} catch (err) {
            setYouthList([])
			console.error(err.message);
			setIsError(true);
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
            setBarangays(data.barangays);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load barangays");
        }
    }, [apiUrl]);

	useEffect(() => {
		fetchYouths();
        fetchBarangays()
	}, [fetchYouths, fetchBarangays]);

	if (loading) return <PageSkeleton />;
	if (isError) return <PageError onRetry={fetchYouths} />;

	const filtered = youthList?.filter((youth) => {
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
	});

	const handleSearchChange = (e) => setSearch(e.target.value);

	const handleRowClick = (id) => {
		console.log('row clicked', id);
	};

	const handleDeleteClick = async (official) => {
		const result = await MySwal.fire({
			title: 'Are you sure?',
			text: 'This youth profile will be deleted.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes, delete',
			cancelButtonText: 'Cancel'
		});

		if (!result.isConfirmed) {
			return;
		}

		try {
			await deleteYouth(official.id);
			setYouthList((prev) => prev.filter((item) => item.id !== official.id));
			toast.success('Youth profile deleted successfully');
		} catch (err) {
			console.error(err);
			const message = err?.message || 'Failed to delete youth profile';
			toast.error(message);
			MySwal.fire({
				title: 'Delete failed',
				text: message,
				icon: 'error'
			});
		}
	};



	return (
		<div className={styles['sk-management-page']}>
			<div className={styles['page-header']}>
				<div>
					<h1>Youth Profiles</h1>
					<p className={styles.subtitle}>
						Manage registered youth profiles and their details
					</p>
				</div>
				<button
					className={styles['add-btn']}
				>
					+ Add Youth Profile
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
						<option value="null">None</option>
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

			<Table
				data={filtered}
				tableType="youth"
				handleRowClick={handleRowClick}
				hasActions={true}
				onDelete={handleDeleteClick}
				deleteLabel="Delete"
			/>
		</div>
	);
}

export default AdminYouthManagement;
