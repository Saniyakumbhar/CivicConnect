import { Link, useLocation } from "react-router-dom";
import AuthShell from "../../components/auth/AuthShell";
import LoginForm from "../../components/auth/LoginForm";

export default function CitizenLogin() {
  const location = useLocation();
  const registered = (location.state as { registered?: boolean } | null)?.registered === true;

  return (
    <AuthShell
      role="CITIZEN"
      title="Citizen login"
      subtitle="Sign in to report issues and track your complaints."
      asideTitle="Your neighbourhood, working better."
      asideText="Raise a civic issue in minutes and follow it until it is fixed."
      asidePoints={["Report issues with photo and location", "Track every complaint's status", "Find schemes and local services"]}
    >
      <LoginForm
        role="CITIZEN"
        identifierLabel="Email"
        identifierPlaceholder="you@example.com"
        identifierKind="email"
        notice={registered ? "Registration successful. Please log in with your new account." : undefined}
        footer={
          <>
            Don&apos;t have an account? <Link to="/citizen/register">Create Citizen Account</Link>
          </>
        }
      />
    </AuthShell>
  );
}
