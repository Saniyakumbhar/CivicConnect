const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const MIN_PASSWORD_LENGTH = 8;

export const isValidEmail = (v) => typeof v === "string" && EMAIL_REGEX.test(v.trim());

export function normalizeMobile(v) {
  return String(v ?? "")
    .replace(/[\s-]/g, "")
    .replace(/^(\+91|91|0)(?=\d{10}$)/, "");
}

/** Indian mobile: 10 digits starting with 6-9. */
export const isValidIndianMobile = (v) => /^[6-9]\d{9}$/.test(normalizeMobile(v));

export const isNonEmptyString = (v, min = 1, max = 300) =>
  typeof v === "string" && v.trim().length >= min && v.trim().length <= max;
