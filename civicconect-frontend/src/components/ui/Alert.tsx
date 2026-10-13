import type { ReactNode } from "react";
import { CircleAlert, CircleCheck, Info } from "lucide-react";

interface AlertProps {
  variant: "error" | "success" | "info";
  children: ReactNode;
}

export default function Alert({ variant, children }: AlertProps) {
  const Icon = variant === "error" ? CircleAlert : variant === "success" ? CircleCheck : Info;
  return (
    <div className={`alert alert--${variant}`} role={variant === "error" ? "alert" : "status"}>
      <Icon size={18} aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}
