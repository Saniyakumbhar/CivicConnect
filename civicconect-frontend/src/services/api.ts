/**
 * Tiny fetch wrapper used by every service.
 * - Calls "/api/..." on the same address as the website. In development, Vite forwards /api to the
 *   backend (see vite.config.ts), so the login cookie works without any CORS trouble.
 * - credentials: "include" sends/receives the httpOnly login cookie.
 */
export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(status: number, message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  // For FormData the browser sets Content-Type (with the multipart boundary) by itself.
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(`/api${path}`, { ...options, headers, credentials: "include" });
  } catch {
    throw new ApiError(0, "Cannot reach the server. Check that the backend is running and try again.");
  }

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    // empty or non-JSON body
  }

  if (!response.ok) {
    const body = (data ?? {}) as { message?: string; errors?: Record<string, string> };
    throw new ApiError(response.status, body.message ?? "Something went wrong. Please try again.", body.errors);
  }
  return data as T;
}
