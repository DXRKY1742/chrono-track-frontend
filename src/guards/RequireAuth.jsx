// React
import { Navigate, Outlet } from "react-router-dom";

// Redux
import { useSelector } from "react-redux";

export default function RequireAuth() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
