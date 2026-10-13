export const MIN_PASSWORD_LENGTH = 8;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

/** Removes spaces/dashes and an optional +91 / 91 / 0 prefix. */
export function normalizeMobile(value: string): string {
  const compact = value.replace(/[\s-]/g, "");
  return compact.replace(/^(\+91|91|0)(?=\d{10}$)/, "");
}

/** Indian mobile numbers are 10 digits and start with 6, 7, 8 or 9. */
export function isValidIndianMobile(value: string): boolean {
  return /^[6-9]\d{9}$/.test(normalizeMobile(value));
}
