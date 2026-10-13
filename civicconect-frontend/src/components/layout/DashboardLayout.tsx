import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import Brand from "./Brand";
import Button from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { ROLE_LABEL } from "../../config/roleRoutes";

interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function DashboardLayout({ title, subtitle, children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null; // ProtectedRoute guarantees a user; this satisfies TypeScript

  async function handleLogout() {
    await logout();
    navigate("/", { replace: true });
  }

  return (
    <div className={`dash role--${user.role.toLowerCase()}`}>
      <header className="dash__header">
        <div className="dash__header-inner">
          <Brand />
          <div className="dash__user">
            <span className="role-badge">{ROLE_LABEL[user.role]}</span>
            <span className="dash__user-name">{user.name}</span>
            <Button variant="secondary" onClick={() => void handleLogout()}>
              <LogOut size={16} aria-hidden="true" />
              Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="dash__main">
        <h1 className="dash__title">{title.replace("{name}", user.name)}</h1>
        <p className="dash__subtitle">{subtitle}</p>
        {children}
      </main>
    </div>
  );
}
