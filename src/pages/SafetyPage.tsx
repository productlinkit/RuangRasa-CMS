import { message } from "../locales";
import { usePersistentState } from "../hooks/usePersistentState";
import { useState } from "react";

import {
  CrisisProtocol,
  EscalateDialog,
  SessionReasonDialog,
  TranscriptModal,
} from "../components/dialogs";

import {
  AccessBanner,
  Badge,
  Button,
  Icon,
  PageTitle,
  localizeStatus,
} from "../components/ui";

import { initialSafetyFlags, sampleSessions } from "../data/mock/index";

import {
  Access,
  Language,
  Role,
  SafetyFlag,
  SafetyState,
  SessionData,
} from "../types/index";

export function SafetyPage({
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
  const [flags, setFlags] = usePersistentState(
    "ruangrasa.safety.flags",
    initialSafetyFlags,
  );
  const [tab, setTab] = useState<SafetyState>("baru");
  const [protocol, setProtocol] = useState(false);
  const [reviewFlag, setReviewFlag] = useState<SafetyFlag | null>(null);
  const [reasonOpen, setReasonOpen] = useState(false);
  const [transcript, setTranscript] = useState<{
    session: SessionData;
    reason: string;
  } | null>(null);
  const [escalating, setEscalating] = useState<SafetyFlag | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({
    "RR-48190": "",
    "RR-48151": "",
    "RR-48122": "",
  });
  const [toast, setToast] = useState("");
  const canReview = role === "Super Admin" || role === "Safety Reviewer";
  const tabs: ReadonlyArray<readonly [SafetyState, string]> = message(
    language,
    "pages.SafetyPage.001",
  );
  const visibleFlags = flags.filter((flag) => flag.status === tab);
  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  }
  function openReview(reason: string) {
    if (!reviewFlag) return;
    const sourceSession = sampleSessions.find(
      (session) => session.id === reviewFlag.id,
    );
    const session: SessionData = sourceSession ?? {
      id: reviewFlag.id,
      phone: "—",
      name: reviewFlag.name,
      context: reviewFlag.context,
      mode: reviewFlag.mode,
      language: reviewFlag.language,
      status:
        reviewFlag.severity === "Kritis"
          ? "Krisis"
          : reviewFlag.severity === "Tinggi"
            ? "Abuse"
            : "Selesai",
      duration: reviewFlag.duration,
    };
    onAudit("Buka isi chat", reviewFlag.id, reason);
    setTranscript({ session, reason });
    setReasonOpen(false);
    setFlags((current) =>
      current.map((flag) =>
        flag.id === reviewFlag.id && flag.status === "baru"
          ? { ...flag, status: "ditinjau" }
          : flag,
      ),
    );
  }
  if (protocol)
    return (
      <>
        <CrisisProtocol
          language={language}
          role={role}
          access={access}
          onBack={() => setProtocol(false)}
          onAudit={onAudit}
          onToast={showToast}
        />
        {toast && (
          <div className="toast">
            <Icon>check_circle</Icon>
            {toast}
          </div>
        )}
      </>
    );
  return (
    <>
      <AccessBanner role={role} language={language} access={access} />
      <section className="safety-heading">
        <div>
          <PageTitle
            eyebrow={message(language, "pages.SafetyPage.002")}
            title="Safety &"
            accent={message(language, "pages.SafetyPage.003")}
          />
          <p>{message(language, "pages.SafetyPage.004")}</p>
        </div>
        <Button onClick={() => setProtocol(true)}>
          <Icon>emergency_home</Icon>
          {message(language, "pages.SafetyPage.005")}
        </Button>
      </section>
      <div className="safety-tabs">
        {tabs.map(([value, label]) => (
          <button
            key={value}
            className={tab === value ? "is-active" : ""}
            onClick={() => setTab(value)}
          >
            {label}
            {value === "baru" && (
              <span>
                {flags.filter((flag) => flag.status === value).length}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="safety-queue">
        {visibleFlags.map((flag) => (
          <article
            className={`card safety-flag safety-flag--${flag.severity.toLowerCase()}`}
            key={flag.id}
          >
            <div className="severity-mark">
              <Icon>
                {flag.severity === "Kritis"
                  ? "emergency"
                  : flag.severity === "Tinggi"
                    ? "warning"
                    : "flag"}
              </Icon>
            </div>
            <div className="flag-content">
              <Badge
                tone={
                  flag.severity === "Kritis"
                    ? "danger"
                    : flag.severity === "Tinggi"
                      ? "warning"
                      : "neutral"
                }
              >
                {localizeStatus(language, flag.severity)}
              </Badge>
              <h2>{flag.title}</h2>
              <div className="flag-meta">
                <span>
                  {flag.id}
                  <small>{flag.sessionId}</small>
                </span>
                <i />
                {flag.name}
                <i />
                {flag.context}
                {flag.mode === "Group mediation" && (
                  <>
                    <i />
                    Group mediation
                  </>
                )}
                <i />
                {flag.time}
              </div>
              {canReview && access === "F" && (
                <div className="reviewer-note">
                  <Icon>edit_note</Icon>
                  <input
                    value={notes[flag.id]}
                    onChange={(event) =>
                      setNotes({ ...notes, [flag.id]: event.target.value })
                    }
                    placeholder={message(language, "pages.SafetyPage.006")}
                  />
                  <button
                    disabled={!notes[flag.id].trim()}
                    onClick={() => {
                      onAudit(
                        "Menyimpan catatan reviewer safety",
                        flag.id,
                        notes[flag.id],
                      );
                      showToast(message(language, "pages.SafetyPage.007"));
                    }}
                  >
                    {message(language, "pages.SafetyPage.008")}
                  </button>
                </div>
              )}
            </div>
            {canReview && access === "F" ? (
              <div className="flag-actions">
                <Button
                  onClick={() => {
                    setReviewFlag(flag);
                    setReasonOpen(true);
                  }}
                >
                  <Icon>visibility</Icon>
                  {message(language, "pages.SafetyPage.009")}
                </Button>
                <Button kind="primary" onClick={() => setEscalating(flag)}>
                  <Icon>north_east</Icon>
                  {message(language, "pages.SafetyPage.010")}
                </Button>
              </div>
            ) : (
              <div className="flag-locked">
                <Icon>lock</Icon>
                {message(language, "pages.SafetyPage.011")}
              </div>
            )}
          </article>
        ))}
        {visibleFlags.length === 0 && (
          <div className="card safety-empty">
            <Icon>inbox</Icon>
            <h2>{message(language, "pages.SafetyPage.012")}</h2>
            <p>{message(language, "pages.SafetyPage.013")}</p>
          </div>
        )}
      </div>
      <section className="safety-insights">
        <article className="card safety-stat">
          <div className="stat-icon">
            <Icon>north_east</Icon>
          </div>
          <div>
            <span>{message(language, "pages.SafetyPage.014")}</span>
            <strong>24</strong>
            <small>6,2% {message(language, "pages.SafetyPage.015")}</small>
          </div>
        </article>
        <article className="card safety-stat">
          <div className="stat-icon">
            <Icon>timer</Icon>
          </div>
          <div>
            <span>{message(language, "pages.SafetyPage.016")}</span>
            <strong>9 min</strong>
            <small>−2 min {message(language, "pages.SafetyPage.017")}</small>
          </div>
        </article>
        <article className="card trigger-card">
          <div className="dashboard-card__heading">
            <div>
              <h2>{message(language, "pages.SafetyPage.018")}</h2>
              <p>{message(language, "pages.SafetyPage.019")}</p>
            </div>
            <Icon>route</Icon>
          </div>
          <div>
            {[
              "ingin h•••ng",
              "nggak a•••n",
              "ancaman berulang",
              "bahasa merendahkan",
            ].map((item) => (
              <Badge key={item}>{item}</Badge>
            ))}
          </div>
        </article>
      </section>
      {reasonOpen && reviewFlag && (
        <SessionReasonDialog
          language={language}
          onClose={() => setReasonOpen(false)}
          onConfirm={openReview}
        />
      )}
      {escalating && (
        <EscalateDialog
          flag={escalating}
          language={language}
          onClose={() => setEscalating(null)}
          onConfirm={(reason) => {
            onAudit("Eskalasi flag safety", escalating.id, reason);
            setFlags((current) =>
              current.map((flag) =>
                flag.id === escalating.id
                  ? { ...flag, status: "dieskalasi" }
                  : flag,
              ),
            );
            setEscalating(null);
            setTab("dieskalasi");
            showToast(message(language, "pages.SafetyPage.020"));
          }}
        />
      )}
      {transcript && (
        <TranscriptModal
          session={transcript.session}
          reason={transcript.reason}
          language={language}
          role={role}
          onClose={() => {
            setTranscript(null);
            setReviewFlag(null);
            setTab("ditinjau");
          }}
          onAudit={onAudit}
          onToast={showToast}
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

export default SafetyPage;
