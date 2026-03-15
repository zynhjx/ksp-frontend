import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

export default function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <LoadingSpinner />;
  if (user) {
    switch (user.role) {
      case "Youth":
        return <Navigate to="/youth/dashboard" replace />;
      case "SK":
        return <Navigate to="/sk/dashboard" replace />;
      case "Admin":
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/" replace />; // fallback if role is unknown
    }
  }
    
    

  return children;
}