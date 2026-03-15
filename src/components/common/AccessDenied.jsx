
import { Link } from 'react-router-dom';
import "./AccessDenied.css";
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export default function AccessDenied() {
    const {user} = useContext(AuthContext)
    const dashboardList = {
        Youth: "/youth/dashboard",
        SK: "/sk/dashboard",
        Admin: "/admin/dashboard"
    }

    const dashboard = user ? dashboardList[user.role] : "/auth/login";

  return (
    <div className="access-denied-container">
      <div className="access-denied-card">
        <h1>403</h1>
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
        <Link to={dashboard} className="access-denied-button">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
