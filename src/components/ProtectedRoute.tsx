import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

type ProtectedRouteProps = {
  isAuthenticated: boolean;
  fallback: ReactNode;
  children?: ReactNode;
};

export function ProtectedRoute({
  isAuthenticated,
  fallback,
  children,
}: ProtectedRouteProps) {
  return isAuthenticated ? (children ?? <Outlet />) : fallback;
}
