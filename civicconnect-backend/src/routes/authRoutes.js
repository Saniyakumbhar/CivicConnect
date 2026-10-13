import { Router } from "express";
import rateLimit from "express-rate-limit";
import { forgotPassword, login, logout, me, registerCitizen } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { uploadProfilePhoto } from "../middleware/upload.js";

const router = Router();

// Slows down password guessing: max 10 login attempts per IP per 15 minutes.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again in 15 minutes." },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many sign-ups from this network. Please try again later." },
});

router.post("/register/citizen", registerLimiter, uploadProfilePhoto, registerCitizen);
router.post("/login", loginLimiter, login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
router.post("/forgot-password", loginLimiter, forgotPassword);

export default router;
