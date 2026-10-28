import { message } from "../locales";
import { localized } from "../i18n";
import React, { useEffect, useRef, useState } from "react";

import { ResetDialog } from "../components/dialogs";

import { Button, Icon, LanguageToggle } from "../components/ui";

import { copy } from "../data/mock/index";

import { signInWithMfa } from "../services/auth";

import type { AuthPayload } from "../services/api";

import type { Language } from "../types/index";

export function AdminLogin({
  language,
  setLanguage,
  onLogin,
}: {
  language: Language;
  setLanguage: (language: Language) => void;
  onLogin: (payload: AuthPayload) => void | Promise<void>;
}) {
  const [showReset, setShowReset] = useState(false);
  const [step, setStep] = useState<"credentials" | "verify">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(30);
  const [codeError, setCodeError] = useState("");
  const codeRefs = useRef<Array<HTMLInputElement | null>>([]);
  const t = copy[language];
  const verifyCopy = localized(
    language,
    {
      eyebrow: "VERIFIKASI",
      title: "Masukkan kode",
      accent: "Anda.",
      intro: `Kode 6 digit telah dikirim ke ${email || "email kerja Anda"}.`,
      continue: "Lanjut",
      verify: "Verifikasi",
      resend: "Kirim ulang kode",
      back: "Kembali",
      mismatch: "Kode tidak cocok",
    },
    {
      eyebrow: "VERIFICATION",
      title: "Enter your",
      accent: "code.",
      intro: `A 6-digit code was sent to ${email || "your work email"}.`,
      continue: "Continue",
      verify: "Verify",
      resend: "Resend code",
      back: "Back",
      mismatch: "Code does not match",
    },
  );
  useEffect(() => {
    if (step !== "verify") return;
    codeRefs.current[0]?.focus();
  }, [step]);
  useEffect(() => {
    if (step !== "verify" || countdown <= 0) return;
    const timer = window.setTimeout(
      () => setCountdown((value) => value - 1),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [step, countdown]);
  function updateDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? digit : item)),
    );
    setCodeError("");
    if (digit && index < 5) codeRefs.current[index + 1]?.focus();
  }
  function pasteCode(event: React.ClipboardEvent<HTMLDivElement>) {
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    event.preventDefault();
    const next = Array.from({ length: 6 }, (_, index) => pasted[index] ?? "");
    setDigits(next);
    setCodeError("");
    codeRefs.current[Math.min(pasted.length, 6) - 1]?.focus();
  }
  async function verifyCode() {
    const payload: AuthPayload = { email, password, mfaCode: digits.join("") };
    const result = await signInWithMfa(payload);

    if (result.ok) {
      await onLogin(payload);
      return;
    }

    setCodeError(result.message);
    codeRefs.current[0]?.focus();
  }

  return (
    <div className="login-page">
      <a className="login-brand" href="/" aria-label={t.backToSite}>
        <img src="/ruangrasa-logo.png" alt="RuangRasa." />
      </a>
      <div className="login-language">
        <LanguageToggle language={language} setLanguage={setLanguage} />
      </div>
      <main className="login-main">
        <section className="login-card">
          {step === "credentials" ? (
            <>
              <div className="eyebrow">
                <span />
                {t.loginEyebrow}
              </div>
              <h1>
                {t.loginTitle} <em>{t.loginAccent}</em>
              </h1>
              <p className="login-intro">{t.loginIntro}</p>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setStep("verify");
                  setCountdown(30);
                }}
              >
                <label className="field">
                  <span>{t.workEmail}</span>
                  <div className="input-wrap">
                    <Icon>mail</Icon>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="nama@ruangrasa.id"
                      autoComplete="email"
                      required
                    />
                  </div>
                </label>
                <div className="field-heading">
                  <span>{t.password}</span>
                  <button type="button" onClick={() => setShowReset(true)}>
                    {t.forgot}
                  </button>
                </div>
                <label className="field">
                  <span className="sr-only">{t.password}</span>
                  <div className="input-wrap">
                    <Icon>lock</Icon>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="••••••••••"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={message(
                        language,
                        showPassword
                          ? "pages.LoginPage.hidePassword"
                          : "pages.LoginPage.showPassword",
                      )}
                      aria-pressed={showPassword}
                    >
                      <Icon>
                        {showPassword ? "visibility_off" : "visibility"}
                      </Icon>
                    </button>
                  </div>
                </label>
                <Button kind="primary">
                  {verifyCopy.continue}
                  <Icon>arrow_forward</Icon>
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="eyebrow">
                <span />
                {verifyCopy.eyebrow}
              </div>
              <h1>
                {verifyCopy.title} <em>{verifyCopy.accent}</em>
              </h1>
              <p className="login-intro">{verifyCopy.intro}</p>
              <div className="otp-example">
                <Icon>key</Icon>
                {message(language, "pages.LoginPage.001")}
              </div>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  verifyCode();
                }}
              >
                <div className="otp-fields" onPaste={pasteCode}>
                  {digits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        codeRefs.current[index] = element;
                      }}
                      value={digit}
                      onChange={(event) =>
                        updateDigit(index, event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Backspace" && !digit && index > 0)
                          codeRefs.current[index - 1]?.focus();
                        if (event.key === "ArrowLeft" && index > 0)
                          codeRefs.current[index - 1]?.focus();
                        if (event.key === "ArrowRight" && index < 5)
                          codeRefs.current[index + 1]?.focus();
                      }}
                      inputMode="numeric"
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      autoFocus={index === 0}
                      maxLength={1}
                      aria-label={`${t.mfaCode} ${index + 1}`}
                    />
                  ))}
                </div>
                {codeError && (
                  <div className="login-error" role="alert">
                    <Icon>error</Icon>
                    {codeError}
                  </div>
                )}
                <Button
                  kind="primary"
                  disabled={digits.some((digit) => !digit)}
                >
                  {verifyCopy.verify}
                  <Icon>verified_user</Icon>
                </Button>
                <div className="verification-links">
                  <button
                    type="button"
                    disabled={countdown > 0}
                    onClick={() => {
                      setCountdown(30);
                      setDigits(["", "", "", "", "", ""]);
                      codeRefs.current[0]?.focus();
                    }}
                  >
                    {verifyCopy.resend}
                    {countdown > 0
                      ? ` (0:${String(countdown).padStart(2, "0")})`
                      : ""}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("credentials");
                      setDigits(["", "", "", "", "", ""]);
                      setCodeError("");
                    }}
                  >
                    {verifyCopy.back}
                  </button>
                </div>
              </form>
            </>
          )}
          <div className="login-privacy">
            <Icon>lock</Icon>
            <p>{t.loginPrivacy}</p>
          </div>
        </section>
        <a className="back-link" href="/">
          <Icon>arrow_back</Icon>
          {t.backToSite}
        </a>
      </main>
      {showReset && (
        <ResetDialog language={language} onClose={() => setShowReset(false)} />
      )}
    </div>
  );
}

export default AdminLogin;
