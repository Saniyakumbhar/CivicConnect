export type Role = "CITIZEN" | "OFFICER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

/** `identifier` is an email for Citizen/Admin, and an email OR Officer ID for Officer. */
export interface LoginCredentials {
  identifier: string;
  password: string;
  remember: boolean;
}

export interface CitizenRegistrationData {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  address: string;
  city: string;
  state: string;
  profilePhoto: File | null;
}

export interface AuthSession {
  user: User;
  token: string;
}
