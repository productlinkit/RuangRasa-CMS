import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { signInWithMfa } from "./auth";

describe("simulated auth service", () => {
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

  it("accepts a valid demo MFA challenge", async () => {
    expect(
      await signInWithMfa({
        email: "nama@ruangrasa.id",
        password: "ruangrasa",
        mfaCode: "123456",
      }),
    ).toEqual({ ok: true, message: "Login berhasil." });
  });

  it.each([
    [
      "invalid email",
      { email: "not-an-email", password: "pass", mfaCode: "123456" },
    ],
    [
      "empty password",
      { email: "nama@ruangrasa.id", password: " ", mfaCode: "123456" },
    ],
    [
      "malformed MFA",
      { email: "nama@ruangrasa.id", password: "pass", mfaCode: "12345" },
    ],
    [
      "incorrect MFA",
      { email: "nama@ruangrasa.id", password: "pass", mfaCode: "000000" },
    ],
  ])("rejects %s", async (_scenario, payload) => {
    expect(await signInWithMfa(payload)).toMatchObject({ ok: false });
  });
});
