import type { Role } from "../types/auth";

export const DASHBOARD_PATH: Record<Role, string> = {
  CITIZEN: "/citizen/dashboard",
  OFFICER: "/officer/dashboard",
  ADMIN: "/admin/dashboard",
};

export const LOGIN_PATH: Record<Role, string> = {
  CITIZEN: "/citizen/login",
  OFFICER: "/officer/login",
  ADMIN: "/admin/login",
};

export const ROLE_LABEL: Record<Role, string> = {
  CITIZEN: "Citizen",
  OFFICER: "Officer",
  ADMIN: "Admin",
};
