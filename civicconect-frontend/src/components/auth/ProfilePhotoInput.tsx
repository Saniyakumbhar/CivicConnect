import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Camera } from "lucide-react";
import Button from "../ui/Button";

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

interface ProfilePhotoInputProps {
  file: File | null;
  onChange: (file: File | null) => void;
}

export default function ProfilePhotoInput({ file, onChange }: ProfilePhotoInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("Please choose an image file (JPG, PNG or WebP).");
      e.target.value = "";
      return;
    }
    if (selected.size > MAX_BYTES) {
      setError("Image must be 2 MB or smaller.");
      e.target.value = "";
      return;
    }
    setError(null);
    onChange(selected);
  }

  function handleRemove() {
    onChange(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="photo-input">
      <div className="photo-input__preview">
        {preview ? (
          <img src={preview} alt="Selected profile preview" />
        ) : (
          <Camera size={28} aria-hidden="true" />
        )}
      </div>
      <div className="photo-input__body">
        <span className="field__label">Profile photo (optional)</span>
        <div className="photo-input__actions">
          <Button variant="secondary" onClick={() => inputRef.current?.click()}>
            {file ? "Change photo" : "Choose photo"}
          </Button>
          {file && (
            <Button variant="ghost" onClick={handleRemove}>
              Remove
            </Button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          hidden
          aria-label="Upload profile photo"
        />
        {error ? <p className="field__error">{error}</p> : <p className="field__hint">JPG, PNG or WebP, up to 2 MB.</p>}
      </div>
    </div>
  );
}
