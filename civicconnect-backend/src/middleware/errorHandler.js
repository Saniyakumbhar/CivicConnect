import multer from "multer";
import { HttpError } from "../utils/httpError.js";
import { env } from "../config/env.js";

export function notFound(_req, _res, next) {
  next(new HttpError(404, "Route not found."));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message, errors: err.fieldErrors });
  }
  if (err instanceof multer.MulterError) {
    const message = err.code === "LIMIT_FILE_SIZE" ? "Profile photo must be 2 MB or smaller." : "Invalid file upload.";
    return res.status(400).json({ message });
  }
  if (err?.code === 11000) {
    // MongoDB duplicate key (race condition between two identical sign-ups)
    return res.status(409).json({ message: "An account with these details already exists." });
  }
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid request body." });
  }
  console.error(err);
  res.status(500).json({ message: env.isProduction ? "Something went wrong." : String(err?.message || err) });
}
