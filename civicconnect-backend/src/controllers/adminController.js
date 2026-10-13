import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { HttpError, asyncHandler } from "../utils/httpError.js";
import { MIN_PASSWORD_LENGTH, isNonEmptyString, isValidEmail } from "../utils/validators.js";

const OFFICER_ID_REGEX = /^[A-Za-z0-9-]{3,20}$/;

const officerView = (u) => ({
  id: String(u._id),
  name: u.name,
  email: u.email,
  officerId: u.officerId,
  department: u.department,
  isActive: u.isActive,
  createdAt: u.createdAt,
});

/** POST /api/admin/officers   body: { name, email, officerId, department, password } */
export const createOfficer = asyncHandler(async (req, res) => {
  const { name, email, officerId, department, password } = req.body ?? {};

  const errors = {};
  if (!isNonEmptyString(name, 3, 100)) errors.name = "Enter the officer's full name.";
  if (!isValidEmail(email)) errors.email = "Enter a valid official email.";
  if (typeof officerId !== "string" || !OFFICER_ID_REGEX.test(officerId.trim()))
    errors.officerId = "Officer ID must be 3-20 letters, numbers or dashes.";
  if (!isNonEmptyString(department, 2, 100)) errors.department = "Enter the department.";
  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH || password.length > 128)
    errors.password = `Temporary password must be ${MIN_PASSWORD_LENGTH} to 128 characters.`;

  if (Object.keys(errors).length > 0) throw new HttpError(400, "Please correct the highlighted fields.", errors);

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedId = officerId.trim().toUpperCase();

  if (await User.exists({ $or: [{ email: normalizedEmail }, { officerId: normalizedId }] })) {
    throw new HttpError(409, "An account with this email or Officer ID already exists.");
  }

  const officer = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    officerId: normalizedId,
    department: department.trim(),
    passwordHash: await bcrypt.hash(password, 12),
    role: "OFFICER",
    createdBy: req.user._id,
  });

  res.status(201).json({ officer: officerView(officer) });
});

/** GET /api/admin/officers */
export const listOfficers = asyncHandler(async (_req, res) => {
  const officers = await User.find({ role: "OFFICER" }).sort({ createdAt: -1 }).limit(200);
  res.json({ officers: officers.map(officerView) });
});

/** PATCH /api/admin/officers/:id/active   body: { isActive: boolean }  (enable / disable) */
export const setOfficerActive = asyncHandler(async (req, res) => {
  const { isActive } = req.body ?? {};
  if (typeof isActive !== "boolean") throw new HttpError(400, "isActive must be true or false.");

  const officer = await User.findOneAndUpdate(
    { _id: req.params.id, role: "OFFICER" },
    { isActive },
    { new: true },
  );
  if (!officer) throw new HttpError(404, "Officer not found.");
  res.json({ officer: officerView(officer) });
});
