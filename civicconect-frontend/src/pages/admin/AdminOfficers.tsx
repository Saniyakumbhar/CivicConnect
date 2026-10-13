import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import TextField from "../../components/ui/TextField";
import PasswordField from "../../components/ui/PasswordField";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { adminService, type NewOfficer, type Officer } from "../../services/adminService";
import { ApiError } from "../../services/api";
import { MIN_PASSWORD_LENGTH, isValidEmail } from "../../utils/validators";

type FormErrors = Partial<Record<keyof NewOfficer, string>>;

const EMPTY_FORM: NewOfficer = { name: "", email: "", officerId: "", department: "", password: "" };

function validate(v: NewOfficer): FormErrors {
  const e: FormErrors = {};
  if (v.name.trim().length < 3) e.name = "Enter the officer's full name.";
  if (!isValidEmail(v.email)) e.email = "Enter a valid official email.";
  if (!/^[A-Za-z0-9-]{3,20}$/.test(v.officerId.trim())) e.officerId = "Officer ID must be 3-20 letters, numbers or dashes.";
  if (v.department.trim().length < 2) e.department = "Enter the department.";
  if (v.password.length < MIN_PASSWORD_LENGTH) e.password = `Temporary password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  return e;
}

export default function AdminOfficers() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [form, setForm] = useState<NewOfficer>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadOfficers = useCallback(async () => {
    try {
      setOfficers(await adminService.listOfficers());
      setListError(null);
    } catch (err) {
      setListError(err instanceof Error ? err.message : "Could not load officers.");
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOfficers();
  }, [loadOfficers]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setSuccess(null);

    const found = validate(form);
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;

    setSaving(true);
    try {
      const created = await adminService.createOfficer(form);
      setSuccess(`Officer created. They can log in with ${created.officerId} or ${created.email}.`);
      setForm(EMPTY_FORM);
      await loadOfficers();
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) setErrors(err.fieldErrors as FormErrors);
      setFormError(err instanceof Error ? err.message : "Could not create the officer.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(officer: Officer) {
    try {
      await adminService.setOfficerActive(officer.id, !officer.isActive);
      await loadOfficers();
    } catch (err) {
      setListError(err instanceof Error ? err.message : "Could not update the officer.");
    }
  }

  return (
    <DashboardLayout title="Manage Officers" subtitle="Officers cannot register themselves. Create their accounts here.">
      <Link to="/admin/dashboard" className="back-link">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to dashboard
      </Link>

      <div className="admin-grid">
        <section className="panel" aria-labelledby="create-officer-title">
          <h2 id="create-officer-title" className="panel__title">
            Create officer account
          </h2>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {success && <Alert variant="success">{success}</Alert>}
            {formError && <Alert variant="error">{formError}</Alert>}

            <TextField label="Full name" name="name" value={form.name} onChange={handleChange} error={errors.name} required />
            <TextField
              label="Official email"
              name="email"
              type="email"
              autoComplete="off"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            <TextField
              label="Officer ID"
              name="officerId"
              placeholder="OFF-1002"
              autoComplete="off"
              value={form.officerId}
              onChange={handleChange}
              error={errors.officerId}
              required
            />
            <TextField
              label="Department"
              name="department"
              placeholder="e.g. Roads and Drainage"
              value={form.department}
              onChange={handleChange}
              error={errors.department}
              required
            />
            <PasswordField
              label="Temporary password"
              name="password"
              autoComplete="new-password"
              hint={`At least ${MIN_PASSWORD_LENGTH} characters. Share it with the officer privately.`}
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
            <Button type="submit" loading={saving} fullWidth>
              {saving ? "Creating..." : "Create officer"}
            </Button>
          </form>
        </section>

        <section className="panel" aria-labelledby="officer-list-title">
          <h2 id="officer-list-title" className="panel__title">
            Existing officers
          </h2>

          {listError && <Alert variant="error">{listError}</Alert>}
          {listLoading ? (
            <p className="muted">Loading officers...</p>
          ) : officers.length === 0 ? (
            <p className="muted">No officers yet. Create the first one using the form.</p>
          ) : (
            <ul className="officer-list">
              {officers.map((officer) => (
                <li key={officer.id} className="officer-row">
                  <div className="officer-row__info">
                    <strong>{officer.name}</strong>
                    <span>
                      {officer.officerId} - {officer.department}
                    </span>
                    <span>{officer.email}</span>
                  </div>
                  <div className="officer-row__actions">
                    <span className={`status-pill ${officer.isActive ? "status-pill--on" : "status-pill--off"}`}>
                      {officer.isActive ? "Active" : "Disabled"}
                    </span>
                    <Button variant="secondary" onClick={() => void toggleActive(officer)}>
                      {officer.isActive ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
