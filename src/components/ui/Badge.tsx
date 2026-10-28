import React from "react";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "whatsapp";
}) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}
