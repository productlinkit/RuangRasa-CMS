import { message } from "../../locales";
import { localized } from "../../i18n";
import { useState } from "react";
import { Badge, Button, Icon, localizeStatus } from "../ui";
import { transcriptData } from "../../data/mock/index";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { useEscape } from "../../hooks/useEscape";
import { Language, Role, SessionData } from "../../types/index";

export function TranscriptModal({
  session,
  reason,
  language,
  role,
  onClose,
  onAudit,
  onToast,
}: {
  session: SessionData;
  reason: string;
  language: Language;
  role: Role;
  onClose: () => void;
  onAudit: (action: string, object: string, reason: string) => void;
  onToast: (message: string) => void;
}) {
  const breakpoint = useBreakpoint();
  const [showIdentity, setShowIdentity] = useState(false);
  const [query, setQuery] = useState("");
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  const [mobileTab, setMobileTab] = useState<"chat" | "info">("chat");
  const [tabletInfo, setTabletInfo] = useState(false);
  useEscape(onClose);
  const messages = transcriptData[session.id] ?? [];
  const flagCount = messages.filter((message) => message.flag).length;
  const visible = messages.filter(
    (message) =>
      (!flaggedOnly || message.flag) &&
      (!query || message.text.toLowerCase().includes(query.toLowerCase())),
  );
  const admin = role === "Product/Ops" ? "Dina" : role;
  const safetyLevel =
    session.status === "Krisis"
      ? "Kritis"
      : session.status === "Abuse"
        ? "Tinggi"
        : "Tidak ada";
  function toggleIdentity() {
    const next = !showIdentity;
    setShowIdentity(next);
    if (next)
      onAudit("Menampilkan identitas dalam transkrip", session.id, reason);
  }
  return (
    <div
      className="transcript-backdrop"
      onCopy={(event) => event.preventDefault()}
    >
      <section
        className={`transcript-modal ${showIdentity ? "identity-visible" : ""}`}
        role="dialog"
        aria-modal="true"
      >
        <header className="transcript-header">
          <div>
            {breakpoint === "mobile" && (
              <button className="transcript-back" onClick={onClose}>
                <Icon>arrow_back</Icon>
              </button>
            )}
            <div>
              <div className="eyebrow">
                <span />
                {message(language, "components.dialogs.TranscriptModal.001")}
              </div>
              <div className="transcript-title">
                <h2>{session.id}</h2>
                <Badge>{session.mode}</Badge>
              </div>
            </div>
          </div>
          <div>
            <Button onClick={toggleIdentity}>
              <Icon>{showIdentity ? "visibility_off" : "badge"}</Icon>
              {localized(
                language,
                showIdentity ? "Sembunyikan identitas" : "Tampilkan identitas",
                showIdentity ? "Hide identity" : "Show identity",
              )}
            </Button>
            {breakpoint === "tablet" && (
              <Button onClick={() => setTabletInfo(!tabletInfo)}>
                <Icon>info</Icon>Info
              </Button>
            )}
            <Button kind="primary" onClick={onClose}>
              {message(language, "components.dialogs.TranscriptModal.002")}
            </Button>
          </div>
        </header>
        <div className="transcript-audit-strip">
          <span>
            <Icon>lock_open</Icon>
            {message(language, "components.dialogs.TranscriptModal.003")}{" "}
            <b>
              {admin} ({role})
            </b>{" "}
            · {message(language, "components.dialogs.TranscriptModal.004")}:{" "}
            {reason}
          </span>
          <strong>
            <Icon>history</Icon>
            {message(language, "components.dialogs.TranscriptModal.005")}
          </strong>
        </div>
        {breakpoint === "mobile" && (
          <div className="transcript-mobile-tabs">
            <button
              className={mobileTab === "chat" ? "is-active" : ""}
              onClick={() => setMobileTab("chat")}
            >
              Chat
            </button>
            <button
              className={mobileTab === "info" ? "is-active" : ""}
              onClick={() => setMobileTab("info")}
            >
              Info
            </button>
          </div>
        )}
        <div className="transcript-layout">
          <main
            className={`transcript-main ${breakpoint === "mobile" && mobileTab !== "chat" ? "is-mobile-hidden" : ""}`}
          >
            <div className="transcript-tools">
              <label>
                <Icon>search</Icon>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={message(
                    language,
                    "components.dialogs.TranscriptModal.006",
                  )}
                />
              </label>
              <button
                className={flaggedOnly ? "is-active" : ""}
                onClick={() => setFlaggedOnly(!flaggedOnly)}
              >
                <Icon>flag</Icon>
                {message(language, "components.dialogs.TranscriptModal.007")} (
                {flagCount})
              </button>
            </div>
            <div className="chat-area">
              <div className="chat-date">7 OKT 2026</div>
              <div className="watermark">
                {admin} · {session.id}
              </div>
              {visible.map((message, index) => {
                const senderClass =
                  message.sender === "Rara"
                    ? "rara"
                    : message.sender === "Pihak A"
                      ? "party-a"
                      : message.sender === "Pihak B"
                        ? "party-b"
                        : "user";
                const identity = showIdentity
                  ? session.name.split(" ")[0]
                  : "M•••";
                const text = showIdentity
                  ? message.text.replace("M•••", identity)
                  : message.text;
                const textParts = text.split(identity);
                return (
                  <div
                    className={`chat-message chat-message--${senderClass}`}
                    key={`${message.time}-${index}`}
                  >
                    <div className={message.flag ? "is-flagged" : ""}>
                      <span className="chat-sender">
                        {message.sender === "User"
                          ? showIdentity
                            ? session.name
                            : "M•••"
                          : message.sender}
                      </span>
                      {message.flag && (
                        <Badge tone="danger">
                          <Icon>flag</Icon>
                          {message.flag}
                        </Badge>
                      )}
                      <p>
                        {textParts.map((part, partIndex) => (
                          <span key={partIndex}>
                            {part}
                            {partIndex < textParts.length - 1 && (
                              <mark>{identity}</mark>
                            )}
                          </span>
                        ))}
                      </p>
                      <time>{message.time}</time>
                    </div>
                  </div>
                );
              })}
              {visible.length === 0 && (
                <div className="chat-empty">
                  {message(language, "components.dialogs.TranscriptModal.008")}
                </div>
              )}
            </div>
            <div className="copy-note">
              <Icon>content_copy_off</Icon>
              {message(language, "components.dialogs.TranscriptModal.009")}
            </div>
          </main>
          <aside
            className={`transcript-sidebar ${breakpoint === "mobile" && mobileTab !== "info" ? "is-mobile-hidden" : ""} ${breakpoint === "tablet" && !tabletInfo ? "is-tablet-hidden" : ""}`}
          >
            <div className="mobile-identity-action">
              <Button onClick={toggleIdentity}>
                <Icon>{showIdentity ? "visibility_off" : "badge"}</Icon>
                {localized(
                  language,
                  showIdentity
                    ? "Sembunyikan identitas"
                    : "Tampilkan identitas",
                  showIdentity ? "Hide identity" : "Show identity",
                )}
              </Button>
            </div>
            <section>
              <h3>
                {message(language, "components.dialogs.TranscriptModal.010")}
              </h3>
              <dl>
                <div>
                  <dt>
                    {message(
                      language,
                      "components.dialogs.TranscriptModal.011",
                    )}
                  </dt>
                  <dd>{session.context}</dd>
                </div>
                <div>
                  <dt>
                    {message(
                      language,
                      "components.dialogs.TranscriptModal.012",
                    )}
                  </dt>
                  <dd>{session.language}</dd>
                </div>
                <div>
                  <dt>
                    {message(
                      language,
                      "components.dialogs.TranscriptModal.013",
                    )}
                  </dt>
                  <dd>{session.duration}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{localizeStatus(language, session.status)}</dd>
                </div>
                <div>
                  <dt>
                    {message(
                      language,
                      "components.dialogs.TranscriptModal.014",
                    )}
                  </dt>
                  <dd>{messages.length}</dd>
                </div>
              </dl>
            </section>
            {session.mode === "Group mediation" && (
              <section>
                <h3>
                  {message(language, "components.dialogs.TranscriptModal.015")}
                </h3>
                <div className="participant-row">
                  <i className="party-a-dot" />
                  Pihak A<Badge tone="success">Consent</Badge>
                </div>
                <div className="participant-row">
                  <i className="party-b-dot" />
                  Pihak B<Badge tone="success">Consent</Badge>
                </div>
              </section>
            )}
            <section
              className={`safety-summary ${safetyLevel !== "Tidak ada" ? "has-risk" : ""}`}
            >
              <h3>
                {message(language, "components.dialogs.TranscriptModal.016")}
              </h3>
              <Badge tone={safetyLevel !== "Tidak ada" ? "danger" : "success"}>
                <Icon>
                  {safetyLevel !== "Tidak ada" ? "warning" : "check_circle"}
                </Icon>
                {localizeStatus(language, safetyLevel)}
              </Badge>
            </section>
            <section>
              <h3>
                {message(language, "components.dialogs.TranscriptModal.017")}
              </h3>
              <textarea
                value={reviewNote}
                onChange={(event) => setReviewNote(event.target.value)}
                placeholder={message(
                  language,
                  "components.dialogs.TranscriptModal.018",
                )}
              />
              <Button
                disabled={!reviewNote.trim()}
                onClick={() => {
                  onAudit("Menyimpan catatan reviewer", session.id, reviewNote);
                  setReviewNote("");
                  onToast(
                    message(language, "components.dialogs.TranscriptModal.019"),
                  );
                }}
              >
                {message(language, "components.dialogs.TranscriptModal.020")}
              </Button>
            </section>
          </aside>
        </div>
      </section>
    </div>
  );
}
