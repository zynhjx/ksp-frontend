import React, { useState } from 'react';
import './AdminBarangays.css';

function AdminBarangays() {
  // const barangays = [
  //   {
  //     id: 1,
  //     name: 'Barangay Simpokan',
  //     youths: [
  //       { id: 1, name: 'Ana Cruz', age: 18, status: 'Registered' },
  //       { id: 2, name: 'Luis Reyes', age: 17, status: 'Pending' }
  //     ]
  //   },
  //   {
  //     id: 2,
  //     name: 'Barangay Napsan',
  //     youths: [
  //       { id: 3, name: 'Mia Santos', age: 16, status: 'Registered' }
  //     ]
  //   },
  //   {
  //     id: 3,
  //     name: 'Barangay Bagong Bayan',
  //     youths: [
  //       { id: 4, name: 'Rico Delos', age: 19, status: 'Registered' }
  //     ]
  //   }
  // ];

  const [selectedBarangay, setSelectedBarangay] = useState(null);

  const handleSelect = (b) => {
    setSelectedBarangay(b);
  };

  const handleBack = () => setSelectedBarangay(null);

  return (
    <div className="barangays-page">
      {!selectedBarangay ? (
        <div className="barangay-list">
          <h1>Barangays</h1>
          <div className="cards">
            {barangays.map((b) => (
              <div
                key={b.id}
                className="barangay-card"
                onClick={() => handleSelect(b)}
              >
                {b.name}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="barangay-details">
          <button className="back-btn" onClick={handleBack}>&larr; Back</button>
          <h2>{selectedBarangay.name} - Youth Members</h2>
          <table className="youth-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {selectedBarangay.youths.map((y) => (
                <tr key={y.id}>
                  <td>{y.name}</td>
                  <td>{y.age}</td>
                  <td>{y.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminBarangays;