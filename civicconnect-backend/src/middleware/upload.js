import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import multer from "multer";
import { fileURLToPath } from "node:url";
import { HttpError } from "../utils/httpError.js";

const here = path.dirname(fileURLToPath(import.meta.url));
export const UPLOAD_DIR = path.resolve(here, "../../uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const EXT_BY_MIME = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  // Random name; the user's original file name is never used (prevents path tricks).
  filename: (_req, file, cb) => cb(null, crypto.randomUUID() + EXT_BY_MIME[file.mimetype]),
});

export const uploadProfilePhoto = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024, files: 1 }, // 2 MB
  fileFilter: (_req, file, cb) => {
    if (EXT_BY_MIME[file.mimetype]) return cb(null, true);
    cb(new HttpError(400, "Profile photo must be a JPG, PNG or WebP image."));
  },
}).single("profilePhoto");

export function removeUploadedFile(file) {
  if (file?.path) fs.promises.unlink(file.path).catch(() => {});
}
