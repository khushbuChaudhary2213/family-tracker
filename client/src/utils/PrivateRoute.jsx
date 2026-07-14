import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { user, isLoading } = useAuth();
  const token = localStorage.getItem("token");

  if (isLoading) return null;
  if (!user && token) return null;

  return user ? children : <Navigate to="/auth"></Navigate>;
}

export default PrivateRoute;
