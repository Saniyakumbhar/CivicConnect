/**
 * Real authentication: talks to the Express + MongoDB backend.
 *
 * Passwords are hashed on the server and the login token lives in an httpOnly cookie, so JavaScript
 * in the browser never sees it. This file no longer stores any account or token in the browser.
 *
 *   login            -> POST /api/auth/login
 *   registerCitizen  -> POST /api/auth/register/citizen   (multipart/form-data)
 *   getCurrentUser   -> GET  /api/auth/me                 (restores the session on page refresh)
 *   logout           -> POST /api/auth/logout
 */
import type { CitizenRegistrationData, LoginCredentials, Role, User } from "../types/auth";
import { ApiError, apiRequest } from "./api";
import { normalizeMobile } from "../utils/validators";

async function login(role: Role, credentials: LoginCredentials): Promise<User> {
  const data = await apiRequest<{ user: User }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      identifier: credentials.identifier,
      password: credentials.password,
      role,
      remember: credentials.remember,
    }),
  });
  return data.user;
}

async function registerCitizen(data: CitizenRegistrationData): Promise<void> {
  const form = new FormData();
  form.append("fullName", data.fullName.trim());
  form.append("email", data.email.trim());
  form.append("mobile", normalizeMobile(data.mobile));
  form.append("password", data.password);
  form.append("address", data.address.trim());
  form.append("city", data.city.trim());
  form.append("state", data.state);
  if (data.profilePhoto) form.append("profilePhoto", data.profilePhoto);

  await apiRequest<{ message: string }>("/auth/register/citizen", { method: "POST", body: form });
}

/** Returns the logged-in user, or null when there is no valid session. */
async function getCurrentUser(): Promise<User | null> {
  try {
    const data = await apiRequest<{ user: User }>("/auth/me");
    return data.user;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err; // server down etc.
  }
}

async function logout(): Promise<void> {
  try {
    await apiRequest<{ message: string }>("/auth/logout", { method: "POST" });
  } catch {
    // Even if the request fails, the user is logged out locally by the caller.
  }
}

export const authService = { login, registerCitizen, getCurrentUser, logout };
