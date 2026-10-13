import { User } from "../models/User.js";
import { COOKIE_NAME, verifyToken } from "../utils/token.js";
import { HttpError, asyncHandler } from "../utils/httpError.js";

/** Requires a valid login cookie. Puts the user on req.user. */
export const requireAuth = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) throw new HttpError(401, "Please log in to continue.");

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new HttpError(401, "Your session has expired. Please log in again.");
  }

  // Load the user fresh from the database so a disabled or deleted account stops working at once.
  const user = await User.findById(payload.sub);
  if (!user || !user.isActive) throw new HttpError(401, "Your session is no longer valid. Please log in again.");

  req.user = user;
  next();
});

/** Role gate. Use AFTER requireAuth:  router.use(requireAuth, requireRole("ADMIN")) */
export const requireRole =
  (...roles) =>
  (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new HttpError(403, "You do not have permission to do this."));
    }
    next();
  };
