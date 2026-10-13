import { Link, useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { DASHBOARD_PATH, ROLE_LABEL } from "../config/roleRoutes";

export default function Unauthorized() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleSwitchAccount() {
    await logout();
    navigate("/", { replace: true });
  }

  return (
    <div className="status-page">
      <div className="status-card">
        <span className="status-card__icon">
          <ShieldAlert size={32} aria-hidden="true" />
        </span>
        <h1 className="status-card__title">You don&apos;t have access to this page</h1>
        <p className="status-card__text">
          {user
            ? `You are signed in as ${ROLE_LABEL[user.role]}. This page is for a different account type.`
            : "Please sign in with the correct account type to continue."}
        </p>
        <div className="status-card__actions">
          {user ? (
            <>
              <Link to={DASHBOARD_PATH[user.role]} className="btn btn--primary">
                Go to my dashboard
              </Link>
              <Button variant="secondary" onClick={() => void handleSwitchAccount()}>
                Switch account
              </Button>
            </>
          ) : (
            <Link to="/" className="btn btn--primary">
              Choose account type
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
