import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "../ui/TextField";
import PasswordField from "../ui/PasswordField";
import SelectField from "../ui/SelectField";
import Button from "../ui/Button";
import Alert from "../ui/Alert";
import ProfilePhotoInput from "./ProfilePhotoInput";
import { authService } from "../../services/authService";
import { ApiError } from "../../services/api";
import { INDIAN_STATES } from "../../data/indianStates";
import { LOGIN_PATH } from "../../config/roleRoutes";
import { MIN_PASSWORD_LENGTH, isValidEmail, isValidIndianMobile } from "../../utils/validators";

interface RegisterValues {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  address: string;
  city: string;
  state: string;
}

type RegisterErrors = Partial<Record<keyof RegisterValues, string>>;

const INITIAL_VALUES: RegisterValues = {
  fullName: "",
  email: "",
  mobile: "",
  password: "",
  confirmPassword: "",
  address: "",
  city: "",
  state: "",
};

function validate(v: RegisterValues): RegisterErrors {
  const e: RegisterErrors = {};

  if (!v.fullName.trim()) e.fullName = "Full name is required.";
  else if (v.fullName.trim().length < 3) e.fullName = "Enter your full name (at least 3 characters).";

  if (!v.email.trim()) e.email = "Email is required.";
  else if (!isValidEmail(v.email)) e.email = "Enter a valid email address.";

  if (!v.mobile.trim()) e.mobile = "Mobile number is required.";
  else if (!isValidIndianMobile(v.mobile)) e.mobile = "Enter a valid 10-digit Indian mobile number.";

  if (!v.password) e.password = "Password is required.";
  else if (v.password.length < MIN_PASSWORD_LENGTH)
    e.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;

  if (!v.confirmPassword) e.confirmPassword = "Please confirm your password.";
  else if (v.confirmPassword !== v.password) e.confirmPassword = "Passwords do not match.";

  if (!v.address.trim()) e.address = "Address is required.";
  if (!v.city.trim()) e.city = "City is required.";
  if (!v.state) e.state = "Select your state.";

  return e;
}

export default function RegisterForm() {
  const navigate = useNavigate();
  const [values, setValues] = useState<RegisterValues>(INITIAL_VALUES);
  const [photo, setPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined })); // clear that field's error while typing
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.values(validationErrors).some(Boolean)) return;

    setLoading(true);
    try {
      await authService.registerCitizen({
        fullName: values.fullName,
        email: values.email,
        mobile: values.mobile,
        password: values.password,
        address: values.address,
        city: values.city,
        state: values.state,
        profilePhoto: photo,
      });
      navigate(LOGIN_PATH.CITIZEN, { replace: true, state: { registered: true } });
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) setErrors(err.fieldErrors as RegisterErrors);
      setFormError(err instanceof Error ? err.message : "Registration failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {formError && <Alert variant="error">{formError}</Alert>}

      <div className="form-grid">
        <div className="span-2">
          <ProfilePhotoInput file={photo} onChange={setPhoto} />
        </div>

        <div className="span-2">
          <TextField
            label="Full name"
            name="fullName"
            autoComplete="name"
            placeholder="As on your ID"
            value={values.fullName}
            onChange={handleChange}
            error={errors.fullName}
            required
          />
        </div>

        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <TextField
          label="Mobile number"
          name="mobile"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="10-digit mobile number"
          value={values.mobile}
          onChange={handleChange}
          error={errors.mobile}
          required
        />

        <PasswordField
          label="Password"
          name="password"
          autoComplete="new-password"
          hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <PasswordField
          label="Confirm password"
          name="confirmPassword"
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />

        <div className="span-2">
          <TextField
            label="Address"
            name="address"
            autoComplete="street-address"
            placeholder="House no., street, locality"
            value={values.address}
            onChange={handleChange}
            error={errors.address}
            required
          />
        </div>

        <TextField
          label="City"
          name="city"
          autoComplete="address-level2"
          value={values.city}
          onChange={handleChange}
          error={errors.city}
          required
        />

        <SelectField
          label="State"
          name="state"
          autoComplete="address-level1"
          options={INDIAN_STATES}
          placeholder="Select your state"
          value={values.state}
          onChange={handleChange}
          error={errors.state}
          required
        />
      </div>

      <Button type="submit" loading={loading} fullWidth>
        {loading ? "Creating account..." : "Create Citizen Account"}
      </Button>
    </form>
  );
}
