import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LOGIN_PATH } from "../../config/roleRoutes";
import type { Role } from "../../types/auth";

interface ProtectedRouteProps {
  /** Roles that may open the nested routes. */
  allowedRoles: Role[];
}

/**
 * Layout route guard.
 * - Still checking the session  -> loading message (avoids a flash redirect on refresh)
 * - Not logged in               -> that area's login page
 * - Logged in, wrong role       -> /unauthorized
 * - Logged in, correct role     -> renders the nested route via <Outlet />
 * This only improves the user experience. The BACKEND enforces the same rules on every API call.
 */
export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <p className="page-loading">Checking your session...</p>;

  if (!isAuthenticated || !user) {
    return <Navigate to={LOGIN_PATH[allowedRoles[0]]} replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
}
