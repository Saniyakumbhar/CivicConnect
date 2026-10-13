import { createContext } from "react";
import type { LoginCredentials, Role, User } from "../types/auth";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  /** true while the app asks the server "is there a logged-in user?" right after page load. */
  isLoading: boolean;
  /** `role` is the login portal being used (Citizen / Officer / Admin page). */
  login: (role: Role, credentials: LoginCredentials) => Promise<User>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
