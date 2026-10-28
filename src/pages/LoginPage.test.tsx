import { useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AdminLogin } from "./LoginPage";
import type { AuthPayload } from "../services/api";
import type { Language } from "../types";

function LoginHarness({
  onLogin = vi.fn(),
}: {
  onLogin?: (payload: AuthPayload) => void;
}) {
  const [language, setLanguage] = useState<Language>("ID");
  return (
    <AdminLogin
      language={language}
      setLanguage={setLanguage}
      onLogin={onLogin}
    />
  );
}

describe("AdminLogin", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
        const payload = JSON.parse(String(init?.body)) as {
          mfaCode: string;
        };
        const ok = payload.mfaCode === "123456";
        return {
          ok,
          status: ok ? 200 : 401,
          json: async () =>
            ok
              ? { ok: true, message: "Login berhasil." }
              : { ok: false, message: "Kode MFA tidak cocok." },
        };
      }),
    );
  });

  afterEach(() => vi.unstubAllGlobals());

  it("completes the simulated credentials and MFA flow", async () => {
    const user = userEvent.setup();
    const onLogin = vi.fn();

    render(<LoginHarness onLogin={onLogin} />);
    await user.type(
      screen.getByPlaceholderText("nama@ruangrasa.id"),
      "nama@ruangrasa.id",
    );
    await user.type(screen.getByPlaceholderText("••••••••••"), "ruangrasa");
    await user.click(screen.getByRole("button", { name: "Lanjut" }));

    const digits = screen.getAllByRole("textbox", { name: /Kode MFA 6 digit/ });
    for (const [index, digit] of Array.from("123456").entries()) {
      fireEvent.change(digits[index], { target: { value: digit } });
    }

    await user.click(screen.getByRole("button", { name: "Verifikasi" }));

    await waitFor(() =>
      expect(onLogin).toHaveBeenCalledWith({
        email: "nama@ruangrasa.id",
        password: "ruangrasa",
        mfaCode: "123456",
      }),
    );
  });

  it("changes login copy when the language is switched", async () => {
    const user = userEvent.setup();
    render(<LoginHarness />);

    await user.click(screen.getAllByRole("button", { name: "EN" })[0]);

    expect(screen.getByText("Work email")).toBeInTheDocument();
    expect(
      screen.getByText("Password", { selector: ".field-heading span" }),
    ).toBeInTheDocument();
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();
    render(<LoginHarness />);
    const input = screen.getByPlaceholderText("••••••••••");

    expect(input).toHaveAttribute("type", "password");
    await user.click(
      screen.getByRole("button", { name: "Tampilkan kata sandi" }),
    );
    expect(input).toHaveAttribute("type", "text");
    await user.click(
      screen.getByRole("button", { name: "Sembunyikan kata sandi" }),
    );
    expect(input).toHaveAttribute("type", "password");
  });

  it("rejects an incorrect MFA code", async () => {
    const user = userEvent.setup();

    render(<LoginHarness />);
    await user.type(
      screen.getByPlaceholderText("nama@ruangrasa.id"),
      "nama@ruangrasa.id",
    );
    await user.type(screen.getByPlaceholderText("••••••••••"), "ruangrasa");
    await user.click(screen.getByRole("button", { name: "Lanjut" }));

    const digits = screen.getAllByRole("textbox", { name: /Kode MFA 6 digit/ });
    for (const [index, digit] of Array.from("000000").entries()) {
      fireEvent.change(digits[index], { target: { value: digit } });
    }

    await user.click(screen.getByRole("button", { name: "Verifikasi" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Kode MFA tidak cocok.",
    );
  });
});
