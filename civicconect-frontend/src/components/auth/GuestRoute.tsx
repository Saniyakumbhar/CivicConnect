import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { DASHBOARD_PATH } from "../../config/roleRoutes";

/** Login/register pages: already signed-in users are sent to their own dashboard. */
export default function GuestRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <p className="page-loading">Checking your session...</p>;
  if (user) return <Navigate to={DASHBOARD_PATH[user.role]} replace />;
  return <>{children}</>;
}
