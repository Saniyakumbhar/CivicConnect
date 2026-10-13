import { useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "../ui/TextField";
import PasswordField from "../ui/PasswordField";
import Button from "../ui/Button";
import Alert from "../ui/Alert";
import ForgotPasswordPanel from "./ForgotPasswordPanel";
import { useAuth } from "../../hooks/useAuth";
import { DASHBOARD_PATH } from "../../config/roleRoutes";
import { isValidEmail } from "../../utils/validators";
import type { Role } from "../../types/auth";

export interface LoginFormProps {
  role: Role;
  identifierLabel: string;
  identifierPlaceholder: string;
  /** "email" = must be an email. "emailOrId" = email or Officer ID. */
  identifierKind: "email" | "emailOrId";
  /** Green banner, e.g. shown after successful registration. */
  notice?: string;
  /** Mock credentials shown in development only. */
  demoHint?: string;
  footer?: ReactNode;
}

interface LoginErrors {
  identifier?: string;
  password?: string;
}

export default function LoginForm({
  role,
  identifierLabel,
  identifierPlaceholder,
  identifierKind,
  notice,
  demoHint,
  footer,
}: LoginFormProps) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  function validate(): LoginErrors {
    const result: LoginErrors = {};
    const value = identifier.trim();

    if (!value) {
      result.identifier = `${identifierLabel} is required.`;
    } else if (identifierKind === "email" && !isValidEmail(value)) {
      result.identifier = "Enter a valid email address.";
    } else if (identifierKind === "emailOrId" && !isValidEmail(value) && !/^[A-Za-z0-9-]{3,20}$/.test(value)) {
      result.identifier = "Enter a valid official email or Officer ID.";
    }

    if (!password) result.password = "Password is required.";
    return result;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      const user = await login(role, { identifier: identifier.trim(), password, remember });
      navigate(DASHBOARD_PATH[user.role], { replace: true });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {notice && <Alert variant="success">{notice}</Alert>}
        {formError && <Alert variant="error">{formError}</Alert>}

        <TextField
          label={identifierLabel}
          name="identifier"
          type={identifierKind === "email" ? "email" : "text"}
          autoComplete="username"
          placeholder={identifierPlaceholder}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          error={errors.identifier}
          required
        />

        <PasswordField
          label="Password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
        />

        <div className="auth-form__row">
          <label className="check">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Remember me
          </label>
          <button type="button" className="link-button" onClick={() => setShowForgot((v) => !v)}>
            Forgot password?
          </button>
        </div>

        <Button type="submit" loading={loading} fullWidth>
          {loading ? "Signing in..." : "Login"}
        </Button>

        {import.meta.env.DEV && demoHint && (
          <p className="demo-hint">
            <strong>Demo login:</strong> {demoHint}
          </p>
        )}
      </form>

      {showForgot && <ForgotPasswordPanel onClose={() => setShowForgot(false)} />}
      {footer && <div className="auth-footer">{footer}</div>}
    </>
  );
}
