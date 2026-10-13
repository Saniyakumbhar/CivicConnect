import { ClipboardList, ShieldCheck, UserRound } from "lucide-react";
import Brand from "../components/layout/Brand";
import RoleCard from "../components/auth/RoleCard";
import { LOGIN_PATH } from "../config/roleRoutes";

export default function Home() {
  return (
    <div className="home">
      <header className="home__header">
        <Brand />
      </header>

      <main className="home__main">
        <h1 className="home__title">Welcome to Smart CivicConnect</h1>
        <p className="home__lead">
          Report civic issues, follow their resolution, and find the local services and government schemes
          meant for you.
        </p>

        <h2 className="home__choose">Choose your account type</h2>
        <div className="role-grid">
          <RoleCard
            role="CITIZEN"
            title="Citizen"
            description="Report issues, track complaints and discover civic services."
            to={LOGIN_PATH.CITIZEN}
            icon={UserRound}
          />
          <RoleCard
            role="OFFICER"
            title="Officer"
            description="Manage and resolve assigned civic complaints."
            to={LOGIN_PATH.OFFICER}
            icon={ClipboardList}
          />
          <RoleCard
            role="ADMIN"
            title="Admin"
            description="Manage the CivicConnect platform."
            to={LOGIN_PATH.ADMIN}
            icon={ShieldCheck}
          />
        </div>
      </main>

      <footer className="home__footer">Prototype build: sign-in currently runs on mock data.</footer>
    </div>
  );
}
