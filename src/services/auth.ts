import { authApi, type AuthPayload, type AuthResult } from "./api";

export async function signInWithMfa({
  email,
  password,
  mfaCode,
}: AuthPayload): Promise<AuthResult> {
  if (!email.trim() || !email.includes("@")) {
    return { ok: false, message: "Masukkan email kerja yang valid." };
  }

  if (!password.trim()) {
    return { ok: false, message: "Masukkan kata sandi." };
  }

  if (!/^\d{6}$/.test(mfaCode.trim())) {
    return { ok: false, message: "Kode MFA harus 6 digit." };
  }

  try {
    return await authApi.signIn({
      email: email.trim(),
      password,
      mfaCode: mfaCode.trim(),
    });
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Login gagal menghubungi API.",
    };
  }
}
