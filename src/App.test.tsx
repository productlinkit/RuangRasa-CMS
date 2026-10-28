import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AppStateProvider } from "./hooks/AppStateProvider";
import App from "./App";

describe("admin routes", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const method = init?.method ?? "GET";
        if (url.endsWith("/auth/session")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({ authenticated: false }),
          };
        }
        if (url.endsWith("/auth/login")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({ ok: true, message: "Login berhasil." }),
          };
        }
        if (url.endsWith("/audit") && method === "POST") {
          return {
            ok: true,
            status: 201,
            json: async () => JSON.parse(String(init?.body)),
          };
        }
        if (url.endsWith("/audit")) {
          return { ok: true, status: 200, json: async () => [] };
        }
        if (url.endsWith("/users")) {
          return { ok: true, status: 200, json: async () => [] };
        }
        return { ok: true, status: 200, json: async () => ({}) };
      }),
    );
  });

  afterEach(() => vi.unstubAllGlobals());

  it("opens a page through its dedicated URL after login", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/users"]}>
        <AppStateProvider>
          <App />
        </AppStateProvider>
      </MemoryRouter>,
    );

    const emailInput = await screen.findByPlaceholderText("nama@ruangrasa.id");
    await user.type(emailInput, "nama@ruangrasa.id");
    await user.type(screen.getByPlaceholderText("••••••••••"), "ruangrasa");
    await user.click(screen.getByRole("button", { name: "Lanjut" }));

    const digits = screen.getAllByRole("textbox", {
      name: /Kode MFA 6 digit/,
    });
    for (const [index, digit] of Array.from("123456").entries()) {
      fireEvent.change(digits[index], { target: { value: digit } });
    }

    await user.click(screen.getByRole("button", { name: "Verifikasi" }));

    await waitFor(() =>
      expect(screen.getByRole("navigation")).toBeInTheDocument(),
    );
    await user.click(screen.getByRole("button", { name: "Pengguna" }));
    expect(
      await screen.findByRole("heading", { name: /Pengguna/ }),
    ).toBeInTheDocument();
  }, 10_000);
});
