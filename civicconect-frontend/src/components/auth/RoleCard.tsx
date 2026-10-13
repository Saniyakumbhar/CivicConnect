import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";
import type { Role } from "../../types/auth";

interface RoleCardProps {
  role: Role;
  title: string;
  description: string;
  to: string;
  icon: LucideIcon;
}

export default function RoleCard({ role, title, description, to, icon: Icon }: RoleCardProps) {
  return (
    <Link to={to} className={`role-card role--${role.toLowerCase()}`}>
      <span className="role-card__icon">
        <Icon size={26} aria-hidden="true" />
      </span>
      <h3 className="role-card__title">{title}</h3>
      <p className="role-card__text">{description}</p>
      <span className="role-card__action">
        Continue as {title}
        <ArrowRight size={16} aria-hidden="true" />
      </span>
    </Link>
  );
}
