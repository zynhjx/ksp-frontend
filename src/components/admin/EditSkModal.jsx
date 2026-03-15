import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import './EditSkModal.css';
import { apiFetch } from '../../api';

const apiUrl = import.meta.env.VITE_API_URL;

function EditSkModal({ isOpen, onClose, onSave, initialData }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState('Active');
  const [barangay, setBarangay] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [barangays, setBarangays] = useState([]);
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const EyeClosed = (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
      </g>
    </svg>
  );

  const EyeOpen = (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
        <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
      </g>
    </svg>
  );

  useEffect(() => {
    if (isOpen) {
      async function fetchBarangays() {
        try {
          const res = await apiFetch(`${apiUrl}/api/admin/barangays`);
          if (!res.ok) throw new Error('Failed to fetch barangays');
          const data = await res.json();
          setBarangays(data.barangays || []);
        } catch (err) {
          console.error(err);
        }
      }

      fetchBarangays();
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !initialData) return;

    const [initialFirstName = '', ...restName] = (initialData.name || '').split(' ');
    setFirstName(initialData.firstName || initialFirstName);
    setLastName(initialData.lastName || restName.join(' '));
    setPosition(initialData.position || '');
    setStatus(initialData.status || 'Active');
    setBarangay(initialData.barangay || '');
    setEmail(initialData.email || '');
    setPassword('');
    setConfirmPassword('');
    setFormError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [isOpen, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (password && password.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }

    if (password && password !== confirmPassword) {
      setFormError('Passwords do not match.');
      toast.error('Passwords do not match');
      return;
    }

    const [initialFirstName = '', ...restName] = (initialData?.name || '').split(' ');
    const initialFormValues = {
      firstName: initialData?.firstName || initialFirstName,
      lastName: initialData?.lastName || restName.join(' '),
      position: initialData?.position || '',
      status: initialData?.status || 'Active',
      barangay: initialData?.barangay || '',
      email: initialData?.email || ''
    };

    const currentFormValues = {
      firstName,
      lastName,
      position,
      status,
      barangay,
      email
    };

    const changedFields = Object.entries(currentFormValues).reduce((acc, [key, value]) => {
      if (value !== initialFormValues[key]) {
        acc[key] = value;
      }

      return acc;
    }, {});

    if (password) {
      changedFields.password = password;
    }

    if (Object.prototype.hasOwnProperty.call(changedFields, 'barangay')) {
      changedFields.barangay = changedFields.barangay || null;
    }

    if (Object.keys(changedFields).length === 0) {
      toast.info('No changes detected');
      return;
    }

    const confirmation = await Swal.fire({
      title: 'Confirm update?',
      text: 'Are you sure you want to commit these edits?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    await onSave(changedFields);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Edit SK Official</h2>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="name-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>SK Position</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            >
              <option value="">Select position</option>
              <option>Chairperson</option>
              <option>Secretary</option>
              <option>Treasurer</option>
              <option>Kagawad</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="form-group">
            <label>Barangay</label>
            <select
              value={barangay}
              onChange={(e) => setBarangay(e.target.value)}
            >
              <option value="">None (Unassigned)</option>
              {barangays.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Email (Login)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>New Password (Optional)</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFormError('');
                }}
                minLength={8}
              />
              <span
                className="toggle-password"
                tabIndex="0"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  cursor: 'pointer',
                  opacity: showPassword ? 1 : 0.6,
                }}
              >
                {showPassword ? EyeOpen : EyeClosed}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setFormError('');
                }}
                required={Boolean(password)}
              />
              <span
                className="toggle-password"
                tabIndex="0"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                style={{
                  cursor: 'pointer',
                  opacity: showConfirmPassword ? 1 : 0.6,
                }}
              >
                {showConfirmPassword ? EyeOpen : EyeClosed}
              </span>
            </div>
          </div>

          {formError && <div className="form-error">{formError}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>

            <button type="submit" className="btn-save">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditSkModal;
