import { message } from "../locales";
import { usePersistentState } from "../hooks/usePersistentState";
import { useState } from "react";

import { ConfigActionDialog } from "../components/dialogs";

import {
  AccessBanner,
  Badge,
  Button,
  Icon,
  PageTitle,
  Toggle,
  localizeStatus,
} from "../components/ui";

import { initialRaraChat, RELATIONSHIP_CONTEXTS } from "../data/mock/index";

import { Access, Language, Role } from "../types/index";

export function RaraConfigPage({
  language,
  role,
  access,
  onAudit,
}: {
  language: Language;
  role: Role;
  access: Access;
  onAudit: (action: string, object: string, reason: string) => void;
}) {
  const editable = access === "F";
  const [prompt, setPrompt] = usePersistentState(
    "ruangrasa.raraconfig.prompt",
    "Kamu adalah Rara, teman cerita yang hangat dan netral. Dengarkan tanpa menghakimi. Ajukan satu pertanyaan per giliran. Jangan pernah menyuruh user melakukan sesuatu. Kamu bukan terapis.",
  );
  const [guardrails, setGuardrails] = usePersistentState(
    "ruangrasa.raraconfig.guardrails",
    [true, true, true],
  );
  const [style, setStyle] = usePersistentState(
    "ruangrasa.raraconfig.style",
    "Casual (Jaksel)",
  );
  const [mirroring, setMirroring] = usePersistentState(
    "ruangrasa.raraconfig.mirroring",
    [true, true, false],
  );
  const [mediation, setMediation] = usePersistentState(
    "ruangrasa.raraconfig.mediation",
    [true, true, true],
  );
  const [contentLanguage, setContentLanguage] = useState<Language>("ID");
  const [consentID, setConsentID] = usePersistentState(
    "ruangrasa.raraconfig.consentID",
    "Dengan melanjutkan, kamu setuju percakapan ini disimpan terenkripsi, tidak dibagikan kepada pihak ketiga, dan dapat ditinjau oleh tim tertentu untuk kebutuhan keamanan.",
  );
  const [consentEN, setConsentEN] = usePersistentState(
    "ruangrasa.raraconfig.consentEN",
    "By continuing, you agree that this conversation is stored encrypted, never shared with third parties, and may be reviewed by authorised team members for safety.",
  );
  const [testMessage, setTestMessage] = useState("");
  const [chat, setChat] = usePersistentState(
    "ruangrasa.raraconfig.chat",
    initialRaraChat,
  );
  const [dialog, setDialog] = useState<"publish" | "rollback" | null>(null);
  const [published, setPublished] = usePersistentState(
    "ruangrasa.raraconfig.published",
    false,
  );
  const [toast, setToast] = useState("");
  const crisisText =
    "Rara is not a crisis service. If you're in danger, contact emergency services immediately. In Indonesia: Into The Light, 119 ext. 8.";
  const t = message(language, "pages.RaraConfigPage.001");
  const mediationDetails = message(language, "pages.RaraConfigPage.002");
  function flip(
    values: boolean[],
    setValues: (values: boolean[]) => void,
    index: number,
  ) {
    if (editable)
      setValues(values.map((value, item) => (item === index ? !value : value)));
  }
  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  }
  function sendTest() {
    if (!testMessage.trim()) return;
    setChat([
      ...chat,
      ["user", testMessage],
      ["rara", message(language, "pages.RaraConfigPage.003")],
    ]);
    setTestMessage("");
  }
  function confirmAction(reason: string) {
    if (!dialog) return;
    if (dialog === "publish") {
      onAudit("Publish konfigurasi Rara", "Rara v13", reason);
      setPublished(true);
      showToast(message(language, "pages.RaraConfigPage.004"));
    } else {
      onAudit("Rollback konfigurasi Rara", "Rara v11", reason);
      setPublished(false);
      showToast(message(language, "pages.RaraConfigPage.005"));
    }
    setDialog(null);
  }
  return (
    <>
      <AccessBanner role={role} language={language} access={access} />
      <section className="config-heading">
        <div>
          <PageTitle
            eyebrow={message(language, "pages.RaraConfigPage.006")}
            title={message(language, "pages.RaraConfigPage.007")}
            accent="Rara."
          />
          <p>{t.subtitle}</p>
        </div>
        <div>
          <Button disabled={!editable} onClick={() => showToast(t.save)}>
            <Icon>save</Icon>
            {t.draft}
          </Button>
          <Button
            kind="primary"
            disabled={!editable || published}
            onClick={() => setDialog("publish")}
          >
            <Icon>publish</Icon>
            {published ? "v13 Live" : t.publish}
          </Button>
        </div>
      </section>
      <div className="config-layout">
        <main className="config-main">
          <article className="card config-card">
            <div className="config-card__heading">
              <div>
                <Icon>psychology</Icon>
                <h2>{t.persona}</h2>
              </div>
              <Badge tone={published ? "success" : "warning"}>
                {published ? "Live v13" : "Draft v13"}
              </Badge>
            </div>
            <label className="config-field">
              <span>System prompt</span>
              <textarea
                disabled={!editable}
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
              />
            </label>
            <div className="toggle-list">
              {[t.neutral, t.one, t.noAdvice].map((label, index) => (
                <div key={label}>
                  <span>{label}</span>
                  <Toggle
                    label={label}
                    checked={guardrails[index]}
                    disabled={!editable}
                    onChange={() => flip(guardrails, setGuardrails, index)}
                  />
                </div>
              ))}
            </div>
          </article>
          <article className="card config-card">
            <div className="config-card__heading">
              <div>
                <Icon>translate</Icon>
                <h2>{t.language}</h2>
              </div>
            </div>
            <div className="style-tabs">
              {["Casual (Jaksel)", "Composed (EN)", "Formal (ID)"].map(
                (item) => (
                  <button
                    key={item}
                    className={style === item ? "is-active" : ""}
                    disabled={!editable}
                    onClick={() => setStyle(item)}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
            <div className="style-example">
              <span>{style}</span>
              <p>
                {style === "Casual (Jaksel)"
                  ? "kedengarannya berat banget. apa yang paling bikin kamu kepikiran?"
                  : style === "Composed (EN)"
                    ? "That sounds difficult. What part has been weighing on you most?"
                    : "Kedengarannya hal tersebut cukup berat. Bagian mana yang paling mengganggu pikiranmu?"}
              </p>
            </div>
            <div className="toggle-list">
              {[t.tone, t.length, t.punctuation].map((label, index) => (
                <div key={label}>
                  <span>{label}</span>
                  <Toggle
                    label={label}
                    checked={mirroring[index]}
                    disabled={!editable}
                    onChange={() => flip(mirroring, setMirroring, index)}
                  />
                </div>
              ))}
            </div>
          </article>
          <article className="card config-card">
            <div className="config-card__heading">
              <div>
                <Icon>diversity_3</Icon>
                <h2>{t.mediation}</h2>
              </div>
            </div>
            <div className="mediation-rules">
              {[
                [t.turn, mediationDetails[0]],
                [t.medNeutral, mediationDetails[1]],
                [t.sharp, mediationDetails[2]],
              ].map(([label, detail], index) => (
                <div key={label}>
                  <span className="rule-number">0{index + 1}</span>
                  <div>
                    <strong>{label}</strong>
                    <p>{detail}</p>
                  </div>
                  <Toggle
                    label={label}
                    checked={mediation[index]}
                    disabled={!editable}
                    onChange={() => flip(mediation, setMediation, index)}
                  />
                </div>
              ))}
            </div>
          </article>
          <article className="card config-card onboarding-card">
            <div className="config-card__heading">
              <div>
                <Icon>chat</Icon>
                <h2>{t.onboarding}</h2>
              </div>
              <div className="language-toggle">
                {(["ID", "EN"] as Language[]).map((item) => (
                  <button
                    key={item}
                    className={contentLanguage === item ? "is-active" : ""}
                    onClick={() => setContentLanguage(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <label className="config-field">
              <span>{t.contexts}</span>
              <div className="context-chips">
                {RELATIONSHIP_CONTEXTS.map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </div>
            </label>
            <label className="config-field">
              <span>
                {t.consent} · {contentLanguage}
              </span>
              <textarea
                disabled={!editable}
                value={contentLanguage === "ID" ? consentID : consentEN}
                onChange={(event) =>
                  contentLanguage === "ID"
                    ? setConsentID(event.target.value)
                    : setConsentEN(event.target.value)
                }
              />
            </label>
            <div className="crisis-copy">
              <div>
                <Icon>health_and_safety</Icon>
                <strong>{t.disclaimer}</strong>
              </div>
              <p>Rara bukan terapis dan bukan layanan krisis.</p>
              <p>{crisisText}</p>
            </div>
          </article>
        </main>
        <aside className="config-side">
          <article className="card playground-card">
            <div className="config-card__heading">
              <div>
                <Icon>science</Icon>
                <h2>{t.playground}</h2>
              </div>
              <Badge tone="success">
                <Icon>check_circle</Icon>
                {t.passed}
              </Badge>
            </div>
            <div className="playground-chat">
              {chat.map(([sender, message], index) => (
                <div
                  className={`playground-message is-${sender}`}
                  key={`${sender}-${index}`}
                >
                  {sender === "rara" && <span>R</span>}
                  <div>
                    <b>{sender === "rara" ? "Rara" : "User"}</b>
                    <p>{message}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="playground-input">
              <input
                disabled={!editable}
                value={testMessage}
                onChange={(event) => setTestMessage(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && sendTest()}
                placeholder={t.test}
              />
              <button
                disabled={!editable || !testMessage.trim()}
                onClick={sendTest}
              >
                <Icon>arrow_upward</Icon>
              </button>
            </div>
          </article>
          <article className="card versions-card">
            <div className="config-card__heading">
              <div>
                <Icon>history</Icon>
                <h2>{t.history}</h2>
              </div>
            </div>
            {[
              [
                "v12",
                "Live",
                "Dina",
                "2 Okt 2026",
                "Perbaikan respons empatik dan deteksi konteks.",
              ],
              [
                "v11",
                "Arsip",
                "Nadia",
                "18 Sep 2026",
                "Guardrail mediasi grup dan consent v2.1.",
              ],
              [
                "v10",
                "Arsip",
                "Dina",
                "4 Sep 2026",
                "Style mirroring Casual (Jaksel).",
              ],
            ].map((version, index) => (
              <div className="version-row" key={version[0]}>
                <div>
                  <strong>{version[0]}</strong>
                  <Badge tone={index === 0 ? "success" : "neutral"}>
                    {localizeStatus(language, version[1])}
                  </Badge>
                </div>
                <p>{version[4]}</p>
                <span>
                  {version[2]} · {version[3]}
                </span>
                {index > 0 && (
                  <Button
                    disabled={!editable}
                    onClick={() => setDialog("rollback")}
                  >
                    <Icon>restore</Icon>
                    {t.rollback}
                  </Button>
                )}
              </div>
            ))}
          </article>
        </aside>
      </div>
      {dialog && (
        <ConfigActionDialog
          action={dialog}
          language={language}
          onClose={() => setDialog(null)}
          onConfirm={confirmAction}
        />
      )}
      {toast && (
        <div className="toast">
          <Icon>check_circle</Icon>
          {toast}
        </div>
      )}
    </>
  );
}

export default RaraConfigPage;
