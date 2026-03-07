import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './AddSkModal.css';
import { apiFetch } from '../api';

function AddSkModal({ isOpen, onClose, onSave }) {
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [position, setPosition] = useState('');
const [barangay, setBarangay] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [barangays, setBarangays] = useState([]);

useEffect(() => {
  if (isOpen) {
    async function fetchBarangays() {
      try {
        const res = await apiFetch("http://localhost:5000/api/admin/barangays");
        if (!res.ok) throw new Error("Failed to fetch barangays");
        const data = await res.json();
        console.log("Fetched barangays:", data.barangays);
        setBarangays(data.barangays); // assume [{ id, name }, ...]
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

const handleSubmit = (e) => {
  e.preventDefault();


  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  const newOfficial = {
    firstName,
    lastName,
    position,
    barangay,
    email,
    password,
    status: "Active"
  };

  onSave(newOfficial);

  setFirstName('');
  setLastName('');
  setPosition('');
  setBarangay('');
  setEmail('');
  setPassword('');
  setConfirmPassword('');
};

if (!isOpen) return null;

return ( 
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-container" onClick={(e) => e.stopPropagation()}> <h2 className="modal-title">Add SK Official</h2>

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
              <option>Auditor</option>
            </select>
          </div>

          <div className="form-group">
            <label>Barangay</label>
            <select
              value={barangay}
              onChange={(e) => setBarangay(e.target.value)}
              required
            >
              <option value="">Select barangay</option>
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
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>

            <button type="submit" className="btn-save">
              Save
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddSkModal;
