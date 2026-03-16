import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { AuthContext } from "../../contexts/AuthContext";
import { isYouthRegistered } from "../../utils/youthRegistration";
import LoadingSpinner from "./LoadingSpinner";

export default function YouthRegistrationRoute() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  if (user.role !== "Youth") {
    return <Navigate to="/forbidden" replace />;
  }

  if (!isYouthRegistered(user)) {
    return <Navigate to="/youth/my-profile" replace state={{ from: location }} />;
  }

  return <Outlet />;
}