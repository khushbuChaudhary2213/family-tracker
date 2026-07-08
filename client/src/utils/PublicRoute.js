import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  return !user ? children : <Navigate to="/"></Navigate>;
}

export default PublicRoute;
