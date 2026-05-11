import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({
  children,
  rol,
}: {
  children: React.ReactNode;
  rol?: string;
}) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (rol && user.rol !== rol) return <Navigate to="/" />;

  return children;
}