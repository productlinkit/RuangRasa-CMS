import React from "react";

export function Button({
  children,
  kind = "secondary",
  disabled = false,
  onClick,
}: {
  children: React.ReactNode;
  kind?: "primary" | "secondary" | "danger" | "danger-outline";
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className={`button button--${kind}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
