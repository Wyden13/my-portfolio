"use client";
import { ReactNode } from "react";

interface PressButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

export default function PressButton({
  children,
  onClick,
  className = "",
  variant = "primary",
  disabled = false,
}: PressButtonProps) {
  const baseStyles =
    "rounded-lg border-2 border-[var(--text-primary)] px-8 py-3 font-semibold shadow-[0_8px_0_0_var(--text-primary)] transition-all duration-100 hover:translate-y-1.5 hover:bg-green-400 hover:shadow-[0_2px_0_0_var(--text-primary)]";

  const variantStyles = {
    primary: "bg-yellow-500 text-white",
    secondary: "bg-[var(--surface)] text-[var(--accent)] hover:text-black",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
