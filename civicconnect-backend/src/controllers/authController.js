import bcrypt from "bcryptjs";
import { User, toPublicUser } from "../models/User.js";
import { HttpError, asyncHandler } from "../utils/httpError.js";
import { clearAuthCookie, setAuthCookie, signToken } from "../utils/token.js";
import { removeUploadedFile } from "../middleware/upload.js";
import {
  MIN_PASSWORD_LENGTH,
  isNonEmptyString,
  isValidEmail,
  isValidIndianMobile,
  normalizeMobile,
} from "../utils/validators.js";

const BCRYPT_ROUNDS = 12;
const ROLES_FOR_LOGIN = ["CITIZEN", "OFFICER", "ADMIN"];

// Used when no account matches, so a wrong email takes the same time as a wrong password
// (stops attackers from discovering which emails are registered by timing the response).
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", BCRYPT_ROUNDS);

/** POST /api/auth/register/citizen  (multipart/form-data, optional "profilePhoto") */
export const registerCitizen = asyncHandler(async (req, res) => {
  const { fullName, email, mobile, password, address, city, state } = req.body ?? {};

  const errors = {};
  if (!isNonEmptyString(fullName, 3, 100)) errors.fullName = "Enter your full name (at least 3 characters).";
  if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
  if (!isValidIndianMobile(mobile)) errors.mobile = "Enter a valid 10-digit Indian mobile number.";
  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH || password.length > 128)
    errors.password = `Password must be ${MIN_PASSWORD_LENGTH} to 128 characters.`;
  if (!isNonEmptyString(address)) errors.address = "Address is required.";
  if (!isNonEmptyString(city, 1, 80)) errors.city = "City is required.";
  if (!isNonEmptyString(state, 1, 80)) errors.state = "State is required.";

  if (Object.keys(errors).length > 0) {
    removeUploadedFile(req.file);
    throw new HttpError(400, "Please correct the highlighted fields.", errors);
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (await User.exists({ email: normalizedEmail })) {
    removeUploadedFile(req.file);
    throw new HttpError(409, "An account with this email already exists. Try logging in instead.");
  }

  try {
    await User.create({
      name: fullName.trim(),
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, BCRYPT_ROUNDS),
      role: "CITIZEN", // ALWAYS set by the server. A client can never choose its own role.
      mobile: normalizeMobile(mobile),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      profilePhoto: req.file ? `/uploads/${req.file.filename}` : undefined,
    });
  } catch (err) {
    removeUploadedFile(req.file);
    throw err;
  }

  res.status(201).json({ message: "Registration successful. Please log in." });
});

/** POST /api/auth/login   body: { identifier, password, role, remember } */
export const login = asyncHandler(async (req, res) => {
  const { identifier, password, role, remember } = req.body ?? {};

  if (typeof identifier !== "string" || typeof password !== "string" || !ROLES_FOR_LOGIN.includes(role)) {
    throw new HttpError(400, "Enter your login details.");
  }

  const id = identifier.trim().toLowerCase();
  // Officers may log in with email OR Officer ID. Citizens/Admins use email.
  const user = await User.findOne(
    role === "OFFICER" ? { $or: [{ email: id }, { officerId: id.toUpperCase() }] } : { email: id },
  ).select("+passwordHash");

  const passwordOk = await bcrypt.compare(password, user ? user.passwordHash : DUMMY_HASH);
  if (!user || !passwordOk) {
    throw new HttpError(401, "Invalid credentials. Check your details and try again.");
  }
  if (!user.isActive) {
    throw new HttpError(403, "This account has been disabled. Contact the administrator.");
  }
  if (user.role !== role) {
    const label = role.charAt(0) + role.slice(1).toLowerCase();
    throw new HttpError(403, `This account is not a ${label} account. Please use the correct login page.`);
  }

  const stayLoggedIn = remember === true;
  setAuthCookie(res, signToken(user, stayLoggedIn), stayLoggedIn);
  res.json({ user: toPublicUser(user) });
});

/** GET /api/auth/me  (frontend calls this on page load to restore the session) */
export const me = (req, res) => {
  res.json({ user: toPublicUser(req.user) });
};

/** POST /api/auth/logout */
export const logout = (_req, res) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out." });
};

/**
 * POST /api/auth/forgot-password
 * Placeholder: always answers the same way so it never reveals whether an email exists.
 * TODO (later): create a reset token, store its hash with an expiry, and email the link.
 */
export const forgotPassword = (_req, res) => {
  res.json({ message: "If an account exists for that email, a reset link will be sent." });
};
