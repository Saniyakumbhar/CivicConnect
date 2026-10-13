import mongoose from "mongoose";

export const ROLES = ["CITIZEN", "OFFICER", "ADMIN"];

/**
 * ONE collection ("users") for every account type. The `role` field decides
 * what the person may do. This is the RBAC design from the project brief.
 */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false }, // never returned by default
    role: { type: String, enum: ROLES, required: true, index: true },

    // Citizen fields
    mobile: { type: String, trim: true },
    address: { type: String, trim: true, maxlength: 300 },
    city: { type: String, trim: true, maxlength: 80 },
    state: { type: String, trim: true, maxlength: 80 },
    profilePhoto: { type: String }, // URL path like /uploads/abc.jpg

    // Officer fields
    officerId: { type: String, trim: true, uppercase: true, unique: true, sparse: true },
    department: { type: String, trim: true, maxlength: 100 },

    isActive: { type: Boolean, default: true }, // admin can disable an account
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin who created an officer
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);

/** Shape sent to the frontend. No password, no internal fields. */
export function toPublicUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
