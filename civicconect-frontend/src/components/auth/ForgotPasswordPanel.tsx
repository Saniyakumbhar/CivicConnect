import { useState, type FormEvent } from "react";
import TextField from "../ui/TextField";
import Button from "../ui/Button";
import Alert from "../ui/Alert";
import { isValidEmail } from "../../utils/validators";

/** UI only. Later: POST /api/auth/forgot-password { email } */
export default function ForgotPasswordPanel({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Enter the email address linked to your account.");
      return;
    }
    setError(undefined);
    setLoading(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    setSent(true);
  }

  return (
    <form className="forgot" onSubmit={handleSubmit} noValidate>
      <strong>Reset your password</strong>
      {sent ? (
        <Alert variant="success">
          If an account exists for {email.trim()}, a reset link will be sent. (Demo: no email is actually sent.)
        </Alert>
      ) : (
        <TextField
          label="Account email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
        />
      )}
      <div className="forgot__actions">
        {!sent && (
          <Button type="submit" loading={loading}>
            Send reset link
          </Button>
        )}
        <Button variant="ghost" onClick={onClose}>
          {sent ? "Close" : "Cancel"}
        </Button>
      </div>
    </form>
  );
}
