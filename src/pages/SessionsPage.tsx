import { message } from "../locales";
import { useState } from "react";

import {
  SessionDrawer,
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

import {
  RELATIONSHIP_CONTEXTS,
  copy,
  sampleSessions,
} from "../data/mock/index";

import { useEscape } from "../hooks/useEscape";

import { Access, Language, Role, SessionData } from "../types/index";

export function SessionsPage({
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
  const [search, setSearch] = useState("");
  const [context, setContext] = useState("");
  const [sessionLanguage, setSessionLanguage] = useState("");
  const [mode, setMode] = useState("");
  const [selected, setSelected] = useState<SessionData | null>(null);
  const [reasonOpen, setReasonOpen] = useState(false);
  const [transcriptReason, setTranscriptReason] = useState("");
  const [transcript, setTranscript] = useState<SessionData | null>(null);
  const [toast, setToast] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  useEscape(() => setFiltersOpen(false), filtersOpen);
  const filtered = sampleSessions.filter((session) => {
    const query = search.toLowerCase();
    return (
      (!query ||
        `${session.id} ${session.phone} ${session.name}`
          .toLowerCase()
          .includes(query)) &&
      (!context || session.context === context) &&
      (!sessionLanguage || session.language === sessionLanguage) &&
      (!mode || session.mode === mode)
    );
  });
  function openTranscript(reason: string) {
    if (!selected) return;
    onAudit("Buka isi chat", selected.id, reason);
    setTranscriptReason(reason);
    setTranscript(selected);
    setReasonOpen(false);
  }
  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  }
  return (
    <>
      <AccessBanner role={role} language={language} access={access} />
      <section className="sessions-heading">
        <div>
          <PageTitle
            eyebrow={message(language, "pages.SessionsPage.001")}
            title={message(language, "pages.SessionsPage.002")}
            accent={message(language, "pages.SessionsPage.003")}
          />
          <p>{message(language, "pages.SessionsPage.004")}</p>
        </div>
        <Badge>{copy[language].sample}</Badge>
      </section>
      <section className="card sessions-list-card">
        <div className="session-toolbar">
          <label className="user-search">
            <Icon>search</Icon>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={message(language, "pages.SessionsPage.005")}
            />
          </label>
          <button
            className="mobile-filter-button"
            onClick={() => setFiltersOpen(true)}
          >
            <Icon>filter_list</Icon>
            {message(language, "pages.SessionsPage.006")}
          </button>
          {[
            [
              message(language, "pages.SessionsPage.007"),
              context,
              setContext,
              RELATIONSHIP_CONTEXTS,
            ],
            [
              message(language, "pages.SessionsPage.008"),
              sessionLanguage,
              setSessionLanguage,
              ["Bahasa Indonesia", "Jaksel mix", "English"],
            ],
            ["Mode", mode, setMode, ["1-on-1", "Group mediation"]],
          ].map(([label, value, setter, options]) => (
            <label className="filter-pill" key={label as string}>
              <select
                value={value as string}
                onChange={(event) =>
                  (setter as (value: string) => void)(event.target.value)
                }
              >
                <option value="">{label as string}</option>
                {(options as readonly string[]).map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <Icon>expand_more</Icon>
            </label>
          ))}
        </div>
        <div className="users-info">
          <Icon>visibility_off</Icon>
          <span>{message(language, "pages.SessionsPage.009")}</span>
        </div>
        <div className="table-wrap responsive-table-desktop">
          <table className="sessions-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{message(language, "pages.SessionsPage.010")}</th>
                <th>{message(language, "pages.SessionsPage.011")}</th>
                <th>{message(language, "pages.SessionsPage.012")}</th>
                <th>MODE</th>
                <th>{message(language, "pages.SessionsPage.013")}</th>
                <th>STATUS</th>
                <th>{message(language, "pages.SessionsPage.014")}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((session) => (
                <tr key={session.id} onClick={() => setSelected(session)}>
                  <td>
                    <strong>{session.id}</strong>
                  </td>
                  <td>{session.phone}</td>
                  <td>
                    <b>{session.name}</b>
                  </td>
                  <td>{session.context}</td>
                  <td>
                    <Badge>{session.mode}</Badge>
                  </td>
                  <td>{session.language}</td>
                  <td>
                    <Badge
                      tone={
                        session.status === "Krisis"
                          ? "danger"
                          : session.status === "Abuse"
                            ? "warning"
                            : session.status === "Aktif"
                              ? "whatsapp"
                              : "neutral"
                      }
                    >
                      {session.status === "Krisis" ||
                      session.status === "Abuse" ? (
                        <>
                          <Icon>flag</Icon>Flag ·{" "}
                          {localizeStatus(language, session.status)}
                        </>
                      ) : (
                        localizeStatus(language, session.status)
                      )}
                    </Badge>
                  </td>
                  <td>
                    <strong>{session.duration}</strong>
                  </td>
                  <td>
                    <Icon>chevron_right</Icon>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state">
              <Icon>search_off</Icon>
              {message(language, "pages.SessionsPage.015")}
            </div>
          )}
        </div>
        <div className="mobile-card-list">
          {filtered.map((session) => (
            <button
              className="mobile-data-card"
              key={session.id}
              onClick={() => setSelected(session)}
            >
              <div className="mobile-card-top">
                <span>{session.id}</span>
                <span>{session.duration}</span>
              </div>
              <div className="mobile-card-title">
                <span>{session.name.charAt(0)}</span>
                <strong>{session.name}</strong>
              </div>
              <div className="mobile-card-badges">
                <Badge>{session.mode}</Badge>
                <Badge
                  tone={
                    session.status === "Krisis"
                      ? "danger"
                      : session.status === "Abuse"
                        ? "warning"
                        : session.status === "Aktif"
                          ? "whatsapp"
                          : "neutral"
                  }
                >
                  {session.status === "Krisis" || session.status === "Abuse"
                    ? `Flag · ${localizeStatus(language, session.status)}`
                    : localizeStatus(language, session.status)}
                </Badge>
              </div>
              <dl>
                <div>
                  <dt>WhatsApp</dt>
                  <dd>{session.phone}</dd>
                </div>
                <div>
                  <dt>{message(language, "pages.SessionsPage.016")}</dt>
                  <dd>{session.context}</dd>
                </div>
              </dl>
            </button>
          ))}
        </div>
      </section>
      {filtersOpen && (
        <div
          className="bottom-sheet-backdrop"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setFiltersOpen(false)
          }
        >
          <section className="filter-sheet">
            <div className="sheet-handle" />
            <div className="sheet-heading">
              <h2>{message(language, "pages.SessionsPage.017")}</h2>
              <button onClick={() => setFiltersOpen(false)}>
                <Icon>close</Icon>
              </button>
            </div>
            {[
              [
                message(language, "pages.SessionsPage.018"),
                context,
                setContext,
                RELATIONSHIP_CONTEXTS,
              ],
              [
                message(language, "pages.SessionsPage.019"),
                sessionLanguage,
                setSessionLanguage,
                ["Bahasa Indonesia", "Jaksel mix", "English"],
              ],
              ["Mode", mode, setMode, ["1-on-1", "Group mediation"]],
            ].map(([label, value, setter, options]) => (
              <label className="sheet-select" key={label as string}>
                <span>{label as string}</span>
                <select
                  value={value as string}
                  onChange={(event) =>
                    (setter as (value: string) => void)(event.target.value)
                  }
                >
                  <option value="">—</option>
                  {(options as readonly string[]).map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            ))}
            <Button kind="primary" onClick={() => setFiltersOpen(false)}>
              {message(language, "pages.SessionsPage.020")}
            </Button>
          </section>
        </div>
      )}
      {selected && !transcript && (
        <SessionDrawer
          session={selected}
          language={language}
          role={role}
          onClose={() => setSelected(null)}
          onOpen={() => setReasonOpen(true)}
        />
      )}
      {reasonOpen && (
        <SessionReasonDialog
          language={language}
          onClose={() => setReasonOpen(false)}
          onConfirm={openTranscript}
        />
      )}
      {transcript && (
        <TranscriptModal
          session={transcript}
          reason={transcriptReason}
          language={language}
          role={role}
          onClose={() => {
            setTranscript(null);
            setSelected(null);
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

export default SessionsPage;
