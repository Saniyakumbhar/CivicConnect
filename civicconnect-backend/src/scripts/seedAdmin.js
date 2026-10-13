/**
 * Creates the FIRST admin account (admins can never self-register).
 * Run once:  npm run seed:admin
 * Reads ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD from .env. Safe to run again: it will not create duplicates.
 */
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { MIN_PASSWORD_LENGTH, isValidEmail } from "../utils/validators.js";

const name = process.env.ADMIN_NAME || "Platform Admin";
const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || "";

if (!isValidEmail(email) || password.length < MIN_PASSWORD_LENGTH) {
  console.error(`Set a valid ADMIN_EMAIL and an ADMIN_PASSWORD of at least ${MIN_PASSWORD_LENGTH} characters in .env`);
  process.exit(1);
}

await connectDB();

const existing = await User.findOne({ email });
if (existing) {
  console.log(`An account with ${email} already exists (role: ${existing.role}). Nothing changed.`);
} else {
  await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12), role: "ADMIN" });
  console.log(`Admin created: ${email}`);
}

await mongoose.disconnect();
