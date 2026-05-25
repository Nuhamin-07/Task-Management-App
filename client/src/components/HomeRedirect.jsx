import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }
  return user ? <Navigate to="/tasks" /> : <Navigate to="/login" />;
}
