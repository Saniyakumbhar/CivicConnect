import AuthShell from "../../components/auth/AuthShell";
import LoginForm from "../../components/auth/LoginForm";

export default function OfficerLogin() {
  return (
    <AuthShell
      role="OFFICER"
      title="Officer login"
      subtitle="For authorised department officers only."
      asideTitle="Resolve what matters first."
      asideText="Your assigned complaints, with priority and location, in one place."
      asidePoints={["Assigned complaints at a glance", "AI-assisted priority", "Update status with proof of work"]}
    >
      <LoginForm
        role="OFFICER"
        identifierLabel="Officer ID / Official email"
        identifierPlaceholder="OFF-1001 or name@dept.gov.in"
        identifierKind="emailOrId"
        footer={<>Officer accounts are created by an Admin. Contact your department admin for access.</>}
      />
    </AuthShell>
  );
}
