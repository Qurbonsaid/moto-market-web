import { Navigate } from "react-router-dom";
import { getUserRole } from "@/lib/storage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'direktor' | 'sotuvchi';
}

export function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const role = getUserRole();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole && role !== requireRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
