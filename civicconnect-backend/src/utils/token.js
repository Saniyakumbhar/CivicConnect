import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const COOKIE_NAME = "civicconnect_token";

const SHORT_LIFETIME_MS = 8 * 60 * 60 * 1000; // 8 hours (browser-session cookie)
const LONG_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000; // 7 days ("Remember me")

export function signToken(user, remember) {
  const ms = remember ? LONG_LIFETIME_MS : SHORT_LIFETIME_MS;
  return jwt.sign({ sub: String(user._id), role: user.role }, env.jwtSecret, {
    expiresIn: Math.floor(ms / 1000),
  });
}

export function setAuthCookie(res, token, remember) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true, // JavaScript in the page can NOT read this cookie (blocks token theft via XSS)
    secure: env.isProduction, // HTTPS only in production
    sameSite: "lax", // not sent on cross-site POSTs (basic CSRF protection)
    // "Remember me" => persistent cookie. Otherwise a session cookie (cleared when the browser closes).
    ...(remember ? { maxAge: LONG_LIFETIME_MS } : {}),
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, secure: env.isProduction, sameSite: "lax" });
}

export const verifyToken = (token) => jwt.verify(token, env.jwtSecret);
