import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import Brand from "../layout/Brand";
import type { Role } from "../../types/auth";

interface AuthShellProps {
  role: Role;
  title: string;
  subtitle: string;
  asideTitle: string;
  asideText: string;
  asidePoints: string[];
  wide?: boolean;
  children: ReactNode;
}

/** Two-panel layout shared by every login / register page. */
export default function AuthShell({
  role,
  title,
  subtitle,
  asideTitle,
  asideText,
  asidePoints,
  wide = false,
  children,
}: AuthShellProps) {
  return (
    <div className={`auth-page role--${role.toLowerCase()}`}>
      <aside className="auth-aside">
        <Brand />
        <div className="auth-aside__body">
          <h2 className="auth-aside__title">{asideTitle}</h2>
          <p className="auth-aside__text">{asideText}</p>
          <ul className="auth-aside__list">
            {asidePoints.map((point) => (
              <li key={point}>
                <Check size={16} aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="auth-main">
        <div className={`auth-card ${wide ? "auth-card--wide" : ""}`.trim()}>
          <Link to="/" className="auth-back">
            <ArrowLeft size={16} aria-hidden="true" />
            All account types
          </Link>
          <h1 className="auth-card__title">{title}</h1>
          <p className="auth-card__subtitle">{subtitle}</p>
          {children}
        </div>
      </main>
    </div>
  );
}
