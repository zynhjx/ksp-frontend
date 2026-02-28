import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

export default function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <LoadingSpinner />;
  if (user) {
    switch (user.role) {
      case "Youth":
        return <Navigate to="/dashboard/youth" replace />;
      case "SK":
        return <Navigate to="/dashboard/sk" replace />;
      case "Admin":
        return <Navigate to="/dashboard/admin" replace />;
      default:
        return <Navigate to="/" replace />; // fallback if role is unknown
    }
  }
    
    

  return children;
}