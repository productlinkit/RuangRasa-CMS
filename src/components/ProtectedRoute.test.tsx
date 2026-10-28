import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProtectedRoute } from "./ProtectedRoute";

describe("ProtectedRoute", () => {
  it("shows protected content to authenticated users", () => {
    render(
      <ProtectedRoute isAuthenticated fallback={<p>Please sign in</p>}>
        <p>Admin content</p>
      </ProtectedRoute>,
    );

    expect(screen.getByText("Admin content")).toBeInTheDocument();
    expect(screen.queryByText("Please sign in")).not.toBeInTheDocument();
  });

  it("shows the fallback to unauthenticated users", () => {
    render(
      <ProtectedRoute isAuthenticated={false} fallback={<p>Please sign in</p>}>
        <p>Admin content</p>
      </ProtectedRoute>,
    );

    expect(screen.getByText("Please sign in")).toBeInTheDocument();
    expect(screen.queryByText("Admin content")).not.toBeInTheDocument();
  });
});
