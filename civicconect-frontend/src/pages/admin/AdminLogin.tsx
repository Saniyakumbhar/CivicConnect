import AuthShell from "../../components/auth/AuthShell";
import LoginForm from "../../components/auth/LoginForm";

export default function AdminLogin() {
  return (
    <AuthShell
      role="ADMIN"
      title="Admin login"
      subtitle="Restricted to platform administrators."
      asideTitle="Run the platform with confidence."
      asideText="Manage users, departments, businesses, schemes and complaints."
      asidePoints={["Officer and citizen management", "Verification workflows", "Platform analytics"]}
    >
      <LoginForm
        role="ADMIN"
        identifierLabel="Admin email"
        identifierPlaceholder="admin@example.gov.in"
        identifierKind="email"
        footer={<>Admin accounts cannot be self-registered.</>}
      />
    </AuthShell>
  );
}
