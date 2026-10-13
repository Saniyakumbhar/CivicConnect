import { Link } from "react-router-dom";
import AuthShell from "../../components/auth/AuthShell";
import RegisterForm from "../../components/auth/RegisterForm";

export default function CitizenRegister() {
  return (
    <AuthShell
      role="CITIZEN"
      title="Create Citizen account"
      subtitle="Register to report civic issues and discover services near you."
      asideTitle="Join your city's civic network."
      asideText="One account for complaints, updates, local businesses and government schemes."
      asidePoints={["Free for every resident", "Updates on your complaints", "Schemes matched to your profile"]}
      wide
    >
      <RegisterForm />
      <div className="auth-footer">
        Already registered? <Link to="/citizen/login">Log in</Link>
      </div>
    </AuthShell>
  );
}
